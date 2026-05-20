# QA 測試報告 — clothes AI

## 一、測試基本資訊

| 項目 | 內容 |
|---|---|
| 專案名稱 | clothes AI（每日 AI 穿搭圖片生成與 Telegram 自動交付） |
| 測試版本 | repo 工作目錄狀態（README 標示「Image-First Workflow」） |
| 測試日期 | 2026-05-20 |
| 測試人員 | AI QA 測試人員（依 `skills/ai-qa-skill/` 規則執行） |
| 測試環境 | Windows 11 Home 10.0.26200 / Python 3.12.10 / pytest 9.0.3 |
| 測試工具 | pytest、`python -m py_compile`、`python -c "import ..."`、程式碼審查、跨檔比對 |
| 測試範圍 | Python 後端工作流程式碼審查 + 完整 pytest 套件實測 + 模組可載入性驗證 + 設定檔審查 |

---

## 二、專案簡介

clothes AI 是一個每日自動執行的 AI 穿搭內容生成工作流，採 Python + asyncio 構築，分層為 Data Layer（天氣 / 趨勢 / 節慶）、Brain Layer（Gemini 生成 2 組配色 JSON）、Render Layer（Playwright + Jinja2 渲染色卡 PNG 與 Gemini 圖像穿搭照）、Delivery Layer（Telegram Bot 推送）。專案原為 V1.0 短影音生成（PROJECT_RULES.md 仍為此版規格），後因 video API 成本不可控 pivot 至「image-first」路線，是作者作品集的主展示項目之一，README 強調此為「end-to-end automation workflow」而非單一 prompt demo。整體採嚴謹的「冪等性 Lock」設計避免重複執行，已配置 GitHub Actions CI（Python 3.12 + pytest）。

---

## 三、測試目標

1. 驗證 README 第 140 行宣告的 `65 passed` 是否屬實。
2. 驗證各層模組可獨立載入、無語法錯誤。
3. 找出文件與實作的落差（特別是 main.py docstring 與 PROJECT_RULES.md）。
4. 找出 `.env` 與其他環境安全相關問題。
5. 整理 dead code / dead dependencies / 邊界 bug。
6. 產出可提供給 AI 開發工具或人類開發者直接修正的測試報告。

---

## 四、測試範圍

| 測試範圍 | 是否納入 | 備註 |
|---|---|---|
| 完整 pytest 套件 | 是 | **65/65 全過** |
| 各層 py_compile 靜態檢查 | 是 | 8 個檔案皆通過 |
| 各層 import 可載入性 | 是 | 4 個 layer 全部 import OK |
| `python main.py` 端到端 | **否** | 會呼叫實際 Gemini（計費）+ Telegram |
| 程式碼審查 | 是 | main.py / weather / outfit_generator / telegram_bot / renderer |
| 文件一致性審查 | 是 | README / docstring / PROJECT_RULES / CLAUDE / requirements |
| 設定一致性審查 | 是 | .env / .gitignore / .github/workflows/ci.yml |
| Web UI | 不適用 | 本專案無使用者介面 |
| Docker | 不適用 | README 標示為 Next Steps，未建置 |
| 跨午夜時序行為 | 否（Not Run） | 需 mock datetime |

---

## 五、測試方法

```text
1. 閱讀專案文件：README.md / PROJECT_RULES.md / CLAUDE.md / requirements.txt / .env.example / .gitignore
2. 程式碼審查：main.py / src/brain_layer/outfit_generator.py / src/data_layer/weather.py / src/delivery_layer/telegram_bot.py / src/render_layer/renderer.py
3. 設定檔審查：.github/workflows/ci.yml
4. pytest 完整套件實測：python -m pytest --tb=short -q（65 passed in 33.13s）
5. pytest 收集驗證：python -m pytest --collect-only -q（65 tests collected）
6. 語法檢查：python -m py_compile × 8 個模組
7. 可載入性驗證：python -c "from src.xxx import yyy" × 4 個 layer
8. 跨檔比對：docstring vs schema、README vs PROJECT_RULES、requirements vs 實際 import
```

未執行：`python main.py`、`pip install -r requirements.txt`（系統已安裝）、`playwright install chromium`（已安裝）、`ruff check .`（未配置）。

---

## 六、測試結果統計

| 狀態 | 數量 | 比例 |
|---|---:|---:|
| Pass | 24 | 80.0% |
| Fail | 5 | 16.7% |
| Blocked | 0 | 0% |
| Not Run | 1 | 3.3% |
| **總計** | **30** | **100%** |
| **通過率（Pass / 總計）** | — | **80.0%** |

> 排除 Not Run 之有效執行通過率：24 / 29 = **82.8%**。
> 專案內建 pytest：**65 / 65 = 100%**（執行時間 33.13 秒）。

---

## 七、測試結果摘要

