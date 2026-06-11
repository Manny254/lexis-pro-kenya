import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import LoginModal from '@/components/auth/LoginModal';
import OnboardingWizard from '@/components/dashboard/OnboardingWizard';
import TopBar from '@/components/dashboard/TopBar';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import GlobalSearch from '@/components/dashboard/GlobalSearch';
import OverviewModule from '@/components/dashboard/modules/OverviewModule';
import ClientsModule from '@/components/dashboard/modules/ClientsModule';
import CasesModule from '@/components/dashboard/modules/CasesModule';
import CalendarModule from '@/components/dashboard/modules/CalendarModule';
import DocumentsModule from '@/components/dashboard/modules/DocumentsModule';
import TasksModule from '@/components/dashboard/modules/TasksModule';
import CommunicationsModule from '@/components/dashboard/modules/CommunicationsModule';
import ToastSystem from '@/components/ToastSystem';

type Module = 'overview' | 'clients' | 'cases' | 'calendar' | 'documents' | 'tasks' | 'messages';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState<Module>('overview');
  const [showSearch, setShowSearch] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => !sessionStorage.getItem('lp_onboarding_done'));

  const handleOnboardingDone = () => {
    sessionStorage.setItem('lp_onboarding_done', '1');
    setShowOnboarding(false);
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'overview': return <OverviewModule />;
      case 'clients': return <ClientsModule />;
      case 'cases': return <CasesModule />;
      case 'calendar': return <CalendarModule />;
      case 'documents': return <DocumentsModule />;
      case 'tasks': return <TasksModule />;
      case 'messages': return <CommunicationsModule />;
      default: return <OverviewModule />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'hsl(var(--background))' }}>
      <TopBar onSearchOpen={() => setShowSearch(true)} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <DashboardSidebar active={activeModule} onSelect={setActiveModule} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {renderModule()}
        </main>
      </div>
      <ToastSystem />
      {showSearch && <GlobalSearch onClose={() => setShowSearch(false)} />}
      {showOnboarding && user && <OnboardingWizard onDone={handleOnboardingDone} userName={user.name} />}
    </div>
  );
};

