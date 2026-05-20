# 決策紀錄報告 — clothes AI QA 測試

## 一、文件目的

紀錄本次 QA 測試過程中作出的關鍵決策，避免下一輪 AI Agent 或人類開發者偏離測試意圖。

---

## 二、決策總覽

| 決策編號 | 決策主題 | 決策內容 | 目前狀態 |
|---|---|---|---|
| DEC-001 | 測試模式 | 採「pytest 完整套件實測 + 程式碼審查 + 模組載入測試」 | 已決定 |
| DEC-002 | 不執行 `python main.py` | 會觸發 Gemini 計費 + 真實 Telegram 推送 | 已決定 |
| DEC-003 | 執行專案內建 pytest | 不依賴外部資源，可離線跑完 | 已執行 |
| DEC-004 | `.env` 內容遮蔽 | 不在報告中揭露任何實際 API Key 值 | 已決定 |
| DEC-005 | `music_trends.py` 與 `media_layer/` 不深入 | 主流程未引用 + 音樂版權守則嚴格，避免誤讀 | 已決定 |
| DEC-006 | `ai_sop_toolkit/` 明確排除 | `.gitignore` 註明為獨立子專案 | 已決定 |
| DEC-007 | Bug 優先級判定 | 唯一 Major 為 API key 風險；其他多為文件 / 工程衛生 | 已決定 |
| DEC-008 | 報告語言 | 全部繁體中文 | 已決定 |
| DEC-009 | 不修改程式碼 | 嚴格遵守 QA_AGENT_ROLE.md 第三節 | 已決定 |
| DEC-010 | retest-report.md 暫不產出 | 條件性輸出 — 無 Bug 修復行為 | 已決定 |
| DEC-011 | 與前一輪 WARDROBE AI 對照 | 在 coverage-summary 第七節加入對照表 | 已決定 |

---

## 三、詳細決策紀錄

### DEC-001：採「pytest 實測 + 程式碼審查 + 載入測試」三軌

**決策內容：**
本輪 QA 兼用三種測試手段：
1. 直接執行專案內建的 pytest 完整套件 → 取得真實結果
2. 對 5 個核心檔案進行程式碼審查 → 找出文件與實作落差、邊界 bug
3. 對 8 個模組執行 `python -m py_compile` + 對 4 個 layer 執行 `python -c "import ..."` → 驗證可載入性

**決策原因：**
- 此專案的 pytest 套件成熟（65 case，covers 4 layer），不跑等於浪費。
- 但 pytest 內全是 mock，無法驗證「真實 Gemini 回應」或「真實 Telegram」— 仍需審查程式碼補上靜態觀察。
- 載入測試是最便宜的 smoke test，能在不啟動主流程的情況下確認所有 import 鏈正常。

**影響範圍：**
- pytest 65/65 + 模組載入全 OK，使本輪 Pass 比例顯著高於 WARDROBE AI（80% vs 74.3%）。
- 文件 vs 實作落差只能由人工 / AI 程式碼審查發現，pytest 無法替代。

**目前狀態：**
已決定。下一輪在 sandbox 補上 `python main.py` 端到端後，覆蓋率將更完整。

---

### DEC-002：不執行 `python main.py`

**決策內容：**
完全不執行主程式入口。

**決策原因：**
- 會呼叫實際 Gemini API（**計費資源**，每次執行至少 1 次文字生成 + 2 次圖像生成 = 約 3-5 個 API call）。
- 會推送圖片至 `.env` 內 `TELEGRAM_CHAT_ID` 對應的真實使用者（可能為作者本人手機，但仍會干擾）。
- 寫入 `output/YYYY-MM-DD.lock`，影響當天能否再被人工執行。
- 即使 Lock 已存在會跳過，但仍會經過 Data Layer（OpenWeather + Vogue / Pinterest），對外發出真實請求。

**影響範圍：**
- 「真實端到端」標為 Not Run。
- 改用 pytest 內的 mock 測試替代「Gemini API 行為驗證」。

**目前狀態：**
已決定。下一輪若要補測，需建立隔離 sandbox（dummy keys + dummy chat）。

---

### DEC-003：直接執行專案 pytest

**決策內容：**
`python -m pytest --tb=short -q` 完整跑一次。

**決策原因：**
- 不依賴外部 API（測試全為 mock）。
- 不寫入專案永久狀態（pytest 是純讀 + tmp dir）。
- 可即刻獲得「README 第 140 行宣告 `65 passed` 是否屬實」的答案 — **驗證屬實**。
- pytest 9.0.3 已在系統，免裝。

**影響範圍：**
- TC-001 取得實機 Pass 證據。
- 整體報告可信度大幅提升。

**目前狀態：**
已執行。

---

### DEC-004：`.env` 內容遮蔽

**決策內容：**
本份報告及 evidence-log.md 中所有 API key、token、chat ID 均以 `<已遮蔽>` 取代。

**決策原因：**
報告檔案會被 commit 或分享，揭露密鑰即是 BUG-001 自我實現。

**影響範圍：**
- 所有 8 份 qa-reports 檔案皆可安全分享。
- 開發者個人本機 `.env` 仍未變動。

**目前狀態：**
已決定。

---

### DEC-005：`music_trends.py` 與 `media_layer/` 不深入

**決策內容：**
標為 Out of Scope，不進行程式碼審查、不設計測試案例。

**決策原因：**
- `main.py` 未引用 → 對主流程無實質影響。
- CLAUDE.md「音樂版權守則」第 1 條明示「絕對禁止使用版權音樂」，深入審查若誤判規則會帶來假性 Bug。
- 推測為 V1.0 短影音遺留代碼。

