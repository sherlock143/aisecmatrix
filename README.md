# AISecMatrix — Free Security Tools Site

Static site. No build step, no frameworks, no dependencies except two CDN scripts (Google Fonts, jsQR).

## What's included

| Tool | Backend needed | Notes |
|---|---|---|
| Password Strength Checker | None | Pure JS entropy + pattern analysis |
| Password Breach Checker | None | Calls HIBP's free Pwned Passwords API directly (CORS-enabled, k-anonymity — password never leaves browser in full) |
| Scam Message Analyzer | None | Rule-based pattern matching, pure JS |
| QR Code Safety Scanner | None | jsQR decodes locally, link heuristics in JS |
| Wi-Fi Default Password Lookup | None | Static JSON database (`assets/wifi-db.json`) |
| Security Headers Scanner | **Yes — Cloudflare Worker** | Browsers can't read another origin's headers directly (CORS). See below. |

## Deploy to Cloudflare Pages (free)

1. Push this folder to a GitHub repo (e.g. rename/repurpose `sherlock143/vmsecops-site`, or make a new repo `aisecmatrix-site`).
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → select the repo.
3. Build settings: **no build command needed** (it's static HTML) — set build output directory to `/` (root).
4. Deploy. You'll get a `*.pages.dev` URL immediately.
5. Add custom domain: Pages project → Custom domains → add `aisecmatrix.com`.
6. In myglobalhost.net's DNS panel, point your domain per Cloudflare's on-screen instructions (usually: change nameservers to Cloudflare's, or add a CNAME if using "CNAME setup").

## Deploy the Security Headers Worker (only needed for that one tool)

1. Cloudflare dashboard → Workers & Pages → Create → Worker.
2. Paste in the contents of `worker/headers-worker.js`.
3. Before deploying, check the `ALLOWED_ORIGIN` constant at the top matches your live domain.
4. Deploy. Copy the resulting `*.workers.dev` URL.
5. Open `tools/security-headers.html`, find the line:
   ```js
   const WORKER_URL = "https://aisecmatrix-headers.YOURNAME.workers.dev";
   ```
   Replace it with your actual Worker URL, commit, redeploy the Pages site.

Both Workers (100K requests/day) and Pages (unlimited bandwidth, 500 builds/month) are free at this scale.

## Local testing before deploying

From this folder:
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000`. Note: the Security Headers tool won't work locally until `ALLOWED_ORIGIN` in the Worker is temporarily set to `http://localhost:8000` (or `*` while testing only).

## Content to add before launch (for SEO)

Each tool page has solid on-page SEO basics (title, meta description) but would benefit from:
- A short "why this matters" blog post linked from each tool (e.g. explain UPI fraud patterns next to the Scam Analyzer)
- Real backlinks — share tools individually, not just the homepage
- `sitemap.xml` and `robots.txt` once the domain is live (ask me to generate these once you confirm the final domain)
