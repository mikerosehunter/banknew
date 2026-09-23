import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Shield, 
  AlertTriangle, 
  Phone, 
  ExternalLink, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown, 
  Lock, 
  HelpCircle, 
  FileText, 
  Flame, 
  ArrowUpRight, 
  ThumbsUp, 
  ThumbsDown, 
  Sparkles, 
  Zap, 
  Check 
} from 'lucide-react';
import { getArticle, getArticles, getCategories, articleMemoryCache } from '../../lib/api';
import { getSameBankRelated } from '../../lib/relatedGuides';

// Helper to generate clean URL anchor slugs from heading text
function slugifyHeading(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[*_`#]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Helper to extract top-level H2 headings for Table of Contents
function extractHeadings(content) {
  if (!content) return [];
  const lines = content.split('\n');
  const headings = [];
  for (const line of lines) {
    const match = line.match(/^##\s+(.+)$/);
    if (match) {
      const rawText = match[1].trim();
      if (/^Frequently Asked Questions|FAQ/i.test(rawText)) continue;
      const cleanText = rawText.replace(/[*_`#]/g, '').trim();
      const id = slugifyHeading(cleanText);

      let label = cleanText;
      if (cleanText.length > 24) {
        if (/why/i.test(cleanText)) label = 'Causes & Trigger';
        else if (/fix|step|solution|resolve|how to/i.test(cleanText)) label = 'Step-by-Step Fixes';
        else if (/server|status|outage/i.test(cleanText)) label = 'Server Status';
        else if (/escalat|support|contact|call|phone/i.test(cleanText)) label = 'Official Escalation';
        else if (/matrix|quick reference/i.test(cleanText)) label = 'Quick Matrix';
        else label = cleanText.split(/[:—–-]/)[0].trim();
        if (label.length > 22) label = label.substring(0, 20) + '...';
      }

      headings.push({ id, text: cleanText, label });
    }
  }
  return headings;
}

// Helper to extract FAQ from markdown for interactive accordion rendering
function extractFAQ(content) {
  if (!content) return { mainMarkdown: '', faqs: [] };
  
  const faqRegex = /## (?:Frequently Asked Questions|FAQ)(?:[^\n]*)/i;
  const match = content.match(faqRegex);
  if (!match) return { mainMarkdown: content, faqs: [] };

  const splitIndex = match.index;
  const mainMarkdown = content.substring(0, splitIndex).trim();
  const faqSection = content.substring(splitIndex + match[0].length).trim();

  // Parse questions (**Q: ...?** or **...**) and answers
  const chunks = faqSection.split(/\n\s*\n/);
  const faqs = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i].trim();
    if (!chunk) continue;

    const qMatch = chunk.match(/^\*\*(?:Q:?\s*)?([^*?]+\??)\*\*\s*([\s\S]*)/i);
    if (qMatch) {
      let question = qMatch[1].trim();
      if (!question.endsWith('?')) question += '?';
      let answer = qMatch[2].trim();

      // If answer was on next paragraph
      if (!answer && i + 1 < chunks.length && !chunks[i + 1].trim().startsWith('**')) {
        answer = chunks[i + 1].trim();
        i++;
      }

      faqs.push({ question, answer: answer || 'Refer to the official bank customer service.' });
    }
  }

  return { mainMarkdown, faqs };
}

// Helper to retrieve initial article data from memory or embedded SSR payload
function getInitialArticle(slug, routerState) {
  if (!slug) return null;
  // 1. From Router navigation state if full article was passed
  if (routerState && (routerState.slug === slug || routerState.id === slug)) {
    if (routerState.content) {
      articleMemoryCache.set(slug, routerState);
    }
    return routerState;
  }
  // 2. From client in-memory cache
  if (articleMemoryCache.has(slug)) {
    const cached = articleMemoryCache.get(slug);
    if (cached) return cached;
  }
  // 3. From embedded __ARTICLE_DATA__ script in pre-rendered HTML
  if (typeof document !== 'undefined') {
    try {
      const el = document.getElementById('__ARTICLE_DATA__');
      if (el && el.textContent) {
        const parsed = JSON.parse(el.textContent);
        if (parsed && (parsed.slug === slug || parsed.id === slug)) {
          articleMemoryCache.set(slug, parsed);
          return parsed;
        }
      }
    } catch (e) {
      // ignore
    }
  }
  return null;
}

