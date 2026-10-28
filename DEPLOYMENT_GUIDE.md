# Evoless Portfolio — Vercel Deployment & Production Guide

This guide covers deploying the **Evoless** website to **Vercel**, configuring DNS, setting environment variables, and establishing Bunny Stream video CDN security.

---

## 1. Why Vercel?

Next.js 16 App Router was built by Vercel. Deploying on Vercel provides:
- Zero-configuration serverless execution for `/api/cms/*` and `/api/video/token`.
- Global Edge Network CDN for assets and localized pages (`/en`, `/fr`).
- Automatic HTTPS with free SSL certificates.
- Instant preview deployments for Git branches.

---

## 2. Step-by-Step Deployment Instructions

### Step 1: Push Code to a Git Provider (GitHub / GitLab)
If you haven't already pushed your code to GitHub:
```bash
git init
git add .
git commit -m "feat: complete Evoless portfolio with CMS, WhatsApp, and Bunny Stream integration"
git branch -M main
git remote add origin https://github.com/your-username/evoless-portfolio.git
git push -u origin main
```

### Step 2: Import into Vercel
1. Log into [vercel.com](https://vercel.com) (sign up with GitHub if you don't have an account).
2. Click **Add New...** > **Project**.
3. Locate `evoless-portfolio` and click **Import**.
4. In the **Configure Project** screen:
   - **Framework Preset**: Next.js (automatically detected).
   - **Root Directory**: `./`

### Step 3: Configure Environment Variables in Vercel
Expand the **Environment Variables** section and add the following keys from your `.env.example`:

| Environment Variable | Recommended Value | Notes |
|----------------------|-------------------|-------|
| `CMS_ADMIN_PIN` | `evoless2027` (or your chosen PIN) | Secret PIN to access `https://evoless.com/studio`. |
| `CMS_AUTH_SECRET` | `generate-a-random-32-char-salt` | Used for HMAC signing of admin session cookies. |
| `NEXT_PUBLIC_SITE_URL` | `https://evoless.com` | Production canonical URL. |
| `BUNNY_STREAM_LIBRARY_ID` | `your_bunny_library_id` | Copied from your Bunny.net Stream dashboard. |
| `BUNNY_STREAM_TOKEN_KEY` | `your_bunny_token_key` | Master security token for signed video embeds. |

### Step 4: Deploy
Click **Deploy**. Vercel will build your application in under 2 minutes and provide a live URL (`https://evoless-portfolio-*.vercel.app`).

---

## 3. Custom Domain Configuration (`evoless.com`)

1. In your Vercel Dashboard, navigate to **Settings** > **Domains**.
2. Enter `evoless.com` and click **Add**.
3. Choose to automatically redirect `www.evoless.com` to `evoless.com`.
4. Configure your domain DNS records at your registrar (Namecheap, GoDaddy, Cloudflare, etc.):
   - **Apex Domain (`@`)**: Type `A`, Value `76.76.21.21`
   - **Subdomain (`www`)**: Type `CNAME`, Value `cname.vercel-dns.com`
5. Vercel automatically provisions and renews SSL certificates via Let's Encrypt.

---

## 4. Bunny Stream Domain Security Configuration

To ensure your videos cannot be embedded on unauthorized websites:
1. Log into [dash.bunny.net/stream](https://dash.bunny.net/stream).
2. Select your video library > **Security**.
3. Under **Allowed Referrers**, add:
   - `localhost:3000` (for local development)
   - `evoless.com`
   - `*.evoless.com`
   - `*.vercel.app` (allows your Vercel preview URLs to play videos)
4. Enable **Token Authentication** if you want short-lived signed tokens (`/api/video/token`).

---

## 5. Local Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run production build
npm run build

# Start production server locally
npm run start
```

---

## 6. How to Publish a New Project (CMS Workflow)

1. Open your browser and go to `https://evoless.com/studio`.
2. Enter your **Admin Security PIN** (`evoless2027`).
3. Click **Create Project**.
4. Fill in:
   - Title in English and French.
   - Client, Year, and Role.
   - Select Categories (Ads, UGC, Motion Graphics, etc.).
   - Video Provider: Select **Bunny Stream** and paste your **Bunny Video ID**.
   - Aspect ratio: `9:16` (Vertical Reel) or `16:9` (Widescreen Commercial).
   - Enter your Brief and Creative Approach.
5. Click:
   - **Save as Draft**: Project is saved privately. Test it via the generated **Preview Draft** link.
   - **Save & Publish Live**: Project instantly appears on the live homepage and work archive.
