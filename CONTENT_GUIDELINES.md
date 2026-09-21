# BankLoginOnline — Content Guidelines (v1.1)

Applies to every guide on the site, for every institution: national banks, regional banks, online-only banks, fintech/neobank apps, and credit unions. Every new guide and every update passes through this file before publishing. No exceptions.

Throughout this file, `{Bank}` means whichever institution the guide covers.

**How the agent must use this file**

1. Read this file in full before researching or writing.
2. Follow the pipeline in Section 1. Do not skip the research step.
3. Run the Publish Gate (Section 12) on the finished draft. Any FAIL on a hard gate means the article is not published; fix and re-run.
4. Never edit this file as part of an article task.

Hard gates are marked **[HARD]**. Everything else is a quality standard: fix it unless there is a written reason not to.

---

## 1. Pipeline

| Step | Output | Rule |
| --- | --- | --- |
| 1. Brief | institution, institution type, issue category, primary query, 3–6 secondary queries, intent in one sentence | One article = one problem. Run the duplication check in Section 4 before going further. |
| 2. Research | Source ledger (Section 3) | Open the institution's own pages in the browser. No ledger, no draft. |
| 3. Draft | Markdown + frontmatter (Section 11) | Facts come only from the ledger. |
| 4. Audit | PASS/FAIL report from the auditor prompt (Appendix B) | Run as a separate agent/session from the writer. |
| 5. Publish | Page with unique title, meta, canonical, schema | Check the rendered HTML, not just the markdown. |
| 6. Re-verify | Updated `last_verified` date | Every 90 days, or immediately when the institution changes the feature, fee, or app. |

---

## 2. Accuracy rules (this is a YMYL site)

Readers arrive locked out of their money, often stressed, sometimes abroad. A wrong phone number or a made-up menu path does real damage, and it is the fastest way to lose Google's trust in a finance site.

**[HARD] 2.1 Every checkable fact has a source in the ledger.** Phone numbers, SMS short codes, fees, limits, dollar amounts, hold amounts, timeframes, partner networks, product names, and legal rights.

**[HARD] 2.2 Never carry a fact from one institution to another.** A limit, fee, menu name, or policy verified for one bank is unverified for every other bank. Each guide's ledger is built from that institution's own pages, from scratch.

**[HARD] 2.3 Phone numbers and short codes.** Publish only if copied from the institution's own website or app, with source URL and date in the ledger. If it cannot be verified, do not print it. Write "call the number on the back of your card" or "use the number in the {Bank} app" instead. A third-party site printing unverified bank phone numbers is exactly what a scam site looks like.

**[HARD] 2.4 App and website menu paths.** Write tap-by-tap paths only if confirmed from the institution's help pages, official videos, or current app store screenshots. Otherwise describe the destination without inventing the route: "Look for the card lock setting in the card management area of the {Bank} app; the exact menu name changes between versions."

**[HARD] 2.5 No invented internals.** Do not state how an institution's fraud system, risk engine, or back end works unless the institution or card network has published it. Forbidden unless sourced: named internal systems, decline or error codes presented as what this institution returns, claims about GPS tracking or purchase-history analysis. Allowed: "{Bank} says it monitors for unusual activity [source]. It does not publish what triggers a block."

**[HARD] 2.6 No invented numbers.** No "Average fix time: 3–5 minutes", "Account security: 100% intact", "resolution time: 2 minutes", success rates, or user counts unless they come from real site data. Timeframes are allowed only when the institution or a regulation states them.

**[HARD] 2.7 No fabricated people, credentials, or experience.** No invented authors, no certifications a real named person does not hold, no "former systems engineer at tier-1 banks", no "we tested this", "in our experience", or "our technical team" unless it literally happened. See Section 10.

**[HARD] 2.8 No false site claims.** Remove from templates and never write: "Real-time diagnostics", "Server status", "real-time monitoring", "Verified fix", "updated 24/7" unless the feature exists and works. Never write "Funds are FDIC insured" (or NCUA insured) about this site. The site holds no deposits.

