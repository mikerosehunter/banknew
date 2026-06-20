import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, AlertTriangle, ChevronRight, Zap, Brain, FileText, RefreshCw, X } from 'lucide-react';
import { getErrors, analyzeError, generateArticle, updateErrorStatus } from '../lib/api';
import { severityBadge, statusBadge, formatRelative, formatNumber, errorTypeIcon, truncate } from '../lib/utils';

const SEVERITY_OPTIONS = ['', 'critical', 'high', 'medium', 'low'];
const TYPE_OPTIONS = ['', 'login', '2fa', 'outage', 'transaction', 'payment', 'app_crash', 'app_error', 'account_lock', 'maintenance', 'biometric'];

function SeverityBar({ severity }) {
  const widths = { critical: '95%', high: '75%', medium: '50%', low: '25%' };
  const colors = { critical: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-yellow-500', low: 'bg-green-500' };
  return (
    <div className="w-16 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
      <div className={`h-full ${colors[severity] || 'bg-dark-500'} rounded-full`} style={{ width: widths[severity] || '25%' }} />
    </div>
  );
}

function ActionToast({ msg, type, onClose }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl border text-sm font-medium flex items-center gap-3 ${
        type === 'success' ? 'bg-green-900/80 border-green-500/30 text-green-300' : 'bg-red-900/80 border-red-500/30 text-red-300'
      }`} style={{ backdropFilter: 'blur(20px)' }}>
      {msg}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100"><X size={14} /></button>
    </motion.div>
  );
}

export default function Errors() {
  const [errors, setErrors] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(0);
  const [actionLoading, setActionLoading] = useState({});
  const [toast, setToast] = useState(null);
  const LIMIT = 20;

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadErrors = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: LIMIT, offset: page * LIMIT };
      if (search) params.search = search;
      if (severity) params.severity = severity;
      if (type) params.type = type;
      const data = await getErrors(params);
      setErrors(data.errors || []);
      setTotal(data.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, severity, type, page]);

  useEffect(() => { loadErrors(); }, [loadErrors]);

  const handleAnalyze = async (errorId, e) => {
    e.stopPropagation();
    setActionLoading(l => ({ ...l, [errorId + '_analyze']: true }));
    try {
      await analyzeError(errorId);
      showToast('AI analysis complete!', 'success');
      loadErrors();
    } catch (err) {
      showToast('Analysis failed: ' + err.message, 'error');
    } finally {
      setActionLoading(l => ({ ...l, [errorId + '_analyze']: false }));
    }
  };

  const handleGenArticle = async (errorId, e) => {
    e.stopPropagation();
    setActionLoading(l => ({ ...l, [errorId + '_article']: true }));
    try {
      await generateArticle(errorId);
      showToast('Article generated successfully!', 'success');
      loadErrors();
    } catch (err) {
      showToast('Article generation failed.', 'error');
    } finally {
      setActionLoading(l => ({ ...l, [errorId + '_article']: false }));
    }
  };

  const handleResolve = async (errorId, currentStatus, e) => {
    e.stopPropagation();
    const newStatus = currentStatus === 'resolved' ? 'active' : 'resolved';
    try {
      await updateErrorStatus(errorId, newStatus);
      setErrors(prev => prev.map(er => er.id === errorId ? { ...er, status: newStatus } : er));
    } catch (err) {
      showToast('Status update failed.', 'error');
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle size={20} className="text-orange-400" />
          <span className="text-dark-300 text-sm">{total} errors discovered</span>
        </div>
        <button onClick={loadErrors} className="btn-ghost text-xs">
          <RefreshCw size={13} />Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
          <input id="error-search" type="text" placeholder="Search errors, banks, codes..."
            className="input-dark pl-9" value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }} />
        </div>
        <select id="severity-filter" className="input-dark w-auto min-w-[130px]" value={severity}
          onChange={e => { setSeverity(e.target.value); setPage(0); }}>
          <option value="">All Severities</option>
          {SEVERITY_OPTIONS.filter(Boolean).map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        <select id="type-filter" className="input-dark w-auto min-w-[140px]" value={type}
          onChange={e => { setType(e.target.value); setPage(0); }}>
          <option value="">All Types</option>
          {TYPE_OPTIONS.filter(Boolean).map(t => (
            <option key={t} value={t}>{t.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
          ))}
        </select>
        {(search || severity || type) && (
          <button className="btn-ghost text-xs" onClick={() => { setSearch(''); setSeverity(''); setType(''); setPage(0); }}>
            <X size={12} />Clear
          </button>
        )}
      </div>

      {/* Errors table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-12 skeleton rounded-xl" style={{ animationDelay: `${i * 0.05}s` }} />
            ))}
          </div>
        ) : errors.length === 0 ? (
          <div className="p-16 text-center">
            <AlertTriangle size={40} className="mx-auto mb-4 text-dark-600" />
            <div className="text-dark-400 font-medium">No errors found</div>
            <div className="text-dark-600 text-sm mt-1">Try adjusting your filters or run a monitoring scan</div>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Severity</th>
                <th>Error / Bank</th>
                <th>Code</th>
                <th>Type</th>
                <th>Affected</th>
                <th>Detected</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {errors.map((error, i) => (
                <motion.tr key={error.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  onClick={() => window.location.href = `/errors/${error.id}`}
                  className="group">
                  <td>
                    <div className="flex flex-col gap-1">
                      <span className={severityBadge(error.severity)}>
                        {error.severity?.toUpperCase()}
                      </span>
                      <SeverityBar severity={error.severity} />
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="font-medium text-white text-sm group-hover:text-brand-300 transition-colors line-clamp-1">
                        {error.title}
                      </div>
                      <div className="text-xs text-dark-500 mt-0.5">{error.bank_name}</div>
                    </div>
                  </td>
                  <td>
                    <code className="text-xs bg-dark-800 px-2 py-0.5 rounded text-brand-300">
                      {error.error_code || 'N/A'}
                    </code>
                  </td>
                  <td>
                    <span className="text-sm">
                      {errorTypeIcon(error.type)} {error.type?.replace(/_/g, ' ') || 'unknown'}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm font-semibold text-dark-200">{formatNumber(error.affected_count)}</span>
                  </td>
                  <td>
                    <span className="text-xs text-dark-400">{formatRelative(error.detected_at)}</span>
                  </td>
                  <td>
                    <span className={statusBadge(error.status)}>{error.status}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                      <button id={`analyze-${error.id}`}
                        disabled={actionLoading[error.id + '_analyze'] || !!error.analysis_id}
                        onClick={(e) => handleAnalyze(error.id, e)}
                        className={`p-1.5 rounded-lg transition-all ${error.analysis_id ? 'bg-purple-500/15 text-purple-400' : 'bg-white/[0.04] text-dark-400 hover:text-purple-400 hover:bg-purple-500/10'}`}
                        title={error.analysis_id ? 'Analyzed' : 'Run AI Analysis'}>
                        <Brain size={13} className={actionLoading[error.id + '_analyze'] ? 'animate-spin' : ''} />
                      </button>
                      <button id={`gen-article-${error.id}`}
                        disabled={actionLoading[error.id + '_article'] || !!error.article_id}
                        onClick={(e) => handleGenArticle(error.id, e)}
                        className={`p-1.5 rounded-lg transition-all ${error.article_id ? 'bg-brand-500/15 text-brand-400' : 'bg-white/[0.04] text-dark-400 hover:text-brand-400 hover:bg-brand-500/10'}`}
                        title={error.article_id ? 'Article exists' : 'Generate Article'}>
                        <FileText size={13} className={actionLoading[error.id + '_article'] ? 'animate-spin' : ''} />
                      </button>
                      <button
                        onClick={(e) => handleResolve(error.id, error.status, e)}
                        className={`p-1.5 rounded-lg transition-all ${error.status === 'resolved' ? 'bg-green-500/15 text-green-400' : 'bg-white/[0.04] text-dark-400 hover:text-green-400 hover:bg-green-500/10'}`}
                        title={error.status === 'resolved' ? 'Mark Active' : 'Mark Resolved'}>
                        ✓
                      </button>
                      <Link to={`/errors/${error.id}`} onClick={e => e.stopPropagation()}
                        className="p-1.5 rounded-lg bg-white/[0.04] text-dark-400 hover:text-dark-100 hover:bg-white/[0.08] transition-all">
                        <ChevronRight size={13} />
                      </Link>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
        
        {/* Pagination */}
        {total > LIMIT && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.05]">
            <span className="text-sm text-dark-400">
              Showing {page * LIMIT + 1}–{Math.min((page + 1) * LIMIT, total)} of {total}
            </span>
            <div className="flex items-center gap-2">
              <button className="btn-ghost text-xs" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</button>
              <button className="btn-ghost text-xs" disabled={(page + 1) * LIMIT >= total} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {toast && <ActionToast {...toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
