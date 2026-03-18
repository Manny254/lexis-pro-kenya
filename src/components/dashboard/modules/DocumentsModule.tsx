import React, { useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { DOC_TYPES, type Document, type DocType } from '@/types';
import { Upload, Trash2, Download, X, FileText } from 'lucide-react';

const extBadge = (ext: string) => {
  const map: Record<string, string> = { pdf: 'badge-pdf', docx: 'badge-docx', xlsx: 'badge-xlsx', jpg: 'badge-img', png: 'badge-img' };
  return map[ext.toLowerCase()] || 'badge-closed';
};

const DocumentsModule: React.FC = () => {
  const { documents, setDocuments, clients, cases, addToast } = useApp();
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'attorney';

  const [clientFilter, setClientFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [form, setForm] = useState<Partial<Document & { fileName: string }>>({ type: 'Court Pleading', fileExt: 'pdf' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dropRef = useRef<HTMLDivElement>(null);

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => { const n = { ...e }; delete n[k]; return n; }); };

  const filtered = documents.filter(d => clientFilter === 'All' || d.clientId === clientFilter);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name?.trim()) e.name = 'File name is required';
    if (!form.clientId) e.clientId = 'Please select a client';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;
    const newDoc: Document = {
      id: Math.random().toString(36).slice(2),
      clientId: form.clientId!, caseId: form.caseId,
      name: form.name!, size: '—', type: form.type as DocType,
      fileExt: form.fileExt || 'pdf',
      uploaded: new Date().toISOString().split('T')[0],
      uploadedBy: user?.name || 'Unknown',
      version: 1,
    };
    setDocuments(ds => [newDoc, ...ds]);
    addToast('Document added', 'success');
    setShowAdd(false);
    setForm({ type: 'Court Pleading', fileExt: 'pdf' });
  };

  const handleDelete = (id: string) => {
    const backup = [...documents];
    const del = documents.find(d => d.id === id)!;
    setDocuments(ds => ds.filter(d => d.id !== id));
    addToast(`"${del.name}" deleted`, 'info', () => setDocuments(backup));
  };

  const clientCases = cases.filter(c => c.clientId === form.clientId);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.5rem', margin: 0 }}>Documents</h2>
          <span className="gold-rule" />
        </div>
        {canEdit && <button className="btn-primary" onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Upload size={15} /> Upload Document</button>}
      </div>

      <div style={{ marginBottom: 16 }}>
        <select value={clientFilter} onChange={e => setClientFilter(e.target.value)} className="lp-input" style={{ width: 'auto', minWidth: 200 }}>
          <option value="All">All Clients</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📁</div>
          <h3>No Documents Found</h3>
          <p>Upload court pleadings, contracts, and evidence securely.</p>
          {canEdit && <button className="btn-primary" onClick={() => setShowAdd(true)}><Upload size={14} style={{ marginRight: 6 }} />Upload First Document</button>}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {filtered.map(d => {
            const client = clients.find(c => c.id === d.clientId);
            const relCase = cases.find(c => c.id === d.caseId);
            return (
              <div key={d.id} className="lp-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <span className={`badge ${extBadge(d.fileExt)}`}>{d.fileExt.toUpperCase()}</span>
                    <span style={{ fontSize: '0.65rem', background: 'rgba(200,149,42,0.1)', padding: '2px 7px', borderRadius: 999, color: 'hsl(var(--primary))' }}>v{d.version}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <FileText size={16} style={{ color: 'hsl(var(--foreground-muted))', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={d.name}>{d.name}</span>
                  </div>
                  {d.size !== '—' && <p style={{ fontSize: '0.72rem', color: 'hsl(var(--foreground-muted))', marginBottom: 6 }}>{d.size}</p>}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.65rem', background: 'rgba(200,149,42,0.08)', color: 'hsl(var(--primary))', padding: '2px 8px', borderRadius: 999 }}>{d.type}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'hsl(var(--foreground-muted))', lineHeight: 1.6 }}>
                    <div>👤 {client?.name || '—'}</div>
                    {relCase && <div>⚖️ {relCase.caseNo}</div>}
                    <div>📅 {d.uploaded} · {d.uploadedBy}</div>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid rgba(200,149,42,0.1)', padding: '8px 12px', display: 'flex', gap: 8, background: 'rgba(200,149,42,0.02)' }}>
                  <button style={{ flex: 1, background: 'rgba(200,149,42,0.08)', border: '1px solid rgba(200,149,42,0.15)', borderRadius: 6, padding: '6px', cursor: 'pointer', color: 'hsl(var(--primary))', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                    <Download size={12} /> Download
                  </button>
                  {canEdit && (
                    <button onClick={() => handleDelete(d.id)} style={{ background: 'rgba(139,28,28,0.15)', border: 'none', cursor: 'pointer', borderRadius: 6, padding: '6px 10px', color: '#f87171' }}>
                      <Trash2 size={12} />
                    </button>
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
            <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.2rem', marginBottom: 4 }}>Upload Document</h3>
            <span className="gold-rule" />

            {/* Drop zone */}
            <div
              ref={dropRef}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); const file = e.dataTransfer.files[0]; if (file) { set('name', file.name); const ext = file.name.split('.').pop() || 'pdf'; set('fileExt', ext); } }}
              style={{
                border: `2px dashed ${dragging ? 'hsl(var(--primary))' : 'rgba(200,149,42,0.3)'}`,
                borderRadius: 8, padding: '24px', textAlign: 'center', cursor: 'pointer',
                background: dragging ? 'rgba(200,149,42,0.05)' : 'transparent',
                transition: 'all 0.2s', marginBottom: 16,
              }}
            >
              <Upload size={24} style={{ color: 'hsl(var(--primary))', marginBottom: 8, opacity: 0.7 }} />
              <p style={{ fontSize: '0.82rem', color: 'hsl(var(--foreground-muted))' }}>Drag & drop file here</p>
              <p style={{ fontSize: '0.72rem', color: 'hsl(var(--foreground-muted))', opacity: 0.6 }}>PDF · DOCX · XLSX · JPG · PNG</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="lp-label">File Name *</label>
                <input value={form.name || ''} onChange={e => set('name', e.target.value)} className={`lp-input ${errors.name ? 'error' : ''}`} placeholder="document_name.pdf" />
                {errors.name && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 4 }}>{errors.name}</p>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="lp-label">Client *</label>
                  <select value={form.clientId || ''} onChange={e => set('clientId', e.target.value)} className={`lp-input ${errors.clientId ? 'error' : ''}`}>
                    <option value="">Select client…</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  {errors.clientId && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: 4 }}>{errors.clientId}</p>}
                </div>
                <div>
                  <label className="lp-label">Related Case</label>
                  <select value={form.caseId || ''} onChange={e => set('caseId', e.target.value)} className="lp-input" disabled={!form.clientId}>
                    <option value="">Select case…</option>
                    {clientCases.map(c => <option key={c.id} value={c.id}>{c.caseNo}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="lp-label">Document Type</label>
                <select value={form.type || 'Court Pleading'} onChange={e => set('type', e.target.value)} className="lp-input">
                  {DOC_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="lp-label">File Type</label>
                <select value={form.fileExt || 'pdf'} onChange={e => set('fileExt', e.target.value)} className="lp-input">
                  {['pdf', 'docx', 'xlsx', 'jpg', 'png'].map(e => <option key={e}>{e}</option>)}
                </select>
              </div>
            </div>

            <p style={{ fontSize: '0.72rem', color: 'hsl(var(--foreground-muted))', marginTop: 12, padding: '8px 12px', background: 'rgba(200,149,42,0.05)', borderRadius: 6, border: '1px solid rgba(200,149,42,0.12)' }}>
              🔒 Encrypted at rest · Stored securely per Advocates Act Cap 16
            </p>

            <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'flex-end' }}>
              <button className="btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAdd}><Upload size={14} style={{ marginRight: 6 }} /> Add Document</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsModule;
