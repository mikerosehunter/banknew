import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain, FileText, Image, CheckCircle, ExternalLink, Zap, AlertTriangle } from 'lucide-react';
import { getError, analyzeError, generateArticle, generateImage, updateErrorStatus } from '../lib/api';
import { severityBadge, statusBadge, formatDate, formatRelative, formatNumber, errorTypeIcon } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

function SolutionStep({ index, text }) {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
      className="flex gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] transition-all">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
           style={{ background: 'linear-gradient(135deg, #00C6FF, #0072FF)' }}>{index + 1}</div>
      <p className="text-sm text-dark-200 leading-relaxed">{text}</p>
    </motion.div>
  );
}

export default function ErrorDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genImage, setGenImage] = useState(false);

  const load = async () => {
    try {
      const d = await getError(id);
      setData(d);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try { await analyzeError(id); await load(); } 
    catch (e) { console.error(e); }
    finally { setAnalyzing(false); }
  };

  const handleGenArticle = async () => {
    setGenerating(true);
    try { await generateArticle(id); await load(); }
    catch (e) { console.error(e); }
    finally { setGenerating(false); }
  };

  const handleGenImage = async () => {
    setGenImage(true);
    try { await generateImage(id); await load(); }
    catch (e) { console.error(e); }
    finally { setGenImage(false); }
  };

  if (loading) return (
    <div className="p-8 space-y-4">
      {[...Array(5)].map((_, i) => <div key={i} className="h-20 skeleton rounded-2xl" />)}
    </div>
  );

  if (!data) return (
    <div className="p-8 text-center">
      <AlertTriangle size={40} className="mx-auto mb-4 text-dark-600" />
      <p className="text-dark-400">Error not found</p>
    </div>
  );

  const solutions = data.analysis?.solutions ? JSON.parse(data.analysis.solutions) : [];

  return (
    <div className="p-8 space-y-6 max-w-6xl">
      <Link to="/errors" className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-dark-100 transition-colors">
        <ArrowLeft size={14} /> Back to Errors
      </Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className={severityBadge(data.severity)}>{data.severity?.toUpperCase()}</span>
              <span className={statusBadge(data.status)}>{data.status}</span>
              {data.error_code && (
                <code className="text-xs bg-dark-800 px-2.5 py-1 rounded-lg text-brand-300 border border-brand-500/20">
                  {data.error_code}
                </code>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{data.title}</h1>
            <p className="text-dark-400 leading-relaxed">{data.message}</p>
          </div>
          <div className="text-5xl">{errorTypeIcon(data.type)}</div>
        </div>

        {/* Meta grid */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Bank', value: data.bank_name },
            { label: 'Affected Users', value: formatNumber(data.affected_count) },
            { label: 'Detected', value: formatRelative(data.detected_at) },
            { label: 'Type', value: data.type?.replace(/_/g, ' ') },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
              <div className="text-xs text-dark-500 mb-1">{label}</div>
              <div className="text-sm font-semibold text-white">{value || 'N/A'}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Analysis + Solutions */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Analysis */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain size={16} className="text-purple-400" />
                <h2 className="font-semibold text-white">AI Analysis</h2>
                {data.analysis && (
                  <span className="text-xs text-dark-500">
                    {Math.round((data.analysis.confidence || 0) * 100)}% confidence
                  </span>
                )}
              </div>
              {!data.analysis && (
                <button id="run-analysis" onClick={handleAnalyze} disabled={analyzing} className="btn-primary text-xs">
                  <Brain size={12} className={analyzing ? 'animate-spin' : ''} />
                  {analyzing ? 'Analyzing...' : 'Run AI Analysis'}
                </button>
              )}
            </div>

            {data.analysis ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                  <div className="text-xs text-purple-400 font-medium mb-1 uppercase tracking-wider">Classification</div>
                  <div className="text-sm text-white font-medium">{data.analysis.classification}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <div className="text-xs text-dark-500 font-medium mb-1 uppercase tracking-wider">Root Cause</div>
                  <p className="text-sm text-dark-200 leading-relaxed">{data.analysis.root_cause}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <div className="text-xs text-dark-500 font-medium mb-1 uppercase tracking-wider">Business Impact</div>
                  <p className="text-sm text-dark-200 leading-relaxed">{data.analysis.severity_assessment}</p>
                </div>
                {(() => {
                  const tags = data.analysis.trend_tags ? JSON.parse(data.analysis.trend_tags) : [];
                  return tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map(t => (
                        <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-white/[0.05] text-dark-400 border border-white/[0.07]">#{t}</span>
                      ))}
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center py-8 text-dark-500 text-sm">
                Click "Run AI Analysis" to classify this error and identify root causes
              </div>
            )}
          </div>

          {/* Solutions */}
          {solutions.length > 0 && (
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={16} className="text-green-400" />
                <h2 className="font-semibold text-white">Step-by-Step Solutions</h2>
              </div>
              <div className="space-y-3">
                {solutions.map((s, i) => <SolutionStep key={i} index={i} text={s} />)}
              </div>
            </div>
          )}
        </div>

        {/* Right: Actions + Screenshot */}
        <div className="space-y-6">
          {/* Quick actions */}
          <div className="glass-card p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Zap size={15} className="text-yellow-400" /> Quick Actions
            </h2>
            <div className="space-y-3">
              <button id="generate-article" onClick={handleGenArticle} disabled={generating || !!data.article}
                className={`w-full ${data.article ? 'btn-ghost opacity-60' : 'btn-primary'} justify-center text-sm`}>
                <FileText size={14} className={generating ? 'animate-spin' : ''} />
                {data.article ? 'Article Generated ✓' : generating ? 'Generating Article...' : 'Generate SEO Article'}
              </button>
              
              <button onClick={handleGenImage} disabled={genImage || !!data.image} 
                className={`w-full ${data.image ? 'btn-ghost opacity-60' : 'btn-ghost'} justify-center text-sm`}>
                <Image size={14} />
                {data.image ? 'Image Generated ✓' : genImage ? 'Generating...' : 'Generate Error Screenshot'}
              </button>
              
              {data.article && (
                <Link to={`/articles/${data.article.id}`} className="w-full btn-ghost justify-center text-sm">
                  <ExternalLink size={14} /> View Article
                </Link>
              )}
              
              <button onClick={() => updateErrorStatus(id, data.status === 'resolved' ? 'active' : 'resolved').then(load)}
                className="w-full btn-ghost justify-center text-sm">
                {data.status === 'resolved' ? '🔄 Mark as Active' : '✅ Mark as Resolved'}
              </button>
            </div>
          </div>

          {/* Bank info */}
          <div className="glass-card p-6">
            <h2 className="font-semibold text-white mb-4">Bank Information</h2>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Name', value: data.bank_name },
                { label: 'Login URL', value: data.login_url, link: true },
                { label: 'Support', value: data.support_url, link: true },
              ].map(({ label, value, link }) => value && (
                <div key={label} className="flex items-start justify-between gap-2">
                  <span className="text-dark-500 flex-shrink-0">{label}</span>
                  {link ? (
                    <a href={value} target="_blank" rel="noopener noreferrer"
                      className="text-brand-400 hover:text-brand-300 text-right truncate transition-colors">
                      {value.replace(/https?:\/\//, '').substring(0, 35)}
                    </a>
                  ) : (
                    <span className="text-dark-200 text-right">{value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Generated screenshot */}
          {data.image && (
            <div className="glass-card p-4">
              <h2 className="font-semibold text-white mb-3 text-sm">Error Screenshot</h2>
              <img src={data.image.url} alt="Bank error screenshot" className="w-full rounded-xl" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
