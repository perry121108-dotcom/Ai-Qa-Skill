# AI QA Skill — SDET 自動化測試與 LLM 評估技能庫

> **定位**：給 AI CLI / AI Coding Agent 使用的「測試自動化架構師（SDET）」核心技能庫。
> 讀取本技能後，AI 不再只寫散文式報告，而是**產出可執行的測試程式碼 + LLM 輸出評估（Eval）+ 常駐回歸測試集**，並以真實終端機證據作為唯一完成標準。

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

## 三、核心交付物（皆須可執行）

```text
1. 可執行測試檔（Vitest/Jest → *.test.ts；Pytest → test_*.py；E2E → Playwright）
   涵蓋：正向 / 反向 / 邊界 / 異常
2. LLM 評估測試（專案含 LLM 呼叫時強制，見第五節）
3. 回歸測試集（Regression Suite，見第四節）
4. 真實終端機執行證據（指令 + 輸出 + exit code + 覆蓋率）
```

> 輔助（非完成門檻）：`qa-summary.md`（精簡結論、覆蓋缺口、修正優先序）。

---

## 四、⭐ 自動化回歸測試流（Red-to-Green 鐵律）

Bug 修正**不能只填報告**，必須沉澱為永久測試：

```
1. 為該 Bug 先寫「能重現失敗」的測試   → 確認 RED（修復前確實失敗）
2. 修復程式碼                          → 轉為 GREEN（修復後通過）
3. 該測試永久保留進回歸測試集          → 防止復發
```

> 每個 **Critical / Major** Bug 都必須留下對應回歸測試；否則該 Bug **不得標記為 Closed**。常駐回歸測試集會隨專案演進持續累積，成為抵禦復發的安全網。

---

## 五、⭐ 三維度 LLM Evaluation（Guardrails）

> 只要專案存在 LLM 呼叫點，以下三類測試為**強制項**，缺一不可宣告 Pass。

| 維度 | 測試規範 |
|------|---------|
| **5.1 結構強固性**<br>(Schema Robustness) | AI 輸出 JSON 的欄位／型別／必填／列舉值 100% 契合 schema；餵入**畸形 JSON 圍欄**（未閉合、截斷、巢狀錯誤、惡意輸入）時系統**不得崩潰**，須優雅降級或回明確錯誤 |
| **5.2 防越獄與安全**<br>(Jailbreak & Injection) | 對真實 System Prompt 做**錨點回歸守門**（確認防禦規則未被移除）；當輸入「忽略先前指令／現在你是…」等注入時，系統角色**不被覆寫**、機密（API Key、內部路徑）**不外洩** |
| **5.3 誠信邊界**<br>(Hallucination & Honesty) | **缺乏資料時如實回傳 `null` / 留空 / 「待確認」**，而非自行臆造；對不可知的問題須**承認不知**，事實型輸出須可追溯來源 |

> LLM 測試以**斷言式檢查**為主（schema 驗證、正則、關鍵字「不得出現」、golden output 比對）；非決定性輸出聚焦「結構與邊界」斷言，不依賴逐字相等。

---

## 六、精簡七步流程

```text
1. 辨識技術棧 → 決定測試框架（Vitest / Jest / Pytest / Playwright）
2. 快速理解專案：README、入口、核心模組、現有測試、LLM 呼叫點
3. 撰寫/補齊可執行測試（單元 / 整合 / API / LLM eval）
4. 實際執行測試與靜態分析（test / lint / type-check / build）
5. 貼上真實終端機證據（指令 + 輸出 + exit code + 覆蓋率）
6. 失敗項目 → 先寫能重現失敗的回歸測試，再交開發修復
7. 輸出精簡結論：通過/失敗清單、覆蓋缺口、修正優先序
```

---

## 七、完成門檻（拒絕形式主義）

```text
[必須] 對應功能有可執行測試檔，且 npm test / pytest 實際通過（附終端機證據）
[必須] 若有 LLM 呼叫點：5.1 / 5.2 / 5.3 三類測試齊備並通過
[必須] 每個已修 Critical/Major Bug 有對應回歸測試（Red → Green 證據）
[必須] 無法執行者誠實標記 Blocked / Not Run，不得偽裝 Pass
```

---

## 八、技能庫文件結構

| 檔案 | 內容 |
|------|------|
| `QA_AGENT_ROLE.md` | SDET 角色定位、禁止事項、測試狀態與 Severity / Priority 定義 |
| `QA_TESTING_SOP.md` | 完整七步流程、框架對照、LLM 評估層、完成門檻 |
| `AI_AGENT_EXECUTION_PROMPT.md` | 給各 AI CLI 的執行指令與修正階段守則 |
| `*_TEMPLATE.md` | 選用的報告模板（非完成門檻） |

---

## 核心原則

```text
可執行測試優先於文字報告 · 測試優先於修正 · 證據優先於猜測
無可執行測試不得宣告 Pass · 不得忽略 LLM 輸出驗證 · 不得隱藏失敗
```
