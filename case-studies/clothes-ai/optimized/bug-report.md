# Bug Report — clothes AI（優化版重測）

> 本次以三維度 LLM eval 找到 2 個解析強固性缺口，皆完成 Red→Green 回歸。

---

## BUG-LLM-001：解析端不容錯 ` ```json ` 圍欄

| 欄位 | 內容 |
|---|---|
| 嚴重度 | Major |
| 優先級 | High |
| 模組 | `src/brain_layer/outfit_generator.py` |
| 對應需求 | REQ-004（SKILL.md 5.1） |
| 狀態 | **Closed（Red→Green，回歸測試永久保留）** |

### 重現步驟
1. mock Gemini 回傳被 ` ```json ... ``` ` 圍欄包住的合法 JSON。
2. 呼叫 `generate_outfit(...)`。

### 預期 vs 實際（修復前）
- 預期：能去除圍欄並解析，回傳 2 組配色。
- 實際：`json.loads` 直接吃到 ` ``` ` 開頭 → `JSONDecodeError: Expecting value: line 1 column 1`，經重試後拋 `OutfitGeneratorError`。

### RED 證據
```text
[fenced```json] OutfitGeneratorError: ... JSONDecodeError ... Expecting value: line 1 column 1 (char 0)
```

### 修正（最小變更）
新增 `_extract_json()`：去除 ` ```json ` 圍欄、必要時擷取第一個 `{` 到最後一個 `}`，再 `json.loads`。

### GREEN 證據
```text
tests/test_llm_evaluation.py::TestSchemaRobustness::test_tolerates_json_code_fence PASSED
```

### 回歸測試
`tests/test_llm_evaluation.py::TestSchemaRobustness::test_tolerates_json_code_fence`（永久保留）

---

## BUG-LLM-002：解析端不容錯 JSON 前後多餘文字

| 欄位 | 內容 |
|---|---|
| 嚴重度 | Major |
| 優先級 | High |
| 模組 | `src/brain_layer/outfit_generator.py` |
| 對應需求 | REQ-004（SKILL.md 5.1） |
| 狀態 | **Closed（Red→Green，回歸測試永久保留）** |

### 重現步驟
1. mock Gemini 回傳 `"Here is your result:\n{...}\nHope it helps!"`。
2. 呼叫 `generate_outfit(...)`。

### 預期 vs 實際（修復前）
- 預期：能擷取中間 JSON 並解析。
- 實際：`JSONDecodeError: Expecting value: line 1 column 1` → 重試後 `OutfitGeneratorError`。

### RED 證據
```text
[extra_text] OutfitGeneratorError: ... JSONDecodeError ... Expecting value: line 1 column 1 (char 0)
```

### 修正
同 BUG-LLM-001 的 `_extract_json()`：當字串非以 `{` 開頭時，擷取 `{...}` 區段。

### GREEN 證據
```text
tests/test_llm_evaluation.py::TestSchemaRobustness::test_tolerates_extra_surrounding_text PASSED
```

### 回歸測試
`tests/test_llm_evaluation.py::TestSchemaRobustness::test_tolerates_extra_surrounding_text`（永久保留）

---

## 修復後整體狀態

```text
89 passed, 0 xfailed
src/brain_layer/outfit_generator.py 覆蓋率 99%
demo 分支 qa/optimized-retest：576df94（測試）→ 4fc479c（修復）
```

> 註：修復前以 `xfail(strict=True)` 將兩測試標為 RED（套件維持綠燈、缺口可見）；修復後移除 xfail，轉為永久 GREEN 回歸守門。
