import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, ShieldCheck, Award, Users, BookOpen, Lock, 
  CheckCircle2, Building2, HelpCircle, PhoneCall, Scale, 
  Smartphone, CreditCard, Cpu, Landmark, ShieldAlert 
} from 'lucide-react';

const TEAM_MEMBERS = [
  {
    name: "Elena Rostova, CISSP",
    role: "Head of Mobile Security & Biometrics",
    photo: "/team/elena-rostova.jpg",
    badge: "iOS & Android Security Enclaves",
    bio: "Elena specializes in mobile application reverse-engineering, cryptographic session tokens, and hardware enclave integrity. Former mobile security consultant for European payment switches, she oversees our research on Face ID/Touch ID keychain desyncs, mTLS handshakes, and WebKit rendering crashes.",
    expertise: ["Apple Secure Enclave", "Android Trusty TEE", "OAuth 2.0 / mTLS", "Biometric Desync"]
  },
  {
    name: "Marcus Vance, CAMS, CFE",
    role: "Senior Fraud & Risk Telemetry Analyst",
    photo: "/team/marcus-vance.jpg",
    badge: "Early Warning Services (EWS)",
    bio: "With over 14 years in financial crime investigation, Marcus decodes automated risk scoring algorithms and consortium fraud databases. He reverse-engineers high-velocity card locks, anti-takeover cooling holds, and account-takeover flags across major US institutions.",
    expertise: ["EWS Consortium Telemetry", "Velocity Lock Heuristics", "Anti-Money Laundering (AML)", "SIM Swap Defense"]
  },
  {
    name: "Sarah Jenkins, Esq.",
    role: "Senior Regulatory Compliance & Consumer Counsel",
    photo: "/team/sarah-jenkins.jpg",
    badge: "Reg E, Reg CC & CFPB Rights",
    bio: "Sarah is a financial consumer rights attorney specializing in electronic banking error resolution. She ensures all BankLoginOnline dispute workflows strictly align with the Electronic Fund Transfer Act (12 CFR Part 1005), Expedited Funds Availability Act (12 CFR Part 229), and CFPB enforcement directives.",
    expertise: ["Regulation E Disputes", "Regulation CC Check Holds", "CFPB Complaint Protocols", "UCC Article 4"]
  },
  {
    name: "Tariq Al-Mansoor",
    role: "Lead Payment Networks & Clearing Architect",
    photo: "/team/tariq-almansoor.jpg",
    badge: "Fedwire, ACH & SWIFT Protocols",
    bio: "Tariq brings 12+ years of enterprise payments experience, having architected high-value interbank clearing nodes for a Federal Reserve district member bank. He authors our technical guides on routing transit numbers, Fedwire cutoff timelines, and NACHA batch settlement failures.",
    expertise: ["Federal Reserve Fedwire", "NACHA ACH Clearing", "SWIFT/BIC Messaging", "Real-Time Payments (RTP)"]
  },
  {
    name: "Chloe Nguyen",
    role: "Director of P2P Protocols & Digital Wallets",
    photo: "/team/chloe-nguyen.jpg",
    badge: "Zelle & NFC Tokenization",
    bio: "Chloe is a fintech analyst focusing on peer-to-peer directory registries and mobile contactless payments. She troubleshoots multi-bank Zelle token collisions, Apple Pay / Google Wallet DPAN provisioning errors, and instant push-payment settlement disputes.",
    expertise: ["Zelle Directory Mapping", "Visa Token Service (VTS)", "Apple Pay / Google Wallet", "Push Payment Scams"]
  },
  {
    name: "Devon Brooks",
    role: "ATM Systems & Hardware Forensics Lead",
    photo: "/team/devon-brooks.jpg",
    badge: "ATM Hardware & Electronic Journal",
    bio: "Devon has spent 16 years field-testing and certifying automated teller machine networks for regional and national US banks. He explains the mechanical and sensor mechanics behind swallowed debit cards, jammed cash bill acceptors, and Electronic Journal (EJ) audit trails.",
    expertise: ["NCR & Diebold Nixdorf", "Electronic Journal Logs", "EMV Chip Fallback", "Cash Dispenser Forensics"]
  },
  {
    name: "Priya Sharma",
    role: "Senior Cloud Infrastructure & Outage Engineer",
    photo: "/team/priya-sharma.jpg",
    badge: "Cloudflare, WAF & DNS Telemetry",
    bio: "Priya leads our real-time system outage monitoring team. An expert in distributed cloud architecture and Web Application Firewalls (WAF), she investigates ISP routing blocks, MTU packet truncation, and scheduled core banking mainframe maintenance cycles.",
    expertise: ["WAF Bot Filtration", "DNS Resolution Failures", "High-Availability API Gateways", "24/7 Outage Triage"]
  },
  {
    name: "Arthur Pendelton, CPA",
    role: "Treasury Operations & Commercial Accounts Advisor",
    photo: "/team/arthur-pendelton.jpg",
    badge: "CashPro & Small Business Banking",
    bio: "Arthur is a former corporate controller who advises small business owners and commercial clients on complex corporate banking portals (including Bank of America CashPro and Chase Connect), Positive Pay check fraud filters, and business-to-personal profile collisions.",
    expertise: ["CashPro & Business Connect", "Positive Pay Protocols", "Dual-Control Wires", "Merchant ACH Settlement"]
  }
];

