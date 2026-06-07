# API QA Rules — 可執行 API 測試規範

> 適用於 REST / GraphQL / RPC 後端與 BFF。核心同 `SKILL.md`：**交付物是可執行測試檔 + 真實終端機證據**，不是文字描述的 API 清單。
> 對外部相依（DB、第三方 API、LLM）一律 **mock / stub**，使測試自足、可單一指令重跑、可進 CI。

---

## 一、每個端點至少涵蓋四類斷言

| 類別 | 斷言重點 |
|------|---------|
| **正向** | 合法請求 → 正確 status code（2xx）、回應 body 契合 schema、必要欄位齊全 |
| **反向** | 缺欄位 / 型別錯誤 / 驗證失敗 → 正確錯誤碼（4xx）與**結構化錯誤訊息**，不得回 5xx |
| **邊界** | 空值、最大長度、分頁邊界（page=0 / 超量）、數值上下限 |
| **異常** | 下游逾時 / 5xx / 連線中斷時 → 優雅降級或明確錯誤，不得整體崩潰或洩漏堆疊 |

> 額外必驗：**認證/授權**（無 token → 401、越權 → 403）、**冪等性**（重複 POST/PUT 行為一致）、**契約**（回應欄位/型別/列舉值 100% 契合 schema）。

---

## 二、框架選擇（依技術棧）

| 技術棧 | API 測試方式 | 測試檔命名 |
|---|---|---|
| Node / TS（Express / Fastify / Nest） | **Vitest/Jest + supertest**（直打 app handler，免起真實 port） | `*.api.test.ts` |
| Python（FastAPI / Flask / Django） | **Pytest + httpx.AsyncClient / TestClient** | `test_*_api.py` |
| 跨語言黑箱 | Playwright `request` fixture / Postman+newman（CI） | `e2e/*.api.spec.ts` |

---

## 三、可執行範例

### Node — Vitest + supertest（FastAPI 之外的首選）

```ts
// user.api.test.ts
import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import * as db from "../src/db";

describe("POST /api/users", () => {
  it("正向：合法輸入回 201 且 body 契合 schema", async () => {
    vi.spyOn(db, "insertUser").mockResolvedValue({ id: "u1", email: "a@b.com" });
    const res = await request(app).post("/api/users").send({ email: "a@b.com" });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: expect.any(String), email: "a@b.com" });
  });

  it("反向：缺 email 回 400 與結構化錯誤", async () => {
    const res = await request(app).post("/api/users").send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("授權：無 token 回 401", async () => {
    const res = await request(app).get("/api/users/me");
    expect(res.status).toBe(401);
  });

  it("異常：DB 故障時不外洩堆疊、回 5xx 結構化錯誤", async () => {
    vi.spyOn(db, "insertUser").mockRejectedValue(new Error("conn refused"));
    const res = await request(app).post("/api/users").send({ email: "a@b.com" });
    expect(res.status).toBeGreaterThanOrEqual(500);
    expect(JSON.stringify(res.body)).not.toMatch(/conn refused|at .*\.ts:/);
  });
});
```

### Python — Pytest + FastAPI TestClient

```python
# test_users_api.py
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_user_ok():
    r = client.post("/api/users", json={"email": "a@b.com"})
    assert r.status_code == 201
    body = r.json()
    assert isinstance(body["id"], str) and body["email"] == "a@b.com"

def test_create_user_missing_email():
    r = client.post("/api/users", json={})
    assert r.status_code == 422  # FastAPI 驗證錯誤

def test_me_requires_auth():
    assert client.get("/api/users/me").status_code == 401

def test_downstream_failure(monkeypatch):
    def boom(*a, **k):
        raise RuntimeError("conn refused")
    monkeypatch.setattr("app.db.insert_user", boom)
    r = client.post("/api/users", json={"email": "a@b.com"})
    assert r.status_code >= 500
    assert "conn refused" not in r.text  # 不洩漏內部錯誤
```

---

## 四、Schema 契約驗證（建議）

對回應做結構驗證，避免「欄位悄悄改動」破壞前端：

```ts
import { z } from "zod";
const UserSchema = z.object({ id: z.string(), email: z.string().email() });
expect(() => UserSchema.parse(res.body)).not.toThrow();
```

> Python 端可用 `pydantic` model 或 `jsonschema` 驗證；若專案有 OpenAPI/GraphQL schema，優先以該 schema 為契約來源。

---

## 五、完成門檻（與 SKILL.md 一致）

```text
[必須] 每個核心端點有可執行測試，npm test / pytest 實際通過（附終端機證據）
[必須] 涵蓋 正向 / 反向 / 邊界 / 異常，並驗證認證授權與錯誤碼
[必須] 外部相依全部 mock/stub，測試不依賴真實網路或金鑰
[必須] 若端點呼叫 LLM：套用 SKILL.md 的三維度 LLM Evaluation
```
