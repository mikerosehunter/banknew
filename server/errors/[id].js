import { supabase } from '../../lib/supabase.js';
import { analyzeError } from '../../lib/aiAnalysis.js';
import { generateArticle } from '../../lib/contentGenerator.js';
import { generateErrorImage } from '../../lib/imageGenerator.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  try {
    if (req.method === 'GET') {
      const { data: error, error: e } = await supabase
        .from('bw_errors')
        .select('*, bw_banks(name, website, login_url, support_url, category), bw_ai_analyses(*), bw_articles(id, slug, seo_score, status), bw_generated_images(url)')
        .eq('id', id)
        .single();
      if (e) return res.status(404).json({ error: 'Error not found' });

      const enriched = {
        ...error,
        bank_name: error.bw_banks?.name,
        bank_website: error.bw_banks?.website,
        analysis: error.bw_ai_analyses?.[0] || null,
        article: error.bw_articles?.[0] || null,
        image: error.bw_generated_images?.[0] || null,
        solutions_parsed: (() => {
          try { return JSON.parse(error.bw_ai_analyses?.[0]?.solutions || '[]'); } catch { return []; }
        })(),
      };
      return res.json(enriched);
    }

    if (req.method === 'PATCH') {
      const { status } = req.body;
      if (!status) return res.status(400).json({ error: 'status required' });
      const { data, error: e } = await supabase
        .from('bw_errors')
        .update({ status, resolved_at: status === 'resolved' ? new Date().toISOString() : null })
        .eq('id', id)
        .select()
        .single();
      if (e) throw e;
      return res.json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
