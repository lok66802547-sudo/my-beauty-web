---
title: EC BEAUTY 全站開發與系統架構 Master Log
project: EC Beauty
status: Requires Review before Obsidian publish
last_verified: 2026-09-29
security_classification: Internal - no plaintext secrets
---

# EC BEAUTY 全站開發與系統架構 Master Log

> 本文件供 Codex、OpenClaw（龍蝦）及獲授權開發人員作維護索引。文件只記錄架構、環境變數名稱、Secret 存放位置及安全取得方法；**不得加入明文密碼、Token、Connection String、Staff PIN、Deploy Hook 或會員個人資料**。

## 0. 操作安全邊界

- Production、Preview／TEST 及 Manus Consultation 必須保持獨立。
- Production 不得 fallback 到 TEST Database、`DATABASE_URL` 或 `POSTGRES_URL`。
- Preview／TEST 不得 fallback 到 Production Database。
- Secret 只可保存在 Vercel Environment Variables、未提交的本機 `.env.local` 或經批准的 Password Manager。
- 自動化在缺少所需環境變數、身份不明或環境不一致時必須 Fail Closed。
- 未取得明確批准前，不得部署 Production、執行 migration、seed、核銷或改動會員資料。
- `.env.local`、本機管理員密碼檔、Vercel Secret 值及 Neon Connection String 不得複製到 Obsidian、Git、Console、Log 或對話。

## 1. 已確認專案身份

| 項目 | 已確認資料 |
|---|---|
| Repository | `https://github.com/lok66802547-sudo/my-beauty-web.git` |
| 本機 Git branch | `preview/tightening-gift-test-backend`（2026-09-29 快照；操作前重新確認） |
| 本機 commit | `c3a1aa74260f8a8bb13456434083170028329d5f`（2026-09-29 快照） |
| Vercel project | `ec-beauty-new` |
| Vercel project ID | `prj_aTmULb3UbmdXgO2wJOR7H9ycoc9t` |
| Vercel team／org ID | `team_ZhiFXnUMrYZBORnMQJWsAfNz` |
| Production public domain | `https://ec-beauty-new.vercel.app/`（部署前後仍須即時核實 alias） |
| Framework setting | Static／No framework；Vercel Serverless Functions 位於 `api/` |

## 2. 本地與發布路徑

### 2.1 本機工作目錄

```text
C:\Users\Administrator\Documents\Codex\2026-08-19\c-users-administrator-downloads-ec-beauty-2\work\my-beauty-web
```

### 2.2 Obsidian Vault

```text
D:\Jelly Ai\Jelly AI
```

網站開發筆記按 Vault 根規則應歸入：

```text
D:\Jelly Ai\Jelly AI\03_網站編寫\
```

使用者本次指定目標：

```text
D:\Jelly Ai\Jelly AI\04_資料搜尋\03_搜尋日誌\EC_BEAUTY_全站開發與系統架構Master_Log.md
```

> 阻塞：Vault 根 `CLAUDE.md` 要求進入任何子資料夾前先讀取該資料夾的 `instructions.md`；上述兩個網站／搜尋子樹目前均未找到 `instructions.md`。在規則補齊或由管理員明確批准例外前，不可寫入。

### 2.3 NAS

Vault 文件聲明的唯讀 NAS 資源庫：

```text
\\wellnessnas\homes\SK\Study disk
```

使用者另提供的業務路徑候選：

```text
\\wellnessnas\Jelly\beauty business\
```

狀態：本輪未確認第二條 UNC 路徑的可用性、權限或同步關係。自動化不得假設它是有效備份目的地，亦不得修改第一條唯讀資源庫。

### 2.4 發布入口與靜態資源

```text
根公開首頁：index.html
緊緻 DNA Landing：tightening-dna-preview-ecb2026/index.html
Staff：tightening-dna-preview-ecb2026/staff.html
Voucher verify：tightening-dna-preview-ecb2026/verify.html
緊緻 DNA bundle：tightening-dna-preview-dist/
緊緻 DNA assets：tightening-dna-preview-assets/
Vercel Functions：api/
Vercel routing：vercel.json
```

## 3. 頁面及原始碼對照

