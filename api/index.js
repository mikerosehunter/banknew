import express from 'express';
import cors from 'cors';
import { supabase } from '../lib/supabase.js';
import { analyzeError } from '../lib/aiAnalysis.js';
import { generateArticle, generateBulkArticles } from '../lib/contentGenerator.js';
import { generateErrorImage } from '../lib/imageGenerator.js';
import { runFullMonitoring } from '../lib/monitoringEngine.js';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

const wrap = (handler) => async (req, res) => {
  req.query = { ...req.query, ...req.params };
  return handler(req, res);
};

// dashboard
async function handler_0(req, res) {
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

// banks/index
async function handler_1(req, res) {
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

// errors/index
async function handler_2(req, res) {
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

// errors/[id]
async function handler_3(req, res) {
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

// errors/[id]/analyze
async function handler_4(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const analysis = await analyzeError(req.query.id);
    res.json(analysis);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

// errors/[id]/generate-article
async function handler_5(req, res) {
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

// errors/[id]/generate-image
async function handler_6(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const image = await generateErrorImage(req.query.id);
    res.json(image);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

// articles/index
async function handler_7(req, res) {
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

// articles/[id]
async function handler_8(req, res) {
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

// articles/generate-bulk
async function handler_9(req, res) {
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

// articles/[id]/publish
async function handler_10(req, res) {
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

// monitoring/run
async function handler_11(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { bankId } = req.body || {};
    // Run non-blocking — respond immediately, let it run in background
    runFullMonitoring({ bankId }).catch(console.error);
    res.json({ success: true, message: 'Monitoring run started' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

// monitoring/runs
async function handler_12(req, res) {
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


app.get('/api/dashboard', wrap(handler_0));
app.get('/api/banks', wrap(handler_1));

app.get('/api/errors', wrap(handler_2));
app.get('/api/errors/:id', wrap(handler_3));
app.patch('/api/errors/:id', wrap(handler_3));
app.post('/api/errors/:id/analyze', wrap(handler_4));
app.post('/api/errors/:id/generate-article', wrap(handler_5));
app.post('/api/errors/:id/generate-image', wrap(handler_6));

app.get('/api/articles', wrap(handler_7));
app.get('/api/articles/:id', wrap(handler_8));
app.post('/api/articles/generate-bulk', wrap(handler_9));
app.post('/api/articles/:id/publish', wrap(handler_10));

app.post('/api/monitoring/run', wrap(handler_11));
app.get('/api/monitoring/runs', wrap(handler_12));

export default app;
