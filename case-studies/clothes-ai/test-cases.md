# Test Cases — clothes AI

> 本次 QA 測試共設計 30 個測試案例，狀態紀錄至 2026-05-20。
> 採「pytest 完整套件實測 + 程式碼審查 + 靜態語法檢查」進行，未執行 `python main.py`（避免 Gemini / Telegram 實際呼叫）。

## 測試案例總覽

| 測試編號 | 功能 | 情境 | 類型 | 優先級 | 狀態 |
|---|---|---|---|---|---|
| TC-001 | pytest 完整套件 | 全 65 案例 | 正向 | High | **Pass（實測）** |
| TC-002 | main.py 語法 | py_compile | 正向 | High | **Pass（實測）** |
| TC-003 | data_layer 模組編譯 | py_compile × 3 | 正向 | High | **Pass（實測）** |
| TC-004 | brain_layer 模組編譯 | py_compile | 正向 | High | **Pass（實測）** |
| TC-005 | render_layer 模組編譯 | py_compile × 2 | 正向 | High | **Pass（實測）** |
| TC-006 | delivery_layer 模組編譯 | py_compile | 正向 | High | **Pass（實測）** |
| TC-007 | 各 layer 可 import | import 測試 | 正向 | High | **Pass（實測）** |
| TC-008 | Brain Layer Schema 驗證 | groups != 2 拒絕 | 反向 | High | Pass（程式碼 + pytest 已覆蓋） |
| TC-009 | Brain Layer hex 修正 | #RGB → #RRGGBB | 邊界 | Medium | Pass（程式碼 + pytest 已覆蓋） |
| TC-010 | Brain Layer hex 格式錯誤 | 非合法 hex 拒絕 | 反向 | Medium | Pass（程式碼審查） |
| TC-011 | Brain Layer 重試機制 | 3 次重試後仍失敗則 raise | 異常 | High | Pass（pytest 已覆蓋） |
| TC-012 | Weather 快取 TTL | 3 小時內 hit cache | 正向 | Medium | Pass（程式碼審查） |
| TC-013 | Weather 快取城市不同 | 不同 city 不命中 | 邊界 | Medium | Pass（程式碼審查） |
| TC-014 | Weather API 401/403 | WeatherError 不重試 | 異常 | High | Pass（程式碼審查） |
| TC-015 | Weather 重試指數退避 | 2s / 4s | 正向 | Low | Pass（程式碼審查） |
| TC-016 | Telegram 圖片不存在 | 立即 raise | 反向 | High | Pass（程式碼 + pytest） |
| TC-017 | Telegram 分批 >10 張 | 自動切批 | 邊界 | Medium | Pass（程式碼 + pytest） |
| TC-018 | Telegram caption 超 1024 字元 | 截斷至 1024 | 邊界 | Medium | Pass（程式碼審查） |
| TC-019 | Telegram Timeout 重試 | 3 次 × 60s | 異常 | High | Pass（程式碼 + pytest） |
| TC-020 | 冪等性 Lock 存在 | 跳過執行 | 正向 | High | Pass（程式碼審查） |
| TC-021 | 冪等性 Lock 寫入時機 | 完成後才寫 | 正向 | High | Pass（程式碼審查） |
| TC-022 | Render Layer PNG 尺寸 | 1080×1920 | 正向 | Medium | Pass（pytest 已覆蓋） |
| TC-023 | Render Layer Jinja 模板殘留 | HTML 無 {{ }} | 正向 | Medium | Pass（pytest 已覆蓋） |
| TC-024 | 環境 — `.env` 在 .gitignore | git 設定 | 安全 | Critical | **Pass（實測）** |
| TC-025 | 環境 — `.env` 含實際 API Key | 本機留存 | 安全 | High | **Fail（建議輪換）** |
| TC-026 | main.py docstring vs 實作 | 「4 組」「8 張」與實際不符 | 文件 | Medium | **Fail（文件不一致）** |
| TC-027 | PROJECT_RULES.md vs 實作 | 「Claude API / FFmpeg / 15 秒 MP4」與實際不符 | 文件 | Medium | **Fail（規格過時）** |
| TC-028 | outfit filename 唯一性 | g['id'] 重複會覆寫 | 邊界 | Low | **Fail（無檢查）** |
| TC-029 | lint 工具 | 無 ruff / flake8 設定 | 缺陷 | Low | **Fail（缺乏）** |
| TC-030 | 跨午夜 Lock 行為 | datetime.now() 邊界 | 異常 | Low | **Not Run（需時序測試）** |

> 統計：Pass 24 / Fail 5 / Not Run 1 / Blocked 0
> 通過率：24 / 30 = **80.0%**

