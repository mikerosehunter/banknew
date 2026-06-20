import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getArticle } from '../../lib/api';

export default function PublicArticle() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticle(slug).then(data => {
      setArticle(data);
    }).catch(err => {
      console.error(err);
    }).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="pub-container" style={{ padding: '60px 24px', opacity: 0.5 }}>Loading article...</div>
  );

  if (!article) return (
    <div className="pub-container" style={{ padding: '100px 24px', textAlign: 'center' }}>
      <h2>Article not found</h2>
      <Link to="/">Return to Homepage</Link>
    </div>
  );

  const datePub = article.published_at || article.created_at;
  const authorName = "BankLoginOnline Editor";
  const reviewerName = "Security Analyst";

  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": article.title,
    "datePublished": datePub,
    "dateModified": article.updated_at || datePub,
    "author": {
      "@type": "Person",
      "name": authorName,
      "jobTitle": "FinTech Support Specialist",
      "url": "https://bankloginonline.com/"
    },
    "reviewedBy": {
      "@type": "Person",
      "name": reviewerName,
      "jobTitle": "Cybersecurity Analyst",
      "url": "https://bankloginonline.com/"
    },
    "publisher": {
      "@type": "Organization",
      "name": "BankLoginOnline",
      "logo": {
        "@type": "ImageObject",
        "url": "https://bankloginonline.com/logo.png"
      }
    }
  };

  return (
    <article className="fix-guide-container">
      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* 1. HIGH-VISIBILITY DISCLAIMER BLOCK */}
      <section className="ymyl-disclaimer-banner" style={{ background: '#fef9c3', borderBottom: '1px solid #fde047', padding: '12px 24px' }}>
        <div className="pub-container" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '13px', color: '#854d0e', lineHeight: 1.5 }}>
          <span style={{ fontSize: '16px' }}>⚠️</span>
          <p style={{ margin: 0 }}>
            <strong>Independent Support Directory:</strong> BankLoginOnline is an independent, educational tech-support publisher. We are <strong>not</strong> affiliated with, endorsed by, or partnered with any official banking institution. Never share your passwords or PINs with anyone.
          </p>
        </div>
      </section>

      <div className="pub-container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
        {/* 2. HEADER & METADATA */}
        <header className="article-header" style={{ marginBottom: '40px' }}>
          <nav className="breadcrumbs" aria-label="Breadcrumb" style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', display: 'flex', gap: '8px' }}>
            <Link to="/" style={{ color: '#2563eb', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link to={`/banks/${article.category}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{(article.category || '').replace(/-/g, ' ')}</Link>
            <span>/</span>
            <span style={{ color: '#94a3b8' }}>{article.bank_name || 'Fix Guide'}</span>
          </nav>
          
          <h1 className="article-title" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontFamily: 'Merriweather, serif', fontWeight: 900, color: '#0f172a', lineHeight: 1.2, marginBottom: '16px' }}>
            {article.title}
          </h1>
          <p className="article-excerpt" style={{ fontSize: '18px', color: '#475569', lineHeight: 1.6, marginBottom: '32px', maxWidth: '800px' }}>
            {article.excerpt || article.meta_description}
          </p>

          {/* 3. COMPLIANT BYLINE & REVIEW BLOCK */}
          <div className="eeat-byline-block" style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', padding: '24px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            
            {/* Author Info */}
            <div className="author-info" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>👨‍💻</div>
              <div className="details" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className="name" style={{ fontSize: '14px', color: '#0f172a' }}>Written by <strong>{authorName}</strong></span>
                <span className="credentials" style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>FinTech Support Specialist</span>
              </div>
            </div>

            {/* Reviewer / Fact-Checker Info */}
            <div className="reviewer-info" style={{ display: 'flex', gap: '16px', alignItems: 'center', borderLeft: '1px solid #cbd5e1', paddingLeft: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🛡️</div>
              <div className="details" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className="name" style={{ fontSize: '14px', color: '#0f172a' }}>Fact-Checked by <strong>{reviewerName}</strong></span>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span className="credentials" style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Cybersecurity Analyst</span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>•</span>
                  <span className="date" style={{ fontSize: '12px', color: '#64748b' }}>Updated: <time dateTime={datePub}>{new Date(datePub).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time></span>
                </div>
              </div>
            </div>

          </div>
        </header>

        {/* 4. MAIN CONTENT WITH TRANSPARENT SOURCE LINKING */}
        <div className="article-body" style={{ maxWidth: '800px' }}>
          
          {/* Outbound Official Link Block */}
          {article.bank_name && (
            <div className="official-source-block" style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '24px', marginBottom: '40px' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 12px 0', fontSize: '16px', color: '#0369a1' }}>
                <span>🔗</span> Official Resource
              </h4>
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#0c4a6e' }}>
                Check the official system status or contact support directly at the source:
              </p>
              <a 
                href={`https://www.google.com/search?q=${encodeURIComponent(article.bank_name + ' official website support')}`}
                target="_blank" 
                rel="noopener noreferrer nofollow"
                className="official-link-btn"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #7dd3fc', color: '#0284c7', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(2,132,199,0.05)' }}
              >
                Visit Official {article.bank_name} Help Center
              </a>
            </div>
          )}

          {article.image_url && (
            <div style={{ marginBottom: '40px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <img src={article.image_url} alt={article.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          )}

          <div className="pub-prose">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
          
        </div>

        {/* 5. FOOTER REITERATION */}
        <footer className="article-footer" style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #e2e8f0', maxWidth: '800px' }}>
          <div className="safety-reminder" style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 12px 0', fontSize: '16px', color: '#0f172a' }}>
              <span>🔒</span> Security Reminder
            </h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>
              Official bank representatives will never ask for your password, PIN, or one-time verification codes (OTP). If you suspect fraudulent activity, call the number on the back of your debit or credit card immediately.
            </p>
          </div>

          {/* Tags / Keywords */}
          {article.keywords_parsed && article.keywords_parsed.length > 0 && (
            <div style={{ marginTop: '40px' }}>
              <h4 style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Tags</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {article.keywords_parsed.map(kw => (
                  <span key={kw} style={{ background: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '4px', fontSize: '13px' }}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </footer>
      </div>
    </article>
  );
}
