import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticles, getCategories } from '../../lib/api';
import { Search, ChevronRight } from 'lucide-react';

export default function CategoryArchive() {
  const { slug } = useParams();
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch articles for this category
    getArticles({ category: slug, status: 'published' }).then(res => {
      setArticles(res.articles || []);
    }).catch(console.error);

    // Fetch category details
    getCategories().then(res => {
      const cat = res.find(c => c.slug === slug);
      if (cat) setCategory(cat);
    }).finally(() => setLoading(false));
  }, [slug]);

  return (
    <div>
      {/* Header */}
      <div className="pub-hero" style={{ padding: '60px 0 40px', minHeight: 'auto' }}>
        <div className="pub-hero-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '16px', color: '#94a3b8', fontSize: '14px' }}>
            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <span>Banks</span>
            <ChevronRight size={14} />
            <span style={{ color: '#f8fafc' }}>{category ? category.label : slug.replace(/-/g, ' ')}</span>
          </div>
          <h1>{category ? category.label : slug.replace(/-/g, ' ')}</h1>
          {category?.description && <p style={{ marginTop: '16px' }}>{category.description}</p>}
        </div>
      </div>

      {/* Main Content */}
      <div className="pub-container" style={{ marginTop: '40px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading articles...</div>
        ) : articles.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h2>No articles yet</h2>
            <p style={{ marginTop: '8px' }}>We are currently monitoring {category?.label || slug} and will publish guides soon.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
            {articles.map(a => (
              <Link key={a.id} to={`/article/${a.slug}`} className="pub-article-card" style={{ display: 'flex', gap: '24px', padding: '24px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', textDecoration: 'none', color: 'inherit', transition: 'box-shadow 0.2s' }}>
                <div style={{ flex: 1 }}>
                  <h3 className="pub-article-title" style={{ fontSize: '20px', marginBottom: '8px', color: '#0f172a' }}>{a.title}</h3>
                  <p className="pub-article-excerpt" style={{ color: '#475569', marginBottom: '16px', lineHeight: 1.6 }}>{a.excerpt || a.meta_description}</p>
                  <div className="pub-article-meta" style={{ display: 'flex', gap: '16px', color: '#94a3b8', fontSize: '14px' }}>
                    <span>{new Date(a.published_at || a.created_at).toLocaleDateString()}</span>
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