---

## TC-001：pytest 完整套件

### 測試功能
專案全測試套件

### 測試類型
正向（回歸）

### 優先級
High

### 測試步驟
1. `cd "D:/clothes AI"`
2. `python -m pytest --tb=short -q`

### 預期結果
README 第 140 行宣稱 `65 passed`。

### 實際結果
```
.................................................................        [100%]
65 passed in 33.13s
```

### 測試狀態
**Pass**（與 README 宣告完全一致）

---

## TC-002 ~ TC-006：各層模組 py_compile

### 測試功能
靜態語法檢查

### 測試類型
正向

### 優先級
High

### 測試步驟
```bash
python -m py_compile main.py
python -m py_compile src/data_layer/weather.py src/data_layer/trends.py src/data_layer/festivals.py
python -m py_compile src/brain_layer/outfit_generator.py
python -m py_compile src/render_layer/renderer.py src/render_layer/outfit_photo_generator.py
python -m py_compile src/delivery_layer/telegram_bot.py
```

### 實際結果
全部成功（無錯誤輸出）。

### 測試狀態
**Pass**（8 個檔案皆通過）

---

## TC-007：各 layer 可 import

### 測試功能
模組可載入性

### 測試類型
正向

### 優先級
High

### 測試步驟
```bash
python -c "from src.brain_layer import outfit_generator"
python -c "from src.data_layer import weather, trends, festivals"
python -c "from src.delivery_layer import telegram_bot"
python -c "from src.render_layer import renderer, outfit_photo_generator"
```

### 實際結果
四個 layer 全部 import OK。

### 測試狀態
**Pass**

---

## TC-008：Brain Layer Schema 驗證（groups 必為 2）

### 測試功能
`outfit_generator._validate`

### 測試類型
反向

### 優先級
High

### 測試步驟
1. 審查 `outfit_generator.py:96-99`：
   ```python
   if not isinstance(groups, list) or len(groups) != 2:
       raise SchemaValidationError(f"groups 必須恰好 2 組，目前：...")
   ```
2. 由 `tests/test_brain_layer.py` 中 `test_validate_*` 系列驗證。

### 實際結果
程式碼與測試皆覆蓋此情境。

### 測試狀態
Pass

### 備註
**注意 BUG-002**：`main.py` docstring 卻說「4 組」、「8 張圖片」— 與此處的 2 組強制檢查矛盾。

---

## TC-009：Brain Layer hex 自動修正

### 測試功能
`#RGB → #RRGGBB` 自動展開

### 測試類型
邊界

### 優先級
Medium

### 測試步驟
1. 審查 `outfit_generator.py:110-113`：
   ```python
   h = garment["hex"].strip()
   if len(h) == 4:  # #RGB → #RRGGBB
       h = "#" + "".join(c*2 for c in h[1:])
       garment["hex"] = h
   ```

### 實際結果
邏輯正確，且 `tests/test_brain_layer.py` 已有對應測試。

### 測試狀態
Pass

---

## TC-010：Brain Layer hex 格式錯誤拒絕

### 測試功能
非合法 hex（如 `xyz`、`#1234`、空字串）拒絕

### 測試類型
反向

### 優先級
Medium

### 測試步驟
1. 審查 `outfit_generator.py:82` `_HEX_RE = re.compile(r"^#([0-9A-Fa-f]{6})$")`
2. line 114：`if not _HEX_RE.match(h): raise SchemaValidationError(...)`

### 實際結果
正則嚴格。`#1234`（4 位）會先被 `if len(h) == 4` 展開為 `#11223344` 共 9 位，再被 regex 拒絕（因為要求 6 位）→ 仍能正確拒絕。

### 測試狀態
Pass

---

## TC-011：Brain Layer 3 次重試

### 測試功能
逾時 / 一般錯誤的 3 次重試

### 測試類型
異常

### 優先級
High

### 測試步驟
1. 審查 `outfit_generator.py:151-192`：含 `for attempt in range(1, max_retries + 1)` 迴圈。
2. `tests/test_brain_layer.py` 中 `test_retry_*` 系列驗證。

### 實際結果
程式碼與測試皆覆蓋此情境。

### 測試狀態
Pass

### 備註
TC-011 中：
- 對 `API_KEY_INVALID` / `PERMISSION_DENIED` 立即不重試（line 184）✓
- 對 `SchemaValidationError` 立即不重試（line 180）✓ — 設計合理，避免重複扣費。

---

## TC-012：Weather 快取命中（3 小時內）

### 測試功能
`get_weather()` 的快取

