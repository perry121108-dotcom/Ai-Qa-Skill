# AI QA Skill

> 一套讓 AI Coding Agent 扮演「QA 測試人員」的文件規則包。
> 適用於 Claude Code、Codex、Cursor、GitHub Copilot CLI、Gemini CLI 等任何能讀檔的 AI Agent。

---

## 一、這是什麼？

**AI QA Skill** 不是 Web App、也不是 CLI 工具，而是一份**可被任何 AI Agent 直接讀取執行的 QA 測試工作規則包**。

當你把這份 Skill 放進專案後，AI Agent 讀取後會：

1. 把自己當成 **AI QA 測試人員**（不是開發者）
2. 閱讀你的專案結構與文件
3. 自動產生測試案例
4. 執行可行的測試指令（build / lint / test / Web 流程）
5. 把結果整理成 9 份 **繁體中文** 測試報告，輸出到 `/qa-reports/`
6. 不會偷偷改你的程式碼

最終形成一個閉環流程：

```text
AI QA 測試 → 產生報告 → AI Dev 修正 → AI QA 再測試
```

---

## 二、為什麼需要這個 Skill？

| 痛點 | AI QA Skill 解法 |
|---|---|
| AI 寫完程式就說「done」，從沒測過 | 強制 AI 在修正前先進入 QA 角色、執行測試 |
| AI 給的報告只有一句話、零散表格、或全英文 | 規範必須產出繁體中文、段落流暢、表格整齊的報告 |
| AI 會把「沒測試」誤判為「Pass」 | 明確規範狀態：Pass / Fail / Blocked / Not Run |
| AI 找到 Bug 卻沒重現步驟 | Bug Report 模板強制要求重現步驟、預期 vs 實際結果 |
| AI 沒考慮邊界、異常、空狀態 | 測試案例必須涵蓋正向、反向、邊界、異常、UI、相容性 |
| AI 偷偷把功能改掉 | 規則明確禁止未經允許修改正式程式碼 |
| 多次協作後 AI 忘記過去的產品決策 | 強制產出 `decision-log.md` 留下決策紀錄 |

---

## 三、目錄結構

```text
your-project/
├── skills/
│   └── ai-qa-skill/                     ← Skill 文件包（16 份）
│       ├── README.md                    Skill 總說明
│       ├── QA_AGENT_ROLE.md             AI QA 角色定位（含 Severity / Priority 定義）
│       ├── QA_TESTING_SOP.md            測試 SOP（含技術棧判斷、Node.js / Python 支援）
│       ├── WEB_QA_RULES.md              Web 測試規則
│       ├── CLI_QA_RULES.md              CLI 測試規則
│       ├── OUTPUT_RULES.md              輸出規則（含截圖命名規範）
│       ├── PROJECT_UNDERSTANDING_TEMPLATE.md  專案理解模板
│       ├── FUNCTION_MAP_TEMPLATE.md     功能地圖模板
│       ├── TEST_CASE_TEMPLATE.md        測試案例模板
│       ├── QA_REPORT_TEMPLATE.md        QA 測試報告模板（中文）
│       ├── BUG_REPORT_TEMPLATE.md       Bug Report 模板
│       ├── COVERAGE_SUMMARY_TEMPLATE.md 測試覆蓋摘要模板
│       ├── DECISION_LOG_TEMPLATE.md     決策紀錄模板
│       ├── EVIDENCE_LOG_TEMPLATE.md     測試證據紀錄模板
│       ├── RETEST_REPORT_TEMPLATE.md    再測報告模板
│       └── AI_AGENT_EXECUTION_PROMPT.md ← 直接複製貼給 AI 用的執行指令
│
├── qa-reports/                          ← AI 產出的測試報告會放這
│   └── .gitkeep
│
└── screenshots/                         ← AI 產出的測試截圖會放這
    └── .gitkeep
```

---

## 四、5 分鐘快速開始

### Step 1 — 把 Skill 複製到你的專案

```bash
# 方法 A：把整個 repo clone 下來，再把 skills/ 複製到你的專案
git clone https://github.com/perry121108-dotcom/Ai-Qa-Skill.git
cp -r Ai-Qa-Skill/skills your-project/
cp -r Ai-Qa-Skill/qa-reports your-project/
cp -r Ai-Qa-Skill/screenshots your-project/

# 方法 B：在 PowerShell 上
git clone https://github.com/perry121108-dotcom/Ai-Qa-Skill.git
Copy-Item -Recurse Ai-Qa-Skill\skills your-project\
Copy-Item -Recurse Ai-Qa-Skill\qa-reports your-project\
Copy-Item -Recurse Ai-Qa-Skill\screenshots your-project\
```

### Step 2 — 開啟你的 AI Coding Agent

任選一個：Claude Code、Codex、Cursor、GitHub Copilot CLI、Gemini CLI。

### Step 3 — 把以下指令貼給 AI

