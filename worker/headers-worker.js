// AISecMatrix — Security Headers Worker
// Deploy this as a Cloudflare Worker (free tier: 100,000 requests/day).
// It fetches a target site's response headers server-side and returns them
// as JSON, with CORS enabled so aisecmatrix.com can call it from the browser.
//
// Deploy steps:
// 1. Cloudflare dashboard → Workers & Pages → Create → Worker
// 2. Paste this file's contents in, deploy
// 3. Copy the worker URL (e.g. https://aisecmatrix-headers.YOURNAME.workers.dev)
// 4. Paste that URL into WORKER_URL in /tools/security-headers.html

const ALLOWED_ORIGIN = "https://aisecmatrix.com"; // change if testing locally

const SECURITY_HEADERS = [
  { key: "strict-transport-security", name: "HSTS (Strict-Transport-Security)", why: "Forces browsers to always use HTTPS with this site." },
  { key: "content-security-policy", name: "Content-Security-Policy", why: "Restricts what scripts/resources can run, mitigates XSS." },
  { key: "x-frame-options", name: "X-Frame-Options", why: "Prevents the site being embedded in a hidden iframe (clickjacking)." },
  { key: "x-content-type-options", name: "X-Content-Type-Options", why: "Stops browsers from guessing file types, blocking some drive-by attacks." },
  { key: "referrer-policy", name: "Referrer-Policy", why: "Controls how much of the URL is leaked to other sites via the Referer header." },
  { key: "permissions-policy", name: "Permissions-Policy", why: "Restricts access to camera, mic, geolocation, etc. by default." },
];

export default {
  async fetch(request) {
    const origin = request.headers.get("Origin");
    const corsHeaders = {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const target = url.searchParams.get("url");

    if (!target) {
      return new Response(JSON.stringify({ error: "Missing ?url= parameter" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let targetUrl;
    try {
      targetUrl = new URL(target.startsWith("http") ? target : `https://${target}`);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid URL" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    try {
      const res = await fetch(targetUrl.toString(), {
        method: "GET",
        redirect: "follow",
        cf: { cacheTtl: 0 },
      });

      const results = SECURITY_HEADERS.map(h => ({
        name: h.name,
        why: h.why,
        present: res.headers.has(h.key),
        value: res.headers.get(h.key) || null,
      }));

      return new Response(JSON.stringify({
        target: targetUrl.hostname,
        status: res.status,
        headers: results,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Could not reach target site" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  },
};