### 測試類型
正向

### 優先級
Medium

### 測試步驟
1. 審查 `weather.py:59-67`：3 小時內且 city 相同 → 直接返回快取，不打 API。

### 實際結果
邏輯正確。

### 測試狀態
Pass

---

## TC-013：Weather 不同城市不命中快取

### 測試功能
快取城市鎖定

### 測試類型
邊界

### 優先級
Medium

### 測試步驟
1. 審查 `weather.py:62`：`if cached.get("city", "").lower() == target_city.lower()` — 城市名不同即重新抓。

### 實際結果
邏輯正確。但**所有城市共用 `cache/weather_cache.json`**，頻繁切換城市會 cache thrash（每次都重抓）。Minor 改進空間。

### 測試狀態
Pass（含改善建議）

---

## TC-014：Weather API 永久錯誤不重試

### 測試功能
`WeatherError` 立即 raise

### 測試類型
異常

### 優先級
High

### 測試步驟
1. 審查 `weather.py:78-79`：
   ```python
   except WeatherError:
       raise  # permanent error — do not retry
   ```

### 實際結果
正確避免重試 API 認證錯誤。

### 測試狀態
Pass

---

## TC-015：Weather 重試指數退避

### 測試功能
2s / 4s

### 測試類型
正向

### 優先級
Low

### 測試步驟
1. 審查 `weather.py:82-83`：`await asyncio.sleep(2**attempt)` — attempt=1 → 2s、attempt=2 → 4s。

### 實際結果
正確。

### 測試狀態
Pass

---

## TC-016：Telegram 圖片不存在立即 raise

### 測試功能
`send_photos` 預檢

### 測試類型
反向

### 優先級
High

### 測試步驟
1. 審查 `telegram_bot.py:55-57`：
   ```python
   for p in image_paths:
       if not p.exists():
           raise TelegramBotError(f"圖片不存在：{p}")
   ```

### 實際結果
在打 Telegram API 前先檢查所有檔案。設計合理。

### 測試狀態
Pass

---

## TC-017：Telegram 分批 >10 張

### 測試功能
batch_size = 10

### 測試類型
邊界

### 優先級
Medium

### 測試步驟
1. 審查 `telegram_bot.py:65-66`：
   ```python
   batches = [image_paths[i:i + batch_size] for i in range(0, len(image_paths), batch_size)]
   ```

### 實際結果
切片正確。Telegram send_media_group 上限 10 張可滿足。

### 測試狀態
Pass

### 備註
目前 main.py 只送 4 張（2 cards + 2 photos），分批分支不會被觸發。未來若擴充至 >10 張才會用到。

---

## TC-018：Telegram caption >1024 字元截斷

### 測試功能
caption 長度

### 測試類型
邊界

### 優先級
Medium

### 測試步驟
1. 審查 `telegram_bot.py:70`：`batch_caption = caption[:1024] if (batch_idx == 0 and caption) else ""`

### 實際結果
切片到 1024 字元，符合 Telegram caption 上限。

### 測試狀態
Pass

---

## TC-019：Telegram Timeout 重試

### 測試功能
3 次重試 + 60s timeout

### 測試類型
異常

### 優先級
High

### 測試步驟
1. 審查 `telegram_bot.py:72-109`：完整 retry 區塊。
2. `tests/test_delivery_layer.py` 中 `test_retry_*` 系列驗證。

### 實際結果
程式碼與測試覆蓋。`asyncio.timeout(60)` 包住 send_media_group。

### 測試狀態
Pass

### 備註
**潛在 file handle 洩漏**：line 87-88 在 success 後關閉 handles。若 `f.close()` 拋例外（極罕見），handles 會洩漏。屬 Trivial 改善。

---

## TC-020：冪等性 Lock 已存在則跳過

### 測試功能
`_check_lock`

### 測試類型
正向

### 優先級
High

### 測試步驟
1. 審查 `main.py:54-56`：
   ```python
   if _check_lock(today):
       print(f"[main] 今日已生成（{date_str}），跳過。...")
       return
   ```

### 實際結果
正確 — 重複執行不會浪費 Gemini 配額。

### 測試狀態
Pass

---

## TC-021：冪等性 Lock 寫入時機

### 測試功能
Lock 在「全部成功後」才寫入

### 測試類型
正向

### 優先級
High

### 測試步驟
1. 審查 `main.py:127`：`_write_lock(today)` 在 Telegram 推送完成後執行。

### 實際結果
正確 — 若中途失敗，可重跑（lock 未寫入）。

### 測試狀態
Pass

---

## TC-022 ~ TC-023：Render Layer

