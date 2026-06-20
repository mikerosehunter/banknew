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
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'API Error');
    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

// ── Public API ──

export function getStats() {
  return fetchJSON('/stats');
}

export function getCategories() {
  return fetchJSON('/categories');
}

export function getArticles(params = {}) {
  const query = new URLSearchParams(Object.entries(params).filter(([_, v]) => v !== undefined && v !== ''));
  return fetchJSON(`/articles?${query}`);
}

export function getArticle(idOrSlug) {
  return fetchJSON(`/articles/${idOrSlug}`);
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
