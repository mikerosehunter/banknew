import { generateBulkArticles } from '../../lib/contentGenerator.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const limit = Number(req.query.limit || req.body?.limit || 5);
    const results = await generateBulkArticles(limit);
    const success = results.filter(r => r.success).length;
    res.json({ success, failed: results.length - success, results });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
