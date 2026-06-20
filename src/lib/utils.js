export function severityBadge(severity) {
  const map = { critical: 'badge-critical', high: 'badge-high', medium: 'badge-medium', low: 'badge-low' };
  return map[severity] || 'badge-low';
}

export function severityDot(severity) {
  const map = { critical: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-yellow-500', low: 'bg-green-500' };
  return map[severity] || 'bg-dark-500';
}

export function severityLabel(severity) {
  return (severity || 'unknown').charAt(0).toUpperCase() + (severity || 'unknown').slice(1);
}

export function statusBadge(status) {
  const map = { active: 'badge-active', resolved: 'badge-resolved', investigating: 'badge-medium', ignored: 'badge-draft' };
  return map[status] || 'badge-draft';
}

export function formatDate(dateStr, options = {}) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d)) return 'Invalid date';
  const defaults = { month: 'short', day: 'numeric', year: 'numeric' };
  return d.toLocaleDateString('en-US', { ...defaults, ...options });
}

export function formatRelative(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}

export function formatNumber(n) {
  if (!n && n !== 0) return '0';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export function seoScoreColor(score) {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
}

export function seoScoreBg(score) {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
}

export function errorTypeIcon(type) {
  const map = {
    login: '🔐', '2fa': '📱', outage: '⚡', transaction: '💸', payment: '💳',
    app_crash: '📱', app_error: '🐛', account_lock: '🔒', maintenance: '🔧',
    connectivity: '🌐', performance: '⚡', biometric: '👆', feature: '🎯',
  };
  return map[type] || '⚠️';
}

export function categoryLabel(cat) {
  const map = { national: 'National', regional: 'Regional', online: 'Online/Neobank', investment: 'Investment', credit_union: 'Credit Union', community: 'Community' };
  return map[cat] || cat;
}

export function truncate(str, len = 80) {
  if (!str) return '';
  return str.length > len ? str.substring(0, len) + '...' : str;
}
