# Case Study：clothes AI

> AI QA Skill 套用在 [clothes AI](https://github.com/perry121108-dotcom/clothes-AI) 的完整輸出。

---

## 受測專案簡介

**clothes AI** 是一個每日自動執行的 AI 穿搭內容生成工作流：

```text
天氣 / 趨勢 / 節慶 → Gemini 生成 2 組配色 JSON
                  → Playwright + Jinja2 渲染色卡 PNG
                  → Gemini 圖像生成 AI 穿搭照
                  → Telegram Bot 推送至手機
```

- 技術棧：Python 3.12 + asyncio + Playwright + Google Gemini API + Telegram Bot API
- 架構：4 層（data / brain / render / delivery）
- 內建測試：4 個檔案、65 個 pytest 案例

---

## QA 執行摘要

| 項目 | 結果 |
|---|---|
| 測試日期 | 2026-05-20 |
| 測試人員 | AI QA 測試人員（依本 Skill 規則執行） |
| 測試環境 | Windows 11 / Python 3.12.10 / pytest 9.0.3 |
| 測試手段 | pytest 完整套件實測 + 程式碼審查 + 模組載入測試 |
| 不執行的指令 | `python main.py`（會觸發 Gemini 計費 + 真實 Telegram 推送） |

---

## 關鍵數據

- **`python -m pytest --tb=short -q` → 65 passed in 33.13s**（與專案 README 宣告完全一致）
- 8 個主要模組 `python -m py_compile` 全過
- 4 個 layer `import` 全部 OK
- 30 個 QA 案例：24 Pass / 5 Fail / 1 Not Run
- **QA 通過率：80.0%**
- 識別 Bug：7 個（1 Major / 3 Minor / 3 Trivial）

---

## 識別的 Bug

| Bug | 嚴重度 | 優先級 | 摘要 |
|---|---|---|---|
| BUG-001 | Major | Medium | `.env` 含實際 Gemini（計費）+ Telegram bot token，需確認從未誤 commit |
| BUG-002 | Minor | Medium | `main.py` docstring 寫「4 組 / 8 張」，實作為「2 組 / 4 張」 |
| BUG-003 | Minor | Medium | `PROJECT_RULES.md` 為 V1.0 短影音規格，pivot 後未更新，違反自家 Document-Driven 原則 |
| BUG-004 | Minor | Low | `requirements.txt` 含 `edge-tts`、`ffmpeg-python` 等 dead deps |
| BUG-005 | Trivial | Low | `main.py` 輸出檔名用 `g['id']` 無唯一性檢查 |
| BUG-006 | Trivial | Low | 未配置 lint（ruff / flake8） |
| BUG-007 | Trivial | Low | `telegram_bot.py` success path 無 try/finally 保障 file handle |

詳細重現步驟與 code diff 修正建議見 [bug-report.md](bug-report.md)。

---

## 8 份完整報告

| # | 檔案 | 用途 |
|---:|---|---|
| 1 | [project-understanding.md](project-understanding.md) | AI 對專案的理解（技術棧、可測範圍、不確定項目） |
| 2 | [function-map.md](function-map.md) | 4 層架構 + 外部 API 依賴 + 高風險功能 |
| 3 | [test-cases.md](test-cases.md) | 30 個 QA 案例（正向 / 反向 / 邊界 / 安全 / 文件一致性） |
| 4 | [evidence-log.md](evidence-log.md) | 23 條指令紀錄 + 8 段程式碼審查證據 + pytest 完整輸出 |
| 5 | [bug-report.md](bug-report.md) | 7 個 Bug 完整重現步驟 + code diff 修正建議 |
| 6 | [coverage-summary.md](coverage-summary.md) | 通過率、漏測提醒、9 項補測建議（10 小時） |
| 7 | [qa-report.md](qa-report.md) | **主報告** — 摘要、結論、修正優先順序 P0~P3 |
| 8 | [decision-log.md](decision-log.md) | 11 項本次決策 + Skill 自身的 meta 觀察 |

> retest-report.md 條件性跳過（無 Bug 修復行為）。

---

## 觀察重點

### 這次 demo 驗證了 Skill 的 8 項能力

| Skill 能力 | 實際表現 |
|---|---|
| 自動進入 QA 角色 | 沒主動修任何程式碼 |
| **Python 技術棧支援** | 自動選擇 pytest / py_compile / pip 指令路徑 |
| 直接執行真實測試套件 | pytest 65/65 全過，取得可量化數據 |
| 對計費 API 的測試克制 | 主動跳過 `python main.py`，避免觸發 Gemini 計費 |
| 跨檔比對找文件落差 | docstring vs schema、README vs PROJECT_RULES、requirements vs 實際 import |
| Severity / Priority 兩軸分級 | 7 個 Bug 分到合理桶位 |
| 繁體中文輸出 | 8 份報告皆繁中、段落流暢 |
| 機密保護 | 不揭露任何實際 API key 值 |
| 條件性輸出 | retest-report.md 因規則自動跳過 |

### Skill 還沒驗證的能力

- **修正階段（retest 流程）** — 本案例尚未進入
- **跨 AI Agent 一致性** — 目前僅 Claude Opus 4.7 跑過

---

## 如何在你的專案重現這份輸出

1. 把這份 [skills/ai-qa-skill/](../../skills/ai-qa-skill/) 複製到你的專案
2. 開 Claude Code / Codex / Cursor / Gemini CLI 任一個
3. 貼 [AI_AGENT_EXECUTION_PROMPT.md](../../skills/ai-qa-skill/AI_AGENT_EXECUTION_PROMPT.md) 的內容
4. 等 AI 跑完一輪，檢視你專案的 `/qa-reports/`
