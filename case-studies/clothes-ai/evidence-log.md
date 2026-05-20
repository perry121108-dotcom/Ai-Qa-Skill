# 測試證據紀錄 — clothes AI

> 本次 QA 在 2026-05-20 於 Windows 11 + Python 3.12.10 + pytest 9.0.3 環境執行。

## 一、指令執行紀錄

| 編號 | 執行時間 | 指令 | 目的 | 結果 | 備註 |
|---|---|---|---|---|---|
| CMD-001 | 2026-05-20 17:00 | `cp -r "D:/Ai Qa Skill/skills" "D:/clothes AI/"` | 將 AI QA Skill 文件包複製進專案 | Pass | 16 份 Skill 文件就位 |
| CMD-002 | 2026-05-20 17:00 | `mkdir -p qa-reports screenshots && touch */.gitkeep` | 建立輸出資料夾 | Pass | — |
| CMD-003 | 2026-05-20 17:00 | `ls D:/clothes\ AI/` | 列出專案根目錄 | Pass | 識別為 Python 專案（main.py / src/ / tests/ / requirements.txt） |
| CMD-004 | 2026-05-20 17:01 | `cat README.md / requirements.txt / main.py / .env.example / .env / .gitignore / CLAUDE.md / PROJECT_RULES.md` | 閱讀核心設定 | Pass | 識別文件 vs 實作不一致；發現 `.env` 含實際付費 API Key |
| CMD-005 | 2026-05-20 17:01 | `python --version` | 確認 Python 版本 | Pass | `Python 3.12.10`（與 CI 設定一致） |
| CMD-006 | 2026-05-20 17:01 | `python -c "import pytest; print(pytest.__version__)"` | 確認 pytest 版本 | Pass | `pytest 9.0.3` |
| CMD-007 | 2026-05-20 17:02 | `python -m pytest --tb=short -q` | **執行全測試套件** | **Pass** | **65 passed in 33.13s** |
| CMD-008 | 2026-05-20 17:02 | `python -m pytest --collect-only -q` | 收集測試 | Pass | `65 tests collected in 1.63s` |
| CMD-009 | 2026-05-20 17:03 | `python -m py_compile main.py` | 主程式語法檢查 | Pass | `main.py OK` |
| CMD-010 | 2026-05-20 17:03 | `python -m py_compile src/data_layer/weather.py src/data_layer/trends.py src/data_layer/festivals.py` | data_layer 語法檢查 | Pass | `data_layer OK` |
| CMD-011 | 2026-05-20 17:03 | `python -m py_compile src/brain_layer/outfit_generator.py` | brain_layer 語法檢查 | Pass | `brain_layer OK` |
| CMD-012 | 2026-05-20 17:03 | `python -m py_compile src/render_layer/renderer.py src/render_layer/outfit_photo_generator.py` | render_layer 語法檢查 | Pass | `render_layer OK` |
| CMD-013 | 2026-05-20 17:03 | `python -m py_compile src/delivery_layer/telegram_bot.py` | delivery_layer 語法檢查 | Pass | `delivery_layer OK` |
| CMD-014 | 2026-05-20 17:03 | `python -c "from src.brain_layer import outfit_generator"` | import 測試 | Pass | `brain ok` |
| CMD-015 | 2026-05-20 17:03 | `python -c "from src.data_layer import weather, trends, festivals"` | 同上 | Pass | `data ok` |
| CMD-016 | 2026-05-20 17:03 | `python -c "from src.delivery_layer import telegram_bot"` | 同上 | Pass | `delivery ok` |
| CMD-017 | 2026-05-20 17:03 | `python -c "from src.render_layer import renderer, outfit_photo_generator"` | 同上 | Pass | `render ok` |
| CMD-018 | 2026-05-20 17:04 | `grep -c "def test_" tests/*.py` | 計算測試函式數 | Pass | brain 19 / data 11 / delivery 18 / render 15 = 63（pytest 含參數化收集 65） |
| CMD-019 | 2026-05-20 17:04 | `wc -l src/**/*.py main.py` | 計算程式碼行數 | Pass | 1246 行（不含 tests） |
| CMD-020 | — | `python main.py` | 端到端執行 | **Not Run** | 會呼叫 Gemini 計費 API + 推送至實際 Telegram chat。**刻意跳過** |
| CMD-021 | — | `playwright install chromium` | 安裝 Chromium | **Not Run** | 系統已安裝（render_layer pytest 通過即證明） |
| CMD-022 | — | `pip install -r requirements.txt` | 安裝依賴 | **Not Run** | 系統已安裝 |
| CMD-023 | — | `ruff check .` / `flake8 .` | Lint | **Blocked** | 專案未配置 lint（見 BUG-006） |

---

## 二、頁面測試紀錄

> 本專案為 CLI 自動化工作流，無 Web UI，故無頁面測試紀錄。

---

## 三、錯誤訊息紀錄

| 編號 | 發生時間 | 發生位置 | 錯誤訊息 | 影響 |
|---|---|---|---|---|
| ERR-001 | — | — | 本次 pytest 65/65 全過，無 runtime 錯誤 | — |

---

## 四、程式碼審查證據摘要

### CR-001：`.env`（本機）

```
OPENWEATHER_API_KEY=<已遮蔽 32 字元>
DEFAULT_CITY=Taipei
GEMINI_API_KEY=<已遮蔽 39 字元>
TELEGRAM_BOT_TOKEN=<已遮蔽，含 ":" 分隔的 bot id + token>
TELEGRAM_CHAT_ID=<已遮蔽，10 位數>
```

