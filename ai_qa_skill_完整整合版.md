# AI QA Skill 文件包完整生成規格（整合版 v2）

> 本文件為原始規格與缺漏補充的完整整合版本，共涵蓋 7 項補充修正。

## 0. 使用目的

本文件是一份可直接交給 Codex、Claude Code、Cursor、GitHub Copilot、Gemini CLI 或其他 AI Coding Agent 執行的開發指令文件。

目標是要求 AI Agent 在指定專案中建立一套完整的 **AI QA Skill 文件包**，讓後續任何 AI CLI / AI Coding Agent 都能讀取這套 Skill，並以「AI QA 測試人員」角色執行測試、產出測試案例、記錄測試結果、生成 Bug Report、整理漏測提醒、輸出中文版 QA 測試報告，以及建立決策紀錄報告。

本文件不是討論稿，也不是產品篩選表。AI Agent 需要依照本文內容直接建立檔案與資料夾。

---

# 1. 請 AI Agent 執行的總指令

請在目前專案根目錄建立以下資料夾與文件：

```text
/skills/ai-qa-skill/
  README.md
  QA_AGENT_ROLE.md
  QA_TESTING_SOP.md
  WEB_QA_RULES.md
  CLI_QA_RULES.md
  OUTPUT_RULES.md
  PROJECT_UNDERSTANDING_TEMPLATE.md
  FUNCTION_MAP_TEMPLATE.md
  TEST_CASE_TEMPLATE.md
  QA_REPORT_TEMPLATE.md
  BUG_REPORT_TEMPLATE.md
  COVERAGE_SUMMARY_TEMPLATE.md
  DECISION_LOG_TEMPLATE.md
  EVIDENCE_LOG_TEMPLATE.md
  RETEST_REPORT_TEMPLATE.md
  AI_AGENT_EXECUTION_PROMPT.md

/qa-reports/
  .gitkeep

/screenshots/
  .gitkeep
```

請注意：

```text
1. 不要修改任何正式功能程式碼。
2. 不要刪除現有檔案。
3. 不要重構專案。
4. 只建立 AI QA Skill 文件包與輸出資料夾。
5. 所有文件請使用繁體中文。
6. 所有 Markdown 文件需排版清楚、標題層級一致、可讀性高。
7. 文件內容要能讓任何 AI Agent 讀取後直接理解 QA 工作流程。
```

---

# 2. 文件包定位

## 2.1 Skill 名稱

```text
AI QA Skill
```

## 2.2 Skill 中文名稱

```text
AI QA 測試人員 Skill
AI 手動測試助理 Skill
AI QA CLI Tester Skill
```

## 2.3 Skill 目的

AI QA Skill 的目的，是讓 AI CLI / AI Coding Agent 在專案中扮演 QA 測試人員，依照固定流程完成：

```text
1. 閱讀專案
2. 理解功能
3. 建立測試案例
4. 執行可行測試
5. 記錄測試結果
6. 標記 Pass / Fail / Blocked / Not Run
7. 產生 Bug Report
8. 產生漏測提醒
9. 產出中文版 QA 測試報告
10. 產出 Decision Log 決策紀錄報告
```

此 Skill 第一階段不是完整 Web App，也不是完整 CLI 工具，而是一套讓 AI Agent 可執行 QA 工作的文件規則包。

---

# 3. 產品線背景

本 Skill 來自兩條產品線的整合。

## 3.1 Web 版產品線

### 名稱

```text
AI Manual QA Assistant
AI 手動測試助理
QA 測試紀錄與漏測提醒工具
新手 QA 測試報告產生器
```

### 定位

Web 版是給人類 QA 使用的手動測試助理，適合：

```text
新手 QA
QA 求職者
小型開發團隊
手動測試練習者
需要產出測試報告的個人開發者
```

### 核心價值

```text
更完整地測
更快寫報告
更少漏測
更好回報 Bug
```

### Web 版能力中先放入 Skill 的部分

```text
建立測試專案概念
輸入需求或功能清單
AI 產生測試案例
Pass / Fail / Blocked / Not Run 狀態標記
實際結果與備註紀錄
漏測提醒
Bug Report 產生
Markdown 測試報告輸出
```

## 3.2 CLI 版產品線

### 名稱

```text
AI QA CLI Tester
AI 命令列測試員
```

### 定位

CLI 版是給開發者、AI Coding Agent 與 CI/CD 使用的 AI 測試流程工具。

適合：

```text
開發者
Codex
Claude Code
Cursor
GitHub Copilot CLI
Gemini CLI
CI/CD 流程
```

### 核心流程

```text
AI 測試
↓
產生測試報告
↓
AI 開發工具根據報告修正
↓
再次測試
```

### CLI 版能力中先放入 Skill 的部分

```text
讀取專案資料
讀取 README / package.json / src / docs
產生測試案例
執行 npm install / build / lint / test
使用 Playwright 或可用瀏覽器工具測試 Web 流程
記錄錯誤、截圖與測試證據
輸出 qa-report.md
輸出 bug-report.md
輸出 coverage-summary.md
輸出 decision-log.md
輸出 retest-report.md
```

---

