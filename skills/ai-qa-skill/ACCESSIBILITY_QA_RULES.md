# Accessibility QA Rules — 可執行無障礙測試規範（axe-core）

> 把 `WEB_QA_RULES.md` 的無障礙概念落到**可執行測試**。核心同 `SKILL.md`：以斷言式自動檢查為主，產出可重跑、可進 CI 的測試與真實終端機證據。
> 自動化可涵蓋約 30–50% 的 WCAG 問題（對比、缺 alt、表單 label、地標、ARIA 誤用等）；**其餘需人工驗證**（鍵盤操作、螢幕報讀器、焦點順序語意），不得以「axe 0 violations」宣稱 100% 無障礙。

---

## 一、工具選擇

| 場景 | 工具 | 測試檔命名 |
|---|---|---|
| 元件層（已有 Vitest/Jest + jsdom/RTL） | **jest-axe / vitest-axe** | `*.a11y.test.tsx` |
| 頁面/流程層（真實瀏覽器） | **Playwright + @axe-core/playwright** | `e2e/*.a11y.spec.ts` |
| CI 全站掃描 | `@axe-core/cli` 或 Playwright 批次 | — |

---

## 二、可執行範例

### 元件層 — Vitest + vitest-axe（或 jest-axe）

```tsx
// LoginForm.a11y.test.tsx
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { expect, it } from "vitest";
import { LoginForm } from "../src/LoginForm";

it("LoginForm 無 axe 可偵測的無障礙違規", async () => {
  const { container } = render(<LoginForm />);
  const results = await axe(container);
  expect(results.violations).toEqual([]); // 失敗時會列出規則 id 與節點
});
```

### 頁面/流程層 — Playwright + @axe-core/playwright

```ts
// home.a11y.spec.ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("首頁符合 WCAG 2.1 AA（自動可測部分）", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();

  // 失敗時印出可讀違規，便於修正
  if (results.violations.length) {
    console.log(results.violations.map(v => `${v.id}: ${v.help}`).join("\n"));
  }
  expect(results.violations).toEqual([]);
});
```

> 對「已知暫時無法修」的規則，可用 `.disableRules([...])` 明確標註並在 `qa-summary.md` 列為待辦缺口，**不得靜默忽略**。

---

## 三、必查項目（自動 + 人工）

| 類別 | 自動可測（axe） | 需人工 |
|---|:--:|:--:|
| 顏色對比（WCAG AA 4.5:1） | ✅ | — |
| 圖片 `alt` / 按鈕可辨識名稱 | ✅ | — |
| 表單欄位與 `label` 關聯 | ✅ | — |
| 地標（landmark）/ 標題層級 | ✅ | 部分 |
| ARIA 角色/屬性正確性 | ✅ | — |
| **僅鍵盤可完成主流程**（Tab/Enter/Esc） | — | ✅ |
| **焦點順序與焦點可見** | 部分 | ✅ |
| **螢幕報讀器語意正確** | — | ✅ |

---

## 四、完成門檻（與 SKILL.md 一致）

```text
[必須] 核心頁面/元件有可執行 a11y 測試，實際執行並附終端機證據
[必須] 鎖定 WCAG 等級（預設 wcag2a + wcag2aa）並斷言 violations 為空
[必須] 暫時豁免的規則須明確標註並列入 qa-summary.md 缺口，不得靜默忽略
[必須] 不得以「axe 0 violations」宣稱完全無障礙；鍵盤/報讀器類人工項須誠實標記
```
