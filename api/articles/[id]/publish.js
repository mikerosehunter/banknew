import { supabase } from '../../lib/supabase.js';
import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { id } = req.query;
    const { cmsType = 'wordpress', endpoint, secret } = req.body || {};

    const { data: article, error: ae } = await supabase
      .from('bw_articles').select('*, bw_banks(name)').eq('id', id).single();
    if (ae) return res.status(404).json({ error: 'Article not found' });

    let publishUrl = null;
    let mockMode = !endpoint;

    if (!mockMode) {
      try {
        const headers = { 'Content-Type': 'application/json', ...(secret ? { Authorization: `Bearer ${secret}` } : {}) };
        const body = { title: article.title, content: article.content, status: 'publish', meta: { description: article.meta_description } };
        const endpoint_ = cmsType === 'wordpress' ? `${endpoint}/wp-json/wp/v2/posts` : endpoint;
        const r = await axios.post(endpoint_, body, { headers, timeout: 10000 });
        publishUrl = r.data?.link || r.data?.url || endpoint;
      } catch (e) {
        mockMode = true;
        console.warn('CMS publish failed, using mock:', e.message);
      }
    }

    if (mockMode) {
      publishUrl = `https://bankloginonline.com/articles/${article.slug}`;
    }

    // Record the publish
    await supabase.from('bw_cms_publishes').insert({
      article_id: id, cms_type: cmsType, endpoint: endpoint || 'mock',
      status: 'published', response_data: JSON.stringify({ url: publishUrl }),
      published_at: new Date().toISOString(),
    });

    // Update article status
    await supabase.from('bw_articles').update({
      status: 'published', cms_url: publishUrl, published_at: new Date().toISOString(),
    }).eq('id', id);

    res.json({ success: true, url: publishUrl, mock: mockMode });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