# 4. 完整檔案內容規格

以下內容請 AI Agent 逐一建立為對應檔案。

---

# 4.1 /skills/ai-qa-skill/README.md

```markdown
# AI QA Skill

## 一、Skill 目的

AI QA Skill 是一套給 AI CLI / AI Coding Agent 使用的 QA 測試工作規則。

當 AI Agent 讀取本 Skill 後，必須扮演「AI QA 測試人員」，協助專案完成測試規劃、測試案例建立、測試執行、Bug Report、漏測提醒、測試報告與決策紀錄。

本 Skill 的核心目標是：

```text
讓 AI 不只會寫程式，也能先測試、產生報告，再把報告交給 AI 開發工具修正。
```

---

## 二、適用對象

本 Skill 適用於：

| 對象 | 用途 |
|---|---|
| Codex | 讀取專案並執行 QA 測試 |
| Claude Code | 依照 QA SOP 建立測試報告 |
| Cursor | 協助專案測試與 Bug 整理 |
| GitHub Copilot CLI | 根據測試報告協助修正 |
| Gemini CLI | 執行測試案例與報告整理 |
| 開發者 | 將測試報告提供給 AI 開發工具修正 |

---

## 三、Skill 輸出目標

AI QA 執行後，應在 `/qa-reports/` 中產出以下文件：

```text
project-understanding.md   ← 對應模板：PROJECT_UNDERSTANDING_TEMPLATE.md
function-map.md            ← 對應模板：FUNCTION_MAP_TEMPLATE.md
test-cases.md              ← 對應模板：TEST_CASE_TEMPLATE.md
evidence-log.md            ← 對應模板：EVIDENCE_LOG_TEMPLATE.md
qa-report.md               ← 對應模板：QA_REPORT_TEMPLATE.md
bug-report.md              ← 對應模板：BUG_REPORT_TEMPLATE.md
coverage-summary.md        ← 對應模板：COVERAGE_SUMMARY_TEMPLATE.md
decision-log.md            ← 對應模板：DECISION_LOG_TEMPLATE.md
retest-report.md           ← 對應模板：RETEST_REPORT_TEMPLATE.md（條件性輸出）
```

若某些文件本次無法產出，必須在 `qa-report.md` 的「風險與限制」中說明原因。

---

## 四、核心原則

```text
測試優先於修正
紀錄優先於猜測
可重現優先於主觀判斷
中文報告必須清楚流暢
不得隱藏失敗結果
不得未經允許修改正式程式碼
```
```

---

# 4.2 /skills/ai-qa-skill/QA_AGENT_ROLE.md

```markdown
# QA Agent Role

## 一、角色定位

你現在是一位 **AI QA 測試人員**。

你的任務不是優先寫程式，也不是優先修 Bug，而是先完整理解專案、建立測試案例、執行測試、記錄結果、整理 Bug 與輸出測試報告。

除非使用者明確要求你修正程式碼，否則你不得主動修改正式功能程式碼。

---

## 二、你的主要工作

你必須完成以下工作：

```text
1. 閱讀專案文件與程式結構
2. 理解專案用途與核心功能
3. 建立功能地圖 function-map.md
4. 建立測試案例 test-cases.md
5. 執行可行的測試指令
6. 執行主要 Web 使用者流程測試
7. 記錄測試證據 evidence-log.md
8. 產生 Bug Report
9. 產生 Coverage Summary
10. 產生中文版 QA 測試報告
11. 產生 Decision Log 決策紀錄
12. 給出修正優先順序
```

---

## 三、你不得做的事

```text
1. 不得未經允許修改正式功能程式碼
2. 不得自行刪除功能
3. 不得自行改動商業邏輯
4. 不得把推測當作事實
5. 不得隱藏測試失敗
6. 不得只輸出簡短結論
7. 不得只輸出英文報告
8. 不得跳過 Bug 重現步驟
9. 不得把無法測試誤判為 Pass
10. 不得忽略使用者已做過的產品決策
```

---

## 四、測試狀態定義

| 狀態 | 定義 |
|---|---|
| Pass | 測試通過，實際結果符合預期 |
| Fail | 測試失敗，實際結果不符合預期 |
| Blocked | 因環境、資料、權限或前置問題導致無法測試 |
| Not Run | 尚未執行該測試 |
| Retest | 修復後需要重新測試 |
| Closed | 已確認修復並結案 |

---

## 五、語言要求

所有主要報告必須使用繁體中文。

尤其是：

```text
qa-report.md
bug-report.md
coverage-summary.md
decision-log.md
evidence-log.md
```

報告必須段落流暢、標題清楚、表格整齊，適合人類閱讀，也適合 AI 開發工具根據內容進行修正。

---

## 六、Bug 嚴重程度定義（Severity）

| 嚴重程度 | 定義 | 範例 |
|---|---|---|
| Critical | 核心功能完全無法使用，或造成資料遺失、系統崩潰 | 主流程按鈕無反應、頁面白屏、登入後資料消失 |
| Major | 主要功能受影響但有替代方式，或次要功能完全失效 | 表單送出後沒有成功提示、匯出功能失敗 |
| Minor | 功能仍可使用，但有明顯錯誤或不符預期的行為 | 錯誤提示文字顯示不正確、格式顯示異常 |
| Trivial | 不影響功能，純粹為視覺或文字問題 | 錯字、按鈕顏色不一致、多餘空白 |

---

## 七、Bug 優先級定義（Priority）

| 優先級 | 定義 | 建議處理時機 |
|---|---|---|
| High | 必須優先修正，否則阻礙後續測試或使用者無法繼續使用 | 本次修正週期內必須完成 |
| Medium | 需要修正但不阻塞主流程，可安排在下一輪修正 | 下一輪測試前完成 |
| Low | 影響輕微，修正優先級可排在後面 | 有空時處理 |

> 嚴重程度（Severity）由問題本身的影響範圍決定；優先級（Priority）由業務需求與修正成本決定。兩者可以不同，例如一個 Critical 的視覺問題在特定情況下 Priority 可能為 Medium。
```

