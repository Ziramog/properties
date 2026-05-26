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

  const types = ['Casa', 'Departamento', 'Campo', 'Terreno', 'Inmueble Comercial'];
  const categoryCounts = await Promise.all(
    types.map(async (t) => ({
      type: t,
      count: await Property.countDocuments({ type: t }),
    }))
  );

  const CATEGORIES = [
    { type: 'Casa', icon: '🏠', color: '#F26B2E' },
    { type: 'Departamento', icon: '🏢', color: '#652660' },
    { type: 'Campo', icon: '🌾', color: '#25D366' },
    { type: 'Terreno', icon: '📐', color: '#0F172A' },
    { type: 'Inmueble Comercial', icon: '🏪', color: '#E94560' },
  ];

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-[28px] md:text-[36px] font-normal text-white mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
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
          <Link key={stat.label} href={stat.href} className="bg-[#161616] border border-[#222] rounded-sm p-5 md:p-6 hover:border-[#333] transition-colors">
            <p className="text-[32px] md:text-[40px] font-bold leading-none mb-1" style={{ fontFamily: 'var(--font-heading)', color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-[11px] md:text-[13px] font-medium text-[#888] uppercase tracking-wider">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {CATEGORIES.map((cat) => {
          const count = categoryCounts.find((c) => c.type === cat.type)?.count || 0;
          return (
            <Link
              key={cat.type}
              href={`/admin/properties?type=${cat.type}`}
              className="bg-[#161616] border border-[#222] rounded-sm p-5 hover:border-[#333] transition-colors text-center"
            >
              <p className="text-3xl mb-2">{cat.icon}</p>
              <p className="text-[24px] font-bold leading-none mb-1" style={{ color: cat.color }}>
                {count}
              </p>
              <p className="text-[11px] font-medium text-[#888] uppercase tracking-wider">{cat.type}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AdminPage;
