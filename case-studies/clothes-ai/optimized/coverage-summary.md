# 覆蓋摘要 — clothes AI（優化版重測）

> 指令：`python -m pytest -q --cov=src --cov-report=term-missing`

---

## 整體結果

```text
89 passed in ~23s
TOTAL  522 stmts  227 miss  57%
```

## 各模組覆蓋率（修復後）

| 模組 | Stmts | Miss | Cover | 備註 |
|---|---:|---:|---:|---|
| **brain_layer/outfit_generator.py** | 85 | 1 | **99%** | ⭐ LLM 呼叫點，本次重點強化 |
| render_layer/renderer.py | 47 | 2 | 96% | |
| data_layer/festivals.py | 17 | 2 | 88% | |
| delivery_layer/telegram_bot.py | 59 | 8 | 86% | |
| data_layer/trends.py | 56 | 10 | 82% | |
| data_layer/weather.py | 51 | 19 | 63% | 缺口 |
| render_layer/outfit_photo_generator.py | 118 | 97 | 18% | **缺口** |
| data_layer/music_trends.py | 88 | 88 | **0%** | **缺口（無任何測試）** |

---

## 覆蓋缺口與修正優先序

| 優先 | 模組 | 現況 | 建議 |
|---|---|---|---|
| P1 | `music_trends.py` | 0% | 補單元測試（解析/排序/異常） |
| P2 | `outfit_photo_generator.py` | 18% | 補圖像 prompt 組裝與失敗路徑（外部 mock） |
| P3 | `weather.py` | 63% | 補 API 錯誤/逾時分支 |

---

## 工具邊界誠實說明（find-untested.mjs）

`skills/ai-qa-skill/scripts/find-untested.mjs` 對本專案 `src/` 回報「8/8 缺測試」，**這是檔名啟發式的誤判**：

- 本專案測試**按 layer 分組**（`tests/test_brain_layer.py` 等），而非逐檔 `test_<file>.py` 1:1。
- 掃描器以「檔名基底」比對，故對應不上 → 偽陽性。
- **權威覆蓋率以 `pytest --cov` 為準**（本檔上表）。

> 這同時是對掃描器適用邊界的記錄：它適合「逐檔命名」的專案做快速粗掃；layer/模組分組的專案應直接看 `--cov`。後續可考慮讓掃描器支援 `tests/` 內以 import 對應的偵測。
