'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Panel de Control', icon: '📊' },
  { href: '/admin/properties', label: 'Propiedades', icon: '🏠' },
  { href: '/admin/quotations', label: 'Propuestas', icon: '📄' },
  { href: '/admin/reviews', label: 'Reseñas', icon: '⭐' },
  { href: '/admin/profile', label: 'Perfil', icon: '👤' },
];

const AdminLayout = ({ children }) => {
  const { data: session } = useSession();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => { setDrawerOpen(false); }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  useEffect(() => {
    const setVH = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    setVH();
    window.addEventListener('resize', setVH);
    return () => window.removeEventListener('resize', setVH);
  }, []);

  return (
    <div className="min-h-screen flex bg-[#F6F6F6]">
      {/* Mobile top bar — Senada style */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-black z-[60] h-[60px] flex items-center px-4 shadow-lg">
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className={`rButton w-8 h-8 flex items-center justify-center mr-1 ${drawerOpen ? 'active' : ''}`}
          aria-label={drawerOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        <span className="text-white text-sm font-bold uppercase tracking-wider mr-auto">ADMIN</span>
        <Link href="/admin/profile" className="min-w-[44px] min-h-[44px] flex items-center justify-center text-white/60 hover:text-white" title="Perfil">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </Link>
        <button onClick={() => signOut({ callbackUrl: '/' })} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-white/60 hover:text-white" title="Cerrar Sesión">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      </div>

      {/* Mobile fullscreen overlay — Senada style */}
      <div
        className="md:hidden fixed inset-x-0 z-[61] bg-black flex flex-col overflow-x-hidden"
        style={{
          top: 'calc(env(safe-area-inset-top, 8px) + 60px)',
          height: 'calc(var(--vh, 1vh) * 100 - env(safe-area-inset-top, 8px) - 60px)',
          padding: '40px 12px 20px',
          overflowY: 'auto',
          transformOrigin: 'top',
          transform: drawerOpen ? 'scaleY(1)' : 'scaleY(0)',
          opacity: drawerOpen ? 1 : 0,
          transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease',
          pointerEvents: drawerOpen ? 'auto' : 'none',
        }}
      >
        <nav className="flex-1 flex flex-col px-0">
          {NAV_ITEMS.map((item, idx) => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 text-white text-[22px] font-normal uppercase py-[15px] border-b border-white/[.08] hover:text-[var(--color-brand)] transition-colors ${drawerOpen ? 'mobile-item' : ''}`} style={{ fontFamily: 'var(--font-heading)', animationDelay: `${0.2 + idx * 0.15}s` }} onClick={() => setDrawerOpen(false)}>
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <div className={`mt-4 pt-4 border-t border-white/10 ${drawerOpen ? 'mobile-item' : ''}`} style={{ animationDelay: `${0.2 + NAV_ITEMS.length * 0.15}s` }}>
            <p className="text-white/60 text-sm">{session?.user?.name || 'Admin'}</p>
            <p className="text-white/40 text-xs mb-2">{session?.user?.email || ''}</p>
            <button onClick={() => { signOut({ callbackUrl: '/' }); setDrawerOpen(false); }} className="text-white/40 hover:text-white text-sm uppercase tracking-wider">Cerrar Sesión</button>
          </div>
        </nav>
      </div>

      {/* Content */}
      <main className="flex-1 pt-[60px] md:pt-0 min-h-screen">
        {children}
      </main>

      {/* CSS for hamburger animation — Senada style */}
      <style jsx>{`
        .rButton .hamburger span {
          display: block;
          width: 25px;
          height: 3px;
          background: #fff;
          border-radius: 3px;
          margin: 5px 0;
          position: relative;
          transition: all 0.3s ease;
        }
        .rButton.active .hamburger span:nth-child(1) {
          top: 8px;
          transform: rotate(135deg);
        }
        .rButton.active .hamburger span:nth-child(2) {
          opacity: 0;
          transform: translateX(-30px);
        }
        .rButton.active .hamburger span:nth-child(3) {
          width: 25px;
          margin: unset;
          top: -8px;
          transform: rotate(-135deg);
        }
        .mobile-item {
          opacity: 0;
          transform: translateY(10px);
          animation: mobileFadeIn 0.5s ease-out forwards;
        }
        @keyframes mobileFadeIn {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
