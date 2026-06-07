# CLI QA Rules

## 一、CLI 版測試定位

本規則適用於 AI CLI / AI Coding Agent 協助測試專案時使用。

> 完整流程與完成門檻以 **[`SKILL.md`](SKILL.md)** 為準（executable-first）。本檔聚焦 CLI 情境下的**技術棧判斷與指令集**。

CLI 版核心是建立以下閉環（以可執行測試為中心）：

```text
AI 撰寫可執行測試 → 實際執行並貼證據 → 失敗項先寫回歸測試 → AI 開發修正（Red→Green）→ 重跑
```

---

## 二、CLI 測試工作

AI QA 需要依序執行：

```text
1. 讀取專案結構
2. 判斷技術棧（見二-A）
3. 判斷可用指令
4. 安裝依賴
5. 撰寫/補齊可執行測試（單元/整合/API/LLM eval；外部相依一律 mock）
6. 執行 build / lint / type-check
7. 執行 test 並取得覆蓋率（附真實終端機證據）
8. 需 E2E 時啟動本地服務，用 Playwright 測主要流程
9. 失敗項目先寫「能重現失敗」的回歸測試（Red），交修復後轉 Green
10. 輸出精簡結論 qa-summary.md（輔助，非完成門檻）
```

---

## 二-A、技術棧判斷規則

AI QA 在讀取專案後，必須先判斷技術棧，再選擇對應的測試指令集。

### 判斷依據

| 判斷依據 | 技術棧 |
|---|---|
| 存在 `package.json` | Node.js（npm / pnpm / yarn） |
| 存在 `requirements.txt` 或 `pyproject.toml` 或 `setup.py` | Python |
| 同時存在兩者 | 全端專案，依序執行兩組指令 |
| 兩者皆不存在 | 記錄為「技術棧不明」，在 project-understanding.md 中說明 |

### Node.js 指令

依 lockfile 判斷套件管理器：

| lockfile 存在 | 使用套件管理器 |
|---|---|
| `package-lock.json` | npm |
| `pnpm-lock.yaml` | pnpm |
| `yarn.lock` | yarn |

若無法判斷，預設使用 npm。

```bash
# npm
npm install && npm run build && npm run lint && npm test && npm run dev

# pnpm
pnpm install && pnpm build && pnpm lint && pnpm test && pnpm dev

# yarn
yarn install && yarn build && yarn lint && yarn test && yarn dev
```

### Python 指令

```bash
python -m venv .venv
source .venv/bin/activate   # macOS / Linux
.venv\Scripts\activate      # Windows

pip install -r requirements.txt
# 或
pip install -e .

pytest
pytest --tb=short -v

flake8 .
# 或
ruff check .

# 啟動服務（依框架選擇）
uvicorn main:app --reload
python app.py
python manage.py runserver
```

若某指令不存在，請記錄為：

```text
此專案未提供該測試指令，狀態標記為 Blocked 或 Not Run，不得標記為 Pass。
```

---

## 三、指令紀錄規則

每次執行指令，都需記錄：

```text
執行時間
指令名稱
執行目的
執行結果
錯誤訊息
是否阻塞後續測試
```

---

## 四、禁止事項

```text
不得在 QA 階段直接修改正式程式碼
不得自動刪除依賴
不得重構專案
不得將 build 失敗隱藏
不得將無測試指令誤判為測試通過
```

---

## 五、CLI 測試輸出（executable-first）

CLI 測試的**完成依據是可執行測試實際通過 + 真實終端機證據**，不是產出 N 份報告：

```text
[必須] 可執行測試檔（*.test.ts / test_*.py），npm test / pytest 實際通過並附證據
[必須] 有 LLM 呼叫點：三維度 LLM Evaluation 齊備（見 SKILL.md）
[必須] 每個已修 Critical/Major Bug 有 Red→Green 回歸測試
[輔助] qa-summary.md：通過/失敗清單、覆蓋缺口、修正優先序（精簡，非門檻）
```

> 詳細報告模板（qa-report / bug-report / coverage-summary / evidence-log / retest-report）仍可選用，但「填完模板」不等於完成。輸出位置與截圖命名見 [`OUTPUT_RULES.md`](OUTPUT_RULES.md)。
