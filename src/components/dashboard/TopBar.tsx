import React from 'react';
import { LogOut, Search, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';

interface TopBarProps {
  onSearchOpen: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onSearchOpen }) => {
  const { user, logout } = useAuth();
  const { tasks, hearings } = useApp();

  const today = new Date();
  const overdueTasks = tasks.filter(t => t.status !== 'Done' && new Date(t.deadline) < today).length;
  const urgentHearings = hearings.filter(h => {
    const d = new Date(h.date);
    const diff = Math.ceil((d.getTime() - today.getTime()) / 86400000);
    return diff >= 0 && diff <= 3;
  }).length;

  return (
    <header style={{
      height: 58,
      background: 'hsl(var(--background-mid))',
      borderBottom: '1px solid rgba(200,149,42,0.15)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 16,
      position: 'sticky',
      top: 0,
      zIndex: 40,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 160 }}>
        <span style={{ fontSize: 22 }}>⚖️</span>
        <div>
          <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '0.95rem', fontWeight: 700, color: 'hsl(var(--primary))', lineHeight: 1 }}>
            LEXIS PRO
          </div>
          <div style={{ fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(var(--foreground-muted))', lineHeight: 1 }}>
            Kenya · Dashboard
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Search */}
      <button
        onClick={onSearchOpen}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, background: 'hsl(var(--background))',
          border: '1px solid rgba(200,149,42,0.15)', borderRadius: 8, padding: '7px 14px',
          cursor: 'pointer', color: 'hsl(var(--foreground-muted))', fontSize: '0.82rem',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(200,149,42,0.4)'; e.currentTarget.style.color = 'hsl(var(--foreground))'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(200,149,42,0.15)'; e.currentTarget.style.color = 'hsl(var(--foreground-muted))'; }}
      >
        <Search size={14} />
        <span>Global Search</span>
        <span style={{ fontSize: '0.7rem', padding: '1px 5px', background: 'rgba(200,149,42,0.12)', borderRadius: 4, color: 'hsl(var(--primary))' }}>⌘K</span>
      </button>

      {/* Alerts */}
      {(overdueTasks > 0 || urgentHearings > 0) && (
        <div style={{ display: 'flex', gap: 6 }}>
          {overdueTasks > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(139,28,28,0.25)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 6, padding: '4px 10px', fontSize: '0.75rem', color: '#f87171' }}>
              <Bell size={12} /> {overdueTasks} overdue task{overdueTasks > 1 ? 's' : ''}
            </div>
          )}
          {urgentHearings > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(200,149,42,0.15)', border: '1px solid rgba(200,149,42,0.25)', borderRadius: 6, padding: '4px 10px', fontSize: '0.75rem', color: 'hsl(var(--primary))' }}>
              ⚖️ {urgentHearings} hearing{urgentHearings > 1 ? 's' : ''} soon
            </div>
          )}
        </div>
      )}

      {/* User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', background: 'hsl(var(--background))', borderRadius: 8, border: '1px solid rgba(200,149,42,0.12)' }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(200,149,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'hsl(var(--primary))' }}>
          {user?.name.charAt(0)}
        </div>
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'hsl(var(--foreground))', lineHeight: 1 }}>{user?.name}</div>
          {user?.lskNumber && <div style={{ fontSize: '0.65rem', color: 'hsl(var(--foreground-muted))', lineHeight: 1.2 }}>{user.lskNumber}</div>}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        title="Logout"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--foreground-muted))', display: 'flex', alignItems: 'center', padding: 6, borderRadius: 6, transition: 'color 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
        onMouseLeave={e => e.currentTarget.style.color = 'hsl(var(--foreground-muted))'}
      >
        <LogOut size={18} />
      </button>
    </header>
  );
};

export default TopBar;