---

# 4.3 /skills/ai-qa-skill/QA_TESTING_SOP.md

```markdown
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
```

---

# 4.4 /skills/ai-qa-skill/WEB_QA_RULES.md

```markdown
# Web QA Rules

## 一、Web 版測試定位

本規則適用於 Web App、網站、管理後台、AI 工具網站、SaaS MVP 等專案。

AI QA 測試人員需以人類使用者角度檢查主要流程是否可用。

---

## 二、Web 測試範圍

至少檢查：

| 測試項目 | 說明 |
|---|---|
| 首頁顯示 | 頁面是否可正常載入 |
| 導覽列 | 連結是否可點擊 |
| 表單輸入 | 欄位是否可輸入與驗證 |
| CTA 按鈕 | 是否有反應 |
| 核心流程 | 使用者是否能完成主要任務 |
| 錯誤提示 | 錯誤時是否有清楚提示 |
| 空狀態 | 無資料時是否有合理畫面 |
| Loading 狀態 | 等待時是否有提示 |
| 匯出功能 | Markdown、圖片或檔案是否可輸出 |
| 響應式畫面 | 桌機與手機寬度是否基本可用 |

---

## 三、常見測試情境

```text
正常輸入資料
空白輸入
格式錯誤輸入
過長文字
特殊符號
快速重複點擊
重新整理頁面
切換頁面
網路或 API 錯誤狀態
```

---

## 四、Web Bug 判斷標準

符合以下任一情況，需記錄 Bug：

```text
按鈕無反應
主要流程無法完成
輸入錯誤但沒有提示
畫面破版
資料未正確顯示
報告未產生
匯出失敗
console 出現明顯錯誤
API 回傳錯誤但前端無處理
```
```

---

# 4.5 /skills/ai-qa-skill/CLI_QA_RULES.md

```markdown
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
```

---

# 4.6 /skills/ai-qa-skill/OUTPUT_RULES.md

```markdown
# Output Rules

## 一、輸出位置

所有 QA 輸出文件必須放在：

```text
/qa-reports/
```

截圖或測試證據圖片放在：

```text
/screenshots/
```

---

## 一-A、截圖命名規範

所有截圖檔案請放在 `/screenshots/` 資料夾中，並依照以下命名格式：

### 命名格式

```text
{測試編號}_{功能簡稱}_{狀態}_{順序}.png
```

### 命名範例

| 情境 | 檔名範例 |
|---|---|
| TC-001 登入功能測試通過 | `TC-001_login_pass_01.png` |
| TC-003 表單空白送出失敗 | `TC-003_form_empty_fail_01.png` |
| BUG-002 按鈕無反應截圖 | `BUG-002_cta_no_response_01.png` |
| CMD-005 build 失敗錯誤畫面 | `CMD-005_build_fail_01.png` |

### 命名規則說明

```text
1. 測試編號：對應 TC-XXX / BUG-XXX / CMD-XXX
2. 功能簡稱：英文小寫，單字間用底線，不超過 20 字元
3. 狀態：pass / fail / blocked / error 四選一
4. 順序：同一測試有多張截圖時，依序標為 01 / 02 / 03
5. 副檔名統一使用 .png
```

### evidence-log.md 截圖路徑填寫方式

```text
/screenshots/TC-001_login_pass_01.png
```

---

## 二、輸出文件

每次 QA 測試建議產出：

```text
project-understanding.md
function-map.md
test-cases.md
evidence-log.md
qa-report.md
bug-report.md
coverage-summary.md
decision-log.md
retest-report.md（條件性輸出：僅在有 Bug 已修正並需再測時產出，首次測試不強制）
```

---

## 三、語言要求

以下文件必須使用繁體中文：

```text
qa-report.md
bug-report.md
coverage-summary.md
decision-log.md
evidence-log.md
```

其他文件也建議使用繁體中文。

---

## 四、格式要求

報告需符合：

```text
標題清楚
段落流暢
表格整齊
狀態明確
Bug 可重現
建議可執行
適合人類閱讀
適合 AI 開發工具讀取
```

---

## 五、不可接受的輸出

```text
只有一句話結論
只有英文
只有零散表格
沒有測試步驟
沒有實際結果
沒有 Bug 重現步驟
沒有說明測試限制
沒有記錄未測項目
```
```

