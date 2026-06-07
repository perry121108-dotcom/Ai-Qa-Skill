# Duplication QA Rules — AI 重複碼 / DRY 守門（附加功能）

> **定位：附加檢查，非核心完成門檻。** 本 Skill 的核心仍是可執行測試 + 三維度 LLM Evaluation；本檔提供一道可選的「重複碼守門」。
> 動機：AI coding agent 產碼時常**複製貼上大量相同/結構相似段落**，累積維護債。這道檢查專門攔它。

---

## 一、何時啟用

```text
- 專案大量由 AI 代理產生/修改，擔心 copy-paste 重複
- 想在 PR/CI 設一個「重複率不得超過門檻」的軟性守門
- 非必跑：可作為附加品質指標，不阻擋核心測試的完成判定
```

---

## 二、工具：jscpd（建議，輕量、零安裝即用）

[jscpd](https://github.com/kucherenko/jscpd) 支援 200+ 格式、可進 CI、且有 AI 友善輸出。

```bash
# 一次性掃描（無需安裝）
npx jscpd ./src --min-lines 5 --min-tokens 50 --reporters console

# 設門檻：重複率超過 % 即失敗（可作 CI 守門）
npx jscpd ./src --threshold 3 --reporters console
# threshold 為「可容忍的重複率%」，超過則 exit 1
```

替代工具：**PMD CPD**（多語、輕量）、**SonarQube**（含近似/結構性克隆）、**jsinspect**（JS 結構相似）。

---

## 三、可選設定 `.jscpd.json`

```json
{
  "threshold": 3,
  "minLines": 5,
  "minTokens": 50,
  "reporters": ["console", "html"],
  "ignore": ["**/node_modules/**", "**/dist/**", "**/*.test.*", "**/__pycache__/**"],
  "absolute": true
}
```

---

## 四、可選 CI 片段（附加 job，不擋核心）

```yaml
  duplication-check:
    name: Duplication (add-on, non-blocking)
    runs-on: ubuntu-latest
    continue-on-error: true        # 附加檢查：不阻擋主流程
    steps:
      - uses: actions/checkout@v4
      - run: npx jscpd@latest . --threshold 5 --reporters console
```

> 想要硬性守門時，移除 `continue-on-error` 並調低 `threshold`。

---

## 五、判讀與處理

```text
1. 重複區塊 → 抽共用函式/模組（DRY），而非複製修改
2. 合理重複（如測試樣板、產生碼）→ 加入 ignore，並在 PR 說明
3. 此檢查屬附加品質指標；核心完成門檻仍以 SKILL.md（可執行測試 + 三維度 eval）為準
```