**結論**：實際 API Key 存於本機。其中 **GEMINI_API_KEY 為計費資源**，外洩會被濫用產生雲端帳單；TELEGRAM_BOT_TOKEN 外洩會被冒名發訊息。→ BUG-001（Major / Medium）。

> 本紀錄不揭露任何實際密鑰值。

---

### CR-002：`main.py:3-9` docstring vs 實作

```python
"""Daily AI Outfit Image Generator — 每日穿搭圖片生成

執行流程：
  1. 冪等性檢查（Lock 機制）
  2. Data Layer：天氣 / 趨勢 / 節慶
  3. Brain Layer：Gemini 生成 4 組配色 JSON          ← 但 outfit_generator 強制 2 組
  4. Render Layer（×4）：色塊卡片 PNG                ← 實際 ×2
  5. Render Layer（×4）：AI 穿搭照 PNG               ← 實際 ×2
  6. Delivery Layer：Telegram 傳送 8 張圖片          ← 實際 4 張
  7. 寫入 Lock 檔案
"""
```

對應 `outfit_generator.py:99`：

```python
if not isinstance(groups, list) or len(groups) != 2:
    raise SchemaValidationError(f"groups 必須恰好 2 組...")
```

**結論**：docstring 「4 組 / 8 張」與實作「2 組 / 4 張」不一致 → BUG-002（Minor / Medium）。

---

### CR-003：`PROJECT_RULES.md § 4` vs 實際技術棧

PROJECT_RULES.md 第 38-50 行宣稱：
```text
LLM Engine: Anthropic API (Claude 3.5 Sonnet)
影音合成: ffmpeg-python（靜態圖 + 音樂 + TTS）
TTS: Edge TTS
輸出: 15 秒 MP4 Shorts
```

但 `requirements.txt` 實際為：
```text
google-genai>=1.0.0     ← 用 Gemini 不是 Claude
edge-tts>=6.1.9         ← 仍存在但 main.py 未引用
ffmpeg-python>=0.2.0    ← 仍存在但 main.py 未引用
```

而 README.md:18-22 明確 pivot 至「image-first workflow」。

CLAUDE.md § 1 自家規則：
```text
Document-Driven：任何架構變更必須先更新 PROJECT_RULES.md，再動程式碼。
```

**結論**：PROJECT_RULES.md 是過時的 V1.0 規格，未隨 pivot 更新，違反自家 Document-Driven 原則 → BUG-003（Minor / Medium）。

---

### CR-004：`main.py:90-97` filename 唯一性

```python
card_paths = list(await asyncio.gather(*[
    render_color_card(
        g, g["id"], len(groups),
        OUTPUT_DIR / f"{date_str}_card_{g['id']}.png",  # ← 用 g['id'] 直接命名
    )
    for g in groups
]))
```

若 Gemini 兩組回相同 `id`（schema 未強制 unique），兩個檔案會覆寫成同一張。→ BUG-005（Trivial / Low）。

---

### CR-005：`telegram_bot.py:78-88` file handle 處理

```python
media = []
handles = []
for i, p in enumerate(batch):
    f = open(p, "rb")
    handles.append(f)
    media.append(InputMediaPhoto(media=f, caption=...))

await bot.send_media_group(chat_id=chat_id, media=media)

for f in handles:
    f.close()
```

**結論**：success path 沒 try/finally，若 `bot.send_media_group` 後 `f.close()` 拋例外，handles 可能洩漏。極罕見，BUG-007（Trivial / Low）。

---

### CR-006：`weather.py:11` 快取檔位置

```python
CACHE_FILE = Path("cache/weather_cache.json")
```

所有城市共用單一檔案。若使用者頻繁切換 `DEFAULT_CITY`，快取會被覆寫，達不到節省 API 配額目的。屬設計改善空間（非 bug）。

---

### CR-007：`requirements.txt` 含未使用依賴

```text
edge-tts>=6.1.9           ← main.py 未引用，pivot 至 image-first 後遺留
ffmpeg-python>=0.2.0      ← 同上
feedparser>=6.0.11        ← 推測為 trends.py 用，需確認
```

**結論**：可能有 dead dependencies。屬技術債而非 bug。

---

### CR-008：CI 設定

```yaml
# .github/workflows/ci.yml
- run: python -m pytest --tb=short -q
```

**結論**：CI 設計簡潔，與本機指令完全一致。**未包含 lint** 步驟，與 BUG-006 對應。

---

## 五、pytest 完整輸出（CMD-007）

```text
.................................................................        [100%]
65 passed in 33.13s
```

> 65 點代表 65 個測試全部 PASS（pytest `-q` 模式以一個點代表一個 pass）。

各檔案測試函式分布：
- `tests/test_brain_layer.py` — 19 個 def test_
- `tests/test_data_layer.py` — 11 個 def test_
- `tests/test_delivery_layer.py` — 18 個 def test_
- `tests/test_render_layer.py` — 15 個 def test_
- **總計 63 def test_ → 65 pytest cases（含 2 個參數化展開）**

---

## 六、收集到的測試類別（CMD-008 摘要）

主要 TestClass 分組：

- `TestRenderColorCardHtml`（HTML 模板驗證）
  - test_html_contains_clothing_types
  - test_html_contains_hex_colors
  - test_html_contains_style_tag
  - test_html_contains_group_id
  - test_html_no_jinja_placeholders
- `TestRenderColorCard`（實際 PNG 產出）
  - test_renders_png_correct_size
  - test_creates_parent_dir
  - test_group2_renders
- （以及 brain_layer / data_layer / delivery_layer 內部測試類別）
