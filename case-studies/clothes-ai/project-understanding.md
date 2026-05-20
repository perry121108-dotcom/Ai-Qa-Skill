# Project Understanding — clothes AI

## 一、文件目的

本文件由 AI QA 測試人員依 `skills/ai-qa-skill/` 規則建立，紀錄本次測試前對 clothes AI 專案的理解，作為後續測試案例設計依據。

---

## 二、專案基本資訊

| 項目 | 內容 |
|---|---|
| 專案名稱 | clothes AI（每日 AI 穿搭圖片生成與 Telegram 自動交付） |
| 讀取時間 | 2026-05-20 |
| 技術棧 | Python 3.12 + asyncio + Playwright + Jinja2 + Google Gemini API + Telegram Bot API + OpenWeatherMap API |
| 套件管理器 | pip（依 `requirements.txt`） |
| 主要語言 | Python |
| 專案類型 | CLI 自動化工作流（每日定時執行，產出圖片並推送 Telegram） |
| 部署方式 | 本機 cron / 雲端 VM cron / GitHub Actions schedule（README 第 144 行明示「intentionally documented but not enabled」） |

---

## 三、已閱讀文件清單

| 文件 | 是否存在 | 備註 |
|---|---|---|
| README.md | 是 | 含 Showcase、Tech Stack、Setup、Run、Test、CI 範例 |
| requirements.txt | 是 | aiohttp / google-genai / playwright / python-telegram-bot / pytest 等 |
| .env.example | 是 | OPENWEATHER / GEMINI / TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID 範本 |
| .env | 是 | **本機存在實際 API Key（已於 .gitignore 中排除）** — 詳見 bug-report.md BUG-001 |
| .gitignore | 是 | 排除 .env、output/、cache/、__pycache__、venv、媒體檔等 |
| PROJECT_RULES.md | 是 | V1.0 規格（含已停用之短影音 / FFmpeg / Claude API 設計） |
| CLAUDE.md | 是 | 開發行為準則（角色制：Builder / Liaison） |
| AGENTS.md | 是 | （未深入讀取） |
| PORTFOLIO_NOTES.md | 是 | 作品集說明 |
| TASK.md | 是 | 任務清單 |
| main.py | 是 | 主流程 138 行 |
| src/ | 是 | 4 個分層：data_layer / brain_layer / render_layer / delivery_layer |
| tests/ | 是 | 4 個測試檔，共 63 個 `def test_`（pytest 實際收集 65 個案例，含參數化） |
| .github/workflows/ci.yml | 是 | Python 3.12 + pip install + playwright install + pytest |
| Dockerfile | 否 | README 第 192 行明示為 Next Steps |

---

## 四、專案用途理解

**1. 這個專案是做什麼用的？**

clothes AI 是一個「每日自動執行」的 AI 穿搭內容生成工作流：抓天氣 / 趨勢 / 節慶 → 用 Google Gemini 生成 2 組配色穿搭 JSON → 以 Playwright + Jinja2 渲染色塊卡片 PNG → 用 Gemini 圖像生成 AI 穿搭照 → 透過 Telegram Bot 推送圖片至開發者手機。整體採「冪等性 Lock」設計，當日重複執行不會重複產出。

**2. 主要目標使用者是誰？**

- 穿搭內容創作者（README）
- 開發者本人作為作品集 demo（PORTFOLIO_NOTES.md / PROJECT_RULES.md）

**3. 核心解決的問題是什麼？**

- 「每日手動製作穿搭內容費時費力」(PROJECT_RULES.md § 2)
- 展示「AI 自動化工作流」的端到端能力（而非只是單一 prompt demo）

---

## 五、核心功能清單

