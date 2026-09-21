import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

marked.use({
  renderer: {
    heading({ text, depth }) {
      const clean = String(text || '').replace(/[*_`#]/g, '').trim();
      const id = clean.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return `<h${depth} id="${id}" style="scroll-margin-top: 110px;">${clean}</h${depth}>\n`;
    }
  }
});

// Load environment variables from .env.local if present
const envPath = path.join(rootDir, '.env.local');
let supabaseUrl = process.env.SUPABASE_URL;
let supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (!supabaseUrl) supabaseUrl = envContent.match(/SUPABASE_URL=(.*)/)?.[1]?.trim();
  if (!supabaseKey) supabaseKey = envContent.match(/SUPABASE_SERVICE_KEY=(.*)/)?.[1]?.trim();
}

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY for prerendering.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function prerender() {
  console.log('🚀 Starting Pre-rendering for Hard Gate 8.0...');
  const distDir = path.join(rootDir, 'dist');
  const indexHtmlPath = path.join(distDir, 'index.html');

  if (!fs.existsSync(indexHtmlPath)) {
    console.error('dist/index.html not found! Run "vite build" first.');
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8');

  // 1. Fetch all published articles
  const { data: articles, error } = await supabase
    .from('bw_articles')
    .select('*')
    .eq('status', 'published');

  if (error) {
    console.error('Error fetching articles from Supabase:', error);
    process.exit(1);
  }

  console.log(`Found ${articles.length} published articles to prerender.`);

  for (const article of articles) {
    const cleanTitle = (article.title || '').replace(/\[\d+\]/g, '').trim();
    const metaDesc = (article.meta_description || article.excerpt || '').replace(/"/g, '&quot;');
    const publishedDate = article.published_at || article.created_at || new Date().toISOString();
    const updatedDate = article.updated_at || publishedDate;
    const bodyHtml = marked.parse(article.content || '');

    const words = (article.content || '').trim().split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(words / 225));

    const schema = {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": cleanTitle,
      "description": metaDesc,
      "datePublished": publishedDate,
      "dateModified": updatedDate,
      "mainEntityOfPage": `https://bankloginonline.com/article/${article.slug}`,
      "author": {
        "@type": "Person",
        "name": "David Sterling, CISA",
        "jobTitle": "Founder & Lead Financial Systems Analyst",
        "url": "https://bankloginonline.com/about"
      },
      "reviewedBy": {
        "@type": "Person",
        "name": "Elena Rostova, CISSP",
        "jobTitle": "Head of Mobile Security & Biometrics",
        "url": "https://bankloginonline.com/about"
      },
      "publisher": {
        "@type": "Organization",
        "name": "BankLoginOnline",
        "url": "https://bankloginonline.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://bankloginonline.com/logo.png"
        }
      }
    };

    // Construct Server HTML injection into #root
    const serverRenderedContent = `
      <div class="prerendered-content" style="max-width: 900px; margin: 0 auto; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; line-height: 1.6;">
        <nav aria-label="Breadcrumb" style="font-size: 14px; color: #64748b; margin-bottom: 24px;">
          <a href="/" style="color: #2563eb; text-decoration: none;">Home</a> &gt;
          <a href="/banks/${article.category || 'all'}" style="color: #2563eb; text-decoration: none;">${article.bank_name || 'Bank Help'}</a> &gt;
          <span>${cleanTitle}</span>
        </nav>
        <header style="margin-bottom: 32px; border-bottom: 1px solid #e2e8f0; padding-bottom: 24px;">
          <div style="display: flex; gap: 8px; margin-bottom: 12px; font-size: 12px; font-weight: 700;">
            <span style="background: #eff6ff; color: #1d4ed8; padding: 3px 10px; border-radius: 9999px;">Technical Fix Guide</span>
            <span style="background: #f0fdf4; color: #15803d; padding: 3px 10px; border-radius: 9999px;">Sourced &amp; Verified</span>
            <span style="background: #f1f5f9; color: #475569; padding: 3px 10px; border-radius: 9999px;">${readTime} Min Read</span>
          </div>
          <h1 style="font-size: 32px; font-weight: 800; line-height: 1.25; margin-bottom: 16px; color: #0f172a;">${cleanTitle}</h1>
          <div style="font-size: 14px; color: #64748b; display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
            <span>By <a href="/about" style="color: #2563eb; text-decoration: none; font-weight: 700;">David Sterling, CISA</a></span>
            <span>•</span>
            <span>Fact-Checked by <a href="/about" style="color: #16a34a; text-decoration: none; font-weight: 600;">Elena Rostova, CISSP</a></span>
            <span>•</span>
            <span>Published: ${new Date(publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span>•</span>
            <span>Last Verified: ${new Date(updatedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </header>
        <main class="article-body">
          ${bodyHtml}
        </main>
      </div>
    `;

    // Replace Head Meta
    let pageHtml = baseHtml
      .replace(/<title>.*?<\/title>/, `<title>${cleanTitle} | BankLoginOnline</title>`)
      .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${metaDesc}" />`)
      .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${cleanTitle} | BankLoginOnline" />`)
      .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${metaDesc}" />`)
      .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="https://bankloginonline.com/article/${article.slug}" />`);

    // Add canonical & schema before </head>
    const headInjection = `
    <link rel="canonical" href="https://bankloginonline.com/article/${article.slug}" />
    <script type="application/ld+json">
    ${JSON.stringify(schema)}
    </script>
  </head>`;
    pageHtml = pageHtml.replace('</head>', headInjection);

    // Inject prerendered content into <div id="root"></div>
    pageHtml = pageHtml.replace('<div id="root"></div>', `<div id="root">${serverRenderedContent}</div>`);

    // Target paths:
    // 1. /article/<slug>/index.html
    // 2. /guides/<slug>/index.html
    // 3. /<slug>/index.html
    const pathsToSave = [
      path.join(distDir, 'article', article.slug),
      path.join(distDir, 'guides', article.slug),
      path.join(distDir, article.slug)
    ];

    for (const p of pathsToSave) {
      fs.mkdirSync(p, { recursive: true });
      fs.writeFileSync(path.join(p, 'index.html'), pageHtml, 'utf8');
    }
  }

  // 2. Prerender static pages: /about, /editorial-policy, /contact, /privacy-policy, /disclaimer
  const staticPages = [
    {
      slug: 'about',
      title: 'About BankLoginOnline — Independent Banking Systems Research Desk',
      desc: 'Learn about BankLoginOnline, our mission, domain research, and editorial standards for independent financial troubleshooting.'
    },
    {
      slug: 'editorial-policy',
      title: 'Editorial Policy & Verification Standards — BankLoginOnline',
      desc: 'Our editorial standards, verification process, source hierarchy, and factual review guidelines.'
    },
    {
      slug: 'contact',
      title: 'Contact Us — BankLoginOnline',
      desc: 'Get in touch with the BankLoginOnline editorial desk, report an inaccuracy, or submit a technical inquiry.'
    },
    {
      slug: 'privacy-policy',
      title: 'Privacy Policy — BankLoginOnline',
      desc: 'BankLoginOnline privacy policy: how we handle consumer data and protect reader confidentiality.'
    },
    {
      slug: 'disclaimer',
      title: 'Banking & Legal Disclaimer — BankLoginOnline',
      desc: 'Independent educational technology portal disclaimer. BankLoginOnline is not affiliated with any financial institution.'
    }
  ];

  for (const page of staticPages) {
    let pageHtml = baseHtml
      .replace(/<title>.*?<\/title>/, `<title>${page.title}</title>`)
      .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${page.desc}" />`)
      .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${page.title}" />`)
      .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${page.desc}" />`)
      .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="https://bankloginonline.com/${page.slug}" />`);

    const headInjection = `
    <link rel="canonical" href="https://bankloginonline.com/${page.slug}" />
  </head>`;
    pageHtml = pageHtml.replace('</head>', headInjection);

    const p = path.join(distDir, page.slug);
    fs.mkdirSync(p, { recursive: true });
    fs.writeFileSync(path.join(p, 'index.html'), pageHtml, 'utf8');
  }

  console.log(`✅ Pre-rendering complete! Generated static raw HTML for ${articles.length} articles and ${staticPages.length} core pages.`);
}

prerender();