---

# 4.7 /skills/ai-qa-skill/PROJECT_UNDERSTANDING_TEMPLATE.md

```markdown
# Project Understanding Template

## 一、文件目的

本文件由 AI QA 測試人員在測試前填寫，目的是確認對專案的基本理解正確，避免因誤解功能而產生無效測試案例。

---

## 二、專案基本資訊

| 項目 | 內容 |
|---|---|
| 專案名稱 |  |
| 讀取時間 |  |
| 技術棧 |  |
| 套件管理器 | npm / pnpm / yarn / pip / 未知 |
| 主要語言 |  |
| 專案類型 | Web App / CLI 工具 / API / 函式庫 / 其他 |
| 部署方式（若已知）|  |

---

## 三、已閱讀文件清單

| 文件 | 是否存在 | 備註 |
|---|---|---|
| README.md | 是 / 否 |  |
| package.json | 是 / 否 |  |
| .env.example | 是 / 否 |  |
| src/ | 是 / 否 |  |
| app/ | 是 / 否 |  |
| pages/ | 是 / 否 |  |
| components/ | 是 / 否 |  |
| docs/ | 是 / 否 |  |
| tests/ | 是 / 否 |  |
| playwright.config.* | 是 / 否 |  |
| vite.config.* | 是 / 否 |  |
| next.config.* | 是 / 否 |  |
| requirements.txt | 是 / 否 |  |
| pyproject.toml | 是 / 否 |  |

---

## 四、專案用途理解

請用繁體中文說明：

1. 這個專案是做什麼用的？
2. 主要目標使用者是誰？
3. 核心解決的問題是什麼？

---

## 五、核心功能清單

| 功能名稱 | 功能說明 | 是否可測試 | 不可測試原因 |
|---|---|---|---|
|  |  | 是 / 否 |  |

---

## 六、可用測試指令

| 指令 | 是否存在 | 備註 |
|---|---|---|
| npm install / pnpm install / yarn | 是 / 否 |  |
| npm run build | 是 / 否 |  |
| npm run lint | 是 / 否 |  |
| npm test / npm run test | 是 / 否 |  |
| npm run dev | 是 / 否 |  |
| pip install / pytest | 是 / 否 |  |
| 其他（請填入）|  |  |

---

## 七、測試環境資訊

| 項目 | 內容 |
|---|---|
| 作業系統 |  |
| Node.js 版本（若適用）|  |
| Python 版本（若適用）|  |
| 瀏覽器（若適用）|  |
| 本地服務啟動 URL（若適用）|  |
| 環境變數是否齊全 | 是 / 否 / 部分缺少 |

---

## 八、不確定項目

請列出 AI QA 在閱讀專案後仍有疑問、無法確認或資訊不足的項目：

| 項目 | 疑問說明 | 影響範圍 |
|---|---|---|
|  |  |  |

---

## 九、AI QA 理解確認聲明

```text
本文件由 AI QA 測試人員依照專案現有文件整理，
以下測試案例與測試流程將以本文件的理解為基礎。
若實際功能與本文件記載不符，請在 decision-log.md 中更新。
```
```

---

# 4.8 /skills/ai-qa-skill/FUNCTION_MAP_TEMPLATE.md

```markdown
# Function Map Template

## 一、文件目的

本文件由 AI QA 測試人員整理，列出專案的主要功能模組、對應頁面或端點、測試類型方向，作為建立測試案例的依據。

---

## 二、功能地圖總覽

| 功能模組 | 功能說明 | 入口（頁面 / 指令 / API）| 測試方向 | 優先級 |
|---|---|---|---|---|
|  |  |  |  | High / Medium / Low |

---

## 三、Web 頁面清單（若為 Web 專案）

| 頁面名稱 | 路徑 | 主要用途 | 主要元件 | 測試重點 |
|---|---|---|---|---|
|  |  |  |  |  |

---

## 四、API 端點清單（若有 API）

| 端點 | 方法 | 用途 | 是否需驗證 | 測試重點 |
|---|---|---|---|---|
|  | GET / POST / PUT / DELETE |  | 是 / 否 |  |

---

## 五、功能相依關係

請列出功能之間的相依關係，說明哪些功能需要先完成才能測試後續功能：

```text
範例：
使用者必須先完成登入（功能 A），才能進行報告匯出（功能 B）。
```

---

## 六、高風險功能標記

| 功能 | 風險說明 | 建議優先測試原因 |
|---|---|---|
|  |  |  |

---

## 七、本次測試範圍決定

| 功能 | 是否納入本次測試 | 未納入原因 |
|---|---|---|
|  | 是 / 否 |  |
```

---

# 4.9 /skills/ai-qa-skill/TEST_CASE_TEMPLATE.md

