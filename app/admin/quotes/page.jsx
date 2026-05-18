export const dynamic = 'force-dynamic';

import Link from 'next/link';
import connectDB from '@/config/database';
import Quote from '@/models/Quote';

function getStatusBadge(status) {
  const map = {
    draft: { label: 'Borrador', color: 'bg-gray-500' },
    sent: { label: 'Enviado', color: 'bg-blue-500' },
    accepted: { label: 'Aceptado', color: 'bg-green-500' },
    rejected: { label: 'Rechazado', color: 'bg-red-500' },
  };
  return map[status] || { label: status, color: 'bg-gray-500' };
}

const AdminQuotesPage = async ({ searchParams }) => {
  await connectDB();

  const quotes = await Quote.find({})
    .populate('property', 'name location')
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[28px] md:text-[36px] font-normal text-[#0F172A]" style={{ fontFamily: 'var(--font-heading)' }}>
          Presupuestos
        </h1>
        <Link
          href="/admin/quotes/create"
          className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors uppercase tracking-wider"
        >
          + Nuevo
        </Link>
      </div>

      {quotes.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <p className="text-[#666] text-[15px]">No hay presupuestos todavía.</p>
          <Link href="/admin/quotes/create" className="text-[var(--color-brand)] hover:underline text-sm font-medium mt-2 inline-block">
            Crear el primer presupuesto
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#F6F6F6] border-b border-[#eee]">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-[#333]">Cliente</th>
                <th className="text-left px-4 py-3 font-semibold text-[#333]">Propiedad</th>
                <th className="text-left px-4 py-3 font-semibold text-[#333]">Total</th>
                <th className="text-left px-4 py-3 font-semibold text-[#333]">Estado</th>
                <th className="text-left px-4 py-3 font-semibold text-[#333] hidden md:table-cell">Fecha</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eee]">
              {quotes.map((q) => {
                const badge = getStatusBadge(q.status);
                return (
                  <tr key={q._id.toString()} className="hover:bg-[#F9F9F9] transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#0F172A]">{q.client?.name}</p>
                      {q.client?.email && <p className="text-[11px] text-[#999]">{q.client.email}</p>}
                    </td>
                    <td className="px-4 py-3 text-[#666]">
                      {q.property?.name || '—'}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#0F172A]">
                      U$D {q.totalAmount?.toLocaleString('es-AR')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-[11px] font-bold text-white px-2 py-1 rounded uppercase tracking-wider ${badge.color}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#666] hidden md:table-cell">
                      {new Date(q.createdAt).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/quotes/${q._id.toString()}`} className="text-[var(--color-brand)] hover:underline text-xs font-medium">
                        Ver
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminQuotesPage;
