import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, AlertTriangle, Clock, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';
import { getErrors, getArticles } from '../../lib/api';
import { formatRelative, errorTypeIcon, severityBadge } from '../../lib/utils';
import { motion } from 'framer-motion';

export default function Home() {
  const [errors, setErrors] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([
      getErrors({ limit: 8, status: 'active' }),
      getArticles({ limit: 6, status: 'published' })
    ]).then(([errorsRes, articlesRes]) => {
      setErrors(errorsRes.errors || []);
      setArticles(articlesRes.articles || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto pt-10 pb-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6"
        >
          Is Your Bank <span className="text-blue-600">Down?</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-slate-600 mb-10"
        >
          Real-time monitoring of US bank login errors, app crashes, and service outages. Find the root cause and step-by-step fixes for your banking issues.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative max-w-2xl mx-auto"
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all"
            placeholder="Search for your bank (e.g., Chase, Bank of America)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </motion.div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Col: Latest Articles */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-bold text-slate-900">Latest Fix Guides</h2>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-xl animate-pulse" />)}
            </div>
          ) : articles.length > 0 ? (
            <div className="space-y-4">
              {articles.map((article, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={article.id}
                >
                  <Link 
                    to={`/article/${article.slug || article.id}`}
                    className="block bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                            {article.bank_name || 'Bank News'}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock size={12} />
                            {formatRelative(article.created_at)}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-slate-600 line-clamp-2">
                          {article.meta_description || 'Click to read the complete troubleshooting guide and fix for this error.'}
                        </p>
                      </div>
                      <div className="hidden sm:flex flex-shrink-0 w-12 h-12 rounded-full bg-slate-50 items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No Recent Outages</h3>
              <p className="text-slate-500">We haven't generated any new fix guides recently.</p>
            </div>
          )}
        </div>

        {/* Right Col: Active Errors Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="text-amber-500" />
              Live Incidents
            </h2>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />)}
            </div>
          ) : errors.length > 0 ? (
            <div className="space-y-3">
              {errors.map((error) => (
                <div key={error.id} className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <Building2 size={14} className="text-slate-400" />
                      {error.bank_name}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${severityBadge(error.severity)}`}>
                      {error.severity}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-700 mb-2">{error.title}</p>
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      {errorTypeIcon(error.type)} {error.type.replace('_', ' ')}
                    </span>
                    <span>{formatRelative(error.detected_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-slate-500 text-sm">No active incidents detected.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