**[HARD] 2.9 Outages.** Never state or imply that an institution is currently down. A guide may explain how to check: the institution's status page or official social account (sourced), then Downdetector as a customer-report signal, labelled as such.

**[HARD] 2.10 Reader safety.**
- Never ask for a password, full card number, PIN, or one-time code, and never tell readers to enter one anywhere but the institution's own app or site.
- Never advise workarounds that defeat a security control (forcing a magstripe fallback, bypassing 2FA, sharing credentials, using third-party "unlock" tools).
- Every guide touching declined cards, locked accounts, texts, calls, or login includes one plain sentence on telling a real alert from a phishing attempt.
- When the fix depends on the institution's staff, say so early. Do not pad with steps that cannot work.

**2.11 Say what is unknown.** "{Bank} does not publish its default daily purchase limit. Yours is shown in the app under card settings" is more useful and more expert than an invented range.

**2.12 Customer-reported ranges** are allowed only when labelled: "Customers commonly report holds of around $X at fuel pumps; the amount is set by the merchant, not the bank."

**2.13 Legal and regulatory claims.** State the rule, link the regulator page or eCFR text, and do not give legal advice. Quote deadlines exactly as the source words them (for example, the Regulation E reporting and investigation windows). Never promise an outcome ("the bank must refund you"). Say what the rule requires and where to complain if it is not followed (CFPB for banks, NCUA for federal credit unions).

---

## 3. Source ledger

Goes in the frontmatter of every article. One row per checkable claim.

**Allowed primary sources**
- The institution's own site, help center, fee schedule, account agreement, status page, official app listing and release notes, official social support accounts
- CFPB, FDIC, NCUA, Federal Reserve, OCC, FTC, eCFR
- Card networks and platforms: Visa, Mastercard, Zelle, Apple, Google, Plaid official support pages

**Allowed for symptom discovery only** (never as the source of a fix, number, or fee): Reddit, community forums, app store reviews, Downdetector. Label anything from these as customer reports.

**Not allowed as a source:** other third-party fix sites, AI output, facts verified for a different institution, your own memory of how banks work.

**In the article body:** link at least two claims to their primary source inline, with descriptive anchor text ("{Bank}'s fee schedule"). Every "official help" link goes to the institution's real URL, never to a Google search.

---

## 4. One problem across many banks (duplication rule)

The site covers 30+ institutions and the same problems recur at all of them. Publishing the same article 30 times with the bank name swapped is scaled content abuse. It is the single biggest risk to this site.

**[HARD] 4.1 Bank-specific test.** A `{Bank} + {problem}` guide is only written if the ledger contains at least three facts specific to that institution that change what the reader does: its own feature name, its own menu location, its own limit or fee, its own contact route, its own policy, its own known error text.

**4.2 If it fails the test,** the problem gets one generic guide in the issue hub ("Debit card declined with money in the account: causes and fixes"), and each bank hub links to it. Bank-specific differences go in a short sourced table inside the generic guide, added only as they are verified.

**[HARD] 4.3 No cloned paragraphs.** No paragraph appears in two guides with only the bank name changed. Generic explanations (what a pre-authorization hold is, what Reg E covers) live in one glossary or hub page and are linked, not repeated.

**4.4 Generic device steps** (update the app, clear cache, restart, check date and time, disable VPN) are allowed without a bank source, sourced to Apple/Google support where non-obvious. Maximum two per guide, never as step 1 unless they are the most likely cause, and never as filler to reach a step count.

---

## 5. Institution types

Get the entity right before writing. State it correctly on first mention.

| Type | Rules |
| --- | --- |
| National and regional banks | Use the official consumer brand name. After a merger or rebrand, use the current name and mention the old one once if people still search it. |
| Online-only banks | Same as above. No branch-based advice. Check whether ATM access runs through a network (Allpoint, MoneyPass) and source it. |
| Fintech / neobank apps | These are usually not banks. Say so accurately on first mention, using the company's own disclosure wording for who holds the deposits. Support routes are usually in-app; do not invent phone lines. |
| Credit unions | "Members", not "customers". Insurance is NCUA, not FDIC. Complaints route to NCUA for federal credit unions. Check shared-branching and CO-OP ATM access before mentioning them. |
| Payment networks inside bank apps (Zelle, card networks, wallets) | Separate what the institution controls from what the network controls, and source each side to its owner. |

