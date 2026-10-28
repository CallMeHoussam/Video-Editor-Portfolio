# Portfolio 2027 — Evoless

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.4.2-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Sanity](https://img.shields.io/badge/Sanity_CMS-Studio-F03E2F?style=for-the-badge&logo=sanity&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)

<br />

**A state-of-the-art, cinematic digital portfolio engineered for creative video editors, visual storytellers, and motion designers.**

[Live Demo](https://evoless.com) · [Report Bug](https://github.com/your-username/portfolio-2027/issues) · [Request Feature](https://github.com/your-username/portfolio-2027/issues)

</div>

---

## 📖 Overview

**Portfolio 2027 (Evoless)** is a high-performance, production-ready portfolio application built for **Houssam Elmsafer**, a premier creative video editor and motion designer based in Casablanca, Morocco.

Designed from the ground up to reflect the rhythm, art direction, and pacing of top-tier video production, the platform features native bilingual support (English and French), a custom real-time CMS Studio dashboard, seamless Sanity CMS schema integration, resilient video delivery via Bunny Stream and major video networks, and instant WhatsApp conversion pathways.

---

## ✨ Key Features

- **🎬 Cinematic Video Showcase & Player Engine**
  - Custom `VideoPlayer` supporting **Bunny Stream**, **Vimeo**, **YouTube**, and **Direct MP4/WebM** assets.
  - Multi-ratio playback with responsive bounding: `16:9` widescreen commercials, `9:16` vertical reels/TikToks, `1:1` square, and `4:5` social cuts.
  - Global single-playback coordinator pausing all other playing media when one starts.
  - Server-side SHA-256 HMAC signed token generation (`/api/video/token`) for secured Bunny Stream delivery.

- **🎛️ Custom Studio Dashboard & Sanity CMS Ready**
  - Built-in lightweight Studio CMS at `/studio` protected by session PIN authentication (`CMS_ADMIN_PIN`).
  - Create, edit, draft, reorder, feature, and publish projects without redeploying code.
  - Live settings control for WhatsApp greetings, social profiles, contact information, and CV downloads.
  - Production-ready Sanity Studio configuration (`sanity.config.ts`) with schemas defined for projects, categories, services, work history, skills, and site settings in `src/sanity/schemaTypes/`.

- **🌍 Native Multilingual Architecture (EN & FR)**
  - Full localization routes at `/[lang]` (`/en` and `/fr`) powered by Next.js App Router dynamic segments.
  - Context-aware language switcher preserving the active project slug and route hierarchy during language toggles.
  - Tailored localized assets including English (`Houssam_CV_ENG.pdf`) and French (`Houssam_CV_FRA.pdf`) CV downloads.

- **🎨 Art-Directed Visual Hierarchy & Theming**
  - Deep luxury dark mode (`#07060A`, `#14111E`, `#8B5CF6`) with a refined editorial light mode.
  - Typography driven by Google Fonts (`Outfit` for display headlines and `Plus Jakarta Sans` for editorial body copy).
  - Ambient glow lighting, smooth micro-interactions, custom scrollbars, and accessible focus states.

- **💬 High-Converting WhatsApp Integration**
  - Seamless WhatsApp inquiry buttons across the Hero, Navigation, Case Study footers, and floating action button.
  - Configurable starter messages in English and French that pre-fill project titles directly into the chat link.

---

## 🛠️ Tech Stack

### Frontend & Framework
- **Core Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Language:** [TypeScript 5](https://www.typescriptlang.org/) (Strict typing across models, props, and schemas)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/postcss` and native CSS custom properties
- **Icons:** [Lucide React](https://lucide.dev/)

### CMS & Data Architecture
- **Built-in Studio:** Next.js Route Handlers (`/api/cms/*`) backed by persisted JSON storage
- **Headless CMS Ready:** [Sanity.io](https://www.sanity.io/) Studio schemas and configurations (`sanity.config.ts`)
- **Video Delivery:** Bunny Stream CDN, Vimeo, YouTube, HTML5 Video

### Deployment & CI/CD
- **Hosting:** [Vercel](https://vercel.com/) Edge Network
- **DNS / SSL:** Automated HTTPS, Edge caching, and canonical hreflang handling

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed locally:
- **Node.js**: `v18.18.0` or higher (Node 20.x or 22.x LTS recommended)
- **Package Manager**: `npm`, `pnpm`, or `yarn`
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/portfolio-2027.git
   cd portfolio-2027
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and configure your credentials:
   ```env
   # Studio CMS Authentication
   CMS_ADMIN_PIN=evoless2027
   CMS_AUTH_SECRET=your_super_secret_32_character_string

   # Video Hosting (Bunny Stream - Optional for signed playback)
   BUNNY_STREAM_LIBRARY_ID=your_bunny_library_id
   BUNNY_STREAM_TOKEN_KEY=your_bunny_token_key

   # Canonical URL
   NEXT_PUBLIC_SITE_URL=http://localhost:3000

   # Optional Cloud Sanity Integration
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_READ_TOKEN=your_sanity_read_token
   ```

4. **Run the local development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - **English Homepage:** [http://localhost:3000/en](http://localhost:3000/en)
   - **French Homepage:** [http://localhost:3000/fr](http://localhost:3000/fr)
   - **Studio Dashboard:** [http://localhost:3000/studio](http://localhost:3000/studio) (Default PIN: `evoless2027`)

---

## 📁 Project Structure

```text
Portfolio 2027/
├── data/
│   └── portfolio-store.json       # Local file-based CMS persistence store
├── public/
│   ├── files/cv/                  # Localized CV PDFs (EN & FR)
│   ├── images/                    # Project thumbnails and brand assets
│   └── favicon.ico
├── src/
│   ├── app/                       # Next.js App Router root
│   │   ├── [lang]/                # Localized dynamic segment (/en, /fr)
│   │   │   ├── work/[slug]/       # Deep case study pages
│   │   │   └── page.tsx           # Localized landing page
│   │   ├── api/
│   │   │   ├── cms/               # Internal Studio CMS endpoints (auth, projects, settings)
│   │   │   └── video/token/       # Server-side Bunny Stream token signer
│   │   ├── studio/                # Studio CMS administration page
│   │   ├── globals.css            # Tailwind v4 configuration, theme variables & tokens
│   │   └── layout.tsx             # Root layout with fonts, metadata, and theme provider
│   ├── components/                # Reusable React UI components
│   │   ├── CaseStudyDetail.tsx    # Case study deep dive presentation
│   │   ├── CinematicHero.tsx      # Hero section with headline and featured reel
│   │   ├── Navbar.tsx             # Responsive header with language and theme switches
│   │   ├── PortfolioSection.tsx   # Project grid with multi-category filters
│   │   ├── ProjectCard.tsx        # Project preview card with hover video playback
│   │   ├── StudioDashboard.tsx    # Admin dashboard for project management
│   │   └── VideoPlayer.tsx        # Unified multi-source video player
│   ├── data/                      # Initial fallback dataset and translations
│   ├── lib/                       # Helpers (auth, translations, video utilities)
│   ├── sanity/
│   │   └── schemaTypes/           # Sanity studio content schemas
│   └── types/                     # TypeScript data contracts and interfaces
├── .env.example                   # Safe environment template
├── next.config.ts                 # Next.js configuration
├── postcss.config.mjs             # PostCSS with Tailwind CSS v4 plugin
├── sanity.config.ts               # Sanity Studio root configuration
└── tsconfig.json                  # TypeScript compiler settings
```

---

## 🚢 Deployment Guide

The portfolio is optimized for zero-configuration continuous deployment on [Vercel](https://vercel.com/).

### Deploying to Vercel

1. **Push your code to GitHub / GitLab:**
   ```bash
   git add .
   git commit -m "feat: production portfolio ready"
   git push origin main
   ```

2. **Import into Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/new).
   - Import your repository.
   - Framework preset will automatically be detected as **Next.js**.

3. **Configure Environment Variables:**
   Under **Settings > Environment Variables**, add:
   - `CMS_ADMIN_PIN`: Your secret studio access PIN.
   - `CMS_AUTH_SECRET`: A 32-character random string.
   - `NEXT_PUBLIC_SITE_URL`: Your production domain (e.g., `https://evoless.com`).
   - `BUNNY_STREAM_LIBRARY_ID` and `BUNNY_STREAM_TOKEN_KEY` (if using Bunny Stream signed playback).
   - Optional Sanity variables if connecting to a cloud Sanity dataset.

4. **Deploy & Set Custom Domain:**
   - Click **Deploy**.
   - Navigate to **Project Settings > Domains** to configure your apex domain and DNS (`A` record pointing to `76.76.21.21` and `CNAME` pointing to `cname.vercel-dns.com`).

---

## 📄 License & Credits

- **Design & Code:** Developed for **Houssam Elmsafer** (Evoless).
- **All rights reserved:** Video cuts, case study copy, and creative projects remain the intellectual property of Houssam Elmsafer and associated client brands.
- **Open Source Libraries:** Next.js, Tailwind CSS, Lucide Icons, and React are copyright their respective authors under the MIT License.
