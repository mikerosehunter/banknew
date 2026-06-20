import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getArticles, getCategories } from '../../lib/api';
import { Search, ArrowRight, TrendingUp, BookOpen, Shield, Zap } from 'lucide-react';

// The 80 topic categories that get featured on the homepage
const TOPIC_SLUGS = [
  'login-access-problems','account-issues','mobile-app-problems','security-verification-issues',
  'card-atm-problems','payments-transactions','transfers-money-movement','banking-services-features',
  'error-codes-technical-issues','bank-outages-support','password-credential-problems',
  'registration-signup-issues','fraud-scam-alerts','deposit-problems','withdrawal-problems',
  'direct-deposit-issues','credit-card-issues','debit-card-issues','digital-wallet-problems',
  'zelle-p2p-payment-issues','ach-transfer-problems','wire-transfer-problems',
  'international-transfer-problems','balance-statement-issues','pending-transaction-issues',
  'failed-transaction-issues','refund-problems','bill-pay-problems','atm-availability-problems',
  'atm-cash-withdrawal-issues','fees-charges','online-banking-problems','browser-compatibility-issues',
  'server-errors','iphone-app-problems','android-app-problems','notification-problems',
  'rewards-cashback-problems','customer-support-issues','loan-credit-issues'
];

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topicCategories, setTopicCategories] = useState([]);
  const [bankCategories, setBankCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      getArticles({ limit: 8, status: 'published' }),
      getCategories()
    ]).then(([artRes, catRes]) => {
      setArticles(artRes.articles || []);
      const allCats = catRes || [];
      setCategories(allCats);
      setTopicCategories(allCats.filter(c => TOPIC_SLUGS.includes(c.slug)));
      setBankCategories(allCats.filter(c => !TOPIC_SLUGS.includes(c.slug)));
    }).finally(() => setLoading(false));
  }, []);

  // Live search
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); setShowDropdown(false); return; }
    const q = searchQuery.toLowerCase();
    const results = categories.filter(c => c.label.toLowerCase().includes(q)).slice(0, 6);
    setSearchResults(results);
    setShowDropdown(results.length > 0);
  }, [searchQuery, categories]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowDropdown(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      navigate(`/banks/${searchResults[0].slug}`);
      setShowDropdown(false);
    }
  };

  const featuredArticle = articles[0] || null;
  const recentArticles = articles.slice(1, 7);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="pub-hero">
        <div className="pub-hero-inner">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, marginBottom: '24px', backdropFilter: 'blur(10px)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 0 3px rgba(74,222,128,0.3)' }}></span>
            Updated Daily — 447 Banks & Topics Covered
          </div>
          <h1>Fix Your Bank Login Problems</h1>
          <p>Step-by-step guides for every US bank error — login issues, app crashes, failed transactions, and more. Find your bank or problem below.</p>

          {/* Search */}
          <div ref={searchRef} style={{ position: 'relative', maxWidth: '620px', margin: '0 auto' }}>
            <div className="pub-search-wrap">
              <Search size={20} />
              <input
                type="text"
                className="pub-search"
                placeholder="Search your bank or problem (e.g. Chase login error)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
              />
            </div>
            {showDropdown && (
              <div className="pub-search-dropdown">
                {searchResults.map(r => (
                  <Link key={r.slug} to={`/banks/${r.slug}`} className="pub-search-result-item" onClick={() => setShowDropdown(false)}>
                    <span style={{ fontSize: '20px' }}>{r.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{r.label}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>{r.description}</div>
                    </div>
                    <ArrowRight size={14} style={{ marginLeft: 'auto', color: '#94a3b8' }} />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick stat pills */}
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px', flexWrap: 'wrap' }}>
            {[['🏦', '367+', 'Banks Covered'], ['📂', '80', 'Problem Categories'], ['📝', 'Free', 'Fix Guides']].map(([icon, num, label]) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 24px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ fontSize: '22px', fontWeight: 800 }}>{icon} {num}</div>
                <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Browse by Problem Type ── */}
      <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '64px 0' }}>
        <div className="pub-container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#2563eb', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
              <Zap size={14} /> Browse by Problem
            </div>
            <h2 style={{ fontFamily: 'Merriweather, serif', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, color: '#0f172a', marginBottom: '12px' }}>
              What's your banking issue?
            </h2>
            <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '560px', margin: '0 auto' }}>
              Select a category below to find step-by-step fix guides.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {loading ? (
              Array(12).fill(0).map((_, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', height: '110px', animation: 'pulse 1.5s infinite' }} />
              ))
            ) : (
              topicCategories.map(cat => (
                <Link
                  key={cat.slug}
                  to={`/banks/${cat.slug}`}
                  style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '22px', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,99,235,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '28px', lineHeight: 1 }}>{cat.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a', lineHeight: 1.3 }}>{cat.label}</div>
                      {cat.count > 0 && (
                        <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600, background: '#eff6ff', padding: '2px 8px', borderRadius: '20px' }}>{cat.count} guides</span>
                      )}
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                    {cat.description || `Find solutions for ${cat.label.toLowerCase()}.`}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2563eb', fontSize: '12px', fontWeight: 600, marginTop: '4px' }}>
                    View guides <ArrowRight size={12} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Main Content + Sidebar ── */}
      <div className="pub-container">
        <div className="pub-grid">
          {/* Main Feed */}
          <main id="latest-guides">
            <h2 className="pub-section-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TrendingUp size={20} color="#2563eb" /> Latest Fix Guides
              </span>
            </h2>

            {loading ? (
              <div style={{ opacity: 0.5, padding: '20px 0' }}>Loading articles...</div>
            ) : articles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                <h3 style={{ fontFamily: 'Merriweather, serif', color: '#0f172a', marginBottom: '8px' }}>Articles Coming Soon</h3>
                <p style={{ color: '#64748b' }}>Our team is writing fix guides for all major US banks. Check back soon!</p>
              </div>
            ) : (
              <div>
                {/* Featured */}
                {featuredArticle && (
                  <Link to={`/article/${featuredArticle.slug}`} style={{ display: 'block', textDecoration: 'none', marginBottom: '32px', background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)', border: '1px solid #bfdbfe', borderRadius: '16px', padding: '28px', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(37,99,235,0.15)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2563eb', background: '#dbeafe', padding: '4px 12px', borderRadius: '20px' }}>Featured</span>
                    <h3 className="pub-article-title" style={{ fontSize: '22px', marginTop: '12px' }}>{featuredArticle.title}</h3>
                    <p className="pub-article-excerpt" style={{ fontSize: '15px' }}>{featuredArticle.excerpt || featuredArticle.meta_description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#64748b', marginTop: '12px' }}>
                      <span>{new Date(featuredArticle.published_at || featuredArticle.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      {featuredArticle.bank_name && <span>• {featuredArticle.bank_name}</span>}
                      <span style={{ marginLeft: 'auto', color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>Read guide <ArrowRight size={13} /></span>
                    </div>
                  </Link>
                )}

                {/* Recent Articles */}
                {recentArticles.map(a => (
                  <Link key={a.id} to={`/article/${a.slug}`} className="pub-article-card">
                    <div className="pub-article-img">
                      {a.category?.includes('login') ? '🔐' : a.category?.includes('app') ? '📱' : a.category?.includes('card') ? '💳' : a.category?.includes('transfer') ? '🔄' : '🏦'}
                    </div>
                    <div className="pub-article-card-body">
                      <span className="pub-article-category">{(a.category || '').replace(/-/g, ' ')}</span>
                      <h3 className="pub-article-title">{a.title}</h3>
                      <p className="pub-article-excerpt">{a.excerpt || a.meta_description}</p>
                      <div className="pub-article-meta">
                        <span>{new Date(a.published_at || a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
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
            {/* Active Categories */}
            {categories.filter(c => c.count > 0).length > 0 && (
              <div className="pub-widget">
                <h3 className="pub-widget-title">📂 Active Categories</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {categories.filter(c => c.count > 0).map(c => (
                    <Link key={c.slug} to={`/banks/${c.slug}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#475569', textDecoration: 'none', fontWeight: 500, fontSize: '14px', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{c.icon} <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>{c.label}</span></span>
                      <span style={{ background: '#dbeafe', color: '#2563eb', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>{c.count}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Browse by Bank */}
            <div className="pub-widget">
              <h3 className="pub-widget-title">🏦 Browse by Bank</h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Find fix guides specific to your bank.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
                {bankCategories.slice(0, 40).map(c => (
                  <Link key={c.slug} to={`/banks/${c.slug}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '8px', textDecoration: 'none', color: '#374151', fontSize: '13px', fontWeight: 500, transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#2563eb'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '#374151'; }}>
                    <span>🏦</span>{c.label}
                  </Link>
                ))}
              </div>
              {bankCategories.length > 40 && (
                <Link to="/banks" style={{ display: 'block', textAlign: 'center', marginTop: '14px', color: '#2563eb', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                  View all {bankCategories.length} banks →
                </Link>
              )}
            </div>

            {/* Quick Help */}
            <div className="pub-widget" style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', border: 'none', color: 'white' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>💡</div>
              <h3 style={{ fontFamily: 'Merriweather, serif', fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '10px' }}>Can't find your issue?</h3>
              <p style={{ fontSize: '13px', opacity: 0.85, lineHeight: 1.6, marginBottom: '16px' }}>Use the search bar above to quickly find guides for your specific bank error or problem.</p>
              <Link to="/banks/error-codes-technical-issues" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                Browse Error Codes <ArrowRight size={13} />
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* ── All Banks Section ── */}
      <div id="all-banks" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '64px 0' }}>
        <div className="pub-container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#2563eb', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
              <BookOpen size={14} /> All US Banks
            </div>
            <h2 style={{ fontFamily: 'Merriweather, serif', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>Find Your Bank</h2>
            <p style={{ color: '#64748b', fontSize: '15px' }}>Click on your bank to see all available fix guides.</p>
          </div>
          <div className="pub-bank-grid">
            {bankCategories.map(c => (
              <Link key={c.slug} to={`/banks/${c.slug}`} className="pub-bank-pill">
                <span style={{ display: 'block', fontSize: '20px', marginBottom: '4px' }}>🏦</span>
                {c.label}
                {c.count > 0 && <span style={{ display: 'block', fontSize: '11px', color: '#2563eb', marginTop: '2px' }}>{c.count} guides</span>}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
