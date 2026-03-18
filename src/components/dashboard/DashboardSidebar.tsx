import React from 'react';
import { BarChart2, Users, Briefcase, Calendar, FolderOpen, DollarSign, CheckSquare, MessageSquare, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';

type Module = 'overview' | 'clients' | 'cases' | 'calendar' | 'documents' | 'billing' | 'tasks' | 'messages';

interface SidebarProps {
  active: Module;
  onSelect: (m: Module) => void;
}

const NAV_ITEMS: { id: Module; icon: React.ReactNode; label: string; roles: Array<'admin' | 'attorney' | 'staff'> }[] = [
  { id: 'overview',   icon: <BarChart2 size={16} />,     label: 'Overview',    roles: ['admin', 'attorney', 'staff'] },
  { id: 'clients',    icon: <Users size={16} />,          label: 'Clients',     roles: ['admin', 'attorney', 'staff'] },
  { id: 'cases',      icon: <Briefcase size={16} />,      label: 'Cases',       roles: ['admin', 'attorney'] },
  { id: 'calendar',   icon: <Calendar size={16} />,       label: 'Calendar',    roles: ['admin', 'attorney', 'staff'] },
  { id: 'documents',  icon: <FolderOpen size={16} />,     label: 'Documents',   roles: ['admin', 'attorney'] },
  { id: 'billing',    icon: <DollarSign size={16} />,     label: 'Billing',     roles: ['admin', 'attorney'] },
  { id: 'tasks',      icon: <CheckSquare size={16} />,    label: 'Tasks',       roles: ['admin', 'attorney', 'staff'] },
  { id: 'messages',   icon: <MessageSquare size={16} />,  label: 'Communications', roles: ['admin', 'attorney', 'staff'] },
];

const DashboardSidebar: React.FC<SidebarProps> = ({ active, onSelect }) => {
  const { user } = useAuth();
  const { tasks, hearings } = useApp();

  const today = new Date();
  const overdueTasks = tasks.filter(t => t.status !== 'Done' && new Date(t.deadline) < today).length;
  const upcomingHearings = hearings.filter(h => {
    const d = new Date(h.date);
    const diff = Math.ceil((d.getTime() - today.getTime()) / 86400000);
    return diff >= 0 && diff <= 7;
  }).length;

  const visibleItems = NAV_ITEMS.filter(item => user && item.roles.includes(user.role as any));

  return (
    <nav style={{
      width: 220,
      background: 'hsl(var(--background))',
      borderRight: '1px solid rgba(200,149,42,0.12)',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 12px',
      flexShrink: 0,
      overflowY: 'auto',
    }}>
      <div style={{ marginBottom: 8 }}>
        <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(var(--foreground-muted))', padding: '0 8px', marginBottom: 6 }}>
          Navigation
        </p>
        {visibleItems.map(item => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`sidebar-item ${active === item.id ? 'active' : ''}`}
            style={{ width: '100%', border: 'none', justifyContent: 'flex-start', position: 'relative' }}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.id === 'tasks' && overdueTasks > 0 && (
              <span style={{ marginLeft: 'auto', background: 'rgba(139,28,28,0.35)', color: '#f87171', fontSize: '0.65rem', fontWeight: 700, borderRadius: 999, padding: '1px 7px' }}>
                {overdueTasks}
              </span>
            )}
            {item.id === 'calendar' && upcomingHearings > 0 && (
              <span style={{ marginLeft: 'auto', background: 'rgba(200,149,42,0.2)', color: 'hsl(var(--primary))', fontSize: '0.65rem', fontWeight: 700, borderRadius: 999, padding: '1px 7px' }}>
                {upcomingHearings}
              </span>
            )}
          </button>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* Quick stats */}
      <div style={{ background: 'hsl(var(--card))', border: '1px solid rgba(200,149,42,0.1)', borderRadius: 8, padding: '12px 14px', marginBottom: 8 }}>
        <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'hsl(var(--foreground-muted))', marginBottom: 8 }}>Quick Stats</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { label: 'Active Clients', value: '4', color: '#4ade80' },
            { label: 'Open Cases', value: '3', color: 'hsl(var(--primary))' },
            { label: 'Pending Tasks', value: String(tasks.filter(t => t.status === 'Pending').length), color: '#93c5fd' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'hsl(var(--foreground-muted))' }}>{s.label}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: s.color }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '8px 8px 0', fontSize: '0.65rem', color: 'hsl(var(--foreground-muted))', textAlign: 'center', lineHeight: 1.5 }}>
        Regulated by LSK<br />
        <span style={{ color: 'rgba(200,149,42,0.5)' }}>Advocates Act Cap 16</span>
      </div>
    </nav>
  );
};

export default DashboardSidebar;
