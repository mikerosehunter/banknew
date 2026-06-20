import { supabase } from '../lib/supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const [
      { count: bankTotal },
      { data: banksByCategory },
      { count: errorTotal },
      { count: criticalCount },
      { count: highCount },
      { count: activeCount },
      { count: last24hCount },
      { count: last7dCount },
      { count: articleTotal },
      { count: publishedCount },
      { data: avgSeoData },
      { data: monitoringData },
      { data: recentErrors },
      { data: topBanks },
      { data: recentArticles },
      { data: last30dErrors },
    ] = await Promise.all([
      supabase.from('bw_banks').select('*', { count: 'exact', head: true }),
      supabase.from('bw_banks').select('category'),
      supabase.from('bw_errors').select('*', { count: 'exact', head: true }),
      supabase.from('bw_errors').select('*', { count: 'exact', head: true }).eq('severity', 'critical'),
      supabase.from('bw_errors').select('*', { count: 'exact', head: true }).eq('severity', 'high'),
      supabase.from('bw_errors').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('bw_errors').select('*', { count: 'exact', head: true }).gte('detected_at', new Date(Date.now() - 86400000).toISOString()),
      supabase.from('bw_errors').select('*', { count: 'exact', head: true }).gte('detected_at', new Date(Date.now() - 7 * 86400000).toISOString()),
      supabase.from('bw_articles').select('*', { count: 'exact', head: true }),
      supabase.from('bw_articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('bw_articles').select('seo_score'),
      supabase.from('bw_monitoring_runs').select('started_at, errors_found').order('started_at', { ascending: false }).limit(1),
      supabase.from('bw_errors').select('id, title, severity, type, detected_at, error_code, affected_count, bw_banks(name)').order('detected_at', { ascending: false }).limit(10),
      supabase.from('bw_errors').select('id, title, severity, affected_count, type, bw_banks(name)').order('affected_count', { ascending: false }).limit(5),
      supabase.from('bw_articles').select('id, title, slug, seo_score, word_count, status, created_at, bw_banks(name)').order('created_at', { ascending: false }).limit(5),
      supabase.from('bw_errors').select('detected_at, severity').gte('detected_at', new Date(Date.now() - 30 * 86400000).toISOString()),
    ]);

    // Category breakdown
    const catMap = {};
    for (const b of banksByCategory || []) {
      catMap[b.category] = (catMap[b.category] || 0) + 1;
    }
    const byCategory = Object.entries(catMap).map(([category, count]) => ({ category, count }));

    // SEO average
    const seoScores = (avgSeoData || []).map(a => a.seo_score).filter(Boolean);
    const avgSeoScore = seoScores.length ? Math.round(seoScores.reduce((a, b) => a + b, 0) / seoScores.length) : 0;

    // Errors by day
    const dayMap = {};
    for (const e of last30dErrors || []) {
      const day = e.detected_at.substring(0, 10);
      if (!dayMap[day]) dayMap[day] = { date: day, count: 0, critical: 0, high: 0 };
      dayMap[day].count++;
      if (e.severity === 'critical') dayMap[day].critical++;
      if (e.severity === 'high') dayMap[day].high++;
    }
    const errorsByDay = Object.values(dayMap).sort((a, b) => a.date.localeCompare(b.date));

    // Top banks by error count
    const bankErrorMap = {};
    for (const e of last30dErrors || []) {
      // We don't have bank name here — use a separate query result
    }

    res.json({
      banks: { total: bankTotal || 0, byCategory },
      errors: { total: errorTotal || 0, critical: criticalCount || 0, high: highCount || 0, active: activeCount || 0, last24h: last24hCount || 0, last7d: last7dCount || 0 },
      articles: { total: articleTotal || 0, published: publishedCount || 0, avgSeoScore },
      monitoring: { totalRuns: 1, lastRun: monitoringData?.[0]?.started_at || null },
      recentErrors: (recentErrors || []).map(e => ({ ...e, bank_name: e.bw_banks?.name, bw_banks: undefined })),
      trendingErrors: (topBanks || []).map(e => ({ ...e, bank_name: e.bw_banks?.name, bw_banks: undefined })),
      recentArticles: (recentArticles || []).map(a => ({ ...a, bank_name: a.bw_banks?.name, bw_banks: undefined })),
      errorsByDay,
      topBanks: [],
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
