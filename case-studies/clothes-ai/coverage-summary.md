# 測試覆蓋摘要 — clothes AI

> 測試時間：2026-05-20
> 測試方式：pytest 完整套件實測（65/65 全過）+ 程式碼審查 + 8 個模組靜態語法檢查

## 一、測試統計

| 項目 | 數量 | 比例 |
|---|---:|---:|
| QA 測試案例總數 | 30 | 100% |
| 已通過（Pass） | 24 | 80.0% |
| 失敗（Fail） | 5 | 16.7% |
| 阻塞（Blocked） | 0 | 0% |
| 尚未測試（Not Run） | 1 | 3.3% |
| **通過率（Pass / 總數 × 100%）** | **24 / 30** | **80.0%** |

> 若僅計算「已實際執行」之案例（排除 Not Run）：24 / 29 = **82.8%**。

### 1.1 專案內建 pytest 套件結果

| 項目 | 數量 | 比例 |
|---|---:|---:|
| pytest 收集案例 | 65 | 100% |
| 通過 | **65** | **100%** |
| 失敗 | 0 | 0% |
| 執行時間 | 33.13 秒 | — |

✅ 與 README 第 140 行宣告 `65 passed` 完全一致。

---

## 二、已測功能

| 功能模組 | QA 案例數 | 結果 |
|---|---:|---|
| pytest 完整套件 | 1（TC-001） | Pass（65/65） |
| 各層 py_compile | 5（TC-002~006） | 5 Pass |
| 各層 import | 1（TC-007） | Pass |
| Brain Layer Schema | 4（TC-008~011） | 4 Pass |
| Data Layer / Weather | 4（TC-012~015） | 4 Pass |
| Delivery Layer / Telegram | 4（TC-016~019） | 4 Pass |
| 主流程 / 冪等性 | 2（TC-020~021） | 2 Pass |
| Render Layer | 2（TC-022~023） | 2 Pass |
| 環境 / git | 2（TC-024~025） | 1 Pass / 1 Fail |
| 文件一致性 | 2（TC-026~027） | 2 Fail |
| 工程慣例 | 2（TC-028~029） | 2 Fail |
| 時序邊界 | 1（TC-030） | Not Run |

---

## 三、尚未測試項目

| 測試編號 | 功能 | 優先級 | 建議 |
|---|---|---|---|
| TC-030 | 跨午夜 Lock 行為 | Low | 用 `freezegun` 或 mock datetime 模擬時序 |
| — | `python main.py` 端到端執行 | High | 在 dummy Telegram chat + 隔離 GCP 專案執行；避免動到實際資源 |
| — | Gemini API 升級回歸測試 | Medium | 當 google-genai SDK 升 minor / Gemini 模型升級時自動跑 |
| — | Playwright Chromium 升級回歸 | Low | playwright install 變動時驗證 PNG 仍能正常產出 |
| — | Telegram send_media_group rate limit | Low | 連續執行 N 次驗證 retry 是否生效 |
| — | 大 caption（>4096）行為 | Low | Telegram caption 上限 1024 已截斷；message 上限 4096 未測 |
| — | Schema：Gemini 回 1 組 / 3 組之拒絕 | Medium | brain_layer 雖已測「!= 2」但個別邊界值（0/1/3）未涵蓋 |
| — | weather.py 快取檔損毀 | Low | 已有 except 處理，但對應測試未明確覆蓋 |

---

## 四、高優先級漏測提醒

以下為 **High 優先級** 但仍為 Not Run / 未涵蓋之測試項目：

1. **`python main.py` 端到端執行** — 是本專案唯一的「真實用戶情境」，但會觸發計費 API。建議下一輪：
   - 設置一個 **單獨的 Gemini API key** 配額較低的 sandbox
   - 設置一個 **空白 Telegram bot + 自己的個人 chat** 作 sink
   - 跑一次完整流程確認所有層級協作
2. **修復 BUG-001（API key 輪換確認）後的回歸** — High Priority。

---

## 五、疑似測試範圍不足

以下功能本次無對應 QA 案例（雖然專案 pytest 可能已部分涵蓋）：

1. **`music_trends.py`（184 行）** — 既不在 main.py 流程內，也不在 tests/ 內 → 是否為遺留程式碼？
2. **`src/media_layer/`** — 目錄存在但內容不明，可能為 V1.0 短影音遺留結構。
3. **`outfit_photo_generator.py`（266 行，第二大模組）** — 雖在 render_layer pytest 內，但本次未深入審查程式碼，未對應到 QA 案例。
4. **`festivals.py`** — `get_today_festival(date)` 的「節慶資料表完整性」未測（例如端午節 / 中秋節是否在表內）。
5. **`trends.py`（RSS 抓取）** — RSS 源無回應 / 格式變更時的容錯。
6. **`outfit_photo_generator.py` 圖像 prompt 安全性** — Gemini 圖像生成的 prompt 注入風險（雖機率低）。

---

## 六、建議補測項目

下一輪 QA 建議以下列順序補測：

| 優先順序 | 項目 | 估時 |
|---:|---|---|
| 1 | 修復 BUG-002（main.py docstring）、BUG-003（PROJECT_RULES.md） — 純文件修正 | 30 分鐘 |
| 2 | 修復 BUG-001（檢查 git 歷史 + 必要時輪換 key） | 1 小時 |
| 3 | 設置 sandbox 環境（dummy Gemini + dummy Telegram）跑 `python main.py` 端到端 | 2 小時 |
| 4 | 補上 `music_trends.py` / `media_layer/` 的決議（保留或移除） | 30 分鐘 |
| 5 | 補上 lint（BUG-006）：ruff + CI 集成 | 1 小時 |
| 6 | 清理 dead deps（BUG-004）：edge-tts、ffmpeg-python | 30 分鐘 |
| 7 | 修復 BUG-005（filename 唯一性） + BUG-007（ExitStack） | 1 小時 |
| 8 | 跨午夜 Lock 行為時序測試（TC-030） | 1 小時 |
| 9 | Gemini SDK / 模型升級的回歸測試清單建立 | 2 小時 |

> 預估總工時：**約 10 小時**。完成後通過率預估可由 80% 提升至 95%+，並補上「真實端到端」的最大覆蓋缺口。

---

## 七、與 WARDROBE AI 對照（前一輪 QA）

| 維度 | WARDROBE AI | clothes AI |
|---|---|---|
| 專案類型 | Node.js + Express PWA | Python + asyncio CLI |
| pytest / npm test 結果 | 10 / 10（v3.4 引擎） | 65 / 65（pytest） |
| QA 通過率 | 74.3% | 80.0% |
| 識別 Bug 數 | 9 個（5 Major / 3 Minor / 1 Trivial） | 7 個（1 Major / 3 Minor / 3 Trivial） |
| 安全問題集中度 | 較多（rate limit / 資訊外洩 / IDOR 等 3 項 High） | 較少（僅 API key 留存 1 項） |
| 文件 / 規格落差 | CI vs .gitignore 矛盾 | docstring 與 PROJECT_RULES 嚴重落差 |
| pytest / 測試覆蓋成熟度 | 5 個 v3.4 驗收（聚焦推薦引擎） | 4 個 layer × 15-19 cases 完整 |

**結論**：clothes AI 的程式碼工程品質明顯高於 WARDROBE AI（測試覆蓋更廣、Severity 整體較低、無 runtime 缺陷）。主要待修問題為「文件一致性」與「`.env` 安全」。
