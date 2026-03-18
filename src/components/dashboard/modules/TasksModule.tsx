import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import type { Task, TaskStatus, Priority } from '@/types';
import { Plus, X, Trash2 } from 'lucide-react';
import { DEMO_USERS } from '@/data/seed';

const TasksModule: React.FC = () => {
  const { tasks, setTasks, clients, cases, addToast } = useApp();
  const { user } = useAuth();
  const canDelete = user?.role === 'admin';
  const [filter, setFilter] = useState<'All' | TaskStatus>('All');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<Partial<Task>>({ status: 'Pending', priority: 'Medium' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const today = new Date();
  const isOverdue = (t: Task) => t.status !== 'Done' && new Date(t.deadline) < today;
  const daysUntil = (d: string) => Math.ceil((new Date(d).getTime() - today.getTime()) / 86400000);

  const filtered = tasks.filter(t => filter === 'All' || t.status === filter);

  const toggleSelect = (id: string) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelected(s => s.size === filtered.length ? new Set() : new Set(filtered.map(t => t.id)));

  const cycleStatus = (id: string) => {
    const cycle: TaskStatus[] = ['Pending', 'In Progress', 'Done'];
    setTasks(ts => ts.map(t => t.id === id ? { ...t, status: cycle[(cycle.indexOf(t.status) + 1) % 3] } : t));
  };

  const bulkComplete = () => {
    const backup = [...tasks];
    setTasks(ts => ts.map(t => selected.has(t.id) ? { ...t, status: 'Done' } : t));
    addToast(`${selected.size} task(s) marked done`, 'success', () => setTasks(backup));
    setSelected(new Set());
  };

  const handleDelete = (id: string) => {
    const backup = [...tasks];
    const del = tasks.find(t => t.id === id)!;
    setTasks(ts => ts.filter(t => t.id !== id));
    addToast(`Task deleted`, 'info', () => setTasks(backup));
  };

  const setF = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => { const n = { ...e }; delete n[k]; return n; }); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title?.trim()) e.title = 'Task title is required';
    if (!form.deadline) e.deadline = 'Deadline is required';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;
    const t: Task = { id: Math.random().toString(36).slice(2), title: form.title!, assignedTo: form.assignedTo || 'Amina Waweru', deadline: form.deadline!, clientId: form.clientId, caseId: form.caseId, status: 'Pending', priority: form.priority as Priority };
    setTasks(ts => [t, ...ts]);
    addToast('Task created', 'success');
    setShowAdd(false);
    setForm({ status: 'Pending', priority: 'Medium' });
  };

  const borderColor = (t: Task) => isOverdue(t) ? '#f87171' : t.priority === 'High' ? 'hsl(var(--primary))' : t.priority === 'Medium' ? '#93c5fd' : 'rgba(200,149,42,0.2)';
  const dueDateColor = (t: Task) => {
    const d = daysUntil(t.deadline);
    if (isOverdue(t)) return '#f87171';
    if (d <= 3) return 'hsl(var(--primary))';
    return 'hsl(var(--foreground-muted))';
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div><h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.5rem', margin: 0 }}>Tasks</h2><span className="gold-rule" /></div>
        <div style={{ display: 'flex', gap: 8 }}>
          {selected.size > 0 && <button className="btn-primary" onClick={bulkComplete} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', padding: '8px 14px' }}>✓ Done ({selected.size})</button>}
          <button className="btn-primary" onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Plus size={15} /> New Task</button>
        </div>
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['All', 'Pending', 'In Progress', 'Done'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 16px', borderRadius: 999, border: '1px solid', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s', background: filter === f ? 'hsl(var(--primary))' : 'transparent', color: filter === f ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground-muted))', borderColor: filter === f ? 'transparent' : 'rgba(200,149,42,0.25)' }}>
            {f}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} style={{ accentColor: 'hsl(var(--primary))', cursor: 'pointer' }} />
          <span style={{ fontSize: '0.75rem', color: 'hsl(var(--foreground-muted))', marginLeft: 6 }}>Select all</span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">✅</div><h3>No Tasks</h3><p>All tasks done — or add your first task below.</p><button className="btn-primary" onClick={() => setShowAdd(true)}>Add Task</button></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(t => {
            const client = clients.find(c => c.id === t.clientId);
            return (
              <div key={t.id} className="lp-card" style={{ padding: '12px 16px', borderLeft: `3px solid ${borderColor(t)}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                <input type="checkbox" checked={selected.has(t.id)} onChange={() => toggleSelect(t.id)} style={{ accentColor: 'hsl(var(--primary))', cursor: 'pointer' }} />
                <button onClick={() => cycleStatus(t.id)} style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${t.status === 'Done' ? '#4ade80' : t.status === 'In Progress' ? '#93c5fd' : 'rgba(200,149,42,0.4)'}`, background: t.status === 'Done' ? 'rgba(74,222,128,0.2)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', flexShrink: 0, color: t.status === 'Done' ? '#4ade80' : 'transparent' }}>
                  {t.status === 'Done' ? '✓' : ''}
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, textDecoration: t.status === 'Done' ? 'line-through' : 'none', opacity: t.status === 'Done' ? 0.5 : 1 }}>{t.title}</div>
                  <div style={{ fontSize: '0.72rem', color: 'hsl(var(--foreground-muted))', marginTop: 3 }}>
                    {t.assignedTo}{client ? ` · ${client.name}` : ''} ·{' '}
                    <span style={{ color: dueDateColor(t), fontWeight: isOverdue(t) ? 700 : 400 }}>
                      {isOverdue(t) ? `⚠ OVERDUE · ${t.deadline}` : `Due: ${t.deadline}`}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span className={`badge badge-${t.priority.toLowerCase()}`}>{t.priority}</span>
                  <span className={`badge badge-${t.status.toLowerCase().replace(' ', '-')}`}>{t.status}</span>
                  {canDelete && <button onClick={() => handleDelete(t.id)} style={{ background: 'rgba(139,28,28,0.15)', border: 'none', cursor: 'pointer', borderRadius: 6, padding: '4px 7px', color: '#f87171' }}><Trash2 size={12} /></button>}
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
            <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.2rem', marginBottom: 4 }}>New Task</h3>
            <span className="gold-rule" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
              <div><label className="lp-label">Title *</label><input value={form.title || ''} onChange={e => setF('title', e.target.value)} className={`lp-input ${errors.title ? 'error' : ''}`} placeholder="Task description…" />{errors.title && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 4 }}>{errors.title}</p>}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label className="lp-label">Assign To</label>
                  <select value={form.assignedTo || ''} onChange={e => setF('assignedTo', e.target.value)} className="lp-input">
                    <option value="">Select…</option>
                    {DEMO_USERS.map(u => <option key={u.id}>{u.name}</option>)}
                  </select>
                </div>
                <div><label className="lp-label">Priority</label>
                  <select value={form.priority || 'Medium'} onChange={e => setF('priority', e.target.value)} className="lp-input">
                    {['High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div><label className="lp-label">Deadline *</label><input type="date" value={form.deadline || ''} onChange={e => setF('deadline', e.target.value)} className={`lp-input ${errors.deadline ? 'error' : ''}`} />{errors.deadline && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 4 }}>{errors.deadline}</p>}</div>
                <div><label className="lp-label">Client</label>
                  <select value={form.clientId || ''} onChange={e => setF('clientId', e.target.value)} className="lp-input">
                    <option value="">None</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'flex-end' }}>
              <button className="btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAdd}>Add Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksModule;