export default function About() {
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Page Header */}
      <div className="pub-hero" style={{ padding: '50px 0 40px', minHeight: 'auto', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div className="pub-hero-inner" style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#94a3b8', fontSize: '14px' }}>
            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <span style={{ color: '#f8fafc' }}>About Us</span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(59,130,246,0.4)', padding: '4px 12px', borderRadius: '999px', color: '#93c5fd', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
            <ShieldCheck size={14} /> Independent Financial Cybersecurity Intelligence
          </div>

          <h1 style={{ fontSize: '38px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 12px' }}>
            About BankLoginOnline
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '16.5px', maxWidth: '760px', lineHeight: 1.6, margin: 0 }}>
            Demystifying retail banking technology failures, mobile app crashes, and security lockouts with verified, independent, step-by-step diagnostic intelligence.
          </p>

          <div style={{ display: 'flex', gap: '24px', marginTop: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '14px' }}>
              <BookOpen size={16} style={{ color: '#38bdf8' }} /> <strong>74+</strong> Technical Fix Guides
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '14px' }}>
              <Users size={16} style={{ color: '#38bdf8' }} /> <strong>9</strong> Cybersecurity & Banking Specialists
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '14px' }}>
              <Lock size={16} style={{ color: '#38bdf8' }} /> Strict Zero-Credential Collection Policy
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div style={{ maxWidth: '1080px', margin: '40px auto 0', padding: '0 24px' }}>

        {/* Mission Statement Banner */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '36px', marginBottom: '40px', boxShadow: '0 4px 16px rgba(15,23,42,0.03)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px', letterSpacing: '-0.01em' }}>
            Our Mission: Restoring Consumer Control Over Digital Banking
          </h2>
          <p style={{ color: '#334155', fontSize: '15.5px', lineHeight: 1.7, margin: '0 0 16px' }}>
            Modern retail banking relies on complex distributed microservices, automated risk heuristics, biometric enclaves, and interbank settlement networks. While these systems safeguard billions of dollars in daily transactions, they frequently leave account holders stranded when unexpected glitches strike.
          </p>
          <p style={{ color: '#334155', fontSize: '15.5px', lineHeight: 1.7, margin: '0 0 16px' }}>
            When an app freezes on a blank screen, a check deposit triggers a surprise hold, or an account is quarantined by an overzealous fraud algorithm, consumers are too often greeted with generic error dialogues (*"Please try again later"*) and left trapped in multi-hour automated telephone trees.
          </p>
          <p style={{ color: '#334155', fontSize: '15.5px', lineHeight: 1.7, margin: 0 }}>
            <strong>BankLoginOnline was founded to provide transparent, unvarnished, human-centered technical clarity.</strong> We reverse-engineer proprietary error codes, translate governing federal regulations (like Regulation E and Regulation CC), and provide verified direct phone tree shortcuts so you can regain control of your finances quickly and safely.
          </p>
        </div>

        {/* Lead Analyst & Editorial Director Profile */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Award size={20} style={{ color: '#0284c7' }} />
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Editorial & Technical Leadership
            </h2>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(15,23,42,0.04)', display: 'flex', gap: '28px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <img 
              src="/team/david-sterling.jpg" 
              alt="David Sterling, CISA"
              style={{ width: '120px', height: '120px', borderRadius: '16px', objectFit: 'cover', flexShrink: 0, border: '3px solid #e2e8f0' }} 
            />
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'inline-block', background: '#e0f2fe', color: '#0369a1', fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '6px', marginBottom: '8px' }}>
                Founder & Lead Financial Systems Analyst
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                David Sterling, CISA
              </h3>
              <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.65, margin: '0 0 16px' }}>
                David is a Certified Information Systems Auditor (CISA) with over 14 years of experience auditing core banking platforms, payment gateways, and enterprise Identity and Access Management (IAM) systems. Formerly an IT audit consultant for global financial institutions, David leads our research team in dissecting proprietary banking errors, biometric keychain token failures, and federal funds availability disputes.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '12.5px', color: '#0f172a', fontWeight: 600 }}>
                <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>✓ Certified Information Systems Auditor (ISACA)</span>
                <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>✓ Core Mainframe Ledger Forensics</span>
                <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>✓ Fedwire & NACHA Clearing Contributor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specialized Research Team: 8 Subject Matter Experts */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Users size={20} style={{ color: '#2563eb' }} />
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Specialized Cybersecurity & Financial Research Team
            </h2>
          </div>
          <p style={{ color: '#64748b', fontSize: '15px', margin: '0 0 24px', lineHeight: 1.5 }}>
            Every guide published on BankLoginOnline is authored, peer-reviewed, and technically validated by our dedicated team of domain specialists.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {TEAM_MEMBERS.map((member, idx) => (
              <div 
                key={idx}
                style={{ 
                  background: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '16px', 
                  padding: '24px', 
                  boxShadow: '0 2px 10px rgba(15,23,42,0.02)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Header: Photo + Name + Role */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '14px' }}>
                  <img 
                    src={member.photo} 
                    alt={member.name}
                    style={{ width: '68px', height: '68px', borderRadius: '14px', objectFit: 'cover', flexShrink: 0, border: '2px solid #e2e8f0' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '0 0 3px' }}>
                      {member.name}
                    </h3>
                    <div style={{ color: '#2563eb', fontSize: '13px', fontWeight: 600, margin: '0 0 4px' }}>
                      {member.role}
                    </div>
                    <span style={{ display: 'inline-block', background: '#f1f5f9', color: '#475569', fontSize: '11.5px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px' }}>
                      {member.badge}
                    </span>
                  </div>
                </div>

                {/* Bio */}
                <p style={{ color: '#475569', fontSize: '13.5px', lineHeight: 1.6, margin: '0 0 16px', flex: 1 }}>
                  {member.bio}
                </p>

                {/* Expertise Badges */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                  {member.expertise.map((tag, tIdx) => (
                    <span 
                      key={tIdx}
                      style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '11.5px', fontWeight: 500, padding: '2px 8px', borderRadius: '4px' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Three Core Operating Principles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {/* Principle 1 */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(15,23,42,0.02)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Lock size={20} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>
              Zero-Credential Guarantee
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
              We never ask for, intercept, log, or proxy your banking passwords, PINs, or SSNs. Every troubleshooting step is designed for you to execute independently on your bank's verified official portal.
            </p>
          </div>

          {/* Principle 2 */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(15,23,42,0.02)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Scale size={20} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>
              Statutory Accuracy
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
              We empower consumers by citing exact federal laws: Regulation E (electronic error disputes), Regulation CC (statutory funds availability), Check 21, and the Fair Credit Reporting Act.
            </p>
          </div>

          {/* Principle 3 */}
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

        {/* CTA Banner */}
        <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)', borderRadius: '16px', padding: '36px', textAlign: 'center', color: '#ffffff' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 10px' }}>
            Have a Technical Question or Found a System Error?
          </h3>
          <p style={{ color: '#93c5fd', fontSize: '15.5px', maxWidth: '640px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            Our financial systems and security research team is continuously monitoring and documenting new error codes. Reach out to our editorial desk.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#2563eb', color: '#ffffff', textDecoration: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, fontSize: '14.5px' }}>
              <PhoneCall size={16} /> Contact Our Research Desk
            </Link>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', color: '#ffffff', textDecoration: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, fontSize: '14.5px', border: '1px solid rgba(255,255,255,0.2)' }}>
              Browse Live Fix Guides
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
