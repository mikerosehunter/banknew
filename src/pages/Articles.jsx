import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Search, Plus, Zap, TrendingUp, Eye, Send, RefreshCw, X } from 'lucide-react';
import { getArticles, getArticleStats, generateBulkArticles, publishArticle } from '../lib/api';
import { formatRelative, seoScoreColor, seoScoreBg, truncate } from '../lib/utils';

function SeoScoreBadge({ score }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
        <div className={`h-full ${seoScoreBg(score)} rounded-full transition-all`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-bold ${seoScoreColor(score)}`}>{score}</span>
    </div>
  );
}

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState({});
  const [toast, setToast] = useState(null);
  const LIMIT = 20;

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: LIMIT, offset: page * LIMIT };
      if (search) params.search = search;
      if (status) params.status = status;
      const [artData, statsData] = await Promise.all([getArticles(params), getArticleStats()]);
      setArticles(artData.articles || []);
      setTotal(artData.total || 0);
      setStats(statsData);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, status, page]);

  useEffect(() => { load(); }, [load]);

  const handleBulkGenerate = async () => {
    setGenerating(true);
    try {
      const result = await generateBulkArticles(5);
      showToast(`Generated ${result.success} articles successfully!`);
      load();
    } catch (e) {
      showToast('Bulk generation failed.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = async (articleId) => {
    setPublishing(p => ({ ...p, [articleId]: true }));
    try {
      const result = await publishArticle(articleId);
      showToast(`Published! URL: ${result.url}`);
      load();
    } catch (e) {
      showToast('Publish failed: ' + e.message, 'error');
    } finally {
      setPublishing(p => ({ ...p, [articleId]: false }));
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Articles', value: stats.total, color: 'text-brand-400' },
            { label: 'Published', value: stats.published, color: 'text-green-400' },
            { label: 'Drafts', value: stats.draft, color: 'text-yellow-400' },
            { label: 'Avg SEO Score', value: `${stats.avgSeoScore}/100`, color: 'text-purple-400' },
            { label: 'Total Words', value: stats.totalWords?.toLocaleString() || '0', color: 'text-orange-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="kpi-card">
              <div className="text-xs text-dark-500">{label}</div>
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
          <input type="text" placeholder="Search articles..."
            className="input-dark pl-9" value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }} />
        </div>
        <select className="input-dark w-auto min-w-[130px]" value={status}
          onChange={e => { setStatus(e.target.value); setPage(0); }}>
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <button onClick={load} className="btn-ghost text-xs"><RefreshCw size={13} />Refresh</button>
        <button id="bulk-generate" onClick={handleBulkGenerate} disabled={generating} className="btn-primary text-xs">
          <Zap size={13} className={generating ? 'animate-spin' : ''} />
          {generating ? 'Generating...' : 'Bulk Generate (5)'}
        </button>
      </div>

      {/* Articles table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(6)].map((_, i) => <div key={i} className="h-16 skeleton rounded-xl" />)}
          </div>
        ) : articles.length === 0 ? (
          <div className="p-16 text-center">
            <FileText size={40} className="mx-auto mb-4 text-dark-600" />
            <div className="text-dark-400 font-medium mb-1">No articles yet</div>
            <div className="text-dark-600 text-sm mb-4">Click "Bulk Generate" to auto-create SEO articles from discovered errors</div>
            <button onClick={handleBulkGenerate} disabled={generating} className="btn-primary">
              <Zap size={14} />Generate Articles
            </button>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Article</th>
                <th>Bank</th>
                <th>SEO Score</th>
                <th>Words</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article, i) => (
                <motion.tr key={article.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                  <td>
                    <div>
                      <Link to={`/articles/${article.id}`} className="font-medium text-white text-sm hover:text-brand-300 transition-colors line-clamp-1">
                        {article.title}
                      </Link>
                      {article.error_title && (
                        <div className="text-xs text-dark-600 mt-0.5 line-clamp-1">From: {article.error_title}</div>
                      )}
                    </div>
                  </td>
                  <td><span className="text-sm text-dark-300">{article.bank_name || '—'}</span></td>
                  <td><SeoScoreBadge score={article.seo_score || 0} /></td>
                  <td><span className="text-sm text-dark-300">{(article.word_count || 0).toLocaleString()}</span></td>
                  <td>
                    <span className={article.status === 'published' ? 'badge-published' : 'badge-draft'}>
                      {article.status}
                    </span>
                  </td>
                  <td><span className="text-xs text-dark-400">{formatRelative(article.created_at)}</span></td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <Link to={`/articles/${article.id}`}
                        className="p-1.5 rounded-lg bg-white/[0.04] text-dark-400 hover:text-brand-300 hover:bg-brand-500/10 transition-all">
                        <Eye size={13} />
                      </Link>
                      {article.status !== 'published' && (
                        <button id={`publish-${article.id}`}
                          disabled={publishing[article.id]}
                          onClick={() => handlePublish(article.id)}
                          className="p-1.5 rounded-lg bg-white/[0.04] text-dark-400 hover:text-green-300 hover:bg-green-500/10 transition-all">
                          <Send size={13} className={publishing[article.id] ? 'animate-spin' : ''} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
        
        {total > LIMIT && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.05]">
            <span className="text-sm text-dark-400">Showing {page * LIMIT + 1}–{Math.min((page + 1) * LIMIT, total)} of {total}</span>
            <div className="flex gap-2">
              <button className="btn-ghost text-xs" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</button>
              <button className="btn-ghost text-xs" disabled={(page + 1) * LIMIT >= total} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl border text-sm font-medium flex items-center gap-3 ${
            toast.type === 'success' ? 'bg-green-900/80 border-green-500/30 text-green-300' : 'bg-red-900/80 border-red-500/30 text-red-300'
          }`} style={{ backdropFilter: 'blur(20px)' }}>
          {toast.msg}
          <button onClick={() => setToast(null)}><X size={14} /></button>
        </motion.div>
      )}
    </div>
  );
}
