# QA Testing SOP — 自動化測試與 LLM 評估

> 核心轉變：QA 的產出**不是散文報告，而是可執行的測試程式碼**。
> 文字報告（qa-report.md 等）降為**輔助說明**，不是完成門檻；唯一的完成門檻是**可執行測試實際通過並附終端機證據**。
> （`*_TEMPLATE.md` 報告模板仍可選用，但「填完模板」不等於「測試完成」。）

---

## 一、總流程（executable-first）

```text
1. 辨識技術棧 → 決定測試框架（見第二節）
2. 快速理解專案：README、入口、核心模組、現有測試、LLM 呼叫點
3. 撰寫／補齊可執行測試程式碼（單元 / 整合 / API / LLM eval）
4. 實際執行測試與靜態分析（test / lint / type-check / build）
5. 貼上真實終端機證據（指令 + 輸出 + exit code + 覆蓋率）
6. 失敗項目 → 先寫「能重現失敗」的回歸測試，再交開發修復
7. 輸出精簡結論：通過/失敗清單、覆蓋缺口、修正優先序
```

> 人類可讀產物精簡為**至多一份輔助** `qa-summary.md`（結論 + 覆蓋缺口 + 修正優先序）。其餘一律以**測試程式碼 + 終端機 Log** 為準。

---

## 二、技術棧 → 測試框架辨識（鐵律）

進入專案後，**先判斷技術棧，再鎖定測試框架**：

| 判斷依據 | 技術棧 | 測試框架 | 測試檔命名 |
|---|---|---|---|
| `vitest` 在 devDeps / 有 `vite.config.*` | Node / TS | **Vitest** | `*.test.ts` / `*.test.js` |
| `jest` 在 devDeps / 有 `jest.config.*` | Node / TS | **Jest** | `*.test.ts` / `*.spec.ts` |
| 僅有 `package.json`、無測試框架 | Node / TS | 預設導入 **Vitest**（最小設定） | `*.test.ts` |
| `pytest` / `requirements.txt` / `pyproject.toml` | Python | **Pytest** | `test_*.py` |
| 需 Web E2E 流程 | 任意 | **Playwright** | `e2e/*.spec.ts` |
| 兩者皆無 | 不明 | 標記 `Blocked`，回報需補環境 | — |

> 既有框架優先沿用；無框架時導入最小可行設定。**不得**以「專案沒有測試框架」當作不寫測試的藉口。

---

## 三、測試生成鐵律（核心產出）

- QA 代理的**主要交付物 = 實際可執行的測試檔**（`*.test.ts` / `test_*.py`），而非文字描述的 test-case。
- 每個被測功能至少涵蓋四類斷言：**正向、反向、邊界、異常**。
- 測試必須能以單一指令重跑（`npm test` / `pytest -q`）並可進 CI。
- 測試需自足：對外部服務與 LLM 呼叫一律 **mock / stub**，不依賴外部網路或真實金鑰。
- **嚴禁**：只產出 test-cases.md 的文字表格、卻沒有對應的可執行測試檔。

---

## 四、自動化回歸測試（Regression Suite）

「Bug 修正驗證」**不能只填報告**。鐵律流程：

```text
1. 針對該 Bug，先寫一個「能重現失敗（red）」的自動化測試
2. 確認修復前該測試「確實失敗」（附 red 證據）
3. 修復後該測試「轉綠（green）」（附 green 證據）
4. 此測試永久保留進專案回歸測試集，防止復發
```

- 每個 **Critical / Major** Bug 都必須留下對應的回歸測試；否則該 Bug **不得標記為 Closed**。

---

## 五、LLM 評估層（LLM Evaluation & Guardrails）

> 本工作區專案多為 LLM / AI 代理 wrapper。**只要專案存在 LLM 呼叫點，以下三類測試為強制項**，缺一不可宣告 Pass。

### 5.1 JSON 結構強固性（Schema Robustness）
- 對 AI 輸出的 JSON 撰寫 **schema 驗證測試**：欄位、型別、必填、列舉值 100% 契合契約。
- 餵入**惡意／畸形輸入**（空字串、超長、`null`、巢狀、非預期型別、截斷的 JSON），驗證系統**不崩潰**、能優雅降級或回明確錯誤。
- 驗證解析端對「模型多包了 ```json 圍欄或多餘文字」具容錯。

### 5.2 Prompt 防越獄與安全（Jailbreak & Injection）
- 撰寫測試嘗試誘導模型**洩漏 System Prompt／開發者指令**，斷言輸出**不含**系統提示內容。
- 注入攻擊測試：使用者輸入夾帶「忽略上述指令…」「現在你是…」等，斷言系統角色與限制**不被覆寫**。
- 驗證機密（API Key、內部路徑）**永不**出現在模型輸出。

### 5.3 幻覺與誠信邊界（Hallucination & Honesty）
- 在**缺乏資料**的情境下，斷言 AI 如實回 `null` / 留空 / 「待確認」，**而非自行臆造**。
- 對「不可能知道」的問題，驗證模型**承認不知**而非編造。
- 數值／事實型輸出需可追溯來源；無來源者應標記不確定，不得偽裝為事實。

> LLM 測試以**斷言式檢查**為主（schema 驗證、正則、關鍵字「不得出現」、golden output 比對）。非決定性輸出聚焦「結構與邊界」斷言，不依賴逐字相等。

---

## 六、執行指令參考

### Node（依 lockfile 選 npm / pnpm / yarn）
```bash
npm install
npm run lint
npm run typecheck      # 若有
npm test -- --coverage
```

### Python
```bash
pip install -r requirements.txt   # 或 pip install -e .
ruff check .                      # 或 flake8 .
pytest -q --cov
```

> 指令不存在 → 標 `Blocked` / `Not Run`，**不得**標 Pass。

---

## 七、完成門檻（拒絕形式主義）

完成 QA 的標準**不是產出 N 份文件**，而是：

```text
[必須] 對應功能有可執行測試檔，且 npm test / pytest 實際通過（附終端機證據）
[必須] 若有 LLM 呼叫點：5.1 / 5.2 / 5.3 三類測試齊備並通過
[必須] 每個已修 Critical/Major Bug 有對應回歸測試（red → green 證據）
[必須] 無法執行者誠實標記 Blocked / Not Run，不得偽裝 Pass
[輔助] qa-summary.md：結論、覆蓋缺口、修正優先序（精簡，非門檻）
```
