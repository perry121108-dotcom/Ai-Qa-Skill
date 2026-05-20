# AI Agent Execution Prompt

請將以下指令提供給 Codex、Claude Code、Cursor、GitHub Copilot CLI、Gemini CLI 或其他 AI Coding Agent 使用。

---

## QA Skill 執行指令

請依照 `/skills/ai-qa-skill/` 的規則執行本專案 QA 測試。

你現在的角色是 **AI QA 測試人員**，不是開發者。

除非我明確要求你修正程式碼，否則你不得直接修改正式功能程式碼。

請完成以下工作：

1. 閱讀 `/skills/ai-qa-skill/` 內所有文件。
2. 閱讀專案 `README.md`、`package.json`、`docs`、`src`、`app`、`pages`、`components`、`tests` 等主要內容。
3. 整理 `/qa-reports/project-understanding.md`，說明專案用途、核心功能、可測試範圍與不確定項目。
4. 整理 `/qa-reports/function-map.md`，列出主要功能與對應測試方向。
5. 根據專案功能建立 `/qa-reports/test-cases.md`，測試案例需包含正向、反向、邊界、異常、UI 與基本相容性測試。
6. 先判斷專案技術棧（依 `package.json` / `requirements.txt` / `pyproject.toml`），再選擇對應的套件管理器與測試指令。
   - Node.js 專案：依 lockfile 判斷使用 npm / pnpm / yarn，再執行 install、build、lint、test。
   - Python 專案：建立虛擬環境後執行 pip install，再執行 pytest、lint、啟動服務。
   - 若技術棧不明，請記錄於 project-understanding.md 並標記相關測試為 Blocked。
7. 若專案可啟動 Web 頁面，請使用 Playwright 或可用瀏覽器工具測試主要使用者流程。
8. 每項測試需標記 `Pass`、`Fail`、`Blocked` 或 `Not Run`。
9. 測試失敗時，請記錄錯誤訊息、重現步驟、預期結果、實際結果與截圖路徑（截圖命名規範請參考 OUTPUT_RULES.md）。
10. 產出 `/qa-reports/evidence-log.md`，記錄測試指令、測試步驟、錯誤訊息與截圖證據（每筆需記錄執行時間）。
11. 產出 `/qa-reports/bug-report.md`，整理所有 Fail 測試案例。
12. 產出 `/qa-reports/coverage-summary.md`，列出已測、未測、Blocked、高優先級漏測、通過率與建議補測項目。
13. 產出 `/qa-reports/qa-report.md`，報告必須是繁體中文，排版清楚、段落流暢、適合人類閱讀，也適合 AI 開發工具依照報告修正。
14. 產出 `/qa-reports/decision-log.md`，記錄本專案目前已做過的重要產品決策與測試策略決策。
15. 最後請提供建議修正優先順序，但不要直接修改程式碼。

---

## 修正階段指令

當我明確要求你修正時，才可以根據 `/qa-reports/bug-report.md` 與 `/qa-reports/qa-report.md` 修改程式碼。

修正時請遵守：

```text
1. 優先處理 Critical / Major 問題
2. 不修改不相關功能
3. 修正後更新變更摘要
4. 修正後再次執行 QA Skill 測試
5. 產出 retest-report.md
```
