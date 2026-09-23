// In-Body Same-Bank Interlinker Engine
import { getSameBankRelated } from './relatedGuides.js';

// Clean title helper (strips [1], [2], etc.)
export function cleanTitle(title) {
  return String(title || '').replace(/\[\d+\]/g, '').trim();
}

// Dictionary of high-relevance keyword triggers mapped to same-bank guides
export const TRIGGER_MAP = {
  // ── CHASE BANK GUIDES ──
  'chase-online-banking-not-working-on-chrome': [
    'Google Chrome', 'Chrome browser', 'Chrome'
  ],
  'chase-app-biometrics-face-id-stopped-working': [
    'Face ID', 'biometric login', 'biometrics'
  ],
  'chase-app-developer-options-android-crash': [
    'Developer Options', 'USB debugging'
  ],
  'chase-not-sending-otp-verification-text': [
    'OTP verification', 'verification code', 'one-time passcode', 'OTP text', 'SMS verification'
  ],
  'chase-two-factor-authentication-broken-phone': [
    'broken phone 2FA', 'two-factor authentication with a broken phone'
  ],
  'chase-visa-secure-otp-code-not-arriving': [
    'Visa Secure OTP', 'Visa Secure code', 'Visa verification code'
  ],
  'chase-check-deposit-funds-on-hold-regulation-cc': [
    'Regulation CC', 'funds on hold', 'check hold'
  ],
  'chase-quickdeposit-stuck-on-processing': [
    'QuickDeposit', 'mobile check deposit stuck'
  ],
  'chase-zelle-exceeded-sending-limit-rules': [
    'Zelle sending limit', 'Zelle limit', 'sending limit'
  ],
  'chase-zelle-payment-pending-review-how-long': [
    'Zelle pending review', 'Zelle payment pending', 'Zelle transfer'
  ],
  'chase-account-locked-suspicious-activity': [
    'account locked', 'suspicious activity', 'locked out'
  ],
  'chase-debit-card-chip-malfunction-reader-error': [
    'chip malfunction', 'chip reader'
  ],
  'chase-atm-didnt-dispense-cash-account-debited': [
    "ATM didn't dispense cash", 'ATM failed to dispense'
  ],
  'chase-error-code-99-login-failed': [
    'Error Code 99', 'Error 99'
  ],
  'chase-error-code-53004-97008-external-account-linking': [
    'Error Code 53004', 'Error 53004', 'Error 97008'
  ],
  'chase-quickbooks-plaid-error-350-sync-failed': [
    'QuickBooks Plaid Error 350', 'Error 350', 'Plaid Error 350'
  ],
  'chase-direct-deposit-not-showing-up-early': [
    'early direct deposit', 'direct deposit'
  ],
  'chase-app-crashes-immediately-after-opening-ios': [
    'app crashes', 'app crash', 'crashing on iOS'
  ],
  'chase-app-unable-to-authenticate': [
    'unable to authenticate', 'authentication failure'
  ],
  'chase-wire-transfer-status-action-required': [
    'wire transfer', 'wire status'
  ],
  'chase-part-of-our-site-isnt-working-right-now': [
    "part of our site isn't working right now", 'part of our site is not working right now', 'server outage'
  ],

  // ── BANK OF AMERICA GUIDES ──
  'bank-of-america-safepass-not-sending-code-to-phone': [
    'SafePass', 'SafePass code', 'SafePass verification', 'SafePass SMS'
  ],
  'bank-of-america-online-id-not-recognized-after-password-change': [
    'Online ID', 'unrecognized Online ID'
  ],
  'bank-of-america-login-error-code-900': [
    'Error Code 900', 'BofA Error 900', 'Error 900'
  ],
  'bank-of-america-app-face-id-not-working-blank-screen': [
    'Face ID', 'biometric login'
  ],
  'bank-of-america-erica-not-working-how-to-turn-off': [
    'Erica', 'virtual assistant Erica'
  ],
  'bank-of-america-lock-debit-card-feature-not-turning-on': [
    'Lock Debit Card', 'lock debit card'
  ],
  'bank-of-america-travel-notice-retired-card-blocked-abroad': [
    'travel notice', 'travel notices retired'
  ],
  'bank-of-america-debit-card-declined-have-available-funds': [
    'card declined', 'debit card declined'
  ],
  'bank-of-america-mobile-check-deposit-funds-on-hold-reg-cc': [
    'Regulation CC', 'Reg CC', 'check hold'
  ],
  'bank-of-america-zelle-payment-blocked-pending-review': [
    'Zelle blocked', 'Zelle pending', 'Zelle transfer'
  ],
  'bank-of-america-app-white-screen-stuck-on-loading': [
    'white screen', 'stuck on loading'
  ],
  'bank-of-america-app-session-interruption-label-error': [
    'session interruption', 'session timed out'
  ],
  'bank-of-america-wire-transfer-domestic-routing-number-vs-ach': [
    'domestic wire routing number', 'routing number vs ACH'
  ],
  'what-time-does-bank-of-america-direct-deposit-hit-schedule': [
    'direct deposit hit', 'direct deposit schedule'
  ],
  'bank-of-america-online-banking-not-available-at-this-time': [
    'online banking is not available', 'temporarily unavailable'
  ]
};