> 完整可貼版本在 [`skills/ai-qa-skill/AI_AGENT_EXECUTION_PROMPT.md`](skills/ai-qa-skill/AI_AGENT_EXECUTION_PROMPT.md)
> 最短版本如下：

```text
請依照 /skills/ai-qa-skill/ 的規則執行本專案 QA 測試。
你現在的角色是 AI QA 測試人員，不是開發者。
除非我明確要求，否則不得修改正式程式碼。

請依序產出 /qa-reports/ 內的：
1. project-understanding.md
2. function-map.md
3. test-cases.md
4. evidence-log.md
5. bug-report.md
6. coverage-summary.md
7. qa-report.md（繁體中文，段落流暢）
8. decision-log.md
最後給我修正優先順序，但不要直接改程式碼。
```

### Step 4 — 等 AI 跑完，檢視 `/qa-reports/`

AI 會在 `/qa-reports/` 內產出整套報告，所有截圖在 `/screenshots/`。

### Step 5 — 修正循環

當你準備好讓 AI 修 Bug 時，再貼：

```text
請依照 /qa-reports/bug-report.md 與 /qa-reports/qa-report.md 修正本專案。
優先處理 Critical / Major 問題。
修正完成後請產出 /qa-reports/retest-report.md。
```

---

## 五、AI 會產出哪些檔案？

執行完整流程後，`/qa-reports/` 內會有 9 份檔案：

| # | 檔案 | 內容 | 語言 |
|---:|---|---|---|
| 1 | `project-understanding.md` | AI 對專案的理解：用途、技術棧、可測範圍 | 繁中 |
| 2 | `function-map.md` | 功能地圖：模組、頁面、API、相依關係、高風險功能 | 繁中 |
| 3 | `test-cases.md` | 測試案例：正向 / 反向 / 邊界 / 異常 / UI / 相容性 | 繁中 |
| 4 | `evidence-log.md` | 測試證據：指令執行紀錄、頁面操作紀錄、錯誤訊息（含時間戳記） | 繁中 |
| 5 | `bug-report.md` | Bug 清單：含 Severity、Priority、重現步驟、截圖 | 繁中 |
| 6 | `coverage-summary.md` | 覆蓋率摘要：通過率、漏測提醒 | 繁中 |
| 7 | `qa-report.md` | **主測試報告**：含結果摘要、阻塞項目、修正優先順序 | 繁中 |
| 8 | `decision-log.md` | 決策紀錄：留住「為什麼這樣決定」 | 繁中 |
| 9 | `retest-report.md` | 再測報告（條件性，修 Bug 後才產出） | 繁中 |

---

## 六、核心規則摘要

### AI QA 必須遵守

```text
1. 不得未經允許修改正式功能程式碼
2. 不得自行刪除功能、改動商業邏輯
3. 不得把推測當作事實
4. 不得隱藏測試失敗
5. 不得只輸出簡短結論
6. 不得只輸出英文報告
7. 不得跳過 Bug 重現步驟
8. 不得把無法測試誤判為 Pass
9. 不得忽略過去的產品決策
```

### 測試狀態定義

| 狀態 | 定義 |
|---|---|
| Pass | 測試通過，實際結果符合預期 |
| Fail | 測試失敗，實際結果不符合預期 |
| Blocked | 因環境、資料、權限或前置問題導致無法測試 |
| Not Run | 尚未執行該測試 |
| Retest | 修復後需要重新測試 |
| Closed | 已確認修復並結案 |

### Bug 嚴重程度（Severity）

| 嚴重程度 | 定義 |
|---|---|
| Critical | 核心功能完全無法使用，或造成資料遺失、系統崩潰 |
| Major | 主要功能受影響但有替代方式，或次要功能完全失效 |
| Minor | 功能仍可使用，但有明顯錯誤或不符預期的行為 |
| Trivial | 不影響功能，純粹為視覺或文字問題 |

### Bug 優先級（Priority）

| 優先級 | 建議處理時機 |
|---|---|
| High | 本次修正週期內必須完成 |
| Medium | 下一輪測試前完成 |
| Low | 有空時處理 |

> 嚴重程度由「問題本身的影響範圍」決定；優先級由「業務需求與修正成本」決定。兩者可以不同。

---

## 七、技術棧支援

AI QA 會根據專案內容自動判斷技術棧並選擇對應指令集：

| 判斷依據 | 技術棧 |
|---|---|
| 存在 `package.json` | Node.js（依 lockfile 選 npm / pnpm / yarn） |
| 存在 `requirements.txt` / `pyproject.toml` / `setup.py` | Python（venv + pip + pytest） |
| 同時存在兩者 | 全端專案，依序執行 |
| 兩者皆不存在 | 標記為「技術棧不明」 |

詳細指令見 [`skills/ai-qa-skill/QA_TESTING_SOP.md`](skills/ai-qa-skill/QA_TESTING_SOP.md) 與 [`skills/ai-qa-skill/CLI_QA_RULES.md`](skills/ai-qa-skill/CLI_QA_RULES.md)。

---

## 八、實際使用情境

