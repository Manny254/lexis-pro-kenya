import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { CASE_TYPES, KENYAN_COUNTIES, type Client, type ClientStatus, type Priority, type CaseType } from '@/types';
import { Plus, Search, Trash2, Edit2, X, ChevronDown } from 'lucide-react';

const genLskRef = () => `LSK/FILE/2026/${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`;

const ClientModal: React.FC<{ client?: Client; onClose: () => void; onSave: (c: Client) => void }> = ({ client, onClose, onSave }) => {
  const editing = !!client;
  const [form, setForm] = useState<Partial<Client>>(client || { status: 'Consultation', priority: 'Medium', caseType: 'Land Dispute', location: 'Nairobi' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => { const n = { ...e }; delete n[k]; return n; }); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name?.trim()) e.name = 'Full name is required';
    if (!form.email?.trim()) e.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.phone?.trim()) e.phone = 'Phone number is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      id: client?.id || Math.random().toString(36).slice(2),
      name: form.name!, email: form.email!, phone: form.phone!,
      caseType: form.caseType as CaseType, status: form.status as ClientStatus,
      priority: form.priority as Priority, location: form.location || 'Nairobi',
      notes: form.notes || '', date: client?.date || new Date().toISOString().split('T')[0],
      lskRef: client?.lskRef || genLskRef(), tags: client?.tags || [],
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-lg animate-scale-in" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--foreground-muted))' }}><X size={20} /></button>
        <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.25rem', marginBottom: 4 }}>{editing ? 'Edit Client' : 'New Client Intake'}</h3>
        <span className="gold-rule" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: 8 }}>
          {[
            { k: 'name', label: 'Full Name *', type: 'text', placeholder: 'e.g. Kariuki Mwangi' },
            { k: 'email', label: 'Email Address *', type: 'email', placeholder: 'client@example.com' },
            { k: 'phone', label: 'Phone (+254) *', type: 'text', placeholder: '+254 722 000 000' },
          ].map(f => (
            <div key={f.k} style={{ gridColumn: f.k === 'phone' ? '1' : 'auto' }}>
              <label className="lp-label">{f.label}</label>
              <input type={f.type} value={(form as any)[f.k] || ''} onChange={e => set(f.k, e.target.value)} className={`lp-input ${errors[f.k] ? 'error' : ''}`} placeholder={f.placeholder} />
              {errors[f.k] && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 4 }}>{errors[f.k]}</p>}
            </div>
          ))}

          <div>
            <label className="lp-label">County / Location</label>
            <select value={form.location || 'Nairobi'} onChange={e => set('location', e.target.value)} className="lp-input">
              {KENYAN_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="lp-label">Case Type</label>
            <select value={form.caseType || 'Land Dispute'} onChange={e => set('caseType', e.target.value)} className="lp-input">
              {CASE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="lp-label">Status</label>
            <select value={form.status || 'Consultation'} onChange={e => set('status', e.target.value)} className="lp-input">
              {['Active', 'Consultation', 'Closed'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="lp-label">Priority</label>
            <select value={form.priority || 'Medium'} onChange={e => set('priority', e.target.value)} className="lp-input">
              {['High', 'Medium', 'Low'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label className="lp-label">Case Notes</label>
            <textarea value={form.notes || ''} onChange={e => set('notes', e.target.value)} className="lp-input" placeholder="Brief description of legal matter…" rows={3} />
            <p style={{ fontSize: '0.7rem', color: 'hsl(var(--foreground-muted))', marginTop: 4 }}>🔒 Protected by advocate-client privilege — Advocates Act Cap 16</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'flex-end' }}>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>{editing ? 'Save Changes' : 'Add Client'}</button>
        </div>
      </div>
    </div>
  );
};

const ClientDetailModal: React.FC<{ client: Client; onClose: () => void; canEdit: boolean; onEdit: () => void }> = ({ client, onClose, canEdit, onEdit }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-card modal-card-lg animate-scale-in" onClick={e => e.stopPropagation()}>
      <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--foreground-muted))' }}><X size={20} /></button>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(200,149,42,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 700, color: 'hsl(var(--primary))', flexShrink: 0 }}>
          {client.name.charAt(0)}
        </div>
        <div>
          <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.2rem', margin: 0 }}>{client.name}</h3>
          <p style={{ color: 'hsl(var(--primary))', fontSize: '0.75rem', margin: '4px 0 6px', fontFamily: 'monospace' }}>{client.lskRef}</p>
          <div style={{ display: 'flex', gap: 6 }}>
            <span className={`badge badge-${client.status.toLowerCase()}`}>{client.status}</span>
            <span className={`badge badge-${client.priority.toLowerCase()}`}>{client.priority} Priority</span>
          </div>
        </div>
      </div>
      <span className="gold-rule" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[
          { label: 'Email', value: client.email },
          { label: 'Phone', value: client.phone },
          { label: 'Case Type', value: client.caseType },
          { label: 'Location', value: client.location },
          { label: 'Date Added', value: client.date },
        ].map(f => (
          <div key={f.label}>
            <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'hsl(var(--foreground-muted))', marginBottom: 4 }}>{f.label}</p>
            <p style={{ fontSize: '0.875rem', color: 'hsl(var(--foreground))' }}>{f.value}</p>
          </div>
        ))}
      </div>
      {client.notes && (
        <div style={{ marginTop: 16, background: 'rgba(200,149,42,0.07)', border: '1px solid rgba(200,149,42,0.2)', borderRadius: 8, padding: '12px 14px' }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'hsl(var(--primary))', marginBottom: 6 }}>Case Notes</p>
          <p style={{ fontSize: '0.875rem', color: 'hsl(var(--foreground-muted))', lineHeight: 1.6 }}>{client.notes}</p>
          <p style={{ fontSize: '0.68rem', color: 'rgba(200,149,42,0.5)', marginTop: 8 }}>🔒 Advocate-client privilege — Advocates Act Cap 16</p>
        </div>
      )}
      {canEdit && (
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-ghost" onClick={onEdit}><Edit2 size={14} style={{ marginRight: 6 }} /> Edit Client</button>
        </div>
      )}
    </div>
  </div>
);

