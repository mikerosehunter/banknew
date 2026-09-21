import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Award, Users, BookOpen, Lock, CheckCircle2, Building2, HelpCircle, PhoneCall } from 'lucide-react';

export default function About() {
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Page Header */}
      <div className="pub-hero" style={{ padding: '50px 0 40px', minHeight: 'auto', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div className="pub-hero-inner" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#94a3b8', fontSize: '14px' }}>
            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <span style={{ color: '#f8fafc' }}>About Us</span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(59,130,246,0.4)', padding: '4px 12px', borderRadius: '999px', color: '#93c5fd', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
            <ShieldCheck size={14} /> Independent Financial Cybersecurity Intelligence
          </div>

          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 12px' }}>
            About BankLoginOnline
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '16px', maxWidth: '720px', lineHeight: 1.6, margin: 0 }}>
            Demystifying complex retail banking failures, mobile app glitches, and authentication lockouts with verified, independent, step-by-step diagnostic intelligence.
          </p>

          <div style={{ display: 'flex', gap: '24px', marginTop: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '14px' }}>
              <BookOpen size={16} style={{ color: '#38bdf8' }} /> <strong>70+</strong> Verified Troubleshooting Guides
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '14px' }}>
              <Award size={16} style={{ color: '#38bdf8' }} /> Certified CISA & CISSP Editorial Oversight
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '14px' }}>
              <Lock size={16} style={{ color: '#38bdf8' }} /> 100% Zero-Credential Collection Policy
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div style={{ maxWidth: '960px', margin: '40px auto 0', padding: '0 24px' }}>

        {/* Mission Statement Banner */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '36px', marginBottom: '32px', boxShadow: '0 4px 16px rgba(15,23,42,0.03)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px', letterSpacing: '-0.01em' }}>
            Our Mission: Restoring Consumer Control Over Digital Banking
          </h2>
          <p style={{ color: '#334155', fontSize: '15.5px', lineHeight: 1.7, margin: '0 0 16px' }}>
            Modern retail banking operates on intricate distributed microservices, automated machine-learning fraud engines, and hardware security enclaves. While these systems protect billions of dollars in daily transactions, they frequently fail account holders when things go wrong.
          </p>
          <p style={{ color: '#334155', fontSize: '15.5px', lineHeight: 1.7, margin: '0 0 16px' }}>
            When an app freezes on a blank screen, a check deposit is placed on a surprise hold, or an account is quarantined by an overzealous security algorithm, consumers are too often greeted with generic error messages (*"Please try again later"*) and left stranded in hour-long automated telephone trees.
          </p>
          <p style={{ color: '#334155', fontSize: '15.5px', lineHeight: 1.7, margin: 0 }}>
            <strong>BankLoginOnline was founded to provide transparent, unvarnished, human-centered technical clarity.</strong> We dissect proprietary error codes, explain governing federal regulations (like Regulation E and Regulation CC), and provide verified direct department bypasses so you can resolve issues quickly and safely.
          </p>
        </div>

        {/* Lead Analyst & Editorial Authority */}
        <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '32px', marginBottom: '32px', display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0, fontWeight: 800 }}>
            DS
          </div>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'inline-block', background: '#e0f2fe', color: '#0369a1', fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '6px', marginBottom: '8px' }}>
              Lead Technical Analyst & Editorial Director
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
              David Sterling, CISA
            </h3>
            <p style={{ color: '#475569', fontSize: '14.5px', lineHeight: 1.6, margin: '0 0 14px' }}>
              David is a Certified Information Systems Auditor (CISA) with over 14 years of hands-on experience in financial cybersecurity, enterprise identity and access management (IAM), and core retail banking ledgers. Having consulted on automated risk scoring and payment switch integrations, David leads our research team in reverse-engineering proprietary error codes, biometric token failures, and compliance holds.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: '#64748b' }}>
              <span>✓ Certified Information Systems Auditor (ISACA)</span>
              <span>✓ Core Banking Mainframe Specialist</span>
              <span>✓ Fedwire & NACHA Protocol Contributor</span>
            </div>
          </div>
        </div>

        {/* Three Core Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {/* Pillar 1 */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(15,23,42,0.02)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Lock size={20} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>
              Zero-Credential Promise
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
              We never ask for, intercept, log, or proxy your banking credentials, passwords, PINs, or SSNs. Every troubleshooting step is designed for you to execute independently on your bank's verified official portal.
            </p>
          </div>

          {/* Pillar 2 */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(15,23,42,0.02)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Award size={20} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>
              Regulatory Transparency
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
              We empower consumers by citing exact statutory frameworks: Regulation E (electronic error disputes), Regulation CC (funds availability schedules), Check 21, and the Fair Credit Reporting Act (FCRA).
            </p>
          </div>

          {/* Pillar 3 */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(15,23,42,0.02)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Building2 size={20} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>
              100% Non-Affiliated
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
              BankLoginOnline is entirely independent. We accept zero compensation or sponsorship from commercial banks, ensuring our diagnostics and advice remain strictly objective and consumer-first.
            </p>
          </div>
        </div>

        {/* How We Research & Verify Guides */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '36px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>
            Our Multi-Stage Research & Verification Standards
          </h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <CheckCircle2 size={18} style={{ color: '#16a34a', marginTop: '3px', flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#0f172a', fontSize: '15px' }}>1. Real-World Telemetry & Outage Triage:</strong>
                <p style={{ color: '#475569', fontSize: '14px', margin: '4px 0 0', lineHeight: 1.6 }}>
                  We cross-reference real-time incident reports from DownDetector, developer issue trackers, and customer forums to identify active outages versus isolated account issues.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <CheckCircle2 size={18} style={{ color: '#16a34a', marginTop: '3px', flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#0f172a', fontSize: '15px' }}>2. Dual-Platform Testing (iOS & Android):</strong>
                <p style={{ color: '#475569', fontSize: '14px', margin: '4px 0 0', lineHeight: 1.6 }}>
                  Every mobile app troubleshooting guide is tested across both modern Apple iOS (including WebKit memory handling and Face ID Secure Enclaves) and Android (including OEM battery managers and FCM push tokens).
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <CheckCircle2 size={18} style={{ color: '#16a34a', marginTop: '3px', flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#0f172a', fontSize: '15px' }}>3. Verified Department Phone Tree Verification:</strong>
                <p style={{ color: '#475569', fontSize: '14px', margin: '4px 0 0', lineHeight: 1.6 }}>
                  We routinely test institutional customer service telephone trees to verify exact IVR bypass phrases, operating hours, and dedicated fraud triage numbers, saving users hours of wasted queue time.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)', borderRadius: '16px', padding: '32px', textAlign: 'center', color: '#ffffff' }}>
          <h3 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 10px' }}>
            Have a Question or Found a System Error?
          </h3>
          <p style={{ color: '#93c5fd', fontSize: '15px', maxWidth: '600px', margin: '0 auto 20px', lineHeight: 1.6 }}>
            Our editorial and security research team is continuously monitoring and documenting new error codes. Let us know what you are experiencing.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#2563eb', color: '#ffffff', textDecoration: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, fontSize: '14px' }}>
              <PhoneCall size={16} /> Contact Our Editorial Desk
            </Link>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', color: '#ffffff', textDecoration: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', border: '1px solid rgba(255,255,255,0.2)' }}>
              Browse Bank Fix Guides
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
