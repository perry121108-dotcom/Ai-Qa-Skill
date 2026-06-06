# AI QA Skill

> 讓 AI Coding Agent 扮演「**測試自動化架構師（SDET）**」的技能庫。
> 適用於 Claude Code、Codex、Cursor、GitHub Copilot CLI、Gemini CLI 等任何能讀檔的 AI Agent。

---

## 一、這是什麼？

**AI QA Skill** 是一份可被任何 AI Agent 讀取執行的 QA 技能庫。讀取後，AI 不再只寫散文式報告，而是：

1. 把自己當成 **SDET（測試自動化架構師）**，不是開發者
2. 辨識技術棧 → 鎖定測試框架（Vitest / Jest / Pytest；Web E2E 用 Playwright）
3. **撰寫可執行的測試程式碼**（涵蓋正向 / 反向 / 邊界 / 異常）
4. **實際執行**測試與靜態分析，貼上真實終端機證據（指令 + 輸出 + exit code + 覆蓋率）
5. 對 **AI/LLM 輸出**做三維度評估（schema 強固性 / 防越獄注入 / 幻覺誠信）
6. 為每個已修 Critical/Major Bug 留下 **Red→Green 永久回歸測試**
7. 不會偷偷改你的正式程式碼

> **唯一完成門檻**：可執行測試實際通過並附終端機證據。「填完報告模板」不等於完成。

閉環流程：

```text
AI QA（寫測試 + 跑測試 + 留證據） → 交出失敗清單 → AI Dev 修正 → 回歸測試轉綠
```

---

## 二、和一般 QA skill 有何不同？（核心賣點）

| 差異點 | 說明 |
|---|---|
| ⭐ **三維度 LLM Evaluation** | 多數 QA skill 只測傳統功能，**不驗 AI 輸出本身**。本技能庫強制驗證 LLM 輸出的 JSON schema、防越獄/提示注入、幻覺與誠信邊界——這是 AI 時代專案的真空地帶。 |
| ⭐ **Red→Green 回歸鐵律** | Bug 修正不能只寫報告，必須先寫能重現失敗（red）的測試，修復後轉綠（green），永久納入回歸測試集。 |
| ⭐ **Executable-first 反形式主義** | 要真實終端機證據（stdout / exit code / coverage）才算 Pass；無法執行者誠實標 Blocked / Not Run，**不得偽裝 Pass**。 |
| **繁體中文在地化** | 人類可讀結論（`qa-summary.md`）一律繁體中文。 |

---

## 三、目錄結構

```text
your-project/
├── skills/
│   └── ai-qa-skill/
│       ├── SKILL.md                     ← 入口：角色 + 七步 + LLM eval + 回歸 + 門檻
│       ├── README.md                    技能庫總說明與檔案索引
│       ├── QA_AGENT_ROLE.md             角色紀律、Severity / Priority / Status 定義
│       ├── QA_TESTING_SOP.md            技術棧→框架對照、測試生成鐵律、LLM 評估細節、執行指令
│       ├── WEB_QA_RULES.md              Web 測試範圍
│       ├── CLI_QA_RULES.md              CLI 驅動測試流程與技術棧判斷
│       ├── OUTPUT_RULES.md              輸出位置與截圖命名規範
│       ├── AI_AGENT_EXECUTION_PROMPT.md 貼給其他 AI Agent 的執行/修正指令
│       └── *_TEMPLATE.md                選用的報告模板（非完成門檻）
│
├── qa-reports/                          ← qa-summary.md 等輔助文件
└── screenshots/                         ← 測試證據截圖
```

---

## 四、5 分鐘快速開始

### Step 1 — 把 Skill 複製到你的專案

```bash
git clone https://github.com/perry121108-dotcom/Ai-Qa-Skill.git
cp -r Ai-Qa-Skill/skills your-project/
```

```powershell
# PowerShell
git clone https://github.com/perry121108-dotcom/Ai-Qa-Skill.git
Copy-Item -Recurse Ai-Qa-Skill\skills your-project\
```

### Step 2 — 開啟你的 AI Coding Agent

任選：Claude Code、Codex、Cursor、GitHub Copilot CLI、Gemini CLI。支援 SKILL.md 的工具會**自動觸發**本技能庫。

### Step 3 — 把以下指令貼給 AI

> 完整可貼版本見 [`skills/ai-qa-skill/AI_AGENT_EXECUTION_PROMPT.md`](skills/ai-qa-skill/AI_AGENT_EXECUTION_PROMPT.md)。最短版本：

