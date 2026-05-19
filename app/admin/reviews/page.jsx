export const dynamic = 'force-dynamic';

import Link from 'next/link';
import connectDB from '@/config/database';
import Review from '@/models/Review';
import BusinessInfo from '@/models/BusinessInfo';
import { syncReviews } from '@/lib/sync/sync-reviews';
import addManualReview from '@/app/actions/addManualReview';

const AdminReviewsPage = async ({ searchParams }) => {
  await connectDB();

  const syncNow = searchParams?.sync === '1';
  const showAdd = searchParams?.add === '1';
  let syncResult = null;
  let addResult = null;

  if (syncNow) syncResult = await syncReviews();

  const reviews = await Review.find({}).sort({ priority: -1, publishTime: -1 }).lean();
  const businessInfo = await BusinessInfo.findOne({}).lean();
  const googleRating = businessInfo?.overallRating;
  const dbAvg = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0;
  const avgRating = googleRating || dbAvg;
  const totalUserRatings = businessInfo?.totalUserRatings;
  const stats = {
    total: reviews.length,
    featured: reviews.filter(r => r.featured).length,
    hidden: reviews.filter(r => r.hidden).length,
    avgRating: avgRating ? avgRating.toFixed(1) : '—',
    totalUserRatings,
  };

  return (
    <div className="p-3 md:p-6">
      <Link href="/admin" className="inline-flex items-center gap-1 text-[var(--color-brand)] hover:underline text-sm font-medium mb-3">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
        Volver al Panel de Control
      </Link>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h1 className="text-[24px] md:text-[36px] font-normal text-[#0F172A]" style={{ fontFamily: 'var(--font-heading)' }}>
          Reseñas Google
        </h1>
        <div className="flex gap-2">
          <a href={showAdd ? '/admin/reviews' : '/admin/reviews?add=1'} className="text-[12px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg border border-[var(--color-brand)] text-[var(--color-brand)] hover:bg-[var(--color-brand)] hover:text-white transition-colors">
            {showAdd ? 'Volver' : '+ Agregar'}
          </a>
          <a href="/admin/reviews?sync=1" className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-[12px] md:text-[13px] font-bold uppercase tracking-wider px-4 md:px-5 py-2.5 rounded-lg transition-colors">
            Sincronizar
          </a>
        </div>
      </div>

      {syncResult && (
        <div className={`mb-4 p-4 rounded-xl text-sm ${syncResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {syncResult.success
            ? `✅ Sync Google — ${syncResult.inserted} nuevas, ${syncResult.updated} actualizadas (${syncResult.durationMs}ms). Tenés ${stats.total} reseñas en total. ${syncResult.overallRating ? `★ ${syncResult.overallRating} en Google (${syncResult.totalRatings} reseñas).` : ''}`
            : `❌ Error: ${syncResult.error}`}
        </div>
      )}

      {/* Manual add form */}
      {showAdd && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-[18px] font-semibold text-[#0F172A] mb-4">Agregar reseña manual</h2>
          <form action={addManualReview} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] mb-1">Nombre del autor</label>
              <input type="text" name="authorName" required className="w-full border border-[#ddd] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brand)]" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] mb-1">Rating (1-5)</label>
              <select name="rating" required className="w-full border border-[#ddd] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brand)]">
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] mb-1">Fecha</label>
              <input type="date" name="publishDate" className="w-full border border-[#ddd] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brand)]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] mb-1">Texto de la reseña</label>
              <textarea name="text" rows={3} className="w-full border border-[#ddd] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brand)]" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="featured" id="featured" className="w-4 h-4" />
              <label htmlFor="featured" className="text-sm text-[#333]">Destacada</label>
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-sm font-bold px-6 py-2.5 rounded-lg transition-colors uppercase tracking-wider">
                Guardar reseña
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      {!showAdd && (
        <>
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { value: stats.total, label: 'Total', color: '#0F172A' },
              { value: stats.featured, label: 'Destacadas', color: '#F26B2E' },
              { value: stats.hidden, label: 'Ocultas', color: '#999' },
              { value: stats.avgRating, label: `★ Google${stats.totalUserRatings ? ` (${stats.totalUserRatings})` : ''}`, color: '#F59E0B' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-xl p-3 md:p-4 shadow-sm text-center">
                <p className="text-[20px] md:text-[28px] font-bold leading-none mb-1" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-[10px] font-medium text-[#666] uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Reviews table */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#eee] text-[10px] font-bold uppercase tracking-wider text-[#999]">
                    <th className="px-3 md:px-4 py-3">Autor</th>
                    <th className="px-2 md:px-3 py-3">★</th>
                    <th className="px-2 md:px-3 py-3 hidden md:table-cell">Reseña</th>
                    <th className="px-2 md:px-3 py-3 hidden md:table-cell">Fecha</th>
                    <th className="px-2 md:px-3 py-3 text-center">Dest</th>
                    <th className="px-2 md:px-3 py-3 text-center">Oculto</th>
                    <th className="px-3 md:px-4 py-3 text-right">Prior.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f5f5]">
                  {reviews.map(r => (
                    <tr key={r._id.toString()} className="hover:bg-[#fafafa] transition-colors text-[13px]">
                      <td className="px-3 md:px-4 py-3"><p className="font-medium text-[#0F172A] truncate max-w-[120px]">{r.authorName}</p></td>
                      <td className="px-2 md:px-3 py-3 text-amber-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</td>
                      <td className="px-2 md:px-3 py-3 text-[#666] hidden md:table-cell truncate max-w-[300px]">{r.text || '—'}</td>
                      <td className="px-2 md:px-3 py-3 text-[#999] hidden md:table-cell text-[12px]">{r.relativeTimeDescription || r.publishTime?.toISOString().split('T')[0]}</td>
                      <td className="px-2 md:px-3 py-3 text-center">
                        <span className={`inline-block w-6 h-6 rounded-full text-[12px] leading-6 font-bold ${r.featured ? 'bg-[var(--color-brand)] text-white' : 'bg-[#eee] text-[#999]'}`}>★</span>
                      </td>
                      <td className="px-2 md:px-3 py-3 text-center">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${r.hidden ? 'bg-red-500' : 'bg-green-500'}`} />
                      </td>
                      <td className="px-3 md:px-4 py-3 text-right text-[#999] text-[12px]">{r.priority}</td>
                    </tr>
                  ))}
                  {reviews.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-[#999] text-[14px]">
                        No hay reseñas. Hacé clic en "Sincronizar" para traerlas desde Google.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminReviewsPage;