clothes AI 在本次 QA 中展現出**明顯優於前一輪 WARDROBE AI 的工程品質**。最具決定性的證據是專案內建 pytest 完整套件實測 **65 / 65 全數通過**（33.13 秒），與 README 第 140 行宣告完全一致；4 個分層（data / brain / render / delivery）各自擁有 11~19 個測試函式，涵蓋 Schema 驗證、`#RGB → #RRGGBB` 自動修正、3 次重試、Timeout、分批傳送等關鍵情境，是少見地真正把「AI 自動化工作流」當軟體在開發的範例。8 個主要模組通過 `python -m py_compile` 靜態語法檢查、4 個 layer 皆可獨立 `import` 載入，主流程的「冪等性 Lock」設計合理（lock 在所有 API 成功後才寫入，中途失敗可重跑），Brain Layer 對 `API_KEY_INVALID` 與 `SchemaValidationError` 採「立即不重試」策略也有效避免了無謂的 Gemini API 重複扣費。

本次仍識別出 **7 個值得修正的問題**，但**整體性質從前一輪的「安全 / runtime 缺陷」轉為「文件一致性 / 工程衛生」**，無一屬 Critical 或會直接造成事故。**Major 等級僅 1 項**（BUG-001：`.env` 含實際 Gemini / Telegram 付費 API Key，需確認從未誤 commit；Gemini 為計費資源外洩會立即被濫用）；**Minor 3 項**為文件與實作落差（BUG-002 main.py docstring 寫「4 組 / 8 張」實際是「2 組 / 4 張」；BUG-003 PROJECT_RULES.md 仍為 V1.0 短影音規格，pivot 後未更新，違反自家 CLAUDE.md 第 1 條 Document-Driven 原則；BUG-004 requirements.txt 含 `edge-tts` / `ffmpeg-python` 等 pivot 後未引用的 dead dependencies）；**Trivial 3 項**為工程慣例改善建議（BUG-005 輸出檔名用 `g['id']` 無唯一性檢查；BUG-006 未配置 lint；BUG-007 telegram_bot success path 未用 try/finally 保障 file handle）。

本輪覆蓋的最大缺口是「**`python main.py` 端到端執行未驗證**」 — 這是本專案唯一的「真實使用者情境」，但會觸發 Gemini 計費與真實 Telegram 推送，本次刻意跳過。建議下一輪以「sandbox 環境（dummy Gemini key + dummy Telegram chat）」執行一次完整流程作為補強。整體而言，**專案品質已達到對外展示與作品集面試的水準**，需要修正的問題均屬「對齊文件與工程衛生」，不影響核心功能可靠性。

---

## 八、主要通過項目

| 測試編號 | 功能 | 測試結果 |
|---|---|---|
| TC-001 | pytest 完整套件（65 cases） | **Pass（實測 65/65）** |
| TC-002~006 | 8 個模組 py_compile | Pass × 5 |
| TC-007 | 4 個 layer import | Pass |
| TC-008~011 | Brain Layer Schema / hex / 重試 | Pass × 4 |
| TC-012~015 | Weather 快取 / 重試 / 永久錯誤 | Pass × 4 |
| TC-016~019 | Telegram 預檢 / 分批 / caption / 重試 | Pass × 4 |
| TC-020~021 | 主流程冪等性 Lock | Pass × 2 |
| TC-022~023 | Render Layer PNG 尺寸 / Jinja 殘留 | Pass × 2（pytest 已覆蓋） |
| TC-024 | `.env` 在 `.gitignore` | Pass |

---

## 九、主要失敗項目

| 測試編號 | 功能 | 問題摘要 | 嚴重程度 |
|---|---|---|---|
| TC-025 / BUG-001 | `.env` 本機留存 | 含 Gemini（計費）、Telegram Bot Token、OpenWeather Key | Major |
| TC-026 / BUG-002 | main.py docstring | 寫「4 組 / 8 張」但實作為「2 組 / 4 張」 | Minor |
| TC-027 / BUG-003 | PROJECT_RULES.md | 為 V1.0 短影音規格，未隨 pivot 更新 | Minor |
| — / BUG-004 | requirements.txt | edge-tts、ffmpeg-python 等 dead dependencies | Minor |
| TC-028 / BUG-005 | 輸出 filename | `g['id']` 無唯一性檢查，相同 id 會覆寫 | Trivial |
| TC-029 / BUG-006 | lint | 未配置 ruff / flake8 / pyproject lint 設定 | Trivial |
| — / BUG-007 | telegram_bot | success path 無 try/finally 保障 file handle | Trivial |

---

## 十、阻塞與未測項目

| 測試編號 | 功能 | 狀態 | 原因 |
|---|---|---|---|
| TC-030 | 跨午夜 Lock 行為 | Not Run | 需 mock datetime 時序測試 |
| — | `python main.py` 端到端 | Not Run | 會呼叫實際 Gemini（計費）+ Telegram 推送 |
| — | `music_trends.py` 與 `media_layer/` 範圍 | Not Run | 主流程未引用，標 Out of Scope |
| — | Docker 建置 | 不適用 | 專案無 Dockerfile |

---

## 十一、Bug 清單摘要

> 詳細內容見 [bug-report.md](bug-report.md)。

