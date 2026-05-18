'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import logo from '@/assets/images/logo-white.png';

const NAV_ITEMS = [
  { href: '/admin', label: 'Panel de Control', icon: '📊' },
  { href: '/admin/properties', label: 'Propiedades', icon: '🏠' },
  { href: '/admin/quotes', label: 'Presupuestos', icon: '📋' },
  { href: '/admin/profile', label: 'Perfil', icon: '👤' },
];

const AdminLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);

  const isActive = (href) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  useEffect(() => {
    if (!drawerOpen) return;
    const handleClick = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target) && e.target.closest('[data-close-drawer]')) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [drawerOpen]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen flex bg-[#F6F6F6]">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col fixed left-0 top-0 bottom-0 w-[240px] bg-black z-40">
        <div className="flex items-center h-[60px] px-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src={logo} alt="Logo" width={32} height={32} className="brightness-0 invert" />
            <span className="text-white text-sm font-bold uppercase tracking-wider">Panel Admin</span>
          </Link>
        </div>
        <nav className="flex-1 py-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                isActive(item.href)
                  ? 'text-white bg-white/10 border-r-2 border-[var(--color-brand)] font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[var(--color-brand)] flex items-center justify-center text-white text-xs font-bold uppercase">
              {session?.user?.name?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{session?.user?.name || 'Admin'}</p>
              <p className="text-white/40 text-[10px] truncate">{session?.user?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full text-left px-2 py-2 text-xs text-white/40 hover:text-white transition-colors uppercase tracking-wider"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-black z-50 h-[60px] flex items-center px-4 shadow-lg">
        <button onClick={() => setDrawerOpen(!drawerOpen)} className="text-white mr-3" aria-label="Abrir menú">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
            {drawerOpen ? (
              <>
                <path d="M18 6L6 18" /><path d="M6 6l12 12" />
              </>
            ) : (
              <>
                <path d="M3 12h18" /><path d="M3 6h18" /><path d="M3 18h18" />
              </>
            )}
          </svg>
        </button>
        <Link href="/admin" className="text-white text-sm font-bold uppercase tracking-wider">Panel Admin</Link>
      </div>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setDrawerOpen(false)} />
      )}

      {/* Mobile drawer */}
      <div
        ref={drawerRef}
        className={`md:hidden fixed top-0 left-0 bottom-0 w-[260px] bg-black z-50 transform transition-transform duration-300 ease-in-out ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ paddingTop: '60px' }}
      >
        <nav className="py-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                isActive(item.href)
                  ? 'text-white bg-white/10 border-r-2 border-[var(--color-brand)] font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => setDrawerOpen(false)}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full text-left px-3 py-2 text-xs text-white/40 hover:text-white transition-colors uppercase tracking-wider"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 md:ml-[240px] pt-[60px] md:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
