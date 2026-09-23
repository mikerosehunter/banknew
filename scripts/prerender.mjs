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

function extractFAQ(content) {
  if (!content) return [];
  const faqRegex = /###?\s*(?:FAQ|Frequently Asked Questions)[\s\S]*?(?=(?:^##\s|\Z))/im;
  const match = content.match(faqRegex);
  const faqs = [];
  if (match) {
    const faqBlock = match[0];
    const qRegex = /###?\s*(.+?\?)\s*\n+([\s\S]*?)(?=(?:###?\s*.+?\?|\Z))/g;
    let qMatch;
    while ((qMatch = qRegex.exec(faqBlock)) !== null) {
      const question = qMatch[1].trim();
      const answer = qMatch[2].trim().replace(/\n+/g, ' ').replace(/"/g, '&quot;');
      if (question && answer && !question.toLowerCase().includes('faq')) {
        faqs.push({ question, answer });
      }
    }
  }
  return faqs;
}

async function prerender() {
  console.log('🚀 Starting Pre-rendering & Technical SEO Generation...');
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
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles from Supabase:', error);
    process.exit(1);
  }

  // 2. Fetch categories and save categories.json for Edge CDN
  const { data: catData } = await supabase.from('bw_categories').select('*').order('label');
  const counts = {};
  for (const a of articles || []) {
    if (a.category) counts[a.category] = (counts[a.category] || 0) + 1;
  }
  const catsWithCounts = (catData || []).map(c => ({ ...c, count: counts[c.slug] || 0 }));
  const activeCategories = catsWithCounts.filter(c => c.count > 0);

  // Prepare static JSON data directories for CDN Edge Caching
  const publicDataDir = path.join(rootDir, 'public', 'data');
  const distDataDir = path.join(distDir, 'data');
  fs.mkdirSync(path.join(publicDataDir, 'articles'), { recursive: true });
  fs.mkdirSync(path.join(distDataDir, 'articles'), { recursive: true });

  const articlesSummary = articles.map(a => ({
    id: a.id,
    title: (a.title || '').replace(/\[\d+\]/g, '').trim(),
    slug: a.slug,
    excerpt: a.excerpt || a.meta_description,
    meta_description: a.meta_description || a.excerpt,
    category: a.category,
    bank_name: a.bank_name,
    status: a.status,
    created_at: a.created_at,
    published_at: a.published_at || a.created_at
  }));

  const listJson = JSON.stringify({ articles: articlesSummary, total: articlesSummary.length });
  fs.writeFileSync(path.join(distDataDir, 'articles.json'), listJson, 'utf8');
  fs.writeFileSync(path.join(publicDataDir, 'articles.json'), listJson, 'utf8');

  const catJson = JSON.stringify(catsWithCounts);
  fs.writeFileSync(path.join(distDataDir, 'categories.json'), catJson, 'utf8');
  fs.writeFileSync(path.join(publicDataDir, 'categories.json'), catJson, 'utf8');

  // ─────────────────────────────────────────────────────────────
  // 3. Pre-render Individual Guides (/guides/<slug>/index.html)
  // ─────────────────────────────────────────────────────────────
  console.log(`📄 Pre-rendering ${articles.length} Troubleshooting Guides...`);

  for (const article of articles) {
    const cleanTitle = (article.title || '').replace(/\[\d+\]/g, '').trim();
    const metaDesc = (article.meta_description || article.excerpt || '').replace(/"/g, '&quot;');
    const publishedDate = article.published_at || article.created_at || new Date().toISOString();
    const updatedDate = article.updated_at || publishedDate;
    const canonicalUrl = `https://bankloginonline.com/guides/${article.slug}`;
    const bodyHtml = marked.parse(article.content || '');

    // Save individual static JSON for ultra-fast CDN Edge delivery
    const articleJson = JSON.stringify(article);
    fs.writeFileSync(path.join(distDataDir, 'articles', `${article.slug}.json`), articleJson, 'utf8');
    fs.writeFileSync(path.join(publicDataDir, 'articles', `${article.slug}.json`), articleJson, 'utf8');

    const words = (article.content || '').trim().split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(words / 225));
    const faqs = extractFAQ(article.content);

    // TechArticle Schema
    const articleSchema = {
      "@type": "TechArticle",
      "@id": `${canonicalUrl}#article`,
      "headline": cleanTitle,
      "description": metaDesc,
      "image": "https://bankloginonline.com/og-image.png",
      "inLanguage": "en-US",
      "datePublished": publishedDate,
      "dateModified": updatedDate,
      "mainEntityOfPage": canonicalUrl,
      "isPartOf": {
        "@type": "WebSite",
        "@id": "https://bankloginonline.com/#website",
        "name": "BankLoginOnline",
        "url": "https://bankloginonline.com"
      },
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
        "@id": "https://bankloginonline.com/#organization",
        "name": "BankLoginOnline",
        "url": "https://bankloginonline.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://bankloginonline.com/logo.png",
          "width": 512,
          "height": 512
        }
      }
    };

    // BreadcrumbList Schema
    const breadcrumbSchema = {
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb`,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://bankloginonline.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": article.bank_name || (article.category ? article.category.replace(/-/g, ' ') : "Troubleshooting Guides"),
          "item": `https://bankloginonline.com/issues/${article.category || 'login-access-problems'}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": cleanTitle,
          "item": canonicalUrl
        }
      ]
    };

    const graph = [articleSchema, breadcrumbSchema];

    if (faqs.length > 0) {
      graph.push({
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        "mainEntity": faqs.map(f => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.answer
          }
        }))
      });
    }

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": graph
    };

    // Construct Server HTML injection into #root
    const serverRenderedContent = `
      <div class="public-site" style="min-height: 100vh; background-color: #ffffff; color: #0f172a;">
        <div class="prerendered-content" style="max-width: 900px; margin: 0 auto; padding: 32px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; line-height: 1.6;">
          <nav aria-label="Breadcrumb" style="font-size: 13px; color: #64748b; margin-bottom: 24px;">
            <a href="/" style="color: #2563eb; text-decoration: none;">Home</a> &gt;
            <a href="/issues/${article.category || 'login-access-problems'}" style="color: #2563eb; text-decoration: none;">${article.bank_name || 'Bank Help'}</a> &gt;
            <span>${cleanTitle}</span>
          </nav>
          <header style="margin-bottom: 32px; border-bottom: 1px solid #e2e8f0; padding-bottom: 24px;">
            <div style="display: flex; gap: 8px; margin-bottom: 12px; font-size: 12px; font-weight: 700; flex-wrap: wrap;">
              <span style="background: #eff6ff; color: #1d4ed8; padding: 3px 10px; border-radius: 9999px;">Technical Fix Guide</span>
              <span style="background: #f0fdf4; color: #15803d; padding: 3px 10px; border-radius: 9999px;">Sourced &amp; Verified</span>
              <span style="background: #f1f5f9; color: #475569; padding: 3px 10px; border-radius: 9999px;">${readTime} Min Read</span>
            </div>
            <h1 style="font-size: clamp(24px, 4vw, 36px); font-weight: 800; line-height: 1.25; margin-bottom: 16px; color: #0f172a; word-break: break-word;">${cleanTitle}</h1>
            <div style="font-size: 13px; color: #64748b; display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
              <span>By <a href="/about" style="color: #2563eb; text-decoration: none; font-weight: 700;">David Sterling, CISA</a></span>
              <span>•</span>
              <span>Fact-Checked by <a href="/about" style="color: #16a34a; text-decoration: none; font-weight: 600;">Elena Rostova, CISSP</a></span>
              <span>•</span>
              <span>Published: ${new Date(publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span>•</span>
              <span>Last Verified: ${new Date(updatedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </header>
          <main class="article-body" style="word-break: break-word;">
            ${bodyHtml}
          </main>
        </div>
      </div>
    `;

    // Replace Head Meta
    let pageHtml = baseHtml
      .replace(/<title>.*?<\/title>/, `<title>${cleanTitle} | BankLoginOnline</title>`)
      .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${metaDesc}" />`)
      .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${cleanTitle} | BankLoginOnline" />`)
      .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${metaDesc}" />`)
      .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${canonicalUrl}" />`)
      .replace(/<meta property="og:type" content=".*?" \/>/, `<meta property="og:type" content="article" />`)
      .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${cleanTitle} | BankLoginOnline" />`)
      .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${metaDesc}" />`)
      .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${canonicalUrl}" />`);

    // Add structured schema before </head>
    const headInjection = `
    <script type="application/ld+json">
    ${JSON.stringify(jsonLd)}
    </script>
  </head>`;
    pageHtml = pageHtml.replace('</head>', headInjection);

    // Inject prerendered content into <div id="root"></div>
    pageHtml = pageHtml.replace('<div id="root"></div>', `<div id="root">${serverRenderedContent}</div>`);

    // Inject __ARTICLE_DATA__ JSON script before </body> for zero-latency client hydration
    const articleDataScript = `\n    <script id="__ARTICLE_DATA__" type="application/json">${articleJson.replace(/</g, '\\u003c')}</script>\n  </body>`;
    pageHtml = pageHtml.replace('</body>', articleDataScript);

    // Save only to /guides/<slug>/index.html
    const guideDir = path.join(distDir, 'guides', article.slug);
    fs.mkdirSync(guideDir, { recursive: true });
    fs.writeFileSync(path.join(guideDir, 'index.html'), pageHtml, 'utf8');
  }

  // ─────────────────────────────────────────────────────────────
  // 4. Pre-render Core Static Pages (/about, /contact, etc.)
  // ─────────────────────────────────────────────────────────────
  const staticPages = [
    {
      slug: 'about',
      title: 'About BankLoginOnline — Independent Banking Systems Research Desk',
      desc: 'Learn about BankLoginOnline, our mission, banking security research, and editorial standards for independent financial troubleshooting.'
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
    const pageUrl = `https://bankloginonline.com/${page.slug}`;
    let pageHtml = baseHtml
      .replace(/<title>.*?<\/title>/, `<title>${page.title}</title>`)
      .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${page.desc}" />`)
      .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${page.title}" />`)
      .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${page.desc}" />`)
      .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${pageUrl}" />`)
      .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${pageUrl}" />`);

    const p = path.join(distDir, page.slug);
    fs.mkdirSync(p, { recursive: true });
    fs.writeFileSync(path.join(p, 'index.html'), pageHtml, 'utf8');
  }

  // ─────────────────────────────────────────────────────────────
  // 5. Pre-render Active Categories (/issues/<slug>)
  // ─────────────────────────────────────────────────────────────
  console.log(`📁 Pre-rendering ${activeCategories.length} Active Category Hubs...`);

  for (const cat of activeCategories) {
    const catUrl = `https://bankloginonline.com/issues/${cat.slug}`;
    const catTitle = `${cat.label} Troubleshooting Guides | BankLoginOnline`;
    const catDesc = cat.description || `Browse verified troubleshooting and fix guides for ${cat.label} across US financial institutions.`;
    const catArticles = articles.filter(a => a.category === cat.slug);

    const catServerHtml = `
      <div class="public-site" style="min-height: 100vh; background-color: #ffffff; color: #0f172a;">
        <div style="max-width: 900px; margin: 0 auto; padding: 32px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <nav aria-label="Breadcrumb" style="font-size: 13px; color: #64748b; margin-bottom: 24px;">
            <a href="/" style="color: #2563eb; text-decoration: none;">Home</a> &gt;
            <span>${cat.label}</span>
          </nav>
          <header style="margin-bottom: 32px; border-bottom: 1px solid #e2e8f0; padding-bottom: 24px;">
            <h1 style="font-size: 32px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">${cat.label}</h1>
            <p style="color: #64748b; font-size: 16px; margin: 0;">${catDesc}</p>
          </header>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${catArticles.map(a => `
              <div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; background: #fff;">
                <h2 style="font-size: 18px; margin: 0 0 8px 0;"><a href="/guides/${a.slug}" style="color: #2563eb; text-decoration: none;">${(a.title || '').replace(/\[\d+\]/g, '').trim()}</a></h2>
                <p style="color: #64748b; font-size: 14px; margin: 0 0 12px 0;">${a.excerpt || a.meta_description || ''}</p>
                <div style="font-size: 12px; color: #94a3b8;">${a.bank_name ? `<span>${a.bank_name}</span> • ` : ''}<span>${new Date(a.published_at || a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const catBreadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bankloginonline.com/" },
        { "@type": "ListItem", "position": 2, "name": cat.label, "item": catUrl }
      ]
    };

    let catPageHtml = baseHtml
      .replace(/<title>.*?<\/title>/, `<title>${catTitle}</title>`)
      .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${catDesc}" />`)
      .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${catTitle}" />`)
      .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${catDesc}" />`)
      .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${catUrl}" />`)
      .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${catUrl}" />`)
      .replace('</head>', `\n    <script type="application/ld+json">\n    ${JSON.stringify(catBreadcrumb)}\n    </script>\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root">${catServerHtml}</div>`);

    const issueDir = path.join(distDir, 'issues', cat.slug);
    fs.mkdirSync(issueDir, { recursive: true });
    fs.writeFileSync(path.join(issueDir, 'index.html'), catPageHtml, 'utf8');

    // Also support /banks/<slug> if category represents a bank
    const bankDir = path.join(distDir, 'banks', cat.slug);
    fs.mkdirSync(bankDir, { recursive: true });
    fs.writeFileSync(path.join(bankDir, 'index.html'), catPageHtml, 'utf8');
  }

  // ─────────────────────────────────────────────────────────────
  // 6. Pre-render the Homepage (dist/index.html)
  // ─────────────────────────────────────────────────────────────
  console.log('🏠 Pre-rendering Homepage (dist/index.html)...');

  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://bankloginonline.com/#website",
        "name": "BankLoginOnline",
        "url": "https://bankloginonline.com/",
        "description": "Independent troubleshooting guides for US bank login errors, mobile app crashes, and account access issues.",
        "inLanguage": "en-US",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://bankloginonline.com/?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://bankloginonline.com/#organization",
        "name": "BankLoginOnline",
        "url": "https://bankloginonline.com/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://bankloginonline.com/logo.png",
          "width": 512,
          "height": 512
        }
      }
    ]
  };

  const homeServerHtml = `
    <div class="public-site" style="min-height: 100vh; background-color: #ffffff; color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <section style="background: linear-gradient(135deg, #0b192c 0%, #1e3a8a 100%); color: white; padding: 60px 16px; text-align: center;">
        <div style="max-width: 800px; margin: 0 auto;">
          <h1 style="font-size: clamp(28px, 4vw, 44px); font-weight: 900; margin-bottom: 16px;">Fix Your Bank Login Problems</h1>
          <p style="font-size: 18px; color: #cbd5e1; max-width: 600px; margin: 0 auto 32px;">Independent step-by-step troubleshooting guides for US bank login errors, mobile app crashes, and account access issues.</p>
        </div>
      </section>

      <section style="max-width: 1100px; margin: 40px auto; padding: 0 16px;">
        <h2 style="font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 24px;">Recently Updated Bank Troubleshooting Guides</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;">
          ${articles.slice(0, 36).map(a => `
            <article style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; background: #fff; display: flex; flex-direction: column;">
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #2563eb; margin-bottom: 6px;">${a.bank_name || 'Troubleshooting'}</div>
              <h3 style="font-size: 17px; font-weight: 700; margin: 0 0 8px 0; line-height: 1.35;">
                <a href="/guides/${a.slug}" style="color: #0f172a; text-decoration: none;">${(a.title || '').replace(/\[\d+\]/g, '').trim()}</a>
              </h3>
              <p style="color: #64748b; font-size: 14px; margin: 0 0 16px 0; line-height: 1.5; flex: 1;">${a.excerpt || a.meta_description || ''}</p>
              <div style="font-size: 12px; color: #94a3b8; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                <span>${new Date(a.published_at || a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <a href="/guides/${a.slug}" style="color: #2563eb; font-weight: 600; text-decoration: none;">Read fix &rarr;</a>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    </div>
  `;

  let homeHtml = baseHtml
    .replace('<div id="root"></div>', `<div id="root">${homeServerHtml}</div>`)
    .replace('</head>', `\n    <script type="application/ld+json">\n    ${JSON.stringify(homeSchema)}\n    </script>\n  </head>`);

  fs.writeFileSync(indexHtmlPath, homeHtml, 'utf8');

  // ─────────────────────────────────────────────────────────────
  // 7. Generate Static Sitemap (dist/sitemap.xml & public/sitemap.xml)
  // ─────────────────────────────────────────────────────────────
  console.log('🗺️ Generating static sitemap.xml...');

  const today = new Date().toISOString().split('T')[0];
  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemapXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Homepage
  sitemapXml += `  <url>\n    <loc>https://bankloginonline.com/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

  // Core Static Pages
  sitemapXml += `  <url>\n    <loc>https://bankloginonline.com/about</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  sitemapXml += `  <url>\n    <loc>https://bankloginonline.com/editorial-policy</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  sitemapXml += `  <url>\n    <loc>https://bankloginonline.com/contact</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
  sitemapXml += `  <url>\n    <loc>https://bankloginonline.com/privacy-policy</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>\n`;
  sitemapXml += `  <url>\n    <loc>https://bankloginonline.com/disclaimer</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>\n`;

  // Active Categories Only (count > 0, NO empty soft 404 pages)
  for (const cat of activeCategories) {
    sitemapXml += `  <url>\n    <loc>https://bankloginonline.com/issues/${cat.slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  }

  // All Published Guides
  for (const a of articles) {
    const lastMod = (a.updated_at || a.published_at || a.created_at || today).split('T')[0];
    sitemapXml += `  <url>\n    <loc>https://bankloginonline.com/guides/${a.slug}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  }

  sitemapXml += `</urlset>`;

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');
  fs.writeFileSync(path.join(rootDir, 'public', 'sitemap.xml'), sitemapXml, 'utf8');

  console.log(`✅ Pre-rendering complete!`);
  console.log(`   - ${articles.length} guides pre-rendered with @graph JSON-LD and /guides/ canonicals`);
  console.log(`   - Homepage pre-rendered with WebSite & Organization schemas`);
  console.log(`   - ${activeCategories.length} active category hubs pre-rendered`);
  console.log(`   - Static sitemap.xml generated with ${1 + staticPages.length + activeCategories.length + articles.length} clean URLs.`);
}

prerender();
