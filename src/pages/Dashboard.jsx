import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  AlertTriangle, TrendingUp, FileText, Building2, Clock,
  Shield, Zap, Activity, Eye, ChevronRight, RefreshCw,
  ArrowUpRight, ArrowDownRight, Minus, Flame,
} from 'lucide-react';
import { getDashboard } from '../lib/api';
import {
  formatRelative, formatNumber, errorTypeIcon, severityBadge,
  seoScoreColor, statusBadge,
} from '../lib/utils';

const COLORS = {
  critical: '#ef4444',
  high:     '#f97316',
  medium:   '#eab308',
  low:      '#10b981',
  total:    '#3b82f6',
  resolved: '#10b981',
  brand:    '#3b82f6',
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const cardVariants = {
  hidden:  { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 min-w-[140px] text-xs">
      <p className="text-dark-400 mb-2 font-medium">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entry.color }} />
          <span className="text-dark-300 capitalize">{entry.name}:</span>
          <span className="text-dark-100 font-semibold ml-auto pl-2">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="glass-card p-3 text-xs">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: payload[0].payload.fill }} />
        <span className="text-dark-300 capitalize font-medium">{name}</span>
        <span className="text-dark-100 font-bold ml-2">{value}</span>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="skeleton h-8 w-56 rounded-xl mb-2" />
          <div className="skeleton h-4 w-80 rounded-lg" />
        </div>
        <div className="skeleton h-10 w-36 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="kpi-card">
            <div className="skeleton h-9 w-9 rounded-xl" />
            <div className="skeleton h-8 w-16 rounded-lg" />
            <div className="skeleton h-3 w-24 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 h-64 skeleton" />
        <div className="glass-card p-6 h-64 skeleton" />
      </div>
      <div className="glass-card p-6 h-72 skeleton" />
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-400" />
      </div>
      <h2 className="text-xl font-bold text-dark-100 mb-2">Failed to load dashboard</h2>
      <p className="text-dark-400 text-sm mb-6">Could not connect to the API. Make sure the server is running.</p>
      <button onClick={onRetry} className="btn-primary gap-2">
        <RefreshCw className="w-4 h-4" /> Retry
      </button>
    </div>
  );
}

