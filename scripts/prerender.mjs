import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { marked } from 'marked';
import { getSameBankRelated } from '../src/lib/relatedGuides.js';
import { injectInBodyInterlinks } from '../src/lib/inBodyInterlinker.js';

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

// ─────────────────────────────────────────────────────────────
// Reusable Global Header HTML for Perfect Crawler Interlinking
// ─────────────────────────────────────────────────────────────
function getGlobalHeaderHtml(activePath = '') {
  return `
    <header class="pub-header" style="background: #ffffff; border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 100;">
      <div style="max-width: 1200px; margin: 0 auto; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
        <a href="/" style="display: flex; align-items: center; gap: 10px; text-decoration: none; color: #0f172a; font-weight: 800; font-size: 19px;">
          <span style="font-size: 22px;">🏦</span>
          <span>Bank<span style="color: #2563eb;">Login</span>Online</span>
        </a>
        <nav style="display: flex; align-items: center; gap: 20px; font-size: 14px; font-weight: 600; flex-wrap: wrap;">
          <a href="/" style="color: ${activePath === '/' ? '#2563eb' : '#475569'}; text-decoration: none;">Home</a>
          <a href="/banks/chase" style="color: ${activePath.includes('chase') ? '#2563eb' : '#475569'}; text-decoration: none;">Chase Guides</a>
          <a href="/banks/bank-of-america" style="color: ${activePath.includes('bank-of-america') ? '#2563eb' : '#475569'}; text-decoration: none;">Bank of America Guides</a>
          <a href="/banks/wells-fargo" style="color: ${activePath.includes('wells-fargo') ? '#2563eb' : '#475569'}; text-decoration: none;">Wells Fargo Guides</a>
          <a href="/#categories" style="color: #475569; text-decoration: none;">Categories</a>
          <a href="/about" style="color: ${activePath === '/about' ? '#2563eb' : '#475569'}; text-decoration: none;">About</a>
          <a href="/editorial-policy" style="color: ${activePath === '/editorial-policy' ? '#2563eb' : '#475569'}; text-decoration: none;">Editorial Policy</a>
          <a href="/contact" style="color: ${activePath === '/contact' ? '#2563eb' : '#475569'}; text-decoration: none;">Contact</a>
        </nav>
      </div>
    </header>
  `;
}