```markdown
# Test Case Template

## 測試案例總覽

| 測試編號 | 功能 | 情境 | 類型 | 優先級 | 狀態 |
|---|---|---|---|---|---|
| TC-001 |  |  | 正向測試 | High | Not Run |

---

## TC-001：測試案例標題

### 測試功能


### 測試情境


### 測試類型

正向測試 / 反向測試 / 邊界測試 / 異常測試 / UI 測試 / 相容性測試

### 優先級

High / Medium / Low

### 前置條件


### 測試步驟

1. 
2. 
3. 

### 預期結果


### 實際結果


### 測試狀態

Pass / Fail / Blocked / Not Run / Retest / Closed

### 備註

```

---

# 4.10 /skills/ai-qa-skill/QA_REPORT_TEMPLATE.md

```markdown
# QA 測試報告

## 一、測試基本資訊

| 項目 | 內容 |
|---|---|
| 專案名稱 |  |
| 測試版本 |  |
| 測試日期 |  |
| 測試人員 | AI QA 測試人員 |
| 測試環境 |  |
| 測試工具 |  |
| 測試範圍 |  |

---

## 二、專案簡介

請用繁體中文簡要說明本專案用途、主要功能與目標使用者。

---

## 三、測試目標

本次測試主要目標為：

1. 驗證核心功能是否可正常使用。
2. 檢查主要使用者流程是否順暢。
3. 找出明顯 Bug、阻塞問題與高風險項目。
4. 整理尚未測試或需要補測的項目。
5. 產出可提供給 AI 開發工具修正的測試報告。

---

## 四、測試範圍

| 測試範圍 | 是否納入 | 備註 |
|---|---|---|
| 首頁顯示 |  |  |
| 核心功能流程 |  |  |
| 表單輸入 |  |  |
| 報告輸出 |  |  |
| 錯誤提示 |  |  |
| 響應式畫面 |  |  |
| Build / Lint / Test |  |  |

---

## 五、測試方法

請說明本次使用的方法，例如：

```text
閱讀專案文件
靜態檢查
npm run build
npm run lint
npm test
Playwright Web 測試
手動流程檢查
```

---

## 六、測試結果統計

| 狀態 | 數量 | 比例 |
|---|---:|---:|
| Pass |  |  |
| Fail |  |  |
| Blocked |  |  |
| Not Run |  |  |
| 總計 |  | 100% |
| 通過率（Pass / 總計）|  |  |

---

## 七、測試結果摘要

請用中文自然段落說明本次測試整體結果。不要只列出表格，必須用流暢文字說明品質狀態。

---

## 八、主要通過項目

| 測試編號 | 功能 | 測試結果 |
|---|---|---|
|  |  |  |

---

## 九、主要失敗項目

| 測試編號 | 功能 | 問題摘要 | 嚴重程度 |
|---|---|---|---|
|  |  |  |  |

---

## 十、阻塞與未測項目

| 測試編號 | 功能 | 狀態 | 原因 |
|---|---|---|---|
|  |  |  |  |

---

## 十一、Bug 清單摘要

請摘要 bug-report.md 中的重要問題。

---

## 十二、漏測提醒

請列出：

```text
尚未測試項目
高優先級未測項目
核心功能覆蓋不足項目
建議補測項目
```

---

## 十三、風險與限制

請說明本次測試限制，例如：

```text
環境限制
缺少測試帳號
無法啟動專案
缺少 API Key
無法連線外部服務
測試指令不存在
瀏覽器測試工具不可用
```

---

## 十四、建議修正優先順序

| 優先順序 | 項目 | 原因 |
|---|---|---|
| P0 |  |  |
| P1 |  |  |
| P2 |  |  |

---

## 十五、測試結論

請用繁體中文流暢段落總結本次測試結果，並說明是否建議進入下一階段開發、修正或重新測試。
```

---

# 4.11 /skills/ai-qa-skill/BUG_REPORT_TEMPLATE.md

```markdown
# Bug Report

## 一、Bug Summary

| Bug 編號 | 問題標題 | 發生功能 | 嚴重程度 | 優先級 | 狀態 |
|---|---|---|---|---|---|
| BUG-001 |  |  |  |  | Open |

---

## BUG-001：問題標題

### 發生功能


### 測試環境


### 嚴重程度

Critical / Major / Minor / Trivial

### 優先級

High / Medium / Low

### 重現步驟

1. 
2. 
3. 

### 預期結果


### 實際結果


### 錯誤訊息


### 截圖或證據路徑


### 是否可重現

是 / 否 / 需進一步確認

### 建議處理方向


### 狀態

Open / Fixed / Retest / Closed
```

---

# 4.12 /skills/ai-qa-skill/COVERAGE_SUMMARY_TEMPLATE.md

```markdown
# 測試覆蓋摘要

## 一、測試統計

| 項目 | 數量 | 比例 |
|---|---:|---:|
| 測試案例總數 |  | 100% |
| 已通過 |  |  |
| 失敗 |  |  |
| 阻塞 |  |  |
| 尚未測試 |  |  |
| 通過率（Pass / 總數 × 100%）|  |  |

---

## 二、已測功能

| 功能 | 測試案例數 | 結果 |
|---|---:|---|
|  |  |  |

---

## 三、尚未測試項目

| 測試編號 | 功能 | 優先級 | 建議 |
|---|---|---|---|
|  |  |  |  |

---

## 四、高優先級漏測提醒

請列出 High 優先級但仍為 Not Run 的測試案例。

---

## 五、疑似測試範圍不足

請列出目前沒有被測試案例覆蓋的核心功能。

---

## 六、建議補測項目

請列出下一輪測試建議補上的項目。
```