```text
請依照 /skills/ai-qa-skill/SKILL.md 的規則為本專案執行 QA。
你現在的角色是測試自動化架構師（SDET），核心產出是可執行測試 + 真實終端機證據。
除非我明確要求，否則不得修改正式程式碼，但必須撰寫測試程式碼。
最後給我通過/失敗清單與修正優先序（qa-summary.md），不要直接改程式碼。
```

### Step 4 — 修正循環

當你準備好讓 AI 修 Bug 時再貼：

```text
請依測試失敗結果與 qa-summary.md 修正本專案，優先處理 Critical / Major。
每個 Bug 先確保回歸測試為 red，修復後轉 green，並重跑完整測試套件貼上證據。
```

---

## 五、AI 會產出什麼？

| 類型 | 內容 | 是否完成門檻 |
|---|---|:--:|
| **可執行測試檔** | `*.test.ts` / `test_*.py`；涵蓋正向/反向/邊界/異常 | ✅ 必須 |
| **LLM 評估測試** | schema 強固性 / 防越獄 / 幻覺誠信（有 LLM 呼叫點時） | ✅ 必須 |
| **回歸測試** | 每個已修 Critical/Major Bug 的 red→green 測試 | ✅ 必須 |
| **終端機證據** | 指令 + stdout/stderr + exit code + 覆蓋率 | ✅ 必須 |
| `qa-summary.md` | 通過/失敗清單、覆蓋缺口、修正優先序（繁中） | 輔助 |
| `*_TEMPLATE.md` 報告 | 選用的詳細報告（project-understanding / bug-report 等） | 選用 |

> 詳細分類定義（Status / Severity / Priority）見 [`skills/ai-qa-skill/QA_AGENT_ROLE.md`](skills/ai-qa-skill/QA_AGENT_ROLE.md)；完整流程與門檻見 [`skills/ai-qa-skill/SKILL.md`](skills/ai-qa-skill/SKILL.md)。

---

## 六、技術棧支援

AI QA 會自動判斷技術棧並選對應指令集：

| 判斷依據 | 技術棧 | 測試框架 |
|---|---|---|
| `package.json` | Node.js（依 lockfile 選 npm / pnpm / yarn） | Vitest / Jest |
| `requirements.txt` / `pyproject.toml` / `setup.py` | Python | Pytest |
| 需 Web E2E | 任意 | Playwright |
| 兩者皆無 | 不明 | 標記 Blocked |

詳細對照與執行指令見 [`skills/ai-qa-skill/QA_TESTING_SOP.md`](skills/ai-qa-skill/QA_TESTING_SOP.md) 與 [`skills/ai-qa-skill/CLI_QA_RULES.md`](skills/ai-qa-skill/CLI_QA_RULES.md)。

---

## 七、實戰案例（Case Studies）

想看 Skill 跑完一輪的真實輸出，請看 [case-studies/](case-studies/)。

| 案例 | 專案類型 | 技術棧 | 內建測試 | QA 通過率 |
|---|---|---|---|---:|
| [clothes-ai](case-studies/clothes-ai/) | CLI 自動化工作流 | Python 3.12 + Gemini + Telegram | 65 / 65 pytest | 80.0% |

---

## 八、適用對象

| 你是 | 你會用到的 |
|---|---|
| 新手 QA / 求職者 | 練手、做作品集 |
| 個人開發者 / Indie Hacker | 補上沒人幫你寫的測試與回歸網 |
| 小型團隊 | PR 前的自動 QA 第一道 |
| AI Agent 使用者 | 給 AI 一個明確的 SDET 角色與可執行門檻 |
| 做 AI / LLM 應用者 | 用三維度 eval 守住 AI 輸出品質 |

---

## 九、FAQ

**Q：這需要付費嗎？** 不需要，MIT 授權。

**Q：AI 一定會照做嗎？** 規則明確，遵守度取決於模型能力；Claude 4.x / GPT-5 / Gemini 2.x 等較新模型通常遵守度高。

**Q：報告必須繁體中文嗎？** 人類可讀結論（`qa-summary.md`）是。測試程式碼依專案慣例命名。

**Q：沒有測試框架的專案怎麼辦？** 導入最小可行設定（預設 Vitest / Pytest），**不得**以「沒有框架」當作不寫測試的藉口。

---

## 十、貢獻 / 授權

歡迎 PR：新增語言版本、補特定框架（Django / Rails / Spring Boot…）測試指令、補 AI Agent 使用範例、修正錯字。

MIT License — 自由使用、修改、商用、再散布。

- GitHub: <https://github.com/perry121108-dotcom/Ai-Qa-Skill>
- 技能庫入口: [`skills/ai-qa-skill/SKILL.md`](skills/ai-qa-skill/SKILL.md)
- 完整規格原稿: [`ai_qa_skill_完整整合版.md`](ai_qa_skill_完整整合版.md)
