# Case Studies — AI QA Skill 實戰案例

這裡放 AI QA Skill 在真實專案上跑完一輪後的完整輸出，作為 Skill 用法的具體證據。

案例分兩種風格：**手測式**（產出文字報告、不改程式碼）與 ⭐ **executable-first**（產出可執行測試、含三維度 LLM 評估與 Red→Green 回歸）。

---

## ⭐ 主打案例：clothes-ai（executable-first 重測）

> [clothes-ai/optimized/](clothes-ai/optimized/) — 用優化後的 Skill 對同一專案重跑一次的完整紀錄。

| 重點 | 數據 |
|---|---|
| 新增三維度 LLM 評估測試 | 22 個（schema 強固性 / 防越獄注入 / 幻覺誠信） |
| 找到並修復解析缺口 | BUG-LLM-001 / 002（**Red → Green** 回歸） |
| LLM 呼叫點覆蓋率 | **99%**（`outfit_generator.py`） |
| 全套件 | **89 passed, 0 xfailed** |

這正是本 Skill 的差異化：**唯一系統性測「AI 輸出本身」的 QA 流程**——不只跑功能測試，還守住 AI 輸出的結構、安全與誠信。

---

## 案例清單

| 案例 | 風格 | 技術棧 | 測試 | 重點觀察 |
|---|---|---|---|---|
| ⭐ [clothes-ai/optimized/](clothes-ai/optimized/) | **executable-first** | Python 3.12 + Gemini + Telegram | **89 passed**（+22 LLM eval） | 三維度 eval + Red→Green，LLM 點覆蓋率 99% |
| [clothes-ai/](clothes-ai/) | 手測式（舊版對照） | 同上 | 65 / 65 pytest | 8 份中文報告；保留作進化對照 |

> 更多案例陸續補上。

---

## 每個案例都展示了什麼

讀完任一案例你會看到：

1. **`project-understanding.md`** — AI 對專案的理解（技術棧 / 核心功能 / 不確定項目）
2. **`function-map.md`** — 功能 / 端點 / 模組相依關係圖
3. **`test-cases.md`** — 設計的所有測試案例（正向 / 反向 / 邊界 / 異常 / 安全 / UI / 相容性）
4. **`evidence-log.md`** — 每條執行過的指令、執行時間、輸出結果、程式碼審查證據
5. **`bug-report.md`** — 找到的所有 Bug（含 Severity、Priority、重現步驟、code diff 修正建議）
6. **`coverage-summary.md`** — 統計表、漏測提醒、補測建議
7. **`qa-report.md`** — **主報告**（中文段落、摘要、結論、修正優先順序 P0/P1/P2）
8. **`decision-log.md`** — 本次 QA 過程中作的關鍵決策（為什麼不啟動 server、為什麼跳過某指令）
9. **`retest-report.md`** — 條件性輸出（修 Bug 後才會有）

---

## 用法

這些 case studies 主要給三類人看：

- **想用這份 Skill 的人** — 看實際輸出長什麼樣，再決定要不要套到自己專案
- **想評估 AI QA 可行性的人** — 看 AI 能不能勝任 QA 角色（不寫測試的 QA 部分）
- **想了解專案品質的開發者** — 把案例當成「外部 QA 同行評審」的範本

---

## 案例的清理規則

公開到這裡的報告**全部都已通過以下檢查**：

- ✅ 不含實際 API key / token / 密碼字串
- ✅ 不含真實 DB 主機名、雲端 host、subdomain
- ✅ 不含個資、Email、聯絡方式
- ✅ 不含對「仍存活的 production 服務」的可立即攻擊路徑

若某案例對應的專案仍在線上、且報告中的 Bug 尚未修復，該案例會延後到 Bug 修復後再公開。
