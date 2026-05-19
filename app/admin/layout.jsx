'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

const AdminLayout = ({ children }) => {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex bg-[#F6F6F6]">
      {/* Mobile top bar — Senada style */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-black z-[60] h-[60px] flex items-center px-4 shadow-lg">
        <Link href="/" className="min-w-[44px] min-h-[44px] flex items-center justify-center text-white/60 hover:text-white" title="Volver al sitio">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
        </Link>
        <span className="text-white text-sm font-bold uppercase tracking-wider ml-1">ADMIN</span>
        <div className="ml-auto flex items-center">
          <Link href="/admin/profile" className="min-w-[44px] min-h-[44px] flex items-center justify-center text-white/60 hover:text-white" title="Perfil">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </Link>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-white/60 hover:text-white" title="Cerrar Sesión">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 pt-[60px] md:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;