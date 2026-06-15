import React, { useState } from 'react';
import { Sparkles, Download, X, Pencil } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const DOC_TYPES = ['Demand Letter', 'Affidavit', 'Case Summary', 'Court Filing', 'Legal Notice', 'Other'];

const DEMAND_LETTER_TEXT = `WITHOUT PREJUDICE

Dear Sir/Madam,

RE: Recovery of KES 4,500,000 — Supply Agreement Dated 15 March 2025

We act for and on behalf of Fatuma Hassan of Mombasa in the above
matter. We write to formally demand payment of the sum of
KES 4,500,000 being monies due and owing to our client for goods
delivered to you pursuant to the Supply Agreement dated 15 March 2025.

Kindly remit the full amount within fourteen (14) days of the date
hereof failing which our client shall commence legal proceedings
without further notice.

Yours faithfully,
Kagoma Advocates`;

interface Draft {
  id: string;
  title: string;
  caseNo: string;
  status: 'PENDING APPROVAL' | 'APPROVED';
  generated: string;
  approvedBy?: string;
  body: string;
}

const SEED_DRAFTS: Draft[] = [
  {
    id: 'dr1',
    title: 'Demand Letter — Hassan v. Bahari Supplies',
    caseNo: 'COMM/E/089/2026',
    status: 'PENDING APPROVAL',
    generated: '3 Jun 2025',
    body: DEMAND_LETTER_TEXT,
  },
  {
    id: 'dr2',
    title: 'Case Summary — Kamau v. Nairobi City County',
    caseNo: 'ELRC/E/112/2025',
    status: 'APPROVED',
    generated: '1 Jun 2025',
    approvedBy: 'Adv. James Kariuki',
    body: 'Case summary of Kamau v. Nairobi City County — wrongful dismissal proceedings before the Employment & Labour Court. Client served 14 years before termination on 12 February 2025…',
  },
];

const StatusBadge: React.FC<{ status: Draft['status'] }> = ({ status }) => {
  const style = status === 'APPROVED'
    ? { background: 'rgba(16,185,129,0.15)', color: '#6ee7b7' }
    : { background: 'rgba(245,158,11,0.15)', color: '#fcd34d' };
  return (
    <span style={{
      ...style,
      fontSize: '0.7rem',
      fontWeight: 700,
      letterSpacing: '0.04em',
      padding: '4px 10px',
      borderRadius: 999,
    }}>{status}</span>
  );
};

