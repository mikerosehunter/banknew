import { supabase } from '../../lib/supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { severity, type, status, bank_id, search, limit = 20, offset = 0 } = req.query;

    let query = supabase
      .from('bw_errors')
      .select('*, bw_banks(name, category)', { count: 'exact' })
      .order('detected_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (severity) query = query.eq('severity', severity);
    if (type) query = query.eq('type', type);
    if (status) query = query.eq('status', status);
    if (bank_id) query = query.eq('bank_id', bank_id);
    if (search) query = query.ilike('title', `%${search}%`);

    const { data, count, error } = await query;
    if (error) throw error;

    const errors = (data || []).map(e => ({
      ...e,
      bank_name: e.bw_banks?.name,
      bank_category: e.bw_banks?.category,
      bw_banks: undefined,
    }));

    res.json({ errors, total: count || 0 });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
