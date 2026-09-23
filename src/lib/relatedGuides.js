// Same-bank companion scoring and internal linking helper

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'chase', 'bank', 'america', 'bofa', 'online', 'error', 'code', 'guide', 'fix',
  'step', 'steps', 'troubleshooting', 'how', 'what', 'when', 'from', 'your',
  'account', 'banking', 'problem', 'issues', 'issue', 'not', 'working'
]);

const COMPANION_RULES = [
  {
    keys: ['login', 'sign-in', 'password', 'lockout', 'locked', 'access', 'suspended', 'credentials', 'username'],
    bonusKeys: ['otp', '2fa', 'sms', 'safepass', 'verification', 'device', 'session', 'security', 'authenticator', 'unrecognized']
  },
  {
    keys: ['otp', '2fa', 'sms', 'safepass', 'authenticator', 'push', 'verification', 'code'],
    bonusKeys: ['login', 'sign-in', 'password', 'device', 'phone', 'number', 'lockout', 'access']
  },
  {
    keys: ['app', 'crash', 'crashing', 'ios', 'android', 'update', 'freeze', 'loading', 'white screen', 'erica'],
    bonusKeys: ['login', 'biometric', 'face id', 'fingerprint', 'cache', 'developer options', 'session']
  },
  {
    keys: ['card', 'debit', 'credit', 'declined', 'atm', 'pin', 'chip'],
    bonusKeys: ['limit', 'travel', 'lock', 'replacement', 'fraud', 'hold', 'declined', 'unfreeze']
  },
  {
    keys: ['zelle', 'transfer', 'wire', 'payment', 'limit', 'ach'],
    bonusKeys: ['hold', 'pending', 'review', 'fraud', 'scheduled', 'failed', 'recipient']
  },
  {
    keys: ['deposit', 'check', 'hold', 'funds', 'availability', 'reg cc'],
    bonusKeys: ['transfer', 'balance', 'mobile deposit', 'clear', 'overdraft', 'pending']
  }
];

function extractTokens(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 3 && !STOP_WORDS.has(t));
}

export function getSameBankRelated(currentArticle, allArticles = [], limit = 4) {
  if (!currentArticle || !Array.isArray(allArticles) || allArticles.length === 0) {
    return [];
  }

  const currentBank = (currentArticle.bank_name || '').toLowerCase().trim();
  const currentSlug = currentArticle.slug;
  const currentId = currentArticle.id;
  const currentCategory = (currentArticle.category || '').toLowerCase().trim();

  const currentTitle = (currentArticle.title || '').replace(/\[\d+\]/g, '').trim();
  const currentFullText = `${currentTitle} ${currentArticle.meta_description || ''} ${currentArticle.excerpt || ''}`.toLowerCase();
  const currentTokens = extractTokens(currentTitle);

  // 1. Filter candidates: Same bank preferred, exclude self
  let candidates = allArticles.filter(a => {
    if (a.slug === currentSlug) return false;
    if (currentId && a.id === currentId) return false;
    if (a.status && a.status !== 'published') return false;

    const candBank = (a.bank_name || '').toLowerCase().trim();
    if (currentBank && candBank) {
      return candBank === currentBank || candBank.includes(currentBank) || currentBank.includes(candBank);
    }
    return true;
  });

  // If candidate pool from exact bank is small, broaden to same category
  if (candidates.length < limit) {
    const fallbackCandidates = allArticles.filter(a => {
      if (a.slug === currentSlug || (currentId && a.id === currentId)) return false;
      if (a.status && a.status !== 'published') return false;
      if (candidates.some(c => c.slug === a.slug)) return false;
      return (a.category || '').toLowerCase() === currentCategory;
    });
    candidates = [...candidates, ...fallbackCandidates];
  }

  // 2. Score candidates
  const scored = candidates.map(candidate => {
    let score = 0;
    const candTitle = (candidate.title || '').replace(/\[\d+\]/g, '').trim();
    const candFullText = `${candTitle} ${candidate.meta_description || ''} ${candidate.excerpt || ''}`.toLowerCase();
    const candBank = (candidate.bank_name || '').toLowerCase().trim();

    // Direct bank match bonus
    if (currentBank && candBank && (candBank === currentBank || candBank.includes(currentBank))) {
      score += 100;
    }

    // Category match bonus
    if (candidate.category && candidate.category.toLowerCase() === currentCategory) {
      score += 50;
    }

    // Keyword tokens match bonus
    let tokenMatches = 0;
    for (const token of currentTokens) {
      if (candFullText.includes(token)) {
        score += 15;
        tokenMatches++;
        if (tokenMatches >= 4) break; // cap keyword bonus
      }
    }

    // Companion rule matrix bonus
    for (const rule of COMPANION_RULES) {
      const matchKey = rule.keys.some(k => currentFullText.includes(k));
      if (matchKey) {
        const bonusMatch = rule.bonusKeys.some(bk => candFullText.includes(bk));
        if (bonusMatch) {
          score += 35;
          break;
        }
      }
    }

    return { candidate, score };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(item => item.candidate);
}
