'use client';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

const AdminLayout = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      {/* Content */}
      <main className="flex-1 pt-[80px] md:pt-[110px] min-h-screen text-white max-w-[1600px] mx-auto w-full relative">
        {pathname !== '/admin' && (
          <div className="px-4 md:px-6 mb-2">
            <Link href="/admin" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#161616] border border-[#222] text-[12px] font-medium text-[#aaa] hover:text-white hover:bg-[#222] hover:border-[#333] transition-all" title="Ir al Panel">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
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