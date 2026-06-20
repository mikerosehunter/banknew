import { useState, useEffect } from 'react';
import { getArticles } from '../lib/api';
import { Search, FileText, CheckCircle2, Clock, Edit } from 'lucide-react';
import { formatRelative } from '../lib/utils';

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticles({ limit: 50 }).then(data => {
      setArticles(data.articles || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 space-y-6 text-white">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Content Hub</h1>
          <p className="text-slate-400">Manage your SEO fix guides and articles.</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Bank</th>
                <th>Status</th>
                <th>Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8">Loading...</td></tr>
              ) : articles.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8">No articles found. Click Auto-Generate in Dashboard.</td></tr>
              ) : (
                articles.map(article => (
                  <tr key={article.id}>
                    <td>
                      <div className="font-medium text-white mb-1">{article.title}</div>
                      <div className="text-xs text-slate-500">{article.slug}</div>
                    </td>
                    <td><span className="px-2 py-1 bg-slate-800 rounded text-xs">{article.category}</span></td>
                    <td>{article.bank_name || '-'}</td>
                    <td>
                      {article.status === 'published' ? (
                        <span className="badge-published"><CheckCircle2 size={12}/> Published</span>
                      ) : (
                        <span className="badge-draft"><Clock size={12}/> Draft</span>
                      )}
                    </td>
                    <td className="text-xs text-slate-400">{formatRelative(article.published_at || article.created_at)}</td>
                    <td>
                      <button className="text-blue-400 hover:text-blue-300 p-2"><Edit size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