### 情境 A：找工作的新手 QA

放進個人練習專案 → 跑完 Skill → 把 `/qa-reports/` 整套放進 GitHub / Notion 作品集。

### 情境 B：個人開發者 / Indie Hacker

寫完 MVP 後，丟給 AI 跑一輪 QA → 拿到 Bug 清單 → 再讓 AI 自動修。

### 情境 C：小型團隊

PR 前用 AI 跑一次 QA，把 `qa-report.md` 貼進 PR description，省下 Code Review 看 bug 的時間。

### 情境 D：AI Coding Agent 工作流

在 Claude Code / Cursor 的工作流加一道「先讀 ai-qa-skill 再寫程式」的指令，AI 開發前會先測試。

---

## 九、適用對象

| 你是 | 你會用到的 |
|---|---|
| 新手 QA / QA 求職者 | 拿來練手、做作品集 |
| 個人開發者 | 補上沒人幫你測的測試環節 |
| 小型團隊 | PR 前的自動 QA 第一道 |
| AI Agent 使用者（Claude Code、Codex、Cursor、Copilot、Gemini） | 給 AI 一個明確的 QA 角色與規則 |
| CI/CD | 把 AI QA 接進流程 |

---

## 十、檔案間的關係

```text
你貼指令給 AI
        │
        ▼
[AI_AGENT_EXECUTION_PROMPT.md]
        │
        ├──► 讀 [QA_AGENT_ROLE.md] ─────► 知道自己是 QA 測試人員
        ├──► 讀 [QA_TESTING_SOP.md] ────► 知道完整流程
        ├──► 讀 [WEB_QA_RULES.md] ──────► Web 專案測什麼
        ├──► 讀 [CLI_QA_RULES.md] ──────► CLI 專案測什麼
        ├──► 讀 [OUTPUT_RULES.md] ──────► 怎麼命名、放哪
        │
        ▼ 開始執行
        │
        ├──► 用 [PROJECT_UNDERSTANDING_TEMPLATE.md] 寫 → project-understanding.md
        ├──► 用 [FUNCTION_MAP_TEMPLATE.md] 寫 ────────► function-map.md
        ├──► 用 [TEST_CASE_TEMPLATE.md] 寫 ───────────► test-cases.md
        ├──► 用 [EVIDENCE_LOG_TEMPLATE.md] 寫 ────────► evidence-log.md
        ├──► 用 [BUG_REPORT_TEMPLATE.md] 寫 ──────────► bug-report.md
        ├──► 用 [COVERAGE_SUMMARY_TEMPLATE.md] 寫 ────► coverage-summary.md
        ├──► 用 [QA_REPORT_TEMPLATE.md] 寫 ───────────► qa-report.md
        ├──► 用 [DECISION_LOG_TEMPLATE.md] 寫 ────────► decision-log.md
        └──► 用 [RETEST_REPORT_TEMPLATE.md] 寫 ───────► retest-report.md（再測時）
```

---

## 十一、FAQ

**Q1：這需要付費嗎？**
不需要。這只是一組 Markdown 文件，授權為 MIT。

**Q2：可以改內容嗎？**
可以。fork 走自己改，特別是 `DECISION_LOG_TEMPLATE.md` 一定要替換成你專案自己的決策。

**Q3：AI 一定會照做嗎？**
規則寫得很明確，但實際遵守度取決於 AI 模型能力。Claude 4.x / GPT-5 / Gemini 2.x 等較新模型通常遵守度高。

**Q4：可以同時用在 Web 和 CLI 專案嗎？**
可以。Skill 內同時涵蓋 `WEB_QA_RULES.md` 與 `CLI_QA_RULES.md`，AI 會根據技術棧判斷使用哪個。

**Q5：報告必須是繁體中文嗎？**
是。這是 Skill 的硬性規定。若你想要英文版，請自行修改 `OUTPUT_RULES.md` 與所有 `*_TEMPLATE.md`。

**Q6：Skill 會自己升級嗎？**
不會。本 repo 採用版本化方式更新，請 watch 本 repo 取得更新通知。

---

## 十二、貢獻

歡迎以下類型的 PR：

- 新增其他語言版本（英文、日文、簡中）
- 補上特定框架的測試指令（Django、Rails、Spring Boot...）
- 補上特定 AI Agent 的使用範例
- 修正錯字、優化排版

請不要在沒有討論的情況下大改 `*_TEMPLATE.md` 的結構，因為這會影響已經在用的人。

---

## 十三、授權

MIT License — 自由使用、修改、商用、再散布。

---

## 十四、相關連結

- GitHub: <https://github.com/perry121108-dotcom/Ai-Qa-Skill>
- 完整規格原稿: [`ai_qa_skill_完整整合版.md`](ai_qa_skill_完整整合版.md)
- 給 AI 用的執行指令: [`skills/ai-qa-skill/AI_AGENT_EXECUTION_PROMPT.md`](skills/ai-qa-skill/AI_AGENT_EXECUTION_PROMPT.md)
