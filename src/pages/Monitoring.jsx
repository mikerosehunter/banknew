import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radio, Play, CheckCircle, XCircle, Clock, Zap, BarChart2 } from 'lucide-react';
import { getMonitoringRuns, getMonitoringStats, triggerMonitoring } from '../lib/api';
import { formatRelative, formatDate } from '../lib/utils';

export default function Monitoring() {
  const [runs, setRuns] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [toast, setToast] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [runData, statsData] = await Promise.all([getMonitoringRuns(), getMonitoringStats()]);
      setRuns(runData.runs || []);
      setStats(statsData);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleTrigger = async () => {
    setTriggering(true);
    try {
      await triggerMonitoring();
      setToast({ msg: 'Monitoring run started! Check back in 30 seconds.', type: 'success' });
      setTimeout(() => { setToast(null); load(); }, 5000);
    } catch (e) {
      setToast({ msg: 'Failed to start run.', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setTimeout(() => setTriggering(false), 2000);
    }
  };

  const statusIcon = (status) => {
    if (status === 'completed') return <CheckCircle size={14} className="text-green-400" />;
    if (status === 'failed') return <XCircle size={14} className="text-red-400" />;
    return <Clock size={14} className="text-yellow-400 animate-spin" />;
  };

  const statusClass = (status) => {
    if (status === 'completed') return 'text-green-400';
    if (status === 'failed') return 'text-red-400';
    return 'text-yellow-400';
  };

  return (
    <div className="p-8 space-y-6">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total Runs', value: stats.totalRuns, color: 'text-brand-400' },
            { label: 'Successful', value: stats.successfulRuns, color: 'text-green-400' },
            { label: 'Failed', value: stats.failedRuns, color: 'text-red-400' },
            { label: 'Errors Found', value: stats.totalErrorsFound, color: 'text-orange-400' },
            { label: 'Avg Duration', value: stats.avgDuration > 0 ? `${(stats.avgDuration / 1000).toFixed(1)}s` : 'N/A', color: 'text-purple-400' },
            { label: 'Last 24h Runs', value: stats.last24hRuns, color: 'text-cyan-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="kpi-card">
              <div className="text-xs text-dark-500">{label}</div>
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Radio size={16} className="text-green-400 animate-pulse" />
          <span className="text-sm text-dark-300">Monitoring runs every <span className="text-white font-semibold">30 minutes</span> automatically</span>
        </div>
        <button id="trigger-manual-monitoring" onClick={handleTrigger} disabled={triggering} className="btn-primary">
          <Play size={14} className={triggering ? 'animate-spin' : ''} />
          {triggering ? 'Starting...' : 'Run Now'}
        </button>
      </div>

      {/* Cron schedule info */}
      <div className="glass-card p-6">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Zap size={15} className="text-yellow-400" />Schedule Configuration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { job: 'Bank Monitoring Crawler', schedule: 'Every 30 minutes', cron: '*/30 * * * *', status: 'active', color: 'green' },
            { job: 'Auto Article Generation', schedule: 'Every hour', cron: '0 * * * *', status: 'active', color: 'green' },
          ].map(({ job, schedule, cron, status, color }) => (
            <div key={job} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{job}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${color === 'green' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                  {status}
                </span>
              </div>
              <div className="text-xs text-dark-400">{schedule}</div>
              <code className="text-[10px] text-dark-600 mt-1 block">{cron}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Runs table */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.05]">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <BarChart2 size={15} className="text-dark-400" />
            Recent Monitoring Runs
          </h2>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => <div key={i} className="h-12 skeleton rounded-xl" />)}
          </div>
        ) : runs.length === 0 ? (
          <div className="p-12 text-center">
            <Radio size={36} className="mx-auto mb-3 text-dark-600" />
            <p className="text-dark-400 text-sm">No monitoring runs yet. Click "Run Now" to start.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Bank</th>
                <th>Errors Found</th>
                <th>Duration</th>
                <th>Started</th>
                <th>Completed</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run, i) => (
                <motion.tr key={run.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <td>
                    <div className="flex items-center gap-2">
                      {statusIcon(run.status)}
                      <span className={`text-xs font-medium ${statusClass(run.status)}`}>{run.status}</span>
                    </div>
                  </td>
                  <td><span className="text-sm text-dark-300">{run.bank_name || 'All Banks'}</span></td>
                  <td>
                    <span className={`text-sm font-semibold ${run.errors_found > 0 ? 'text-orange-400' : 'text-dark-400'}`}>
                      {run.errors_found || 0}
                    </span>
                  </td>
                  <td><span className="text-sm text-dark-400">{run.duration_ms ? `${(run.duration_ms / 1000).toFixed(1)}s` : '—'}</span></td>
                  <td><span className="text-xs text-dark-500">{formatRelative(run.started_at)}</span></td>
                  <td><span className="text-xs text-dark-500">{run.completed_at ? formatRelative(run.completed_at) : '—'}</span></td>
                  <td><span className="text-xs px-2 py-0.5 rounded bg-white/[0.04] text-dark-400">{run.run_type}</span></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {toast && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl border text-sm font-medium ${
            toast.type === 'success' ? 'bg-green-900/80 border-green-500/30 text-green-300' : 'bg-red-900/80 border-red-500/30 text-red-300'
          }`} style={{ backdropFilter: 'blur(20px)' }}>
          {toast.msg}
        </motion.div>
      )}
    </div>
  );
}
