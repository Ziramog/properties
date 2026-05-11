export const dynamic = 'force-dynamic';

import connectDB from '@/config/database';
import Property from '@/models/Property';
import { convertToSerializeableObject } from '@/utils/convertToObject';
import AdminPropertyTable from '@/components/admin/AdminPropertyTable';

const AdminPage = async () => {
  await connectDB();

  const properties = await Property.find({}).sort({ createdAt: -1 }).lean();
  const serialized = properties.map(p => convertToSerializeableObject(p));

  const total = properties.length;
  const activas = properties.filter(p => p.status === 'active').length;
  const featured = properties.filter(p => p.is_featured).length;

  return (
    <div className="min-h-screen" style={{ background: '#F6F6F6' }}>
      {/* Header bar */}
      <section className="bg-[#111] pt-[130px] pb-8 px-6">
        <div className="max-w-[1430px] mx-auto">
          <h1 className="text-[28px] md:text-[36px] font-normal text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Panel de Control
          </h1>
          <p className="text-white/50 text-[14px]">Administrá tus propiedades desde un solo lugar</p>
        </div>
      </section>

      {/* Stats cards */}
      <section className="px-4 md:px-[15px] -mt-6">
        <div className="max-w-[1430px] mx-auto">
          <div className="grid grid-cols-3 gap-4 mb-5">
            {[
              { value: total, label: 'Total Propiedades', color: '#F26B2E' },
              { value: activas, label: 'Activas', color: '#25D366' },
              { value: featured, label: 'Destacadas', color: '#652660' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-[20px] p-6 shadow-sm">
                <p className="text-[36px] font-bold leading-none mb-1" style={{ fontFamily: 'var(--font-heading)', color: stat.color }}>
                  {stat.value}
                </p>
                <p className="text-[13px] font-medium text-[#666] uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property table */}
      <section className="px-4 md:px-[15px] pb-16">
        <div className="max-w-[1430px] mx-auto">
          <AdminPropertyTable properties={serialized} />
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