// Public website sections
const PublicSite: React.FC<{ onLoginClick: () => void }> = ({ onLoginClick }) => {
  const [scrolled, setScrolled] = React.useState(false);
  const [formData, setFormData] = React.useState<Record<string,string>>({});
  const [formErrors, setFormErrors] = React.useState<Record<string,string>>({});
  const [formSuccess, setFormSuccess] = React.useState(false);

  React.useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const SERVICES = [
    { icon: '🏛', title: 'Land & Conveyancing', desc: 'ELC matters, title disputes, adverse possession, conveyancing transactions.' },
    { icon: '⚖️', title: 'Criminal Defense', desc: 'Bail applications, High Court trials, appeals, and constitutional rights.' },
    { icon: '🤝', title: 'Commercial Law', desc: 'Contract disputes, debt recovery, Milimani Courts commercial litigation.' },
    { icon: '👨‍👩‍👧', title: 'Family & Succession', desc: 'Divorce, custody, matrimonial property, probate and administration.' },
    { icon: '🏢', title: 'Employment Law', desc: 'ELRC matters, wrongful dismissal, CBA disputes, county government cases.' },
    { icon: '📋', title: 'Constitutional Petitions', desc: 'Judicial review, fundamental rights enforcement, public law matters.' },
  ];

  const setField = (k: string, v: string) => { setFormData(f => ({ ...f, [k]: v })); if (formErrors[k]) setFormErrors(e => { const n = { ...e }; delete n[k]; return n; }); };

  const handleConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string,string> = {};
    if (!formData.name?.trim()) errs.name = 'Full name is required';
    if (!formData.email?.trim()) errs.email = 'Email is required';
    if (!formData.phone?.trim()) errs.phone = 'Phone is required';
    if (!formData.description?.trim()) errs.description = 'Please describe your matter';
    setFormErrors(errs);
    if (Object.keys(errs).length === 0) setFormSuccess(true);
  };

  const COUNTIES = ['Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Thika','Malindi','Kitale','Garissa','Nyeri','Kisii','Kakamega'];

  return (
    <div style={{ background: 'hsl(var(--background))', minHeight: '100vh', position: 'relative' }}>
      {/* Kenya flag stripe on right edge */}
      <div style={{ position: 'fixed', right: 0, top: 0, height: '100vh', width: 4, display: 'flex', flexDirection: 'column', zIndex: 50 }}>
        <div style={{ flex: 1, background: '#BB0000' }} />
        <div style={{ flex: 1, background: '#006600' }} />
        <div style={{ flex: 1, background: '#000' }} />
      </div>

      {/* Sticky Navbar */}
      <nav className={scrolled ? 'nav-scrolled' : ''} style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40, padding: '0 40px', height: 68, display: 'flex', alignItems: 'center', gap: 24, background: 'transparent', transition: 'all 0.3s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          <span style={{ fontSize: 28 }}>⚖️</span>
          <div>
            <div style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 700, fontSize: '1.1rem', color: 'hsl(var(--primary))', lineHeight: 1 }}>LEXIS PRO</div>
            <div style={{ fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'hsl(var(--foreground-muted))' }}>Kenya · LSK Certified</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 28 }}>
          {['Services','Advocates','Contact'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(var(--foreground-muted))', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'hsl(var(--foreground))'}
              onMouseLeave={e => e.currentTarget.style.color = 'hsl(var(--foreground-muted))'}
            >{l}</a>
          ))}
        </div>
        <button onClick={onLoginClick} className="btn-ghost" style={{ fontSize: '0.78rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>🔒 Staff Portal</button>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: 68 }}>
        <div style={{ position: 'absolute', right: '5%', top: '20%', width: 500, height: 500, background: 'radial-gradient(ellipse, rgba(28,47,94,0.6) 0%, transparent 70%)', pointerEvents: 'none' }} />
        {/* Concentric circles */}
        {[340, 260, 180, 100].map((s, i) => (
          <div key={i} style={{ position: 'absolute', right: '8%', top: '50%', transform: 'translateY(-50%)', width: s, height: s, borderRadius: '50%', border: `1px solid rgba(200,149,42,${0.04 + i * 0.03})`, pointerEvents: 'none' }} />
        ))}

        <div style={{ maxWidth: 780, padding: '0 60px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', gap: 3, marginBottom: 24, height: 20 }}>
            {['#BB0000', '#006600', '#000'].map(c => <div key={c} style={{ width: 8, background: c, height: '100%', borderRadius: 2 }} />)}
          </div>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'hsl(var(--primary))', marginBottom: 16 }}>Law Society of Kenya · Certified Practice</p>
          <h1 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: 8 }}>
            <span style={{ color: 'hsl(var(--primary))' }}>Haki. Uadilifu. Ushindi.</span>
          </h1>
          <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 'clamp(1rem, 2vw, 1.4rem)', fontWeight: 400, color: 'hsl(var(--foreground-muted))', marginBottom: 20, lineHeight: 1.5 }}>
            Justice. Integrity. Victory.
          </h2>
          <p style={{ fontSize: '1rem', color: 'hsl(var(--foreground-muted))', lineHeight: 1.7, maxWidth: 540, marginBottom: 36 }}>
            Kenya's premier legal practice management platform — built for advocates, certified by the Law Society of Kenya.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a href="#contact"><button className="btn-primary" style={{ fontSize: '1rem', padding: '14px 28px' }}>Book Consultation</button></a>
            <a href="#services"><button className="btn-ghost" style={{ fontSize: '1rem', padding: '14px 24px' }}>Our Practice Areas →</button></a>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 32, marginTop: 48, flexWrap: 'wrap' }}>
            {[['25+','Years in Practice'],['1,200+','Cases Handled'],['LSK','Certified'],['3 Regions','Nairobi · Coast · Nyanza']].map(([v,l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.5rem', color: 'hsl(var(--primary))', fontWeight: 700 }}>{v}</div>
                <div style={{ fontSize: '0.72rem', color: 'hsl(var(--foreground-muted))', letterSpacing: '0.04em' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: '80px 60px', background: 'hsl(var(--background-mid))' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'hsl(var(--primary))', marginBottom: 8 }}>Practice Areas</p>
          <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '2.2rem', marginBottom: 4 }}>Our Legal Services</h2>
          <span className="gold-rule" style={{ marginBottom: 40 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
            {SERVICES.map(s => (
              <div key={s.title} className="lp-card" style={{ padding: '24px 22px' }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{s.icon}</div>
                <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.05rem', marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'hsl(var(--foreground-muted))', lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADVOCATES */}
      <section id="advocates" style={{ padding: '80px 60px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 48, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '100%', aspectRatio: '3/4', maxWidth: 300, background: 'hsl(var(--card))', border: '1px solid var(--gold-border-dim)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>👩‍⚖️</div>
            <div style={{ position: 'absolute', bottom: 16, left: -12, background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', borderRadius: 8, padding: '8px 14px', fontSize: '0.72rem', fontWeight: 700 }}>LSK/ADV/2019/4821</div>
          </div>
          <div>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'hsl(var(--primary))', marginBottom: 8 }}>Lead Advocate</p>
            <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '2rem', marginBottom: 4 }}>Amina Waweru</h2>
            <span className="gold-rule" />
            <p style={{ color: 'hsl(var(--foreground-muted))', lineHeight: 1.7, marginBottom: 20, fontSize: '0.95rem' }}>
              A seasoned advocate with over 25 years of practice across the Superior Courts of Kenya. Amina specializes in land disputes, constitutional matters, and commercial litigation at the Milimani Commercial Courts.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['LLB – UoN','LSK Member','25+ Years','Supreme Court','Court of Appeal'].map(t => (
                <span key={t} style={{ background: 'rgba(200,149,42,0.1)', border: '1px solid rgba(200,149,42,0.2)', color: 'hsl(var(--primary))', borderRadius: 999, padding: '4px 12px', fontSize: '0.75rem', fontWeight: 500 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: '80px 60px', background: 'hsl(var(--background-mid))' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'hsl(var(--primary))', marginBottom: 8 }}>Get in Touch</p>
          <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '2.2rem', marginBottom: 4 }}>Book a Consultation</h2>
          <span className="gold-rule" style={{ marginBottom: 40 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 48 }}>
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  { icon: '📞', label: 'Phone', val: '(+254) 722 100 200' },
                  { icon: '✉️', label: 'Email', val: 'counsel@lexiskenya.co.ke' },
                  { icon: '📍', label: 'Address', val: 'Anniversary Towers, University Way, Nairobi' },
                ].map(c => (
                  <div key={c.label} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 38, height: 38, background: 'rgba(200,149,42,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{c.icon}</div>
                    <div>
                      <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'hsl(var(--foreground-muted))', marginBottom: 2 }}>{c.label}</p>
                      <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{c.val}</p>
                    </div>
                  </div>
                ))}
                <a href="https://wa.me/254722100200" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#25D366', color: '#fff', borderRadius: 8, padding: '12px 20px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s', marginTop: 8 }}>
                  💬 Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Intake form */}
            {formSuccess ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,92,46,0.15)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 12, padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.2rem', marginBottom: 12, color: '#4ade80' }}>Consultation Request Received</h3>
                <p style={{ color: 'hsl(var(--foreground-muted))', lineHeight: 1.6, fontSize: '0.875rem' }}>
                  Our office will contact you within 24 hours. All information shared is protected by advocate-client privilege under the <strong>Advocates Act Cap 16</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConsultation} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[{k:'name',l:'Full Name',p:'Kariuki Mwangi'},{k:'email',l:'Email',p:'you@example.com'}].map(f => (
                    <div key={f.k}>
                      <label className="lp-label">{f.l} *</label>
                      <input value={formData[f.k]||''} onChange={e=>setField(f.k,e.target.value)} className={`lp-input ${formErrors[f.k]?'error':''}`} placeholder={f.p} />
                      {formErrors[f.k] && <p style={{color:'#f87171',fontSize:'0.75rem',marginTop:4}}>{formErrors[f.k]}</p>}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="lp-label">Phone (+254) *</label>
                    <input value={formData.phone||''} onChange={e=>setField('phone',e.target.value)} className={`lp-input ${formErrors.phone?'error':''}`} placeholder="+254 722 000 000" />
                    {formErrors.phone && <p style={{color:'#f87171',fontSize:'0.75rem',marginTop:4}}>{formErrors.phone}</p>}
                  </div>
                  <div>
                    <label className="lp-label">County</label>
                    <select value={formData.county||''} onChange={e=>setField('county',e.target.value)} className="lp-input">
                      <option value="">Select…</option>
                      {COUNTIES.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="lp-label">Practice Area</label>
                  <select value={formData.area||''} onChange={e=>setField('area',e.target.value)} className="lp-input">
                    <option value="">Select…</option>
                    {['Land Dispute','Conveyancing','Criminal Defense','Family Law','Commercial Dispute','Constitutional Petition','Employment / Labour','Succession / Probate','Judicial Review','Debt Recovery','Intellectual Property','Immigration','Personal Injury','Tax Dispute'].map(a=><option key={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="lp-label">Brief Description *</label>
                  <textarea value={formData.description||''} onChange={e=>setField('description',e.target.value)} className={`lp-input ${formErrors.description?'error':''}`} placeholder="Describe your legal matter briefly…" rows={3} />
                  {formErrors.description && <p style={{color:'#f87171',fontSize:'0.75rem',marginTop:4}}>{formErrors.description}</p>}
                </div>
                <button type="submit" className="btn-primary" style={{ padding: '13px', fontSize: '0.95rem' }}>Submit Consultation Request</button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div style={{ height: 3, display: 'flex' }}>
          {['#BB0000','#006600','#000'].map(c=><div key={c} style={{flex:1,background:c}}/>)}
        </div>
        <div style={{ background: 'hsl(var(--background))', padding: '28px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>⚖️</span>
            <span style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 700, color: 'hsl(var(--primary))' }}>LEXIS PRO</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'hsl(var(--foreground-muted))' }}>Regulated by the Law Society of Kenya · Advocates Act Cap 16</p>
          <p style={{ fontSize: '0.75rem', color: 'hsl(var(--foreground-muted))' }}>© {new Date().getFullYear()} Lexis Pro Kenya. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a href="https://wa.me/254722100200" target="_blank" rel="noreferrer" className="wa-float" title="Chat on WhatsApp">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
    </div>
  );
};

const IndexPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const { login } = useAuth();

  if (isAuthenticated) return <Dashboard />;

  return (
    <>
      <PublicSite onLoginClick={() => setShowLogin(true)} />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSuccess={() => setShowLogin(false)} />}
    </>
  );
};

export default IndexPage;
