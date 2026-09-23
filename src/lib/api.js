// API Client
const API_BASE = '/api';

async function fetchJSON(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    const text = await res.text();
    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        console.warn(`Non-JSON response from ${endpoint}:`, text.substring(0, 100));
        data = {};
      }
    }
    if (!res.ok) throw new Error(data.error || `API Error ${res.status}`);
    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

// ── Public API ──

// In-memory Client Cache for 0ms transitions
export const articleMemoryCache = new Map();
let articlesListMemoryCache = null;
let categoriesMemoryCache = null;

export function getStats() {
  return fetchJSON('/stats');
}

export async function getCategories() {
  if (categoriesMemoryCache) return categoriesMemoryCache;
  try {
    const res = await fetch('/data/categories.json');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        categoriesMemoryCache = data;
        return data;
      }
    }
  } catch (err) {
    console.warn('Edge CDN categories fetch failed, falling back to /api:', err);
  }
  const data = await fetchJSON('/categories');
  if (Array.isArray(data)) {
    categoriesMemoryCache = data;
  }
  return data || [];
}

export async function getArticles(params = {}) {
  // 1. Try ultra-fast Edge static JSON cache
  try {
    if (!articlesListMemoryCache) {
      const res = await fetch('/data/articles.json');
      if (res.ok) {
        articlesListMemoryCache = await res.json();
      }
    }

    if (articlesListMemoryCache && articlesListMemoryCache.articles) {
      let list = articlesListMemoryCache.articles;

      if (params.category && params.category !== 'all') {
        const cat = params.category.toLowerCase();
        list = list.filter(a => {
          if (cat === 'bank-of-america') return a.bank_name === 'Bank of America';
          if (cat === 'jpmorgan-chase-bank' || cat === 'chase-bank' || cat === 'chase') return a.bank_name === 'Chase Bank';
          return (a.category && a.category.toLowerCase() === cat) || 
                 (a.bank_name && a.bank_name.toLowerCase().includes(cat.replace(/-/g, ' ')));
        });
      }

      if (params.bank_name) {
        const b = params.bank_name.toLowerCase();
        list = list.filter(a => (a.bank_name || '').toLowerCase().includes(b));
      }

      if (params.search) {
        const s = params.search.toLowerCase();
        list = list.filter(a => a.title.toLowerCase().includes(s) || (a.excerpt && a.excerpt.toLowerCase().includes(s)));
      }

      const total = list.length;
      const offset = +(params.offset || 0);
      const limit = +(params.limit || list.length);
      const paginated = list.slice(offset, offset + limit);

      // Pre-warm article cache from summaries
      for (const a of paginated) {
        if (!articleMemoryCache.has(a.slug)) {
          articleMemoryCache.set(a.slug, a);
        }
      }

      return { articles: paginated, total };
    }
  } catch (err) {
    console.warn('Edge CDN articles list failed, falling back to /api:', err);
  }

  // 2. Serverless API Fallback
  const query = new URLSearchParams(Object.entries(params).filter(([_, v]) => v !== undefined && v !== ''));
  return fetchJSON(`/articles?${query}`);
}

export async function getArticle(idOrSlug) {
  if (!idOrSlug) return null;

  // 1. Return instantly if in memory (0ms latency)
  if (articleMemoryCache.has(idOrSlug)) {
    const cached = articleMemoryCache.get(idOrSlug);
    // If cache only has partial summary (no content), proceed to fetch full body
    if (cached && cached.content) {
      return cached;
    }
  }

  // 2. Try ultra-fast Edge static JSON file (cached worldwide on CDN Edge, ~15-30ms)
  try {
    const res = await fetch(`/data/articles/${idOrSlug}.json`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.content) {
        articleMemoryCache.set(idOrSlug, data);
        if (data.slug) articleMemoryCache.set(data.slug, data);
        if (data.id) articleMemoryCache.set(data.id, data);
        return data;
      }
    }
  } catch (err) {
    console.warn(`Edge CDN article fetch failed for ${idOrSlug}, falling back to /api:`, err);
  }

  // 3. Fallback to Serverless API
  const data = await fetchJSON(`/articles/${idOrSlug}`);
  if (data) {
    articleMemoryCache.set(idOrSlug, data);
    if (data.slug) articleMemoryCache.set(data.slug, data);
    if (data.id) articleMemoryCache.set(data.id, data);
  }
  return data;
}

export function prefetchArticle(idOrSlug) {
  if (!idOrSlug || typeof window === 'undefined') return;
  if (articleMemoryCache.has(idOrSlug)) {
    const cached = articleMemoryCache.get(idOrSlug);
    if (cached && cached.content) return;
  }
  fetch(`/data/articles/${idOrSlug}.json`)
    .then(res => (res.ok ? res.json() : null))
    .then(data => {
      if (data && data.content) {
        articleMemoryCache.set(idOrSlug, data);
        if (data.slug) articleMemoryCache.set(data.slug, data);
        if (data.id) articleMemoryCache.set(data.id, data);
      }
    })
    .catch(() => {});
}

export function getBanks() {
  return fetchJSON('/banks');
}

// ── Admin API ──

export function createArticle(data) {
  return fetchJSON('/articles', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateArticle(id, data) {
  return fetchJSON(`/articles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteArticle(id) {
  return fetchJSON(`/articles/${id}`, {
    method: 'DELETE',
  });
}

export function generateArticles(count = 5) {
  return fetchJSON('/generate', {
    method: 'POST',
    body: JSON.stringify({ count }),
  });
}

export function createCategory(data) {
  return fetchJSON('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function deleteCategory(slug) {
  return fetchJSON(`/categories/${slug}`, {
    method: 'DELETE',
  });
}
