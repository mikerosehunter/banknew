import { supabase } from '../../lib/supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { category, search, limit = 50, offset = 0 } = req.query;

    let query = supabase.from('bw_banks')
      .select('*, bw_errors(id), bw_articles(id)')
      .order('assets_billions', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (category) query = query.eq('category', category);
    if (search) query = query.ilike('name', `%${search}%`);

    const { data: banks, error } = await query;
    if (error) throw error;

    const { count } = await supabase.from('bw_banks').select('*', { count: 'exact', head: true });

    const enriched = (banks || []).map(b => ({
      ...b,
      error_count: b.bw_errors?.length || 0,
      article_count: b.bw_articles?.length || 0,
      bw_errors: undefined,
      bw_articles: undefined,
    }));

    res.json({ banks: enriched, total: count || 0 });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
