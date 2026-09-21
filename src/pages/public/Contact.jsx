import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Mail, PhoneCall, AlertTriangle, CheckCircle2, Send, Building2, HelpCircle, ShieldAlert } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'Report a New Error Code',
    bank: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate brief network submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Page Header */}
      <div className="pub-hero" style={{ padding: '50px 0 40px', minHeight: 'auto', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div className="pub-hero-inner" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#94a3b8', fontSize: '14px' }}>
            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <span style={{ color: '#f8fafc' }}>Contact Us</span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(59,130,246,0.4)', padding: '4px 12px', borderRadius: '999px', color: '#93c5fd', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
            <Mail size={14} /> Editorial & Technical Inquiries
          </div>

          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 12px' }}>
            Contact BankLoginOnline
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '16px', maxWidth: '720px', lineHeight: 1.6, margin: 0 }}>
            Reach out to our financial cybersecurity researchers and editorial staff. We welcome error code submissions, technical corrections, and press inquiries.
          </p>
        </div>
      </div>

      {/* Main Content Container */}
      <div style={{ maxWidth: '960px', margin: '40px auto 0', padding: '0 24px' }}>

        {/* URGENT NOTICE: We Are Not Your Bank */}
        <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '14px', padding: '24px', marginBottom: '36px', display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
          <div style={{ background: '#d97706', color: '#ffffff', padding: '10px', borderRadius: '10px', display: 'flex', flexShrink: 0 }}>
            <ShieldAlert size={22} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 6px', color: '#92400e', fontSize: '17px', fontWeight: 700 }}>
              Need Urgent Help Unlocking Your Bank Account?
            </h3>
            <p style={{ margin: '0 0 12px', color: '#b45309', fontSize: '14px', lineHeight: 1.6 }}>
              <strong>BankLoginOnline is an independent educational publisher. We DO NOT have access to your personal bank accounts, balances, or login profiles, and we CANNOT unlock your account or release holds.</strong>
            </p>
            <p style={{ margin: 0, color: '#78350f', fontSize: '13.5px', lineHeight: 1.5 }}>
              If your debit card was swallowed or your account is quarantined, contact your bank's official support desk directly:
            </p>
            <div style={{ display: 'flex', gap: '14px', marginTop: '10px', flexWrap: 'wrap', fontSize: '13px' }}>
              <span style={{ background: 'rgba(217,119,6,0.1)', padding: '4px 8px', borderRadius: '6px', color: '#92400e' }}><strong>Chase:</strong> 1-800-935-9935</span>
              <span style={{ background: 'rgba(217,119,6,0.1)', padding: '4px 8px', borderRadius: '6px', color: '#92400e' }}><strong>Bank of America:</strong> 1-800-432-1000</span>
              <span style={{ background: 'rgba(217,119,6,0.1)', padding: '4px 8px', borderRadius: '6px', color: '#92400e' }}><strong>Wells Fargo:</strong> 1-800-869-3557</span>
              <span style={{ background: 'rgba(217,119,6,0.1)', padding: '4px 8px', borderRadius: '6px', color: '#92400e' }}><strong>Citibank:</strong> 1-800-374-9700</span>
            </div>
          </div>
        </div>

        {/* Contact Grid: Form + Info Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>

          {/* Left Column: Interactive Form */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(15,23,42,0.03)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>
              Send a Message to Editorial
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.5, margin: '0 0 24px' }}>
              Submit an unlisted error code, suggest a technical guide correction, or contact our research desk.
            </p>

            {submitted ? (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
                <CheckCircle2 size={44} style={{ color: '#059669', margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#065f46', margin: '0 0 6px' }}>
                  Message Received!
                </h3>
                <p style={{ color: '#047857', fontSize: '14px', lineHeight: 1.6, margin: '0 0 16px' }}>
                  Thank you for contributing to the BankLoginOnline technical library. Our editorial team reviews submissions within 1–2 business days.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  style={{ background: '#059669', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. alex@example.com"
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Inquiry Type
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', background: '#ffffff', boxSizing: 'border-box' }}
                  >
                    <option value="Report a New Error Code">Report a New Error Code</option>
                    <option value="Guide Correction / Update">Guide Correction / Update</option>
                    <option value="Technical Question">Technical Research Question</option>
                    <option value="Press / Media Inquiry">Press / Media Inquiry</option>
                    <option value="General Feedback">General Feedback</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Bank or Topic (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.bank}
                    onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                    placeholder="e.g. Bank of America, Chase Zelle, Wells Fargo"
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Your Detailed Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe the error code, device environment, or question in detail..."
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' }}
                  />
                </div>

                <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>
                  🛡️ <em>Privacy Notice: Never include bank account numbers, passwords, PINs, or Social Security Numbers in your message.</em>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#2563eb', color: '#ffffff', border: 'none', padding: '12px 20px', borderRadius: '8px', fontSize: '14.5px', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
                >
                  {submitting ? 'Transmitting...' : <><Send size={16} /> Send to Editorial Desk</>}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Direct Department Channels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Email Channels Card */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(15,23,42,0.02)' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={18} style={{ color: '#2563eb' }} /> Direct Email Inboxes
              </h3>

              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>Editorial & Technical Submissions</div>
                  <a href="mailto:editorial@bankloginonline.com" style={{ color: '#2563eb', fontSize: '14px', textDecoration: 'none' }}>
                    editorial@bankloginonline.com
                  </a>
                  <p style={{ color: '#64748b', fontSize: '12px', margin: '2px 0 0' }}>For guide updates, technical additions, and author correspondence.</p>
                </div>

                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>Legal, Privacy & Compliance</div>
                  <a href="mailto:privacy@bankloginonline.com" style={{ color: '#2563eb', fontSize: '14px', textDecoration: 'none' }}>
                    privacy@bankloginonline.com
                  </a>
                  <p style={{ color: '#64748b', fontSize: '12px', margin: '2px 0 0' }}>For DMCA, privacy requests, and regulatory disclosures.</p>
                </div>

                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>General Inquiries</div>
                  <a href="mailto:contact@bankloginonline.com" style={{ color: '#2563eb', fontSize: '14px', textDecoration: 'none' }}>
                    contact@bankloginonline.com
                  </a>
                  <p style={{ color: '#64748b', fontSize: '12px', margin: '2px 0 0' }}>For general feedback, partnerships, and site support.</p>
                </div>
              </div>
            </div>

            {/* Operating Hours & Response SLA */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(15,23,42,0.02)' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={18} style={{ color: '#059669' }} /> Desk Hours & Turnaround
              </h3>
              <p style={{ color: '#475569', fontSize: '13.5px', lineHeight: 1.6, margin: '0 0 12px' }}>
                Our financial research team monitors bank API health and user incident reports 24/7. Non-automated email correspondence is processed during standard business hours:
              </p>
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#64748b', fontSize: '13px', lineHeight: 1.6 }}>
                <li><strong>Monday – Friday:</strong> 8:00 AM – 6:00 PM Eastern Time</li>
                <li><strong>Saturday – Sunday:</strong> Critical outage monitoring only</li>
                <li><strong>Standard SLA:</strong> Initial response within 24 to 48 hours</li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
