import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Lock, EyeOff, Server, Globe, Mail, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
  const lastUpdated = 'September 19, 2026';

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Page Header */}
      <div className="pub-hero" style={{ padding: '50px 0 40px', minHeight: 'auto', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div className="pub-hero-inner" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#94a3b8', fontSize: '14px' }}>
            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <span style={{ color: '#f8fafc' }}>Privacy Policy</span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(59,130,246,0.4)', padding: '4px 12px', borderRadius: '999px', color: '#93c5fd', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
            <ShieldCheck size={14} /> Official Policy & Data Governance
          </div>

          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 12px' }}>
            Privacy Policy
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '16px', maxWidth: '720px', lineHeight: 1.6, margin: 0 }}>
            How BankLoginOnline collects, protects, and handles information. We operate under a strict zero-credential collection principle.
          </p>

          <div style={{ marginTop: '20px', fontSize: '13px', color: '#64748b' }}>
            Effective & Last Updated: <strong style={{ color: '#cbd5e1' }}>{lastUpdated}</strong>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div style={{ maxWidth: '960px', margin: '40px auto 0', padding: '0 24px' }}>

        {/* Highlight Card: Zero Credential Guarantee */}
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '24px', marginBottom: '32px', display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
          <div style={{ background: '#059669', color: '#ffffff', padding: '10px', borderRadius: '10px', display: 'flex' }}>
            <Lock size={22} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 6px', color: '#065f46', fontSize: '18px', fontWeight: 700 }}>
              Zero Banking Credential Guarantee
            </h3>
            <p style={{ margin: 0, color: '#047857', fontSize: '14.5px', lineHeight: 1.6 }}>
              <strong>BankLoginOnline never requests, intercepts, logs, or stores your banking passwords, usernames, PINs, One-Time Passcodes (OTPs), Social Security Numbers (SSNs), or account numbers.</strong> All troubleshooting guides and resolution workflows published on this platform are strictly educational, client-side diagnostics designed for you to execute independently directly on your financial institution's official domains.
            </p>
          </div>
        </div>

        {/* Content Body Card */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 16px rgba(15,23,42,0.03)' }}>

          {/* Section 1 */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <EyeOff size={20} color="#2563eb" /> 1. Overview and Core Philosophy
            </h2>
            <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px', marginBottom: '12px' }}>
              BankLoginOnline.com ("we," "our," or "the Platform") is an independent consumer technology and banking error monitoring service. We provide real-time status intelligence, diagnostic troubleshooting guides, and technical explanations regarding digital banking outages and mobile application errors.
            </p>
            <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px' }}>
              We recognize the sensitive nature of financial technology and operate under the fundamental principle of data minimization: we only collect the minimum telemetry necessary to deliver, maintain, and secure our website infrastructure.
            </p>
          </section>

          {/* Section 2 */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Server size={20} color="#2563eb" /> 2. Information We Collect
            </h2>
            <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px', marginBottom: '16px' }}>
              We do not require user accounts, logins, or paid subscriptions. You can access all articles and status dashboards without submitting personal identifiers. Information collected is limited to:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 8px', color: '#1e293b', fontSize: '15px', fontWeight: 700 }}>A. Technical & Log Data</h4>
                <p style={{ margin: 0, color: '#64748b', fontSize: '13.5px', lineHeight: 1.6 }}>
                  Standard web server logs including IP addresses (anonymized), browser user-agent, operating system, referring URLs, request timestamps, and page rendering latency.
                </p>
              </div>

              <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 8px', color: '#1e293b', fontSize: '15px', fontWeight: 700 }}>B. Voluntary Communications</h4>
                <p style={{ margin: 0, color: '#64748b', fontSize: '13.5px', lineHeight: 1.6 }}>
                  If you contact our editorial desk via email, we retain your email address and message contents solely to respond to your inquiry or correct reported banking discrepancies.
                </p>
              </div>

              <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 8px', color: '#1e293b', fontSize: '15px', fontWeight: 700 }}>C. Anonymous Feedback</h4>
                <p style={{ margin: 0, color: '#64748b', fontSize: '13.5px', lineHeight: 1.6 }}>
                  Aggregate voting telemetry from our interactive "Was this guide helpful?" widgets (Yes/No counts without associated user identifiers).
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Globe size={20} color="#2563eb" /> 3. Cookies, Local Storage & Analytics
            </h2>
            <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px', marginBottom: '12px' }}>
              We use standard HTTP cookies and browser Local Storage to ensure website functionality and security:
            </p>
            <ul style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px', paddingLeft: '20px', margin: '0 0 16px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Essential Infrastructure Cookies:</strong> Deployed by our edge CDN and hosting provider (Vercel) to maintain connection routing, prevent DDoS attacks, and enforce rate limiting.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Privacy-Conscious Performance Analytics:</strong> Used to understand general traffic volume, high-traffic error spikes (e.g., nationwide outages), and popular troubleshooting guides. We do not use cross-site tracking cookies.
              </li>
            </ul>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
              <em>You may disable or clear cookies at any time through your browser preferences. Disabling cookies will not hinder your ability to browse our guides or error status reports.</em>
            </p>
          </section>

          {/* Section 4 */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={20} color="#2563eb" /> 4. California Privacy Rights (CCPA / CPRA)
            </h2>
            <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px', marginBottom: '12px' }}>
              Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California residents are entitled to specific rights regarding their personal information:
            </p>
            <div style={{ background: '#f1f5f9', borderRadius: '10px', padding: '16px 20px', marginBottom: '16px' }}>
              <ul style={{ color: '#1e293b', fontSize: '14px', lineHeight: 1.7, margin: 0, paddingLeft: '20px' }}>
                <li><strong>No Sale of Personal Data:</strong> We do not sell, rent, or trade your personal data to third parties, data brokers, or marketing consortiums.</li>
                <li><strong>Right to Know & Delete:</strong> You have the right to request what data has been collected or request complete deletion of any submitted correspondence.</li>
                <li><strong>Non-Discrimination:</strong> We never discriminate against any user for exercising their statutory privacy rights.</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Globe size={20} color="#2563eb" /> 5. European & International Users (GDPR)
            </h2>
            <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px', marginBottom: '12px' }}>
              For visitors accessing the platform from the European Economic Area (EEA), the United Kingdom, or Switzerland, processing of personal information is governed by the General Data Protection Regulation (GDPR). 
            </p>
            <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px' }}>
              Our lawful basis for processing basic log telemetry is our <strong>legitimate interest</strong> in securing our network infrastructure, maintaining system uptime, and safeguarding against malicious automated scrapers.
            </p>
          </section>

          {/* Section 6 */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={20} color="#2563eb" /> 6. External Links to Financial Institutions
            </h2>
            <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px' }}>
              Our troubleshooting articles contain direct hyperlinks to third-party financial institutions (e.g., Chase Bank, Bank of America, Wells Fargo) and federal regulatory bodies (e.g., CFPB, Federal Reserve). Once you click an outbound link and leave BankLoginOnline.com, you are subject to that destination website's individual privacy policy, terms of service, and security controls. We encourage you to review their specific disclosures before authenticating.
            </p>
          </section>

          {/* Section 7 */}
          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={20} color="#2563eb" /> 7. Data Privacy Officer & Inquiries
            </h2>
            <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px', marginBottom: '16px' }}>
              If you have questions regarding this Privacy Policy, wish to exercise your statutory rights, or want to verify data practices, contact our privacy compliance desk:
            </p>
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '16px 20px', display: 'inline-block' }}>
              <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: 600 }}>BankLoginOnline Data Governance</div>
              <div style={{ fontSize: '14px', color: '#475569', marginTop: '4px' }}>
                Email: <a href="mailto:privacy@bankloginonline.com" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>privacy@bankloginonline.com</a>
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Response turnaround: Within 48 business hours</div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
