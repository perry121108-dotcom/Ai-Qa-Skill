# Case Study：clothes AI（優化版 · Executable-First）

> 用**優化後的 AI QA Skill**（SKILL.md / executable-first）對同一專案 [clothes AI](https://github.com/perry121108-dotcom/clothes-AI) 重跑一次的測試紀錄。
> 舊版（手測式 8 份報告）原樣保留於上一層目錄，本資料夾為新版對照。

---

## 一句話結論

優化版不再只「描述」品質，而是**寫進可執行測試**：對 LLM 呼叫點加上三維度評估、**找到 2 個真實解析缺口並完成 Red→Green 回歸**，並以真實終端機證據（pytest + coverage）作為完成依據。

---

## 舊版（手測式） vs 新版（executable-first）對比

| 面向 | 舊版 2026-05-20 | 新版 2026-06-07 |
|---|---|---|
| 核心產出 | 8 份文字報告 | **可執行測試檔** + 文字摘要 |
| 完成依據 | 填完模板 / 跑既有 65 測試 | **新增測試實際通過 + coverage 證據** |
| LLM 輸出驗證 | 無 | **三維度 LLM eval 22 個測試**（schema / 防越獄 / 誠信） |
| Bug 處理 | 寫報告（7 個，未留測試） | 找到 2 個 → **RED 重現 → 修復 → GREEN 回歸** |
| 測試總數 | 65 passed | **89 passed, 0 xfailed** |
| LLM 呼叫點覆蓋率 | 未量測 | **`outfit_generator.py` 99%** |
| 整體覆蓋率 | 未量測 | **src 57%**（缺口明確標記） |
| 產物可進 CI | 否 | **是**（mock 外部、單一指令重跑） |

---

## 關鍵數據（真實終端機證據）

```text
基線：            65 passed
加三維度 eval：   87 passed, 2 xfailed   ← 2 個 RED bug 被測出
修復後：          89 passed, 0 xfailed   ← Red→Green 完成
outfit_generator.py 覆蓋率：99%（85 stmts, miss 1）
src 整體覆蓋率：  57%（522 stmts, miss 227）
```

demo 分支：`qa/optimized-retest`　commits：`576df94`（測試）→ `4fc479c`（修復）

---

## 找到並修復的 Bug

| Bug | 嚴重度 | 摘要 | 狀態 |
|---|---|---|---|
| BUG-LLM-001 | Major | 解析端不容錯 ` ```json ` 圍欄 → JSONDecodeError | **RED → GREEN ✅** |
| BUG-LLM-002 | Major | 解析端不容錯 JSON 前後多餘文字 | **RED → GREEN ✅** |

詳見 [bug-report.md](bug-report.md)。

---

## 優化版文件

| 檔案 | 用途 |
|---|---|
| [requirements.md](requirements.md) | 需求文件（REQ-XXX，套 W1 範本） |
| [test-plan.md](test-plan.md) | 測試計畫 + RTM 追溯矩陣 |
| [qa-summary.md](qa-summary.md) | 精簡結論、覆蓋缺口、修正優先序 |
| [bug-report.md](bug-report.md) | BUG-LLM-001/002 重現 + Red→Green 證據 |
| [coverage-summary.md](coverage-summary.md) | 完整覆蓋率表 + 缺口與工具邊界說明 |
| [evidence-log.md](evidence-log.md) | 真實終端機輸出（pytest / coverage / 掃描） |

---

## 對應的可執行測試（在 demo 專案）

```text
tests/test_llm_evaluation.py   ← 新增，三維度 LLM eval（22 案例）
src/brain_layer/outfit_generator.py  ← 新增 _extract_json() 解析容錯（Red→Green）
```
