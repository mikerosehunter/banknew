import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { Building2, Menu, X } from 'lucide-react';
import { useState } from 'react';
import '../public.css';

const BANKS_NAV = [
  { label: 'Chase', slug: 'jpmorgan-chase-bank' },
  { label: 'Bank of America', slug: 'bank-of-america' },
  { label: 'Wells Fargo', slug: 'wells-fargo-bank' },
  { label: 'Citibank', slug: 'citibank' },
  { label: 'Capital One', slug: 'capital-one-bank' },
  { label: 'U.S. Bank', slug: 'us-bank' },
  { label: 'PNC Bank', slug: 'pnc-bank' },
  { label: 'Chime', slug: 'chime' },
  { label: 'Ally Bank', slug: 'ally-bank' }
];

const TOPICS_NAV = [
  { label: 'Login Not Working', slug: 'login-access-problems' },
  { label: 'App Crashing', slug: 'mobile-app-problems' },
  { label: 'Transfer Failed', slug: 'failed-transaction-issues' },
  { label: 'Account Locked', slug: 'account-closure-issues' },
  { label: '2FA Problems', slug: 'security-verification-issues' }
];

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  return (
    <div className="public-site">
      {/* Header */}
      <header className="pub-header">
        <div className="pub-header-inner">
          <Link to="/" className="pub-logo">
            <div className="pub-logo-icon">🏦</div>
            <span className="pub-logo-text">Bank<span>Login</span>Online</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="pub-nav" style={{ display: 'flex' }}>
            <NavLink to="/">Home</NavLink>
            {isHome ? <a href="#all-banks">Banks</a> : <Link to="/#all-banks">Banks</Link>}
            {isHome ? <a href="#latest-guides">Fix Guides</a> : <Link to="/#latest-guides">Fix Guides</Link>}
            <NavLink to="/banks/bank-outages-support">Live Outages</NavLink>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/admin" style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'none' }}>
              Admin ↗
            </Link>
            <button onClick={() => setMenuOpen(v => !v)} className="pub-nav" style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Secondary nav bar */}
      <div style={{ background: '#1e3a8a', color: 'white' }}>
        <div className="pub-container" style={{ display: 'flex', gap: '4px', overflowX: 'auto', padding: '0 24px' }}>
          {BANKS_NAV.map(bank => (
            <Link key={bank.slug} to={`/banks/${bank.slug}`}
              style={{ whiteSpace: 'nowrap', padding: '8px 14px', fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.75)', textDecoration: 'none', borderRadius: '4px', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.color = 'white'; }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'rgba(255,255,255,0.75)'; }}
            >
              {bank.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Page Content */}
      <Outlet />

      {/* Footer */}
      <footer className="pub-footer">
        <div className="pub-footer-inner">
          <div className="pub-footer-grid">
            <div>
              <div className="pub-footer-logo">Bank<span>Login</span>Online</div>
              <p className="pub-footer-desc">
                Real-time monitoring of US bank login errors, app crashes, and service outages. AI-powered fix guides updated 24/7.
              </p>
            </div>
            <div>
              <div className="pub-footer-heading">Top Banks</div>
              <ul>
                {BANKS_NAV.slice(0, 5).map(b => (
                  <li key={b.slug}><Link to={`/banks/${b.slug}`}>{b.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="pub-footer-heading">Common Errors</div>
              <ul>
                {TOPICS_NAV.map(t => (
                  <li key={t.slug}><Link to={`/banks/${t.slug}`}>{t.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="pub-footer-heading">About</div>
              <ul>
                <li><Link to="/">How It Works</Link></li>
                <li><Link to="/">Privacy Policy</Link></li>
                <li><Link to="/">Disclaimer</Link></li>
                <Link to="/admin" style={{ color: '#475569', fontSize: '14px', textDecoration: 'none' }}>Admin</Link>
              </ul>
            </div>
          </div>
          <div className="pub-footer-bottom">
            <div>© {new Date().getFullYear()} BankLoginOnline.com · For educational purposes only</div>
            <div>Not affiliated with any bank. Funds are FDIC insured.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
