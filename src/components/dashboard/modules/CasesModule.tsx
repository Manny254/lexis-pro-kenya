import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { KENYAN_COURTS, CASE_STAGES, type Case, type CaseStage } from '@/types';
import { Plus, X, Briefcase } from 'lucide-react';
import { DEMO_USERS } from '@/data/seed';

const getDaysUntil = (date: string) => {
  const d = new Date(date); const today = new Date();
  today.setHours(0,0,0,0); d.setHours(0,0,0,0);
  return Math.ceil((d.getTime() - today.getTime()) / 86400000);
};

const CaseFormModal: React.FC<{ onClose: () => void; onSave: (c: Case) => void; clients: any[] }> = ({ onClose, onSave, clients }) => {
  const [form, setForm] = useState<Partial<Case>>({ stage: 'Filing', court: KENYAN_COURTS[0] });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => { const n = { ...e }; delete n[k]; return n; }); };
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title?.trim()) e.title = 'Case title is required';
    if (!form.clientId) e.clientId = 'Please select a client';
    if (!form.caseNo?.trim()) e.caseNo = 'Case number is required';
    if (!form.nextHearing) e.nextHearing = 'Next hearing date is required';
    setErrors(e); return Object.keys(e).length === 0;
  };
  const handleSave = () => {
    if (!validate()) return;
    onSave({ id: Math.random().toString(36).slice(2), clientId: form.clientId!, title: form.title!, court: form.court || KENYAN_COURTS[0], caseNo: form.caseNo!, stage: form.stage as CaseStage, nextHearing: form.nextHearing!, filingDate: new Date().toISOString().split('T')[0], advocate: form.advocate || 'David Otieno', description: form.description || '' });
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-lg animate-scale-in" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--foreground-muted))' }}><X size={20} /></button>
        <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.2rem', marginBottom: 4 }}>New Case</h3>
        <span className="gold-rule" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 8 }}>
          <div>
            <label className="lp-label">Related Client *</label>
            <select value={form.clientId || ''} onChange={e => set('clientId', e.target.value)} className={`lp-input ${errors.clientId ? 'error' : ''}`}>
              <option value="">Select client…</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.clientId && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 4 }}>{errors.clientId}</p>}
          </div>
          <div>
            <label className="lp-label">Case Title *</label>
            <input value={form.title || ''} onChange={e => set('title', e.target.value)} className={`lp-input ${errors.title ? 'error' : ''}`} placeholder="e.g. Mwangi v. Kamau" />
            {errors.title && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 4 }}>{errors.title}</p>}
          </div>
          <div>
            <label className="lp-label">Court Case Number *</label>
            <input value={form.caseNo || ''} onChange={e => set('caseNo', e.target.value)} className={`lp-input ${errors.caseNo ? 'error' : ''}`} placeholder="ELC/E/021/2026" />
            {errors.caseNo && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 4 }}>{errors.caseNo}</p>}
          </div>
          <div>
            <label className="lp-label">Court</label>
            <select value={form.court || ''} onChange={e => set('court', e.target.value)} className="lp-input">
              {KENYAN_COURTS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="lp-label">Stage</label>
            <select value={form.stage || 'Filing'} onChange={e => set('stage', e.target.value)} className="lp-input">
              {CASE_STAGES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="lp-label">Advocate Assigned</label>
            <select value={form.advocate || ''} onChange={e => set('advocate', e.target.value)} className="lp-input">
              <option value="">Select advocate…</option>
              {DEMO_USERS.filter(u => u.role !== 'staff').map(u => <option key={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div>
            <label className="lp-label">Next Hearing Date *</label>
            <input type="date" value={form.nextHearing || ''} onChange={e => set('nextHearing', e.target.value)} className={`lp-input ${errors.nextHearing ? 'error' : ''}`} />
            {errors.nextHearing && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 4 }}>{errors.nextHearing}</p>}
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="lp-label">Case Description</label>
            <textarea value={form.description || ''} onChange={e => set('description', e.target.value)} className="lp-input" placeholder="Brief description of the case…" rows={3} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'flex-end' }}>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>Add Case</button>
        </div>
      </div>
    </div>
  );
};

