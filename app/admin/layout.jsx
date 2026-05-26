'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

const NAV_ITEMS = [
  { href: '/admin/profile', label: 'Perfil' },
  { href: '/admin', label: 'Panel' },
  { href: '/admin/properties', label: 'Propiedades' },
  { href: '/admin/quotations', label: 'Propuestas' },
  { href: '/admin/reviews', label: 'Reseñas' },
];

const AdminLayout = ({ children }) => {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-black z-[60] h-[60px] flex items-center px-4 shadow-lg">
        <Link href="/" className="min-w-[44px] min-h-[44px] flex items-center justify-center text-white/60 hover:text-white" title="Volver al sitio">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </Link>
        <div className="ml-auto flex items-center gap-1" ref={menuRef}>
          {/* PANEL DE CONTROL dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-1 px-3 py-2 text-white/80 hover:text-white text-[11px] font-bold uppercase tracking-wider transition-colors"
            >
              PANEL DE CONTROL
              <svg className={`w-3 h-3 transition-transform ${menuOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            <div style={{
              maxHeight: menuOpen ? '400px' : '0',
              opacity: menuOpen ? 1 : 0,
              overflow: 'hidden',
              transition: 'max-height 300ms ease, opacity 200ms ease',
              position: 'absolute', top: '100%', right: '0', zIndex: 50,
            }}>
              <ul className="bg-black rounded-[6px] min-w-[180px] text-center shadow-lg mt-2">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href} className="border-b border-[#252525] last:border-b-0">
                    <Link href={item.href} onClick={() => setMenuOpen(false)} className="block text-white text-[13px] px-5 py-[15px] font-normal uppercase tracking-wider hover:opacity-40">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Sign out */}
          <button onClick={() => signOut({ callbackUrl: '/' })} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-white/60 hover:text-white" title="Cerrar Sesión">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 pt-[60px] md:pt-[78px] min-h-screen text-white">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;