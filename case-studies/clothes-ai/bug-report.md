# Bug Report — clothes AI

> 本次 QA 測試共識別 7 個 Bug，含 0 個 Critical、1 個 Major、3 個 Minor、3 個 Trivial。
> 整體品質良好（pytest 65/65 全過），多數問題屬「文件與實作不一致」或「工程慣例改善建議」，非 runtime 缺陷。
> 測試時間：2026-05-20

## 一、Bug Summary

| Bug 編號 | 問題標題 | 發生功能 | 嚴重程度 | 優先級 | 狀態 |
|---|---|---|---|---|---|
| BUG-001 | 本機 `.env` 內含實際 Gemini / Telegram / OpenWeather API Key，**Gemini 為計費資源**，需確認從未誤 commit | 環境 / 安全 | Major | Medium | Open |
| BUG-002 | `main.py` docstring 寫「4 組 / 8 張」，但實作為「2 組 / 4 張」 — 文件誤導 | 文件一致性 | Minor | Medium | Open |
| BUG-003 | `PROJECT_RULES.md` 仍為 V1.0 短影音規格（Claude API / FFmpeg / 15 秒 MP4），未隨 pivot 更新，違反自家 CLAUDE.md 第 1 條「Document-Driven」 | 文件 | Minor | Medium | Open |
| BUG-004 | `requirements.txt` 含 `edge-tts`、`ffmpeg-python` 但 `main.py` 未引用，疑為 pivot 後的 dead dependencies | 技術債 | Minor | Low | Open |
| BUG-005 | `main.py:94` 用 `g['id']` 直接命名輸出檔，若 Gemini 兩組 id 相同會靜默覆寫 | Render | Trivial | Low | Open |
| BUG-006 | 專案未配置 lint（ruff / flake8 / pyproject.toml），CI 也只跑 pytest | 工程慣例 | Trivial | Low | Open |
| BUG-007 | `telegram_bot.py:78-88` 在 success path 用裸 `for f in handles: f.close()`，若 close 失敗會 handle 洩漏 | Delivery | Trivial | Low | Open |

---

## BUG-001：本機 `.env` 含實際 API Key

### 發生功能
本機環境 / 安全管理

### 測試環境
Windows 11，本機 `D:\clothes AI\.env`

### 嚴重程度
Major

### 優先級
Medium

### 重現步驟
1. 開啟專案根目錄 `.env`。
2. 確認內含實際 OPENWEATHER_API_KEY、GEMINI_API_KEY（39 字元 `AIzaSy...` 格式）、TELEGRAM_BOT_TOKEN（`<bot_id>:<secret>` 格式）、TELEGRAM_CHAT_ID。

### 預期結果
本機開發應採用具預防外洩能力的方案；至少需於 git 歷史驗證從未被誤 commit。

### 實際結果
- `.env` 存在於本機並含真實憑證。
- `.gitignore` 第 2 行確實列入 `.env`，因此本機新增 `.env` 不會被 commit。
- **未驗證 git 歷史是否曾有 `.env` 被 commit 過**。
- **特別注意**：
  - **GEMINI_API_KEY 為計費資源**（Google Cloud），外洩會被立即濫用產生帳單。
  - **TELEGRAM_BOT_TOKEN 外洩**會讓攻擊者冒充 bot 發訊息給 CHAT_ID 對應的使用者。

### 錯誤訊息
無 runtime 錯誤，純安全管理建議。

### 截圖或證據路徑
`evidence-log.md` § CR-001（內容已遮蔽）。

### 是否可重現
是。

### 建議處理方向

1. **檢查 git 歷史**：
   ```bash
   git log --all --full-history -- .env
   git log -p --all -S "GEMINI_API_KEY=" | head -50
   git log -p --all -S "TELEGRAM_BOT_TOKEN=" | head -50
   ```
   若有任一 commit 含 `.env` 或上述字串：
2. **立即輪換**：
   - Gemini：到 Google Cloud Console → API & Services → Credentials → 刪舊 key、生新 key
   - Telegram：在 BotFather 對話 `/revoke` 該 bot 後重新建立 token
   - OpenWeather：到 OpenWeatherMap dashboard 重生 key
3. **清除歷史**：用 `git filter-repo` 移除 `.env` 從歷史中（注意 force push 風險）。
4. **改善管理**：考慮 `dotenv-vault` 或 1Password CLI。
5. **新增 `CONTRIBUTING.md`** 提醒貢獻者 `.env` 不可 commit。

### 狀態
Open

---

## BUG-002：main.py docstring 與實作不一致（4 組 vs 2 組）

### 發生功能
`main.py` 模組 docstring

### 測試環境
靜態審查 + 跨檔比對

### 嚴重程度
Minor

### 優先級
Medium

