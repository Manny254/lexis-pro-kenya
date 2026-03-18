import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { KENYAN_COURTS, HEARING_TYPES, type Hearing, type HearingType } from '@/types';
import { Plus, X, Trash2, Calendar } from 'lucide-react';

const getDaysUntil = (date: string) => {
  const d = new Date(date); const today = new Date();
  today.setHours(0,0,0,0); d.setHours(0,0,0,0);
  return Math.ceil((d.getTime() - today.getTime()) / 86400000);
};

const CalendarModule: React.FC = () => {
  const { hearings, setHearings, cases, clients, addToast } = useApp();
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'attorney';
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<Partial<Hearing>>({ type: 'Hearing', court: KENYAN_COURTS[0] });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const today = new Date();
  const upcoming = hearings.filter(h => getDaysUntil(h.date) >= 0).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = hearings.filter(h => getDaysUntil(h.date) < 0).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  const urgent = upcoming.filter(h => getDaysUntil(h.date) <= 3);

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => { const n = { ...e }; delete n[k]; return n; }); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title?.trim()) e.title = 'Hearing title is required';
    if (!form.caseId) e.caseId = 'Please select a case';
    if (!form.date) e.date = 'Date is required';
    if (!form.time?.trim()) e.time = 'Time is required';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;
    const selectedCase = cases.find(c => c.id === form.caseId);
    const newH: Hearing = {
      id: Math.random().toString(36).slice(2),
      caseId: form.caseId!, clientId: selectedCase?.clientId || '',
      title: form.title!, court: form.court || KENYAN_COURTS[0],
      date: form.date!, time: form.time!,
      type: form.type as HearingType, judge: form.judge || '',
      notes: form.notes || '',
    };
    setHearings(hs => [newH, ...hs]);
    addToast('Hearing added to calendar', 'success');
    setShowAdd(false);
    setForm({ type: 'Hearing', court: KENYAN_COURTS[0] });
  };

  const handleDelete = (id: string) => {
    const backup = [...hearings];
    const del = hearings.find(h => h.id === id)!;
    setHearings(hs => hs.filter(h => h.id !== id));
    addToast(`Hearing "${del.title}" removed`, 'info', () => setHearings(backup));
  };

  const HearingCard: React.FC<{ h: Hearing; faded?: boolean }> = ({ h, faded }) => {
    const days = getDaysUntil(h.date);
    const client = clients.find(c => c.id === h.clientId);
    const urgency = days <= 2 ? '#f87171' : days <= 7 ? 'hsl(var(--primary))' : 'hsl(var(--foreground-muted))';
    const typeColors: Record<string, string> = {
      'Call': 'hsl(var(--primary))', 'Email': '#93c5fd', 'Hearing': '#f87171',
      'Ruling': '#fbbf24', 'Judgment': '#fde68a', 'Mediation': '#93c5fd',
      'Pre-Trial': '#c4b5fd', 'Mention': 'hsl(var(--foreground-muted))', 'Appeal': '#c4b5fd',
    };
    return (
      <div className="lp-card" style={{ padding: 0, opacity: faded ? 0.55 : 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 0 }}>
          <div style={{ background: `${urgency}15`, borderRight: `3px solid ${urgency}`, padding: '16px 14px', textAlign: 'center', minWidth: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: urgency, fontFamily: "'Libre Baskerville', serif", lineHeight: 1 }}>{Math.abs(days)}</div>
            <div style={{ fontSize: '0.55rem', color: urgency, textTransform: 'uppercase', lineHeight: 1.2 }}>{faded ? 'ago' : 'days'}</div>
          </div>
          <div style={{ flex: 1, padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 4 }}>{h.title}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', background: `${typeColors[h.type] || '#888'}20`, color: typeColors[h.type] || '#888' }}>{h.type}</span>
                </div>
              </div>
              {!faded && canEdit && (
                <button onClick={() => handleDelete(h.id)} style={{ background: 'rgba(139,28,28,0.2)', border: 'none', cursor: 'pointer', borderRadius: 6, padding: '4px 8px', color: '#f87171' }}>
                  <Trash2 size={12} />
                </button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 12px', fontSize: '0.75rem', color: 'hsl(var(--foreground-muted))' }}>
              <span>🏛 {h.court}</span>
              <span>📅 {h.date} · {h.time}</span>
              {client && <span>👤 {client.name}</span>}
              {h.judge && <span>⚖️ {h.judge}</span>}
            </div>
            {h.notes && <p style={{ marginTop: 6, fontSize: '0.75rem', color: 'hsl(var(--foreground-muted))', fontStyle: 'italic', lineHeight: 1.4 }}>{h.notes}</p>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.5rem', margin: 0 }}>Court Calendar</h2>
          <span className="gold-rule" />
        </div>
        {canEdit && <button className="btn-primary" onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Plus size={15} /> Add Hearing</button>}
      </div>

      {urgent.length > 0 && (
        <div className="alert-banner-red" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          🚨 <strong>{urgent.length} hearing{urgent.length > 1 ? 's' : ''} within 3 days!</strong>
          {urgent.map(h => <span key={h.id} style={{ padding: '2px 8px', background: 'rgba(248,113,113,0.15)', borderRadius: 6, fontSize: '0.78rem' }}>{h.title} · {h.court} · {h.time}</span>)}
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'hsl(var(--foreground-muted))', marginBottom: 12 }}>Upcoming ({upcoming.length})</h3>
        {upcoming.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <h3>No Upcoming Hearings</h3>
            <p>Schedule your next court appearance to track it here.</p>
            {canEdit && <button className="btn-primary" onClick={() => setShowAdd(true)}>Schedule Hearing</button>}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {upcoming.map(h => <HearingCard key={h.id} h={h} />)}
          </div>
        )}
      </div>

      {past.length > 0 && (
        <div>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'hsl(var(--foreground-muted))', marginBottom: 12 }}>Past Hearings (last 5)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {past.map(h => <HearingCard key={h.id} h={h} faded />)}
          </div>
        </div>
      )}

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-card modal-card-lg animate-scale-in" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowAdd(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--foreground-muted))' }}><X size={20} /></button>
            <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.2rem', marginBottom: 4 }}>Schedule Hearing</h3>
            <span className="gold-rule" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 8 }}>
              <div>
                <label className="lp-label">Related Case *</label>
                <select value={form.caseId || ''} onChange={e => set('caseId', e.target.value)} className={`lp-input ${errors.caseId ? 'error' : ''}`}>
                  <option value="">Select case…</option>
                  {cases.map(c => <option key={c.id} value={c.id}>{c.title} ({c.caseNo})</option>)}
                </select>
                {errors.caseId && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 4 }}>{errors.caseId}</p>}
              </div>
              <div>
                <label className="lp-label">Hearing Title *</label>
                <input value={form.title || ''} onChange={e => set('title', e.target.value)} className={`lp-input ${errors.title ? 'error' : ''}`} placeholder="e.g. Main Hearing" />
                {errors.title && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 4 }}>{errors.title}</p>}
              </div>
              <div>
                <label className="lp-label">Court</label>
                <select value={form.court || ''} onChange={e => set('court', e.target.value)} className="lp-input">
                  {KENYAN_COURTS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="lp-label">Hearing Type</label>
                <select value={form.type || 'Hearing'} onChange={e => set('type', e.target.value)} className="lp-input">
                  {HEARING_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="lp-label">Date *</label>
                <input type="date" value={form.date || ''} onChange={e => set('date', e.target.value)} className={`lp-input ${errors.date ? 'error' : ''}`} />
                {errors.date && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 4 }}>{errors.date}</p>}
              </div>
              <div>
                <label className="lp-label">Time *</label>
                <input value={form.time || ''} onChange={e => set('time', e.target.value)} className={`lp-input ${errors.time ? 'error' : ''}`} placeholder="9:00 AM" />
                {errors.time && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 4 }}>{errors.time}</p>}
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="lp-label">Judge / Mediator Name</label>
                <input value={form.judge || ''} onChange={e => set('judge', e.target.value)} className="lp-input" placeholder="Hon. Justice A. Mutua" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="lp-label">Preparation Notes</label>
                <textarea value={form.notes || ''} onChange={e => set('notes', e.target.value)} className="lp-input" placeholder="What to prepare for this hearing…" rows={3} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'flex-end' }}>
              <button className="btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAdd}><Calendar size={14} style={{ marginRight: 6 }} />Schedule Hearing</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarModule;