---

# 4.13 /skills/ai-qa-skill/DECISION_LOG_TEMPLATE.md

```markdown
# 決策紀錄報告

## 一、文件目的

本文件用來記錄本專案在產品規劃、測試策略與 QA Skill 設計過程中的重要決策，避免後續開發或 AI Agent 執行任務時偏離原本方向。

---

## 二、決策總覽

| 決策編號 | 決策主題 | 決策內容 | 目前狀態 |
|---|---|---|---|
| DEC-001 | 產品線分流 | 將產品分成 Web 版與 CLI 版 | 已保存 |
| DEC-002 | Web 版定位 | 給新手 QA、求職者、小型開發團隊使用 | 已保存 |
| DEC-003 | CLI 版定位 | 給開發者、AI Coding Agent、CI/CD 使用 | 已保存 |
| DEC-004 | 先做 QA Skill | 第一階段先不做完整 CLI，而是做 QA Skill 文件包 | 已決定 |
| DEC-005 | 中文報告要求 | 測試報告必須為中文版且排版流暢 | 已決定 |
| DEC-006 | 增加決策紀錄 | 測試輸出需包含 decision-log.md | 已決定 |

---

## 三、詳細決策紀錄

### DEC-001：產品線分流

**決策內容：**
將 AI Manual QA Assistant 拆分成 Web 版與 CLI 版兩條產品線。

**決策原因：**
Web 版更適合人類 QA、求職者與小型團隊；CLI 版更適合開發者、AI Coding Agent 與 CI/CD 流程。兩者使用情境不同，若混在一起會讓 MVP 範圍過大。

**影響範圍：**
產品定位、功能規劃、測試流程、後續開發路線。

**目前狀態：**
已保存。

---

### DEC-002：Web 版定位

**決策內容：**
Web 版定位為 AI 手動測試助理，協助新手 QA、求職者、小型開發團隊建立測試專案、產生測試案例、記錄測試結果、提醒漏測並輸出測試報告。

**決策原因：**
Web 版偏向人類可視化操作，適合履歷作品、GitHub / Notion 展示、手動測試練習與小型團隊交付前測試。

**影響範圍：**
Web UI、測試案例管理、報告輸出、漏測提醒。

**目前狀態：**
已保存，暫不立即修改方案。

---

### DEC-003：CLI 版定位

**決策內容：**
CLI 版定位為 AI QA CLI Tester，給開發者、AI Coding Agent 與 CI/CD 使用。

**決策原因：**
CLI 版可以讓 AI 測試流程接到 AI 開發流程，形成「AI 測試 → 產生報告 → AI 開發修正 → 再測試」的循環。

**影響範圍：**
CLI 測試流程、Playwright 測試、Markdown 報告、AI 開發工具整合。

**目前狀態：**
已保存，暫不立即修改方案。

---

### DEC-004：第一階段先做 QA Skill 文件包

**決策內容：**
第一階段先不做完整 CLI 應用，而是在 CLI 版方向上先做 QA Skill 文件包。

**決策原因：**
QA Skill 文件包可以更快落地，直接給 AI CLI 一個 QA 測試人員角色定位，明確要求它要做哪些工作、遵守哪些流程、產出哪些報告。這比一開始開發完整 CLI 指令工具更適合 MVP 驗證。

**影響範圍：**
第一階段開發內容、專案文件結構、AI CLI 使用方式。

**目前狀態：**
已決定。

---

### DEC-005：測試報告必須使用中文版且排版流暢

**決策內容：**
QA Skill 產出的 qa-report.md 必須是中文版，且排版清楚、段落流暢、適合人類閱讀，也適合 AI 開發工具理解與修正。

**決策原因：**
使用者需要能直接閱讀、展示、放入履歷或交給 AI 開發工具使用的測試報告。若報告只有零散表格或英文內容，會降低可讀性與作品展示價值。

**影響範圍：**
qa-report.md、bug-report.md、coverage-summary.md、decision-log.md 的輸出格式。

**目前狀態：**
已決定。

---

### DEC-006：增加決策紀錄報告

**決策內容：**
QA Skill 文件包需要額外產出 decision-log.md，記錄使用者在產品規劃與測試策略中的重要決策。

**決策原因：**
AI Agent 在後續執行任務時，容易只看當前指令而忽略過去決策。決策紀錄可以避免 AI 偏離方向，也能幫助使用者回顧為什麼先做 QA Skill、哪些功能先做、哪些功能延後。

**影響範圍：**
QA Skill 輸出文件、後續產品規劃、AI Agent 協作流程。

**目前狀態：**
已決定。

---

## 四、新增決策（供後續使用）

| 決策編號 | 決策主題 | 決策內容 | 目前狀態 |
|---|---|---|---|
| DEC-XXX |  |  |  |
```

---

# 4.14 /skills/ai-qa-skill/EVIDENCE_LOG_TEMPLATE.md

