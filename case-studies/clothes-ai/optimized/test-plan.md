# 測試計畫 — clothes AI（優化版重測）

> 套用 `TEST_PLAN_TEMPLATE.md`。對應 [requirements.md](requirements.md)。

---

## 一、文件資訊

| 項目 | 內容 |
|---|---|
| 專案名稱 | clothes AI |
| 計畫版本 | 1.0（優化版重測） |
| 撰寫時間 | 2026-06-07 |
| 對應需求 | requirements.md v1.0 |

---

## 二、測試範圍

| 範圍內 | 範圍外（附原因） |
|---|---|
| brain layer：Gemini 配色生成的 schema / 安全 / 誠信行為 | 真實 Gemini 呼叫（計費，一律 mock） |
| 既有 4 層既有測試之回歸 | 圖像生成品質、Telegram 真實推送 |

---

## 三、測試策略與層級

| 層級 | 採用 | 工具 | 說明 |
|---|---|---|---|
| 單元/整合 | 是 | Pytest + pytest-asyncio | 既有 65 + 新增 |
| LLM 評估（三維度） | 是 | 斷言式（mock Gemini） | 本次重點 |
| 回歸測試 | 是 | Red→Green | BUG-LLM-001/002 |
| 覆蓋率 | 是 | pytest-cov | `--cov=src` |

> 外部服務（Gemini/Telegram）一律 mock；單一指令 `pytest -q --cov=src` 可重跑、可進 CI。

---

## 四、測試環境

| 項目 | 內容 |
|---|---|
| OS | Windows 11 |
| Python | 3.12.10 |
| 安裝 | `pip install -r requirements.txt`（已含 pytest-cov） |
| 測試指令 | `python -m pytest -q --cov=src --cov-report=term-missing` |
| 金鑰 | 以 mock 取代，不使用真實 GEMINI_API_KEY |

---

## 五、進入準則
```text
- requirements.md 完成、REQ 編號齊備
- demo 可建置可執行、既有測試基線通過（65 passed）
```

## 六、退出準則（對齊 SKILL.md 完成門檻）
```text
[達成] 範圍內功能皆有可執行測試並通過（89 passed, 0 xfailed）
[達成] LLM 呼叫點三維度 eval 齊備並通過
[達成] 每個 Major Bug 有 Red→Green 回歸（BUG-LLM-001/002）
[達成] 無法執行者誠實標記（真實 Gemini 呼叫標 Not Run/mock）
[目標] LLM 呼叫點覆蓋率 ≥95% → 實得 99%
```

---

## 七、RTM 需求追溯矩陣

| 需求 | 摘要 | 測試案例 | 測試檔（可執行） | 狀態 |
|---|---|---|---|---|
| REQ-001 | 2 組 schema | `TestValidate::test_valid_2_groups_passes` 等 | `tests/test_brain_layer.py` | Pass |
| REQ-002 | hex 自動修正 | `test_hex_auto_fix_3_to_6_digit` | `tests/test_brain_layer.py` | Pass |
| REQ-003 | 畸形輸出優雅降級 | `TestSchemaRobustness::test_empty_response_*` / `*_truncated_*` / `*_oversized_*` | `tests/test_llm_evaluation.py` | Pass |
| REQ-004 | 圍欄/多餘文字容錯 | `test_tolerates_json_code_fence` / `test_tolerates_extra_surrounding_text` | `tests/test_llm_evaluation.py` | **Pass（Red→Green）** |
| REQ-005 | 逾時重試 | `test_retries_on_timeout_then_succeeds` / `test_raises_after_max_retries` | `tests/test_brain_layer.py` | Pass |
| REQ-006 | 防越獄/機密 | `TestJailbreakAndInjection::*`（錨點/注入/金鑰不外洩） | `tests/test_llm_evaluation.py` | Pass |
| REQ-007 | 誠信佔位 | `TestHallucinationAndHonesty::*` | `tests/test_llm_evaluation.py` | Pass |

> 全需求皆有對應可執行測試，無覆蓋缺口（需求層）。模組層覆蓋缺口見 coverage-summary.md。

---

## 八、風險與緩解

| 風險 | 影響 | 緩解 |
|---|---|---|
| 真實 Gemini 行為與 mock 不符 | 中 | mock 聚焦 wrapper 契約；真實品質另案抽測 |
| 其他模組覆蓋率偏低（music_trends 0%） | 中 | 已標記為後續補測，列 qa-summary 修正優先序 |
