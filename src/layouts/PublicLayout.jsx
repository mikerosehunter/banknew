import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { Building2, Menu, X, ChevronRight, ShieldCheck, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
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

  // Automatically close mobile menu when navigating
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="public-site" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', color: '#1e293b' }}>
      {/* Header */}
      <header className="pub-header">
        <div className="pub-header-inner">
          <Link to="/" className="pub-logo">
            <div className="pub-logo-icon">🏦</div>
            <span className="pub-logo-text">Bank<span>Login</span>Online</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="pub-nav pub-nav-desktop">
            <NavLink to="/">Home</NavLink>
            {isHome ? <a href="#all-banks">Banks</a> : <Link to="/#all-banks">Banks</Link>}
            {isHome ? <a href="#latest-guides">Fix Guides</a> : <Link to="/#latest-guides">Fix Guides</Link>}
            <NavLink to="/about">About</NavLink>
            <NavLink to="/editorial-policy">Editorial Policy</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>

          {/* Mobile Toggle Button */}
          <div className="pub-header-actions">
            <button 
              onClick={() => setMenuOpen(v => !v)} 
              className="pub-mobile-toggle"
              aria-label="Toggle Navigation Menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {menuOpen && (
          <div className="pub-mobile-menu">
            <div className="pub-mobile-menu-inner">
              <nav className="pub-mobile-links">
                <NavLink to="/" onClick={() => setMenuOpen(false)}>🏠 Home</NavLink>
                {isHome ? (
                  <a href="#all-banks" onClick={() => setMenuOpen(false)}>🏦 Browse Banks</a>
                ) : (
                  <Link to="/#all-banks" onClick={() => setMenuOpen(false)}>🏦 Browse Banks</Link>
                )}
                {isHome ? (
                  <a href="#latest-guides" onClick={() => setMenuOpen(false)}>🛠️ Troubleshooting Guides</a>
                ) : (
                  <Link to="/#latest-guides" onClick={() => setMenuOpen(false)}>🛠️ Troubleshooting Guides</Link>
                )}
                <NavLink to="/about" onClick={() => setMenuOpen(false)}>👥 About Research Team</NavLink>
                <NavLink to="/editorial-policy" onClick={() => setMenuOpen(false)}>📋 Editorial Policy</NavLink>
                <NavLink to="/contact" onClick={() => setMenuOpen(false)}>✉️ Contact Editorial Desk</NavLink>
              </nav>

              <div className="pub-mobile-section">
                <div className="pub-mobile-section-title">Major US Banks</div>
                <div className="pub-mobile-bank-grid">
                  {BANKS_NAV.map(b => (
                    <Link 
                      key={b.slug} 
                      to={`/banks/${b.slug}`} 
                      onClick={() => setMenuOpen(false)}
                      className="pub-mobile-bank-item"
                    >
                      {b.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pub-mobile-section">
                <div className="pub-mobile-section-title">Common Banking Issues</div>
                <div className="pub-mobile-topics">
                  {TOPICS_NAV.map(t => (
                    <Link 
                      key={t.slug} 
                      to={`/issues/${t.slug}`} 
                      onClick={() => setMenuOpen(false)}
                      className="pub-mobile-topic-item"
                    >
                      <span>📌</span> {t.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Secondary Quick Bank Bar */}
      <div className="pub-bank-bar">
        <div className="pub-container pub-bank-bar-inner">
          {BANKS_NAV.map(bank => (
            <Link 
              key={bank.slug} 
              to={`/banks/${bank.slug}`}
              className="pub-bank-bar-link"
            >
              {bank.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Page Content */}
      <div className="pub-main-outlet" style={{ flex: 1, width: '100%', backgroundColor: '#ffffff' }}>
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="pub-footer">
        <div className="pub-footer-inner">
          <div className="pub-footer-grid">
            <div className="pub-footer-brand-col">
              <div className="pub-footer-logo">Bank<span>Login</span>Online</div>
              <p className="pub-footer-desc">
                Independent step-by-step troubleshooting guides for US banking login issues, mobile app errors, and account access problems.
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8', background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '6px', marginTop: '12px' }}>
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Verified Independent Intelligence</span>
              </div>
            </div>
            <div>
              <div className="pub-footer-heading">Top Banks</div>
              <ul>
                {BANKS_NAV.slice(0, 6).map(b => (
                  <li key={b.slug}><Link to={`/banks/${b.slug}`}>{b.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="pub-footer-heading">Common Errors</div>
              <ul>
                {TOPICS_NAV.map(t => (
                  <li key={t.slug}><Link to={`/issues/${t.slug}`}>{t.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="pub-footer-heading">Company & Trust</div>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/editorial-policy">Editorial Policy</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                <li><Link to="/disclaimer">Banking Disclaimer</Link></li>
              </ul>
            </div>
          </div>
          <div className="pub-footer-bottom">
            <div>© {new Date().getFullYear()} BankLoginOnline.com — Independent Banking Troubleshooting Guides · For educational purposes only</div>
            <div>Independent support directory. Not affiliated with, endorsed by, or sponsored by any financial institution.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
