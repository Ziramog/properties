'use client';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

const AdminLayout = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-black z-[60] h-[60px] flex items-center px-4 shadow-lg">
        <Link href="/" className="min-w-[44px] min-h-[44px] flex items-center justify-center text-white/60 hover:text-white" title="Volver al sitio">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </Link>
        <div className="ml-auto flex items-center gap-1">
          {/* Sign out */}
          <button onClick={() => signOut({ callbackUrl: '/' })} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-white/60 hover:text-white" title="Cerrar Sesión">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 pt-[60px] md:pt-[90px] min-h-screen text-white max-w-[1600px] mx-auto w-full relative">
        {pathname !== '/admin' && (
          <div className="px-4 md:px-6 pt-4 md:pt-6">
            <Link href="/admin" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#888] hover:text-[var(--color-brand)] transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Volver al Panel
            </Link>
          </div>
        )}
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;