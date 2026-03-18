import React, { useState } from 'react';
import { X, Search, User, Briefcase, CheckSquare } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface GlobalSearchProps {
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ onClose }) => {
  const { clients, cases, tasks } = useApp();
  const [q, setQ] = useState('');

  const query = q.trim().toLowerCase();
  const hasQ = query.length >= 2;

  const filteredClients = hasQ
    ? clients.filter(c => c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query) || c.lskRef.toLowerCase().includes(query))
    : [];
  const filteredCases = hasQ
    ? cases.filter(c => c.title.toLowerCase().includes(query) || c.caseNo.toLowerCase().includes(query))
    : [];
  const filteredTasks = hasQ
    ? tasks.filter(t => t.title.toLowerCase().includes(query))
    : [];

  const total = filteredClients.length + filteredCases.length + filteredTasks.length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card animate-scale-in" onClick={e => e.stopPropagation()} style={{ maxWidth: 560, padding: 0, overflow: 'hidden' }}>
        {/* Search input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid rgba(200,149,42,0.15)' }}>
          <Search size={18} style={{ color: 'hsl(var(--foreground-muted))', flexShrink: 0 }} />
          <input
            autoFocus
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search clients, cases, tasks…"
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: 'Outfit, sans-serif', fontSize: '1rem', color: 'hsl(var(--foreground))' }}
          />
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--foreground-muted))' }}>
            <X size={18} />
          </button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 420, overflowY: 'auto', padding: '8px 0' }}>
          {!hasQ && (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: 'hsl(var(--foreground-muted))', fontSize: '0.875rem' }}>
              Type at least 2 characters to search
            </div>
          )}

          {hasQ && total === 0 && (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: 'hsl(var(--foreground-muted))', fontSize: '0.875rem' }}>
              No results found for "{q}"
            </div>
          )}

          {filteredClients.length > 0 && (
            <div>
              <div style={{ padding: '6px 20px 4px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'hsl(var(--foreground-muted))' }}>
                Clients
              </div>
              {filteredClients.map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(200,149,42,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(200,149,42,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={14} style={{ color: 'hsl(var(--primary))' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'hsl(var(--foreground))' }}>{c.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'hsl(var(--foreground-muted))' }}>{c.caseType} · {c.lskRef}</div>
                  </div>
                  <span className={`badge badge-${c.status.toLowerCase()}`} style={{ marginLeft: 'auto' }}>{c.status}</span>
                </div>
              ))}
            </div>
          )}

          {filteredCases.length > 0 && (
            <div>
              <div style={{ padding: '6px 20px 4px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'hsl(var(--foreground-muted))' }}>
                Cases
              </div>
              {filteredCases.map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(200,149,42,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Briefcase size={14} style={{ color: '#93c5fd' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'hsl(var(--foreground))' }}>{c.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'hsl(var(--foreground-muted))' }}>{c.caseNo} · {c.court}</div>
                  </div>
                  <span className={`badge badge-${c.stage.toLowerCase().replace(' ', '-')}`} style={{ marginLeft: 'auto', fontSize: '0.65rem' }}>{c.stage}</span>
                </div>
              ))}
            </div>
          )}

          {filteredTasks.length > 0 && (
            <div>
              <div style={{ padding: '6px 20px 4px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'hsl(var(--foreground-muted))' }}>
                Tasks
              </div>
              {filteredTasks.map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(200,149,42,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckSquare size={14} style={{ color: '#86efac' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'hsl(var(--foreground)), textDecoration: t.status === "Done" ? "line-through" : "none"' }}>{t.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'hsl(var(--foreground-muted))' }}>Due: {t.deadline} · {t.assignedTo}</div>
                  </div>
                  <span className={`badge badge-${t.priority.toLowerCase()}`} style={{ marginLeft: 'auto' }}>{t.priority}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {hasQ && total > 0 && (
          <div style={{ padding: '8px 20px', borderTop: '1px solid rgba(200,149,42,0.1)', fontSize: '0.75rem', color: 'hsl(var(--foreground-muted))' }}>
            {total} result{total !== 1 ? 's' : ''} found
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearch;