| 功能名稱 | 功能說明 | 是否可測試 | 備註 |
|---|---|---|---|
| 天氣抓取 | `src/data_layer/weather.py`，OpenWeatherMap API + 3 小時快取 + 3 次重試 | 是（pytest 已覆蓋） | TestWeather × 3 cases |
| 趨勢抓取 | `src/data_layer/trends.py`，Vogue RSS 等 | 是 | TestTrends |
| 節慶識別 | `src/data_layer/festivals.py`，靜態 JSON 對照表 | 是 | TestFestivals |
| 音樂趨勢 | `src/data_layer/music_trends.py`（音樂版權守則嚴格） | 部分 | 程式碼存在但本次未列入測試 |
| Brain Layer | `src/brain_layer/outfit_generator.py`，Gemini 2.5-flash-lite 生成 2 組配色 JSON + Schema 驗證 + 3 次重試 + #RGB→#RRGGBB 自動修正 | 是（pytest 19 cases） | 含 Mock 測試 |
| 色卡渲染 | `src/render_layer/renderer.py`，Playwright + Jinja2 → 1080×1920 PNG | 是（pytest 15 cases） | 含 HTML 內容驗證 + 實際 PNG 產出 |
| AI 穿搭照 | `src/render_layer/outfit_photo_generator.py`，Gemini 圖像生成 | 部分 | Mock 測試為主 |
| Telegram 推送 | `src/delivery_layer/telegram_bot.py`，send_media_group 分批（每批 10 張）+ 3 次重試 + 60s timeout | 是（pytest 18 cases） | Mock 測試 |
| 冪等性 Lock | `main.py:34-44`，每日 lock 檔避免重複生成 | 是（程式碼審查） | 未專屬測試 |

---

## 六、可用測試指令

| 指令 | 是否存在 | 備註 |
|---|---|---|
| `pip install -r requirements.txt` | 是 | 本次未重裝（依賴已在系統中） |
| `python -m pytest --tb=short -q` | 是 | **本次實際執行：65 passed in 33.13s** |
| `python -m pytest --collect-only -q` | 是 | 本次實際執行：65 tests collected |
| `python main.py` | 是 | **未執行**（會觸發 Gemini API 計費 + 推送至實際 Telegram chat） |
| `playwright install chromium` | 是 | 本次未執行（依賴已存在） |
| `python -m py_compile <file>` | 是 | 本次對 8 個主要模組執行靜態語法檢查，全數通過 |
| `flake8 .` / `ruff check .` | 否 | 專案未提供 lint 設定 |

---

## 七、測試環境資訊

| 項目 | 內容 |
|---|---|
| 作業系統 | Windows 11 Home 10.0.26200 |
| Python 版本 | 3.12.10（與 CI 設定的 3.12 一致） |
| pytest 版本 | 9.0.3 |
| 瀏覽器 | Playwright Chromium（render_layer 測試實際使用，已安裝） |
| 本地服務啟動 URL | 不適用（非 web service） |
| 環境變數是否齊全 | 是（`.env` 內 5 個變數皆已填入，含 OpenWeather / Gemini / Telegram） |

---

## 八、不確定項目

| 項目 | 疑問說明 | 影響範圍 |
|---|---|---|
| PROJECT_RULES.md 與實際實作不一致 | PROJECT_RULES.md § 4 寫「Claude API + Edge TTS + FFmpeg + 15 秒 MP4」，但實際 `requirements.txt` 用 `google-genai`、`main.py` 產出靜態 PNG。README 第 18 行有解釋 pivot，但 PROJECT_RULES.md 未更新 | 文件可信度 / AI 開發工具誤導 |
| `main.py` docstring vs 實際輸出 | docstring 第 3 行「生成 4 組配色」+ 第 9 行「Telegram 傳送 8 張圖片」，但 `outfit_generator.py:99` 強制 2 組、`main.py:113` 實際傳送 `len(groups)*2 = 4` 張 | 文件可信度 |
| `music_trends.py` 用途 | data_layer 內存在 184 行 music_trends.py，但 main.py 未引用，CLAUDE.md「音樂版權守則」也強調謹慎使用 | 可能為遺留程式碼 |
| `ai_sop_toolkit/` 子專案 | `.gitignore` 第 40 行「獨立子專案（有自己的 git）」 — 與本專案的關係不明 | 範圍外，不納入本次 QA |
| `media_layer/` | `src/` 下有 `media_layer/` 但 ls 未列出檔案 | 推測為 V1.0 短影音遺留結構 |
| `output/*.lock` 與時區 | `_check_lock` 用 `datetime.now()`（local time），跨午夜時區邊界行為未驗證 | Edge case |

---

## 九、AI QA 理解確認聲明

```text
本文件由 AI QA 測試人員依照專案現有文件整理。
本次測試以「pytest 完整套件實測 + 8 個主要模組靜態語法檢查 + 程式碼審查」為主，
未執行 `python main.py`（避免觸發 Gemini / Telegram API 實際呼叫與計費）。
詳細限制見 qa-report.md 第十三節「風險與限制」。
若實際功能與本文件記載不符，請在 decision-log.md 中更新。
```
