import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getArticles, getCategories } from '../../lib/api';
import { Search } from 'lucide-react';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getArticles({ limit: 12, status: 'published' }),
      getCategories()
    ]).then(([artRes, catRes]) => {
      setArticles(artRes.articles || []);
      setCategories(catRes || []);
    }).finally(() => setLoading(false));
  }, []);

  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const recentArticles = articles.slice(1);

  return (
    <div>
      {/* Hero */}
      <section className="pub-hero">
        <div className="pub-hero-inner">
          <h1>Bank Login Error Fixes</h1>
          <p>The definitive guide to solving online banking login errors, app crashes, and service outages for top US banks.</p>
          <div className="pub-search-wrap">
            <Search size={20} />
            <input type="text" className="pub-search" placeholder="Search for your bank or error code..." />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="pub-container">
        <div className="pub-grid">
          {/* Main Feed */}
          <main>
            <h2 className="pub-section-title">Latest Fix Guides</h2>
            
            {loading ? (
              <div style={{ opacity: 0.5 }}>Loading articles...</div>
            ) : (
              <div>
                {featuredArticle && (
                  <Link to={`/article/${featuredArticle.slug}`} className="pub-article-card" style={{ display: 'block', paddingBottom: '32px', borderBottom: '2px solid #e2e8f0', marginBottom: '24px' }}>
                    <span className="pub-article-category">{featuredArticle.category.replace('-', ' ')}</span>
                    <h3 className="pub-article-title" style={{ fontSize: '24px' }}>{featuredArticle.title}</h3>
                    <p className="pub-article-excerpt" style={{ fontSize: '16px' }}>{featuredArticle.excerpt || featuredArticle.meta_description}</p>
                    <div className="pub-article-meta">
                      <span>{new Date(featuredArticle.published_at || featuredArticle.created_at).toLocaleDateString()}</span>
                      {featuredArticle.bank_name && <span>• {featuredArticle.bank_name}</span>}
                    </div>
                  </Link>
                )}

                {recentArticles.map(a => (
                  <Link key={a.id} to={`/article/${a.slug}`} className="pub-article-card">
                    <div className="pub-article-img">
                      {/* Placeholder icon based on category */}
                      {a.category.includes('login') ? '🔐' : a.category.includes('app') ? '📱' : '🏦'}
                    </div>
                    <div className="pub-article-card-body">
                      <span className="pub-article-category">{a.category.replace('-', ' ')}</span>
                      <h3 className="pub-article-title">{a.title}</h3>
                      <p className="pub-article-excerpt">{a.excerpt || a.meta_description}</p>
                      <div className="pub-article-meta">
                        <span>{new Date(a.published_at || a.created_at).toLocaleDateString()}</span>
                        {a.bank_name && <span>• {a.bank_name}</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside>
            <div className="pub-widget">
              <h3 className="pub-widget-title">Categories</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {categories.map(c => (
                  <Link key={c.slug} to={`/banks/${c.slug}`} style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', textDecoration: 'none', fontWeight: 500 }}>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%' }}>{c.icon} {c.label}</span>
                    <span style={{ background: '#e2e8f0', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{c.count}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pub-widget">
              <h3 className="pub-widget-title">Popular Banks</h3>
              <div className="pub-bank-grid">
                {['Chase', 'Bank of America', 'Wells Fargo', 'Citibank'].map(b => (
                  <Link key={b} to={`/banks?q=${b}`} className="pub-bank-pill">{b}</Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