**Naming and trademarks**
- Bank names are used only to identify the institution the guide is about. No bank logos, no imitation of a bank's colours or UI, no wording that suggests affiliation.
- Official product names are written exactly as the institution writes them, in full on first mention.
- The independence disclaimer stays on every page.

---

## 6. Issue-category playbooks

Each category has elements that must be present. These are minimums, not templates; section order and headings still follow the topic.

| Category | Must include | Key sources |
| --- | --- | --- |
| Login & access | Exact error text if any; difference between wrong credentials, locked profile, and a service problem; the institution's own reset route; phishing line; when only the bank can unlock | Institution help center, status page |
| Security & verification | Which verification methods the institution actually offers (sourced); what to do with no access to the registered phone or email; never suggest bypasses; phishing line | Institution help center, FTC |
| Mobile app problems | Current app version and OS requirement from the store listing; max two generic device steps; website or phone as fallback | App store listing, release notes, Apple/Google support |
| Card & ATM problems | Difference between a bank decline, a merchant/terminal problem, and a card lock; for ATM errors or unauthorized use, the Regulation E process with exact sourced wording; how to reach the institution when the card is the only means of payment | Institution fee schedule and card pages, CFPB, eCFR Reg E |
| Payments & transactions | Which rail (ACH, wire, Zelle, card, check); pending vs posted; deposit holds under Regulation CC where relevant; what is and is not reversible; scam warning for push payments | Institution agreement, CFPB, Zelle, eCFR |
| Account issues | Holds, restrictions, closures, negative balances; what the institution can do without notice per its agreement (sourced); ChexSystems/consumer-report rights where relevant; complaint route | Account agreement, CFPB, FTC |

---

## 7. Article structure

The current layout stays. These are the corrections and the rules for filling it.

**Keep:** H1 → answer block → quick-reference table → why this happens → numbered fix steps → escalation → FAQ → author box → related guides.

**Fix on every article**
- **[HARD]** One H1 only. The template prints it; the markdown body must not repeat it.
- **[HARD]** One byline only, printed by the template. No second "By …" line in the body.
- **[HARD]** Counts match. If the jump link says "6 Solutions", there are six. Better: the template counts steps automatically.
- **[HARD]** FAQ section exists if the template links to it.
- No ASCII box diagrams. Use a table, a numbered list, or a real SVG. If a diagram only restates the paragraph above it, delete it.
- Reading time is calculated from word count.
- `Published` and `Last Updated` differ only when content actually changed. No to-the-minute timestamps.
- No "[2026]" in H1s. A year may go in the title tag only if the guide was verified that year and the topic is time-sensitive.

**Section rules**

| Section | Rule |
| --- | --- |
| Answer block (directly under H1) | 40–60 words. Names the institution, states the cause and the fastest working fix. Must stand alone if quoted with nothing else. |
| Intro | Max 80 words. No scene-setting story. Start from the reader's symptom in their words, with the exact error text if there is one. |
| Quick table | 3–5 rows. Columns: symptom, likely cause, what to do. No "time to fix" column unless sourced. |
| Why it happens | Only causes you can source. Most likely first. |
| Fix steps | Ordered by likelihood, then effort. Each step: what to do, what you should see if it worked, what to do if it didn't. |
| Escalation | When to stop and contact the institution, what to have ready, what staff can do that the reader cannot, and the regulator complaint route if the institution does not respond. |
| FAQ | 4–6 questions from real queries (People Also Ask, autocomplete, forum threads). Answers 40–70 words, first sentence answers directly. |

**Avoid the template footprint**
- Section order and H2 wording follow the topic. A fee explainer does not need "fix steps"; an outage guide does not need a "why it happens" essay.
- H2s are written for this query. No recurring stock labels across guides.
- Length follows the problem: 600 words if that answers it, 1,500 if it needs it. No padding.
- Publish in small batches (5–10 a week), spread across institutions and categories.

