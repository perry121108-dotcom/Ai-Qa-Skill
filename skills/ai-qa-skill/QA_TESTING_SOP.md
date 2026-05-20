# QA Testing SOP

## 一、總流程

AI QA 測試人員必須依照以下流程執行：

```text
1. 讀取 AI QA Skill 文件包
2. 確認自己角色為 AI QA 測試人員
3. 閱讀專案 README、package.json、docs、src、app、pages、components
4. 整理 project-understanding.md
5. 整理 function-map.md
6. 建立 test-cases.md
7. 執行可用的測試指令
8. 若專案可啟動 Web 頁面，執行主要流程測試
9. 記錄 evidence-log.md
10. 標記 Pass / Fail / Blocked / Not Run
11. 將 Fail 案例整理成 bug-report.md
12. 統計 coverage-summary.md
13. 產出 qa-report.md
14. 產出 decision-log.md
15. 給出修正優先順序
```

---

## 二、專案閱讀規則

測試前必須先閱讀以下內容：

```text
README.md
package.json
.env.example
src/
app/
pages/
components/
docs/
tests/
playwright.config.*
vite.config.*
next.config.*
requirements.txt
pyproject.toml
setup.py
```

如果檔案不存在，請在 project-understanding.md 中記錄「未找到」。

---

## 三、測試指令執行規則

### 技術棧判斷

先判斷專案技術棧，再選擇對應的指令集：

| 判斷依據 | 技術棧 |
|---|---|
| 存在 `package.json` | Node.js（npm / pnpm / yarn） |
| 存在 `requirements.txt` 或 `pyproject.toml` 或 `setup.py` | Python |
| 同時存在兩者 | 全端專案，依序執行兩組指令 |
| 兩者皆不存在 | 記錄為「技術棧不明」，標記相關測試為 Blocked |

### Node.js 專案

依 lockfile 判斷套件管理器（`package-lock.json` → npm、`pnpm-lock.yaml` → pnpm、`yarn.lock` → yarn），若無法判斷預設使用 npm：

```bash
npm install
npm run build
npm run lint
npm test
npm run dev
```

```bash
pnpm install
pnpm build
pnpm lint
pnpm test
pnpm dev
```

```bash
yarn install
yarn build
yarn lint
yarn test
yarn dev
```

### Python 專案

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

## 四、Web 流程測試規則

若專案可啟動 Web 頁面，請優先測試：

```text
首頁是否正常顯示
主要 CTA 是否可點擊
表單是否可輸入
主要功能流程是否可完成
錯誤提示是否合理
報告或資料是否可產出
匯出功能是否可使用
響應式畫面是否基本正常
```

如可使用 Playwright，請使用 Playwright 進行流程測試並截圖。

---

## 五、測試案例規則

每個測試案例必須包含：

```text
測試編號
測試功能
測試情境
測試類型
前置條件
測試步驟
預期結果
實際結果
測試狀態
優先級
備註
```

測試類型至少包含：

```text
正向測試
反向測試
邊界測試
異常測試
UI 顯示測試
基本相容性測試
```

---

## 六、完成標準

完成 QA 測試時，至少需產出：

```text
/qa-reports/project-understanding.md
/qa-reports/function-map.md
/qa-reports/test-cases.md
/qa-reports/evidence-log.md
/qa-reports/qa-report.md
/qa-reports/bug-report.md
/qa-reports/coverage-summary.md
/qa-reports/decision-log.md
/qa-reports/retest-report.md（條件性輸出：僅在有 Bug 已修正並需再測時產出，首次測試不強制）
```
