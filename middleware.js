/**
 * Vercel Edge Middleware — runs before all routing on every request.
 * Returns HTTP 410 Gone for old /banks/<slug> pages from the previous
 * site version. Active bank hubs pass through normally.
 *
 * @see https://vercel.com/docs/functions/edge-middleware
 */

export const config = {
  // Only run on /banks/* paths
  matcher: '/banks/:slug*',
};

const ACTIVE_BANKS = new Set(['chase', 'bank-of-america', 'wells-fargo']);

const GONE_HTML = (bankName) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Page No Longer Available | BankLoginOnline</title>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0f172a;color:#e2e8f0;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:2rem}
    .card{background:#1e293b;border:1px solid #334155;border-radius:1rem;max-width:560px;width:100%;padding:3rem 2.5rem;text-align:center}
    .icon{font-size:3.5rem;margin-bottom:1rem}
    h1{font-size:1.75rem;font-weight:700;color:#f1f5f9;margin-bottom:.75rem}
    .badge{display:inline-block;background:#7f1d1d;color:#fca5a5;font-size:.75rem;font-weight:600;letter-spacing:.05em;padding:.25rem .75rem;border-radius:999px;margin-bottom:1.5rem}
    p{color:#94a3b8;line-height:1.7;margin-bottom:1.5rem}
    hr{border:none;border-top:1px solid #334155;margin:1.5rem 0}
    .links{display:flex;flex-direction:column;gap:.75rem}
    a{display:block;padding:.75rem 1.25rem;border-radius:.5rem;font-weight:500;text-decoration:none;transition:background .15s}
    .p{background:#1d4ed8;color:#fff}.p:hover{background:#2563eb}
    .s{background:#1e293b;border:1px solid #334155;color:#94a3b8}.s:hover{background:#293548;color:#e2e8f0}
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🏦</div>
    <span class="badge">410 — Page Permanently Removed</span>
    <h1>This Page No Longer Exists</h1>
    <p>The bank directory page for <strong style="color:#e2e8f0">${bankName}</strong> was part of an older version of this site and has been permanently removed.</p>
    <p>We now publish in-depth troubleshooting guides exclusively for America's largest banks — covering login errors, app crashes, Zelle issues, and more.</p>
    <hr />
    <div class="links">
      <a href="/" class="p">🏠 Browse All Troubleshooting Guides</a>
      <a href="/banks/chase" class="s">Chase Bank — 44 Fix Guides</a>
      <a href="/banks/bank-of-america" class="s">Bank of America — 44 Fix Guides</a>
      <a href="/banks/wells-fargo" class="s">Wells Fargo — 25 Fix Guides</a>
    </div>
  </div>
</body>
</html>`;

export default function middleware(request) {
  const url = new URL(request.url);
  const parts = url.pathname.split('/');
  // pathname is like /banks/ally-bank → parts = ['', 'banks', 'ally-bank']
  const slug = parts[2] || '';

  // Active banks: pass through to static pre-rendered HTML
  if (!slug || ACTIVE_BANKS.has(slug)) {
    return; // next()
  }

  // All other /banks/<slug> → 410 Gone
  const bankName = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return new Response(GONE_HTML(bankName), {
    status: 410,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
