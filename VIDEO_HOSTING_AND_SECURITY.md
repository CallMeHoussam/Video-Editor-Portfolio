# Cloudflare R2 Standard Storage & Free-Tier Video Infrastructure — Evoless

This document details the **100% free video infrastructure** built for **Evoless (Houssam Elmsafer)** using Cloudflare R2 Standard Storage via its S3-compatible API.

---

## 1. Cloudflare R2 Free Monthly Allowance

Cloudflare R2 includes the following monthly limits for every account:
- **10 GB-month** of Standard Storage.
- **1,000,000 Class A operations** per month (e.g. `PutObject`, `ListObjectsV2`, `CreateMultipartUpload`, `UploadPart`, `CompleteMultipartUpload`).
- **10,000,000 Class B operations** per month (e.g. `GetObject`, `HeadObject`).
- **$0 Egress fees**: Bandwidth to internet viewers is completely free (unlike AWS S3 or Google Cloud Storage, which charge $0.08–$0.12/GB).

### Staying Within the Free Tier
For a portfolio displaying 15 to 30 video cuts and motion graphics reels:
- 20 high-retention vertical reels (each 30–60s encoded at 1080p, ~20–35 MB each) use only **~0.5 to 0.7 GB** of your 10 GB limit (~6% of your free allowance).
- 5 widescreen commercial cuts (each 1–2 minutes, ~80–120 MB each) use **~0.5 GB**.
- Total portfolio storage will typically sit between **1 GB and 2 GB**, safely within the **10 GB free ceiling**.

### What Happens if You Exceed the Free Allowance?
Cloudflare R2 does **not** silently throttle or delete files if you exceed the free allowance. Instead, usage above the free tier is billed at standard rates:
- **Storage over 10 GB**: \$0.015 per GB per month (e.g. 10 extra GB costs \$0.15/month).
- **Class A operations over 1,000,000**: \$4.50 per 1,000,000 requests.
- **Class B operations over 10,000,000**: \$0.36 per 1,000,000 requests.
- **Egress remains 100% free** regardless of how many millions of visitors watch your videos.
- *Note:* We deliberately do **not** enable Infrequent Access storage, because standard R2 retrieval is already zero-egress and does not incur minimum storage duration penalties or data retrieval fees.

---

## 2. Architecture & Security: Private Storage & Signed Playback

### Private Bucket Default
The R2 bucket remains **private**. You do not need to enable public bucket access or expose public S3 URLs.

### Credentials Never Touch the Browser
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, and `R2_SIGNING_SECRET` remain strictly on the server in `.env.local` or host environment variables.
- The browser never receives S3 keys.
- Unauthorized users cannot upload, overwrite, or delete videos (all upload endpoints require admin PIN session cookies verified by `verifyAdminRequest`).

### Upload Flow (Direct Presigned Uploads)
1. In `/studio`, the editor drops or selects an MP4 video.
2. The browser calls `POST /api/video/r2/upload` with `{ action: 'presign-put', fileName, contentType }`.
3. The server validates admin credentials and mints a short-lived (15-minute) presigned `PUT` URL.
4. For larger files (>80 MB), a chunked multipart upload (`multipart-start`, `multipart-part`, `multipart-complete`) is automatically used.
5. The browser streams bytes directly to Cloudflare R2 with progress feedback.
6. The browser extracts a suitable video frame (at ~1.5s) using HTML5 canvas, saves the thumbnail to R2 under `thumbnails/`, and attaches it to the project.

### Playback Flow (Temporary Signed GET URLs & Range Streaming)
1. Published projects store an R2 reference (e.g. `r2://videos/1794479472817-nike-air.mp4`).
2. When a visitor views a project, `VideoPlayer.tsx` requests a temporary signed playback URL via `POST /api/video/r2/token`.
3. The endpoint enforces origin/referer checks and issues a signed GET URL with a **1-hour TTL** (`expiresIn: 3600`).
4. **Handling Longer Video Viewing Without Interruption**: `VideoPlayer.tsx` sets an automatic refresh timer 5 minutes before expiration to silently renew the signed playback URL in the background, so playback and seeking are never interrupted.
5. **Seeking & Range Requests**: Cloudflare R2 natively supports HTTP `Range: bytes=start-end` requests, allowing instant seeking across the scrubber. Alternatively, `/api/video/r2/stream` acts as a streaming proxy with explicit HTTP 206 Partial Content support.

---

## 3. Step-by-Step: How to Create Your Cloudflare R2 Bucket

1. Log into your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left navigation menu, click **R2**.
3. Click **Create bucket**.
   - Name: `evoless-videos` (or your preferred name).
   - Location: **Automatic** (or select your closest region).
   - Default storage class: **Standard** (keep Standard, do NOT select Infrequent Access).
   - Click **Create Bucket**.
4. Create an R2 API Token:
   - On the R2 overview page, click **Manage R2 API Tokens** on the right side.
   - Click **Create API token**.
   - Token name: `evoless-portfolio-r2`.
   - Permissions: **Object Read & Write**.
   - Apply to specific bucket: select `evoless-videos` (or all buckets).
   - Click **Create API Token**.
5. Copy the following credentials into your `.env.local`:
   - **Account ID**: Displayed on the R2 overview page or token summary.
   - **Access Key ID**: The 32-character key generated.
   - **Secret Access Key**: The 64-character secret generated (copy it now, Cloudflare only shows it once).
   - **Bucket Name**: `evoless-videos`.

---

## 4. Environment Variables to Add (`.env.local`)

```env
# Cloudflare R2 Standard Storage (100% Free Video Hosting)
R2_ACCOUNT_ID=your_cloudflare_account_id_here
R2_ACCESS_KEY_ID=your_r2_access_key_id_here
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key_here
R2_BUCKET_NAME=evoless-videos
R2_PUBLIC_DOMAIN=
R2_SIGNING_SECRET=
```

---

## 5. Local Development Fallback

If you test offline or before setting up Cloudflare R2:
- Drop test `.mp4` files into `public/videos/` (e.g. `public/videos/sample.mp4`).
- In `/studio` -> **Add Video**, click the **Local File** source tab and enter `/videos/sample.mp4`.
- Local videos are strictly ignored by Git (`.gitignore` protects `/public/videos/*`), ensuring large video binaries are never committed to your repository.
