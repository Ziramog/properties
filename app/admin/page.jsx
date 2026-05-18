export const dynamic = 'force-dynamic';

import Link from 'next/link';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import Quote from '@/models/Quote';

const AdminPage = async () => {
  await connectDB();

  const total = await Property.countDocuments({});
  const activas = await Property.countDocuments({ status: 'active' });
  const featured = await Property.countDocuments({ is_featured: true });
  const quotes = await Quote.countDocuments({});

  const recentProperties = await Property.find({}).sort({ createdAt: -1 }).limit(5).lean();

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-[28px] md:text-[36px] font-normal text-[#0F172A] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
        Panel de Control
      </h1>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { value: total, label: 'Total Propiedades', color: '#F26B2E', href: '/admin/properties' },
          { value: activas, label: 'Activas', color: '#25D366', href: '/admin/properties?status=active' },
          { value: featured, label: 'Destacadas', color: '#652660', href: '/admin/properties?is_featured=true' },
          { value: quotes, label: 'Presupuestos', color: '#0F172A', href: '/admin/quotes' },
        ].map(stat => (
          <Link key={stat.label} href={stat.href} className="bg-white rounded-[20px] p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-[32px] md:text-[40px] font-bold leading-none mb-1" style={{ fontFamily: 'var(--font-heading)', color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-[11px] md:text-[13px] font-medium text-[#666] uppercase tracking-wider">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent properties */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-semibold text-[#0F172A]">Últimas Propiedades</h2>
          <Link href="/admin/properties" className="text-[var(--color-brand)] hover:underline text-sm font-medium">
            Ver todas
          </Link>
        </div>
        {recentProperties.length === 0 ? (
          <p className="text-[13px] text-[#999] text-center py-8">No hay propiedades todavía.</p>
        ) : (
          <div className="space-y-2">
            {recentProperties.map(p => (
              <Link key={p._id.toString()} href={`/admin/properties/${p._id.toString()}/edit`}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-[#F9F9F9] transition-colors">
                <div>
                  <p className="text-[14px] font-medium text-[#0F172A]">{p.name}</p>
                  <p className="text-[11px] text-[#999]">{p.location?.city || ''} · {p.location?.street || ''}</p>
                </div>
                <span className={`text-[11px] font-bold px-2 py-1 rounded uppercase tracking-wider text-white ${
                  p.status === 'active' ? 'bg-green-500' : p.status === 'pending' ? 'bg-yellow-500' : p.status === 'coming_soon' ? 'bg-blue-500' : 'bg-gray-500'
                }`}>
                  {p.status === 'active' ? 'Activa' : p.status === 'pending' ? 'Pendiente' : p.status === 'coming_soon' ? 'Próximo' : p.status || '—'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
