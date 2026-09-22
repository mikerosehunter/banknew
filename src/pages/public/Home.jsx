import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getArticles, getCategories, prefetchArticle } from '../../lib/api';
import { Search, ArrowRight, TrendingUp, BookOpen, Shield, Zap, X, AlertCircle } from 'lucide-react';

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

// Smart search scoring across articles and categories
function performSearch(query, allArticles, allCategories) {
  if (!query || !query.trim()) return { articleMatches: [], categoryMatches: [], isFallback: false };

  const raw = query.trim().toLowerCase();
  const words = raw.split(/\s+/).filter(w => w.length > 1);

  // Common banking aliases
  const isChaseQuery = raw.includes('chase') || raw.includes('jpmorgan') || raw.includes('jpm');
  const isBofaQuery = raw.includes('bofa') || raw.includes('boa') || raw.includes('america') || raw.includes('b of a');

  // 1. Score Articles
  const scoredArticles = (allArticles || []).map(article => {
    let score = 0;
    const titleLower = (article.title || '').toLowerCase();
    const excerptLower = (article.excerpt || article.meta_description || '').toLowerCase();
    const bankLower = (article.bank_name || '').toLowerCase();
    const slugLower = (article.slug || '').toLowerCase();

    // Exact title phrase match
    if (titleLower === raw) score += 250;
    else if (titleLower.startsWith(raw)) score += 140;
    else if (titleLower.includes(raw)) score += 80;

    // Slug match
    if (slugLower.includes(raw.replace(/\s+/g, '-'))) score += 70;

    // Bank match
    if (isChaseQuery && bankLower.includes('chase')) score += 30;
    if (isBofaQuery && bankLower.includes('america')) score += 30;

    // Token matches in title
    for (const token of words) {
      if (titleLower.includes(token)) score += 30;
      if (excerptLower.includes(token)) score += 8;
      if (bankLower.includes(token)) score += 20;
    }

    // Number matching (e.g. error codes 99, 900, 350, 53004)
    const numbers = raw.match(/\d+/g) || [];
    for (const num of numbers) {
      if (titleLower.includes(num)) score += 70;
    }

    return { ...article, score, itemType: 'article' };
  }).filter(a => a.score > 0).sort((a, b) => b.score - a.score);

  // 2. Score Categories
  const scoredCategories = (allCategories || []).map(cat => {
    let score = 0;
    const labelLower = (cat.label || '').toLowerCase();
    const descLower = (cat.description || '').toLowerCase();
    const slugLower = (cat.slug || '').toLowerCase();

    if (labelLower === raw) score += 180;
    else if (labelLower.startsWith(raw)) score += 110;
    else if (labelLower.includes(raw)) score += 60;

    for (const token of words) {
      if (labelLower.includes(token)) score += 25;
      if (descLower.includes(token)) score += 6;
      if (slugLower.includes(token)) score += 10;
    }

    return { ...cat, score, itemType: 'category' };
  }).filter(c => c.score > 0).sort((a, b) => b.score - a.score);

  const totalMatches = scoredArticles.length + scoredCategories.length;
  if (totalMatches === 0) {
    // If no direct matches, return top popular articles as helpful fallback
    const popularFallbacks = (allArticles || []).slice(0, 4).map(a => ({
      ...a,
      isSuggestedFallback: true,
      itemType: 'article'
    }));
    return {
      articleMatches: popularFallbacks,
      categoryMatches: [],
      isFallback: true
    };
  }

  return {
    articleMatches: scoredArticles.slice(0, 5),
    categoryMatches: scoredCategories.slice(0, 3),
    isFallback: false
  };
}

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topicCategories, setTopicCategories] = useState([]);
  const [bankCategories, setBankCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBankFilter, setSelectedBankFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ articleMatches: [], categoryMatches: [], isFallback: false });
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeLetter, setActiveLetter] = useState('Top');
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Schema Generation
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "BankLoginOnline",
    "url": "https://bankloginonline.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://bankloginonline.com/banks/{search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const itemListSchema = articles.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": articles.map((a, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `https://bankloginonline.com/article/${a.slug}`
    }))
  } : null;


  useEffect(() => {
    Promise.all([
      getArticles({ limit: 100, status: 'published' }),
      getCategories()
    ]).then(([artRes, catRes]) => {
      setArticles(artRes.articles || []);
      const allCats = catRes || [];
      setCategories(allCats);
      setTopicCategories(allCats.filter(c => TOPIC_SLUGS.includes(c.slug)));
      setBankCategories(allCats.filter(c => !TOPIC_SLUGS.includes(c.slug)));
    }).finally(() => setLoading(false));
  }, []);

  // Live search suggestions as user types
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ articleMatches: [], categoryMatches: [], isFallback: false });
      setShowDropdown(false);
      setSelectedIndex(-1);
      return;
    }
    const results = performSearch(searchQuery, articles, categories);
    setSearchResults(results);
    const hasAny = results.articleMatches.length > 0 || results.categoryMatches.length > 0;
    setShowDropdown(hasAny);
    setSelectedIndex(-1);
  }, [searchQuery, articles, categories]);

  // Combined flat list for keyboard arrow navigation
  const combinedResults = useMemo(() => [
    ...(searchResults.articleMatches || []).map(a => ({ ...a, itemType: 'article' })),
    ...(searchResults.categoryMatches || []).map(c => ({ ...c, itemType: 'category' }))
  ], [searchResults]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowDropdown(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelectResult = (item) => {
    setShowDropdown(false);
    if (item.itemType === 'article') {
      prefetchArticle(item.slug);
      navigate(`/guides/${item.slug}`, { state: { article: item } });
    } else if (item.itemType === 'category') {
      const isTopic = TOPIC_SLUGS.includes(item.slug);
      navigate(isTopic ? `/issues/${item.slug}` : `/banks/${item.slug}`);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    // If an item in dropdown was actively highlighted via arrows, select it
    if (selectedIndex >= 0 && combinedResults[selectedIndex]) {
      handleSelectResult(combinedResults[selectedIndex]);
      return;
    }

    // Apply search to the homepage feed and scroll smoothly to results
    setVisibleCount(12);
    setActiveSearchQuery(q);
    setShowDropdown(false);
    setTimeout(() => {
      const el = document.getElementById('latest-guides');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!showDropdown) setShowDropdown(true);
      setSelectedIndex(prev => (prev < combinedResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!showDropdown) setShowDropdown(true);
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : combinedResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchSubmit();
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const chaseCount = articles.filter(a => a.bank_name?.toLowerCase().includes('chase')).length;
  const bofaCount = articles.filter(a => a.bank_name?.toLowerCase().includes('america')).length;

  // Search feed calculations
  const searchFeedResults = activeSearchQuery 
    ? articles.map(a => {
        let score = 0;
        const q = activeSearchQuery.toLowerCase().trim();
        const words = q.split(/\s+/).filter(w => w.length > 1);
        const titleLower = (a.title || '').toLowerCase();
        const excerptLower = (a.excerpt || a.meta_description || '').toLowerCase();
        const bankLower = (a.bank_name || '').toLowerCase();
        const slugLower = (a.slug || '').toLowerCase();

        if (titleLower === q) score += 200;
        else if (titleLower.includes(q)) score += 100;
        else if (slugLower.includes(q.replace(/\s+/g, '-'))) score += 70;

        if (q.includes('chase') && bankLower.includes('chase')) score += 30;
        if ((q.includes('bofa') || q.includes('america') || q.includes('boa')) && bankLower.includes('america')) score += 30;

        for (const w of words) {
          if (titleLower.includes(w)) score += 25;
          if (excerptLower.includes(w)) score += 8;
          if (bankLower.includes(w)) score += 15;
        }

        const numbers = q.match(/\d+/g) || [];
        for (const num of numbers) {
          if (titleLower.includes(num)) score += 60;
        }

        return { ...a, score };
      }).filter(a => a.score > 0).sort((a, b) => b.score - a.score)
    : [];

  const isSearchNoMatch = activeSearchQuery && searchFeedResults.length === 0;

  const filteredArticles = activeSearchQuery
    ? (isSearchNoMatch ? articles.slice(0, 10) : searchFeedResults)
    : articles.filter(a => {
        if (selectedBankFilter === 'chase') return a.bank_name?.toLowerCase().includes('chase');
        if (selectedBankFilter === 'bofa') return a.bank_name?.toLowerCase().includes('america');
        return true;
      });

  const featuredArticle = activeSearchQuery ? null : (filteredArticles[0] || null);
  const recentArticles = activeSearchQuery ? filteredArticles.slice(0, visibleCount) : filteredArticles.slice(1, visibleCount);

  return (
    <div>
      {/* JSON-LD Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      {itemListSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />}
      
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
            <form onSubmit={handleSearchSubmit} className="pub-search-wrap">
              <Search className="pub-search-icon" size={20} />
              <input
                type="text"
                className="pub-search"
                placeholder="Search your bank or problem (e.g. Chase error 99)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => {
                  if (searchQuery.trim() && combinedResults.length > 0) setShowDropdown(true);
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveSearchQuery('');
                    setShowDropdown(false);
                  }}
                  style={{
                    position: 'absolute',
                    right: '84px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px',
                    borderRadius: '50%',
                    zIndex: 2
                  }}
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
              <button
                type="submit"
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '9px 16px',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 8px rgba(37,99,235,0.4)',
                  zIndex: 2
                }}
              >
                Search
              </button>
            </form>

            {showDropdown && combinedResults.length > 0 && (
              <div className="pub-search-dropdown">
                {searchResults.isFallback && (
                  <div style={{
                    background: '#eff6ff',
                    borderBottom: '1px solid #dbeafe',
                    padding: '10px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#1e40af'
                  }}>
                    <AlertCircle size={15} style={{ flexShrink: 0, color: '#2563eb' }} />
                    <span>No exact match for <strong>&ldquo;{searchQuery}&rdquo;</strong>. Showing recommended guides:</span>
                  </div>
                )}

                {searchResults.articleMatches && searchResults.articleMatches.length > 0 && (
                  <div>
                    <div style={{
                      padding: '8px 16px 4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: '#64748b',
                      background: '#f8fafc',
                      borderBottom: '1px solid #f1f5f9'
                    }}>
                      Troubleshooting Guides
                    </div>
                    {searchResults.articleMatches.map(art => {
                      const itemIdx = combinedResults.findIndex(x => x.itemType === 'article' && x.slug === art.slug);
                      const isSelected = itemIdx === selectedIndex;
                      return (
                        <div
                          key={`art-${art.slug}`}
                          className={`pub-search-result-item ${isSelected ? 'is-selected' : ''}`}
                          style={{
                            background: isSelected ? '#f1f5f9' : undefined,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={() => setSelectedIndex(itemIdx)}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSelectResult({ ...art, itemType: 'article' });
                          }}
                        >
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: '#eff6ff',
                            color: '#2563eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <BookOpen size={16} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontWeight: 600,
                              fontSize: '13px',
                              color: '#0f172a',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {art.title}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                              {art.bank_name && (
                                <span style={{
                                  fontSize: '11px',
                                  color: '#2563eb',
                                  background: '#dbeafe',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  fontWeight: 600
                                }}>
                                  {art.bank_name}
                                </span>
                              )}
                              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Verified Fix</span>
                            </div>
                          </div>
                          <ArrowRight size={14} style={{ color: isSelected ? '#2563eb' : '#cbd5e1', flexShrink: 0 }} />
                        </div>
                      );
                    })}
                  </div>
                )}

                {searchResults.categoryMatches && searchResults.categoryMatches.length > 0 && (
                  <div>
                    <div style={{
                      padding: '8px 16px 4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: '#64748b',
                      background: '#f8fafc',
                      borderTop: '1px solid #f1f5f9',
                      borderBottom: '1px solid #f1f5f9'
                    }}>
                      Banks & Categories
                    </div>
                    {searchResults.categoryMatches.map(cat => {
                      const itemIdx = combinedResults.findIndex(x => x.itemType === 'category' && x.slug === cat.slug);
                      const isSelected = itemIdx === selectedIndex;
                      return (
                        <div
                          key={`cat-${cat.slug}`}
                          className={`pub-search-result-item ${isSelected ? 'is-selected' : ''}`}
                          style={{
                            background: isSelected ? '#f1f5f9' : undefined,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={() => setSelectedIndex(itemIdx)}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSelectResult({ ...cat, itemType: 'category' });
                          }}
                        >
                          <span style={{ fontSize: '20px', flexShrink: 0, width: '28px', textAlign: 'center' }}>
                            {cat.icon || '🏦'}
                          </span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontWeight: 600,
                              fontSize: '13px',
                              color: '#0f172a',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {cat.label}
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>
                              {cat.description || (TOPIC_SLUGS.includes(cat.slug) ? 'Problem Category' : 'Bank Portal')}
                            </div>
                          </div>
                          <ArrowRight size={14} style={{ color: isSelected ? '#2563eb' : '#cbd5e1', flexShrink: 0 }} />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Dropdown footer shortcuts */}
                <div style={{
                  padding: '8px 16px',
                  background: '#f8fafc',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '11px',
                  color: '#64748b'
                }}>
                  <span>Press <kbd style={{ background: '#e2e8f0', padding: '1px 5px', borderRadius: '4px', fontFamily: 'monospace' }}>Enter</kbd> to search all</span>
                  <span><kbd style={{ background: '#e2e8f0', padding: '1px 5px', borderRadius: '4px', fontFamily: 'monospace' }}>↑</kbd> <kbd style={{ background: '#e2e8f0', padding: '1px 5px', borderRadius: '4px', fontFamily: 'monospace' }}>↓</kbd> to navigate</span>
                </div>
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
              Browse Bank Error Categories
            </h2>
            <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '560px', margin: '0 auto' }}>
              Select a category below to find step-by-step fix guides.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))', gap: '16px' }}>
            {loading ? (
              Array(12).fill(0).map((_, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', height: '110px', animation: 'pulse 1.5s infinite' }} />
              ))
            ) : (
              topicCategories.map(cat => (
                <Link
                  key={cat.slug}
                  to={`/issues/${cat.slug}`}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2563eb', fontSize: '12px', fontWeight: 600, marginTop: '8px' }}>
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
                <TrendingUp size={20} color="#2563eb" /> {activeSearchQuery ? `Search Results for "${activeSearchQuery}"` : 'Recently Updated Bank Troubleshooting Guides'}
              </span>
            </h2>

            {/* Active Search Banner / No-Match Fallback Notice */}
            {activeSearchQuery && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                padding: '16px 20px',
                borderRadius: '12px',
                marginBottom: '24px',
                border: '1px solid',
                background: isSearchNoMatch ? '#fffbeb' : '#eff6ff',
                borderColor: isSearchNoMatch ? '#fde68a' : '#bfdbfe',
                color: isSearchNoMatch ? '#92400e' : '#1e40af'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px', color: isSearchNoMatch ? '#d97706' : '#2563eb' }} />
                  <div>
                    {isSearchNoMatch ? (
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '15px' }}>
                          No exact guides found for &ldquo;{activeSearchQuery}&rdquo;
                        </div>
                        <div style={{ fontSize: '13px', marginTop: '4px', color: '#78350f' }}>
                          Showing the most relevant and popular solutions below to help resolve your issue:
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '15px' }}>
                          Found {filteredArticles.length} guide{filteredArticles.length === 1 ? '' : 's'} matching &ldquo;{activeSearchQuery}&rdquo;
                        </div>
                        <div style={{ fontSize: '13px', marginTop: '4px', opacity: 0.85 }}>
                          Step-by-step verified fixes matching your query:
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSearchQuery('');
                    setSearchQuery('');
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#fff',
                    color: '#334155',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                >
                  <X size={15} /> Clear Search
                </button>
              </div>
            )}

            {/* Quick Bank Filters (hidden during search) */}
            {!activeSearchQuery && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => { setSelectedBankFilter('all'); setVisibleCount(12); }}
                  style={{
                    padding: '7px 16px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: selectedBankFilter === 'all' ? '#2563eb' : '#e2e8f0',
                    background: selectedBankFilter === 'all' ? '#2563eb' : '#fff',
                    color: selectedBankFilter === 'all' ? '#fff' : '#475569',
                    transition: 'all 0.15s ease'
                  }}
                >
                  All Guides ({articles.length})
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedBankFilter('chase'); setVisibleCount(12); }}
                  style={{
                    padding: '7px 16px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: selectedBankFilter === 'chase' ? '#2563eb' : '#e2e8f0',
                    background: selectedBankFilter === 'chase' ? '#2563eb' : '#fff',
                    color: selectedBankFilter === 'chase' ? '#fff' : '#475569',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Chase Bank ({chaseCount})
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedBankFilter('bofa'); setVisibleCount(12); }}
                  style={{
                    padding: '7px 16px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: selectedBankFilter === 'bofa' ? '#2563eb' : '#e2e8f0',
                    background: selectedBankFilter === 'bofa' ? '#2563eb' : '#fff',
                    color: selectedBankFilter === 'bofa' ? '#fff' : '#475569',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Bank of America ({bofaCount})
                </button>
              </div>
            )}

            {loading ? (
              <div style={{ opacity: 0.5, padding: '20px 0' }}>Loading articles...</div>
            ) : filteredArticles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                <h3 style={{ fontFamily: 'Merriweather, serif', color: '#0f172a', marginBottom: '8px' }}>Articles Coming Soon</h3>
                <p style={{ color: '#64748b' }}>Our team is writing fix guides for all major US banks. Check back soon!</p>
              </div>
            ) : (
              <div>
                {/* Featured */}
                {featuredArticle && (
                  <Link
                    to={`/guides/${featuredArticle.slug}`}
                    state={{ article: featuredArticle }}
                    onTouchStart={() => prefetchArticle(featuredArticle.slug)}
                    style={{ display: 'block', textDecoration: 'none', marginBottom: '32px', background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)', border: '1px solid #bfdbfe', borderRadius: '16px', padding: '28px', transition: 'all 0.2s' }}
                    onMouseEnter={e => { prefetchArticle(featuredArticle.slug); e.currentTarget.style.boxShadow = '0 8px 32px rgba(37,99,235,0.15)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; }}
                  >
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
                  <Link
                    key={a.id || a.slug}
                    to={`/guides/${a.slug}`}
                    state={{ article: a }}
                    onMouseEnter={() => prefetchArticle(a.slug)}
                    onTouchStart={() => prefetchArticle(a.slug)}
                    className="pub-article-card"
                  >
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

                {/* Load More Button */}
                {visibleCount < filteredArticles.length && (
                  <div style={{ textAlign: 'center', marginTop: '32px' }}>
                    <button
                      type="button"
                      onClick={() => setVisibleCount(prev => prev + 12)}
                      style={{
                        padding: '12px 28px',
                        background: '#fff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        color: '#1e40af',
                        fontWeight: 600,
                        fontSize: '14px',
                        cursor: 'pointer',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.background = '#eff6ff'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#fff'; }}
                    >
                      Load More Guides ({filteredArticles.length - visibleCount} remaining)
                    </button>
                  </div>
                )}
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

      {/* ── E-E-A-T Section ── */}
      <div style={{ background: '#0f172a', padding: '64px 24px', color: '#cbd5e1', textAlign: 'center' }}>
        <div className="pub-container" style={{ maxWidth: '800px' }}>
          <Shield size={40} color="#4ade80" style={{ margin: '0 auto 20px' }} />
          <h2 style={{ color: 'white', fontFamily: 'Merriweather, serif', fontSize: '28px', marginBottom: '16px' }}>Verified & Trusted Solutions</h2>
          <p style={{ lineHeight: 1.6, fontSize: '16px' }}>Our technical troubleshooting guides are verified and updated daily by digital banking specialists to ensure you get the most accurate and safe solutions for your banking issues. We monitor hundreds of institutions 24/7 so you're never left in the dark.</p>
        </div>
      </div>

      {/* ── All Banks Section ── */}
      <div id="all-banks" style={{ background: '#f8fafc', padding: '64px 0' }}>
        <div className="pub-container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#2563eb', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
              <BookOpen size={14} /> Directory
            </div>
            <h2 style={{ fontFamily: 'Merriweather, serif', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>Find Your Bank</h2>
            <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '32px' }}>Select a letter to browse our directory of supported US banks.</p>
            
            {/* Alphabetical Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
              {['Top', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')].map(letter => (
                <button
                  key={letter}
                  onClick={() => setActiveLetter(letter)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: activeLetter === letter ? '#2563eb' : '#e2e8f0',
                    background: activeLetter === letter ? '#2563eb' : 'white',
                    color: activeLetter === letter ? 'white' : '#64748b',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
          <div className="pub-bank-grid">
            {bankCategories
              .filter(c => activeLetter === 'Top' ? ['jpmorgan-chase-bank', 'bank-of-america', 'wells-fargo-bank', 'citibank', 'capital-one-bank', 'us-bank', 'pnc-bank', 'chime'].includes(c.slug) : c.label.toUpperCase().startsWith(activeLetter))
              .map(c => (
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
