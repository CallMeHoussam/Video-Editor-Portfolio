# Sanity CMS Setup & Credentials Guide for Evoless Portfolio

This guide explains how to connect your **Evoless** portfolio to Sanity CMS Cloud.

---

## 1. Quick Summary: How the CMS Architecture Works

Your Evoless website supports a dual-layer CMS architecture:
1. **Built-in Studio CMS (Active by default)**:
   - Available immediately at `/studio`.
   - Protected by your admin PIN (default: `evoless2027`, configurable in `.env.local` via `CMS_ADMIN_PIN`).
   - Stores data in `data/portfolio-store.json` with instant zero-code publishing, draft preview mode, and JSON backup/restore.
2. **Sanity Cloud Studio (Headless CMS)**:
   - Ready with production schemas in `src/sanity/schemaTypes/`.
   - Supports team collaboration, cloud asset CDN, and Sanity Studio authentication.

---

## 2. Step-by-Step Sanity Cloud Setup

### Step 1: Create a Free Sanity Account & Project
1. Go to [https://www.sanity.io](https://www.sanity.io) and sign up with your Google or GitHub account.
2. In your terminal, you can create a project or do it via the Sanity web dashboard:
   ```bash
   npx sanity@latest init
   ```
3. When prompted:
   - Select **Create new project**.
   - Project name: `evoless-portfolio`
   - Dataset configuration: choose **production** (default).

### Step 2: Retrieve Your Credentials
In the [Sanity Manage Dashboard](https://www.sanity.io/manage):
1. Note your **Project ID** (e.g., `a1b2c3d4`).
2. Confirm your **Dataset Name** (`production`).
3. Under **API** > **Tokens**:
   - Click **Add API token**.
   - Name: `Evoless Website Read/Write Token`.
   - Permissions: Select **Editor** (read + write).
   - Copy the generated token string securely.

### Step 3: Configure Environment Variables
Open or create `.env.local` in your project root:

```env
# =============================================================================
# SANITY CMS CONFIGURATION
# =============================================================================
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_sanity_api_token_here
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01

# =============================================================================
# EVOL​ESS STUDIO AUTHENTICATION
# =============================================================================
CMS_ADMIN_PIN=evoless2027

# =============================================================================
# OPTIONAL: BUNNY STREAM VIDEO CDN CREDENTIALS
# =============================================================================
BUNNY_STREAM_LIBRARY_ID=your_bunny_library_id
BUNNY_STREAM_TOKEN_KEY=your_bunny_token_security_key
```

### Step 4: Configure CORS Origins in Sanity
In [Sanity Manage](https://www.sanity.io/manage) under **API** > **CORS Origins**:
1. Add `http://localhost:3000` (allow credentials: Yes).
2. Add your production domain (e.g. `https://evoless.com`, allow credentials: Yes).

---

## 3. Schema Architecture Mapping

The schemas in `src/sanity/schemaTypes/` map directly to the portfolio data model:

| Schema Document | Filename | Description |
|-----------------|----------|-------------|
| `project` | `src/sanity/schemaTypes/project.ts` | Title (EN/FR), slug, brief, creative approach, video references, aspect ratio, draft/published state, metrics. |
| `category` | `src/sanity/schemaTypes/category.ts` | Multi-category taxonomy (Ads, UGC, Motion, Brand). |
| `service` | `src/sanity/schemaTypes/service.ts` | Services, deliverables, tools, highlights (EN/FR). |
| `experience` | `src/sanity/schemaTypes/experience.ts` | Career history (Tagui Media, Stay in Media, SenseiProd, Technaps). |
| `education` | `src/sanity/schemaTypes/education.ts` | LionsGeek & Bachelor Degree in International Trade. |
| `skillGroup` | `src/sanity/schemaTypes/skillGroup.ts` | Tools & technical disciplines from Houssam's CV. |
| `siteSettings` | `src/sanity/schemaTypes/siteSettings.ts` | WhatsApp number, bio summary, location, socials. |

---

## 4. Transferring Data from Local Studio to Sanity

1. Log into your local Studio CMS at `http://localhost:3000/studio`.
2. Go to the **Backup & Sanity Sync** tab.
3. Click **Export JSON Backup** to save your verified data.
4. You can import this JSON directly into Sanity using the Sanity CLI:
   ```bash
   npx sanity dataset import evoless-portfolio-backup-YYYY-MM-DD.json production
   ```

---

## 5. Security & Verification Checklist

- [x] Admin PIN protection on `/studio` route (`/api/cms/auth`).
- [x] Draft projects are hidden from public portfolio grid until published.
- [x] Secret tokens (`SANITY_API_READ_TOKEN`, `BUNNY_STREAM_TOKEN_KEY`) are kept in `.env.local` and never committed to source control.
- [x] Dynamic JSON-LD and OpenGraph tags update automatically when projects are published.