### 重現步驟
1. 開啟 `main.py:3-9`：
   ```
   3. Brain Layer：Gemini 生成 4 組配色 JSON
   4. Render Layer（×4）：色塊卡片 PNG
   5. Render Layer（×4）：AI 穿搭照 PNG
   6. Delivery Layer：Telegram 傳送 8 張圖片
   ```
2. 對照 `src/brain_layer/outfit_generator.py:99`：
   ```python
   if not isinstance(groups, list) or len(groups) != 2:
       raise SchemaValidationError(f"groups 必須恰好 2 組...")
   ```
3. 對照 `main.py:113`：
   ```python
   n = len(groups) * 2  # 2 * 2 = 4
   ```

### 預期結果
docstring 應反映實際行為（2 組配色 → 4 張圖片）。

### 實際結果
**docstring 錯誤標示為 4 組 / 8 張**。會誤導後續開發者 / AI Agent 以為要產 4 組。

### 截圖或證據路徑
`evidence-log.md` § CR-002。

### 是否可重現
是。

### 建議處理方向

修改 `main.py:3-9` 的 docstring：

```python
"""Daily AI Outfit Image Generator — 每日穿搭圖片生成

執行流程：
  1. 冪等性檢查（Lock 機制）
  2. Data Layer：天氣 / 趨勢 / 節慶
  3. Brain Layer：Gemini 生成 2 組配色 JSON
  4. Render Layer（×2）：色塊卡片 PNG（Playwright，含顏色文字標籤）
  5. Render Layer（×2）：AI 穿搭照 PNG（Gemini，白色人形模特）
  6. Delivery Layer：Telegram 傳送 4 張圖片（色卡 + 穿搭照交替）
  7. 寫入 Lock 檔案

輸出：output/YYYY-MM-DD_card_1~2.png + output/YYYY-MM-DD_photo_1~2.png
"""
```

### 狀態
Open

---

## BUG-003：PROJECT_RULES.md 為 V1.0 短影音規格，未隨 pivot 更新

### 發生功能
`PROJECT_RULES.md` 整份文件

### 測試環境
靜態審查 + 跨檔比對

### 嚴重程度
Minor

### 優先級
Medium

### 重現步驟
1. 開啟 `PROJECT_RULES.md`：
   - § 1：「Daily AI Outfit Shorts Generator — 每日 AI 穿搭短影音自動生成系統」
   - § 3：「Playwright (Python) 截圖 HTML/CSS 模板 → 1080x1920 PNG」 + 「FFmpeg 合成 PNG + 音樂 + Edge TTS 語音 → 15 秒 MP4」
   - § 4：「LLM Engine: Anthropic API (Claude 3.5 Sonnet)」
2. 對照 `README.md:18-22`：「originally explored short-video generation... main portfolio path was repositioned into a sustainable image-first workflow」
3. 對照 `requirements.txt`：使用 `google-genai`，**未引用** Anthropic SDK。
4. 對照 `CLAUDE.md:第 1 條核心準則`：「Document-Driven：任何架構變更必須先更新 PROJECT_RULES.md，再動程式碼。」

### 預期結果
PROJECT_RULES.md 應為「Daily AI Outfit **Image** Generator」並反映 Gemini / 無 FFmpeg / 無 MP4 的當前狀態。

### 實際結果
**規格文件嚴重落後實作**，且違反自家 Document-Driven 原則。新進貢獻者或 AI Agent 看到該文件會做出錯誤判斷。

### 截圖或證據路徑
`evidence-log.md` § CR-003。

### 是否可重現
是。

### 建議處理方向

新增 `PROJECT_RULES.md V2.0`：

1. 標題改「Daily AI Outfit Image Generator V2.0 (Image-First)」
2. § 1 / § 2 改為「每日生成穿搭圖片」
3. § 3 § 4 移除 FFmpeg / Edge TTS / Claude / MP4 相關段落
4. 新增 § Pivot Notes：紀錄為何從 video pivot 到 image-first（即 README 第 20 行的決策）
5. 將 V1.0 舊規格存檔到 `docs/archive/PROJECT_RULES_v1.0.md`

### 狀態
Open

---

## BUG-004：requirements.txt 含未使用依賴

### 發生功能
`requirements.txt`

### 測試環境
靜態審查

### 嚴重程度
Minor

### 優先級
Low

### 重現步驟
1. 開啟 `requirements.txt`：
   ```
   edge-tts>=6.1.9
   ffmpeg-python>=0.2.0
   ```
2. 全專案搜尋：
   - `grep -r "import edge_tts" .` → 無匹配
   - `grep -r "import ffmpeg" .` → 無匹配
3. 確認 `main.py` 不引用 → 兩個套件均為 pivot 後遺留。

### 預期結果
僅保留實際使用之依賴，減少安裝時間與 CI 資源。

