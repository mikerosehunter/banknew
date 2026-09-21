import { Shield, BookOpen, CheckCircle, RefreshCw, AlertCircle, Mail, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EditorialPolicy() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Editorial Policy — BankLoginOnline",
    "description": "Our editorial standards, verification process, source hierarchy, and factual review guidelines.",
    "url": "https://bankloginonline.com/editorial-policy",
    "publisher": {
      "@type": "Organization",
      "name": "BankLoginOnline",
      "url": "https://bankloginonline.com"
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero Header */}
      <section style={{ background: 'linear-gradient(135deg, #0b1528 0%, #1e3a8a 100%)', color: 'white', padding: '64px 24px 72px' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.12)', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>
            <Shield size={14} className="text-emerald-400" />
            <span>Content Integrity & Standards</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 4vw, 44px)', fontFamily: 'Merriweather, serif', fontWeight: 900, lineHeight: 1.25, marginBottom: '16px' }}>
            Editorial Policy & Verification Standards
          </h1>
          <p style={{ fontSize: '18px', color: '#cbd5e1', lineHeight: 1.6, maxWidth: '680px', margin: '0 auto' }}>
            How we research, verify, write, and maintain independent troubleshooting guides for US banking consumers.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div style={{ maxWidth: '820px', margin: '-32px auto 0', padding: '0 24px' }}>
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)', padding: '40px 48px' }}>
          
          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '24px', marginBottom: '32px' }}>
            <p style={{ fontSize: '16px', color: '#334155', lineHeight: 1.7, margin: 0 }}>
              BankLoginOnline is an independent educational technology publication dedicated to diagnosing and troubleshooting online banking errors, mobile application crashes, authentication blocks, and payment transfer issues. We are not a financial institution, bank, or broker, and we do not provide legal or financial advice.
            </p>
          </div>

          {/* Section 1: Research Methodology */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BookOpen size={20} className="text-blue-600" />
              1. Primary Source Research
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7 }}>
              Every guide on BankLoginOnline is built from official primary sources. We verify checkable facts directly against the institution's own published documentation before a guide is drafted.
            </p>
            <div style={{ background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '18px 20px', marginTop: '14px' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a', marginBottom: '8px' }}>Accepted Primary Sources:</div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#475569', lineHeight: 1.7 }}>
                <li>Official financial institution websites, customer agreements, and schedule of fees.</li>
                <li>Official mobile app store listings, technical requirements, and published release notes.</li>
                <li>Federal regulatory frameworks and statutes (CFPB, FDIC, NCUA, Federal Reserve, eCFR Regulation E, Regulation CC).</li>
                <li>Direct clearing house and payment network rules (Visa, Mastercard, NACHA, Zelle, The Clearing House).</li>
              </ul>
            </div>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, marginTop: '12px' }}>
              Community forums (such as Reddit or user reviews) and outage aggregators (such as Downdetector) are used solely to discover symptoms and real user phrasing. They are never used as factual sources for fees, limits, phone numbers, or technical procedures.
            </p>
          </section>

          {/* Section 2: Reader Safety & Security Protocols */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={20} className="text-emerald-600" />
              2. Reader Safety & Credential Protection
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7 }}>
              Readers often arrive at our site during stressful situations—locked out of funds or unable to complete urgent transactions. We enforce strict safety principles:
            </p>
            <ul style={{ paddingLeft: '20px', fontSize: '15px', color: '#475569', lineHeight: 1.7 }}>
              <li><strong>Zero Credential Collection:</strong> We never ask for passwords, full account numbers, debit card PINs, or one-time verification codes (OTP). We will never ask you to enter credentials on our site.</li>
              <li><strong>Security Bypass Prohibition:</strong> We never recommend workarounds that weaken security controls, such as bypassing two-factor authentication, using third-party credential unlockers, or forcing unencrypted fallbacks.</li>
              <li><strong>Phishing Awareness:</strong> All guides addressing account locks, alerts, or text messages include guidance to distinguish legitimate bank communications from phishing attacks.</li>
              <li><strong>Direct Contact Verification:</strong> Phone numbers are published only if copied from the institution's official verified pages. When unverified, we advise readers to call the number printed directly on the physical back of their debit or credit card.</li>
            </ul>
          </section>

          {/* Section 3: Authorship & AI Disclosure */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={20} className="text-blue-600" />
              3. Authorship & AI Transparency
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7 }}>
              Articles published by the <strong>BankLoginOnline Editorial Team</strong> undergo structured research against official banking documentation.
            </p>
            <div style={{ background: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe', padding: '16px 20px', marginTop: '12px' }}>
              <p style={{ fontSize: '14px', color: '#1e3a8a', lineHeight: 1.6, margin: 0 }}>
                <strong>Editorial Disclosure:</strong> Computer-assisted research and language tools may be utilized in drafting structural outlines and syntactic formatting, but all facts, regulatory references, fee schedules, and troubleshooting steps are verified against primary institutional sources.
              </p>
            </div>
          </section>

          {/* Section 4: Re-Verification Schedule */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <RefreshCw size={20} className="text-sky-600" />
              4. 90-Day Re-Verification Cycle
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7 }}>
              Mobile banking apps receive frequent updates, operating systems retire older TLS protocols, and banks adjust fee schedules. To maintain accuracy:
            </p>
            <ul style={{ paddingLeft: '20px', fontSize: '15px', color: '#475569', lineHeight: 1.7 }}>
              <li>Every published guide is flagged for re-verification every 90 days.</li>
              <li>When an institution updates its digital banking interface, mobile app version, or customer agreement, affected guides are prioritized for immediate review.</li>
              <li>The "Last Verified" date on each article reflects the most recent factual audit of its claims and steps.</li>
            </ul>
          </section>

          {/* Section 5: Corrections & Error Reporting */}
          <section style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={20} className="text-amber-500" />
              5. Corrections and Error Reporting
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7 }}>
              If you discover an outdated menu path, a changed phone number, or a factual error in any guide, please contact our editorial desk immediately. We review reports and apply corrections promptly.
            </p>
            <div style={{ marginTop: '16px' }}>
              <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
                <Mail size={16} /> Report an Inaccuracy or Contact Us
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
