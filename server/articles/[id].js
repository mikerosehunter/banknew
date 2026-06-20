import { supabase } from '../../lib/supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { id } = req.query;
    // Accept both UUID and slug
    const isUuid = /^[0-9a-f-]{36}$/.test(id);
    let query = supabase
      .from('bw_articles')
      .select('*, bw_banks(name, website), bw_errors(title, error_code, severity, type)');

    query = isUuid ? query.eq('id', id) : query.eq('slug', id);
    const { data, error } = await query.single();
    if (error) return res.status(404).json({ error: 'Article not found' });

    res.json({
      ...data,
      bank_name: data.bw_banks?.name,
      error_title: data.bw_errors?.title,
      error_code: data.bw_errors?.error_code || data.error_code,
      keywords_parsed: (() => { try { return JSON.parse(data.keywords || '[]'); } catch { return []; } })(),
      faq_schema_parsed: (() => { try { return JSON.parse(data.faq_schema || 'null'); } catch { return null; } })(),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
