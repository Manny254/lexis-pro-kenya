import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import type { Message, CommType } from '@/types';
import { COMM_TYPES } from '@/types';
import { Plus, X } from 'lucide-react';

const typeColor: Record<CommType, string> = { Call: 'hsl(var(--primary))', Email: '#93c5fd', WhatsApp: '#4ade80', Meeting: '#c4b5fd', Note: 'hsl(var(--foreground-muted))' };
const typeBorder: Record<CommType, string> = { Call: 'hsl(var(--primary))', Email: '#93c5fd', WhatsApp: '#4ade80', Meeting: '#c4b5fd', Note: '#888' };

const CommunicationsModule: React.FC = () => {
  const { messages, setMessages, clients, addToast } = useApp();
  const { user } = useAuth();
  const [clientFilter, setClientFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<Partial<Message>>({ type: 'Call' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const today = new Date();
  const isOverdue = (m: Message) => !!m.followUp && new Date(m.followUp) < today;
  const overdueCount = messages.filter(isOverdue).length;

  const filtered = messages.filter(m => clientFilter === 'All' || m.clientId === clientFilter);

  const setF = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => { const n = { ...e }; delete n[k]; return n; }); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.clientId) e.clientId = 'Please select a client';
    if (!form.content?.trim()) e.content = 'Notes / summary is required';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;
    const m: Message = { id: Math.random().toString(36).slice(2), clientId: form.clientId!, type: form.type as CommType, content: form.content!, date: new Date().toISOString().split('T')[0], author: user?.name || 'Unknown', followUp: form.followUp };
    setMessages(ms => [m, ...ms]);
    addToast('Communication logged', 'success');
    setShowAdd(false);
    setForm({ type: 'Call' });
  };

  const handleDelete = (id: string) => {
    const backup = [...messages];
    setMessages(ms => ms.filter(m => m.id !== id));
    addToast('Communication deleted', 'info', () => setMessages(backup));
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div><h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.5rem', margin: 0 }}>Communications</h2><span className="gold-rule" /></div>
        <button className="btn-primary" onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Plus size={15} /> Log Communication</button>
      </div>

      {overdueCount > 0 && (
        <div className="alert-banner-red">🔔 {overdueCount} follow-up{overdueCount > 1 ? 's' : ''} overdue — review and action required</div>
      )}

      <div style={{ marginBottom: 16 }}>
        <select value={clientFilter} onChange={e => setClientFilter(e.target.value)} className="lp-input" style={{ width: 'auto', minWidth: 200 }}>
          <option value="All">All Clients</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">💬</div><h3>No Communications</h3><p>Log calls, emails, WhatsApp messages, and meetings to keep track of client interactions.</p><button className="btn-primary" onClick={() => setShowAdd(true)}>Log First Communication</button></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(m => {
            const client = clients.find(c => c.id === m.clientId);
            const overdue = isOverdue(m);
            return (
              <div key={m.id} className="lp-card" style={{ padding: 0, overflow: 'hidden', borderLeft: `3px solid ${typeBorder[m.type]}` }}>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ background: `${typeColor[m.type]}18`, color: typeColor[m.type], padding: '2px 10px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.type}</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{client?.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', color: 'hsl(var(--foreground-muted))' }}>{m.date} · {m.author}</span>
                      <button onClick={() => handleDelete(m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--foreground-muted))', padding: 2 }}><X size={14} /></button>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'hsl(var(--foreground-muted))', lineHeight: 1.6, marginBottom: m.followUp ? 8 : 0 }}>{m.content}</p>
                  {m.followUp && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: overdue ? 'rgba(139,28,28,0.2)' : 'rgba(200,149,42,0.08)', padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', color: overdue ? '#f87171' : 'hsl(var(--primary))' }}>
                      📅 Follow-up: {m.followUp}{overdue ? ' — OVERDUE' : ''}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-card animate-scale-in" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowAdd(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--foreground-muted))' }}><X size={20} /></button>
            <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.2rem', marginBottom: 4 }}>Log Communication</h3>
            <span className="gold-rule" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label className="lp-label">Client *</label>
                  <select value={form.clientId || ''} onChange={e => setF('clientId', e.target.value)} className={`lp-input ${errors.clientId ? 'error' : ''}`}>
                    <option value="">Select client…</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  {errors.clientId && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 4 }}>{errors.clientId}</p>}
                </div>
                <div><label className="lp-label">Type</label>
                  <select value={form.type || 'Call'} onChange={e => setF('type', e.target.value)} className="lp-input">
                    {COMM_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="lp-label">Notes / Summary *</label>
                <textarea value={form.content || ''} onChange={e => setF('content', e.target.value)} className={`lp-input ${errors.content ? 'error' : ''}`} placeholder="Summary of the communication…" rows={4} />
                {errors.content && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 4 }}>{errors.content}</p>}
              </div>
              <div><label className="lp-label">Schedule Follow-up Date (optional)</label>
                <input type="date" value={form.followUp || ''} onChange={e => setF('followUp', e.target.value)} className="lp-input" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'flex-end' }}>
              <button className="btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAdd}>Log Communication</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationsModule;
