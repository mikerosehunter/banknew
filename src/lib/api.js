import axios from 'axios';

// In production (Vercel) the API is on the same domain at /api
// In local dev, Vite proxies /api to localhost:3000 (vercel dev)
const API_BASE = '/api';

const api = axios.create({ baseURL: API_BASE, timeout: 30000 });

export const getDashboard = () => api.get('/dashboard').then(r => r.data);

export const getBanks = (params = {}) => api.get('/banks', { params }).then(r => r.data);
export const getBank = (id) => api.get(`/banks/${id}`).then(r => r.data);
export const createBank = (data) => api.post('/banks', data).then(r => r.data);
export const updateBank = (id, data) => api.put(`/banks/${id}`, data).then(r => r.data);

export const getErrors = (params = {}) => api.get('/errors', { params }).then(r => r.data);
export const getError = (id) => api.get(`/errors/${id}`).then(r => r.data);
export const analyzeError = (id) => api.post(`/errors/${id}/analyze`).then(r => r.data);
export const generateArticle = (id) => api.post(`/errors/${id}/generate-article`).then(r => r.data);
export const generateImage = (id) => api.post(`/errors/${id}/generate-image`).then(r => r.data);
export const updateErrorStatus = (id, status) => api.patch(`/errors/${id}`, { status }).then(r => r.data);

export const getArticleStats = () => api.get('/articles', { params: { limit: 1 } }).then(r => ({ total: r.data.total || 0 }));
export const getErrorStats = () => api.get('/errors', { params: { limit: 1 } }).then(r => ({ total: r.data.total || 0 }));
export const getArticles = (params = {}) => api.get('/articles', { params }).then(r => r.data);
export const getArticle = (id) => api.get(`/articles/${id}`).then(r => r.data);
export const generateBulkArticles = (limit = 5) => api.post('/articles/generate-bulk', { limit }).then(r => r.data);
export const publishArticle = (id, options = {}) => api.post(`/articles/${id}/publish`, options).then(r => r.data);
export const getPublishQueue = () => api.get('/articles/publish/queue').then(r => r.data).catch(() => []);

export const getMonitoringRuns = (params = {}) => api.get('/monitoring/runs', { params }).then(r => r.data);
export const getMonitoringStats = () => api.get('/monitoring/runs', {}).then(r => r.data?.stats || {});
export const triggerMonitoring = (bankId = null) => api.post('/monitoring/run', bankId ? { bankId } : {}).then(r => r.data);

export default api;
