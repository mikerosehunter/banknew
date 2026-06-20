import { supabase } from '../../lib/supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { status, limit = 20, offset = 0 } = req.query;

    let query = supabase
      .from('bw_articles')
      .select('*, bw_banks(name)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (status) query = query.eq('status', status);

    const { data, count, error } = await query;
    if (error) throw error;

    const articles = (data || []).map(a => ({
      ...a,
      bank_name: a.bw_banks?.name,
      bw_banks: undefined,
      // Parse JSON fields for convenience
      keywords_parsed: (() => { try { return JSON.parse(a.keywords || '[]'); } catch { return []; } })(),
      faq_schema_parsed: (() => { try { return JSON.parse(a.faq_schema || 'null'); } catch { return null; } })(),
    }));

    res.json({ articles, total: count || 0 });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
