import { supabase, dbAll, dbGet, dbInsert, dbUpdate } from './supabase.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

function getGemini() {
  const k = process.env.GEMINI_API_KEY;
  if (!k || k === 'your_gemini_api_key_here') return null;
  return new GoogleGenerativeAI(k);
}

const MOCK = {
  login: { classification: 'Authentication & Login Failure', root_cause: 'Session management issues, OAuth token expiration, or backend authentication service degradation.', solutions: JSON.stringify(['Clear browser cache and cookies then retry', 'Try incognito/private browser window', 'Disable browser extensions especially password managers', 'Reset your password if error persists', 'Contact bank support if locked out', 'Try the mobile app as an alternative']), severity_assessment: 'High impact — directly prevents customer access.', trend_tags: JSON.stringify(['login-failure', 'authentication', 'access-denied']), confidence: 0.87 },
  '2fa': { classification: 'Two-Factor Authentication Delivery Failure', root_cause: 'SMS gateway provider outage or email delivery queue backlog.', solutions: JSON.stringify(['Request code resend after 60 seconds', 'Check spam folder for email codes', 'Try alternative 2FA method if available', 'Verify phone number in account settings', 'Contact carrier to check SMS blocking', 'Call bank support for manual verification']), severity_assessment: 'High impact — blocks all authentication attempts.', trend_tags: JSON.stringify(['2fa-failure', 'sms-not-received', 'authentication']), confidence: 0.91 },
  outage: { classification: 'Full Service Outage', root_cause: 'Infrastructure failure, data center issues, or DNS resolution problems.', solutions: JSON.stringify(["Check bank's official status page", "Follow bank on Twitter/X for updates", 'Use ATM for cash needs', 'Contact bank hotline for urgent transactions', 'Wait for service restoration']), severity_assessment: 'Critical — all online services unavailable.', trend_tags: JSON.stringify(['outage', 'service-down', 'infrastructure']), confidence: 0.95 },
  transaction: { classification: 'Payment & Transaction Processing Error', root_cause: 'ACH processing network issues or internal transaction routing failure.', solutions: JSON.stringify(['Retry transaction after 30 minutes', 'Verify recipient account details', 'Check daily transfer limits', 'Contact bank to verify no fraud hold', 'Use alternative payment method', 'Keep screenshot for dispute resolution']), severity_assessment: 'Critical — financial transactions failing.', trend_tags: JSON.stringify(['payment-failure', 'transaction-error', 'ACH']), confidence: 0.89 },
  app_crash: { classification: 'Mobile Application Crash', root_cause: 'Incompatible OS update or remote configuration causing crashes on startup.', solutions: JSON.stringify(['Force close and relaunch app', 'Update app to latest version', 'Restart your device', 'Uninstall and reinstall app', 'Use web browser as alternative']), severity_assessment: 'High — mobile users cannot access services.', trend_tags: JSON.stringify(['app-crash', 'mobile-banking', 'ios', 'android']), confidence: 0.83 },
  payment: { classification: 'Peer-to-Peer Payment System Failure', root_cause: 'Zelle/P2P integration service degradation or upstream payment rail outage.', solutions: JSON.stringify(['Wait 30 minutes and retry', 'Verify recipient email or phone', 'Check account transfer restrictions', 'Use wire transfer as alternative', 'Contact support with transaction reference']), severity_assessment: 'Critical — P2P payment failures affect large user volumes.', trend_tags: JSON.stringify(['zelle', 'p2p-payment', 'transfer-failure']), confidence: 0.88 },
  account_lock: { classification: 'Account Lockout / Access Restriction', root_cause: 'Overly aggressive fraud detection or system glitch in failed-attempt counter.', solutions: JSON.stringify(['Wait 30 minutes before retrying', 'Use Forgot Password reset flow', 'Call bank customer service to unlock', 'Verify your identity via ID verification', 'Request account review if locked without cause']), severity_assessment: 'High — customers cannot access their own funds.', trend_tags: JSON.stringify(['account-lock', 'security', 'fraud-detection']), confidence: 0.85 },
};

export async function analyzeError(errorId) {
  const { data: error, error: err1 } = await supabase.from('bw_errors').select('*, bw_banks(name)').eq('id', errorId).single();
  if (err1) throw new Error(err1.message);

  const { data: existing } = await supabase.from('bw_ai_analyses').select('*').eq('error_id', errorId).single();
  if (existing) return existing;

  let analysis = MOCK[error.type] || MOCK.login;
  const genAI = getGemini();

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(`You are a banking tech expert. Analyze this error and respond with ONLY valid JSON.\nBank: ${error.bw_banks?.name}\nError: ${error.title}\nCode: ${error.error_code}\nType: ${error.type}\nSeverity: ${error.severity}\nDescription: ${error.message}\n\nJSON: {"classification":"...","root_cause":"...","solutions":["...","...","...","...","..."],"severity_assessment":"...","trend_tags":["...","...","..."],"confidence":0.85}`);
      const parsed = JSON.parse(result.response.text().replace(/```json|```/g, '').trim());
      analysis = { classification: parsed.classification, root_cause: parsed.root_cause, solutions: JSON.stringify(parsed.solutions), severity_assessment: parsed.severity_assessment, trend_tags: JSON.stringify(parsed.trend_tags), confidence: parsed.confidence || 0.85 };
    } catch (e) { console.warn('Gemini fallback:', e.message); }
  }

  const { data: inserted, error: insErr } = await supabase.from('bw_ai_analyses').insert({ error_id: errorId, ...analysis }).select().single();
  if (insErr) throw new Error(insErr.message);
  return inserted;
}

export async function detectTrends() {
  const { data: errors } = await supabase.from('bw_errors').select('type, severity, bw_banks(name)').gte('detected_at', new Date(Date.now() - 7 * 86400000).toISOString());
  const typeCount = {}, bankCount = {};
  for (const e of errors || []) {
    typeCount[e.type] = (typeCount[e.type] || 0) + 1;
    const bn = e.bw_banks?.name;
    if (bn) bankCount[bn] = (bankCount[bn] || 0) + 1;
  }
  return {
    topErrorTypes: Object.entries(typeCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([type, count]) => ({ type, count })),
    topAffectedBanks: Object.entries(bankCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([bank, count]) => ({ bank, count })),
    totalErrors: errors?.length || 0,
    criticalCount: errors?.filter(e => e.severity === 'critical').length || 0,
    period: '7 days',
  };
}