const ClientsModule: React.FC = () => {
  const { clients, setClients, addToast } = useApp();
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'attorney';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [viewing, setViewing] = useState<Client | null>(null);

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || c.lskRef.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchType = typeFilter === 'All' || c.caseType === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const toggleSelect = (id: string) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelected(s => s.size === filtered.length ? new Set() : new Set(filtered.map(c => c.id)));

  const handleDelete = (id: string) => {
    const backup = [...clients];
    const deletedClient = clients.find(c => c.id === id)!;
    setClients(cs => cs.filter(c => c.id !== id));
    addToast(`Client "${deletedClient.name}" deleted`, 'info', () => setClients(backup));
  };

  const handleBulkDelete = () => {
    const backup = [...clients];
    const count = selected.size;
    setClients(cs => cs.filter(c => !selected.has(c.id)));
    setSelected(new Set());
    addToast(`${count} client(s) deleted`, 'info', () => setClients(backup));
  };

  const handleSave = (c: Client) => {
    if (editing) { setClients(cs => cs.map(x => x.id === c.id ? c : x)); addToast('Client updated', 'success'); setEditing(null); }
    else { setClients(cs => [c, ...cs]); addToast('Client added', 'success'); setShowAdd(false); }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.5rem', margin: 0 }}>Clients</h2>
          <span className="gold-rule" />
        </div>
        {canEdit && <button className="btn-primary" onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Plus size={15} /> New Client</button>}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--foreground-muted))' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} className="lp-input" placeholder="Search name, email, LSK ref…" style={{ paddingLeft: 36 }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="lp-input" style={{ width: 'auto', minWidth: 140 }}>
          {['All', 'Active', 'Consultation', 'Closed'].map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="lp-input" style={{ width: 'auto', minWidth: 180 }}>
          <option>All</option>
          {CASE_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        {selected.size > 0 && (
          <button className="btn-danger" onClick={handleBulkDelete} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Trash2 size={13} /> Delete ({selected.size})
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3>No Clients Found</h3>
          <p>Add your first client to begin tracking their legal matter.</p>
          {canEdit && <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} style={{ marginRight: 6 }} /> Add First Client</button>}
        </div>
      ) : (
        <div className="lp-card" style={{ overflow: 'hidden', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: 'rgba(200,149,42,0.05)' }}>
                <th style={{ width: 40, padding: '10px 12px' }}>
                  <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll}
                    style={{ accentColor: 'hsl(var(--primary))', cursor: 'pointer' }} />
                </th>
                {['Client', 'Case Type', 'Status', 'Priority', 'Location', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: 'hsl(var(--foreground-muted))', fontWeight: 600, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{ borderTop: '1px solid rgba(200,149,42,0.08)', transition: 'background 0.15s', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,149,42,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  onClick={() => setViewing(c)}
                >
                  <td style={{ padding: '10px 12px' }} onClick={e => { e.stopPropagation(); toggleSelect(c.id); }}>
                    <input type="checkbox" checked={selected.has(c.id)} onChange={() => {}} style={{ accentColor: 'hsl(var(--primary))', cursor: 'pointer' }} />
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ fontWeight: 600, color: 'hsl(var(--foreground))' }}>{c.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'hsl(var(--foreground-muted))' }}>{c.lskRef}</div>
                  </td>
                  <td style={{ padding: '10px 12px', color: 'hsl(var(--foreground-muted))' }}>{c.caseType}</td>
                  <td style={{ padding: '10px 12px' }}><span className={`badge badge-${c.status.toLowerCase()}`}>{c.status}</span></td>
                  <td style={{ padding: '10px 12px' }}><span className={`badge badge-${c.priority.toLowerCase()}`}>{c.priority}</span></td>
                  <td style={{ padding: '10px 12px', color: 'hsl(var(--foreground-muted))' }}>{c.location}</td>
                  <td style={{ padding: '10px 12px', color: 'hsl(var(--foreground-muted))' }}>{c.date}</td>
                  <td style={{ padding: '10px 12px' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {canEdit && <button onClick={() => setEditing(c)} style={{ background: 'rgba(200,149,42,0.1)', border: 'none', cursor: 'pointer', borderRadius: 6, padding: '5px 8px', color: 'hsl(var(--primary))' }}><Edit2 size={12} /></button>}
                      {canEdit && <button onClick={() => handleDelete(c.id)} style={{ background: 'rgba(139,28,28,0.2)', border: 'none', cursor: 'pointer', borderRadius: 6, padding: '5px 8px', color: '#f87171' }}><Trash2 size={12} /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(showAdd || editing) && <ClientModal client={editing || undefined} onClose={() => { setShowAdd(false); setEditing(null); }} onSave={handleSave} />}
      {viewing && <ClientDetailModal client={viewing} onClose={() => setViewing(null)} canEdit={canEdit} onEdit={() => { setEditing(viewing); setViewing(null); }} />}
    </div>
  );
};

export default ClientsModule;
