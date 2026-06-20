import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import slugify from 'slugify';

const app = express();
app.use(cors());
app.use(express.json());

// ── Supabase ────────────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Categories are now managed in DB table: bw_categories

// ── AI helpers ───────────────────────────────────────────────────────────
function getGemini() {
  const k = process.env.GEMINI_API_KEY;
  if (!k || k.startsWith('your_')) return null;
  return new GoogleGenerativeAI(k);
}

function getOpenAI() {
  const k = process.env.OPENAI_API_KEY;
  if (!k || k.startsWith('your_')) return null;
  return new OpenAI({ apiKey: k });
}

// ── Article content builder ─────────────────────────────────────────────────
function buildArticle({ bankName, errorTitle, errorCode, errorType, severity, affectedCount, website, loginUrl, supportUrl }) {
  const year = new Date().getFullYear();
  const affectedStr = affectedCount ? (affectedCount >= 1000 ? `${Math.round(affectedCount/1000)}K+` : affectedCount.toString()) : 'thousands of';
  const title = `${bankName} ${errorTitle}: Complete Fix Guide [${year}]`;
  const excerpt = `Is ${bankName} not working? ${affectedStr} users are affected by this ${errorTitle} error. Here are the proven step-by-step fixes.`;
  const metaDescription = `Fix the ${bankName} ${errorTitle} error (${errorCode || 'common issue'}) fast. Complete troubleshooting guide with ${6} verified solutions. Updated ${new Date().toLocaleDateString('en-US', {month:'long',year:'numeric'})}.`;

  const catMap = { login:'login-issues', '2fa':'2fa-problems', outage:'bank-outages', transaction:'transfer-errors', payment:'transfer-errors', app_crash:'app-problems', app_error:'app-problems', account_lock:'account-locked', maintenance:'bank-outages' };
  const category = catMap[errorType] || 'login-issues';

  const content = `## Is ${bankName} Down Right Now?

If you're seeing the **"${errorTitle}"** error on ${bankName}'s website or mobile app, you're not alone. Our monitoring system has detected this issue affecting approximately **${affectedStr} users** as of ${new Date().toLocaleDateString('en-US', {month:'long',day:'numeric',year:'numeric'})}.

> **Quick Status:** This is a ${severity.toUpperCase()} severity issue. ${severity === 'critical' ? 'The service is currently experiencing major disruptions.' : severity === 'high' ? 'Many users are affected and a fix is in progress.' : 'Some users are experiencing intermittent issues.'}

---

## What Is the "${errorTitle}" Error?

The **${errorTitle}** error (${errorCode || 'error code varies'}) typically occurs when ${bankName} customers attempt to:

- Log into their online banking account at [${loginUrl || website}](${loginUrl || website})
- Make transfers or pay bills online
- Access account balances or transaction history
- Use the ${bankName} mobile banking app

| Detail | Info |
|--------|------|
| **Bank** | ${bankName} |
| **Error Code** | \`${errorCode || 'N/A'}\` |
| **Error Type** | ${errorType ? errorType.replace(/_/g,' ') : 'Service Error'} |
| **Severity** | ${severity.toUpperCase()} |
| **Users Affected** | ~${affectedStr} |
| **First Detected** | ${new Date().toLocaleDateString()} |

---

## Root Cause Analysis

This error is commonly triggered by one or more of the following:

1. **Server-Side Degradation** — ${bankName}'s backend infrastructure is temporarily overloaded or experiencing maintenance
2. **Authentication Service Issues** — OAuth tokens or session management may have expired or malfunctioned
3. **Browser Cache Conflicts** — Outdated cached data in your browser is conflicting with the updated server state
4. **Recent App or OS Update** — A newly installed update introduced incompatibility
5. **Network Routing Problems** — An issue between your internet provider and ${bankName}'s servers
6. **Fraud Detection Trigger** — ${bankName}'s security system flagged an unusual login pattern

---

## Step-by-Step Fixes

Work through these in order. Most users resolve the issue within the first 3 steps.

### ✅ Step 1: Clear Your Browser Cache and Cookies

This is the #1 fix for most ${bankName} login errors.

- **Chrome:** Press \`Ctrl+Shift+Del\` (Windows) or \`Cmd+Shift+Del\` (Mac) → Select "All time" → Check "Cookies" and "Cached images" → Click "Clear data"
- **Safari:** Go to Safari → Preferences → Privacy → Manage Website Data → Remove All
- **Firefox:** \`Ctrl+Shift+Del\` → Select "Everything" → Click "Clear Now"

After clearing, close the browser completely and reopen it before trying again.

### ✅ Step 2: Try Private / Incognito Mode

A private window bypasses stored cookies and extensions:

- **Chrome:** \`Ctrl+Shift+N\` (Windows) / \`Cmd+Shift+N\` (Mac)
- **Safari:** \`Cmd+Shift+N\`
- **Firefox:** \`Ctrl+Shift+P\`

Navigate directly to [${loginUrl || website}](${loginUrl || website}) in the private window.

### ✅ Step 3: Disable Browser Extensions

Extensions — especially ad blockers, VPNs, and password managers — frequently cause banking login failures.

1. Go to your browser's extension manager
2. **Disable all extensions temporarily**
3. Reload the ${bankName} login page
4. If it works, re-enable extensions one at a time to find the culprit

### ✅ Step 4: Update or Reinstall the ${bankName} Mobile App

If you're using the mobile app:

1. Open **App Store** (iOS) or **Google Play** (Android)
2. Search for "${bankName}"
3. Tap **Update** if available
4. If already updated, **uninstall** and **reinstall** the app
5. Do NOT restore from a backup — do a fresh install

### ✅ Step 5: Try a Different Device or Browser

This helps isolate whether the issue is with your device or ${bankName}'s servers:

- Try on a different browser (Chrome, Firefox, Safari, Edge)
- Try on a different device (phone, tablet, another computer)
- Try on a different network (switch from WiFi to mobile data)

If it works on another device, the issue is with your specific browser/device setup.

### ✅ Step 6: Check ${bankName}'s Official Status Page

${bankName} may have already acknowledged the issue:

- Visit the [${bankName} website](${website}) and look for a status banner
- Search Twitter/X for "#${bankName.replace(/\s/g, '')} down" to see live reports
- Check [Downdetector.com](https://downdetector.com) for ${bankName} outage reports

### ✅ Step 7: Contact ${bankName} Support Directly

If all else fails, contact ${bankName} support:

- **Phone:** Call the number on the back of your debit or credit card
- **Online:** Visit [${supportUrl || website + '/support'}](${supportUrl || website})
- **Chat:** Most banks offer live chat support during business hours
- **Branch:** Visit a local ${bankName} branch for urgent account needs

---

## How Long Will This Last?

Based on historical ${bankName} outage data:

| Severity | Typical Resolution Time |
|----------|------------------------|
| Critical | 2–6 hours |
| High | 6–24 hours |
| Medium | 1–3 business days |
| Low | Resolved with next app update |

---

## Is My Money Safe During a ${bankName} Outage?

**Yes, absolutely.** A login error or service outage does **not** affect your funds. Your money is:

- ✅ **FDIC Insured** up to $250,000 per depositor
- ✅ **Not accessible to hackers** just because the site is down
- ✅ **Fully available** via ATM or branch during online outages
- ✅ **Tracked and secured** by ${bankName}'s internal systems

---

## Prevention Tips

To reduce the chance of this happening again:

- 📌 Bookmark the official ${bankName} login URL: [${loginUrl || website}](${loginUrl || website})
- 📱 Keep the ${bankName} mobile app **auto-updated**
- 🔐 Set up **multiple 2FA methods** (app + SMS backup)
- 📞 Save ${bankName}'s **customer service number** in your contacts
- 💳 Keep a **backup debit/credit card** from another bank for emergencies

---

## Frequently Asked Questions

**Q: Why is ${bankName} not letting me log in?**
A: The most common causes are server outages, browser cache issues, or account security locks. Start by clearing your browser cache and trying incognito mode.

**Q: Is ${bankName} down for everyone or just me?**
A: Check our live status feed at the top of this page or search "${bankName} down" on Twitter/X. If it's widespread, it's a server-side issue.

**Q: Will ${bankName} fix this automatically?**
A: Yes — server-side issues are resolved by ${bankName}'s engineering team. You don't need to take any action other than waiting and retrying.

**Q: Should I change my password if I'm seeing this error?**
A: Only if you suspect unauthorized access. Most login errors are technical in nature and unrelated to your credentials.

**Q: Can I still use my ${bankName} debit card during an outage?**
A: Yes. Physical debit and credit cards use separate payment networks (Visa/Mastercard) that operate independently of the online banking portal.

**Q: How do I report this issue to ${bankName}?**
A: Contact ${bankName} support at [${supportUrl || website}](${supportUrl || website}) or call the number on the back of your card.

---

*This guide is updated automatically by BankLoginOnline's monitoring system. Last checked: ${new Date().toLocaleString('en-US', {month:'long',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'})} · Error Code: ${errorCode || 'N/A'}*`;

  return { title, excerpt, metaDescription, content, category, keywords: JSON.stringify([`${bankName} login error`, `${bankName} not working`, `${bankName} down`, errorCode || '', 'bank login problem', 'online banking error'].filter(Boolean)) };
}

