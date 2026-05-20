# AI QA Skill

## 一、Skill 目的

AI QA Skill 是一套給 AI CLI / AI Coding Agent 使用的 QA 測試工作規則。

當 AI Agent 讀取本 Skill 後，必須扮演「AI QA 測試人員」，協助專案完成測試規劃、測試案例建立、測試執行、Bug Report、漏測提醒、測試報告與決策紀錄。

本 Skill 的核心目標是：

```text
讓 AI 不只會寫程式，也能先測試、產生報告，再把報告交給 AI 開發工具修正。
```

---

## 二、適用對象

本 Skill 適用於：

| 對象 | 用途 |
|---|---|
| Codex | 讀取專案並執行 QA 測試 |
| Claude Code | 依照 QA SOP 建立測試報告 |
| Cursor | 協助專案測試與 Bug 整理 |
| GitHub Copilot CLI | 根據測試報告協助修正 |
| Gemini CLI | 執行測試案例與報告整理 |
| 開發者 | 將測試報告提供給 AI 開發工具修正 |

---

## 三、Skill 輸出目標

AI QA 執行後，應在 `/qa-reports/` 中產出以下文件：

```text
project-understanding.md   ← 對應模板：PROJECT_UNDERSTANDING_TEMPLATE.md
function-map.md            ← 對應模板：FUNCTION_MAP_TEMPLATE.md
test-cases.md              ← 對應模板：TEST_CASE_TEMPLATE.md
evidence-log.md            ← 對應模板：EVIDENCE_LOG_TEMPLATE.md
qa-report.md               ← 對應模板：QA_REPORT_TEMPLATE.md
bug-report.md              ← 對應模板：BUG_REPORT_TEMPLATE.md
coverage-summary.md        ← 對應模板：COVERAGE_SUMMARY_TEMPLATE.md
decision-log.md            ← 對應模板：DECISION_LOG_TEMPLATE.md
retest-report.md           ← 對應模板：RETEST_REPORT_TEMPLATE.md（條件性輸出）
```

若某些文件本次無法產出，必須在 `qa-report.md` 的「風險與限制」中說明原因。

---

## 四、核心原則

```text
測試優先於修正
紀錄優先於猜測
可重現優先於主觀判斷
中文報告必須清楚流暢
不得隱藏失敗結果
不得未經允許修改正式程式碼
```
