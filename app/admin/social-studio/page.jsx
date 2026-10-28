import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import connectDB from '@/config/database';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Social Studio 2.9 · Roggero & Roma',
  robots: { index: false, follow: false },
};

export default async function SocialStudioPage() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'superadmin') {
    redirect('/admin');
  }

  return (
    <div className="fixed inset-0 z-[120] flex flex-col h-screen w-screen bg-[#090b10] overflow-hidden select-none">
      {/* Top helper header */}
      <header className="h-[44px] bg-[#0b0e14] border-b border-[#232836] px-4 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#161b26] hover:bg-[#1f2636] border border-[#2a3142] text-[#cbd5e1] hover:text-white text-xs font-medium transition-colors"
            title="Volver al Panel de Control de Administración"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Volver al Panel</span>
          </Link>
          <span className="text-[#2a3142] text-sm">|</span>
          <div className="flex items-center gap-2">
            <span className="text-[#f1f5f9] text-xs font-semibold tracking-wider uppercase">
              Social Studio <span className="text-[#F6931C]">2.9</span>
            </span>
            <span className="bg-[#f6931c]/15 border border-[#f6931c]/40 text-[#fb923c] text-[10px] font-bold px-1.5 py-0.5 rounded tracking-widest uppercase">
              Superadmin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-[#94a3b8] text-[11px]">
            Feed · Historias · Portada · Retoque IA
          </span>
          <a
            href="/admin/social-studio/embed"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#161b26] hover:bg-[#1f2636] border border-[#2a3142] text-[#cbd5e1] hover:text-white text-xs transition-colors"
            title="Abrir editor en pestaña independiente"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            <span className="hidden md:inline">Ventana completa</span>
          </a>
        </div>
      </header>

      {/* Editor iframe */}
      <div className="flex-1 w-full h-[calc(100vh-44px)] relative bg-[#090b10]">
        <iframe
          src="/admin/social-studio/embed"
          title="Roggero & Roma Social Studio 2.9"
          className="w-full h-full border-0 block"
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </div>
  );
}
