import { supabase } from './supabase.js';

function genSvg(error, bank) {
  const c = { critical: { bg: '#FEF2F2', border: '#FCA5A5', icon: '#DC2626' }, high: { bg: '#FFF7ED', border: '#FDBA74', icon: '#EA580C' }, medium: { bg: '#FFFBEB', border: '#FDE68A', icon: '#D97706' }, low: { bg: '#F0FDF4', border: '#86EFAC', icon: '#16A34A' } }[error.severity] || { bg: '#FFFBEB', border: '#FDE68A', icon: '#D97706' };
  const code = error.error_code || 'ERR-001';
  const msg = (error.message || '').substring(0, 55) + '...';
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg" font-family="Arial,sans-serif"><rect width="1200" height="630" fill="#F8FAFC"/><rect x="0" y="0" width="1200" height="50" fill="#E2E8F0"/><circle cx="22" cy="25" r="7" fill="#FC8181"/><circle cx="44" cy="25" r="7" fill="#F6AD55"/><circle cx="66" cy="25" r="7" fill="#68D391"/><rect x="100" y="12" width="850" height="26" rx="13" fill="white" stroke="#CBD5E1" stroke-width="1"/><text x="126" y="29" font-size="12" fill="#64748B">🔒 ${(bank.login_url || bank.website || '').substring(0, 55)}</text><rect x="0" y="50" width="1200" height="68" fill="#1E293B"/><text x="48" y="90" font-size="22" font-weight="bold" fill="white">${bank.name}</text><text x="48" y="110" font-size="11" fill="#94A3B8">Secure Online Banking Portal</text><defs><filter id="s"><feDropShadow dx="0" dy="4" stdDeviation="12" flood-color="#00000025"/></filter></defs><rect x="330" y="148" width="540" height="400" rx="14" fill="white" stroke="#E2E8F0" stroke-width="1" filter="url(#s)"/><rect x="330" y="148" width="540" height="78" rx="14" fill="${c.bg}" stroke="${c.border}" stroke-width="1"/><rect x="330" y="200" width="540" height="26" fill="${c.bg}"/><circle cx="400" cy="188" r="24" fill="${c.icon}" opacity="0.12"/><text x="400" y="196" font-size="24" text-anchor="middle" fill="${c.icon}">⚠</text><text x="436" y="180" font-size="16" font-weight="bold" fill="#1E293B">Login Error Detected</text><text x="436" y="200" font-size="12" fill="#64748B">Error Code: ${code}</text><line x1="350" y1="232" x2="850" y2="232" stroke="#E2E8F0" stroke-width="1"/><text x="600" y="265" font-size="13" fill="#475569" text-anchor="middle">We were unable to process your request.</text><text x="600" y="285" font-size="12" fill="#64748B" text-anchor="middle">${msg}</text><rect x="368" y="310" width="464" height="44" rx="8" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/><text x="388" y="337" font-size="13" fill="#94A3B8">Username / Email address</text><rect x="368" y="366" width="464" height="44" rx="8" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/><text x="388" y="393" font-size="13" fill="#94A3B8">••••••••••</text><rect x="368" y="422" width="464" height="46" rx="8" fill="#94A3B8"/><text x="600" y="450" font-size="14" font-weight="bold" fill="white" text-anchor="middle">Service Temporarily Unavailable</text><rect x="368" y="480" width="464" height="36" rx="6" fill="${c.bg}" stroke="${c.border}" stroke-width="1"/><text x="600" y="503" font-size="11" fill="${c.icon}" text-anchor="middle">⚠ Error ${code} · ${new Date().toLocaleDateString()} · Contact support</text><text x="600" y="600" font-size="10" fill="#CBD5E1" text-anchor="middle">Screenshot by BankWatch AI · bankloginonline.com · Educational purposes only</text></svg>`;
}

export async function generateErrorImage(errorId) {
  const { data: error, error: e1 } = await supabase.from('bw_errors').select('*').eq('id', errorId).single();
  if (e1) throw new Error(e1.message);
  const { data: bank, error: e2 } = await supabase.from('bw_banks').select('*').eq('id', error.bank_id).single();
  if (e2) throw new Error(e2.message);

  const { data: existing } = await supabase.from('bw_generated_images').select('*').eq('error_id', errorId).single();
  if (existing) return existing;

  const svg = genSvg(error, bank);
  const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

  const { data, error: insErr } = await supabase.from('bw_generated_images').insert({ error_id: errorId, url: dataUri, prompt: `Bank error screenshot: ${bank.name} - ${error.error_code}`, width: 1200, height: 630 }).select().single();
  if (insErr) throw new Error(insErr.message);
  return data;
}
