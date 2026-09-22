import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticles, getCategories, prefetchArticle } from '../../lib/api';
import { Search, ChevronRight, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export default function CategoryArchive() {
  const { slug } = useParams();
  const [articles, setArticles] = useState([]);
  const [popularArticles, setPopularArticles] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch articles for this category
    getArticles({ category: slug, status: 'published' }).then(res => {
      setArticles(res.articles || []);
      // If no articles for this specific bank/issue, load popular guides as helpful fallback
      if (!res.articles || res.articles.length === 0) {
        getArticles({ status: 'published', limit: 6 }).then(popRes => {
          setPopularArticles(popRes.articles || []);
        }).catch(console.error);
      }
    }).catch(console.error);

    // Fetch category details
    getCategories().then(res => {
      const cat = res.find(c => c.slug === slug);
      if (cat) setCategory(cat);
    }).finally(() => setLoading(false));
  }, [slug]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '60px' }}>
      {/* Header */}
      <div className="pub-hero" style={{ padding: '50px 0 36px', minHeight: 'auto' }}>
        <div className="pub-hero-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '16px', color: '#94a3b8', fontSize: '13.5px' }}>
            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <Link to="/banks" style={{ color: '#94a3b8', textDecoration: 'none' }}>Banks</Link>
            <ChevronRight size={14} />
            <span style={{ color: '#f8fafc', fontWeight: 600 }}>{category ? category.label : slug.replace(/-/g, ' ')}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)' }}>{category ? category.label : slug.replace(/-/g, ' ')}</h1>
          <p style={{ marginTop: '12px', maxWidth: '600px', margin: '12px auto 0', opacity: 0.9 }}>
            {category?.description || `Independent troubleshooting guides, error code explanations, and login solutions for ${category?.label || slug.replace(/-/g, ' ')}.`}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="pub-container" style={{ marginTop: '36px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', maxWidth: '820px', margin: '0 auto' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', animation: 'pulse 1.5s infinite' }}>
                <div style={{ height: '22px', background: '#e2e8f0', borderRadius: '6px', width: '70%', marginBottom: '12px' }} />
                <div style={{ height: '14px', background: '#f1f5f9', borderRadius: '4px', width: '95%', marginBottom: '8px' }} />
                <div style={{ height: '14px', background: '#f1f5f9', borderRadius: '4px', width: '60%', marginBottom: '16px' }} />
                <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '4px', width: '25%' }} />
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <div style={{ padding: '48px 24px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '36px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px' }}>
                🏦
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Guides Under Editorial Verification</h2>
              <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '520px', margin: '0 auto 20px', lineHeight: 1.6 }}>
                We are actively monitoring {category?.label || slug.replace(/-/g, ' ')} and our security analysts are publishing verified fix guides for this category.
              </p>
              <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#2563eb', color: '#fff', padding: '10px 22px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
                Explore All Banking Guides <ArrowRight size={14} />
              </Link>
            </div>

            {popularArticles.length > 0 && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={20} color="#2563eb" /> Active Guides for Chase & Bank of America
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                  {popularArticles.map(a => (
                    <Link
                      key={a.id}
                      to={`/guides/${a.slug}`}
                      state={{ article: a }}
                      onMouseEnter={() => prefetchArticle(a.slug)}
                      onTouchStart={() => prefetchArticle(a.slug)}
                      className="pub-article-card"
                      style={{ display: 'flex', gap: '20px', padding: '20px 24px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', textDecoration: 'none', color: 'inherit' }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '12px' }}>{a.bank_name || 'Bank Guide'}</span>
                        </div>
                        <h4 className="pub-article-title" style={{ fontSize: '17px', fontWeight: 700, marginBottom: '6px', color: '#0f172a' }}>{a.title}</h4>
                        <p className="pub-article-excerpt" style={{ color: '#475569', fontSize: '13.5px', marginBottom: '10px', lineHeight: 1.5 }}>{a.excerpt || a.meta_description}</p>
                        <div style={{ display: 'flex', gap: '12px', color: '#94a3b8', fontSize: '12px' }}>
                          <span>{new Date(a.published_at || a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <span style={{ marginLeft: 'auto', color: '#2563eb', fontWeight: 600 }}>Read solution →</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '18px', maxWidth: '820px', margin: '0 auto' }}>
            {articles.map(a => (
              <Link
                key={a.id}
                to={`/guides/${a.slug}`}
                state={{ article: a }}
                onMouseEnter={() => prefetchArticle(a.slug)}
                onTouchStart={() => prefetchArticle(a.slug)}
                className="pub-article-card"
                style={{ display: 'flex', gap: '20px', padding: '22px 24px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s' }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '12px' }}>
                      {a.bank_name || 'Bank Guide'}
                    </span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>•</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      {new Date(a.published_at || a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="pub-article-title" style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: '#0f172a' }}>{a.title}</h3>
                  <p className="pub-article-excerpt" style={{ color: '#475569', marginBottom: '14px', lineHeight: 1.6, fontSize: '14px' }}>{a.excerpt || a.meta_description}</p>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#2563eb', fontSize: '13px', fontWeight: 600 }}>
                    <span>Read fix guide</span>
                    <ArrowRight size={13} style={{ marginLeft: '4px' }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