// ─────────────────────────────────────────────────────────────
// Reusable Global Footer HTML with Deep Crawlable Links
// ─────────────────────────────────────────────────────────────
function getGlobalFooterHtml() {
  return `
    <footer class="pub-footer" style="background: #0b1329; color: #cbd5e1; padding: 56px 20px 32px; margin-top: auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 36px; margin-bottom: 40px;">
        <div>
          <div style="font-size: 20px; font-weight: 800; color: #ffffff; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            <span>🏦</span> Bank<span style="color: #38bdf8;">Login</span>Online
          </div>
          <p style="font-size: 13.5px; line-height: 1.6; color: #94a3b8; margin-bottom: 16px;">
            Independent step-by-step troubleshooting guides for US bank login errors, mobile app crashes, and account access issues.
          </p>
          <div style="display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #34d399; background: rgba(52, 211, 153, 0.1); padding: 4px 10px; border-radius: 6px; border: 1px solid rgba(52, 211, 153, 0.2);">
            <span>✓ Verified Independent Intelligence</span>
          </div>
        </div>

        <div>
          <div style="font-size: 14px; font-weight: 700; text-transform: uppercase; color: #ffffff; letter-spacing: 0.05em; margin-bottom: 14px;">Major Bank Portals</div>
          <ul style="list-style: none; padding: 0; margin: 0; font-size: 13.5px; display: flex; flex-direction: column; gap: 10px;">
            <li><a href="/banks/chase" style="color: #94a3b8; text-decoration: none;">Chase Bank Troubleshooting</a></li>
            <li><a href="/banks/bank-of-america" style="color: #94a3b8; text-decoration: none;">Bank of America Troubleshooting</a></li>
            <li><a href="/banks/wells-fargo" style="color: #94a3b8; text-decoration: none;">Wells Fargo Troubleshooting</a></li>
            <li><a href="/banks/capital-one" style="color: #94a3b8; text-decoration: none;">Capital One Troubleshooting</a></li>
          </ul>
        </div>

        <div>
          <div style="font-size: 14px; font-weight: 700; text-transform: uppercase; color: #ffffff; letter-spacing: 0.05em; margin-bottom: 14px;">Common Error Categories</div>
          <ul style="list-style: none; padding: 0; margin: 0; font-size: 13.5px; display: flex; flex-direction: column; gap: 10px;">
            <li><a href="/issues/account-issues" style="color: #94a3b8; text-decoration: none;">Account Issues &amp; Lockouts</a></li>
            <li><a href="/issues/login-access-problems" style="color: #94a3b8; text-decoration: none;">Login &amp; Password Problems</a></li>
            <li><a href="/issues/mobile-app-problems" style="color: #94a3b8; text-decoration: none;">Mobile App Crashes &amp; Bugs</a></li>
            <li><a href="/issues/payments-transactions" style="color: #94a3b8; text-decoration: none;">Payments, Zelle &amp; Transfers</a></li>
            <li><a href="/issues/card-atm-problems" style="color: #94a3b8; text-decoration: none;">Cards, Digital Wallets &amp; ATMs</a></li>
            <li><a href="/issues/security-verification-issues" style="color: #94a3b8; text-decoration: none;">2FA &amp; Security Verification</a></li>
          </ul>
        </div>

        <div>
          <div style="font-size: 14px; font-weight: 700; text-transform: uppercase; color: #ffffff; letter-spacing: 0.05em; margin-bottom: 14px;">Editorial &amp; Trust</div>
          <ul style="list-style: none; padding: 0; margin: 0; font-size: 13.5px; display: flex; flex-direction: column; gap: 10px;">
            <li><a href="/about" style="color: #94a3b8; text-decoration: none;">About Research Team</a></li>
            <li><a href="/editorial-policy" style="color: #94a3b8; text-decoration: none;">Editorial Policy &amp; Standards</a></li>
            <li><a href="/contact" style="color: #94a3b8; text-decoration: none;">Contact Editorial Desk</a></li>
            <li><a href="/privacy-policy" style="color: #94a3b8; text-decoration: none;">Privacy Policy</a></li>
            <li><a href="/disclaimer" style="color: #94a3b8; text-decoration: none;">Banking &amp; Legal Disclaimer</a></li>
          </ul>
        </div>
      </div>

      <div style="max-width: 1200px; margin: 0 auto; border-top: 1px solid #1e293b; padding-top: 24px; font-size: 12px; color: #64748b; line-height: 1.6; display: flex; flex-direction: column; gap: 8px;">
        <div>&copy; 2026 BankLoginOnline.com — Independent Banking Troubleshooting Guides. All rights reserved.</div>
        <div>BankLoginOnline is an independent educational and technical troubleshooting resource. We are NOT affiliated with, sponsored by, or endorsed by JPMorgan Chase, Bank of America, or any financial institution. Never enter banking credentials or SSNs on third-party sites.</div>
      </div>
    </footer>
  `;
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

  // Category lookup map for proper labels
  const catLabelMap = {
    'account-issues': 'Account Issues',
    'card-atm-problems': 'Card & ATM Problems',
    'login-access-problems': 'Login & Access Problems',
    'mobile-app-problems': 'Mobile App Problems',
    'payments-transactions': 'Payments & Transactions',
    'security-verification-issues': 'Security & Verification Issues'
  };
  activeCategories.forEach(c => { catLabelMap[c.slug] = c.label; });

  // Bank definitions with their articles
  const bankHubs = [
    {
      slug: 'chase',
      aliases: ['jpmorgan-chase-bank', 'chase-bank'],
      name: 'Chase Bank',
      title: 'Chase Bank Troubleshooting Guides & Error Code Solutions | BankLoginOnline',
      desc: 'Complete index of 44 verified Chase Bank troubleshooting guides, mobile app error code fixes, and account access solutions.',
      filter: a => (a.bank_name || '').toLowerCase().includes('chase'),
    },
    {
      slug: 'bank-of-america',
      aliases: ['bofa'],
      name: 'Bank of America',
      title: 'Bank of America Troubleshooting Guides & Fixes | BankLoginOnline',
      desc: 'Complete index of 44 verified Bank of America troubleshooting guides, mobile app error code fixes, and login access solutions.',
      filter: a => (a.bank_name || '').toLowerCase().includes('america'),
    },
    {
      slug: 'wells-fargo',
      aliases: ['wells-fargo-bank', 'wellsfargo'],
      name: 'Wells Fargo',
      title: 'Wells Fargo Troubleshooting Guides & Error Code Solutions | BankLoginOnline',
      desc: 'Complete index of 27 verified Wells Fargo troubleshooting guides, mobile app error code fixes, and account access solutions.',
      filter: a => (a.bank_name || '').toLowerCase().includes('fargo') || (a.bank_name || '').toLowerCase().includes('wells'),
    },
    {
      slug: 'capital-one',
      aliases: ['capital-one-bank', 'capitalone'],
      name: 'Capital One',
      title: 'Capital One Troubleshooting Guides & Error Code Solutions | BankLoginOnline',
      desc: 'Complete index of 20 verified Capital One troubleshooting guides, 360 checking account fixes, mobile app error solutions, and debit card issues.',
      filter: a => (a.bank_name || '').toLowerCase().includes('capital'),
    }
  ];

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

    let bankSlug = 'wells-fargo';
    let bankLabel = 'Wells Fargo';
    const bName = (article.bank_name || '').toLowerCase();
    if (bName.includes('chase')) {
      bankSlug = 'chase';
      bankLabel = 'Chase Bank';
    } else if (bName.includes('america')) {
      bankSlug = 'bank-of-america';
      bankLabel = 'Bank of America';
    } else if (bName.includes('capital')) {
      bankSlug = 'capital-one';
      bankLabel = 'Capital One';
    }
    const catSlug = article.category || 'login-access-problems';
    const catLabel = catLabelMap[catSlug] || 'Troubleshooting Guides';

    // Inject smart same-bank in-body interlinks into article markdown
    const enhancedContent = injectInBodyInterlinks(article.content || '', article, articles);
    const bodyHtml = marked.parse(enhancedContent);
    const enrichedArticle = { ...article, content: enhancedContent };

    // Save individual static JSON for ultra-fast CDN Edge delivery
    const articleJson = JSON.stringify(enrichedArticle);
    fs.writeFileSync(path.join(distDataDir, 'articles', `${article.slug}.json`), articleJson, 'utf8');
    fs.writeFileSync(path.join(publicDataDir, 'articles', `${article.slug}.json`), articleJson, 'utf8');

    const words = (enhancedContent || '').trim().split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(words / 225));
    const faqs = extractFAQ(enhancedContent);

    // TechArticle & Article Schema
    const articleSchema = {
      "@type": ["Article", "TechArticle"],
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

    // BreadcrumbList Schema with 100% Matching Labels & URLs
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
          "name": bankLabel,
          "item": `https://bankloginonline.com/banks/${bankSlug}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": catLabel,
          "item": `https://bankloginonline.com/issues/${catSlug}`
        },
        {
          "@type": "ListItem",
          "position": 4,
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

    // Generate Same-Bank Internal Links for Crawlers & Fast SSR
    const sameBankGuides = getSameBankRelated(article, articles, 4);
    let sameBankSectionHtml = '';
    if (sameBankGuides.length > 0) {
      const cardsHtml = sameBankGuides.map(rel => {
        const cleanRelTitle = (rel.title || '').replace(/\[\d+\]/g, '').trim();
        const relDesc = (rel.meta_description || rel.excerpt || '').replace(/"/g, '&quot;');
        return `
              <a href="/guides/${rel.slug}" class="same-bank-card" style="display: block; padding: 18px 20px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; text-decoration: none; color: inherit;">
                <span class="same-bank-card-badge" style="display: inline-block; font-size: 11px; font-weight: 700; color: #16a34a; background: #f0fdf4; padding: 2px 8px; border-radius: 4px; margin-bottom: 8px;">Verified Fix</span>
                <h4 class="same-bank-card-title" style="margin: 0 0 8px 0; font-size: 15px; font-weight: 700; color: #0f172a; line-height: 1.4;">${cleanRelTitle}</h4>
                <p class="same-bank-card-desc" style="margin: 0 0 12px 0; font-size: 13px; color: #64748b; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${relDesc}</p>
                <div class="same-bank-card-footer" style="font-size: 13px; font-weight: 600; color: #2563eb;">
                  Read step-by-step fix &rarr;
                </div>
              </a>`;
      }).join('\n');

      sameBankSectionHtml = `
            <section class="same-bank-related-section" style="margin-top: 48px; padding-top: 36px; border-top: 2px solid #f1f5f9;">
              <div class="same-bank-header" style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px; flex-wrap: wrap; gap: 8px;">
                <h3 class="same-bank-title" style="margin: 0; font-size: 20px; font-weight: 800; color: #0f172a;">
                  <span>🏦</span> More ${bankLabel} Troubleshooting Guides
                </h3>
                <a href="/banks/${bankSlug}" class="same-bank-view-all" style="font-size: 13px; color: #2563eb; font-weight: 600; text-decoration: none;">
                  View all 44 ${bankLabel} guides &rarr;
                </a>
              </div>
              <div class="same-bank-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
                ${cardsHtml}
              </div>
            </section>`;
    }

    // Construct Server HTML injection into #root with Full Header & Footer
    const serverRenderedContent = `
      <div class="public-site" style="min-height: 100vh; display: flex; flex-direction: column; background-color: #ffffff; color: #0f172a;">
        ${getGlobalHeaderHtml(`/guides/${article.slug}`)}
        <div class="prerendered-content" style="max-width: 900px; margin: 0 auto; padding: 32px 16px 64px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; line-height: 1.6; flex: 1; width: 100%;">
          <nav aria-label="Breadcrumb" style="font-size: 13px; color: #64748b; margin-bottom: 24px;">
            <a href="/" style="color: #2563eb; text-decoration: none;">Home</a> &gt;
            <a href="/banks/${bankSlug}" style="color: #2563eb; text-decoration: none;">${bankLabel}</a> &gt;
            <a href="/issues/${catSlug}" style="color: #2563eb; text-decoration: none;">${catLabel}</a> &gt;
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
            ${sameBankSectionHtml}
          </main>
        </div>
        ${getGlobalFooterHtml()}
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
  // 4. Pre-render Dedicated Bank Hubs (/banks/chase, /banks/bank-of-america)
  // ─────────────────────────────────────────────────────────────
  console.log(`🏦 Pre-rendering Dedicated Bank Hubs (${bankHubs.length} banks)...`);

  for (const b of bankHubs) {
    const bankArticles = articles.filter(b.filter);
    const bankUrl = `https://bankloginonline.com/banks/${b.slug}`;

    const bankServerHtml = `
      <div class="public-site" style="min-height: 100vh; display: flex; flex-direction: column; background-color: #ffffff; color: #0f172a;">
        ${getGlobalHeaderHtml(`/banks/${b.slug}`)}
        <div style="max-width: 1000px; margin: 0 auto; padding: 40px 16px 64px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; flex: 1; width: 100%;">
          <nav aria-label="Breadcrumb" style="font-size: 13px; color: #64748b; margin-bottom: 24px;">
            <a href="/" style="color: #2563eb; text-decoration: none;">Home</a> &gt;
            <span>${b.name} Guides</span>
          </nav>
          <header style="margin-bottom: 36px; border-bottom: 1px solid #e2e8f0; padding-bottom: 24px;">
            <div style="display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: #2563eb; background: #eff6ff; padding: 4px 12px; border-radius: 9999px; margin-bottom: 12px;">
              <span>🏦</span> ${bankArticles.length} Verified Solutions
            </div>
            <h1 style="font-size: clamp(28px, 4vw, 40px); font-weight: 800; color: #0f172a; margin-bottom: 12px;">${b.name} Troubleshooting Directory</h1>
            <p style="color: #64748b; font-size: 16px; margin: 0; max-width: 760px; line-height: 1.6;">${b.desc}</p>
          </header>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
            ${bankArticles.map(a => `
              <article style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; background: #fff; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #2563eb; margin-bottom: 6px;">
                    ${catLabelMap[a.category] || a.bank_name}
                  </div>
                  <h2 style="font-size: 16.5px; font-weight: 700; margin: 0 0 8px 0; line-height: 1.4;">
                    <a href="/guides/${a.slug}" style="color: #0f172a; text-decoration: none;">${(a.title || '').replace(/\[\d+\]/g, '').trim()}</a>
                  </h2>
                  <p style="color: #64748b; font-size: 13.5px; margin: 0 0 16px 0; line-height: 1.5;">${a.excerpt || a.meta_description || ''}</p>
                </div>
                <div style="font-size: 12px; color: #94a3b8; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                  <span>${new Date(a.published_at || a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <a href="/guides/${a.slug}" style="color: #2563eb; font-weight: 600; text-decoration: none;">Read fix &rarr;</a>
                </div>
              </article>
            `).join('')}
          </div>
        </div>
        ${getGlobalFooterHtml()}
      </div>
    `;

    const bankBreadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bankloginonline.com/" },
        { "@type": "ListItem", "position": 2, "name": b.name, "item": bankUrl }
      ]
    };

    const bankSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": `${bankUrl}#page`,
          "name": b.title,
          "description": b.desc,
          "url": bankUrl,
          "isPartOf": {
            "@type": "WebSite",
            "@id": "https://bankloginonline.com/#website",
            "name": "BankLoginOnline",
            "url": "https://bankloginonline.com"
          }
        },
        bankBreadcrumb
      ]
    };

    let bankPageHtml = baseHtml
      .replace(/<title>.*?<\/title>/, `<title>${b.title}</title>`)
      .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${b.desc}" />`)
      .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${b.title}" />`)
      .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${b.desc}" />`)
      .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${bankUrl}" />`)
      .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${bankUrl}" />`)
      .replace('</head>', `\n    <script type="application/ld+json">\n    ${JSON.stringify(bankSchema)}\n    </script>\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root">${bankServerHtml}</div>`);

    const primaryDir = path.join(distDir, 'banks', b.slug);
    fs.mkdirSync(primaryDir, { recursive: true });
    fs.writeFileSync(path.join(primaryDir, 'index.html'), bankPageHtml, 'utf8');

    // Also write alias directories for seamless redirects
    for (const alias of b.aliases || []) {
      const aliasDir = path.join(distDir, 'banks', alias);
      fs.mkdirSync(aliasDir, { recursive: true });
      fs.writeFileSync(path.join(aliasDir, 'index.html'), bankPageHtml, 'utf8');
    }
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
      <div class="public-site" style="min-height: 100vh; display: flex; flex-direction: column; background-color: #ffffff; color: #0f172a;">
        ${getGlobalHeaderHtml(`/issues/${cat.slug}`)}
        <div style="max-width: 1000px; margin: 0 auto; padding: 40px 16px 64px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; flex: 1; width: 100%;">
          <nav aria-label="Breadcrumb" style="font-size: 13px; color: #64748b; margin-bottom: 24px;">
            <a href="/" style="color: #2563eb; text-decoration: none;">Home</a> &gt;
            <span>${cat.label}</span>
          </nav>
          <header style="margin-bottom: 36px; border-bottom: 1px solid #e2e8f0; padding-bottom: 24px;">
            <div style="display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: #2563eb; background: #eff6ff; padding: 4px 12px; border-radius: 9999px; margin-bottom: 12px;">
              <span>📂</span> ${catArticles.length} Guides in this Category
            </div>
            <h1 style="font-size: clamp(28px, 4vw, 36px); font-weight: 800; color: #0f172a; margin-bottom: 8px;">${cat.label}</h1>
            <p style="color: #64748b; font-size: 16px; margin: 0; line-height: 1.6; max-width: 760px;">${catDesc}</p>
          </header>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
            ${catArticles.map(a => `
              <article style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; background: #fff; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #2563eb; margin-bottom: 6px;">
                    ${a.bank_name || 'Bank Guide'}
                  </div>
                  <h2 style="font-size: 16.5px; font-weight: 700; margin: 0 0 8px 0; line-height: 1.4;">
                    <a href="/guides/${a.slug}" style="color: #0f172a; text-decoration: none;">${(a.title || '').replace(/\[\d+\]/g, '').trim()}</a>
                  </h2>
                  <p style="color: #64748b; font-size: 13.5px; margin: 0 0 16px 0; line-height: 1.5;">${a.excerpt || a.meta_description || ''}</p>
                </div>
                <div style="font-size: 12px; color: #94a3b8; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                  <span>${new Date(a.published_at || a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <a href="/guides/${a.slug}" style="color: #2563eb; font-weight: 600; text-decoration: none;">Read fix &rarr;</a>
                </div>
              </article>
            `).join('')}
          </div>
        </div>
        ${getGlobalFooterHtml()}
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
  }

  // ─────────────────────────────────────────────────────────────
  // 6. Pre-render Core Static Trust Pages (/about, /contact, etc.)
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
    const pageServerHtml = `
      <div class="public-site" style="min-height: 100vh; display: flex; flex-direction: column; background-color: #ffffff; color: #0f172a;">
        ${getGlobalHeaderHtml(`/${page.slug}`)}
        <div style="max-width: 800px; margin: 0 auto; padding: 48px 16px 64px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.7; flex: 1; width: 100%;">
          <h1 style="font-size: clamp(26px, 4vw, 36px); font-weight: 800; color: #0f172a; margin-bottom: 20px;">${page.title}</h1>
          <p style="font-size: 16px; color: #475569; margin-bottom: 24px;">${page.desc}</p>
          <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; color: #334155;">
            <p>Welcome to BankLoginOnline's official disclosure and transparency center. For verified troubleshooting guides, browse our bank directories:</p>
            <div style="display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap;">
              <a href="/banks/chase" style="display: inline-block; padding: 10px 18px; background: #eff6ff; color: #2563eb; border-radius: 8px; font-weight: 600; text-decoration: none;">Browse Chase Guides &rarr;</a>
              <a href="/banks/bank-of-america" style="display: inline-block; padding: 10px 18px; background: #eff6ff; color: #2563eb; border-radius: 8px; font-weight: 600; text-decoration: none;">Browse Bank of America Guides &rarr;</a>
            </div>
          </div>
        </div>
        ${getGlobalFooterHtml()}
      </div>
    `;

    let pageHtml = baseHtml
      .replace(/<title>.*?<\/title>/, `<title>${page.title}</title>`)
      .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${page.desc}" />`)
      .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${page.title}" />`)
      .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${page.desc}" />`)
      .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${pageUrl}" />`)
      .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${pageUrl}" />`)
      .replace('<div id="root"></div>', `<div id="root">${pageServerHtml}</div>`);

    const p = path.join(distDir, page.slug);
    fs.mkdirSync(p, { recursive: true });
    fs.writeFileSync(path.join(p, 'index.html'), pageHtml, 'utf8');
  }

  // ─────────────────────────────────────────────────────────────
  // 7. Pre-render the Complete Homepage with ALL 88 Guides Linked
  // ─────────────────────────────────────────────────────────────
  console.log('🏠 Pre-rendering Homepage (dist/index.html) with 100% crawl paths...');

  const chaseArticles = articles.filter(a => (a.bank_name || '').toLowerCase().includes('chase'));
  const bofaArticles = articles.filter(a => (a.bank_name || '').toLowerCase().includes('america'));
  const wfArticles = articles.filter(a => (a.bank_name || '').toLowerCase().includes('fargo') || (a.bank_name || '').toLowerCase().includes('wells'));
  const capOneArticles = articles.filter(a => (a.bank_name || '').toLowerCase().includes('capital'));

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
    <div class="public-site" style="min-height: 100vh; display: flex; flex-direction: column; background-color: #ffffff; color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      ${getGlobalHeaderHtml('/')}

      <!-- Hero Section -->
      <section style="background: linear-gradient(135deg, #0b192c 0%, #1e3a8a 100%); color: white; padding: 64px 20px; text-align: center;">
        <div style="max-width: 820px; margin: 0 auto;">
          <div style="display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: #38bdf8; background: rgba(56, 189, 248, 0.15); padding: 5px 14px; border-radius: 9999px; margin-bottom: 16px; border: 1px solid rgba(56, 189, 248, 0.3);">
            <span>🛡️</span> Independent Financial Systems Research Desk
          </div>
          <h1 style="font-size: clamp(28px, 4.5vw, 48px); font-weight: 900; margin-bottom: 18px; line-height: 1.2;">Fix Your Bank Login &amp; App Problems</h1>
          <p style="font-size: 18px; color: #cbd5e1; max-width: 640px; margin: 0 auto 28px; line-height: 1.5;">Step-by-step diagnostic fixes for US banking login errors, 2FA failures, mobile app crashes, and transaction holds.</p>
        </div>
      </section>

      <!-- Bank Hubs Directory Section -->
      <section id="all-banks" style="max-width: 1200px; margin: 48px auto 0; padding: 0 20px; width: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2 style="font-size: 24px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0;">Major US Bank Troubleshooting Portals</h2>
            <p style="color: #64748b; font-size: 14px; margin: 0;">Select your bank to browse all verified troubleshooting guides.</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
          <div style="border: 2px solid #2563eb; border-radius: 16px; padding: 28px; background: #ffffff; box-shadow: 0 4px 20px rgba(37, 99, 235, 0.08); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                <span style="font-size: 28px;">🏛️</span>
                <span style="background: #eff6ff; color: #1d4ed8; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 9999px;">${chaseArticles.length} Guides Published</span>
              </div>
              <h3 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0;">Chase Bank</h3>
              <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0 0 16px 0;">
                Comprehensive guides for Chase Error 99, app crashes, external account linking error 53004, Zelle recipient locks, and debit chip issues.
              </p>
            </div>
            <a href="/banks/chase" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #2563eb; color: #ffffff; padding: 12px 20px; border-radius: 10px; font-weight: 700; text-decoration: none; font-size: 14px;">
              View all ${chaseArticles.length} Chase Guides &rarr;
            </a>
          </div>

          <div style="border: 2px solid #dc2626; border-radius: 16px; padding: 28px; background: #ffffff; box-shadow: 0 4px 20px rgba(220, 38, 38, 0.08); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                <span style="font-size: 28px;">🏢</span>
                <span style="background: #fef2f2; color: #b91c1c; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 9999px;">${bofaArticles.length} Guides Published</span>
              </div>
              <h3 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0;">Bank of America</h3>
              <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0 0 16px 0;">
                Step-by-step solutions for BofA Error 900, password reset loops, QuickBooks error 350, mobile deposit camera freezes, and SafePass OTP delays.
              </p>
            </div>
            <a href="/banks/bank-of-america" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #dc2626; color: #ffffff; padding: 12px 20px; border-radius: 10px; font-weight: 700; text-decoration: none; font-size: 14px;">
              View all ${bofaArticles.length} Bank of America Guides &rarr;
            </a>
          </div>

          <div style="border: 2px solid #d97706; border-radius: 16px; padding: 28px; background: #ffffff; box-shadow: 0 4px 20px rgba(217, 119, 6, 0.08); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                <span style="font-size: 28px;">🐎</span>
                <span style="background: #fffbeb; color: #b45309; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 9999px;">${wfArticles.length} Guides Published</span>
              </div>
              <h3 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0;">Wells Fargo</h3>
              <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0 0 16px 0;">
                Step-by-step solutions for Wells Fargo Error 001, Advanced Access 2FA codes, account lockouts, Zelle holds, and Card Control failures.
              </p>
            </div>
            <a href="/banks/wells-fargo" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #d97706; color: #ffffff; padding: 12px 20px; border-radius: 10px; font-weight: 700; text-decoration: none; font-size: 14px;">
              View all ${wfArticles.length} Wells Fargo Guides &rarr;
            </a>
          </div>

          <div style="border: 2px solid #0284c7; border-radius: 16px; padding: 28px; background: #ffffff; box-shadow: 0 4px 20px rgba(2, 132, 199, 0.08); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                <span style="font-size: 28px;">💳</span>
                <span style="background: #f0f9ff; color: #0284c7; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 9999px;">${capOneArticles.length} Guides Published</span>
              </div>
              <h3 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0;">Capital One</h3>
              <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0 0 16px 0;">
                Troubleshooting guides for Capital One 360 checking account disappears, Zelle holds, mobile deposit delays, and debit declines.
              </p>
            </div>
            <a href="/banks/capital-one" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #0284c7; color: #ffffff; padding: 12px 20px; border-radius: 10px; font-weight: 700; text-decoration: none; font-size: 14px;">
              View all ${capOneArticles.length} Capital One Guides &rarr;
            </a>
          </div>
        </div>
      </section>

      <!-- Category Hubs Section -->
      <section id="categories" style="max-width: 1200px; margin: 56px auto 0; padding: 0 20px; width: 100%;">
        <div style="margin-bottom: 24px;">
          <h2 style="font-size: 24px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0;">Browse by Problem Category</h2>
          <p style="color: #64748b; font-size: 14px; margin: 0;">Explore curated problem directories to diagnose specific banking issues.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px;">
          ${activeCategories.map(cat => `
            <a href="/issues/${cat.slug}" style="display: block; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; background: #ffffff; text-decoration: none; color: inherit;">
              <div style="font-size: 24px; margin-bottom: 8px;">${cat.icon || '📌'}</div>
              <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 6px 0;">${cat.label}</h3>
              <div style="font-size: 12px; color: #2563eb; font-weight: 600;">${cat.count} verified guides &rarr;</div>
            </a>
          `).join('')}
        </div>
      </section>

      <!-- Complete Directory: Chase Bank Guides -->
      <section style="max-width: 1200px; margin: 56px auto 0; padding: 0 20px; width: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px;">
          <div>
            <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">Chase Bank Troubleshooting Guides (All ${chaseArticles.length} Solutions)</h2>
            <p style="color: #64748b; font-size: 13.5px; margin: 0;">Direct access to all verified Chase guides.</p>
          </div>
          <a href="/banks/chase" style="color: #2563eb; font-weight: 700; text-decoration: none; font-size: 14px;">View Hub &rarr;</a>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
          ${chaseArticles.map(a => `
            <article style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; background: #fff; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span style="font-size: 11px; font-weight: 700; color: #2563eb; text-transform: uppercase;">${catLabelMap[a.category] || 'Chase'}</span>
                <h3 style="font-size: 15px; font-weight: 700; margin: 6px 0 8px 0; line-height: 1.4;">
                  <a href="/guides/${a.slug}" style="color: #0f172a; text-decoration: none;">${(a.title || '').replace(/\[\d+\]/g, '').trim()}</a>
                </h3>
              </div>
              <div style="font-size: 12px; color: #94a3b8; border-top: 1px solid #f8fafc; padding-top: 10px; margin-top: 8px;">
                <a href="/guides/${a.slug}" style="color: #2563eb; font-weight: 600; text-decoration: none;">Read fix guide &rarr;</a>
              </div>
            </article>
          `).join('')}
        </div>
      </section>

      <!-- Complete Directory: Bank of America Guides -->
      <section style="max-width: 1200px; margin: 56px auto 0; padding: 0 20px; width: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px;">
          <div>
            <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">Bank of America Troubleshooting Guides (All ${bofaArticles.length} Solutions)</h2>
            <p style="color: #64748b; font-size: 13.5px; margin: 0;">Direct access to all verified Bank of America guides.</p>
          </div>
          <a href="/banks/bank-of-america" style="color: #dc2626; font-weight: 700; text-decoration: none; font-size: 14px;">View Hub &rarr;</a>
        </div>
          <a href="/banks/bank-of-america" style="color: #dc2626; font-weight: 700; text-decoration: none; font-size: 14px;">View Hub &rarr;</a>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
          ${bofaArticles.map(a => `
            <article style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; background: #fff; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span style="font-size: 11px; font-weight: 700; color: #dc2626; text-transform: uppercase;">${catLabelMap[a.category] || 'Bank of America'}</span>
                <h3 style="font-size: 15px; font-weight: 700; margin: 6px 0 8px 0; line-height: 1.4;">
                  <a href="/guides/${a.slug}" style="color: #0f172a; text-decoration: none;">${(a.title || '').replace(/\[\d+\]/g, '').trim()}</a>
                </h3>
              </div>
              <div style="font-size: 12px; color: #94a3b8; border-top: 1px solid #f8fafc; padding-top: 10px; margin-top: 8px;">
                <a href="/guides/${a.slug}" style="color: #dc2626; font-weight: 600; text-decoration: none;">Read fix guide &rarr;</a>
              </div>
            </article>
          `).join('')}
        </div>
      </section>

      <!-- Complete Directory: Wells Fargo (25 Guides) -->
      ${wfArticles.length > 0 ? `
      <section style="max-width: 1200px; margin: 56px auto 64px; padding: 0 20px; width: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px;">
          <div>
            <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">Wells Fargo Troubleshooting Guides (${wfArticles.length} Solutions)</h2>
            <p style="color: #64748b; font-size: 13.5px; margin: 0;">Direct access to all verified Wells Fargo guides.</p>
          </div>
          <a href="/banks/wells-fargo" style="color: #d97706; font-weight: 700; text-decoration: none; font-size: 14px;">View Hub &rarr;</a>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
          ${wfArticles.map(a => `
            <article style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; background: #fff; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span style="font-size: 11px; font-weight: 700; color: #d97706; text-transform: uppercase;">${catLabelMap[a.category] || 'Wells Fargo'}</span>
                <h3 style="font-size: 15px; font-weight: 700; margin: 6px 0 8px 0; line-height: 1.4;">
                  <a href="/guides/${a.slug}" style="color: #0f172a; text-decoration: none;">${(a.title || '').replace(/\[\d+\]/g, '').trim()}</a>
                </h3>
              </div>
              <div style="font-size: 12px; color: #94a3b8; border-top: 1px solid #f8fafc; padding-top: 10px; margin-top: 8px;">
                <a href="/guides/${a.slug}" style="color: #d97706; font-weight: 600; text-decoration: none;">Read fix guide &rarr;</a>
              </div>
            </article>
          `).join('')}
        </div>
      </section>` : ''}

      <!-- Complete Directory: Capital One Guides -->
      ${capOneArticles.length > 0 ? `
      <section style="max-width: 1200px; margin: 56px auto 64px; padding: 0 20px; width: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px;">
          <div>
            <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">Capital One Troubleshooting Guides (${capOneArticles.length} Solutions)</h2>
            <p style="color: #64748b; font-size: 13.5px; margin: 0;">Direct access to all verified Capital One guides.</p>
          </div>
          <a href="/banks/capital-one" style="color: #0284c7; font-weight: 700; text-decoration: none; font-size: 14px;">View Hub &rarr;</a>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
          ${capOneArticles.map(a => `
            <article style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; background: #fff; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span style="font-size: 11px; font-weight: 700; color: #0284c7; text-transform: uppercase;">${catLabelMap[a.category] || 'Capital One'}</span>
                <h3 style="font-size: 15px; font-weight: 700; margin: 6px 0 8px 0; line-height: 1.4;">
                  <a href="/guides/${a.slug}" style="color: #0f172a; text-decoration: none;">${(a.title || '').replace(/\[\d+\]/g, '').trim()}</a>
                </h3>
              </div>
              <div style="font-size: 12px; color: #94a3b8; border-top: 1px solid #f8fafc; padding-top: 10px; margin-top: 8px;">
                <a href="/guides/${a.slug}" style="color: #0284c7; font-weight: 600; text-decoration: none;">Read fix guide &rarr;</a>
              </div>
            </article>
          `).join('')}
        </div>
      </section>` : ''}

      ${getGlobalFooterHtml()}
    </div>
  `;

  let homeHtml = baseHtml
    .replace('<div id="root"></div>', `<div id="root">${homeServerHtml}</div>`)
    .replace('</head>', `\n    <script type="application/ld+json">\n    ${JSON.stringify(homeSchema)}\n    </script>\n  </head>`);

  fs.writeFileSync(indexHtmlPath, homeHtml, 'utf8');

  // ─────────────────────────────────────────────────────────────
  // 8. Generate Static Sitemap (dist/sitemap.xml & public/sitemap.xml)
  // ─────────────────────────────────────────────────────────────
  console.log('🗺️ Generating static sitemap.xml...');

  const today = new Date().toISOString().split('T')[0];
  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemapXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Homepage
  sitemapXml += `  <url>\n    <loc>https://bankloginonline.com/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

  // Dedicated Bank Hubs
  for (const b of bankHubs) {
    sitemapXml += `  <url>\n    <loc>https://bankloginonline.com/banks/${b.slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  }

  // Active Categories Only (count > 0, NO empty soft 404 pages)
  for (const cat of activeCategories) {
    sitemapXml += `  <url>\n    <loc>https://bankloginonline.com/issues/${cat.slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  }

  // Core Static Trust Pages
  sitemapXml += `  <url>\n    <loc>https://bankloginonline.com/about</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  sitemapXml += `  <url>\n    <loc>https://bankloginonline.com/editorial-policy</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  sitemapXml += `  <url>\n    <loc>https://bankloginonline.com/contact</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
  sitemapXml += `  <url>\n    <loc>https://bankloginonline.com/privacy-policy</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>\n`;
  sitemapXml += `  <url>\n    <loc>https://bankloginonline.com/disclaimer</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>\n`;

  // All Published Guides (44 Chase + 44 BofA = 88 guides)
  for (const a of articles) {
    const lastMod = (a.updated_at || a.published_at || a.created_at || today).split('T')[0];
    sitemapXml += `  <url>\n    <loc>https://bankloginonline.com/guides/${a.slug}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  }

  sitemapXml += `</urlset>`;

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');
  fs.writeFileSync(path.join(rootDir, 'public', 'sitemap.xml'), sitemapXml, 'utf8');

  // Sync robots.txt to dist/
  if (fs.existsSync(path.join(rootDir, 'public', 'robots.txt'))) {
    fs.copyFileSync(path.join(rootDir, 'public', 'robots.txt'), path.join(distDir, 'robots.txt'));
  }

  const totalSitemapUrls = 1 + bankHubs.length + activeCategories.length + staticPages.length + articles.length;

  console.log(`✅ Pre-rendering complete!`);
  console.log(`   - ${articles.length} guides pre-rendered with @graph JSON-LD and /guides/ canonicals`);
  console.log(`   - Homepage pre-rendered with WebSite & Organization schemas and ALL 88 guides linked`);
  console.log(`   - ${bankHubs.length} dedicated Bank Hubs pre-rendered (/banks/chase, /banks/bank-of-america)`);
  console.log(`   - ${activeCategories.length} active category hubs pre-rendered`);
  console.log(`   - Static sitemap.xml generated with ${totalSitemapUrls} clean URLs.`);
}

prerender();
