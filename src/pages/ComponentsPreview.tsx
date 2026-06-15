import React from 'react';
import { AppProvider } from '@/contexts/AppContext';
import LeadsModule from '@/components/dashboard/modules/LeadsModule';
import AIModule from '@/components/dashboard/modules/AIModule';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section style={{ marginBottom: 60 }}>
    <div style={{ marginBottom: 20, borderBottom: '1px solid rgba(200,149,42,0.2)', paddingBottom: 10 }}>
      <p style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'hsl(var(--primary))', marginBottom: 4 }}>CoFounder Preview</p>
      <h1 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.6rem' }}>{title}</h1>
    </div>
    {children}
  </section>
);

const ComponentsPreview: React.FC = () => {
  return (
    <AppProvider>
      <div style={{ background: 'hsl(var(--background))', minHeight: '100vh', padding: '32px 40px', color: 'hsl(var(--foreground))' }}>
        <Section title="LeadsModule">
          <LeadsModule />
        </Section>
        <Section title="AIModule (includes Draft Review Panel — click Review Draft)">
          <AIModule />
        </Section>
      </div>
    </AppProvider>
  );
};

export default ComponentsPreview;
