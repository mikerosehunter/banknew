import { generateArticle } from '../../../lib/contentGenerator.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const article = await generateArticle(req.query.id);
    res.json(article);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