### 測試功能
PNG 尺寸 1080×1920、HTML 無 Jinja 殘留

### 測試類型
正向

### 優先級
Medium

### 測試步驟
由 `tests/test_render_layer.py` 之 TestRenderColorCard / TestRenderColorCardHtml 覆蓋。

### 實際結果
本次 pytest 65/65 全過。

### 測試狀態
Pass

---

## TC-024：`.env` 在 .gitignore

### 測試功能
git 設定

### 測試類型
安全

### 優先級
Critical

### 測試步驟
1. 讀 `.gitignore` 第 2 行：`.env` 已列入。

### 實際結果
符合。

### 測試狀態
Pass

---

## TC-025：`.env` 本機留存實際 API Key

### 測試功能
本機安全

### 測試情境
`.env` 含實際 OpenWeather / Gemini / Telegram Bot Token + Chat ID。

### 測試類型
安全

### 優先級
High

### 預期結果
若曾被誤 commit、或開發機被攻陷，這些憑證需要立即輪換。**Gemini key 是計費資源**，外洩會直接被濫用產生雲端帳單。

### 實際結果
**密鑰存在於本機**。

### 測試狀態
Fail（建議性 / 預防性）

### 備註
詳見 BUG-001。

---

## TC-026：main.py docstring vs 實作

### 測試功能
文件一致性

### 測試情境
`main.py:3` 寫「生成 4 組配色 JSON」、line 9「Telegram 傳送 8 張圖片」；但 `outfit_generator.py:99` 強制 2 組、`main.py:113` 算出 `n = 2*2 = 4`。

### 測試類型
文件 / 規格一致性

### 優先級
Medium

### 預期結果
docstring 應與實作一致（2 組 / 4 張）。

### 實際結果
**docstring 與實作不符**。

### 測試狀態
Fail

### 備註
詳見 BUG-002。

---

## TC-027：PROJECT_RULES.md vs 實作

### 測試功能
規格文件一致性

### 測試情境
PROJECT_RULES.md § 4 寫「Claude API + FFmpeg + 15 秒 MP4 + Edge TTS」；實際 `requirements.txt` 用 `google-genai`、`main.py` 產出 PNG 而非 MP4，README 第 18 行明示已 pivot。

### 測試類型
文件 / 規格一致性

### 優先級
Medium

### 預期結果
規格文件應反映目前實作（image-first workflow）。CLAUDE.md 第 1 條也寫「Document-Driven：任何架構變更必須先更新 PROJECT_RULES.md，再動程式碼」— 但實際上 pivot 後該檔未更新。

### 實際結果
**PROJECT_RULES.md 過時**，違反自家 CLAUDE.md 第 1 條規則。

### 測試狀態
Fail

### 備註
詳見 BUG-003。

---

## TC-028：outfit filename 唯一性

### 測試功能
`main.py` 輸出檔名

### 測試情境
`main.py:94`：`OUTPUT_DIR / f"{date_str}_card_{g['id']}.png"`。
若 Gemini 回傳兩組 `id` 相同（雖 Schema 未強制 unique），會靜默覆寫。

### 測試類型
邊界 / 異常

### 優先級
Low

### 預期結果
應驗證 `g['id']` 在兩組中是 distinct，或改用 enumerate index。

### 實際結果
**未檢查唯一性**。

### 測試狀態
Fail

### 備註
詳見 BUG-005。

---

## TC-029：lint 工具缺失

### 測試功能
程式碼品質

### 測試情境
專案無 `ruff` / `flake8` / `pylint` / `pyproject.toml` 設定，CI 也只跑 pytest。

### 測試類型
缺陷 / 工程慣例

### 優先級
Low

### 實際結果
**未配置 lint**。

### 測試狀態
Fail（建議性）

### 備註
詳見 BUG-006。

---

## TC-030：跨午夜 Lock 行為

### 測試功能
`main.py` 冪等性

### 測試情境
若程式於 23:59:30 開始執行，跨到 00:00:30 寫 lock — `_write_lock(today)` 用 `today` 變數（執行起始時的日期），所以 lock 是「昨天」的；但隔天 00:00 後 `_check_lock(datetime.now())` 會看「今天」的 lock，找不到 → 隔天會重跑。

### 測試類型
異常 / 時序

### 優先級
Low

### 實際結果
**未實際模擬時序**。需建構 mock datetime 才能測。

### 測試狀態
Not Run

### 備註
程式邏輯（line 50, 127）來看，跨午夜會有「昨天執行已寫 lock」+「今天再執行一次」的情況。設計上可接受（每天本來就該執行一次），不算 bug，但屬於未測邊界。
