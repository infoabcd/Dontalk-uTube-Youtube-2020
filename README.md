# UTube Next.js（uTube）

原項目地址 - https://github.com/DUO-1080/utube/

基於 **Next.js App Router**、**Prisma（SQLite）** 與 **JWT Cookie 登入** 的本機影片站。上載的影片會在伺服器端以 **ffmpeg** 轉成多碼率 **HLS（m3u8 + ts）**，瀏覽器透過 **hls.js** 自適應播放，並可在支援的瀏覽器中手動切換清晰度。

## 功能概覽

- **首頁／動態**：影片列表（`GET /api/videos`）
- **觀看頁**：HLS 自適應串流、可選畫質（Auto／360p／480p／720p）、讚好、留言、觀看紀錄
- **頻道頁**：`/channel/[uid]` — HOME（作品）、CHANNELS（該用戶訂閱的頻道）、ABOUT、編輯個人資料（本人）
- **上載**：`POST /api/videos/upload`（`multipart/form-data`），伺服器寫入磁碟後轉碼至 `public/uploads/videos/<id>/` 下的多檔 HLS + `poster.jpg` 封面
- **刪除影片**：`DELETE /api/videos/[id]` — 登入用戶可刪除自己上載的影片；特權帳號（見下方 `ADMIN_USER_IDS` / `ADMIN_EMAILS`）可刪除任何人的影片，並會一併刪除 `public/uploads/videos/<id>/` 目錄
- **認證**：註冊／登入，`httpOnly` Cookie 儲存 JWT；可選 **邀請碼**（`INVITE_CODES`）；登入／註冊有 **IP 速率限制**（程式內記憶體，多實例等我後續改 Redis）

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
| `NEXT_PUBLIC_SITE_URL` | 選用，正式網址（含協議），供 `metadataBase`、Open Graph、`/sitemap.xml`／`robots.txt` 使用；未設時預設 `http://localhost:3000` |
| `INVITE_CODES` | 選用，逗號分隔多個邀請碼。**有設定至少一個有效碼時**，註冊必須填寫且完全相符（大小寫敏感）；**未設定或解析後為空**則不強制邀請碼（方便本機開發） |
| `ADMIN_USER_IDS` | 選用，逗號分隔的用戶 id（與資料庫 `User.id` 一致），列為特權帳號，可刪除任意影片 |
| `ADMIN_EMAILS` | 選用，逗號分隔的電郵（不分大小寫），列為特權帳號，可刪除任意影片 |

## 影片與 HLS 儲存

- 上載暫存檔：`public/uploads/tmp/`（處理完成後會刪除）
- 轉碼輸出：`public/uploads/videos/<videoId>/`
  - `master.m3u8`：主播放清單（階梯依**來源解析度**自動決定，不會把低解析強制放大成高檔）
  - 以畫面**較短邊**對齊常見「幾 p」：例如僅 144p 的來源只會產生 `144p/`；約 360p 的來源通常為 `144p/` + `360p/`（不會再產生 480p／720p）
  - 來源至少 **1080p**（短邊 ≥1080）時：產生 **144p、360p、480p、720p、1080p** 五檔
  - 其餘解析度：在 144／360／480／720 中只保留「不超過來源短邊」的檔位
  - 各檔位目錄內為 `playlist.m3u8` 與 `segment*.ts`
  - `poster.jpg`：約第 1 秒截圖，寬度隨來源上限縮放（最高 640px），用作縮圖
- `public/uploads/` 下除 `.gitkeep` 外的內容預設 **不提交到 Git**（見 `.gitignore`）

## API 摘要

| 方法 | 路徑 | 說明 |
|------|------|------|
| `POST` | `/api/videos/upload` | 須登入，`file` + `title` + `description` |
| `GET` | `/api/videos` | 影片列表 |
| `GET` | `/api/videos/[id]` | 單條影片（會自增 views） |
| `DELETE` | `/api/videos/[id]` | 須登入；本人或特權帳號可刪除，成功後回 `{ ok: true }` |
| `GET` | `/api/channel/[uid]` | 頻道資料、作品、訂閱人數、是否已訂閱、該用戶訂閱的頻道清單 |

其餘路由見 `app/api/`。

## 生產部署注意

- **上載與轉碼**：上載 API 在寫入資料庫並啟動**背景轉碼**後即回應（不阻塞使用者等待轉碼）。長片仍耗 CPU；若部署在 **Serverless／短逾時**環境，請改為佇列 + Worker，或改用長連線／專用轉碼機。
- **SEO**：已提供 `app/robots.ts`、`app/sitemap.ts`（含公開影片觀看頁 URL）；請設定 `NEXT_PUBLIC_SITE_URL` 為正式網域。
- 靜態資源可改為物件儲存 + CDN，只把 m3u8／ts 的 URL 存入資料庫。

## 技術棧

Next.js、React、Redux Toolkit、styled-components、Prisma、SQLite（libSQL 配接器）、bcrypt、jsonwebtoken、hls.js、@ffmpeg-installer/ffmpeg。
