import React, { useState } from 'react';
import { X } from 'lucide-react';

interface OnboardingWizardProps {
  onDone: () => void;
  userName: string;
}

const STEPS = [
  {
    icon: '⚖️',
    title: 'Welcome to Lexis Pro Kenya',
    desc: 'Your premium legal practice management platform — built for LSK-certified advocates. Everything you need to run your firm, from a single dashboard.',
  },
  {
    icon: '👥',
    title: 'Manage Your Clients',
    desc: 'The Clients module lets you track every client, case type, priority, and status. Add intake notes protected by advocate-client privilege under the Advocates Act Cap 16.',
  },
  {
    icon: '📅',
    title: 'Never Miss a Hearing',
    desc: 'The Court Calendar gives you at-a-glance countdown timers for every scheduled hearing. Red alerts fire automatically for hearings within 3 days.',
  },
  {
    icon: '🚀',
    title: "You're Ready!",
    desc: 'Your demo data is loaded. Explore all 8 modules. Use the Global Search to jump across clients, cases, and tasks instantly.',
  },
];

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onDone, userName }) => {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="modal-overlay" style={{ zIndex: 300 }}>
      <div className="modal-card animate-scale-in" style={{ maxWidth: 520, textAlign: 'center' }}>
        <button onClick={onDone} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--foreground-muted))' }}>
          <X size={18} />
        </button>

        {/* Kenya flag decoration */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 3, height: 32, alignItems: 'stretch', borderRadius: 4, overflow: 'hidden' }}>
            {['#BB0000', '#006600', '#000000'].map(c => (
              <div key={c} style={{ width: 12, background: c, height: '100%' }} />
            ))}
          </div>
        </div>

        <div style={{ fontSize: 52, marginBottom: 16 }}>{current.icon}</div>

        {step === 0 && (
          <p style={{ color: 'hsl(var(--primary))', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
            Karibu, {userName.split(' ')[0]}
          </p>
        )}

        <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.5rem', marginBottom: 12, lineHeight: 1.3 }}>
          {current.title}
        </h2>
        <span className="gold-rule" style={{ margin: '0 auto 16px' }} />
        <p style={{ color: 'hsl(var(--foreground-muted))', lineHeight: 1.7, maxWidth: 400, margin: '0 auto 28px', fontSize: '0.9rem' }}>
          {current.desc}
        </p>

        {/* Step dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              onClick={() => setStep(i)}
              style={{
                width: i === step ? 20 : 8,
                height: 8,
                borderRadius: 999,
                background: i === step ? 'hsl(var(--primary))' : 'rgba(200,149,42,0.25)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          {step > 0 && (
            <button className="btn-ghost" onClick={() => setStep(s => s - 1)}>← Back</button>
          )}
          {!isLast ? (
            <button className="btn-primary" onClick={() => setStep(s => s + 1)}>Continue →</button>
          ) : (
            <button className="btn-primary" onClick={onDone} style={{ background: 'hsl(var(--primary))', fontSize: '1rem', padding: '12px 28px' }}>
              🚀 Enter Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