| 公開內容／功能 | HTML／入口 | JS | CSS／Assets | 備註 |
|---|---|---|---|---|
| 主網站 Home | `index.html` | 內嵌頁面 script | 內嵌 style＋根圖片資源 | 「緊緻 DNA」入口應先進 Landing Page |
| Booking | `booking.html` | 內嵌 | 內嵌 | 現存 Formspree form action；端點值留在 source，不複製到本 Log |
| Payment | `payment.html` | 內嵌 | 內嵌 | 操作前做實際支付流程核查 |
| Whitening DNA | `whitening-dna.html` | `whitening-dna-dist/app.js` | `whitening-dna-dist/app.css`、`whitening-dna-assets/` | 靜態 bundle |
| White Party | `white-party.html` | `white-party-dist/app.js` | `white-party-dist/app.css`、`white-party-assets/` | 靜態 bundle |
| Moonlight Garden／中秋 | `moonlight-garden.html` | `moonlight-garden-dist/app.js` | `moonlight-garden-dist/app.css`、`moonlight-garden-assets/` | 數據去向需獨立 Audit |
| Volnewmer | `volnewmer.html` | bundle 內嵌 | 根圖片資源 | 單頁 build artifact |
| 緊緻 DNA Landing | `tightening-dna-preview-ecb2026/index.html` | `tightening-dna-preview-dist/app.js` | `tightening-dna-preview-dist/app.css` | 正式 route 名仍含 `preview`；不要據名稱誤判環境 |
| AI Skin Journey | 同一 HTML；route rewrite | `app.js`、`future-simulator.js` | `app.css`、`future-simulator.css` | Route：`/tightening-dna-preview-ecb2026/ai-skin-journey` |
| 會員 Facial Popup | Landing 注入 | `gift-popup.js` | `gift-popup.css`、`member-layered-anti-ageing-hero-20260929.jpg` | 保留 claim／close／later 流程 |
| 易思面部提拉 | Landing 內 Treatment Modal | `treatment-modal.js` | `treatment-modal.css`＋approved assets | 不是獨立 HTML |
| EC 緊膚咒（易思緊膚系列） | Landing 內 Treatment Modal | `treatment-modal.js` | `treatment-modal.css`＋`tightening-curse-treatment/` | 不是獨立 HTML |
| Voucher／My Voucher | Landing 注入 | `voucher.js`、`future-simulator.js` | `voucher.css`、`voucher-home.css` | 呼叫 Campaign API |
| Staff Login／Records | `staff.html` | `staff.js` | `staff.css`、`staff-records.css` | 受 server-side session 保護 |
| Voucher Verify | `verify.html` | `verify.js` | `verify.css` | 查詢狀態，不應自動核銷 |

## 4. Design System

### 4.1 字體

已確認載入／使用：

```css
:root {
  --font-sans: Manrope, "Noto Sans TC", sans-serif;
  --font-serif: "Cormorant Garamond", "Noto Serif TC", Georgia, serif;
  --font-display: "Playfair Display", "Noto Serif TC", serif;
}
```

| 類型 | Family | 常用 Weight | 常用 Line Height |
|---|---|---:|---:|
| H1／大型展示 | Cormorant Garamond／Noto Serif TC | 400–500 | 0.86–1.05 |
| H2–H3 | Cormorant Garamond／Noto Serif TC | 400–500 | 0.91–1.15 |
| 中文內容標題 | Noto Serif TC／Noto Sans TC | 500–700 | 1.25–1.45 |
| Body | Manrope／Noto Sans TC | 400–500 | 1.6–1.9 |
| Button／Eyebrow | Manrope／Noto Sans TC | 600–800 | 1–1.4 |

> 實際 production bundle 部分 CSS 已壓縮；新增元件應沿用現有 family 及 visual tokens，不要另引入第四套字體。

### 4.2 核心色彩方向

- Pearl White／Ivory：主背景與玻璃卡。
- Soft Blush Pink：肌膚／護理視覺。
- Pale Lavender／Mauve：科技感、互動狀態及 CTA。
- Champagne Gold：小面積重點及禮遇識別。
- 深色文字：偏紫灰／暖灰，不用醫院藍或純黑大面積壓迫。

Popup 已確認變數：

```css
:root {
  --ecg-ink: #332e39;
  --ecg-muted: #756d79;
  --ecg-lavender: #b7a0c7;
  --ecg-soft: #f4eef7;
  --ecg-gold: #b89a68;
}
```

### 4.3 Gift Popup 結構及 RWD

檔案：

```text
tightening-dna-preview-dist/gift-popup.js
tightening-dna-preview-dist/gift-popup.css
```

