# AI QA Skill — 對比與健檢（賣點文件）

> 本文件用來對外說明 AI QA Skill（executable-first / SDET 版）的定位、與 GitHub 熱門 QA skill 的差異，以及項目健檢結果。
> 現行權威規格以 [`skills/ai-qa-skill/SKILL.md`](skills/ai-qa-skill/SKILL.md) 為準。

---

## 一、一句話定位

**唯一系統性測「AI 輸出本身」的 QA Skill** —— 不只跑功能測試，還用三維度 LLM Evaluation 守住 AI 輸出的**結構 / 安全 / 誠信**，並以真實終端機證據作為唯一完成標準。

---

## 二、項目健檢（最後更新：2026-06-07）

| 檢查項 | 結果 |
|---|---|
| 檔案結構 | 27 個 skill 檔 + 17 個案例檔，齊全 |
| `SKILL.md` frontmatter | ✅ `name` + 含觸發詞的 `description` + `license`，可被 Claude Code / Cursor / Codex 自動觸發 |
| `plugin.json` / `marketplace.json` | ✅ JSON 有效，可 `/plugin install` 一鍵安裝 |
| 輔助腳本 `find-untested.mjs` | ✅ 可執行（覆蓋缺口掃描） |
| `SKILL.md` 內部連結 | ✅ 11 個引用檔全部存在，無斷鏈 |
| 文件一致性 | ✅ 全面對齊 executable-first；舊框架僅存在於刻意保留的對比欄與歷史橫幅 |
| 殘留 TODO / placeholder | ✅ 無 |
| 實戰案例測試（clothes-ai） | ✅ 89 passed, 0 xfailed；LLM 呼叫點覆蓋率 99% |

**結論：技術完善度已達對外發布水準。** 待補項屬功能廣度的 roadmap，非缺陷。

---

## 三、與 GitHub 熱門 QA skill 差異表

對比對象：
- [fugazi/test-automation-skills-agents](https://github.com/fugazi/test-automation-skills-agents)（~159⭐）
- [mfaisalkhatri/Manual_Testing](https://github.com/mfaisalkhatri/Manual_Testing)（~482⭐）
- [PramodDutta/qaskills](https://github.com/PramodDutta/qaskills)
- [neonwatty/qa-skills](https://github.com/neonwatty/qa-skills)
- [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills)（337 skills）

| 能力面向 | **本 Skill** | fugazi | mfaisalkhatri | qaskills | neonwatty | alirezarezvani |
|---|:--:|:--:|:--:|:--:|:--:|:--:|
| SKILL.md + frontmatter（可自動觸發） | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| plugin / marketplace 一鍵安裝 | ✅ | ✅ | ❌ | 🟡 | ✅ | ✅ |
| **三維度 LLM 輸出評估**（schema / 越獄 / 幻覺） | ✅ **獨有** | ❌ | ❌ | ❌ | 🟡 僅對抗測 | ❌ |
| **Red→Green 回歸寫進完成門檻** | ✅ | 🟡 概念 | ❌ | 🟡 | 🟡 | 🟡 |
| Executable-first（測試+證據才算 Pass） | ✅ | 🟡 | ❌ 手測 | ✅ | ✅ | ✅ |
| **真實 worked example（找 bug→修→綠全紀錄）** | ✅ 99% 覆蓋 | 🟡 範例 | 🟡 範本 | ❌ | 🟡 | ❌ |
| 文件範本（需求 / 測試計畫 / RTM / Bug / 報告） | ✅ 全套 | ✅ | ✅ | 🟡 | 🟡 | 🟡 |
| 輔助腳本 + CI 範例 | ✅ | 🟡 | ❌ | 🟡 | ✅ | ✅ |
| 框架廣度（unit / E2E / API / a11y） | ✅ 4 類 | ✅ | 🟡 手測 | ✅✅ 最廣 | 🟡 E2E 強 | ✅✅ |
| 效能 / 視覺 / 行動 / 契約測試 | 🟡 roadmap | 🟡 | ❌ | ✅ | 🟡 行動 | 🟡 |
| 多 agent 角色分工 | ❌ 單一 SDET | ✅ | ❌ | ❌ | ✅ 6 agent | ✅ |
| 繁中在地化 | ✅ 獨有 | ❌ | ❌ | ❌ | ❌ | ❌ |
| 社群熱度（stars） | ❌ 新 repo | ✅ | ✅ | 🟡 | 🟡 | ✅ |

> ✅ = 完整　🟡 = 部分 / 概念　❌ = 無

---

## 四、優勢 / 待補

### 🏆 優勢（市場真空）

1. **三維度 LLM 輸出評估（對標 OWASP LLM Top 10 2025）** — 對比的熱門 repo **無一系統性測「AI 輸出本身」**（僅 neonwatty 摸到對抗測邊）。三軸直接對應 `LLM01` 提示注入、`LLM02` 機敏外洩、`LLM05` 不當輸出處理、`LLM07` 系統提示外洩、`LLM09` 錯誤資訊。這是 AI 時代的盲區，也是本 Skill 最強差異化。
2. **Red→Green 寫進完成門檻 + 真實 worked example** — clothes-ai 案例完整展示「找缺口 → RED → 修 → GREEN → 99% 覆蓋」，比「範本 / 範例」更有說服力。
3. **輕量、CI 原生** — LLM 評估是斷言式、住在你既有的 pytest/vitest，**不另裝掃描器、秒進 CI、天然納入回歸**，與 garak/PyRIT 等重型掃描器互補（需要深掃可橋接 promptfoo，見 `skills/ai-qa-skill/LLM_EVAL_TOOLING.md`）。
4. **繁體中文在地化** — 中文圈唯一。

### 🟡 待補（純廣度，非缺陷）

1. **框架廣度** — 目前 4 類（unit / E2E / API / a11y），尚未涵蓋 k6 效能 / 視覺回歸 / Appium 行動 / Pact 契約（已列 roadmap）。
2. **多 agent 分工** — 目前為單一 SDET 角色，未拆成多個專職 agent（如 smoke / security / perf）。
3. **社群熱度** — 新 repo，需時間與曝光累積（與技術完善度無關）。

---

## 五、適合誰用

| 你是 | 為什麼選本 Skill |
|---|---|
| 做 AI / LLM 應用的人 | 唯一系統性守住 AI 輸出品質（結構 / 安全 / 誠信） |
| 重視回歸紀律的團隊 | Bug 必留 Red→Green 永久回歸測試 |
| 中文團隊 / 求職作品集 | 繁中輸出 + 可展示的真實 worked example |
| AI Coding Agent 使用者 | 標準 SKILL.md，可自動觸發、一鍵安裝 |
