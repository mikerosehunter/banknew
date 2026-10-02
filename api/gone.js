/**
 * 410 Gone Handler
 * Returns HTTP 410 for all old bank directory pages that no longer exist.
 * This tells Google to permanently remove them from the index.
 */
export default function handler(req, res) {
  const path = req.url || '/';
  const slug = path.split('/banks/')[1]?.split('?')[0] || 'this page';
  const bankName = slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
  res.setHeader('X-Robots-Tag', 'noindex');
  res.status(410).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Page No Longer Available | BankLoginOnline</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
    }
    .card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 1rem;
      max-width: 560px;
      width: 100%;
      padding: 3rem 2.5rem;
      text-align: center;
    }
    .icon { font-size: 3.5rem; margin-bottom: 1rem; }
    h1 { font-size: 1.75rem; font-weight: 700; color: #f1f5f9; margin-bottom: 0.75rem; }
    .badge {
      display: inline-block;
      background: #7f1d1d;
      color: #fca5a5;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      margin-bottom: 1.5rem;
    }
    p { color: #94a3b8; line-height: 1.7; margin-bottom: 1.5rem; }
    .divider { border: none; border-top: 1px solid #334155; margin: 1.5rem 0; }
    .links { display: flex; flex-direction: column; gap: 0.75rem; }
    a {
      display: block;
      padding: 0.75rem 1.25rem;
      border-radius: 0.5rem;
      font-weight: 500;
      text-decoration: none;
      transition: background 0.15s;
    }
    .btn-primary {
      background: #1d4ed8;
      color: #fff;
    }
    .btn-primary:hover { background: #2563eb; }
    .btn-secondary {
      background: #1e293b;
      border: 1px solid #334155;
      color: #94a3b8;
    }
    .btn-secondary:hover { background: #293548; color: #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🏦</div>
    <span class="badge">410 — Page Removed</span>
    <h1>This Page No Longer Exists</h1>
    <p>
      The individual bank directory page for <strong style="color:#e2e8f0">${bankName}</strong>
      was part of an older version of this site and has been permanently removed.
    </p>
    <p>
      We now focus exclusively on in-depth troubleshooting guides for the most common
      online banking errors at America's largest banks.
    </p>
    <hr class="divider" />
    <div class="links">
      <a href="/" class="btn-primary">🏠 Back to Home — Browse All Guides</a>
      <a href="/banks/chase" class="btn-secondary">Chase Bank Troubleshooting</a>
      <a href="/banks/bank-of-america" class="btn-secondary">Bank of America Troubleshooting</a>
      <a href="/banks/wells-fargo" class="btn-secondary">Wells Fargo Troubleshooting</a>
    </div>
  </div>
</body>
</html>`);
}
