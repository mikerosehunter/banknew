import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, XCircle, Clock, Settings, Globe, Zap, ExternalLink } from 'lucide-react';
import { getPublishQueue, getArticles, publishArticle } from '../lib/api';
import { formatRelative, seoScoreColor } from '../lib/utils';

export default function Publish() {
  const [queue, setQueue] = useState([]);
  const [unpublished, setUnpublished] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishAll, setPublishAll] = useState(false);
  const [cmsConfig, setCmsConfig] = useState({ type: 'wordpress', endpoint: '', secret: '' });
  const [toast, setToast] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [queueData, articlesData] = await Promise.all([
        getPublishQueue(),
        getArticles({ status: 'draft', limit: 50 }),
      ]);
      setQueue(queueData || []);
      setUnpublished(articlesData.articles || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handlePublishOne = async (articleId) => {
    try {
      const opts = { cmsType: cmsConfig.type };
      if (cmsConfig.endpoint) opts.endpoint = cmsConfig.endpoint;
      if (cmsConfig.secret) opts.secret = cmsConfig.secret;
      const result = await publishArticle(articleId, opts);
      showToast(`Published! ${result.url}`);
      load();
    } catch (e) {
      showToast('Publish failed: ' + e.message, 'error');
    }
  };

  const handlePublishAll = async () => {
    setPublishAll(true);
    let success = 0;
    for (const article of unpublished) {
      try { await handlePublishOne(article.id); success++; } catch (e) {}
    }
    showToast(`Published ${success} of ${unpublished.length} articles.`);
    setPublishAll(false);
  };

  const statusIcon = (status) => {
    if (status === 'published') return <CheckCircle size={13} className="text-green-400" />;
    if (status === 'failed') return <XCircle size={13} className="text-red-400" />;
    return <Clock size={13} className="text-yellow-400" />;
  };

  return (
    <div className="p-8 space-y-6">
      {/* CMS Config */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings size={15} className="text-dark-400" />
          <h2 className="font-semibold text-white">CMS Configuration</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-dark-500 mb-1.5 block">CMS Type</label>
            <select className="input-dark" value={cmsConfig.type}
              onChange={e => setCmsConfig(c => ({ ...c, type: e.target.value }))}>
              <option value="wordpress">WordPress</option>
              <option value="ghost">Ghost</option>
              <option value="custom">Custom Webhook</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-dark-500 mb-1.5 block">Endpoint URL</label>
            <input type="url" placeholder="https://your-cms.com" className="input-dark" value={cmsConfig.endpoint}
              onChange={e => setCmsConfig(c => ({ ...c, endpoint: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-dark-500 mb-1.5 block">API Key / Token</label>
            <input type="password" placeholder="Secret token" className="input-dark" value={cmsConfig.secret}
              onChange={e => setCmsConfig(c => ({ ...c, secret: e.target.value }))} />
          </div>
        </div>
        {!cmsConfig.endpoint && (
          <p className="mt-3 text-xs text-dark-500 bg-dark-800/50 px-3 py-2 rounded-lg">
            💡 No endpoint configured — articles will be published in <span className="text-yellow-400">mock mode</span> (simulated publish, no actual CMS connection)
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'In Queue', value: unpublished.length, color: 'text-yellow-400' },
          { label: 'Published', value: queue.filter(q => q.status === 'published').length, color: 'text-green-400' },
          { label: 'Failed', value: queue.filter(q => q.status === 'failed').length, color: 'text-red-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="kpi-card">
            <div className="text-xs text-dark-500">{label}</div>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Unpublished articles */}
      {unpublished.length > 0 && (
        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05]">
            <h2 className="font-semibold text-white">Ready to Publish ({unpublished.length})</h2>
            <button onClick={handlePublishAll} disabled={publishAll} className="btn-primary text-xs">
              <Send size={13} className={publishAll ? 'animate-spin' : ''} />
              {publishAll ? 'Publishing All...' : 'Publish All'}
            </button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Article</th>
                <th>Bank</th>
                <th>SEO Score</th>
                <th>Words</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {unpublished.map((article, i) => (
                <motion.tr key={article.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <td>
                    <div className="font-medium text-white text-sm line-clamp-1">{article.title}</div>
                    <div className="text-xs text-dark-600 mt-0.5">{article.error_title}</div>
                  </td>
                  <td><span className="text-sm text-dark-300">{article.bank_name || '—'}</span></td>
                  <td><span className={`text-sm font-bold ${seoScoreColor(article.seo_score)}`}>{article.seo_score}/100</span></td>
                  <td><span className="text-sm text-dark-400">{(article.word_count || 0).toLocaleString()}</span></td>
                  <td><span className="text-xs text-dark-500">{formatRelative(article.created_at)}</span></td>
                  <td>
                    <button id={`publish-queue-${article.id}`}
                      onClick={() => handlePublishOne(article.id)} className="btn-primary text-xs py-1">
                      <Send size={11} />Publish
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Publish history */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.05]">
          <h2 className="font-semibold text-white">Publish History</h2>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 skeleton rounded-xl" />)}</div>
        ) : queue.length === 0 ? (
          <div className="p-12 text-center text-dark-500 text-sm">No publish history yet.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Article</th>
                <th>CMS Type</th>
                <th>Published</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((item, i) => (
                <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <td>
                    <div className="flex items-center gap-2">
                      {statusIcon(item.status)}
                      <span className={`text-xs font-medium ${item.status === 'published' ? 'text-green-400' : item.status === 'failed' ? 'text-red-400' : 'text-yellow-400'}`}>
                        {item.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-white line-clamp-1">{item.article_title}</div>
                    <div className={`text-xs mt-0.5 ${seoScoreColor(item.seo_score)}`}>SEO: {item.seo_score}</div>
                  </td>
                  <td>
                    <span className="text-xs px-2 py-0.5 rounded bg-white/[0.04] text-dark-400 capitalize">{item.cms_type}</span>
                  </td>
                  <td><span className="text-xs text-dark-500">{item.published_at ? formatRelative(item.published_at) : '—'}</span></td>
                  <td>
                    {item.status === 'published' && (() => {
                      const parsed = item.response_data ? JSON.parse(item.response_data) : null;
                      return parsed?.url ? (
                        <a href={parsed.url} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
                          <ExternalLink size={10} />{parsed.url.substring(0, 30)}...
                        </a>
                      ) : <span className="text-xs text-dark-600">—</span>;
                    })()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {toast && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl border text-sm font-medium max-w-sm ${
            toast.type === 'success' ? 'bg-green-900/80 border-green-500/30 text-green-300' : 'bg-red-900/80 border-red-500/30 text-red-300'
          }`} style={{ backdropFilter: 'blur(20px)' }}>
          {toast.msg}
        </motion.div>
      )}
    </div>
  );
}
