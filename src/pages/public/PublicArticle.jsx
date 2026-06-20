import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getArticle, getError } from '../../lib/api';
import { ArrowLeft, Clock, ShieldCheck, Share2 } from 'lucide-react';
import { formatRelative, seoScoreColor } from '../../lib/utils';
import { motion } from 'framer-motion';

export default function PublicArticle() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticle(slug).then(data => {
      setArticle(data);
      // Try to fetch the generated image if we have the error_id
      if (data.error_id) {
        getError(data.error_id).then(errData => {
          if (errData.image) setImage(errData.image.url);
        }).catch(() => {}); // ignore error
      }
    }).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="max-w-3xl mx-auto space-y-6 animate-pulse mt-8">
      <div className="h-10 bg-slate-200 rounded w-3/4" />
      <div className="h-4 bg-slate-200 rounded w-1/4" />
      <div className="h-64 bg-slate-200 rounded-xl w-full" />
      <div className="space-y-3 pt-8">
        {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-slate-200 rounded w-full" />)}
      </div>
    </div>
  );

  if (!article) return (
    <div className="text-center py-24">
      <h2 className="text-2xl font-bold text-slate-900">Article not found</h2>
      <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Return Home</Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <article>
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">
              {article.bank_name}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-slate-500">
              <Clock size={14} /> {new Date(article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
            {article.title}
          </h1>

          <div className="flex items-center justify-between border-y border-slate-200 py-4 mb-8">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <ShieldCheck className="text-green-500" size={18} />
              <span>Verified Fix Guide</span>
            </div>
            <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors">
              <Share2 size={16} /> Share
            </button>
          </div>
        </header>

        {image && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 rounded-2xl overflow-hidden border border-slate-200 shadow-sm"
          >
            <img src={image} alt={`Screenshot of ${article.error_title}`} className="w-full h-auto object-cover" />
          </motion.div>
        )}

        <div className="prose prose-slate prose-blue max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-a:text-blue-600 hover:prose-a:text-blue-500">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