/**
 * Safely replaces the first occurrence of a keyword phrase with a markdown link in a text block,
 * line-by-line avoiding headings, code blocks, tables, blockquotes, and existing markdown links.
 */
function linkPhraseInText(text, phrase, url) {
  if (!text) return { text, linked: false };

  const lines = text.split('\n');
  let linked = false;
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\b(${escaped})\\b`, 'i');

  const newLines = lines.map(line => {
    if (linked) return line;

    // Skip headings, code fences, tables, or blockquotes
    if (/^\s*#{1,6}\s/.test(line) || /^\s*```/.test(line) || /^\s*\|/.test(line) || /^\s*>/.test(line)) {
      return line;
    }

    // Check if line contains existing markdown links, image tags, code snippets
    const parts = line.split(/(`[^`]+`|!?\[[^\]]*\]\([^)]+\)|<[^>]+>)/g);
    let lineReplaced = false;

    const newParts = parts.map(part => {
      if (lineReplaced || linked) return part;
      if (part.startsWith('`') || part.startsWith('[') || part.startsWith('![') || part.startsWith('<')) {
        return part;
      }
      if (regex.test(part)) {
        lineReplaced = true;
        linked = true;
        return part.replace(regex, `[$1](${url})`);
      }
      return part;
    });

    return newParts.join('');
  });

  return { text: newLines.join('\n'), linked };
}

/**
 * Injects same-bank internal links into an article's markdown content:
 * 1. Natural in-text keyword links across body paragraphs (up to 2).
 * 2. An editorial callout box pointing to a high-relevance companion guide.
 */
export function injectInBodyInterlinks(content, currentArticle, allArticles) {
  if (!content || !currentArticle) return content;

  const currentSlug = currentArticle.slug;
  const currentBank = (currentArticle.bank_name || '').toLowerCase().trim();
  const linkedSlugs = new Set([currentSlug]);

  // Extract existing markdown links in content so we never duplicate
  const existingMatches = content.match(/\[[^\]]+\]\(\/guides\/([^)]+)\)/g) || [];
  existingMatches.forEach(m => {
    const slugMatch = m.match(/\/guides\/([^)#?]+)/);
    if (slugMatch) linkedSlugs.add(slugMatch[1]);
  });

  // Candidate pool from the same bank
  const sameBankArticles = allArticles.filter(a => {
    if (a.slug === currentSlug) return false;
    const b = (a.bank_name || '').toLowerCase().trim();
    return b === currentBank && !linkedSlugs.has(a.slug);
  });

  let inTextLinksCount = 0;
  const MAX_IN_TEXT_LINKS = 2;
  let updatedContent = content;

  // 1. Natural In-Text Keyword Linking
  for (const [targetSlug, phrases] of Object.entries(TRIGGER_MAP)) {
    if (inTextLinksCount >= MAX_IN_TEXT_LINKS) break;
    if (linkedSlugs.has(targetSlug)) continue;

    const targetArticle = sameBankArticles.find(a => a.slug === targetSlug);
    if (!targetArticle) continue;

    for (const phrase of phrases) {
      if (phrase.length < 3) continue;

      const res = linkPhraseInText(updatedContent, phrase, `/guides/${targetSlug}`);
      if (res.linked) {
        updatedContent = res.text;
        linkedSlugs.add(targetSlug);
        inTextLinksCount++;
        break;
      }
    }
  }

  // 2. Inject Editorial Callout Box
  // Retrieve highest scoring companion guide from the same bank not yet linked
  const companions = getSameBankRelated(currentArticle, allArticles, 10);
  const topCompanion = companions.find(c => {
    const b = (c.bank_name || '').toLowerCase().trim();
    return b === currentBank && !linkedSlugs.has(c.slug);
  }) || sameBankArticles.find(c => !linkedSlugs.has(c.slug));

  if (topCompanion) {
    const bankName = currentArticle.bank_name || 'Bank';
    const compTitle = cleanTitle(topCompanion.title);
    const callout = `\n> 💡 **Related ${bankName} Solution:** Encountering related issues? Check our verified fix for [${compTitle}](/guides/${topCompanion.slug}).\n`;

    let paragraphs = updatedContent.split('\n\n');
    let insertIndex = -1;

    // Place after Step 2 or Step 3 in the fixes section
    for (let i = 0; i < paragraphs.length; i++) {
      if (/^###\s+[23]\.\s+/m.test(paragraphs[i])) {
        insertIndex = i + 1;
        break;
      }
    }

    if (insertIndex > 0 && insertIndex < paragraphs.length) {
      paragraphs.splice(insertIndex, 0, callout);
      linkedSlugs.add(topCompanion.slug);
      updatedContent = paragraphs.join('\n\n');
    } else {
      // Fallback: place before FAQ section or near 60% of article
      const faqIndex = paragraphs.findIndex(p => /^##\s+(?:FAQ|Frequently)/i.test(p));
      if (faqIndex > 2) {
        paragraphs.splice(faqIndex - 1, 0, callout);
        linkedSlugs.add(topCompanion.slug);
        updatedContent = paragraphs.join('\n\n');
      } else {
        const mid = Math.floor(paragraphs.length * 0.6);
        paragraphs.splice(mid, 0, callout);
        linkedSlugs.add(topCompanion.slug);
        updatedContent = paragraphs.join('\n\n');
      }
    }
  }

  return updatedContent;
}
