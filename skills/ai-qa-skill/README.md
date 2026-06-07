# AI QA Skill — SDET 自動化測試與 LLM 評估技能庫

> 給 AI CLI / AI Coding Agent 使用的「測試自動化架構師（SDET）」核心技能庫。
> 讀取後 AI 不再只寫散文式報告，而是**產出可執行的測試程式碼 + LLM 輸出評估（Eval）+ 常駐回歸測試集**，並以真實終端機證據作為唯一完成標準。

---

## 入口

**[`SKILL.md`](SKILL.md) 是本技能庫的入口**，內含角色定位、精簡七步流程、三維度 LLM Evaluation、Red→Green 回歸鐵律與完成門檻。AI Coding Agent 會優先讀取它，再依需要載入下方參考文件。

> 細節不在此 README 重述，避免重複。需要完整內容請讀對應檔案。

---

## 一、核心轉變

| 舊版（manual QA） | 新版（SDET 自動化） |
|---|---|
| 產出 9 份文字報告 | 產出**可執行測試檔**（Vitest / Pytest） |
| 「填完模板」即完成 | **測試實際通過並附證據**才算完成 |
| Bug 修了寫報告 | Bug 修正須留**永久回歸測試**（Red → Green） |
| 不驗 AI 輸出 | 強制**三維度 LLM Evaluation** |

---

## 二、適用對象

| 對象 | 用途 |
|---|---|
| Codex / Claude Code / Cursor | 讀取專案、撰寫並執行自動化測試 |
| GitHub Copilot CLI / Gemini CLI | 執行測試套件、依結果協助修正 |
| 開發者 | 將測試結果與 `qa-summary.md` 交給 AI 工具修正 |

---

## 三、技能庫文件結構

| 檔案 | 內容 | 角色 |
|------|------|------|
| **`SKILL.md`** | **入口**：角色 + 七步 + LLM eval + 回歸 + 門檻 | 一定讀 |
| `QA_AGENT_ROLE.md` | SDET 角色、禁止事項、Severity / Priority / Status 定義 | 參考 |
| `QA_TESTING_SOP.md` | 技術棧→框架對照、測試生成鐵律、回歸、LLM 評估細節、執行指令 | 參考 |
| `WEB_QA_RULES.md` | Web App / 網站 / 後台測試範圍 | 參考 |
| `API_QA_RULES.md` | REST/GraphQL/RPC 後端可執行 API 測試範例 | 參考 |
| `ACCESSIBILITY_QA_RULES.md` | axe-core / WCAG 可執行無障礙測試 | 參考 |
| `LLM_ATTACK_CORPUS.md` + `corpus/` | 內建攻擊語料庫（注入/越獄/幻覺，依 OWASP 分類）+ 載入範例 | 參考 |
| `SCHEMA_DRIFT_QA_RULES.md` | AI 輸出契約漂移偵測（golden 簽章 + CI 比對） | 參考 |
| `CLI_QA_RULES.md` | AI CLI 驅動測試流程、技術棧判斷與指令集 | 參考 |
| `OUTPUT_RULES.md` | 報告輸出位置、截圖命名規範 | 參考 |
| `AI_AGENT_EXECUTION_PROMPT.md` | 貼給其他 AI Coding Agent 的執行/修正指令 | 選用 |
| `REQUIREMENTS_TEMPLATE.md` | 需求文件範本（含驗收條件、REQ-XXX 追溯編號） | 選用 |
| `TEST_PLAN_TEMPLATE.md` | 測試計畫範本（含進入/退出準則、RTM 追溯矩陣） | 選用 |
| `*_TEMPLATE.md` | 其餘報告模板（測試案例 / Bug / QA 報告等，非完成門檻） | 選用 |

---

## 核心原則

```text
可執行測試優先於文字報告 · 測試優先於修正 · 證據優先於猜測
無可執行測試不得宣告 Pass · 不得忽略 LLM 輸出驗證 · 不得隱藏失敗
```
