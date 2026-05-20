# Case Studies — AI QA Skill 實戰案例

這裡放 AI QA Skill 在真實專案上跑完一輪後的完整輸出，作為 Skill 用法的具體證據。

每個案例包含 8–9 份繁體中文報告，全部由 AI 在不修改正式程式碼的前提下產出。

---

## 案例清單

| 案例 | 專案類型 | 技術棧 | 內建測試 | QA 通過率 | 重點觀察 |
|---|---|---|---|---:|---|
| [clothes-ai/](clothes-ai/) | CLI 自動化工作流 | Python 3.12 + asyncio + Playwright + Gemini API + Telegram Bot | **65 / 65 pytest** | 80.0% | 工程品質達作品集級別；主要待修為「文件 vs 實作」落差 |

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