- **Major（1）**：BUG-001（API key 留存 + 計費風險）
- **Minor（3）**：BUG-002（main.py docstring）、BUG-003（PROJECT_RULES 過時）、BUG-004（dead deps）
- **Trivial（3）**：BUG-005（filename）、BUG-006（lint）、BUG-007（file handle）

最值得本週修正的兩項：
1. **BUG-001**（API key 安全）— 唯一具實質風險，且包含可能計費損失。
2. **BUG-002 + BUG-003**（文件與實作不一致）— 純文字修改、成本極低，但對後續貢獻者與 AI Agent 影響大。

---

## 十二、漏測提醒

```text
尚未測試項目：
- `python main.py` 端到端整合（最關鍵的真實情境）
- 跨午夜 Lock 行為（時序邊界）
- Gemini API / SDK 升級後的回歸
- `music_trends.py` / `media_layer/` 範圍決議

高優先級未測項目：
- python main.py 端到端 — High（需建 sandbox）

核心功能覆蓋不足項目：
- 真實 Gemini 回應 + 真實 Telegram 推送（pytest 全為 mock）

建議補測項目：
- 詳見 coverage-summary.md 第六節（共 9 項，預估 10 小時）
```

---

## 十三、風險與限制

```text
本次測試限制：
- 環境限制：未執行 `python main.py`，避免觸發 Gemini 計費 API（gemini-2.5-flash-lite 圖像生成）與真實 Telegram 推送。
- 沙箱缺失：未建立 sandbox（dummy Gemini key + dummy Telegram chat），無法在不付費的情況下做端到端驗證。
- 程式碼修改：本次嚴格遵守 AI QA Skill「不得未經允許修改正式程式碼」規則。
- 工具限制：專案未配置 lint，無法自動掃出 dead code 或風格問題（已記錄為 BUG-006）。
- 時序測試：跨午夜 Lock 行為需 mock datetime（如 freezegun），本次未進行。
- music_trends.py / media_layer/ 涉及音樂版權守則（CLAUDE.md 明示嚴格規範），本次未深入審查以避免誤讀規格。
- ai_sop_toolkit/ 為獨立 git 子專案，本次明確排除在 QA 範圍外。
```

---

## 十四、建議修正優先順序

| 優先順序 | 項目 | 對應 Bug | 原因 |
|---|---|---|---|
| **P0** | 檢查 git 歷史是否曾有 `.env`；必要時輪換 Gemini / Telegram / OpenWeather key | BUG-001 | 唯一具實質安全 + 計費風險的項目 |
| **P1** | 修 `main.py` docstring（4→2、8→4） | BUG-002 | 純文字修改，1 分鐘解決 |
| **P1** | 更新 `PROJECT_RULES.md` 至 V2.0 image-first 規格 | BUG-003 | 違反自家 Document-Driven 原則，影響後續貢獻者判斷 |
| **P2** | 清理 dead deps（edge-tts、ffmpeg-python） | BUG-004 | 減少 CI 安裝時間與套件供應鏈風險 |
| **P2** | 引入 ruff + CI lint step | BUG-006 | 長期程式碼品質 |
| **P2** | `main.py` filename 改用 enumerate index | BUG-005 | 預防 Gemini 邊界回應 |
| **P3** | telegram_bot 用 ExitStack 保障 file handle | BUG-007 | 純改善，非缺陷 |

> P0 一項建議於本週驗證；P1 兩項可於 30 分鐘內完成；P2 / P3 可排入下一個 sprint。

---

## 十五、測試結論

clothes AI 在本次 QA 中展現了**作品集級別以上的工程品質**：完整的 pytest 套件、清晰的四層分離架構、嚴謹的 Schema 驗證與重試機制、有意識的計費保護（API 驗證錯誤立即不重試）、合理的冪等性 Lock 設計。**本專案沒有任何 runtime 缺陷或 High 優先級安全漏洞**，與前一輪 WARDROBE AI 相比，明顯成熟一個量級。

主要待修問題集中在「文件 vs 實作」的對齊（pivot 後 PROJECT_RULES.md 未更新、main.py docstring 過時、requirements.txt 含 dead deps）— 這些對人類閱讀影響不大，但會誤導後續 AI Agent 在自動化開發時做出錯誤判斷，建議盡早補上。`.env` 的實際 API Key 留存則需要在「本機開發便利」與「外洩風險」間做安全 trade-off，至少需要驗證 git 歷史從未誤 commit。

**建議路徑**：
1. **本週**：驗證 BUG-001 的 git 歷史，必要時輪換 key；30 分鐘內順手修 BUG-002 / BUG-003 兩項文件。
2. **下週**：建立 sandbox 環境（dummy Gemini key + dummy Telegram chat）做一次 `python main.py` 端到端，產出 retest-report.md。
3. **下下週**：引入 ruff + 清理 dead deps + 補上 ExitStack + filename enumerate 修正。

預估在 2 週內可將通過率從 **80%** 提升至 **95%+**，並達成「100% 可信任作品集 demo」狀態。專案目前已具備對外展示資格，僅需處理 BUG-001 後即可放心進入面試 / 履歷 / 公開推廣階段。
