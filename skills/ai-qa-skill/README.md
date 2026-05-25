# AI QA Skill

## 一、Skill 目的

AI QA Skill 是一套給 AI CLI / AI Coding Agent 使用的**自動化測試與 LLM 評估**工作規則。

當 AI Agent 讀取本 Skill 後，必須扮演 **測試自動化架構師（SDET）**，協助專案完成：技術棧辨識、撰寫可執行測試、實際跑測並出示證據、針對 LLM 呼叫點做輸出驗證，並為已修 Bug 累積回歸測試。

本 Skill 的核心目標是：

```text
讓 AI 不只會寫程式，還能產出「可執行的測試 + LLM 輸出驗證」，
實際跑過驗證、留下真實證據，再把結果交給 AI 開發工具修正。
```

> 核心轉變：QA 的產出**不是散文報告，而是可執行的測試程式碼**。文字報告降為輔助摘要，「填完模板」不等於「測試完成」。

---

## 二、適用對象

| 對象 | 用途 |
|---|---|
| Codex | 讀取專案、撰寫並執行自動化測試 |
| Claude Code | 依 QA SOP 建立可執行測試與 LLM eval |
| Cursor | 協助補測試、整理 Bug 與回歸 |
| GitHub Copilot CLI | 依測試結果協助修正 |
| Gemini CLI | 執行測試套件與靜態分析 |
| 開發者 | 將測試結果與 qa-summary 交給 AI 開發工具修正 |

---

## 三、核心交付物（皆須可執行）

QA 執行後的**主要產物是測試程式碼與真實證據**，而非文字報告：

```text
1. 可執行測試檔（Vitest / Jest → *.test.ts；Pytest → test_*.py；E2E → Playwright）
   每個功能涵蓋：正向 / 反向 / 邊界 / 異常
2. LLM 評估測試（專案含 LLM 呼叫時強制）：
   - JSON 結構強固性（schema 100% 契合、畸形/惡意輸入不崩潰）
   - Prompt 防越獄與安全（不洩漏 System Prompt、抗注入、機密不外洩）
   - 幻覺與誠信邊界（缺資料回 null/待確認，不臆造）
3. 回歸測試集（Regression Suite）：每個已修 Critical/Major Bug 對應 red → green 測試
4. 真實終端機執行證據（指令 + 輸出 + exit code + 覆蓋率）
```

**輔助（非完成門檻）**：`qa-summary.md` — 精簡結論、覆蓋缺口、修正優先序。

> `*_TEMPLATE.md` 報告模板保留為**選用**：僅在需要正式書面報告時才填；它們不是完成門檻，唯一門檻是可執行測試實際通過並附證據。

---

## 四、精簡七步流程

```text
1. 辨識技術棧 → 決定測試框架（Vitest / Jest / Pytest / Playwright）
2. 快速理解專案：README、入口、核心模組、現有測試、LLM 呼叫點
3. 撰寫/補齊可執行測試（單元 / 整合 / API / LLM eval）
4. 實際執行測試與靜態分析（test / lint / type-check / build）
5. 貼上真實終端機證據（指令 + 輸出 + exit code + 覆蓋率）
6. 失敗項目 → 先寫能重現失敗的回歸測試，再交開發修復
7. 輸出精簡結論：通過/失敗清單、覆蓋缺口、修正優先序
```

> 完整規範見 `QA_TESTING_SOP.md`；角色定位與禁止事項見 `QA_AGENT_ROLE.md`；給 AI CLI 的執行指令見 `AI_AGENT_EXECUTION_PROMPT.md`。

---

## 五、核心原則

```text
可執行測試優先於文字報告
測試優先於修正
證據優先於猜測
無可執行測試不得宣告 Pass
不得忽略 LLM wrapper 的輸出驗證
不得把無法測試（Blocked / Not Run）偽裝成 Pass
不得隱藏失敗結果
未經允許不得修改正式程式碼
```
