# Function Map — clothes AI

## 一、文件目的

整理 clothes AI 的主要功能分層、檔案、相依關係與測試覆蓋現況。

---

## 二、功能地圖總覽

| 功能模組 | 功能說明 | 入口 | 測試方向 | 優先級 |
|---|---|---|---|---|
| 主流程 / 冪等性 | 日期 lock、流程編排 | `main.py` | 正向、異常（lock 已存在）、跨午夜邊界 | High |
| Data Layer | 天氣 / 趨勢 / 節慶 抓取 | `src/data_layer/*.py` | 快取命中 / API 錯誤 / 重試 | High |
| Brain Layer | Gemini 生成配色 JSON + Schema 驗證 | `src/brain_layer/outfit_generator.py` | Schema 嚴謹度、#RGB→#RRGGBB 修正、重試 | High |
| Render Layer（色卡） | Playwright 渲染 HTML→PNG | `src/render_layer/renderer.py` | HTML 模板、PNG 尺寸、Jinja2 placeholder 殘留 | High |
| Render Layer（穿搭照） | Gemini 圖像 → PNG | `src/render_layer/outfit_photo_generator.py` | API 重試、白人形模特 prompt 一致性 | Medium |
| Delivery Layer | Telegram send_media_group | `src/delivery_layer/telegram_bot.py` | 分批（>10 張）、檔案不存在、Timeout 重試 | High |
| CI / 自動化 | GitHub Actions 排程（已停用） | `.github/workflows/ci.yml` | 純測試流程，無 schedule | Medium |

---

## 三、Web 頁面清單

不適用 — 本專案非 Web App，無使用者介面。輸出為 `output/*.png` 與 Telegram 訊息。

---

## 四、外部 API 依賴

| 服務 | 用途 | 是否需要 API Key | 計費 |
|---|---|---|---|
| OpenWeatherMap | 取得當前天氣 | 是（OPENWEATHER_API_KEY） | 免費方案 60 calls/min |
| Google Gemini（文字） | 生成 2 組穿搭 JSON | 是（GEMINI_API_KEY） | **計費**（gemini-2.5-flash-lite） |
| Google Gemini（圖像） | 生成 AI 穿搭照 | 是（同上） | **計費** |
| Telegram Bot API | 推送圖片至 chat | 是（TELEGRAM_BOT_TOKEN + CHAT_ID） | 免費，但有 rate limit |
| Vogue / Pinterest RSS | 趨勢資料 | 否 | 免費 |

---

## 五、檔案 / 模組對照

### 5.1 Data Layer

| 檔案 | 行數 | 主要 API | 例外類別 |
|---|---:|---|---|
| `weather.py` | 85 | `get_weather(city=None)` | `WeatherError` |
| `trends.py` | 96 | `get_trends()` | `TrendsError` |
| `festivals.py` | 31 | `get_today_festival(date)` | `FestivalsError` |
| `music_trends.py` | 184 | （未被 main.py 引用） | — |

### 5.2 Brain Layer

| 檔案 | 行數 | 主要 API | 例外類別 |
|---|---:|---|---|
| `outfit_generator.py` | 192 | `generate_outfit(weather, trends, festival)` | `OutfitGeneratorError`、`SchemaValidationError` |

### 5.3 Render Layer

| 檔案 | 行數 | 主要 API | 例外類別 |
|---|---:|---|---|
| `renderer.py` | 144 | `render_color_card(group, gid, total, out_path)` | `RenderError` |
| `outfit_photo_generator.py` | 266 | `generate_outfit_photo(group, out_path)` | — |

### 5.4 Delivery Layer

| 檔案 | 行數 | 主要 API | 例外類別 |
|---|---:|---|---|
| `telegram_bot.py` | 110 | `send_photos(paths, caption='')` | `TelegramBotError` |

### 5.5 主流程

| 檔案 | 行數 | 主要 API |
|---|---:|---|
| `main.py` | 138 | `main()` → `asyncio.run(_run())` |

**程式碼總行數**：1246 行（不含 tests）

---

## 六、功能相依關係

```text
main.py
  └─► (1) 冪等性 Lock 檢查（output/YYYY-MM-DD.lock）
  └─► (2) Data Layer（並行）
         ├─► weather.get_weather()      ← OpenWeather API（含 3h 快取）
         ├─► trends.get_trends()        ← RSS
         └─► festivals.get_today_festival()  ← 靜態 JSON
  └─► (3) Brain Layer
         └─► outfit_generator.generate_outfit(weather, trends, festival)
                ↑ 依賴 Data Layer 全部完成
                └─► Gemini API（gemini-2.5-flash-lite）
                       └─► 回 2 組 groups JSON
  └─► (4) Render Layer × 2（色卡，並行）
         └─► renderer.render_color_card(group, ...)
                └─► Playwright + Jinja2 → PNG
  └─► (5) Render Layer × 2（穿搭照，並行）
         └─► outfit_photo_generator.generate_outfit_photo(group, ...)
                └─► Gemini 圖像生成 API → PNG
  └─► (6) Delivery Layer
         └─► telegram_bot.send_photos([card1, photo1, card2, photo2], caption)
                └─► Telegram send_media_group（每批 ≤10 張）
  └─► (7) 寫入 Lock
```

---

## 七、測試覆蓋現況（依本次實測 `pytest --collect-only`）

| 測試檔 | `def test_` 數 | pytest 收集數（含參數化） |
|---|---:|---:|
| `tests/test_brain_layer.py` | 19 | — |
| `tests/test_data_layer.py` | 11 | — |
| `tests/test_delivery_layer.py` | 18 | — |
| `tests/test_render_layer.py` | 15 | — |
| **總計** | **63** | **65** |

> 65 / 65 全部通過（執行時間 33.13 秒）。詳見 evidence-log.md § CMD-005。

---

## 八、高風險功能標記

| 功能 | 風險說明 | 建議優先測試原因 |
|---|---|---|
| `outfit_generator.py` Schema 驗證 | Gemini 回應結構若改變即整個流程停擺 | 已有 19 個測試，仍建議補上「Gemini API 升級」回歸測試清單 |
| `main.py` 冪等性 Lock | 跨午夜執行 / 手動刪 lock 行為未驗證 | 主流程入口，邊界錯誤會造成重複生成 / 重複扣費 |
| Telegram send_media_group | 圖片不存在 / Timeout / API rate limit | Delivery 是流程末端，失敗會浪費前面 API 費用 |
| `.env` 內含實際付費 API Key | Gemini key 一旦外洩會被濫用，產生實際雲端帳單 | 需確認從未 commit 過 |
| Gemini API 計費 | 每日執行 4 次圖像生成（2 色卡 + 2 穿搭照） | 雲端成本控制 |

---

## 九、本次測試範圍決定

| 功能 | 是否納入本次測試 | 未納入原因 |
|---|---|---|
| pytest 完整套件 | 是 | 本機 Python 3.12 + pytest 9.0.3 已就緒 |
| 各模組靜態語法檢查 | 是 | `python -m py_compile` × 8 |
| 程式碼審查（main / brain / weather / telegram / render） | 是 | 找出文件與實作不一致、邊界 bug |
| `python main.py` 端到端 | 否 | 會呼叫 Gemini（計費）+ 推送至實際 Telegram chat |
| `playwright install chromium` | 否 | 已安裝 |
| Docker 建置 | 否 | 專案無 Dockerfile（README 列為 Next Steps） |
| `music_trends.py` 與 `media_layer/` | 否 | 主流程未引用，標為 Out of Scope |
| `ai_sop_toolkit/` 子專案 | 否 | gitignore 註明為獨立子專案 |