function KpiCard({ icon: Icon, iconBg, iconColor, glowClass, label, value, subtitle, change }) {
  const isPositive = change > 0;
  const isNeutral  = change === 0 || change === null || change === undefined;
  return (
    <motion.div variants={cardVariants} className="kpi-card group relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-24 h-24 rounded-full blur-2xl opacity-20 ${iconBg}`} />
      <div className="flex items-start justify-between relative">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg} ${glowClass}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {change !== undefined && change !== null && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${isNeutral ? 'text-dark-400 bg-white/[0.04]' : isPositive ? 'text-red-400 bg-red-500/10' : 'text-green-400 bg-green-500/10'}`}>
            {isNeutral ? <Minus className="w-3 h-3" /> : isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="relative">
        <div className="text-3xl font-black tracking-tight"
          style={{ background: 'linear-gradient(135deg, #f8fafc 30%, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {value}
        </div>
        <div className="text-xs font-semibold text-dark-300 mt-0.5 uppercase tracking-wider">{label}</div>
        {subtitle && <div className="text-xs text-dark-500 mt-1">{subtitle}</div>}
      </div>
    </motion.div>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-base font-bold text-dark-100">{title}</h2>
        {subtitle && <p className="text-xs text-dark-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function SeverityRow({ label, value, total, color }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
      <span className="text-dark-300 text-xs capitalize flex-1">{label}</span>
      <span className="text-dark-100 text-xs font-bold">{value}</span>
      <div className="w-20 bg-white/[0.06] rounded-full h-1.5">
        <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-dark-500 text-xs w-8 text-right">{pct}%</span>
    </div>
  );
}

function TrendingCard({ error, rank }) {
  const rankColors  = ['text-yellow-400', 'text-slate-300', 'text-orange-600', 'text-dark-400', 'text-dark-500'];
  const flameColors = ['text-yellow-400', 'text-orange-400', 'text-orange-500', 'text-red-400', 'text-red-600'];
  return (
    <motion.div variants={cardVariants}>
      <Link to={`/errors/${error.id}`}
        className="glass-card p-4 flex items-start gap-3 hover:border-white/[0.15] group transition-all block">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
          <Flame className={`w-4 h-4 ${flameColors[rank - 1] || 'text-dark-500'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-black tabular-nums ${rankColors[rank - 1] || 'text-dark-500'}`}>#{rank}</span>
            <span className={severityBadge(error.severity)}>{error.severity}</span>
          </div>
          <p className="text-sm font-semibold text-dark-100 group-hover:text-white transition-colors leading-snug truncate">{error.title}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-dark-500">{errorTypeIcon(error.type)} {error.type}</span>
            <span className="text-dark-700">·</span>
            <Building2 className="w-3 h-3 text-dark-600" />
            <span className="text-xs text-dark-500 truncate">{error.bank_name}</span>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="text-sm font-bold text-dark-200">{formatNumber(error.affected_count)}</div>
          <div className="text-xs text-dark-600">affected</div>
        </div>
      </Link>
    </motion.div>
  );
}

function ArticleCard({ article }) {
  return (
    <motion.div variants={cardVariants}>
      <Link to={`/articles/${article.id}`}
        className="glass-card p-4 flex items-start gap-4 hover:border-white/[0.15] group transition-all block">
        <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-brand-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={statusBadge(article.status)}>{article.status}</span>
            {article.seo_score > 0 && (
              <span className={`text-xs font-semibold ${seoScoreColor(article.seo_score)}`}>SEO {article.seo_score}</span>
            )}
          </div>
          <p className="text-sm font-semibold text-dark-100 group-hover:text-white transition-colors leading-snug line-clamp-2">{article.title}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <Building2 className="w-3 h-3 text-dark-600" />
            <span className="text-xs text-dark-500">{article.bank_name}</span>
            {article.word_count > 0 && (
              <><span className="text-dark-700">·</span><span className="text-xs text-dark-500">{formatNumber(article.word_count)} words</span></>
            )}
            <span className="text-dark-700 ml-auto">·</span>
            <span className="text-xs text-dark-500">{formatRelative(article.created_at)}</span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-dark-600 group-hover:text-dark-300 transition-colors flex-shrink-0 mt-1" />
      </Link>
    </motion.div>
  );
}

export default function Dashboard() {
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(false);
    getDashboard()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  if (loading) return <LoadingSkeleton />;
  if (error || !data) return <ErrorState onRetry={() => setRefreshKey(k => k + 1)} />;

  const { banks, errors, articles, monitoring, recentErrors, trendingErrors, errorsByDay, topBanks, recentArticles } = data;

  const severityPieData = [
    { name: 'critical', value: errors.critical || 0,                                                    fill: COLORS.critical },
    { name: 'high',     value: errors.high || 0,                                                        fill: COLORS.high     },
    { name: 'medium',   value: Math.max(0, (errors.total || 0) - (errors.critical || 0) - (errors.high || 0)), fill: COLORS.medium   },
  ].filter(d => d.value > 0);

  const totalSeverity = severityPieData.reduce((s, d) => s + d.value, 0);

  const chartData = (errorsByDay || []).map(d => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  const bankData = (topBanks || []).slice(0, 8).map(b => ({
    ...b,
    shortName: b.name.length > 14 ? b.name.slice(0, 13) + '\u2026' : b.name,
  }));

  const kpiCards = [
    { icon: AlertTriangle, label: 'Total Errors',    value: formatNumber(errors.total    || 0), subtitle: `${errors.last24h || 0} in last 24h`,           iconBg: 'bg-red-500/15',    iconColor: 'text-red-400',    glowClass: 'glow-red'   },
    { icon: Shield,        label: 'Critical Errors', value: formatNumber(errors.critical || 0), subtitle: `${errors.high || 0} high severity`,             iconBg: 'bg-orange-500/15', iconColor: 'text-orange-400', glowClass: ''           },
    { icon: Zap,           label: 'Active Issues',   value: formatNumber(errors.active   || 0), subtitle: `${errors.last7d || 0} in last 7d`,              iconBg: 'bg-yellow-500/15', iconColor: 'text-yellow-400', glowClass: ''           },
    { icon: FileText,      label: 'Articles',        value: formatNumber(articles.total  || 0), subtitle: `${articles.published || 0} published`,          iconBg: 'bg-brand-500/15',  iconColor: 'text-brand-400',  glowClass: 'glow-blue'  },
    { icon: Building2,     label: 'Banks Monitored', value: formatNumber(banks.total     || 0), subtitle: `${(banks.byCategory || []).length} categories`, iconBg: 'bg-purple-500/15', iconColor: 'text-purple-400', glowClass: ''           },
    { icon: Clock,         label: 'Last Scan',       value: monitoring.lastRun ? formatRelative(monitoring.lastRun) : 'Never', subtitle: `${formatNumber(monitoring.totalRuns || 0)} total runs`, iconBg: 'bg-green-500/15', iconColor: 'text-green-400', glowClass: 'glow-green' },
  ];

  return (
    <div className="p-8 space-y-8 min-h-screen">

      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark-100 tracking-tight flex items-center gap-3">
            <span className="live-pulse inline-block w-2.5 h-2.5 rounded-full bg-red-500" />
            BankWatch Dashboard
          </h1>
          <p className="text-sm text-dark-400 mt-1">
            Real-time monitoring across {banks.total} financial institutions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setRefreshKey(k => k + 1)} className="btn-ghost">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <Link to="/errors" className="btn-primary">
            <Activity className="w-4 h-4" /> View All Errors
          </Link>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div initial="hidden" animate="visible" variants={containerVariants}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map((card, i) => <KpiCard key={i} {...card} />)}
      </motion.div>

      {/* Area Chart + Pie Chart */}
      <motion.div initial="hidden" animate="visible" variants={containerVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Area Chart */}
        <motion.div variants={cardVariants} className="lg:col-span-2 glass-card p-6">
          <SectionHeader
            title="Error Trends — Last 30 Days"
            subtitle="Daily breakdown by severity"
            action={
              <div className="flex items-center gap-4 text-xs">
                {[['Total', COLORS.total], ['Critical', COLORS.critical], ['High', COLORS.high]].map(([lbl, color]) => (
                  <span key={lbl} className="flex items-center gap-1.5 text-dark-400">
                    <span className="w-3 h-0.5 rounded-full inline-block" style={{ background: color }} />
                    {lbl}
                  </span>
                ))}
              </div>
            }
          />
          {chartData.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-dark-500 text-sm">No trend data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradTotal"    x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={COLORS.total}    stopOpacity={0.30} />
                    <stop offset="95%" stopColor={COLORS.total}    stopOpacity={0}    />
                  </linearGradient>
                  <linearGradient id="gradCritical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={COLORS.critical} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={COLORS.critical} stopOpacity={0}    />
                  </linearGradient>
                  <linearGradient id="gradHigh"     x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={COLORS.high}     stopOpacity={0.20} />
                    <stop offset="95%" stopColor={COLORS.high}     stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<DarkTooltip />} />
                <Area type="monotone" dataKey="count"    name="Total"    stroke={COLORS.total}    fill="url(#gradTotal)"    strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="critical" name="Critical" stroke={COLORS.critical} fill="url(#gradCritical)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="high"     name="High"     stroke={COLORS.high}     fill="url(#gradHigh)"     strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Pie Chart */}
        <motion.div variants={cardVariants} className="glass-card p-6">
          <SectionHeader title="By Severity" subtitle="Error distribution" />
          {severityPieData.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-dark-500 text-sm">No data yet</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={severityPieData} cx="50%" cy="50%"
                    innerRadius={45} outerRadius={72} paddingAngle={3}
                    dataKey="value" nameKey="name" strokeWidth={0}>
                    {severityPieData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} opacity={0.9} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2.5 mt-2">
                {severityPieData.map(d => (
                  <SeverityRow key={d.name} label={d.name} value={d.value} total={totalSeverity} color={d.fill} />
                ))}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Bar Chart */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        className="glass-card p-6">
        <SectionHeader
          title="Top Banks by Error Count"
          subtitle="Institutions with highest error frequency"
          action={
            <Link to="/banks" className="btn-ghost text-xs py-1.5">
              <Building2 className="w-3.5 h-3.5" /> All Banks
            </Link>
          }
        />
        {bankData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-dark-500 text-sm">No bank data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={bankData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal vertical={false} />
              <XAxis dataKey="shortName" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="error_count" name="Errors" radius={[6, 6, 0, 0]}>
                {bankData.map((_, i) => (
                  <Cell key={i}
                    fill={i === 0 ? COLORS.critical : i === 1 ? COLORS.high : COLORS.brand}
                    opacity={1 - i * 0.06} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Trending + Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Trending Errors */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}
          className="space-y-3">
          <SectionHeader
            title="🔥 Trending Errors"
            subtitle="Top 5 by affected user count"
            action={
              <Link to="/errors?sort=affected" className="btn-ghost text-xs py-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> See All
              </Link>
            }
          />
          {(trendingErrors || []).length === 0 ? (
            <div className="glass-card p-6 text-center text-dark-500 text-sm">No trending errors</div>
          ) : (
            (trendingErrors || []).slice(0, 5).map((err, i) => (
              <TrendingCard key={err.id} error={err} rank={i + 1} />
            ))
          )}
        </motion.div>

        {/* Recent Articles */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}
          className="space-y-3">
          <SectionHeader
            title="Recent Articles"
            subtitle="Latest AI-generated content"
            action={
              <Link to="/articles" className="btn-ghost text-xs py-1.5">
                <FileText className="w-3.5 h-3.5" /> All Articles
              </Link>
            }
          />
          {(recentArticles || []).length === 0 ? (
            <div className="glass-card p-6 text-center text-dark-500 text-sm">
              No articles generated yet.{' '}
              <Link to="/errors" className="text-brand-400 hover:text-brand-300 underline">Generate from an error.</Link>
            </div>
          ) : (
            (recentArticles || []).slice(0, 5).map(article => (
              <ArticleCard key={article.id} article={article} />
            ))
          )}
        </motion.div>
      </div>

      {/* Recent Errors Table */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        className="glass-card overflow-hidden">
        <div className="px-6 py-5 border-b border-white/[0.05] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-dark-100">Recent Errors</h2>
            <p className="text-xs text-dark-500 mt-0.5">Last 10 detected issues across all banks</p>
          </div>
          <Link to="/errors" className="btn-ghost text-xs py-1.5">
            <Eye className="w-3.5 h-3.5" /> View All
          </Link>
        </div>

        {(recentErrors || []).length === 0 ? (
          <div className="p-12 text-center text-dark-500 text-sm">No errors detected yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bank</th>
                  <th>Error</th>
                  <th>Severity</th>
                  <th>Type</th>
                  <th>Affected</th>
                  <th>Detected</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {(recentErrors || []).slice(0, 10).map((err, i) => (
                    <motion.tr
                      key={err.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                      className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors cursor-pointer group"
                      onClick={() => { window.location.href = `/errors/${err.id}`; }}
                    >
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-3.5 h-3.5 text-brand-400" />
                          </div>
                          <span className="font-medium text-dark-200 text-sm whitespace-nowrap">{err.bank_name || '—'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="max-w-xs">
                          <Link to={`/errors/${err.id}`}
                            className="font-semibold text-dark-100 hover:text-white transition-colors line-clamp-1 group-hover:underline underline-offset-2"
                            onClick={e => e.stopPropagation()}>
                            {err.title}
                          </Link>
                          {err.error_code && <span className="text-xs text-dark-600 font-mono">{err.error_code}</span>}
                        </div>
                      </td>
                      <td>
                        <span className={severityBadge(err.severity)}>
                          <span className={`w-1.5 h-1.5 rounded-full inline-block ${
                            err.severity === 'critical' ? 'bg-red-400' :
                            err.severity === 'high'     ? 'bg-orange-400' :
                            err.severity === 'medium'   ? 'bg-yellow-400' : 'bg-green-400'}`} />
                          {err.severity}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm text-dark-400">
                          {errorTypeIcon(err.type)}{' '}
                          <span className="text-dark-500 capitalize">{(err.type || '').replace(/_/g, ' ') || '—'}</span>
                        </span>
                      </td>
                      <td>
                        <span className="font-semibold text-dark-200">{err.affected_count ? formatNumber(err.affected_count) : '—'}</span>
                      </td>
                      <td>
                        <span className="text-dark-500 text-xs whitespace-nowrap">{formatRelative(err.detected_at)}</span>
                      </td>
                      <td>
                        <Link to={`/errors/${err.id}`}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={e => e.stopPropagation()}>
                          <ChevronRight className="w-4 h-4 text-dark-400" />
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <div className="h-4" />
    </div>
  );
}
