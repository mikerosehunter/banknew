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

  return (
    <article>
      {/* Hero */}
      <div className="pub-article-hero">
        <div className="pub-article-hero-inner">
          <div className="pub-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to={`/category/${article.category}`}>{article.category.replace('-', ' ')}</Link>
            <span>/</span>
            <span style={{ color: '#cbd5e1' }}>{article.bank_name || 'Bank LoginOnline'}</span>
          </div>
          <h1 style={{ fontSize: '36px', fontFamily: '"Merriweather", serif', fontWeight: 900, marginBottom: '20px', lineHeight: 1.3 }}>
            {article.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#94a3b8', fontSize: '14px' }}>
            <span>By BankLoginOnline Editor</span>
            <span>•</span>
            <span>Updated {new Date(article.published_at || article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pub-article-content">
        {article.image_url && (
          <div style={{ marginBottom: '40px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <img src={article.image_url} alt={article.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        )}

        <div className="pub-prose">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>

        {/* Tags / Keywords */}
        {article.keywords_parsed && article.keywords_parsed.length > 0 && (
          <div style={{ marginTop: '60px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
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
      </div>
    </article>
  );
}