**影響範圍：**
- function-map.md 標示為「未引用」並建議下一輪確認去留。
- bug-report 未提這兩個區塊。

**目前狀態：**
已決定。建議下一輪由人類確認是否保留 / 移除。

---

### DEC-006：`ai_sop_toolkit/` 明確排除

**決策內容：**
完全不進入該子資料夾。

**決策原因：**
`.gitignore` 第 40 行明示「獨立子專案（有自己的 git）」。跨 repo 邊界的 QA 行為應該分開進行。

**影響範圍：**
不影響本次測試結果。

**目前狀態：**
已決定。

---

### DEC-007：Bug 優先級判定

**決策內容：**
- **Major（1）**：BUG-001 — `.env` 含 Gemini（計費）+ Telegram bot token；雖在 .gitignore 內，但 Gemini key 外洩會立即產生雲端帳單，且 bot 被冒名會影響使用者體驗。
- **Minor（3）**：BUG-002 / BUG-003 / BUG-004 都屬「文件 vs 實作落差」或 dead deps，會誤導後續開發者但不會造成事故。
- **Trivial（3）**：BUG-005 / BUG-006 / BUG-007 都屬「工程衛生」改善建議。

**決策原因：**
依 QA_AGENT_ROLE.md 第六 / 七節原則：
- Severity 由「問題本身的影響範圍」決定
- Priority 由「業務需求與修正成本」決定

**影響範圍：**
qa-report.md 第十四節對應 P0~P3 分桶。

**目前狀態：**
已決定。

---

### DEC-008：報告語言

**決策內容：**
所有 8 份輸出報告全部使用繁體中文。

**決策原因：**
- `skills/ai-qa-skill/OUTPUT_RULES.md` 第三節硬性規定。
- 專案原始文件（README 第 8 行、PROJECT_RULES.md、CLAUDE.md）大量使用中文。

**影響範圍：**
所有 `/qa-reports/` 內檔案。

**目前狀態：**
已決定。

---

### DEC-009：嚴格不修改程式碼

**決策內容：**
本次發現 7 個 Bug，但**完全不修改 `main.py`、`requirements.txt`、`PROJECT_RULES.md`、`telegram_bot.py` 等任一檔案**。所有建議以 code diff 呈現在 bug-report.md 中。

**決策原因：**
- `skills/ai-qa-skill/QA_AGENT_ROLE.md` 第三節明示「不得未經允許修改正式功能程式碼」。
- 使用者本次任務為「使用 QA Skill」，未要求修復。

**影響範圍：**
所有專案原始檔保持原狀，僅 `/qa-reports/` 與 `/screenshots/` 與 `/skills/ai-qa-skill/` 為新增。

**目前狀態：**
已決定。

---

### DEC-010：本輪不產出 retest-report.md

**決策內容：**
不產出 `qa-reports/retest-report.md`。

**決策原因：**
依 `OUTPUT_RULES.md` 第二節，retest-report.md 為「條件性輸出 — 僅在有 Bug 已修正並需再測時產出」。本輪為首次測試、無 Bug 修復行為，依規不產出。

**影響範圍：**
本輪輸出檔案數為 8 個 .md：
```text
project-understanding.md
function-map.md
test-cases.md
evidence-log.md
bug-report.md
coverage-summary.md
qa-report.md
decision-log.md
```

**目前狀態：**
已決定。

---

### DEC-011：與前一輪 WARDROBE AI 對照

**決策內容：**
在 `coverage-summary.md` 第七節加入兩個專案的對照表。

**決策原因：**
- Skill 在不同技術棧（Node.js vs Python）的表現差異是值得記錄的觀察。
- 對使用者而言，看到「同一份 Skill 在兩個專案的成果落差」更能理解 Skill 的能力邊界。

**影響範圍：**
coverage-summary.md 增 1 個表格。

**目前狀態：**
已決定。

---

## 四、Skill 自身的觀察（meta level）

本輪是 AI QA Skill 第二次實戰運行，相較於前一輪 WARDROBE AI 的觀察：

| 觀察項目 | 本輪表現 |
|---|---|
| Skill 對 Python 專案的支援 | **驗證成功** — `QA_TESTING_SOP.md` 第三節 Python 指令集（`pytest`、`pip`、`python -m py_compile`）皆可使用 |
| Skill 對 CI / CLI 工作流的適配 | **驗證成功** — `CLI_QA_RULES.md` 的指令紀錄規則直接可用 |
| Bug 嚴重程度區分 | 本輪 Major / Minor / Trivial 分佈合理（1 / 3 / 3），無誤判 |
| 條件性輸出規則 | retest-report.md 正確跳過 |
| 機密保護機制 | `<已遮蔽>` 規則持續適用，無洩漏 |

**Skill 已驗證的能力擴展**：
- 從 Node.js（WARDROBE AI）擴展到 Python（clothes AI）
- 從「靜態審查為主」擴展到「實際執行 pytest 取得真實數據」
- 從「無外部 API 依賴」擴展到「對計費 API（Gemini）的測試克制」

**Skill 尚未驗證的能力**：
- 修正階段（retest 流程）— 兩個專案皆未進入。
- E2E / UI 自動化測試 — 兩個專案皆 Blocked / Not Run。
- 跨 AI Agent 一致性（Codex / Cursor / Gemini）— 仍只有 Claude Opus 4.7 跑過。

---

## 五、新增決策（供後續使用）

| 決策編號 | 決策主題 | 決策內容 | 目前狀態 |
|---|---|---|---|
| DEC-012 | （待後續測試或修復時補上） |  |  |
