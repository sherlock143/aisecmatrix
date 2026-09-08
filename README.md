# AISecMatrix — Security Tools & Services Site

Static site, no build step. All tools run client-side except Security Headers Scanner (needs the Cloudflare Worker in `worker/headers-worker.js`, already deployed separately at aisecmatrix-headers.vaasu-melipaka.workers.dev).

## Structure
- `index.html` — homepage
- `services.html` — professional security services page
- `contact.html` — contact form (Web3Forms — needs ACCESS_KEY set in the page script)
- `tools/*.html` — 9 free tools
- `blog/*.html` — guides
- `assets/` — shared CSS, JS, images, router database
- `worker/headers-worker.js` — paste into the Cloudflare Worker's own code editor and Deploy there; this repo file is a reference copy, not auto-deployed

## Deploy
Push to GitHub → Cloudflare Workers (Git-connected) auto-redeploys. `wrangler.jsonc` configures the custom 404 page and clean URL handling.

## Pending setup
- Add real Web3Forms access key in `contact.html`
- Enable Cloudflare Web Analytics
- Verify Google Search Console + submit sitemap.xml
