# Schema Drift QA Rules — AI 輸出契約漂移偵測

> 對應 `SKILL.md` 5.1 結構強固性 / OWASP `LLM05`（不當輸出處理）。
> 解的痛點：**模型改版後悄悄改欄位名、改型別、拿掉必填**，測試在「當下範例」還會過，下游卻無聲崩壞（凌晨 3 點炸）。

---

## 一、什麼算 schema 漂移

| 類型 | 範例 | 風險 |
|---|---|---|
| 欄位改名 | `style_tag` → `styleTag` | 下游讀不到，靜默缺值 |
| 欄位消失 | 必填 `type` 不再回傳 | 後續邏輯崩潰 |
| 型別漂移 | `id` 由 `number` 變 `string` | 比較/運算出錯 |
| 結構改變 | 物件變陣列、巢狀層級改變 | 解析失敗 |
| 新增欄位 | 多出未預期欄位 | 通常安全，但需知情 |

> 一般 schema 驗證測「這次輸出對不對」；**漂移偵測測「契約有沒有被偷偷改掉」**——兩者互補。

---

## 二、工具：`scripts/schema-signature.mjs`

把輸出的「欄位路徑 → 型別」固化成 **golden 簽章**，CI 比對，漂移即 fail。零相依、跨平台。

```bash
# 1) 擷取一份代表性輸出樣本（已通過 schema 驗證的 good output）
#    存成 sample-output.json

# 2) 產生並固化 golden 簽章（commit 進 repo）
node skills/ai-qa-skill/scripts/schema-signature.mjs sample-output.json > schema.golden.json

# 3) CI／測試中比對（漂移 → exit 1）
node skills/ai-qa-skill/scripts/schema-signature.mjs latest-output.json --check schema.golden.json
```

漂移時輸出範例：

```text
[移除/改名 — 欄位消失]
  - groups[].style_tag: string
  - groups[].top.type: string
[型別漂移]
  ~ groups[].id: number → string
[新增欄位]
  + groups[].styleTag: string
```

> golden 是**刻意維護的契約**：若變更是預期的，更新 golden 並 review；若非預期，視為破壞性變更須處理。

---

## 三、整進測試（mock 輸出，可進 CI）

### Python（pytest）

```python
import json, pathlib

GOLDEN = json.loads(pathlib.Path("schema.golden.json").read_text("utf-8"))

def _signature(node, prefix="", out=None):
    out = {} if out is None else out
    if isinstance(node, list):
        out[prefix + "[]"] = "array"
        if node:
            _signature(node[0], prefix + "[]", out)
    elif isinstance(node, dict):
        if prefix:
            out[prefix] = "object"
        for k, v in node.items():
            _signature(v, f"{prefix}.{k}" if prefix else k, out)
    else:
        out[prefix] = "null" if node is None else type(node).__name__
    return dict(sorted(out.items()))

def test_output_schema_has_not_drifted(sample_output):     # sample_output 來自 mock 的 wrapper
    assert _signature(sample_output) == GOLDEN
```

> 註：Python 型別名（`str`/`int`/`bool`）與 JS（`string`/`number`/`boolean`）不同；golden 請用**產生它的同一語言/工具**固化，避免跨語言型別名不一致。建議：JS/TS 專案用 `schema-signature.mjs` 產 golden；Python 專案用上方 `_signature()` 產 golden。

### Node / TS（Vitest）

```ts
import golden from "./schema.golden.json";
import { expect, it } from "vitest";
import { execFileSync } from "node:child_process";

it("AI 輸出 schema 未漂移", async () => {
  const out = await runAgent();                 // mock 過的 wrapper 輸出
  require("fs").writeFileSync("/tmp/out.json", JSON.stringify(out));
  // 直接比對簽章；或呼叫 schema-signature.mjs --check
  expect(() =>
    execFileSync("node", ["skills/ai-qa-skill/scripts/schema-signature.mjs", "/tmp/out.json", "--check", "schema.golden.json"])
  ).not.toThrow();   // 漂移時 exit 1 → execFileSync 拋錯
});
```

---

## 四、完成門檻（與 SKILL.md 一致）

```text
[必須] 對 LLM 輸出維護 golden 簽章，並在測試/CI 比對
[必須] schema 漂移時測試 fail（exit 1），不得無聲通過
[必須] golden 變更需經 review（預期變更才更新）
[搭配] 仍須有 5.1 schema 驗證測試（驗「這次對不對」）；漂移偵測驗「契約沒被偷改」
```