```markdown
# 測試證據紀錄

## 一、指令執行紀錄

| 編號 | 執行時間 | 指令 | 目的 | 結果 | 備註 |
|---|---|---|---|---|---|
| CMD-001 | YYYY-MM-DD HH:MM |  |  | Pass / Fail / Blocked |  |

---

## 二、頁面測試紀錄

| 編號 | 執行時間 | 頁面 / 功能 | 操作 | 實際結果 | 截圖路徑 |
|---|---|---|---|---|---|
| EVD-001 | YYYY-MM-DD HH:MM |  |  |  |  |

---

## 三、錯誤訊息紀錄

| 編號 | 發生時間 | 發生位置 | 錯誤訊息 | 影響 |
|---|---|---|---|---|
| ERR-001 | YYYY-MM-DD HH:MM |  |  |  |
```

---

# 4.15 /skills/ai-qa-skill/RETEST_REPORT_TEMPLATE.md

```markdown
# Retest Report

## 一、再測基本資訊

| 項目 | 內容 |
|---|---|
| 專案名稱 |  |
| 再測日期 |  |
| 測試人員 | AI QA 測試人員 |
| 修正依據 | bug-report.md |

---

## 二、本次修正範圍說明

請簡要說明開發者本次修正了哪些項目，以及修正的方式：

| Bug 編號 | 原問題 | 修正方式 |
|---|---|---|
| BUG-001 |  |  |

---

## 三、再測項目

| Bug 編號 | 原問題 | 修正狀態 | 再測結果 | 備註 |
|---|---|---|---|---|
| BUG-001 |  | Fixed / Not Fixed | Pass / Fail |  |

---

## 四、迴歸風險提醒

請列出本次修正可能影響到的其他功能，並說明是否已補充測試：

| 相關功能 | 風險說明 | 是否已補測 |
|---|---|---|
|  |  | 是 / 否 |

---

## 五、再測結論

請用繁體中文說明本次再測結果，並指出是否仍需修正或可以結案。
```

---

# 4.16 /skills/ai-qa-skill/AI_AGENT_EXECUTION_PROMPT.md

```markdown
# AI Agent Execution Prompt

請將以下指令提供給 Codex、Claude Code、Cursor、GitHub Copilot CLI、Gemini CLI 或其他 AI Coding Agent 使用。

---

## QA Skill 執行指令

請依照 `/skills/ai-qa-skill/` 的規則執行本專案 QA 測試。

你現在的角色是 **AI QA 測試人員**，不是開發者。

除非我明確要求你修正程式碼，否則你不得直接修改正式功能程式碼。

請完成以下工作：

1. 閱讀 `/skills/ai-qa-skill/` 內所有文件。
2. 閱讀專案 `README.md`、`package.json`、`docs`、`src`、`app`、`pages`、`components`、`tests` 等主要內容。
3. 整理 `/qa-reports/project-understanding.md`，說明專案用途、核心功能、可測試範圍與不確定項目。
4. 整理 `/qa-reports/function-map.md`，列出主要功能與對應測試方向。
5. 根據專案功能建立 `/qa-reports/test-cases.md`，測試案例需包含正向、反向、邊界、異常、UI 與基本相容性測試。
6. 先判斷專案技術棧（依 `package.json` / `requirements.txt` / `pyproject.toml`），再選擇對應的套件管理器與測試指令。
   - Node.js 專案：依 lockfile 判斷使用 npm / pnpm / yarn，再執行 install、build、lint、test。
   - Python 專案：建立虛擬環境後執行 pip install，再執行 pytest、lint、啟動服務。
   - 若技術棧不明，請記錄於 project-understanding.md 並標記相關測試為 Blocked。
7. 若專案可啟動 Web 頁面，請使用 Playwright 或可用瀏覽器工具測試主要使用者流程。
8. 每項測試需標記 `Pass`、`Fail`、`Blocked` 或 `Not Run`。
9. 測試失敗時，請記錄錯誤訊息、重現步驟、預期結果、實際結果與截圖路徑（截圖命名規範請參考 OUTPUT_RULES.md）。
10. 產出 `/qa-reports/evidence-log.md`，記錄測試指令、測試步驟、錯誤訊息與截圖證據（每筆需記錄執行時間）。
11. 產出 `/qa-reports/bug-report.md`，整理所有 Fail 測試案例。
12. 產出 `/qa-reports/coverage-summary.md`，列出已測、未測、Blocked、高優先級漏測、通過率與建議補測項目。
13. 產出 `/qa-reports/qa-report.md`，報告必須是繁體中文，排版清楚、段落流暢、適合人類閱讀，也適合 AI 開發工具依照報告修正。
14. 產出 `/qa-reports/decision-log.md`，記錄本專案目前已做過的重要產品決策與測試策略決策。
15. 最後請提供建議修正優先順序，但不要直接修改程式碼。

---

## 修正階段指令

當我明確要求你修正時，才可以根據 `/qa-reports/bug-report.md` 與 `/qa-reports/qa-report.md` 修改程式碼。

修正時請遵守：

```text
1. 優先處理 Critical / Major 問題
2. 不修改不相關功能
3. 修正後更新變更摘要
4. 修正後再次執行 QA Skill 測試
5. 產出 retest-report.md
```
```

