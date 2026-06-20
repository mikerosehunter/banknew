import { supabase } from './supabase.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import slugify from 'slugify';

function getGemini() {
  const k = process.env.GEMINI_API_KEY;
  if (!k || k === 'your_gemini_api_key_here') return null;
  return new GoogleGenerativeAI(k);
}

function calcSeoScore(content, title, metaDesc, keywords) {
  let s = 0;
  const wc = content.split(/\s+/).length;
  if (wc >= 1500) s += 25; else if (wc >= 1000) s += 15;
  if (title?.length >= 30 && title?.length <= 70) s += 15; else if (title) s += 8;
  if (metaDesc?.length >= 120 && metaDesc?.length <= 160) s += 15; else if (metaDesc) s += 8;
  if ((content.match(/^##\s/gm) || []).length >= 3) s += 15;
  if ((content.match(/^###\s/gm) || []).length >= 2) s += 10;
  const kws = typeof keywords === 'string' ? JSON.parse(keywords || '[]') : (keywords || []);
  if (kws.length >= 5) s += 10;
  if (content.includes('FAQ')) s += 10;
  return Math.min(s, 100);
}

function buildMockArticle(error, bank, analysis) {
  const solutions = analysis?.solutions ? JSON.parse(analysis.solutions) : [];
  const year = new Date().getFullYear();
  const title = `${error.title}: Complete Fix Guide [${year}]`;
  const metaDescription = `Fix ${error.title} fast. Step-by-step guide with ${solutions.length || 6} solutions for ${bank.name} customers. Updated ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.`;

  const content = `# ${title}

Experiencing the **${error.title}** issue with ${bank.name}? You're not alone — thousands of customers are reporting this right now. This guide explains what's causing it and how to fix it fast.

**Error Code:** \`${error.error_code || 'N/A'}\` | **Severity:** ${error.severity?.toUpperCase()} | **Affected:** ~${(error.affected_count || 5000).toLocaleString()} users

---

## What Is This Error?

The ${error.title} error affects ${bank.name} customers who attempt to:
- Log in to their ${bank.name} account
- Process transfers or payments  
- Complete two-factor authentication
- Access account balance and transactions

| Field | Details |
|-------|---------|
| **Bank** | ${bank.name} |
| **Error Code** | \`${error.error_code || 'N/A'}\` |
| **Type** | ${(error.type || '').replace(/_/g, ' ')} |
| **Severity** | ${error.severity?.toUpperCase()} |
| **Affected Users** | ~${(error.affected_count || 5000).toLocaleString()} |

---

## Root Cause Analysis

${analysis?.root_cause || `This error is typically caused by temporary service disruptions on ${bank.name}'s backend infrastructure — high traffic, emergency maintenance, or technical anomalies in their authentication systems.`}

**Common triggers:**
1. **Server-side degradation** — ${bank.name}'s backend experiencing slowdown
2. **Authentication service issues** — OAuth tokens or session management problems
3. **Browser/app cache corruption** — Outdated local data conflicting with server state
4. **Recent update conflicts** — New app/OS version incompatibilities
5. **Network routing issues** — Connectivity problems between device and bank servers
6. **Fraud detection false positive** — Security system flagging legitimate activity

---

## Business Impact

${analysis?.severity_assessment || `This ${error.severity} severity error requires prompt attention. All affected users cannot complete their banking actions until the issue is resolved.`}

---

## Step-by-Step Solutions

Work through these in order — start with the quickest fix first:

${solutions.length > 0 ? solutions.map((s, i) => `### Step ${i + 1}: ${s}\n\nApply this fix carefully. If the issue resolves, you don't need to continue further.\n`).join('\n') : `
### Step 1: Clear Browser Cache and Cookies
Press \`Ctrl+Shift+Del\` (Windows) or \`Cmd+Shift+Del\` (Mac). Select "All time", check all boxes, click "Clear data." Retry login.

### Step 2: Try Incognito / Private Browsing
Open incognito window (Ctrl+Shift+N / Cmd+Shift+N) and navigate to [${bank.website}](${bank.website}).

### Step 3: Disable Browser Extensions  
Extensions — ad blockers, VPNs, password managers — can interfere. Disable all extensions and retry.

### Step 4: Try a Different Browser or Device
Test on Firefox, Safari, or Edge. Also try from another device to isolate the issue.

### Step 5: Update the ${bank.name} Mobile App
Open App Store or Google Play → search "${bank.name}" → install updates. Developers push hotfixes for critical errors.

### Step 6: Check ${bank.name} Server Status
Visit [${bank.status_page_url || bank.website}](${bank.status_page_url || bank.website}) or search "${bank.name} outage" on Twitter/X.

### Step 7: Contact ${bank.name} Support
If all else fails — call the number on the back of your debit card or visit [${bank.support_url || bank.website + '/support'}](${bank.support_url || bank.website}).
`}

---

## When Will ${bank.name} Fix This?

Based on historical patterns:
- **Critical:** resolved within **2–6 hours**
- **High:** resolved within **6–24 hours**
- **Medium/Low:** may take **1–3 business days**

Track live status:
- [${bank.name} Website](${bank.website})
- Twitter/X: search "#${bank.name.replace(/\s/g, '')} down"
- Downdetector.com → search "${bank.name}"

---

## Prevention Tips

- ✅ Enable backup 2FA methods (SMS + authenticator app)
- ✅ Keep the ${bank.name} app auto-updated
- ✅ Save the customer service number in your contacts
- ✅ Bookmark the official login URL: [${bank.login_url || bank.website}](${bank.login_url || bank.website})
- ✅ Consider a backup bank card for emergencies

---

## Frequently Asked Questions

**Q: Is ${bank.name} down right now?**  
A: Check our live monitoring dashboard for real-time status. We scan every 30 minutes.

**Q: How do I fix ${error.title}?**  
A: Start with clearing cache, then try incognito. If it persists, it may be server-side — check the status page and retry in 1–2 hours.

**Q: Is my money safe?**  
A: Yes — ${bank.name} errors are technical only. Funds are FDIC-insured up to $250,000.

**Q: Should I change my password?**  
A: Only if you suspect unauthorized access. Most banking errors are server-side and unrelated to your credentials.

**Q: Can I use my debit card during an outage?**  
A: Yes — physical debit/credit cards and ATMs use separate networks and typically remain available.

**Q: How many people are affected?**  
A: Our monitoring shows ~${(error.affected_count || 5000).toLocaleString()} users are currently impacted.

---

*Last updated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · BankWatch AI · Error Code: ${error.error_code || 'N/A'}*`;

  const faqSchema = JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{ "@type": "Question", "name": `Is ${bank.name} down?`, "acceptedAnswer": { "@type": "Answer", "text": "Check our live dashboard. We monitor every 30 minutes." } }, { "@type": "Question", "name": `How to fix ${error.title}?`, "acceptedAnswer": { "@type": "Answer", "text": "Clear browser cache, try incognito mode, update the app, and check the bank status page." } }, { "@type": "Question", "name": "Is my money safe?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Bank errors are technical issues only. Funds are FDIC insured." } }] });
  const keywords = JSON.stringify([`${bank.name} error`, `${bank.name} not working`, error.error_code, `${bank.name} login problem`, `${bank.name} outage`, 'bank error fix', `${bank.name} down`, 'online banking not working']);

  return { title, content, metaDescription, faqSchema, keywords };
}

export async function generateArticle(errorId) {
  const { data: error, error: e1 } = await supabase.from('bw_errors').select('*').eq('id', errorId).single();
  if (e1) throw new Error(e1.message);
  const { data: bank, error: e2 } = await supabase.from('bw_banks').select('*').eq('id', error.bank_id).single();
  if (e2) throw new Error(e2.message);
  const { data: analysis } = await supabase.from('bw_ai_analyses').select('*').eq('error_id', errorId).single();

  const { data: existing } = await supabase.from('bw_articles').select('*').eq('error_id', errorId).single();
  if (existing) return existing;

  let articleData;
  const genAI = getGemini();
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const solutions = analysis?.solutions ? JSON.parse(analysis.solutions) : [];
      const result = await model.generateContent(`Write a 1500+ word SEO article in markdown about: Bank: ${bank.name}, Error: ${error.title}, Code: ${error.error_code}, Cause: ${analysis?.root_cause}, Solutions: ${solutions.join('; ')}. Include intro, root causes, step-by-step fixes, prevention, 4+ question FAQ.`);
      const mock = buildMockArticle(error, bank, analysis);
      articleData = { title: mock.title, content: result.response.text(), metaDescription: mock.metaDescription, faqSchema: mock.faqSchema, keywords: mock.keywords };
    } catch (e) { articleData = buildMockArticle(error, bank, analysis); }
  } else {
    articleData = buildMockArticle(error, bank, analysis);
  }

  const slug = `${slugify(articleData.title, { lower: true, strict: true }).substring(0, 80)}-${Date.now()}`;
  const wc = articleData.content.split(/\s+/).length;
  const seo = calcSeoScore(articleData.content, articleData.title, articleData.metaDescription, articleData.keywords);

  const { data: inserted, error: insErr } = await supabase.from('bw_articles').insert({ error_id: errorId, bank_id: bank.id, title: articleData.title, slug, content: articleData.content, meta_description: articleData.metaDescription, faq_schema: articleData.faqSchema, keywords: articleData.keywords, seo_score: seo, word_count: wc, status: 'draft' }).select().single();
  if (insErr) throw new Error(insErr.message);
  return inserted;
}

export async function generateBulkArticles(limit = 5) {
  const { data: errors } = await supabase.from('bw_errors').select('id').limit(limit * 3);
  const { data: done } = await supabase.from('bw_articles').select('error_id');
  const doneIds = new Set((done || []).map(a => a.error_id));
  const toProcess = (errors || []).filter(e => !doneIds.has(e.id)).slice(0, limit);
  const results = [];
  for (const e of toProcess) {
    try { const a = await generateArticle(e.id); results.push({ success: true, articleId: a.id }); }
    catch (err) { results.push({ success: false, error: err.message }); }
  }
  return results;
}
