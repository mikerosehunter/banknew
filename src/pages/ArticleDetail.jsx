import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, ExternalLink, CheckCircle, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { getArticle, publishArticle } from '../lib/api';
import { formatDate, seoScoreColor, seoScoreBg } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

function SeoMeter({ score }) {
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor';
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-dark-400">SEO Score</span>
        <span className={`text-lg font-bold ${seoScoreColor(score)}`}>{score}/100</span>
      </div>
      <div className="h-2 bg-white/[0.08] rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full ${seoScoreBg(score)} rounded-full`} />
      </div>
      <span className={`text-xs ${seoScoreColor(score)}`}>{label}</span>
    </div>
  );
}

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    getArticle(id).then(setArticle).finally(() => setLoading(false));
  }, [id]);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const result = await publishArticle(id);
      setToast({ msg: `Published at ${result.url}`, type: 'success' });
      const updated = await getArticle(id);
      setArticle(updated);
    } catch (e) {
      setToast({ msg: 'Publish failed: ' + e.message, type: 'error' });
    } finally {
      setPublishing(false);
      setTimeout(() => setToast(null), 5000);
    }
  };

  if (loading) return (
    <div className="p-8 space-y-4">
      {[...Array(4)].map((_, i) => <div key={i} className="h-24 skeleton rounded-2xl" />)}
    </div>
  );
  if (!article) return <div className="p-8 text-center text-dark-400">Article not found</div>;

  const keywords = article.keywords_parsed || [];
  const faq = article.faq_schema_parsed;

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link to="/articles" className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-dark-100 transition-colors">
          <ArrowLeft size={14} /> Back to Articles
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className={article.status === 'published' ? 'badge-published' : 'badge-draft'}>{article.status}</span>
                {article.error_code && <code className="text-xs bg-dark-800 px-2 py-0.5 rounded text-brand-300">{article.error_code}</code>}
              </div>
              <h1 className="text-xl font-bold text-white mb-3">{article.title}</h1>
              {article.meta_description && (
                <p className="text-sm text-dark-400 italic border-l-2 border-brand-500/40 pl-3">
                  {article.meta_description}
                </p>
              )}
              <div className="mt-4 flex items-center gap-4 text-xs text-dark-500">
                <span>{article.word_count?.toLocaleString() || 0} words</span>
                <span>·</span>
                <span>Bank: {article.bank_name}</span>
                <span>·</span>
                <span>{formatDate(article.created_at)}</span>
              </div>
            </div>

            {/* Article content */}
            <div className="glass-card p-8">
              <div className="prose prose-invert prose-sm max-w-none
                prose-headings:text-white prose-h1:text-xl prose-h2:text-lg prose-h2:border-b prose-h2:border-white/[0.08] prose-h2:pb-2
                prose-p:text-dark-300 prose-p:leading-relaxed
                prose-a:text-brand-400 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white prose-code:text-brand-300 prose-code:bg-dark-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-blockquote:border-brand-500 prose-blockquote:text-dark-400
                prose-table:text-sm prose-th:text-dark-400 prose-td:text-dark-300
                prose-li:text-dark-300">
                <ReactMarkdown>{article.content}</ReactMarkdown>
              </div>
            </div>

            {/* FAQ Schema preview */}
            {faq?.mainEntity?.length > 0 && (
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle size={15} className="text-green-400" />
                  <h2 className="font-semibold text-white text-sm">FAQ Schema (JSON-LD)</h2>
                  <span className="badge-published text-[10px]">Rich Snippet Ready</span>
                </div>
                <div className="space-y-3">
                  {faq.mainEntity.map((item, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <div className="text-sm font-medium text-white mb-1.5">Q: {item.name}</div>
                      <div className="text-xs text-dark-400">A: {item.acceptedAnswer?.text}</div>
                    </div>
                  ))}
                </div>
                <details className="mt-4">
                  <summary className="text-xs text-dark-500 cursor-pointer hover:text-dark-300">View raw JSON-LD</summary>
                  <pre className="mt-2 text-[10px] bg-dark-900 p-3 rounded-xl overflow-auto text-green-400 max-h-48">
                    {JSON.stringify(faq, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* SEO Score */}
            <div className="glass-card p-5">
              <h2 className="font-semibold text-white text-sm mb-4">SEO Analysis</h2>
              <SeoMeter score={article.seo_score || 0} />
              <div className="mt-4 space-y-2">
                {[
                  { label: 'Word Count', value: article.word_count >= 1500 ? '✅ 1500+' : `⚠️ ${article.word_count || 0}`, ok: article.word_count >= 1500 },
                  { label: 'Meta Description', value: article.meta_description ? '✅ Present' : '❌ Missing', ok: !!article.meta_description },
                  { label: 'FAQ Schema', value: faq ? '✅ Present' : '❌ Missing', ok: !!faq },
                  { label: 'Keywords', value: keywords.length > 0 ? `✅ ${keywords.length} keywords` : '❌ None', ok: keywords.length > 0 },
                ].map(({ label, value, ok }) => (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <span className="text-dark-500">{label}</span>
                    <span className={ok ? 'text-green-400' : 'text-red-400'}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords */}
            {keywords.length > 0 && (
              <div className="glass-card p-5">
                <h2 className="font-semibold text-white text-sm mb-3">Target Keywords</h2>
                <div className="flex flex-wrap gap-2">
                  {keywords.map(kw => (
                    <span key={kw} className="text-[11px] px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Publish */}
            <div className="glass-card p-5">
              <h2 className="font-semibold text-white text-sm mb-3">Publishing</h2>
              {article.status === 'published' ? (
                <div>
                  <div className="badge-published mb-3">Published ✓</div>
                  {article.cms_url && (
                    <a href={article.cms_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-brand-400 hover:text-brand-300 transition-colors">
                      <Globe size={12} /> View Live Article
                    </a>
                  )}
                </div>
              ) : (
                <button id="publish-article" onClick={handlePublish} disabled={publishing} className="w-full btn-primary justify-center text-sm">
                  {publishing ? 'Publishing...' : 'Publish to CMS'}
                </button>
              )}
            </div>

            {toast && (
              <div className={`p-4 rounded-xl text-xs border ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                {toast.msg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
