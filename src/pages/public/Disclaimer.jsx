import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, AlertTriangle, ShieldAlert, Scale, Building2, HelpCircle, ExternalLink, Mail, CheckCircle2 } from 'lucide-react';

export default function Disclaimer() {
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
            <span style={{ color: '#f8fafc' }}>Disclaimer & Disclosures</span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(234,88,12,0.2)', border: '1px solid rgba(249,115,22,0.4)', padding: '4px 12px', borderRadius: '999px', color: '#fdba74', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
            <AlertTriangle size={14} /> Legal & Regulatory Compliance
          </div>

          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 12px' }}>
            Disclaimer & Banking Disclosures
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '16px', maxWidth: '720px', lineHeight: 1.6, margin: 0 }}>
            Important disclosures regarding independent third-party status, non-affiliation with commercial banks, and educational boundaries.
          </p>

          <div style={{ marginTop: '20px', fontSize: '13px', color: '#64748b' }}>
            Effective & Last Updated: <strong style={{ color: '#cbd5e1' }}>{lastUpdated}</strong>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div style={{ maxWidth: '960px', margin: '40px auto 0', padding: '0 24px' }}>

        {/* Primary Callout: Independent Non-Affiliation */}
        <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '12px', padding: '24px', marginBottom: '32px', display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
          <div style={{ background: '#d97706', color: '#ffffff', padding: '10px', borderRadius: '10px', display: 'flex' }}>
            <Building2 size={22} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 6px', color: '#92400e', fontSize: '18px', fontWeight: 700 }}>
              Independent Third-Party Statement (Non-Affiliation)
            </h3>
            <p style={{ margin: 0, color: '#b45309', fontSize: '14.5px', lineHeight: 1.6 }}>
              <strong>BankLoginOnline.com is an independent publisher of consumer technology troubleshooting guides and banking status intelligence. We are NOT owned, operated, authorized, licensed, or endorsed by JPMorgan Chase Bank, N.A., Bank of America Corporation, Wells Fargo & Company, Citibank, N.A., Capital One, or any other commercial bank or financial institution.</strong>
            </p>
          </div>
        </div>

        {/* Content Body Card */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 16px rgba(15,23,42,0.03)' }}>

          {/* Section 1 */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Scale size={20} color="#ea580c" /> 1. Educational & Informational Purposes Only
            </h2>
            <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px', marginBottom: '12px' }}>
              All technical guides, error explanations, diagnostic steps, telephone tree shortcuts, and recovery procedures provided on BankLoginOnline.com are published strictly for <strong>general educational, consumer diagnostic, and informational purposes only</strong>.
            </p>
            <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px' }}>
              Nothing contained on this website constitutes, or should be construed as, formal financial advice, investment counsel, legal representation, accounting advice, or banking underwriting guidance. Financial rules, merchant account agreements, overdraft fees, wire limits, and electronic funds transfer disclosures vary by institution and are subject to continuous revision by respective corporate entities.
            </p>
          </section>

          {/* Section 2 */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert size={20} color="#ea580c" /> 2. Limitation of Financial Liability
            </h2>
            <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px', marginBottom: '14px' }}>
              While our editorial staff and technical contributors (led by David Sterling, CISA) make exhaustive efforts to ensure troubleshooting recommendations reflect current banking protocols, <strong>BankLoginOnline, its operators, and its contributors assume zero legal or financial liability</strong> for:
            </p>

            <ul style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px', paddingLeft: '20px', margin: '0 0 16px' }}>
              <li style={{ marginBottom: '8px' }}>
                Any late fees, returned check fees (NSF), overdraft penalties, or interest charges incurred due to delayed manual payments or autopay timing errors.
              </li>
              <li style={{ marginBottom: '8px' }}>
                Delays, freezes, cancellations, or administrative reviews imposed on ACH transfers, domestic wires, Fedwire settlements, or Zelle transactions.
              </li>
              <li style={{ marginBottom: '8px' }}>
                Temporary or permanent account lockouts, debit card blocks, or security suspensions enacted by an institution's automated fraud detection systems.
              </li>
              <li style={{ marginBottom: '8px' }}>
                Any device errors, operating system conflicts, or browser incompatibilities resulting from third-party cache clearing or browser configuration adjustments.
              </li>
            </ul>

            <div style={{ background: '#f8fafc', borderLeft: '4px solid #ea580c', padding: '14px 18px', borderRadius: '0 8px 8px 0', fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>
              <strong>Consumer Action Notice:</strong> For time-sensitive transactions, missing deposits, or active account compromises, you should always immediately contact your financial institution’s official customer service department using the verified telephone number printed on the reverse side of your physical debit or credit card.
            </div>
          </section>

          {/* Section 3 */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building2 size={20} color="#ea580c" /> 3. Nominative Fair Use of Trademarks
            </h2>
            <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px', marginBottom: '12px' }}>
              All product names, corporate names, brand names, service marks, registered trademarks, and logos displayed on BankLoginOnline.com (including, but not limited to, <em>Chase®, J.P. Morgan®, Bank of America®, Wells Fargo®, Citibank®, Zelle®, Plaid®, Visa®, Mastercard®, Apple Pay®, Google Pay®</em>) are the exclusive intellectual property of their respective owners.
            </p>
            <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px' }}>
              Reference to any specific commercial banking product, service, brand, or trademark on this website constitutes <strong>nominative fair use</strong> under United States trademark law (15 U.S.C. § 1125). Use of these marks is strictly for identification, commentary, comparative technical reporting, and consumer troubleshooting navigation. It does not imply affiliation, sponsorship, or endorsement.
            </p>
          </section>

          {/* Section 4 */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={20} color="#ea580c" /> 4. Consumer Anti-Phishing Advisory
            </h2>
            <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px', marginBottom: '12px' }}>
              Your digital banking security is paramount. When resolving authentication hurdles:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginTop: '16px' }}>
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '16px' }}>
                <div style={{ color: '#991b1b', fontWeight: 700, fontSize: '14.5px', marginBottom: '6px' }}>Verify URL Security</div>
                <div style={{ color: '#b91c1c', fontSize: '13.5px', lineHeight: 1.5 }}>
                  Always inspect your browser address bar to verify you are on an authentic HTTPS banking domain (such as <code style={{ background: '#fee2e2', padding: '1px 4px', borderRadius: '4px' }}>https://www.chase.com</code>) before entering your password.
                </div>
              </div>

              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '16px' }}>
                <div style={{ color: '#991b1b', fontWeight: 700, fontSize: '14.5px', marginBottom: '6px' }}>Never Share One-Time Codes</div>
                <div style={{ color: '#b91c1c', fontSize: '13.5px', lineHeight: 1.5 }}>
                  Legitimate bank fraud specialists will never ask you to verbally state or text an incoming One-Time Passcode (OTP). Treat OTPs with the same confidentiality as your ATM PIN.
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Scale size={20} color="#ea580c" /> 5. Federal Banking Regulations Reference
            </h2>
            <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px' }}>
              Articles on this site frequently cite statutory consumer protections including <strong>Regulation E (Electronic Fund Transfers, 12 CFR Part 1005)</strong>, <strong>Regulation CC (Expedited Funds Availability, 12 CFR Part 229)</strong>, and the <strong>Fair Credit Reporting Act (15 U.S.C. § 1681)</strong>. These citations are provided to empower consumers with knowledge of federal timelines (such as 10-business-day provisional credit rights for ATM errors), but do not constitute legal representation or binding statutory advice.
            </p>
          </section>

          {/* Section 6 */}
          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={20} color="#ea580c" /> 6. Legal Contact & Corrections
            </h2>
            <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px', marginBottom: '16px' }}>
              If you represent a financial institution and have updated technical documentation, corrections to phone tree navigation, or intellectual property inquiries, contact our compliance desk:
            </p>
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '16px 20px', display: 'inline-block' }}>
              <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: 600 }}>BankLoginOnline Legal & Compliance</div>
              <div style={{ fontSize: '14px', color: '#475569', marginTop: '4px' }}>
                Email: <a href="mailto:legal@bankloginonline.com" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>legal@bankloginonline.com</a>
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Response turnaround: Within 48 business hours</div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