---

# 5. 最終驗收條件

AI Agent 完成後，專案中必須存在：

```text
/skills/ai-qa-skill/README.md
/skills/ai-qa-skill/QA_AGENT_ROLE.md
/skills/ai-qa-skill/QA_TESTING_SOP.md
/skills/ai-qa-skill/WEB_QA_RULES.md
/skills/ai-qa-skill/CLI_QA_RULES.md
/skills/ai-qa-skill/OUTPUT_RULES.md
/skills/ai-qa-skill/PROJECT_UNDERSTANDING_TEMPLATE.md
/skills/ai-qa-skill/FUNCTION_MAP_TEMPLATE.md
/skills/ai-qa-skill/TEST_CASE_TEMPLATE.md
/skills/ai-qa-skill/QA_REPORT_TEMPLATE.md
/skills/ai-qa-skill/BUG_REPORT_TEMPLATE.md
/skills/ai-qa-skill/COVERAGE_SUMMARY_TEMPLATE.md
/skills/ai-qa-skill/DECISION_LOG_TEMPLATE.md
/skills/ai-qa-skill/EVIDENCE_LOG_TEMPLATE.md
/skills/ai-qa-skill/RETEST_REPORT_TEMPLATE.md
/skills/ai-qa-skill/AI_AGENT_EXECUTION_PROMPT.md
/qa-reports/.gitkeep
/screenshots/.gitkeep
```

所有文件需符合：

```text
繁體中文
Markdown 格式
標題清楚
內容完整
可直接交給 AI Agent 使用
不得包含「之後再補」、「待討論」、「暫時略過」等不完整字樣
```

---

# 6. 完成後回報格式

AI Agent 建立完文件包後，請回報：

```markdown
# AI QA Skill 文件包建立完成

## 已建立資料夾

- /skills/ai-qa-skill/
- /qa-reports/
- /screenshots/

## 已建立文件

| 文件 | 用途 |
|---|---|
| README.md | Skill 總說明 |
| QA_AGENT_ROLE.md | AI QA 角色定位（含 Bug 嚴重程度與優先級定義）|
| QA_TESTING_SOP.md | QA 測試流程（含技術棧判斷與 Python 支援）|
| WEB_QA_RULES.md | Web 測試規則 |
| CLI_QA_RULES.md | CLI 測試規則（含技術棧判斷與 Python 指令）|
| OUTPUT_RULES.md | 輸出規則（含截圖命名規範）|
| PROJECT_UNDERSTANDING_TEMPLATE.md | 專案理解模板 |
| FUNCTION_MAP_TEMPLATE.md | 功能地圖模板 |
| TEST_CASE_TEMPLATE.md | 測試案例模板 |
| QA_REPORT_TEMPLATE.md | 中文 QA 報告模板（含通過率欄位）|
| BUG_REPORT_TEMPLATE.md | Bug Report 模板 |
| COVERAGE_SUMMARY_TEMPLATE.md | 覆蓋摘要模板（含通過率計算）|
| DECISION_LOG_TEMPLATE.md | 決策紀錄模板 |
| EVIDENCE_LOG_TEMPLATE.md | 測試證據模板（含時間戳記欄位）|
| RETEST_REPORT_TEMPLATE.md | 再測報告模板（含迴歸風險提醒）|
| AI_AGENT_EXECUTION_PROMPT.md | 可直接給 AI Agent 的執行指令 |

## 後續使用方式

請將 `/skills/ai-qa-skill/AI_AGENT_EXECUTION_PROMPT.md` 的內容貼給 AI Agent，即可要求它依照 QA Skill 執行專案測試並輸出報告。
```

---

# 7. 結論

這份 AI QA Skill 文件包完整生成規格（整合版 v2），已將原始 Web 版與 CLI 版產品線中可先落地的能力整理成文件化 Skill，並補齊以下 7 項缺漏：

```text
1. 新增 PROJECT_UNDERSTANDING_TEMPLATE.md（專案理解模板）
2. 新增 FUNCTION_MAP_TEMPLATE.md（功能地圖模板）
3. QA_AGENT_ROLE.md 補入 Bug 嚴重程度與優先級正式定義
4. QA_TESTING_SOP.md 完成標準補入 retest-report.md（條件性輸出）
5. EVIDENCE_LOG_TEMPLATE.md 補入時間戳記欄位
6. OUTPUT_RULES.md 補入截圖命名規範
7. CLI_QA_RULES.md 與 QA_TESTING_SOP.md 補入 Python / pip 技術棧支援
```

目前第一階段要完成的是：

```text
不是完整 Web App
不是完整 CLI 工具
而是一套任何 AI Agent 都能讀取並執行的 AI QA Skill 文件包
```

此文件包完成後，就可以用於：

```text
AI 測試
AI 產生測試報告
AI 產生 Bug Report
AI 記錄漏測項目
AI 建立決策紀錄
AI 開發工具根據報告修正
修正後再次測試
```

最終形成：

```text
AI QA → 測試報告 → AI Dev 修正 → AI QA Retest
```
