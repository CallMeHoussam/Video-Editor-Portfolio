# Bunny Stream Video Hosting, Security & Workflow Guide — Evoless

This document outlines the video hosting architecture, CMS publishing workflow, and security measures implemented for **Evoless (Houssam Elmsafer)**.

---

## 1. Video Publishing Workflow

You never need to store large MP4 or ProRes video files inside the source code repository or deploy them to Vercel.

### Step-by-Step Workflow:
1. **Upload to Bunny Stream**:
   - Log into your [Bunny.net Dashboard](https://dash.bunny.net/stream).
   - In your Video Library (e.g. "Evoless Portfolio"), click **Upload Video** and select your edited file.
2. **Copy Video Identifiers**:
   - Once processed, copy the **Video ID** (e.g. `d719e85c-29a5-4eb8-b0a5-f8bbfa88c0ee`).
   - Your **Library ID** is shown at the top of your Bunny Stream dashboard (e.g. `245890`).
3. **Paste into Evoless Studio CMS**:
   - Open your live CMS at `https://evoless.com/studio` (or `http://localhost:3000/studio`).
   - Click **Create Project** or **Edit** on an existing project.
   - Under **Video Provider**, choose **Bunny Stream**.
   - Paste the **Bunny Video ID** and your **Bunny Library ID**.
   - Select your container aspect ratio:
     - `9:16` for TikTok / Reels / Shorts.
     - `16:9` for widescreen commercials & YouTube.
     - `1:1` or `4:5` for square and social feed formats.
4. **Publish the Project**:
   - Click **Save & Publish Live** (or **Save as Draft** to preview privately first).
   - The video appears automatically in the portfolio and on its dedicated project page.

---

## 2. Security Architecture & Server-Side Token Signing

### Server-Side Private Key Security
- Private signing keys (`BUNNY_STREAM_TOKEN_KEY`) are kept **strictly on the server** in `.env.local` / Vercel Environment Variables.
- The browser never receives or has access to your private security key.

### How Signed Playback Works
1. When a visitor loads a case study page, `VideoPlayer.tsx` requests a short-lived playback authorization from `/api/video/token`.
2. The server endpoint hashes the private token key, video ID, and expiration timestamp using SHA256:
   $$\text{token} = \text{SHA256}(\text{BUNNY\_STREAM\_TOKEN\_KEY} + \text{videoId} + \text{expires})$$
3. The server returns a signed embed URL with an expiration window (default: 3600 seconds / 1 hour):
   `https://iframe.mediadelivery.net/embed/{libraryId}/{videoId}?token={token}&expires={expires}`
4. If someone copies this link, it will expire and fail on unauthorized requests.

---

## 3. Allowed Domain Restrictions (Referrer Whitelisting)

To ensure your videos cannot be embedded on competitor or third-party websites:
1. In the Bunny.net dashboard, navigate to **Stream** > **Your Library** > **Security**.
2. Find **Allowed Referrers / Allowed Domains**.
3. Add your production and local testing domains:
   - `localhost:3000`
   - `evoless.com`
   - `*.evoless.com`
   - `*.vercel.app` (for preview deployments)
4. Enable **Block Direct URL Access** if you want playback strictly through your website player.

---

## 4. Realistic Security & DRM Evaluation

> [!IMPORTANT]
> **What Signed Playback & Domain Restrictions Protect:**
> - Prevents external sites from hotlinking and stealing your CDN bandwidth.
> - Prevents casual right-click saving of raw video files.
> - Restricts playback to authorized domain referrers and verified token sessions.

> [!WARNING]
> **What CANNOT Be Completely Prevented by Any Web Player:**
> - **Screen Recording**: No web player or browser DRM can prevent users from using software like OBS, macOS Screen Record, Windows Game Bar, or mobile screen recorders.
> - **Hardware Capture**: HDMI capture devices (e.g. Elgato) can capture any video rendered on a display.
> - Watermarks, burned-in brand signatures, or creative resolution mastering are the most effective protections against content re-use.

---

## 5. Account Settings Requiring Your Configuration

| Setting | Location in Bunny.net | Purpose |
|---------|-----------------------|---------|
| `BUNNY_STREAM_LIBRARY_ID` | Stream > Library > General Settings | Identifies your video storage container. |
| `BUNNY_STREAM_TOKEN_KEY` | Stream > Library > Security > Token Authentication | Master secret key used by `/api/video/token` to sign embeds. |
| Allowed Referrers | Stream > Library > Security > Allowed Referrers | Restricts playback to `evoless.com` and `localhost:3000`. |
| Player Watermark / Branding | Stream > Library > Player Customization | Optional visual logo in player corner. |
