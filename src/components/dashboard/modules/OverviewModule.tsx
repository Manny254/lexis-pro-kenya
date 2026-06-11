import React from 'react';
import { useApp } from '@/contexts/AppContext';

const getDaysUntil = (date: string) => {
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - today.getTime()) / 86400000);
};

const OverviewModule: React.FC = () => {
  const { clients, tasks, hearings, cases } = useApp();

  const today = new Date();
  const activeClients = clients.filter(c => c.status === 'Active').length;
  const openCases = cases.filter(c => c.stage !== 'Closed').length;
  const pendingTasks = tasks.filter(t => t.status !== 'Done').length;
  const overdueTasks = tasks.filter(t => t.status !== 'Done' && new Date(t.deadline) < today).length;

  const upcomingHearings = hearings
    .filter(h => getDaysUntil(h.date) >= 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  const casesByType: Record<string, number> = {};
  clients.forEach(c => { casesByType[c.caseType] = (casesByType[c.caseType] || 0) + 1; });
  const caseTypeData = Object.entries(casesByType).sort((a, b) => b[1] - a[1]);
  const maxCount = Math.max(...caseTypeData.map(e => e[1]), 1);

  const kpiCards = [
    { label: 'Active Clients', value: String(activeClients), icon: '👥', color: '#93c5fd', sub: 'Currently active' },
    { label: 'Open Cases', value: String(openCases), icon: '📂', color: 'hsl(var(--primary))', sub: 'In progress' },
    { label: 'Pending Tasks', value: String(pendingTasks), icon: '📋', color: '#4ade80', sub: 'To complete' },
    { label: 'Overdue Tasks', value: String(overdueTasks), icon: '⚠️', color: overdueTasks > 0 ? '#f87171' : '#4ade80', sub: overdueTasks > 0 ? 'Requires attention' : 'All on track' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <h2>Overview</h2>
        <span className="gold-rule" />
        <p style={{ color: 'hsl(var(--foreground-muted))', fontSize: '0.875rem' }}>
          Practice summary — {new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
        {kpiCards.map(k => (
          <div key={k.label} className="lp-card" style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>{k.icon}</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'hsl(var(--foreground-muted))', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k.sub}</span>
            </div>
            <div className="kes-amount" style={{ fontSize: '1.6rem', marginBottom: 4, color: k.color }}>
              {k.value}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'hsl(var(--foreground-muted))', fontWeight: 500 }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        {/* Upcoming hearings */}
        <div className="lp-card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1rem', marginBottom: 4 }}>Upcoming Hearings</h3>
          <span className="gold-rule" />
          {upcomingHearings.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px 0' }}>
              <div className="empty-state-icon">📅</div>
              <p>No upcoming hearings</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {upcomingHearings.map(h => {
                const days = getDaysUntil(h.date);
                const client = clients.find(c => c.id === h.clientId);
                const urgency = days <= 2 ? '#f87171' : days <= 7 ? 'hsl(var(--primary))' : 'hsl(var(--foreground-muted))';
                return (
                  <div key={h.id} style={{ display: 'flex', gap: 12, padding: '10px 12px', background: 'hsl(var(--background))', borderRadius: 8, borderLeft: `3px solid ${urgency}` }}>
                    <div style={{ textAlign: 'center', minWidth: 44, background: `${urgency}20`, borderRadius: 6, padding: '6px 4px' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: urgency, fontFamily: "'Libre Baskerville', serif", lineHeight: 1 }}>{days}</div>
                      <div style={{ fontSize: '0.6rem', color: urgency, textTransform: 'uppercase' }}>day{days !== 1 ? 's' : ''}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'hsl(var(--foreground))', marginBottom: 2 }}>{h.title}</div>
                      <div style={{ fontSize: '0.72rem', color: 'hsl(var(--foreground-muted))' }}>{h.court}</div>
                      <div style={{ fontSize: '0.72rem', color: 'hsl(var(--foreground-muted))' }}>{h.date} · {h.time} · {client?.name}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cases by practice area */}
        <div className="lp-card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1rem', marginBottom: 4 }}>Cases by Practice Area</h3>
          <span className="gold-rule" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {caseTypeData.map(([type, count]) => (
              <div key={type}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.78rem' }}>
                  <span style={{ color: 'hsl(var(--foreground-muted))' }}>{type}</span>
                  <span style={{ color: 'hsl(var(--primary))', fontWeight: 600 }}>{count}</span>
                </div>
                <div style={{ height: 6, background: 'rgba(200,149,42,0.1)', borderRadius: 999 }}>
                  <div style={{ height: '100%', width: `${(count / maxCount) * 100}%`, background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary-shimmer)))', borderRadius: 999, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent clients */}
      <div className="lp-card" style={{ padding: 20 }}>
        <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1rem', marginBottom: 4 }}>Recent Clients</h3>
        <span className="gold-rule" />
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr>
                {['Name', 'Case Type', 'Status', 'Priority', 'Location', 'Date Added'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'hsl(var(--foreground-muted))', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(200,149,42,0.12)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.slice(0, 5).map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid rgba(200,149,42,0.06)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,149,42,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <td style={{ padding: '10px 12px', fontWeight: 500 }}>{c.name}</td>
                  <td style={{ padding: '10px 12px', color: 'hsl(var(--foreground-muted))' }}>{c.caseType}</td>
                  <td style={{ padding: '10px 12px' }}><span className={`badge badge-${c.status.toLowerCase()}`}>{c.status}</span></td>
                  <td style={{ padding: '10px 12px' }}><span className={`badge badge-${c.priority.toLowerCase()}`}>{c.priority}</span></td>
                  <td style={{ padding: '10px 12px', color: 'hsl(var(--foreground-muted))' }}>{c.location}</td>
                  <td style={{ padding: '10px 12px', color: 'hsl(var(--foreground-muted))' }}>{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OverviewModule;
