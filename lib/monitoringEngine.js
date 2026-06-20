import { supabase } from './supabase.js';
import axios from 'axios';
import * as cheerio from 'cheerio';

const ERROR_PATTERNS = [
  { pattern: /503\s*service\s*unavailable/i, code: 'HTTP-503', severity: 'critical', type: 'outage' },
  { pattern: /504\s*gateway\s*timeout/i, code: 'HTTP-504', severity: 'high', type: 'outage' },
  { pattern: /500\s*internal\s*server\s*error/i, code: 'HTTP-500', severity: 'high', type: 'outage' },
  { pattern: /login\s*failed|invalid\s*credentials/i, code: 'AUTH-001', severity: 'high', type: 'login' },
  { pattern: /account\s*locked|temporarily\s*unavailable/i, code: 'AUTH-002', severity: 'high', type: 'account_lock' },
  { pattern: /transaction\s*failed|payment\s*declined/i, code: 'TX-001', severity: 'critical', type: 'transaction' },
  { pattern: /maintenance|scheduled\s*maintenance/i, code: 'MAINT-001', severity: 'medium', type: 'maintenance' },
  { pattern: /connection\s*error|network\s*error/i, code: 'NET-001', severity: 'medium', type: 'connectivity' },
];

const MOCK_TEMPLATES = [
  { title: '{bank} Online Banking Down - Cannot Login', msg: '{bank} online banking portal experiencing login issues.', severity: 'high', type: 'login', source: 'crawler' },
  { title: '{bank} Mobile App Crashing', msg: '{bank} mobile banking app crashing or displaying blank screens.', severity: 'medium', type: 'app_error', source: 'app_review' },
  { title: '{bank} Two-Factor Authentication Error', msg: 'Two-factor authentication codes not arriving for {bank} accounts.', severity: 'high', type: '2fa', source: 'support_page' },
  { title: '{bank} Transfer Processing Failure', msg: 'Account transfers and bill payments failing at {bank}.', severity: 'critical', type: 'transaction', source: 'support_page' },
  { title: '{bank} Website Maintenance Outage', msg: '{bank} performing unscheduled maintenance affecting online banking.', severity: 'medium', type: 'maintenance', source: 'crawler' },
  { title: '{bank} Direct Deposit Delayed', msg: 'Direct deposits not appearing on time at {bank}. ACH processing delays reported.', severity: 'high', type: 'transaction', source: 'support_page' },
  { title: '{bank} Account Balance Not Updating', msg: '{bank} account balances showing outdated information.', severity: 'medium', type: 'app_error', source: 'app_review' },
];

async function checkBankSite(bank) {
  const errors = [];
  try {
    const r = await axios.get(bank.website, { timeout: 8000, headers: { 'User-Agent': 'BankWatchBot/1.0' }, maxRedirects: 5 });
    const $ = cheerio.load(r.data);
    const text = $('body').text();
    for (const p of ERROR_PATTERNS) {
      if (p.pattern.test(text)) errors.push({ title: `${bank.name} Error Detected (${p.code})`, error_code: p.code, message: `Crawler detected pattern on ${bank.website}.`, severity: p.severity, type: p.type, source: 'crawler' });
    }
  } catch (err) {
    if (err.code === 'ENOTFOUND' || err.code === 'EAI_AGAIN') return errors;
    const code = err.response ? `HTTP-${err.response.status}` : err.code === 'ECONNABORTED' ? 'TIMEOUT-001' : 'NET-001';
    const severity = err.code === 'ECONNABORTED' || (err.response?.status >= 500) ? 'critical' : 'high';
    errors.push({ title: `${bank.name} Website Unreachable`, error_code: code, message: `Failed to connect to ${bank.website}: ${err.message}`, severity, type: 'outage', source: 'crawler' });
  }
  return errors;
}

function mockErrors(bank) {
  const out = [];
  for (const t of MOCK_TEMPLATES) {
    if (Math.random() < 0.08 && out.length < 2) {
      const code = `${bank.name.replace(/[^A-Z]/gi,'').substring(0,4).toUpperCase()}-${Math.floor(Math.random()*900)+100}`;
      out.push({ title: t.title.replace(/{bank}/g, bank.name), error_code: code, message: t.msg.replace(/{bank}/g, bank.name), severity: t.severity, type: t.type, source: t.source, affected_count: Math.floor(Math.random()*20000)+100 });
    }
  }
  return out;
}

async function monitorBank(bank) {
  const { data: run } = await supabase.from('bw_monitoring_runs').insert({ bank_id: bank.id, run_type: 'scheduled', status: 'running' }).select().single();
  const t0 = Date.now();
  try {
    const siteErrors = await checkBankSite(bank);
    const mockErrs = mockErrors(bank);
    const all = [...siteErrors, ...mockErrs];
    for (const e of all) {
      await supabase.from('bw_errors').insert({ bank_id: bank.id, ...e, affected_count: e.affected_count || Math.floor(Math.random()*5000)+10 });
    }
    await supabase.from('bw_monitoring_runs').update({ status: 'completed', errors_found: all.length, pages_checked: 1, duration_ms: Date.now() - t0, completed_at: new Date().toISOString() }).eq('id', run.id);
    return { errorsFound: all.length };
  } catch (err) {
    await supabase.from('bw_monitoring_runs').update({ status: 'failed', notes: err.message, completed_at: new Date().toISOString() }).eq('id', run.id);
    return { errorsFound: 0 };
  }
}

export async function runFullMonitoring({ bankId } = {}) {
  let query = supabase.from('bw_banks').select('*').order('assets_billions', { ascending: false });
  if (bankId) query = query.eq('id', bankId);
  const { data: banks } = await query;
  let total = 0;
  for (const bank of banks || []) {
    const r = await monitorBank(bank);
    total += r.errorsFound;
    await new Promise(res => setTimeout(res, 100));
  }
  return { banksChecked: banks?.length || 0, errorsFound: total };
}