---

## 8. SEO

**Keyword and intent**
- One primary query per article, in: title tag, H1, slug, answer block, one H2, meta description. Natural wording, once each.
- Secondary queries become H2s or FAQ questions, phrased as people type them.
- Exact on-screen error text goes in quotes. People paste it into search.

**On-page**
- **[HARD]** Unique `<title>` per guide, under 60 characters, primary query first, brand last.
- **[HARD]** Unique meta description, 140–155 characters, stating cause and fix. No "Wondering…?" openers.
- **[HARD]** Self-referencing canonical, and `og:title`, `og:description`, `og:url` for this page, not the homepage.
- No `meta keywords` tag.
- Slug: short, lowercase, hyphens, `{bank}-{problem}`. No years, no stop-word chains.
- Clean H2/H3 hierarchy; never skip levels; never use headings for styling.
- Images: real, redacted screenshots where possible; descriptive filenames; descriptive alt text; width/height set; WebP/AVIF.

**Links**
- 3–5 contextual internal links in the body: the bank hub, the issue hub, the glossary/generic guide for shared concepts, and sibling guides for the adjacent problem.
- 2–4 external links to primary sources.
- Every new guide is linked from at least two existing pages on publish day.

**Structured data** (JSON-LD, server-rendered)
- `Article` with real `author`, `datePublished`, `dateModified`; `BreadcrumbList`; `FAQPage` matching the visible FAQ exactly.
- Do not add `HowTo` expecting a rich result, and do not add `Review`/`AggregateRating`.

**[HARD] Rendering.** Article text, title, meta, and schema must be in the raw HTML response, not injected by client-side JavaScript. If `curl <url> | grep "<h1"` does not show the guide's H1, the page is not ready.

---

## 9. AEO / GEO (answer engines and AI search)

AI Overviews, ChatGPT, Perplexity, and Copilot lift passages, not pages. Write passages that survive being lifted.

- **Answer first.** The first sentence under each H2 answers that H2.
- **Self-contained passages.** Name the institution and the feature in each section instead of "it" or "this feature".
- **Question-shaped H2s** where the query is a question.
- **Specific, sourced facts.** One sourced fee beats three adjectives. Cited, dated facts are what generative engines prefer to quote.
- **Consistent entity names.** Official institution and product names, in full on first mention, identical across the site.
- **Clean tables and lists.** Simple header row, one fact per cell, no merged cells, no emoji.
- **One-sentence definitions** when a term is introduced, linking to the glossary.
- **Visible freshness.** "Last verified: Month YYYY" near the top, matching `dateModified`.
- **Crawl access.** Do not block Googlebot, Bingbot, OAI-SearchBot, GPTBot, PerplexityBot, or ClaudeBot. Most AI crawlers do not run JavaScript, which is one more reason for the rendering gate.
- **About and editorial-policy pages** stating who runs the site, how guides are researched, and how to report an error.

---

## 10. Voice and authorship

**Voice.** Write like someone who worked a bank support desk for years and is explaining the fix to a friend: calm, specific, slightly blunt, never showing off. The same voice for every institution.

**Do**
- Second person, present tense, plain verbs, contractions.
- Lead with what to do. Explain why only as far as it helps the reader decide.
- Use the words on the reader's screen.
- Admit limits: "If this doesn't clear it, nothing on your side will. Call the bank."
- Let sentence and paragraph length vary naturally.

**Don't**
- Scene-setting openers ("You're at the checkout and…").
- Jargon the reader does not need: telemetry, heuristics, paradigm, architecture, risk engine, ledger, token, gateway, triage. If a term is needed, define it once in plain words.
- Hype and drama: crucial, critical, instantly, seamlessly, exorbitant, vastly, virtually impossible, exclamation marks.
- Filler: "In today's digital world", "Here is why", "It's important to note", "Do not panic", "Few situations are more frustrating than", "Whether you're X or Y", "In conclusion", "We hope this helps".
- Stock vocabulary: delve, navigate (figurative), landscape, realm, robust, leverage, streamline, comprehensive, ensure, empower, unlock, elevate, game-changer, hassle-free.
- Reflex triplets ("fast, simple, and secure") and "not just X but Y" constructions.
- More than one em dash per 300 words.
- Bold for emphasis. Bold is for UI labels the reader must find (**Lock Card**) and nothing else.
- Emoji in body copy or headings.
- Phone scripts that sound like a machine. Give plain words: "My card was declined and I think there's a fraud block on it."
- Closing summaries that repeat the article.

