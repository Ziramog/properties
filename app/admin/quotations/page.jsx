export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin — Propuestas',
  robots: { index: false, follow: false },
};

import Link from 'next/link';
import connectDB from '@/config/database';
import Quotation from '@/models/Quotation';
import QuotationActions from '@/components/admin/quotations/QuotationActions';

const STATUS_CONFIG = [
  { id: 'draft', label: 'Borrador', color: 'bg-zinc-700 text-zinc-300' },
  { id: 'sent', label: 'Enviado', color: 'bg-blue-900/40 text-blue-400' },
  { id: 'viewed', label: 'Visto', color: 'bg-amber-900/40 text-amber-400' },
  { id: 'accepted', label: 'Aceptado', color: 'bg-green-900/40 text-green-400' },
  { id: 'rejected', label: 'Rechazado', color: 'bg-red-900/40 text-red-400' },
  { id: 'expired', label: 'Vencido', color: 'bg-zinc-800 text-zinc-500' },
];

const AdminQuotationsPage = async () => {
  await connectDB();
  const quotations = await Quotation.find({}).sort({ createdAt: -1 }).lean();

  const stats = {
    total: quotations.length,
    draft: quotations.filter(q => q.status === 'draft').length,
    sent: quotations.filter(q => q.status === 'sent').length,
    accepted: quotations.filter(q => q.status === 'accepted').length,
  };

  return (
    <div className="p-3 md:p-6">
      <h1 className="text-[24px] md:text-[36px] font-normal text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
        Propuestas
      </h1>
      <Link href="/admin/quotations/new"
        className="inline-block bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-[12px] md:text-[13px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm transition-colors mb-6">
        + Nueva Propuesta
      </Link>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { value: stats.total, label: 'Total', color: '#fff' },
          { value: stats.draft, label: 'Borradores', color: '#888' },
          { value: stats.sent, label: 'Enviadas', color: '#60A5FA' },
          { value: stats.accepted, label: 'Aceptadas', color: '#4ADE80' },
        ].map(s => (
          <div key={s.label} className="bg-[#161616] border border-[#222] rounded-sm p-3 md:p-4 text-center">
            <p className="text-[20px] md:text-[28px] font-bold leading-none mb-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] font-medium text-[#888] uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#161616] border border-[#222] rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#222] text-[10px] font-bold uppercase tracking-wider text-[#888]">
                <th className="px-2 md:px-4 py-3">N°</th>
                <th className="px-2 md:px-4 py-3">Cliente</th>
                <th className="px-2 md:px-3 py-3 hidden md:table-cell">Propiedad</th>
                <th className="px-2 md:px-3 py-3 text-right">Total</th>
                <th className="px-2 md:px-3 py-3 text-center">Estado</th>
                <th className="px-2 md:px-3 py-3 hidden md:table-cell">Fecha</th>
                <th className="px-2 md:px-4 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {quotations.map(q => {
                const statusCfg = STATUS_CONFIG.find(s => s.id === q.status) || STATUS_CONFIG[0];
                return (
                  <tr key={q._id.toString()} className="hover:bg-[#1a1a1a] transition-colors text-[13px]">
                    <td className="px-2 md:px-4 py-3 font-medium text-white text-[11px] md:text-[12px]">{q.quoteNumber}</td>
                    <td className="px-2 md:px-4 py-3">
                      <p className="font-medium text-white truncate max-w-[80px] md:max-w-[140px]">{q.client?.name}</p>
                    </td>
                    <td className="px-2 md:px-3 py-3 text-[#bbb] truncate max-w-[160px] hidden md:table-cell">{q.properties?.[0]?.title || '—'}</td>
                    <td className="px-2 md:px-3 py-3 text-right font-semibold text-[12px] text-white">U$D {q.totalValue?.toLocaleString('es-AR')}</td>
                    <td className="px-2 md:px-3 py-3 text-center">
                      <span className={`inline-block text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider ${statusCfg.color}`}>{statusCfg.label}</span>
                    </td>
                    <td className="px-2 md:px-3 py-3 text-[#888] text-[12px] hidden md:table-cell">{new Date(q.createdAt).toLocaleDateString('es-AR')}</td>
                    <td className="px-2 md:px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2 relative z-10">
                        <a href={`/api/quotations/${q._id}/generate-pdf`} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-7 h-7 bg-[var(--color-brand)] text-white text-[11px] font-bold rounded-sm hover:bg-[var(--color-brand-dark)] transition-colors" title="Descargar PDF">PDF</a>
                        <QuotationActions quotationId={q._id.toString()} currentStatus={q.status} trackingToken={q.delivery?.trackingToken} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {quotations.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[#888] text-[14px]">
                    No hay propuestas. <Link href="/admin/quotations/new" className="text-[var(--color-brand)] font-medium hover:underline">Crear la primera</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminQuotationsPage;