規則：

- Desktop：人物圖為滿版背景；左側文案／會員禮遇及右側三層標籤為 HTML/CSS glass overlay。
- 三層標籤文字不可燒入圖片。
- Mobile 360px／390px：`.ecg-visual` 為 `position: relative`、`aspect-ratio: 3/2`；`.ecg-layer-map` 為絕對 overlay。
- Mobile 三卡以百分比定位：表層約 `top: 7%`、中層 `36%`、深層 `65%`，右邊距約 `3.5%`，寬約 `45%`。
- `.ecg-layer` 必須 `pointer-events: auto`；背景圖不得攔截點擊。
- Mobile 圖片下方再顯示標題、說明、會員禮遇及 CTA；不得把整個 Popup 變成單一圖片。
- Popup 打開時禁止背景滾動；內容容器 `overflow-anchor: none` 並重設 `scrollTop=0`，避免手機首次開啟跳位。
- 保留：立即領取、稍後再看、×、ESC、原 Campaign API、會員流程。

最近本機驗證：Desktop 1440、Mobile 390、Mobile 360 無 horizontal overflow；Console 0 error。此結果是本機驗證，不代表已部署。

## 5. Authentication、Database 與 Environment Router

### 5.1 CMS／管理後台

- 目前未發現傳統 CMS 管理後台。
- Staff 入口：`/tightening-dna-preview-ecb2026/staff.html`。
- Staff authentication 由 Vercel Function 與 server-side session 處理，不應在前端 hard-code PIN。
- Staff session／login 實作位置：`api/_staff-session.js`、`api/staff/login.js`、`api/staff/session.js`。

### 5.2 Environment Variable 名稱

Preview／TEST：

```text
CAMPAIGN_DB_ENV=test
TEST_DATABASE_URL
STAFF_SESSION_SECRET_TEST
STORE_PASSWORD_RED_MARKET
STORE_PASSWORD_HAC_SA_WAN
STORE_PASSWORD_TAIPA
STORE_PASSWORD_FAI_CHI_KEI
```

Production：

```text
CAMPAIGN_DB_ENV=production
PRODUCTION_DATABASE_URL
STAFF_SESSION_SECRET
STORE_PASSWORD_RED_MARKET
STORE_PASSWORD_HAC_SA_WAN
STORE_PASSWORD_TAIPA
STORE_PASSWORD_FAI_CHI_KEI
```

平台提供：

```text
VERCEL_ENV
```

Secret 位置：Vercel Project `ec-beauty-new` → Settings → Environment Variables。未提交本機開發值只可在 repo 根 `.env.local`；該檔不得加入 Git 或 Obsidian。

### 5.3 Database

- Provider：Neon PostgreSQL。
- TEST project（歷史已確認名稱）：`ec-beauty-campaign-test`。
- Production project（歷史已確認名稱）：`ec-beauty-campaign-production`。
- Connection String 只由 `TEST_DATABASE_URL`／`PRODUCTION_DATABASE_URL` 提供；本 Log 不保存值。
- DB router：`api/_campaign-test-db.js`（檔名保留歷史名稱，實際環境選擇需以 code 與 Vercel 設定核查）。
- Migration／schema：`migrations/`。
- Campaign tables：`campaigns`、`campaign_rewards`、`campaign_participations`、`vouchers`、`redemptions`、`campaign_stores`、`campaign_staff_credentials`。
- 正確核銷表為 `redemptions`；不得另建平行 `voucher_redemptions`。

### 5.4 Campaign／Staff APIs

```text
api/campaign-test/claim.js
api/campaign-test/my-voucher.js
api/campaign-test/verify.js
api/staff/login.js
api/staff/session.js
api/staff/voucher.js
api/staff/redeem.js
api/staff/records.js
api/staff/materials.js
```

`api/staff/materials.js` 透過 `vercel.json` 包含 `private-staff-assets/**`；內部資料不得直接變成公開 asset URL。

## 6. 外部服務

