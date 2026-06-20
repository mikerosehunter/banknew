import { supabase } from '../../lib/supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { data: runs, error } = await supabase
      .from('bw_monitoring_runs')
      .select('*, bw_banks(name)')
      .order('started_at', { ascending: false })
      .limit(50);
    if (error) throw error;

    const enriched = (runs || []).map(r => ({ ...r, bank_name: r.bw_banks?.name, bw_banks: undefined }));

    // Compute stats
    const total = enriched.length;
    const successful = enriched.filter(r => r.status === 'completed').length;
    const failed = enriched.filter(r => r.status === 'failed').length;
    const totalErrorsFound = enriched.reduce((s, r) => s + (r.errors_found || 0), 0);
    const durations = enriched.filter(r => r.duration_ms).map(r => r.duration_ms);
    const avgDuration = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;
    const yesterday = new Date(Date.now() - 86400000).toISOString();
    const last24hRuns = enriched.filter(r => r.started_at > yesterday).length;

    res.json({
      runs: enriched,
      stats: { totalRuns: total, successfulRuns: successful, failedRuns: failed, totalErrorsFound, avgDuration, last24hRuns },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