### 實際結果
**至少 2 個 dead dependencies**。`feedparser` 推測為 trends.py 用，待確認。

### 截圖或證據路徑
`evidence-log.md` § CR-007。

### 是否可重現
是。

### 建議處理方向

```bash
# 1. 確認 dead deps
pip install pip-autoremove pipreqs
pipreqs . --print

# 2. 移除確認未用之套件
# 從 requirements.txt 移除 edge-tts、ffmpeg-python
```

執行前先在 CI 跑一次完整 pytest 確認無影響。

### 狀態
Open

---

## BUG-005：輸出檔名用 g['id'] 無唯一性檢查

### 發生功能
`main.py` Step 4 / Step 5 輸出檔名

### 測試環境
靜態審查

### 嚴重程度
Trivial

### 優先級
Low

### 重現步驟
1. 觀察 `main.py:94`：`OUTPUT_DIR / f"{date_str}_card_{g['id']}.png"`
2. 觀察 `outfit_generator.py:62` schema：`"id": types.Schema(type=types.Type.INTEGER)` — **未強制 unique**。
3. 若 Gemini 兩組均回 `"id": 1`，第二張會覆寫第一張，使用者拿到 4 張圖中只有 2 張獨特。

### 預期結果
應以 `enumerate` 索引（位置）命名，或在 Schema 上強制 id 唯一。

### 實際結果
**未檢查**。實務上 Gemini 鮮少回相同 id，但屬隱性 bug。

### 建議處理方向

方案 A（最小改動）：
```python
card_paths = list(await asyncio.gather(*[
    render_color_card(
        g, idx + 1, len(groups),
        OUTPUT_DIR / f"{date_str}_card_{idx + 1}.png",
    )
    for idx, g in enumerate(groups)
]))
```

方案 B（保留 id 但驗證）：在 `_validate` 中加 `if len({g['id'] for g in groups}) != len(groups): raise SchemaValidationError("id 必須唯一")`。

### 狀態
Open

---

## BUG-006：未配置 lint

### 發生功能
工程慣例 / CI

### 測試環境
靜態審查

### 嚴重程度
Trivial

### 優先級
Low

### 重現步驟
1. 專案根目錄查找：
   - `.flake8` / `pyproject.toml` / `ruff.toml` / `setup.cfg` → 不存在
2. 開啟 `.github/workflows/ci.yml`：
   ```yaml
   - run: python -m pytest --tb=short -q
   ```
   無 `ruff check` / `flake8` 步驟。

### 預期結果
應有 lint 工具與 CI 集成，捕捉未使用 import、PEP 8 違規、type hint 不一致等。

### 實際結果
**無 lint 配置**。雖然程式碼整體可讀性不錯，但缺少自動化品質閘門。

### 建議處理方向

最小改動方案（使用 ruff）：

```bash
pip install ruff
```

新增 `pyproject.toml`：
```toml
[tool.ruff]
target-version = "py312"
line-length = 100

[tool.ruff.lint]
select = ["E", "F", "W", "I", "UP", "B"]
ignore = ["E501"]  # line too long handled by formatter
```

更新 `.github/workflows/ci.yml`：
```yaml
      - name: Lint
        run: ruff check .

      - name: Run tests
        run: python -m pytest --tb=short -q
```

### 狀態
Open

---

## BUG-007：telegram_bot.py 在 success path 無 try/finally

### 發生功能
`src/delivery_layer/telegram_bot.py:78-88`

### 測試環境
靜態審查

### 嚴重程度
Trivial

### 優先級
Low

### 重現步驟
1. 觀察 `telegram_bot.py:75-91`：
   ```python
   media = []
   handles = []
   for i, p in enumerate(batch):
       f = open(p, "rb")
       handles.append(f)
       media.append(InputMediaPhoto(media=f, caption=...))

   await bot.send_media_group(chat_id=chat_id, media=media)

   for f in handles:
       f.close()  # ← 若這裡某個 close 拋例外，後面的 handles 不會被關
   ```
2. except 分支有處理 close（line 94-96、103-105），但 success 分支沒有 try/finally。

### 預期結果
file handle 應在所有路徑都被保證關閉。

### 實際結果
極罕見情況下會 leak（如磁碟錯誤、檔案系統移除）。

### 建議處理方向

改用 `contextlib.ExitStack`：

```python
from contextlib import ExitStack

with ExitStack() as stack:
    handles = [stack.enter_context(open(p, "rb")) for p in batch]
    media = [
        InputMediaPhoto(media=f, caption=batch_caption if i == 0 else "")
        for i, f in enumerate(handles)
    ]
    await bot.send_media_group(chat_id=chat_id, media=media)
```

`ExitStack` 保證所有 handle 在離開 with 區塊時被關閉，無論是否拋例外。同時可移除整個 except 內的手動 close 區塊。

### 狀態
Open
