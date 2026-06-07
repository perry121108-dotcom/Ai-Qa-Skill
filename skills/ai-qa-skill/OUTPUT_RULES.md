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

## 二、輸出文件（executable-first）

完成依據是**可執行測試 + 真實終端機證據**（見 [`SKILL.md`](SKILL.md)），文字報告為輔助：

```text
[主要產出 · 完成門檻]
  可執行測試檔（*.test.ts / test_*.py，含三維度 LLM eval、Red→Green 回歸）
  真實終端機證據（指令 + 輸出 + exit code + 覆蓋率）

[輔助結論 · 建議]
  qa-summary.md（通過/失敗清單、覆蓋缺口、修正優先序）

[選用報告 · 非完成門檻]
  project-understanding.md / function-map.md / test-cases.md / evidence-log.md
  qa-report.md / bug-report.md / coverage-summary.md / decision-log.md
  requirements.md / test-plan.md（含 RTM）
  retest-report.md（條件性：僅在有 Bug 已修正並需再測時產出）
```

> 選用報告若要產出，仍遵守本檔的命名/位置/語言規範；但「填完模板」不等於「測試完成」。

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
宣稱 Pass 卻沒有可執行測試與真實終端機證據
有 LLM 呼叫點卻略過三維度 LLM Evaluation
只有一句話結論
只有英文
只有零散表格
沒有測試步驟
沒有實際結果
沒有 Bug 重現步驟
沒有說明測試限制
沒有記錄未測項目
```
