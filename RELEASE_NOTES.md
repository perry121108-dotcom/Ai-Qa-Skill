# AI QA Skill v1.0.0 — Release Notes

> **唯一系統性測「AI 輸出本身」的 QA Skill** —— 給 AI Coding Agent 的 SDET 技能庫。
> 適用 Claude Code、Codex、Cursor、GitHub Copilot CLI、Gemini CLI。

---

## 🎯 主打功能：三維度 LLM 輸出評估（對標 OWASP LLM Top 10 2025）

別的 QA skill 測「功能對不對」；本 Skill 額外**系統性測「AI 輸出本身」**——這是 AI 時代多數工具的盲區。

| 維度 | OWASP | 內容 | 工具 / 資產 |
|---|---|---|---|
| **結構強固性** | `LLM05` | JSON schema 契合、畸形/圍欄容錯、**契約漂移偵測** | `schema-signature.mjs` |
| **防越獄與安全** | `LLM01·02·07` | 注入不覆寫角色、機密/系統提示不外洩 | 內建**攻擊語料庫**（22 payload，含繁中/多輪/編碼繞過） |
| **誠信邊界** | `LLM09` | 缺資料不臆造、主張對 context 比對 | `groundedness.mjs` + LLM-as-judge 範式 |

搭配 **Red→Green 鐵律**：每個破口先寫紅、修復轉綠、payload 永久回歸（語料庫只增不減）。

---

## ✅ Worked Example（真實證據，非範本）

對一個 Python + Gemini 專案（clothes-AI）套用本 Skill：

```text
基線 65 → 加三維度 eval → 找到並修復 4 個缺口（Red→Green）→ 107 passed
LLM 呼叫點覆蓋率 99% · OWASP LLM01/02/05/07/09 全覆蓋
```

完整紀錄：[`case-studies/clothes-ai/optimized/`](case-studies/clothes-ai/optimized/)

---

## 📊 與 GitHub 熱門 QA skill 差異表（節錄）

| 能力 | **本 Skill** | fugazi | mfaisalkhatri | qaskills | neonwatty | alirezarezvani |
|---|:--:|:--:|:--:|:--:|:--:|:--:|
| **三維度 LLM 輸出評估** | ✅ **獨有** | ❌ | ❌ | ❌ | 🟡 | ❌ |
| Red→Green 寫進完成門檻 | ✅ | 🟡 | ❌ | 🟡 | 🟡 | 🟡 |
| 真實 worked example | ✅ 99% | 🟡 | 🟡 | ❌ | 🟡 | ❌ |
| 輕量、CI 原生（住測試框架） | ✅ | 🟡 | ❌ | 🟡 | ✅ | ✅ |
| 繁體中文在地化 | ✅ **獨有** | ❌ | ❌ | ❌ | ❌ | ❌ |

完整差異表、健檢與優劣勢：[`COMPARISON.md`](COMPARISON.md)

---

## 📦 安裝

```text
/plugin marketplace add perry121108-dotcom/Ai-Qa-Skill
/plugin install ai-qa-skill@ai-qa-skill-marketplace
```

或手動：`cp -r Ai-Qa-Skill/skills your-project/`。入口為 [`skills/ai-qa-skill/SKILL.md`](skills/ai-qa-skill/SKILL.md)。

---

## 📋 本版內容

- **核心**：`SKILL.md`（可自動觸發）、executable-first 完成門檻、Red→Green 回歸
- **三維度 LLM 評估**：OWASP 對標、攻擊語料庫、schema 漂移、groundedness、工具橋接（promptfoo/garak/PyRIT）
- **框架覆蓋**：Vitest/Jest/Pytest/Playwright + API + axe-core 無障礙
- **文件範本**：需求 / 測試計畫（含 RTM）/ 測試案例 / Bug / QA 報告
- **工具**：覆蓋缺口掃描、schema 簽章、groundedness 基線（皆零相依）
- **打包**：Claude Code plugin + marketplace、GitHub Actions CI 範例
- **附加**：AI 重複碼 / DRY 守門（jscpd，非核心門檻）

---

## 🚧 Roadmap

效能（k6）、視覺回歸、行動（Appium）、契約（Pact）；LLM eval 深化（多輪對話、工具呼叫安全、RAG 來源可追溯）。

---

## 授權

MIT · [GitHub](https://github.com/perry121108-dotcom/Ai-Qa-Skill)
