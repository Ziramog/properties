export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Panel de Control',
  robots: { index: false, follow: false },
};

import Link from 'next/link';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import Quotation from '@/models/Quotation';
import { isGranInversion } from '@/utils/filterProperties';
import {
  Home,
  Building2,
  Sprout,
  Map,
  Store,
  TrendingUp,
  User,
  Star,
} from 'lucide-react';

const AdminPage = async () => {
  await connectDB();

  const total = await Property.countDocuments({});
  const activas = await Property.countDocuments({ status: 'active' });
  const featured = await Property.countDocuments({ is_featured: true });
  const quotations = await Quotation.countDocuments({});

  const types = ['Casa', 'Departamento', 'Campo', 'Terreno', 'Inmueble Comercial'];
  const categoryCounts = await Promise.all(
    types.map(async (t) => ({
      type: t,
      count: await Property.countDocuments({ type: t }),
    }))
  );

  // Gran Inversión: price >= 300k OR square_feet >= 10,000
  const allPropsForGI = await Property.find({}, 'price square_feet').lean();
  const granInversionCount = allPropsForGI.filter((p) => isGranInversion(p)).length;

  const CATEGORIES = [
    { type: 'Casa', Icon: Home, color: '#F26B2E' },
    { type: 'Departamento', Icon: Building2, color: '#652660' },
    { type: 'Campo', Icon: Sprout, color: '#25D366' },
    { type: 'Terreno', Icon: Map, color: '#60A5FA' },
    { type: 'Inmueble Comercial', Icon: Store, color: '#E94560' },
    { type: 'Gran Inversión', Icon: TrendingUp, color: '#FFD700', count: granInversionCount, href: '/admin/properties?granInversion=true' },
  ];

  const NAV_LINKS = [
    { label: 'Perfil', href: '/admin/profile', Icon: User, color: '#888' },
    { label: 'Reseñas', href: '/admin/reviews', Icon: Star, color: '#FFD700' },
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
          { value: quotations, label: 'Propuestas', color: '#0F172A', href: '/admin/quotations' },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-[#161616] border border-[#222] rounded-sm p-5 md:p-6 hover:border-[#333] transition-colors text-center">
            <p className="text-[32px] md:text-[40px] font-bold leading-none mb-1" style={{ fontFamily: 'var(--font-heading)', color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-[11px] md:text-[13px] font-medium text-[#888] uppercase tracking-wider">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((cat) => {
          const count = cat.count !== undefined ? cat.count : categoryCounts.find((c) => c.type === cat.type)?.count || 0;
          return (
            <Link
              key={cat.type}
              href={cat.href || `/admin/properties?type=${cat.type}`}
              className="bg-[#161616] border border-[#222] rounded-sm p-5 hover:border-[#333] transition-colors text-center"
            >
              <cat.Icon className="w-7 h-7 mx-auto mb-2" style={{ color: cat.color }} strokeWidth={1.5} />
              <p className="text-[24px] font-bold leading-none mb-1" style={{ color: cat.color }}>
                {count}
              </p>
              <p className="text-[11px] font-medium text-[#888] uppercase tracking-wider">{cat.type}</p>
            </Link>
          );
        })}
      </div>

      {/* Navigation links: Perfil + Reseñas */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="bg-[#161616] border border-[#222] rounded-sm p-5 hover:border-[#333] transition-colors text-center"
          >
            <link.Icon className="w-7 h-7 mx-auto mb-2" style={{ color: link.color }} strokeWidth={1.5} />
            <p className="text-[11px] font-medium text-[#888] uppercase tracking-wider">{link.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
