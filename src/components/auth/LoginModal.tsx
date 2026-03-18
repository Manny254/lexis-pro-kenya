import React, { useState } from 'react';
import { X, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const ok = login(email.trim(), password);
      if (ok) { onSuccess(); }
      else { setError('Invalid credentials. Please try the demo accounts below.'); }
      setLoading(false);
    }, 600);
  };

  const fillDemo = (e: string, p: string) => { setEmail(e); setPassword(p); setError(''); };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card animate-scale-in" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--foreground-muted))' }}>
          <X size={20} />
        </button>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>⚖️</div>
          <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.4rem', color: 'hsl(var(--foreground))', margin: 0 }}>
            Staff Portal
          </h2>
          <p style={{ color: 'hsl(var(--foreground-muted))', fontSize: '0.8rem', marginTop: 4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Lexis Pro Kenya · Secure Access
          </p>
          <span className="gold-rule" style={{ margin: '12px auto 0' }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label className="lp-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={`lp-input ${error ? 'error' : ''}`}
              placeholder="counsel@lexiskenya.co.ke"
              required
              autoFocus
            />
          </div>
          <div style={{ marginBottom: 20, position: 'relative' }}>
            <label className="lp-label">Password</label>
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`lp-input ${error ? 'error' : ''}`}
              placeholder="••••••••"
              required
              style={{ paddingRight: 44 }}
            />
            <button
              type="button"
              onClick={() => setShowPass(v => !v)}
              style={{ position: 'absolute', right: 12, top: 30, background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--foreground-muted))' }}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <p style={{ color: '#f87171', fontSize: '0.82rem', marginBottom: 12, background: 'rgba(139,28,28,0.2)', padding: '8px 12px', borderRadius: 6, border: '1px solid rgba(248,113,113,0.2)' }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} disabled={loading}>
            {loading ? <span>Authenticating…</span> : <><Shield size={15} /> Secure Sign In</>}
          </button>
        </form>

        {/* Demo credentials */}
        <div style={{ marginTop: 24, background: 'rgba(200,149,42,0.06)', border: '1px solid rgba(200,149,42,0.15)', borderRadius: 8, padding: '14px 16px' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'hsl(var(--primary))', marginBottom: 10 }}>
            Demo Accounts
          </p>
          {[
            { label: '👑 Admin', e: 'admin@lexiskenya.co.ke', p: 'admin123', desc: 'Full access' },
            { label: '⚖️ Attorney', e: 'advocate@lexiskenya.co.ke', p: 'adv123', desc: 'Attorney access' },
            { label: '📋 Staff', e: 'staff@lexiskenya.co.ke', p: 'staff123', desc: 'Limited access' },
          ].map(d => (
            <button
              key={d.e}
              onClick={() => fillDemo(d.e, d.p)}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%',
                background: 'none', border: 'none', cursor: 'pointer', padding: '5px 0',
                borderBottom: '1px solid rgba(200,149,42,0.08)',
                color: 'hsl(var(--foreground-muted))', fontSize: '0.78rem', textAlign: 'left',
              }}
            >
              <span style={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}>{d.label}</span>
              <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'hsl(var(--primary))' }}>{d.e}</span>
              <span style={{ color: 'hsl(var(--foreground-muted))' }}>{d.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