// ── Routes ───────────────────────────────────────────────────────────────────

// Stats
app.get('/api/stats', async (req, res) => {
  try {
    const [{ count: articles }, { count: banks }, { count: published }, { count: categories }] = await Promise.all([
      supabase.from('bw_articles').select('*', { count: 'exact', head: true }),
      supabase.from('bw_banks').select('*', { count: 'exact', head: true }),
      supabase.from('bw_articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('bw_categories').select('*', { count: 'exact', head: true }),
    ]);
    res.json({ articles: articles || 0, banks: banks || 0, published: published || 0, categories: categories || 0 });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Categories list
app.get('/api/categories', async (req, res) => {
  try {
    const { data: catData, error } = await supabase.from('bw_categories').select('*').order('label');
    if (error) throw error;
    
    // Count articles per category
    const { data: articles, error: artError } = await supabase.from('bw_articles').select('category').eq('status', 'published');
    if (artError) throw artError;
    
    const counts = {};
    for (const a of articles || []) counts[a.category] = (counts[a.category] || 0) + 1;
    
    const cats = (catData || []).map(c => ({ ...c, count: counts[c.slug] || 0 }));
    res.json(cats);
  } catch(e) { 
    res.status(500).json({ error: e.message, hint: 'Category fetch failed', stack: e.stack }); 
  }
});

// Create category
app.post('/api/categories', async (req, res) => {
  try {
    const { label, icon, description } = req.body;
    const slug = slugify(label, { lower: true, strict: true });
    const { data, error } = await supabase.from('bw_categories').insert({ slug, label, icon, description }).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Delete category
app.delete('/api/categories/:slug', async (req, res) => {
  try {
    const { error } = await supabase.from('bw_categories').delete().eq('slug', req.params.slug);
    if (error) throw error;
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});


// Articles list
app.get('/api/articles', async (req, res) => {
  try {
    const { category, bank_id, search, status, featured, limit = 12, offset = 0 } = req.query;
    let q = supabase.from('bw_articles')
      .select('id,title,slug,excerpt,meta_description,category,bank_name,status,created_at,published_at', { count: 'exact' })
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .range(+offset, +offset + +limit - 1);
    if (category) q = q.eq('category', category);
    if (search) q = q.ilike('title', `%${search}%`);
    if (status) q = q.eq('status', status);
    const { data, count, error } = await q;
    if (error) throw error;
    res.json({ articles: data || [], total: count || 0 });
  } catch(e) { res.status(500).json({ error: e.message }); }
});


// Single article (by slug or id)
app.get('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const isUuid = /^[0-9a-f-]{36}$/i.test(id);
    let q = supabase.from('bw_articles').select('*');
    q = isUuid ? q.eq('id', id) : q.eq('slug', id);
    const { data, error } = await q.single();
    if (error) return res.status(404).json({ error: 'Article not found' });
    res.json({ ...data, faq_parsed: (() => { try { return JSON.parse(data.faq_schema || 'null'); } catch { return null; } })() });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Create article (admin)
app.post('/api/articles', async (req, res) => {
  try {
    const { title, content, excerpt, meta_description, category, status = 'draft', featured = false, bank_id, keywords } = req.body;
    const slug = `${slugify(title, { lower: true, strict: true }).substring(0, 80)}-${Date.now()}`;
    const wc = content ? content.split(/\s+/).length : 0;
    const { data, error } = await supabase.from('bw_articles').insert({
      title, slug, content, excerpt, meta_description, category, status, featured, bank_id, keywords,
      seo_score: 70, word_count: wc, published_at: status === 'published' ? new Date().toISOString() : null,
    }).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Update article (admin)
app.put('/api/articles/:id', async (req, res) => {
  try {
    const { title, content, excerpt, meta_description, category, status, featured, keywords } = req.body;
    const updates = { title, content, excerpt, meta_description, category, status, featured, keywords, updated_at: new Date().toISOString() };
    if (title) { updates.slug = `${slugify(title, { lower: true, strict: true }).substring(0, 80)}`; }
    if (content) updates.word_count = content.split(/\s+/).length;
    if (status === 'published') updates.published_at = new Date().toISOString();
    const { data, error } = await supabase.from('bw_articles').update(updates).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Delete article (admin)
app.delete('/api/articles/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('bw_articles').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Banks list (for dropdowns)
app.get('/api/banks', async (req, res) => {
  try {
    const { data, error } = await supabase.from('bw_banks').select('id,name,category,website,login_url,support_url').order('assets_billions', { ascending: false });
    if (error) throw error;
    res.json({ banks: data || [] });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// AI Article Generation (admin trigger)
app.post('/api/generate', async (req, res) => {
  try {
    const { count: limit = 5 } = req.body || {};
    // Get errors that don't have articles yet
    const { data: errors } = await supabase.from('bw_errors').select('*,bw_banks(name,website,login_url,support_url)').order('affected_count', { ascending: false }).limit(50);
    const { data: existing } = await supabase.from('bw_articles').select('error_id').not('error_id', 'is', null);
    const existingIds = new Set((existing || []).map(a => a.error_id));
    const toProcess = (errors || []).filter(e => !existingIds.has(e.id)).slice(0, limit);

    if (toProcess.length === 0) {
      return res.json({ success: 0, message: 'No new errors to generate articles for.' });
    }

    // Send response immediately — generate in background
    res.json({ success: toProcess.length, message: `Generating ${toProcess.length} articles in the background...` });

    // Background generation
    (async () => {
      const genAI = getGemini();
      const openAI = getOpenAI();
      for (const error of toProcess) {
        try {
          const bank = error.bw_banks;
          const params = { bankName: bank.name, errorTitle: error.title, errorCode: error.error_code, errorType: error.type, severity: error.severity, affectedCount: error.affected_count, website: bank.website, loginUrl: bank.login_url, supportUrl: bank.support_url };
          let article = buildArticle(params);
          const prompt = `Write a complete 1500+ word SEO guide article in Markdown format about this banking error:\n\nBank: ${bank.name}\nError: ${error.title}\nError Code: ${error.error_code}\nSeverity: ${error.severity}\nType: ${error.type}\n\nInclude: intro, what the error is (with a table), root causes, 6 step-by-step solutions with ### headers, prevention tips, and a 6-question FAQ. Write naturally, engagingly, and optimize for the search query "${bank.name} ${error.title} fix". Do not include the article title in the output.`;

          // Try OpenAI first, then Gemini
          if (openAI) {
            try {
              const response = await openAI.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                  { role: 'system', content: 'You are an expert banking tech writer and SEO specialist.' },
                  { role: 'user', content: prompt }
                ],
                temperature: 0.7,
              });
              article.content = response.choices[0].message.content;
              article.word_count = article.content.split(/\s+/).length;
            } catch (aiErr) { console.error('OpenAI error:', aiErr.message); }
          } else if (genAI) {
            try {
              const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
              const result = await model.generateContent(prompt);
              article.content = result.response.text();
              article.word_count = article.content.split(/\s+/).length;
            } catch (gemErr) { console.error('Gemini error:', gemErr.message); }
          }

          const slug = `${slugify(article.title, { lower: true, strict: true }).substring(0, 80)}-${Date.now()}`;
          await supabase.from('bw_articles').insert({
            error_id: error.id, bank_id: error.bank_id,
            title: article.title, slug, content: article.content, excerpt: article.excerpt,
            meta_description: article.metaDescription, category: article.category,
            keywords: article.keywords, seo_score: 78, word_count: article.content.split(/\s+/).length,
            status: 'published', featured: false, published_at: new Date().toISOString(),
          });
          await new Promise(r => setTimeout(r, 300)); // slight throttle
        } catch (e) { console.error(`Failed to generate article for error ${error.id}:`, e.message); }
      }
    })().catch(console.error);

  } catch(e) { res.status(500).json({ error: e.message }); }
});

export default app;

// Start server when run directly (local dev)
if (process.argv[1] && process.argv[1].includes('index.js')) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ API server running on http://localhost:${PORT}/api`);
  });
}
