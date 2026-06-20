import { Outlet, Link, NavLink } from 'react-router-dom';
import { Building2, Menu, X } from 'lucide-react';
import { useState } from 'react';
import '../public.css';

const BANKS_NAV = [
  { label: 'Chase', slug: 'chase' },
  { label: 'Bank of America', slug: 'bank-of-america' },
  { label: 'Wells Fargo', slug: 'wells-fargo' },
  { label: 'Citibank', slug: 'citibank' },
  { label: 'Capital One', slug: 'capital-one' },
];

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

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
            <NavLink to="/banks">Banks</NavLink>
            <NavLink to="/articles">Fix Guides</NavLink>
            <NavLink to="/outages">Live Outages</NavLink>
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
          {['Chase', 'Bank of America', 'Wells Fargo', 'Citibank', 'Capital One', 'Chime', 'Ally Bank', 'USAA', 'US Bank', 'PNC'].map(bank => (
            <Link key={bank} to={`/banks?q=${encodeURIComponent(bank)}`}
              style={{ whiteSpace: 'nowrap', padding: '8px 14px', fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.75)', textDecoration: 'none', borderRadius: '4px', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.color = 'white'; }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'rgba(255,255,255,0.75)'; }}
            >
              {bank}
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
                {['Chase', 'Bank of America', 'Wells Fargo', 'Citibank', 'Capital One'].map(b => (
                  <li key={b}><Link to={`/banks?q=${encodeURIComponent(b)}`}>{b}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="pub-footer-heading">Common Errors</div>
              <ul>
                <li><a href="#">Login Not Working</a></li>
                <li><a href="#">2FA Code Not Received</a></li>
                <li><a href="#">Transfer Failed</a></li>
                <li><a href="#">App Crashing</a></li>
                <li><a href="#">Account Locked</a></li>
              </ul>
            </div>
            <div>
              <div className="pub-footer-heading">About</div>
              <ul>
                <li><a href="#">How It Works</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Disclaimer</a></li>
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