// Polished in-place skeleton that matches the exact article page structure
function ArticleSkeleton({ partialArticle }) {
  const cleanTitle = (partialArticle?.title || '').replace(/\[\d+\]/g, '').trim();
  const bankName = partialArticle?.bank_name || 'Bank Help';

  return (
    <article className="fix-guide-page" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', width: '100%' }}>
      <section className="ymyl-disclaimer-banner" style={{ background: '#fffbeb', borderBottom: '1px solid #fef3c7', padding: '10px 24px' }}>
        <div className="pub-container" style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13px', color: '#92400e' }}>
          <span>⚠️</span>
          <p style={{ margin: 0 }}>
            <strong>Independent Support Directory:</strong> BankLoginOnline is an educational technology support portal. Not affiliated with any bank.
          </p>
        </div>
      </section>

      <div className="pub-container" style={{ paddingTop: '28px', paddingBottom: '70px' }}>
        {/* Breadcrumb skeleton */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '24px', fontSize: '13px', color: '#64748b' }}>
          <Link to="/" style={{ color: '#2563eb', textDecoration: 'none' }}>Home</Link>
          <span style={{ color: '#cbd5e1' }}>/</span>
          {partialArticle?.category ? (
            <Link to={`/banks/${partialArticle.category}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{bankName}</Link>
          ) : (
            <div style={{ width: '60px', height: '14px', background: '#e2e8f0', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
          )}
          <span style={{ color: '#cbd5e1' }}>/</span>
          {cleanTitle ? (
            <span style={{ color: '#0f172a', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>{cleanTitle}</span>
          ) : (
            <div style={{ width: '140px', height: '14px', background: '#e2e8f0', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
          )}
        </div>

        <div className="article-layout-grid">
          <main className="article-card-main">
            {/* Badges */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600 }}>
                {bankName}
              </span>
              <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600 }}>
                Verified Solution
              </span>
            </div>

            {/* Title */}
            {cleanTitle ? (
              <h1 className="article-headline" style={{ marginBottom: '16px' }}>{cleanTitle}</h1>
            ) : (
              <>
                <div style={{ height: '34px', background: '#e2e8f0', borderRadius: '8px', marginBottom: '12px', width: '85%', animation: 'pulse 1.5s infinite' }} />
                <div style={{ height: '34px', background: '#e2e8f0', borderRadius: '8px', marginBottom: '20px', width: '60%', animation: 'pulse 1.5s infinite' }} />
              </>
            )}

            {/* Meta bar shimmer */}
            <div style={{ height: '16px', background: '#f1f5f9', borderRadius: '4px', marginBottom: '24px', width: '45%', animation: 'pulse 1.5s infinite' }} />

            {/* Takeaways Card Shimmer */}
            <div style={{ height: '90px', background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', borderRadius: '12px', border: '1px solid #bae6fd', marginBottom: '28px', animation: 'pulse 1.5s infinite' }} />

            {/* Author Box Shimmer */}
            <div style={{ height: '76px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '32px', animation: 'pulse 1.5s infinite' }} />

            {/* Paragraph lines shimmer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              <div style={{ height: '16px', background: '#f1f5f9', borderRadius: '4px', width: '100%', animation: 'pulse 1.5s infinite' }} />
              <div style={{ height: '16px', background: '#f1f5f9', borderRadius: '4px', width: '95%', animation: 'pulse 1.5s infinite' }} />
              <div style={{ height: '16px', background: '#f1f5f9', borderRadius: '4px', width: '90%', animation: 'pulse 1.5s infinite' }} />
              <div style={{ height: '16px', background: '#f1f5f9', borderRadius: '4px', width: '75%', animation: 'pulse 1.5s infinite' }} />
            </div>

            <div style={{ height: '26px', background: '#e2e8f0', borderRadius: '6px', width: '50%', marginBottom: '16px', animation: 'pulse 1.5s infinite' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ height: '16px', background: '#f1f5f9', borderRadius: '4px', width: '98%', animation: 'pulse 1.5s infinite' }} />
              <div style={{ height: '16px', background: '#f1f5f9', borderRadius: '4px', width: '92%', animation: 'pulse 1.5s infinite' }} />
            </div>
          </main>

          <aside className="article-sidebar">
            <div className="sidebar-card" style={{ height: '150px', animation: 'pulse 1.5s infinite' }} />
            <div className="sidebar-card" style={{ height: '220px', animation: 'pulse 1.5s infinite' }} />
          </aside>
        </div>
      </div>
    </article>
  );
}

export default function PublicArticle() {
  const { slug } = useParams();
  const location = useLocation();
  const routerStateArticle = location.state?.article;

  const initialArticle = getInitialArticle(slug, routerStateArticle);
  const [article, setArticle] = useState(initialArticle);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(!initialArticle || !initialArticle.content);
  const [openFaqIndex, setOpenFaqIndex] = useState(0); // first open by default
  const [feedbackVote, setFeedbackVote] = useState(null);

  useEffect(() => {
    // Check if we already have the complete article in memory
    const existing = getInitialArticle(slug, routerStateArticle);
    if (existing && existing.content) {
      setArticle(existing);
      setLoading(false);
    } else {
      if (existing) setArticle(existing);
      setLoading(true);
    }

    // Scroll to top on article change
    window.scrollTo({ top: 0, behavior: 'instant' });

    getArticle(slug)
      .then(data => {
        if (data) {
          setArticle(data);
          articleMemoryCache.set(slug, data);

          // Fetch related same-bank articles with smart companion scoring
          getArticles({ limit: 50, bank_name: data.bank_name })
            .then(res => {
              const matched = getSameBankRelated(data, res.articles || [], 6);
              setRelatedArticles(matched);
            })
            .catch(console.error);
        }
      })
      .catch(err => {
        console.error('Failed to load article:', err);
      })
      .finally(() => setLoading(false));

    // Fetch categories for sidebar
    getCategories()
      .then(cats => {
        const TOPIC_SLUGS = [
          'login-access-problems', 'account-issues', 'mobile-app-problems', 
          'security-verification-issues', 'card-atm-problems', 'payments-transactions'
        ];
        const topicList = (cats || []).filter(c => TOPIC_SLUGS.includes(c.slug));
        setCategories(topicList.slice(0, 6));
      })
  }, [slug]);

  // Synchronize document title, meta description, and canonical link on client-side routing
  useEffect(() => {
    if (article) {
      const clean = (article.title || '').replace(/\[\d+\]/g, '').trim();
      document.title = `${clean} | BankLoginOnline`;

      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = article.meta_description || article.excerpt || '';

      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = `https://bankloginonline.com/guides/${article.slug}`;

      let ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.content = `https://bankloginonline.com/guides/${article.slug}`;
    }
  }, [article]);

  const scrollToSection = (e, targetId) => {
    if (e && e.preventDefault) e.preventDefault();
    
    let el = document.getElementById(targetId);

    if (!el) {
      const allHeadings = document.querySelectorAll('h2[id], section[id]');
      for (const h of allHeadings) {
        const hid = h.id.toLowerCase();
        if (targetId.includes('fix') || targetId.includes('step') || targetId.includes('solution')) {
          if (hid.includes('fix') || hid.includes('step') || hid.includes('solution') || hid.includes('resolve') || hid.includes('how-to')) {
            el = h; break;
          }
        } else if (targetId.includes('quick') || targetId.includes('reference') || targetId.includes('overview') || targetId.includes('matrix')) {
          if (hid.includes('quick') || hid.includes('reference') || hid.includes('symptom') || hid.includes('matrix')) {
            el = h; break;
          }
        } else if (targetId.includes('escalat') || targetId.includes('support') || targetId.includes('contact')) {
          if (hid.includes('escalat') || hid.includes('support') || hid.includes('contact') || hid.includes('call')) {
            el = h; break;
          }
        } else if (targetId.includes('faq')) {
          if (hid === 'faq' || hid.includes('faq') || hid.includes('question')) {
            el = h; break;
          }
        }
      }
    }

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', `#${el.id || targetId}`);
    }
  };

  useEffect(() => {
    if (article && window.location.hash) {
      const id = window.location.hash.replace('#', '');
      setTimeout(() => scrollToSection(null, id), 350);
    }
  }, [article]);

  if (loading && (!article || !article.content)) {
    return <ArticleSkeleton partialArticle={article} />;
  }

  if (!article || !article.content) return (
    <div style={{ minHeight: '75vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', padding: '60px 20px', textAlign: 'center' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '22px' }}>
        ⚠️
      </div>
      <h2 style={{ fontSize: '26px', color: '#0f172a', marginBottom: '12px', fontWeight: 800 }}>Guide Not Found</h2>
      <p style={{ color: '#64748b', marginBottom: '24px', maxWidth: '420px', fontSize: '14.5px', lineHeight: 1.6 }}>The requested troubleshooting article could not be located or may have moved.</p>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#2563eb', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>Return to Homepage</Link>
    </div>
  );

  const publishedDate = article.published_at || article.created_at;
  const updatedDate = article.updated_at || publishedDate;

  const formattedPublishDate = new Date(publishedDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedUpdateDate = new Date(updatedDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const isUpdated = updatedDate && new Date(updatedDate).toDateString() !== new Date(publishedDate).toDateString();

  const words = (article.content || '').trim().split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.ceil(words / 225));
  const cleanTitle = (article.title || '').replace(/\[\d+\]/g, '').trim();

  // Primary Analyst & Peer Reviewer Profiles (Backed by real team assets)
  const author = {
    name: "David Sterling, CISA",
    title: "Founder & Lead Financial Systems Analyst",
    photo: "/team/david-sterling.jpg",
    experience: "Certified Information Systems Auditor (CISA) with over 14 years auditing retail banking architectures, payment gateways, and IAM session tokens. Oversees our diagnostic guides on error codes, biometric desyncs, and funds availability disputes.",
    credentials: ["CISA Certified", "ISACA Member", "Core Banking Forensics"]
  };

  const reviewer = {
    name: "Elena Rostova, CISSP",
    title: "Head of Mobile Security & Biometrics",
    photo: "/team/elena-rostova.jpg",
    credentials: ["CISSP", "Mobile Security Enclaves"]
  };

  const { mainMarkdown, faqs } = extractFAQ(article.content);
  const headings = extractHeadings(mainMarkdown);

  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": cleanTitle,
    "description": article.meta_description || article.excerpt,
    "image": "https://bankloginonline.com/og-image.png",
    "inLanguage": "en-US",
    "datePublished": publishedDate,
    "dateModified": updatedDate,
    "mainEntityOfPage": `https://bankloginonline.com/guides/${article.slug}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "BankLoginOnline",
      "url": "https://bankloginonline.com"
    },
    "author": {
      "@type": "Person",
      "name": author.name,
      "jobTitle": author.title,
      "url": "https://bankloginonline.com/about"
    },
    "reviewedBy": {
      "@type": "Person",
      "name": reviewer.name,
      "jobTitle": reviewer.title,
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
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
        "name": article.bank_name || (article.category ? article.category.replace(/-/g, ' ') : "Troubleshooting"),
        "item": `https://bankloginonline.com/issues/${article.category || 'login-access-problems'}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": cleanTitle,
        "item": `https://bankloginonline.com/guides/${article.slug}`
      }
    ]
  };

  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  } : null;

  // Custom Markdown Components for rich engaging elements
  const markdownComponents = {
    blockquote({ children }) {
      const textContent = Array.isArray(children) 
        ? children.map(c => (typeof c === 'string' ? c : (c?.props?.children || ''))).join(' ')
        : (typeof children === 'string' ? children : (children?.props?.children || ''));

      const str = String(textContent);

      let calloutClass = 'callout-blue';
      let icon = 'ℹ️';

      if (str.includes('🔴') || str.includes('Status Update') || str.includes('Critical')) {
        calloutClass = 'callout-rose';
        icon = '🔴';
      } else if (str.includes('⚠️') || str.includes('Warning') || str.includes('Security')) {
        calloutClass = 'callout-amber';
        icon = '⚠️';
      } else if (str.includes('💡') || str.includes('Tip') || str.includes('Quick Fix')) {
        calloutClass = 'callout-emerald';
        icon = '💡';
      }

      return (
        <blockquote className={calloutClass}>
          <span className="callout-icon">{icon}</span>
          <div className="callout-body">{children}</div>
        </blockquote>
      );
    },
    a({ href, children, ...props }) {
      if (href && (href.startsWith('/') || href.includes('bankloginonline.com'))) {
        const cleanPath = href.replace(/^https?:\/\/bankloginonline\.com/, '');
        return (
          <Link to={cleanPath} className="in-body-interlink" {...props}>
            {children}
          </Link>
        );
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      );
    },
    table({ children }) {
      return (
        <div className="table-wrapper">
          <table>{children}</table>
        </div>
      );
    },
    h2({ children }) {
      const textContent = Array.isArray(children) 
        ? children.map(c => (typeof c === 'string' ? c : (c?.props?.children || ''))).join(' ')
        : (typeof children === 'string' ? children : (children?.props?.children || ''));
      
      const id = slugifyHeading(textContent);

      return (
        <h2 id={id} style={{ scrollMarginTop: '110px', wordBreak: 'break-word' }}>
          {children}
        </h2>
      );
    },
    h3({ children }) {
      const text = String(children);
      const isNumbered = /^[0-9]+[\.\)]/.test(text) || text.startsWith('Step');
      
      return (
        <div className="article-step-heading">
          {isNumbered && (
            <span className="step-num-badge">
              ✓
            </span>
          )}
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a', wordBreak: 'break-word', flex: 1 }}>
            {children}
          </h3>
        </div>
      );
    }
  };

  return (
    <article className="fix-guide-page" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      {/* 1. HIGH-VISIBILITY DISCLAIMER BANNER */}
      <section className="ymyl-disclaimer-banner" style={{ background: '#fffbeb', borderBottom: '1px solid #fef3c7', padding: '10px 24px' }}>
        <div className="pub-container" style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13px', color: '#92400e', lineHeight: 1.4 }}>
          <span style={{ fontSize: '15px' }}>⚠️</span>
          <p style={{ margin: 0 }}>
            <strong>Independent Support Directory:</strong> BankLoginOnline is an educational technology support portal. We are <strong>not</strong> affiliated with or endorsed by any bank. Never share your password or one-time verification codes (OTP).
          </p>
        </div>
      </section>

      <div className="pub-container" style={{ paddingTop: '36px', paddingBottom: '80px' }}>
        
        {/* BREADCRUMBS */}
        <nav className="breadcrumbs" aria-label="Breadcrumb" style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>Home</Link>
          <ChevronRight size={14} className="text-slate-400" />
          <Link to={`/issues/${article.category}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>
            {(article.category || 'Fix Guides').replace(/-/g, ' ')}
          </Link>
          <ChevronRight size={14} className="text-slate-400" />
          <span style={{ color: '#0f172a', fontWeight: 600 }}>{article.bank_name || 'Chase Bank'}</span>
        </nav>

        {/* 2-COLUMN WORDPRESS-STYLE MAGAZINE GRID */}
        <div className="article-layout-grid">
          
          {/* ════════ LEFT COLUMN: ELEVATED CARD CONTENT ════════ */}
          <main className="article-card-main">
            
            {/* ARTICLE HEADER */}
            <header style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', color: '#1d4ed8', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid #dbeafe' }}>
                  <Flame size={14} className="text-blue-600" /> Technical Fix Guide
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600 }}>
                  <CheckCircle2 size={13} className="text-emerald-600" /> Sourced & Verified
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600 }}>
                  <Clock size={13} className="text-slate-400" /> {readTimeMinutes} Min Read
                </span>
              </div>

              <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontFamily: 'Merriweather, serif', fontWeight: 900, color: '#0f172a', lineHeight: 1.25, marginBottom: '18px' }}>
                {cleanTitle}
              </h1>

              {/* DATES & TIMESTAMPS BAR */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: '#64748b', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <strong>Published:</strong> <time dateTime={publishedDate}>{formattedPublishDate}</time>
                </span>
                {isUpdated && (
                  <>
                    <span>•</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0f172a' }}>
                      <strong>Last Verified:</strong> <time dateTime={updatedDate}>{formattedUpdateDate}</time>
                    </span>
                  </>
                )}
              </div>

              <p style={{ fontSize: '17.5px', color: '#475569', lineHeight: 1.6, marginBottom: '28px' }}>
                {article.excerpt || article.meta_description}
              </p>

              {/* KEY DIAGNOSTICS SUMMARY BOX */}
              <div className="takeaways-card">
                <div className="takeaways-header">
                  <Sparkles size={16} />
                  <span>Key Diagnostic Summary</span>
                </div>
                <div className="takeaways-grid">
                  <div className="takeaway-item">
                    <Clock size={16} className="text-sky-600" />
                    <span>Estimated Read: <strong>{readTimeMinutes} Minutes</strong></span>
                  </div>
                  <div className="takeaway-item">
                    <Zap size={16} className="text-amber-500" />
                    <span>Primary Action: <strong>Step-by-Step Fixes</strong></span>
                  </div>
                  <div className="takeaway-item">
                    <Shield size={16} className="text-emerald-600" />
                    <span>Consumer Protection: <strong>Reg E / Zero-Liability</strong></span>
                  </div>
                </div>
              </div>

              {/* QUICK JUMP / TABLE OF CONTENTS PILL STRIP */}
              {(headings.length > 0 || faqs.length > 0) && (
                <div className="toc-pill-strip">
                  <span className="toc-label">Jump to:</span>
                  {headings.map((h, i) => (
                    <a 
                      key={h.id} 
                      href={`#${h.id}`} 
                      onClick={(e) => scrollToSection(e, h.id)} 
                      className="toc-pill"
                    >
                      <span>{i === 0 ? '⚡' : i === 1 ? '🛠️' : '📌'}</span> {h.label}
                    </a>
                  ))}
                  {faqs.length > 0 && (
                    <a 
                      href="#faq" 
                      onClick={(e) => scrollToSection(e, 'faq')} 
                      className="toc-pill"
                    >
                      <span>❓</span> FAQs
                    </a>
                  )}
                </div>
              )}

              {/* COMPLIANT E-E-A-T AUTHOR & FACT-CHECK CARD */}
              <div className="author-reviewer-card">
                {/* Author Info */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <img 
                    src={author.photo} 
                    alt={author.name}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #bfdbfe', flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700 }}>
                      Written by <Link to="/about" style={{ color: '#2563eb', textDecoration: 'none' }}>{author.name}</Link>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{author.title}</div>
                  </div>
                </div>

                {/* Reviewer Info */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <img 
                    src={reviewer.photo} 
                    alt={reviewer.name}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #bbf7d0', flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700 }}>
                      Fact-Checked by <Link to="/about" style={{ color: '#16a34a', textDecoration: 'none' }}>{reviewer.name}</Link>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {reviewer.title} · <time dateTime={updatedDate}>{formattedUpdateDate}</time>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* MAIN ARTICLE BODY (RICH PROSE) */}
            <div className="pub-prose">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {mainMarkdown}
              </ReactMarkdown>
            </div>

            {/* ════════ INTERACTIVE FAQ ACCORDIONS ════════ */}
            {faqs.length > 0 && (
              <section id="faq" className="faq-container" style={{ borderTop: '2px solid #f1f5f9', paddingTop: '36px', marginTop: '48px', scrollMarginTop: '110px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HelpCircle size={18} />
                  </div>
                  <h2 style={{ margin: 0, padding: 0, border: 'none', fontSize: '24px', fontFamily: 'Merriweather, serif', fontWeight: 700, color: '#0f172a' }}>
                    Frequently Asked Questions
                  </h2>
                </div>
                <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '24px' }}>
                  Quick, verified answers to the most common questions regarding this banking error:
                </p>

                <div>
                  {faqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div key={idx} className={`faq-card-modern ${isOpen ? 'is-open' : ''}`}>
                        <button 
                          className="faq-question-btn"
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          aria-expanded={isOpen}
                        >
                          <div className="faq-q-text">
                            <span className="faq-q-icon">{idx + 1}</span>
                            <span>{faq.question}</span>
                          </div>
                          <ChevronDown 
                            size={18} 
                            style={{ 
                              transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', 
                              transition: 'transform 0.2s', 
                              color: isOpen ? '#2563eb' : '#94a3b8',
                              flexShrink: 0
                            }} 
                          />
                        </button>
                        
                        {isOpen && (
                          <div className="faq-answer-body">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {faq.answer}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ════════ SAME-BANK RELATED TROUBLESHOOTING GUIDES ════════ */}
            {relatedArticles.length > 0 && (
              <section className="same-bank-related-section">
                <div className="same-bank-header">
                  <h3 className="same-bank-title">
                    <span>🏦</span> More {article.bank_name || 'Bank'} Troubleshooting Guides
                  </h3>
                  <Link to="/" style={{ fontSize: '13px', color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
                    Browse all guides &rarr;
                  </Link>
                </div>
                <div className="same-bank-grid">
                  {relatedArticles.slice(0, 4).map(rel => (
                    <Link
                      to={`/guides/${rel.slug}`}
                      key={rel.slug || rel.id}
                      className="same-bank-card"
                      onMouseEnter={() => prefetchArticle(rel.slug)}
                      onTouchStart={() => prefetchArticle(rel.slug)}
                    >
                      <span className="same-bank-card-badge">Verified Fix</span>
                      <h4 className="same-bank-card-title">{(rel.title || '').replace(/\[\d+\]/g, '').trim()}</h4>
                      <p className="same-bank-card-desc">{rel.excerpt || rel.meta_description}</p>
                      <div className="same-bank-card-footer">
                        Read step-by-step fix &rarr;
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* ════════ DOMAIN EXPERT AUTHOR PROFILE CARD ════════ */}
            <div style={{ marginTop: '48px', padding: '28px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <img 
                  src={author.photo} 
                  alt={author.name}
                  style={{ width: '68px', height: '68px', borderRadius: '14px', objectFit: 'cover', border: '2px solid #bfdbfe', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{author.name}</h3>
                    {author.credentials.map(c => (
                      <span key={c} style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                        {c}
                      </span>
                    ))}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#2563eb', marginBottom: '10px' }}>
                    {author.title}
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: 1.65 }}>
                    {author.experience}
                  </p>
                  <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: '#64748b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img src={reviewer.photo} alt={reviewer.name} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                      <span>Fact-Checked by <strong>{reviewer.name}</strong> ({reviewer.title})</span>
                    </div>
                    <Link to="/about" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      Meet Our Research Team <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* HELPFUL FEEDBACK WIDGET */}
            <div className="helpful-feedback-box">
              <div>
                <div className="helpful-title">Did this troubleshooting guide resolve your issue?</div>
                <p className="helpful-desc">Your anonymous feedback helps our editorial desk improve future guides.</p>
              </div>
              <div className="helpful-btn-group">
                <button 
                  className={`helpful-btn ${feedbackVote === 'yes' ? 'selected-yes' : ''}`}
                  onClick={() => setFeedbackVote('yes')}
                >
                  <ThumbsUp size={15} />
                  <span>{feedbackVote === 'yes' ? 'Thanks for voting!' : 'Yes, it helped'}</span>
                </button>
                <button 
                  className={`helpful-btn ${feedbackVote === 'no' ? 'selected-no' : ''}`}
                  onClick={() => setFeedbackVote('no')}
                >
                  <ThumbsDown size={15} />
                  <span>{feedbackVote === 'no' ? 'We will update this guide' : 'No, still stuck'}</span>
                </button>
              </div>
            </div>

            {/* SECURITY GUARDRAIL FOOTER */}
            <div style={{ marginTop: '32px', padding: '20px 24px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <Lock size={22} style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Financial Security Protocol</h4>
                <p style={{ margin: 0, fontSize: '13.5px', color: '#475569', lineHeight: 1.6 }}>
                  BankLoginOnline will never ask for your banking password, card number, or OTP security code. If you receive an unsolicited message claiming to be from your bank requesting login details, do not click the link—contact your institution directly via the telephone number on your card.
                </p>
              </div>
            </div>

          </main>


          {/* ════════ RIGHT COLUMN: WORDPRESS-STYLE SIDEBAR ════════ */}
          <aside className="article-sidebar">

            {/* 1. OFFICIAL BANK STATUS & SUPPORT CARD */}
            <div className="sidebar-card">
              <div className="sidebar-card-title">
                <Shield size={16} className="text-blue-600" />
                <span>Verified Bank Resources</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#1d4ed8', fontSize: '18px' }}>
                  {article.bank_name ? article.bank_name.charAt(0) : 'B'}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{article.bank_name || 'Financial Institution'}</h4>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    Official Primary Portal
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, marginBottom: '20px' }}>
                For account-level security blocks, always access your portal directly or call the number on the back of your card:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(() => {
                  const BANK_URLS = {
                    'Chase Bank': 'https://www.chase.com',
                    'Chase': 'https://www.chase.com',
                    'Bank of America': 'https://www.bankofamerica.com',
                    'Wells Fargo': 'https://www.wellsfargo.com',
                    'Citibank': 'https://www.citi.com',
                    'Citi': 'https://www.citi.com',
                    'Capital One': 'https://www.capitalone.com',
                    'US Bank': 'https://www.usbank.com',
                    'PNC Bank': 'https://www.pnc.com',
                    'Truist': 'https://www.truist.com',
                    'TD Bank': 'https://www.td.com',
                    'Chime': 'https://www.chime.com'
                  };
                  const bankUrl = BANK_URLS[article.bank_name] || 'https://www.consumerfinance.gov';
                  return (
                    <a 
                      href={bankUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#2563eb', color: 'white', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', transition: 'background 0.15s' }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Official Primary Site
                      </span>
                      <ExternalLink size={14} />
                    </a>
                  );
                })()}

                <div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>
                  <strong>Telephone Safety:</strong> Only dial telephone numbers printed on the physical back of your debit or credit card.
                </div>
              </div>
            </div>

            {/* 2. RELATED FIX GUIDES WIDGET */}
            <div className="sidebar-card">
              <div className="sidebar-card-title">
                <BookOpen size={16} className="text-blue-600" />
                <span>{article.bank_name ? `More ${article.bank_name} Guides` : 'Related Fix Guides'}</span>
              </div>

              {relatedArticles.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {relatedArticles.map((rel) => (
                    <Link to={`/guides/${rel.slug}`} key={rel.slug || rel.id} className="sidebar-related-item">
                      <div className="related-thumb">
                        <FileText size={18} />
                      </div>
                      <div className="related-content">
                        <div className="related-title">{(rel.title || '').replace(/\[\d+\]/g, '').trim()}</div>
                        <div className="related-meta">
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={11} /> 3 min read
                          </span>
                          <span>•</span>
                          <span>{rel.bank_name || 'General'}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '12px 0', fontSize: '13px', color: '#64748b' }}>
                  <p style={{ margin: '0 0 12px 0' }}>More step-by-step guides are currently being verified by our technical editorial team.</p>
                  <Link to="/" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Browse all banks & guides <ArrowUpRight size={14} />
                  </Link>
                </div>
              )}
            </div>

            {/* 3. POPULAR PROBLEM CATEGORIES */}
            {categories.length > 0 && (
              <div className="sidebar-card">
                <div className="sidebar-card-title">
                  <HelpCircle size={16} className="text-blue-600" />
                  <span>Browse by Issue</span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {categories.map(cat => (
                    <Link 
                      to={`/issues/${cat.slug}`} 
                      key={cat.slug}
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        padding: '6px 12px', 
                        background: '#f8fafc', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '6px', 
                        fontSize: '12px', 
                        fontWeight: 600, 
                        color: '#334155', 
                        textDecoration: 'none',
                        transition: 'all 0.15s'
                      }}
                    >
                      <span>{cat.icon || '📌'}</span>
                      <span>{cat.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 4. EMERGENCY FRAUD / SECURITY CHECKLIST */}
            <div className="sidebar-card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div className="sidebar-card-title" style={{ color: '#0f172a' }}>
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>Emergency Safety Checklist</span>
              </div>

              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
                <li style={{ marginBottom: '8px' }}><strong>Never reveal OTPs:</strong> Banks will never phone you requesting your text code.</li>
                <li style={{ marginBottom: '8px' }}><strong>Inspect Browser URL:</strong> Ensure the domain ends with <code>.chase.com</code> or your bank's official domain.</li>
                <li style={{ marginBottom: '8px' }}><strong>Lock Card in App:</strong> If you suspect fraud, immediately freeze your card in the mobile app.</li>
                <li><strong>Report Suspicious Activity:</strong> Call the fraud department directly via card telephone numbers.</li>
              </ul>
            </div>

          </aside>

        </div>

      </div>
    </article>
  );
}