**Test:** read it aloud. Anything you would not say across a counter to a customer gets rewritten.

**Authorship.** Invented experts are not allowed (2.7). Use one of:
1. **Editorial byline** ("BankLoginOnline Editorial Team") linked to an editorial-policy page covering research method, accepted sources, re-verification schedule, and error reporting.
2. **Real named person** with a true, modest bio.
3. **Real paid reviewer** with a verifiable credential, named with permission. "Reviewed by" appears only on articles that person actually read.

If AI tools are used in drafting, the editorial-policy page says so in one plain sentence.

---

## 11. Frontmatter and metadata hygiene

```yaml
---
title: "{Bank} {Problem}: Why It Happens and How to Fix It"   # <60 chars
meta_description: "One sentence on the cause, one on the fix. 140–155 characters."
slug: bank-name-problem
institution: bank-name
institution_type: national-bank   # national-bank | regional-bank | online-bank | fintech | credit-union
issue_category: card-atm-problems
primary_query: ""
secondary_queries: []
error_text: ""                    # exact on-screen wording, if any
author: editorial-team            # must map to a real entity (Section 10)
reviewed_by: null                 # only a real person who read it
published: YYYY-MM-DD
updated: YYYY-MM-DD
last_verified: YYYY-MM-DD
bank_specific_facts:              # at least 3, or this becomes a generic guide (Section 4)
  - ""
sources:
  - claim: ""
    url: ""
    checked: YYYY-MM-DD
unverified_removed:               # things the writer wanted to say but could not source
  - ""
---
```

**Hygiene rules**
- **[HARD]** No generation artifacts in published output: prompt text, "Here is the article", "As an AI", "Certainly!", placeholder brackets, unfilled `{Bank}` tokens, TODOs, model names, citation tokens, stray `**` or `\[` escapes.
- **[HARD]** No `generator` meta tag, HTML comment, or rendered field naming an AI tool or model. `sources`, `bank_specific_facts`, and `unverified_removed` are build-time only.
- Remove "AI-powered" from the site title, meta description, OG tags, and footer unless that is the intended brand position.
- Images are compressed through the build pipeline (which also strips EXIF).

---

## 12. Publish Gate

Run on the rendered page and the markdown. Any hard FAIL blocks publishing.

**Hard gates**
- [ ] Every number, fee, limit, phone number, short code, network, and legal claim has a ledger row from this institution's own pages or a regulator (2.1–2.3)
- [ ] Every menu path is sourced or written generically (2.4)
- [ ] No unsourced claims about internal systems; no invented metrics, badges, outage claims, or insurance language (2.5, 2.6, 2.8, 2.9)
- [ ] No fabricated author, credential, or first-hand claim (2.7)
- [ ] No advice that exposes credentials or defeats a security control; phishing line present where relevant (2.10)
- [ ] At least three bank-specific facts; no paragraph cloned from another guide (4.1, 4.3)
- [ ] Institution type stated correctly; official names used (5)
- [ ] Category minimums from Section 6 present
- [ ] One H1, one byline, counts match, FAQ present (7)
- [ ] Unique title, meta description, canonical, OG tags for this URL (8)
- [ ] Article text and schema present in raw HTML (8)
- [ ] No generation artifacts, unfilled placeholders, or AI tool metadata (11)

**Quality gates**
- [ ] Answer block is 40–60 words, names the institution, stands alone
- [ ] First sentence under every H2 answers the H2
- [ ] Primary query in title, H1, slug, answer block, one H2, meta
- [ ] 3–5 contextual internal links, 2–4 primary-source external links
- [ ] Max two generic device steps, none used as filler
- [ ] FAQ: 4–6 real questions, 40–70 word answers
- [ ] Zero banned words or patterns from Section 10
- [ ] H2 wording and section order not copied from the previous article
- [ ] No sentence could be deleted without losing information
- [ ] Read-aloud test passed
- [ ] `last_verified` set; next check scheduled within 90 days

