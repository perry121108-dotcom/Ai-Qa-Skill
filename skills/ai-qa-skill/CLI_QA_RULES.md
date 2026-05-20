# CLI QA Rules

## 一、CLI 版測試定位

本規則適用於 AI CLI / AI Coding Agent 協助測試專案時使用。

CLI 版核心不是完整指令工具，而是建立以下流程：

```text
AI 測試 → 產生報告 → AI 開發修正 → 再測試
```

---

## 二、CLI 測試工作

AI QA 需要依序執行：

```text
1. 讀取專案結構
2. 判斷技術棧
3. 判斷可用指令
4. 安裝依賴
5. 執行 build
6. 執行 lint
7. 執行 test
8. 啟動本地服務
9. 使用 Playwright 或瀏覽器工具測試主要流程
10. 輸出 Markdown 報告
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

## 五、CLI 測試輸出

CLI 測試完成後，必須產出：

```text
qa-report.md
bug-report.md
coverage-summary.md
evidence-log.md
retest-report.md（條件性輸出：僅在有 Bug 已修正並需再測時產出）
```