const CasesModule: React.FC = () => {
  const { cases, setCases, clients, addToast } = useApp();
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'attorney';
  const [showAdd, setShowAdd] = useState(false);
  const [viewCase, setViewCase] = useState<Case | null>(null);

  const handleDelete = (id: string) => {
    const backup = [...cases];
    const del = cases.find(c => c.id === id)!;
    setCases(cs => cs.filter(c => c.id !== id));
    addToast(`Case "${del.title}" deleted`, 'info', () => setCases(backup));
  };

  const handleSave = (c: Case) => { setCases(cs => [c, ...cs]); addToast('Case added', 'success'); setShowAdd(false); };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.5rem', margin: 0 }}>Cases</h2>
          <span className="gold-rule" />
        </div>
        {canEdit && <button className="btn-primary" onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Plus size={15} /> New Case</button>}
      </div>

      {cases.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Briefcase size={48} /></div>
          <h3>No Cases Yet</h3>
          <p>Open cases will appear here with hearing countdowns and stage tracking.</p>
          {canEdit && <button className="btn-primary" onClick={() => setShowAdd(true)}>Open First Case</button>}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {cases.map(c => {
            const days = getDaysUntil(c.nextHearing);
            const client = clients.find(cl => cl.id === c.clientId);
            const borderColor = days <= 3 ? '#f87171' : days <= 7 ? 'hsl(var(--primary))' : 'rgba(200,149,42,0.2)';
            const daysColor = days <= 3 ? '#f87171' : days <= 7 ? 'hsl(var(--primary))' : 'hsl(var(--foreground-muted))';
            return (
              <div key={c.id} className="lp-card" style={{ padding: 0, borderLeft: `3px solid ${borderColor}`, overflow: 'hidden', cursor: 'pointer' }} onClick={() => setViewCase(c)}>
                <div style={{ padding: '16px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <span className={`badge badge-${c.stage.toLowerCase().replace(/ /g, '-')}`}>{c.stage}</span>
                    <div style={{ textAlign: 'center', background: `${daysColor}18`, borderRadius: 6, padding: '4px 10px' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: daysColor, fontFamily: "'Libre Baskerville', serif", lineHeight: 1 }}>{Math.max(days, 0)}</div>
                      <div style={{ fontSize: '0.55rem', color: daysColor, textTransform: 'uppercase' }}>days</div>
                    </div>
                  </div>
                  <h4 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '0.95rem', marginBottom: 4, lineHeight: 1.3 }}>{c.title}</h4>
                  <p style={{ fontSize: '0.72rem', color: 'hsl(var(--primary))', fontFamily: 'monospace', marginBottom: 6 }}>{c.caseNo}</p>
                  <p style={{ fontSize: '0.75rem', color: 'hsl(var(--foreground-muted))', marginBottom: 4 }}>{c.court}</p>
                  {c.description && <p style={{ fontSize: '0.75rem', color: 'hsl(var(--foreground-muted))', lineHeight: 1.5, opacity: 0.8 }}>{c.description.slice(0, 90)}{c.description.length > 90 ? '…' : ''}</p>}
                </div>
                <div style={{ borderTop: '1px solid rgba(200,149,42,0.1)', padding: '10px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(200,149,42,0.03)' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'hsl(var(--foreground-muted))' }}>{client?.name} · {c.advocate}</span>
                    <div style={{ fontSize: '0.68rem', color: daysColor }}>{days >= 0 ? `Next hearing: ${c.nextHearing}` : `Hearing was ${Math.abs(days)} days ago`}</div>
                  </div>
                  {canEdit && (
                    <button onClick={e => { e.stopPropagation(); handleDelete(c.id); }} style={{ background: 'rgba(139,28,28,0.2)', border: 'none', cursor: 'pointer', borderRadius: 6, padding: '5px 8px', color: '#f87171', fontSize: '0.75rem' }}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Case detail modal */}
      {viewCase && (
        <div className="modal-overlay" onClick={() => setViewCase(null)}>
          <div className="modal-card modal-card-lg animate-scale-in" onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewCase(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--foreground-muted))' }}><X size={20} /></button>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
              <span className={`badge badge-${viewCase.stage.toLowerCase().replace(/ /g, '-')}`}>{viewCase.stage}</span>
              <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.15rem', margin: 0 }}>{viewCase.title}</h3>
            </div>
            <p style={{ color: 'hsl(var(--primary))', fontFamily: 'monospace', fontSize: '0.85rem', marginBottom: 4 }}>{viewCase.caseNo}</p>
            <span className="gold-rule" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: 'Court', v: viewCase.court },
                { label: 'Advocate', v: viewCase.advocate },
                { label: 'Next Hearing', v: viewCase.nextHearing },
                { label: 'Filing Date', v: viewCase.filingDate },
                { label: 'Client', v: clients.find(c => c.id === viewCase.clientId)?.name || '—' },
              ].map(f => (
                <div key={f.label}>
                  <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'hsl(var(--foreground-muted))', marginBottom: 4 }}>{f.label}</p>
                  <p style={{ fontSize: '0.875rem' }}>{f.v}</p>
                </div>
              ))}
            </div>
            {viewCase.description && (
              <div style={{ marginTop: 16, background: 'rgba(200,149,42,0.05)', border: '1px solid rgba(200,149,42,0.15)', borderRadius: 8, padding: '12px 14px' }}>
                <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', color: 'hsl(var(--foreground-muted))', marginBottom: 6 }}>Description</p>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'hsl(var(--foreground-muted))' }}>{viewCase.description}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showAdd && <CaseFormModal onClose={() => setShowAdd(false)} onSave={handleSave} clients={clients} />}
    </div>
  );
};

export default CasesModule;