---

## Appendix A — Writer prompt

```
You are writing one troubleshooting guide for BankLoginOnline, an independent help
site for customers of US banks, fintech apps, and credit unions. Follow
CONTENT_GUIDELINES.md exactly. Where this prompt and that file disagree, the file wins.

INPUTS
Institution: {institution}
Institution type: {institution_type}
Issue category: {issue_category}
Problem: {problem}
Primary query: {primary_query}
Secondary queries: {secondary_queries}
Exact error text, if any: {error_text}

STEP 0 — DUPLICATION CHECK
List existing guides on the site for the same problem at other institutions.
You may not reuse their facts, paragraphs, or headings.

STEP 1 — RESEARCH (before writing a word)
Open this institution's official help pages, fee schedule, account agreement, status
page, and app store listing in the browser. Open any regulator page that applies.
Build the source ledger: one row per fact, with URL and today's date.
Use forums only to learn how customers describe the symptom.
If a fact has no primary source, add it to unverified_removed and do not use it.
List the bank-specific facts. If there are fewer than three, STOP and report:
"Fails bank-specific test. Recommend generic guide or addition to existing one."

STEP 2 — WRITE
Reader: a stressed customer on a phone who wants their money accessible again.
Voice: an experienced bank support person talking to a friend. Plain, specific, calm.
State the institution type correctly on first mention. Use official product names.
The template supplies the H1 and byline, so start the body with the 40–60 word
answer block. Choose sections and order to suit this problem and meet the Section 6
minimums for this category. Write H2s for this query; no stock headings.
Under every H2, answer in the first sentence.
Each fix step: what to do, what success looks like, what to do if it fails.
Say plainly what the institution does not publish. Never fill a gap with a guess.
No phone number, short code, fee, limit, or menu path unless it is in the ledger.
No claims about internal systems unless the institution published them.
No outage claims, no first-hand claims, no credentials, no invented metrics.
Max two generic device steps. No word or pattern from the Section 10 "Don't" list.
Length: as long as the problem needs and no longer.

STEP 3 — OUTPUT
Return only the markdown file: complete frontmatter per Section 11, then the body.
No commentary. No H1 in the body. No byline in the body. No unfilled placeholders.
```

## Appendix B — Auditor prompt (run in a separate session)

```
You are the publishing gate for BankLoginOnline. You did not write this article and
you gain nothing by passing it. Read CONTENT_GUIDELINES.md, then the draft below.

1. List every checkable fact in the body (numbers, fees, limits, phone numbers, short
   codes, menu paths, network names, legal claims, statements about internal
   systems). For each: is there a ledger row? Is the source this institution's own
   page or a regulator? Open the URL. Does the page say this today?
   Mark VERIFIED, NOT IN SOURCE, WRONG INSTITUTION, or NO SOURCE.
2. Compare against existing guides for the same problem at other institutions.
   Quote any paragraph or heading that is the same with the name swapped.
   Confirm at least three bank-specific facts that change what the reader does.
3. Check every hard gate in Section 12. Quote the offending text for each failure.
4. Check every quality gate. Quote the offending text.
5. Flag every sentence that could be deleted with no loss of information.
6. Flag every Section 10 violation with the exact phrase.

Return JSON only:
{
  "verdict": "PASS" | "FAIL",
  "hard_failures": [{"gate": "", "quote": "", "fix": ""}],
  "fact_check": [{"claim": "", "status": "", "note": ""}],
  "duplication": [{"other_guide": "", "quote": ""}],
  "quality_issues": [{"rule": "", "quote": "", "fix": ""}],
  "cut_list": [""]
}
Verdict is FAIL if hard_failures is non-empty, any fact is not VERIFIED, or
duplication is non-empty. Do not rewrite the article. Do not soften findings.
```
