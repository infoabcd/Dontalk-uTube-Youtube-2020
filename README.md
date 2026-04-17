# UTube Next.js（uTube）

原項目地址 - https://github.com/DUO-1080/utube/

基於 **Next.js App Router**、**Prisma（SQLite）** 與 **JWT Cookie 登入** 的本機影片站。上載的影片會在伺服器端以 **ffmpeg** 轉成多碼率 **HLS（m3u8 + ts）**，瀏覽器透過 **hls.js** 自適應播放，並可在支援的瀏覽器中手動切換清晰度。

## 功能概覽

- **首頁／動態**：影片列表（`GET /api/videos`）
- **觀看頁**：HLS 自適應串流、可選畫質（Auto／360p／480p／720p）、讚好、留言、觀看紀錄
- **頻道頁**：`/channel/[uid]` — HOME（作品）、CHANNELS（該用戶訂閱的頻道）、ABOUT、編輯個人資料（本人）
- **上載**：`POST /api/videos/upload`（`multipart/form-data`），伺服器寫入磁碟後轉碼至 `public/uploads/videos/<id>/` 下的多檔 HLS + `poster.jpg` 封面
- **認證**：註冊／登入，`httpOnly` Cookie 儲存 JWT

## 環境要求

- **Node.js** 18+（建議 20+）
- 依賴內的 **`@ffmpeg-installer/ffmpeg`** 會附帶對應平台的 ffmpeg 二進位檔；若轉碼失敗，請在本機安裝 ffmpeg，並可將 `FFMPEG_PATH` 指向可執行檔（選用，一般無需）

## 快速開始

```bash
cd utube-nextjs
npm install
```

設定資料庫與 Prisma Client（若尚未產生）：

```bash
# .env 或 .env.local 中設定 DATABASE_URL，例如：
# DATABASE_URL="file:./prisma/dev.db"

npx prisma migrate deploy
npx prisma generate
```

可選：寫入示範資料：

```bash
npx prisma db seed
```

啟動開發伺服器：

```bash
npm run dev
```

以瀏覽器開啟 [http://localhost:3000](http://localhost:3000)。

### 重要環境變數

| 變數 | 說明 |
|------|------|
| `DATABASE_URL` | SQLite 路徑，例如 `file:./prisma/dev.db` |
| `JWT_SECRET` | JWT 簽名密鑰（生產環境務必修改） |

## 影片與 HLS 儲存

- 上載暫存檔：`public/uploads/tmp/`（處理完成後會刪除）
- 轉碼輸出：`public/uploads/videos/<videoId>/`
  - `master.m3u8`：主播放清單
  - `360p/`、`480p/`、`720p/`：各檔位 `playlist.m3u8` 與 `segment*.ts`
  - `poster.jpg`：約第 1 秒截圖，用作縮圖
- `public/uploads/` 下除 `.gitkeep` 外的內容預設 **不提交到 Git**（見 `.gitignore`）

## API 摘要

| 方法 | 路徑 | 說明 |
|------|------|------|
| `POST` | `/api/videos/upload` | 須登入，`file` + `title` + `description` |
| `GET` | `/api/videos` | 影片列表 |
| `GET` | `/api/videos/[id]` | 單條影片（會自增 views） |
| `GET` | `/api/channel/[uid]` | 頻道資料、作品、訂閱人數、是否已訂閱、該用戶訂閱的頻道清單 |

其餘路由見 `app/api/`。

## 生產部署注意

- 長片轉碼耗用 CPU 與時間，預設在請求內同步完成；生產環境建議改為佇列 + Worker，並放寬上載大小與逾時限制。
- 靜態資源可改為物件儲存 + CDN，只把 m3u8／ts 的 URL 存入資料庫。

## 技術棧

Next.js、React、Redux Toolkit、styled-components、Prisma、SQLite（libSQL 配接器）、bcrypt、jsonwebtoken、hls.js、@ffmpeg-installer/ffmpeg。