const DraftReviewPanel: React.FC<{ draft: Draft; onClose: () => void }> = ({ draft, onClose }) => {
  const [previewAs, setPreviewAs] = useState<'pa' | 'attorney'>('pa');
  const [text, setText] = useState(draft.body);

  return (
    <div className="modal-overlay" style={{ zIndex: 200, justifyContent: 'flex-end', alignItems: 'stretch' }} onClick={onClose}>
      <div
        className="modal-card animate-scale-in"
        onClick={e => e.stopPropagation()}
        style={{ width: 640, maxWidth: '100%', height: '100%', borderRadius: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.2rem', marginBottom: 8 }}>{draft.title}</h3>
            <StatusBadge status={draft.status} />
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--foreground-muted))' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '0.72rem', color: 'hsl(var(--foreground-muted))', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Preview as:</span>
          <div style={{ display: 'inline-flex', border: '1px solid rgba(200,149,42,0.2)', borderRadius: 6, overflow: 'hidden' }}>
            {(['pa', 'attorney'] as const).map(r => (
              <button
                key={r}
                onClick={() => setPreviewAs(r)}
                style={{
                  background: previewAs === r ? 'hsl(var(--primary))' : 'transparent',
                  color: previewAs === r ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground-muted))',
                  border: 'none',
                  padding: '6px 14px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >{r === 'pa' ? 'PA Admin' : 'Attorney'}</button>
            ))}
          </div>
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          className="lp-input"
          style={{ flex: 1, minHeight: 320, fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.6, resize: 'vertical' }}
        />

        {previewAs === 'pa' ? (
          <div style={{ marginTop: 14 }}>
            <p style={{ fontSize: '0.7rem', color: 'hsl(var(--foreground-muted))', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Your view: PA Admin</p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <button className="btn-ghost" onClick={() => navigator.clipboard.writeText(text)}>Copy Text</button>
              <button className="btn-ghost" style={{ padding: 8 }} title="Edit"><Pencil size={14} /></button>
            </div>
            <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#fcd34d', padding: '10px 14px', borderRadius: 6, fontSize: '0.8rem' }}>
              Awaiting attorney approval before use
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 14 }}>
            <p style={{ fontSize: '0.7rem', color: 'hsl(var(--foreground-muted))', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Your view: Attorney</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>Approve Draft</button>
              <button style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>Reject</button>
              <button className="btn-ghost" onClick={() => navigator.clipboard.writeText(text)}>Copy Text</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AIModule: React.FC = () => {
  const { cases } = useApp();
  const [selectedCase, setSelectedCase] = useState('');
  const [docType, setDocType] = useState('');
  const [drafts] = useState<Draft[]>(SEED_DRAFTS);
  const [reviewing, setReviewing] = useState<Draft | null>(null);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.8rem', marginBottom: 4 }}>AI Drafts</h2>
        <p style={{ color: 'hsl(var(--foreground-muted))', fontSize: '0.85rem' }}>Generate and review AI-assisted legal documents</p>
        <span className="gold-rule" style={{ marginTop: 6 }} />
      </div>

      <div className="lp-card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Sparkles size={24} style={{ color: 'hsl(var(--primary))' }} />
          <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.15rem' }}>Draft with AI</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label className="lp-label">Related Case</label>
            <select className="lp-input" value={selectedCase} onChange={e => setSelectedCase(e.target.value)}>
              <option value="">Select case…</option>
              {cases.map(c => <option key={c.id} value={c.id}>{c.title} · {c.caseNo}</option>)}
            </select>
          </div>
          <div>
            <label className="lp-label">Document Type</label>
            <select className="lp-input" value={docType} onChange={e => setDocType(e.target.value)}>
              <option value="">Select type…</option>
              {DOC_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <button className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Sparkles size={16} /> Generate Draft
        </button>
        <p style={{ textAlign: 'center', marginTop: 10, fontSize: '0.75rem', color: 'hsl(var(--foreground-muted))' }}>
          Drafts require attorney approval before use
        </p>
      </div>

      <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1rem', marginBottom: 12, color: 'hsl(var(--foreground-muted))', letterSpacing: '0.04em' }}>Recent Drafts</h3>

      {drafts.length === 0 ? (
        <div className="lp-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', textAlign: 'center' }}>
          <Sparkles size={40} style={{ color: 'hsl(var(--foreground-muted))', marginBottom: 12 }} />
          <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.05rem', marginBottom: 6 }}>No drafts yet</p>
          <p style={{ color: 'hsl(var(--foreground-muted))', fontSize: '0.85rem' }}>Select a case and document type above to generate your first draft</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {drafts.map(d => (
            <div key={d.id} className="lp-card" style={{ padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                  <h4 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1rem' }}>{d.title}</h4>
                  <StatusBadge status={d.status} />
                </div>
                <p style={{ fontSize: '0.8rem', color: 'hsl(var(--foreground-muted))' }}>
                  Case {d.caseNo} · Generated {d.generated}
                  {d.approvedBy && <> · Approved by {d.approvedBy}</>}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {d.status === 'PENDING APPROVAL' ? (
                  <button className="btn-ghost" onClick={() => setReviewing(d)}>Review Draft</button>
                ) : (
                  <>
                    <button className="btn-ghost" onClick={() => setReviewing(d)}>View</button>
                    <button className="btn-ghost" style={{ padding: 8 }} title="Download"><Download size={14} /></button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {reviewing && <DraftReviewPanel draft={reviewing} onClose={() => setReviewing(null)} />}
    </div>
  );
};

export default AIModule;
