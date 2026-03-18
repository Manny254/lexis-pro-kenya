import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import type { Invoice, TimeEntry, InvoiceStatus } from '@/types';
import { Plus, X, Play, Pause, Save, RotateCcw, CheckCircle } from 'lucide-react';

const formatKES = (n: number) => `KES ${n.toLocaleString('en-KE')}`;
const pad = (n: number) => String(n).padStart(2, '0');

const BillingModule: React.FC = () => {
  const { clients, cases, invoices, setInvoices, timeEntries, setTimeEntries, addToast } = useApp();
  const { user } = useAuth();
  const [tab, setTab] = useState<'invoices' | 'timelog'>('invoices');
  const [showAddInv, setShowAddInv] = useState(false);
  const [showAddTime, setShowAddTime] = useState(false);
  const [mpesaModal, setMpesaModal] = useState<string | null>(null);
  const [mpesaCode, setMpesaCode] = useState('');

  // Timer
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // seconds
  const intervalRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);

  useEffect(() => {
    elapsedRef.current = elapsed;
  }, [elapsed]);

  const startTimer = () => {
    setRunning(true);
    intervalRef.current = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
    }, 1000) as unknown as number;
  };

  const pauseTimer = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    pauseTimer();
    setElapsed(0);
    elapsedRef.current = 0;
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const timerMins = Math.floor(elapsed / 60);
  const timerSecs = elapsed % 60;

  // Invoice form
  const [invForm, setInvForm] = useState<Partial<Invoice>>({ status: 'Pending' });
  const [invErrors, setInvErrors] = useState<Record<string, string>>({});
  const setInv = (k: string, v: string | number) => { setInvForm(f => ({ ...f, [k]: v })); if (invErrors[k]) setInvErrors(e => { const n = { ...e }; delete n[k]; return n; }); };
  const invTotal = (invForm.hours || 0) * (invForm.rateKES || 0);

  const validateInv = () => {
    const e: Record<string, string> = {};
    if (!invForm.clientId) e.clientId = 'Please select a client';
    if (!invForm.description?.trim()) e.description = 'Description is required';
    if (!invForm.hours || invForm.hours <= 0) e.hours = 'Hours must be greater than 0';
    if (!invForm.rateKES || invForm.rateKES <= 0) e.rateKES = 'Rate must be greater than 0';
    setInvErrors(e); return Object.keys(e).length === 0;
  };

  const handleAddInv = () => {
    if (!validateInv()) return;
    const inv: Invoice = {
      id: Math.random().toString(36).slice(2),
      clientId: invForm.clientId!,
      description: invForm.description!,
      hours: invForm.hours!,
      rateKES: invForm.rateKES!,
      invoiceNo: `INV/2026/${String(invoices.length + 4).padStart(3, '0')}`,
      status: invForm.status as InvoiceStatus,
      date: new Date().toISOString().split('T')[0],
      mpesaRef: invForm.mpesaRef,
    };
    setInvoices(is => [inv, ...is]);
    addToast(`Invoice ${inv.invoiceNo} created`, 'success');
    setShowAddInv(false);
    setInvForm({ status: 'Pending' });
  };

  // Time entry form
  const [timeForm, setTimeForm] = useState<Partial<TimeEntry>>({ minutes: Math.round(elapsed / 60) || 30 });
  const [timeErrors, setTimeErrors] = useState<Record<string, string>>({});
  const setTime = (k: string, v: string | number) => { setTimeForm(f => ({ ...f, [k]: v })); if (timeErrors[k]) setTimeErrors(e => { const n = { ...e }; delete n[k]; return n; }); };

  const openTimeForm = () => {
    setTimeForm(f => ({ ...f, minutes: Math.max(15, Math.round(elapsed / 60 / 15) * 15) }));
    setShowAddTime(true);
  };

  const validateTime = () => {
    const e: Record<string, string> = {};
    if (!timeForm.clientId) e.clientId = 'Please select a client';
    if (!timeForm.description?.trim()) e.description = 'Description is required';
    setTimeErrors(e); return Object.keys(e).length === 0;
  };

  const handleAddTime = () => {
    if (!validateTime()) return;
    const te: TimeEntry = {
      id: Math.random().toString(36).slice(2),
      clientId: timeForm.clientId!,
      caseId: timeForm.caseId,
      description: timeForm.description!,
      minutes: timeForm.minutes || 30,
      date: new Date().toISOString().split('T')[0],
      user: user?.name || 'Unknown',
    };
    setTimeEntries(ts => [te, ...ts]);
    addToast('Time entry saved', 'success');
    setShowAddTime(false);
    resetTimer();
  };

  const handleMpesa = (id: string) => {
    setInvoices(is => is.map(inv => inv.id === id ? { ...inv, status: 'Paid', mpesaRef: mpesaCode } : inv));
    addToast('M-Pesa payment recorded', 'success');
    setMpesaModal(null);
    setMpesaCode('');
  };

  const handleDeleteInv = (id: string) => {
    const backup = [...invoices];
    const del = invoices.find(i => i.id === id)!;
    setInvoices(is => is.filter(i => i.id !== id));
    addToast(`Invoice ${del.invoiceNo} deleted`, 'info', () => setInvoices(backup));
  };

  const clientCases = (clientId: string) => cases.filter(c => c.clientId === clientId);

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <h2>Billing & Time Tracking</h2>
        <span className="gold-rule" />
      </div>

      {/* Timer widget */}
      <div className="lp-card" style={{ padding: '20px 24px', marginBottom: 24 }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'hsl(var(--foreground-muted))', marginBottom: 12 }}>Live Timer</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div className="timer-display">{pad(timerMins)}:{pad(timerSecs)}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {!running ? (
              <button onClick={startTimer} style={{ background: 'rgba(10,92,46,0.3)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 600 }}>
                <Play size={14} /> Start Timer
              </button>
            ) : (
              <button onClick={pauseTimer} style={{ background: 'rgba(200,149,42,0.15)', border: '1px solid rgba(200,149,42,0.25)', color: 'hsl(var(--primary))', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 600 }}>
                <Pause size={14} /> Pause
              </button>
            )}
            {elapsed > 0 && (
              <button onClick={openTimeForm} style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(93,165,254,0.2)', color: '#93c5fd', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.82rem', fontWeight: 600 }}>
                <Save size={13} /> Save Time
              </button>
            )}
            {elapsed > 0 && (
              <button onClick={resetTimer} style={{ background: 'none', border: '1px solid rgba(200,149,42,0.15)', color: 'hsl(var(--foreground-muted))', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.82rem' }}>
                <RotateCcw size={13} /> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, background: 'hsl(var(--card))', borderRadius: 8, padding: 4, border: '1px solid rgba(200,149,42,0.12)', width: 'fit-content' }}>
        {(['invoices', 'timelog'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 20px', borderRadius: 6, border: 'none', cursor: 'pointer',
            background: tab === t ? 'hsl(var(--primary))' : 'none',
            color: tab === t ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground-muted))',
            fontWeight: 600, fontSize: '0.82rem', transition: 'all 0.2s',
          }}>
            {t === 'invoices' ? '💰 Invoices' : '⏱ Time Log'}
          </button>
        ))}
      </div>

      {tab === 'invoices' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button className="btn-primary" onClick={() => setShowAddInv(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Plus size={14} /> Create Invoice</button>
          </div>
          {invoices.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">💰</div>
              <h3>No Invoices Yet</h3>
              <p>Create invoices to track your billable hours in KES.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {invoices.map(inv => {
                const client = clients.find(c => c.id === inv.clientId);
                const total = inv.hours * inv.rateKES;
                return (
                  <div key={inv.id} className="lp-card" style={{ padding: '18px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'hsl(var(--primary))' }}>{inv.invoiceNo}</span>
                          <span className={`badge badge-${inv.status.toLowerCase()}`}>{inv.status}</span>
                        </div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{client?.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'hsl(var(--foreground-muted))', marginTop: 2 }}>{inv.description}</div>
                      </div>
                      <div className="kes-amount" style={{ fontSize: '1.4rem', textAlign: 'right' }}>
                        {formatKES(total)}
                        <div style={{ fontSize: '0.7rem', color: 'hsl(var(--foreground-muted))', fontFamily: "'Outfit', sans-serif", fontWeight: 400 }}>
                          {inv.hours}h × {formatKES(inv.rateKES)}/hr
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'hsl(var(--foreground-muted))' }}>📅 {inv.date}</span>
                        {inv.mpesaRef && (
                          <span style={{ marginLeft: 12, fontSize: '0.75rem', color: '#4ade80', fontFamily: 'monospace', background: 'rgba(10,92,46,0.2)', padding: '2px 8px', borderRadius: 6 }}>
                            ✓ M-Pesa: {inv.mpesaRef}
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {inv.status !== 'Paid' && (
                          <button onClick={() => setMpesaModal(inv.id)} style={{ background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.25)', color: '#4ade80', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                            📱 Record M-Pesa
                          </button>
                        )}
                        <button onClick={() => handleDeleteInv(inv.id)} style={{ background: 'rgba(139,28,28,0.15)', border: 'none', cursor: 'pointer', borderRadius: 6, padding: '5px 8px', color: '#f87171' }}>
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'timelog' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button className="btn-primary" onClick={openTimeForm} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Plus size={14} /> Log Time</button>
          </div>
          {timeEntries.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">⏱</div>
              <h3>No Time Entries</h3>
              <p>Use the timer above or log time manually.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {timeEntries.map(te => {
                const client = clients.find(c => c.id === te.clientId);
                const relCase = cases.find(c => c.id === te.caseId);
                return (
                  <div key={te.id} className="lp-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ background: 'rgba(200,149,42,0.12)', borderRadius: 8, padding: '8px 14px', textAlign: 'center', minWidth: 64 }}>
                      <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.1rem', fontWeight: 700, color: 'hsl(var(--primary))' }}>
                        {Math.floor(te.minutes / 60)}<span style={{ fontSize: '0.65rem' }}>h</span>{te.minutes % 60 > 0 ? ` ${te.minutes % 60}` : ''}<span style={{ fontSize: '0.65rem' }}>{te.minutes % 60 > 0 ? 'm' : ''}</span>
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 3 }}>{te.description}</div>
                      <div style={{ fontSize: '0.72rem', color: 'hsl(var(--foreground-muted))' }}>
                        👤 {client?.name}{relCase ? ` · ${relCase.caseNo}` : ''} · {te.date} · {te.user}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Invoice form modal */}
      {showAddInv && (
        <div className="modal-overlay" onClick={() => setShowAddInv(false)}>
          <div className="modal-card animate-scale-in" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowAddInv(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--foreground-muted))' }}><X size={20} /></button>
            <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.2rem', marginBottom: 4 }}>Create Invoice</h3>
            <span className="gold-rule" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
              <div>
                <label className="lp-label">Client *</label>
                <select value={invForm.clientId || ''} onChange={e => setInv('clientId', e.target.value)} className={`lp-input ${invErrors.clientId ? 'error' : ''}`}>
                  <option value="">Select client…</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {invErrors.clientId && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 4 }}>{invErrors.clientId}</p>}
              </div>
              <div>
                <label className="lp-label">Description *</label>
                <input value={invForm.description || ''} onChange={e => setInv('description', e.target.value)} className={`lp-input ${invErrors.description ? 'error' : ''}`} placeholder="Legal representation — hearing + drafting" />
                {invErrors.description && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 4 }}>{invErrors.description}</p>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="lp-label">Hours Billed *</label>
                  <input type="number" step="0.5" min="0.5" value={invForm.hours || ''} onChange={e => setInv('hours', parseFloat(e.target.value))} className={`lp-input ${invErrors.hours ? 'error' : ''}`} placeholder="0.5" />
                  {invErrors.hours && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 4 }}>{invErrors.hours}</p>}
                </div>
                <div>
                  <label className="lp-label">Rate (KES/hr) *</label>
                  <input type="number" step="500" min="0" value={invForm.rateKES || ''} onChange={e => setInv('rateKES', parseFloat(e.target.value))} className={`lp-input ${invErrors.rateKES ? 'error' : ''}`} placeholder="8500" />
                  {invErrors.rateKES && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 4 }}>{invErrors.rateKES}</p>}
                </div>
              </div>
              {invTotal > 0 && (
                <div style={{ background: 'rgba(200,149,42,0.08)', border: '1px solid rgba(200,149,42,0.2)', borderRadius: 8, padding: '10px 14px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'hsl(var(--foreground-muted))' }}>Total Invoice Amount = </span>
                  <span className="kes-amount" style={{ fontSize: '1.1rem' }}>{formatKES(invTotal)}</span>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="lp-label">Status</label>
                  <select value={invForm.status || 'Pending'} onChange={e => setInv('status', e.target.value)} className="lp-input">
                    {['Pending', 'Paid', 'Partial'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="lp-label">M-Pesa Ref (if paid)</label>
                  <input value={invForm.mpesaRef || ''} onChange={e => setInv('mpesaRef', e.target.value)} className="lp-input" placeholder="QG7X4M2P9K" />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'flex-end' }}>
              <button className="btn-ghost" onClick={() => setShowAddInv(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAddInv}>Create Invoice</button>
            </div>
          </div>
        </div>
      )}

      {/* Time log modal */}
      {showAddTime && (
        <div className="modal-overlay" onClick={() => setShowAddTime(false)}>
          <div className="modal-card animate-scale-in" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowAddTime(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--foreground-muted))' }}><X size={20} /></button>
            <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.2rem', marginBottom: 4 }}>Log Time Entry</h3>
            <span className="gold-rule" />
            {elapsed > 0 && (
              <div style={{ background: 'rgba(200,149,42,0.07)', border: '1px solid rgba(200,149,42,0.2)', borderRadius: 8, padding: '8px 14px', marginBottom: 16, fontSize: '0.82rem', color: 'hsl(var(--primary))' }}>
                ⏱ Timer elapsed: {pad(timerMins)}:{pad(timerSecs)} — pre-filled below
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
              <div>
                <label className="lp-label">Client *</label>
                <select value={timeForm.clientId || ''} onChange={e => setTime('clientId', e.target.value)} className={`lp-input ${timeErrors.clientId ? 'error' : ''}`}>
                  <option value="">Select client…</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {timeErrors.clientId && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 4 }}>{timeErrors.clientId}</p>}
              </div>
              <div>
                <label className="lp-label">Related Case</label>
                <select value={timeForm.caseId || ''} onChange={e => setTime('caseId', e.target.value)} className="lp-input" disabled={!timeForm.clientId}>
                  <option value="">Select case…</option>
                  {clientCases(timeForm.clientId || '').map(c => <option key={c.id} value={c.id}>{c.caseNo}</option>)}
                </select>
              </div>
              <div>
                <label className="lp-label">Description *</label>
                <textarea value={timeForm.description || ''} onChange={e => setTime('description', e.target.value)} className={`lp-input ${timeErrors.description ? 'error' : ''}`} placeholder="Research on adverse possession case law…" rows={2} />
                {timeErrors.description && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 4 }}>{timeErrors.description}</p>}
              </div>
              <div>
                <label className="lp-label">Duration (minutes)</label>
                <input type="number" step="15" min="15" value={timeForm.minutes || 30} onChange={e => setTime('minutes', parseInt(e.target.value))} className="lp-input" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'flex-end' }}>
              <button className="btn-ghost" onClick={() => setShowAddTime(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAddTime}><Save size={14} style={{ marginRight: 6 }} /> Save Entry</button>
            </div>
          </div>
        </div>
      )}

      {/* M-Pesa modal */}
      {mpesaModal && (
        <div className="modal-overlay" onClick={() => setMpesaModal(null)}>
          <div className="modal-card animate-scale-in" onClick={e => e.stopPropagation()} style={{ maxWidth: 360 }}>
            <button onClick={() => setMpesaModal(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--foreground-muted))' }}><X size={18} /></button>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📱</div>
              <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.1rem' }}>Record M-Pesa Payment</h3>
            </div>
            <label className="lp-label">M-Pesa Transaction Code</label>
            <input value={mpesaCode} onChange={e => setMpesaCode(e.target.value.toUpperCase())} className="lp-input" placeholder="e.g. QG7X4M2P9K" style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }} />
            <p style={{ fontSize: '0.72rem', color: 'hsl(var(--foreground-muted))', marginTop: 6, marginBottom: 16 }}>Enter the M-Pesa confirmation code sent via SMS</p>
            <button className="btn-primary" onClick={() => handleMpesa(mpesaModal)} style={{ width: '100%', padding: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }} disabled={!mpesaCode.trim()}>
              <CheckCircle size={16} /> Confirm Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingModule;