| 服務 | 狀態／位置 | 安全說明 |
|---|---|---|
| Vercel | `.vercel/project.json`＋Vercel Project Settings | `.vercel` identity 可記錄；Token／Deploy Hook 不可寫入本 Log |
| GitHub | `origin` remote | 自動化使用 OS／Git Credential Manager；不可記錄 PAT |
| Neon | Vercel Environment Variables | 只記錄 env 名稱，不記錄 Connection String |
| Formspree | `booking.html` 的 form action | Endpoint 已在公開 source；變更前核實帳戶及收件流程 |
| Manus tRPC | `vercel.json` 的 `/api/trpc/:path*` rewrite | 不得猜測或修改 Manus schema；保持現有代理 |
| Manus App Auth | 緊緻 DNA bundle 內現有登入程式 | 公開 app metadata 與 Secret 分開；不要將 session／Bearer Token 記錄到檔案 |
| Google Apps Script／Sheets | 本輪未在主要 Campaign／Staff 程式確認正式同步 | 不得假設已接通；需做獨立 read-only integration audit |

## 7. Vercel 部署及核查命令

必須先在 repo 根執行：

```powershell
npx vercel whoami
npx vercel inspect
```

Preview：

```powershell
npx vercel deploy --yes
```

Production（只在管理員明確批准後）：

```powershell
npx vercel deploy --prod --yes
```

部署完成不等於 public alias 已更新。必須核對：

```text
Public Domain → Active Deployment ID → Commit SHA
```

Deploy Hook：本輪沒有安全地確認；不得在 Obsidian 建立或存放 Deploy Hook URL。若日後使用，放入受控 Secret Store 並只在 Log 記錄 Secret 名稱與 owner。

## 8. Vercel Routes

`vercel.json` 已確認：

```text
/tightening-dna-preview-ecb2026/ai-skin-journey
  → /tightening-dna-preview-ecb2026/index.html

/campaign/:campaignId/verify/:token
  → /tightening-dna-preview-ecb2026/verify.html?campaignId=:campaignId&token=:token

/api/trpc/:path*
  → Manus tRPC upstream
```

## 9. OpenClaw 自動化操作流程

1. 讀取 Vault 根 `CLAUDE.md` 及目標子資料夾 `instructions.md`。
2. `git status --short`；不得覆蓋或清理不屬於本任務的修改。
3. 核對 branch、commit、`.vercel/project.json` 及 public alias。
4. 只檢查環境變數是否存在與 scope 是否正確；不得輸出值。
5. 修改前建立驗收條件；只作 surgical change。
6. 本機 syntax／responsive／console QA。
7. Preview deploy 及 public URL QA。
8. Production 需要獨立明確批准；部署後核對 active deployment ID、commit SHA、DB environment 及 rollback target。
9. 回報 `confirmed / pending / blocked`，不可把配置、歷史或 Preview 結果當成 Production runtime 事實。

## 10. 未確認／需另行 Audit

- Obsidian 指定目錄缺少 `instructions.md`，因此本文件尚未發布到 Vault。
- `\\wellnessnas\Jelly\beauty business\` 可用性及備份規則未確認。
- Google Sheet／Apps Script 是否與中秋活動或會員資料正式同步未確認。
- Production public alias、Active Deployment ID、現行 commit 會漂移，任何部署前必須即時查證。
- CMS 不存在的判斷來自當前 repo；若另有外部管理平台，需由管理員補充名稱及 URL，但不得在此文件放密碼。

## 11. Secret Registry Template（只記錄位置）

| Secret logical name | Owner | Storage | Scope | Last rotated | Value |
|---|---|---|---|---|---|
| `PRODUCTION_DATABASE_URL` | 管理員 | Vercel Environment Variables | Production | 待填 | **DO NOT RECORD** |
| `TEST_DATABASE_URL` | 管理員 | Vercel Environment Variables | Preview | 待填 | **DO NOT RECORD** |
| `STAFF_SESSION_SECRET` | 管理員 | Vercel Environment Variables | Production | 待填 | **DO NOT RECORD** |
| `STAFF_SESSION_SECRET_TEST` | 管理員 | Vercel Environment Variables | Preview | 待填 | **DO NOT RECORD** |
| `STORE_PASSWORD_*` | 管理員 | Vercel Environment Variables＋credential hash in DB | Environment-specific | 待填 | **DO NOT RECORD** |
| Vercel access token | 管理員 | OS credential／Vercel CLI auth | Account | 待填 | **DO NOT RECORD** |
| GitHub credential | 管理員 | Git Credential Manager | Repository | 待填 | **DO NOT RECORD** |

---

更新本 Log 時，必須附上日期、資料來源、核查命令及 `confirmed / pending / blocked` 狀態；禁止把推測寫成現況。
