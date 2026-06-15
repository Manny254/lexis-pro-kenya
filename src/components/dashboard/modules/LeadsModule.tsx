import React, { useState, useMemo } from 'react';
import { Plus, Eye, ArrowRight, Users, Search } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import type { LeadStatus } from '@/types';

const STATUS_STYLES: Record<LeadStatus, React.CSSProperties> = {
  NEW:       { background: 'rgba(59,130,246,0.15)', color: '#93c5fd' },
  CONTACTED: { background: 'rgba(245,158,11,0.15)', color: '#fcd34d' },
  QUALIFIED: { background: 'rgba(16,185,129,0.15)', color: '#6ee7b7' },
  CONVERTED: { background: 'hsl(var(--primary))',    color: 'hsl(var(--primary-foreground))' },
  DEAD:      { background: 'rgba(107,114,128,0.15)', color: '#9ca3af' },
};

const STATUS_OPTIONS: Array<LeadStatus | 'ALL'> = ['ALL', 'NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'DEAD'];

const Badge: React.FC<{ status: LeadStatus }> = ({ status }) => (
  <span style={{
    ...STATUS_STYLES[status],
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    padding: '4px 10px',
    borderRadius: 999,
    display: 'inline-block',
  }}>{status}</span>
);

const LeadsModule: React.FC = () => {
  const { leads } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'ALL'>('ALL');

  const filtered = useMemo(() => leads.filter(l => {
    if (statusFilter !== 'ALL' && l.status !== statusFilter) return false;
    if (search && !`${l.fullName} ${l.phone} ${l.practiceArea} ${l.county}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [leads, search, statusFilter]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.8rem', marginBottom: 4 }}>Leads</h2>
          <span className="gold-rule" />
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} /> Add Lead
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--foreground-muted))' }} />
          <input className="lp-input" placeholder="Search leads…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 34 }} />
        </div>
        <select className="lp-input" value={statusFilter} onChange={e => setStatusFilter(e.target.value as LeadStatus | 'ALL')} style={{ maxWidth: 200 }}>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s}</option>)}
        </select>
      </div>

      <div className="lp-card" style={{ padding: 0, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center' }}>
            <Users size={40} style={{ color: 'hsl(var(--foreground-muted))', marginBottom: 12 }} />
            <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.05rem', marginBottom: 6 }}>No leads yet</p>
            <p style={{ color: 'hsl(var(--foreground-muted))', fontSize: '0.85rem' }}>Leads from your booking form will appear here</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'rgba(200,149,42,0.06)', borderBottom: '1px solid rgba(200,149,42,0.12)' }}>
                  {['Name', 'Phone', 'Practice Area', 'County', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'hsl(var(--foreground-muted))', fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(lead => (
                  <tr key={lead.id} style={{ borderBottom: '1px solid rgba(200,149,42,0.06)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{lead.fullName}</td>
                    <td style={{ padding: '14px 16px', color: 'hsl(var(--foreground-muted))' }}>{lead.phone}</td>
                    <td style={{ padding: '14px 16px' }}>{lead.practiceArea}</td>
                    <td style={{ padding: '14px 16px', color: 'hsl(var(--foreground-muted))' }}>{lead.county}</td>
                    <td style={{ padding: '14px 16px' }}><Badge status={lead.status} /></td>
                    <td style={{ padding: '14px 16px', color: 'hsl(var(--foreground-muted))', whiteSpace: 'nowrap' }}>{lead.date}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <button className="btn-ghost" title="View" style={{ padding: 6 }}>
                          <Eye size={14} />
                        </button>
                        <button className="btn-primary" style={{ fontSize: '0.72rem', padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          Convert <ArrowRight size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsModule;
