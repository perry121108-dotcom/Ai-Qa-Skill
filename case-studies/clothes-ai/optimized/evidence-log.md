# 證據紀錄 — clothes AI（優化版重測）

> 真實終端機輸出。環境：Windows 11 / Python 3.12.10 / 分支 `qa/optimized-retest`。

---

## E-01 基線測試（重測前）

```text
$ python -m pytest -q --tb=no
.................................................................        [100%]
65 passed in 29.89s
```

## E-02 解析強固性探針（找到缺口）

```text
[fenced```json] OutfitGeneratorError: ... JSONDecodeError ... Expecting value: line 1 column 1 (char 0)
[empty]         SchemaValidationError: Gemini 回應為空
[truncated]     OutfitGeneratorError: ... JSONDecodeError ... Expecting property name ...
[extra_text]    OutfitGeneratorError: ... JSONDecodeError ... Expecting value: line 1 column 1 (char 0)
[plain_valid]   OK -> groups=2
```
→ 結論：`fenced` 與 `extra_text` 為缺口（不符 SKILL 5.1 容錯要求）；`empty`/`truncated` 已優雅降級。

## E-03 加入三維度 eval 後（RED 可見）

```text
$ python -m pytest tests/test_llm_evaluation.py -v
...
22 passed, 2 xfailed
```
→ 2 個 xfail = BUG-LLM-001 / BUG-LLM-002（RED，套件維持綠燈）。

## E-04 全套件 + 覆蓋率（修復前）

```text
$ python -m pytest -q --cov=src --cov-report=term-missing
.........................................................xx............. [ 80%]
.................                                                        [100%]
src\brain_layer\outfit_generator.py   74   1   99%   167
...
TOTAL                                 511 227  56%
87 passed, 2 xfailed in 23.11s
```

## E-05 修復後（Red→Green 完成）

```text
$ python -m pytest -q --cov=src.brain_layer.outfit_generator --cov-report=term-missing
........................................................................ [ 80%]
.................                                                        [100%]
src\brain_layer\outfit_generator.py   85   1   99%   185
89 passed in 22.29s
```

## E-06 修復後完整覆蓋率

```text
$ python -m pytest -q --cov=src --cov-report=term-missing
TOTAL  522 stmts  227 miss  57%
89 passed in 22.89s
```

## E-07 覆蓋缺口掃描（工具邊界記錄）

```text
$ node skills/ai-qa-skill/scripts/find-untested.mjs src
原始檔：8  有對應測試：0  缺測試：8  （檔案層粗估 0%）  exit=1
```
→ 偽陽性（測試按 layer 分組，非逐檔），權威數據以 E-06 的 `--cov` 為準。詳見 coverage-summary.md。

---

## 指令彙整

| 編號 | 指令 | 目的 | 結果 |
|---|---|---|---|
| E-01 | `pytest -q --tb=no` | 基線 | 65 passed |
| E-04 | `pytest -q --cov=src` | 加 eval 後 | 87 passed, 2 xfailed |
| E-05 | `pytest -q --cov=...outfit_generator` | 修復後 | 89 passed |
| E-06 | `pytest -q --cov=src` | 最終 | 89 passed, 57% |
| E-07 | `node find-untested.mjs src` | 缺口掃描 | exit 1（偽陽性） |
