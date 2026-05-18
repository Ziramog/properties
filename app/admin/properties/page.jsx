export const dynamic = 'force-dynamic';

import Link from 'next/link';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import { convertToSerializeableObject } from '@/utils/convertToObject';
import AdminPropertyTable from '@/components/admin/AdminPropertyTable';

const AdminPropertiesPage = async ({ searchParams }) => {
  await connectDB();

  const properties = await Property.find({}).sort({ createdAt: -1 }).lean();
  const serialized = properties.map(p => convertToSerializeableObject(p));

  return (
    <div className="p-3 md:p-6">
      <Link href="/admin" className="inline-flex items-center gap-1 text-[var(--color-brand)] hover:underline text-sm font-medium mb-3">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
        Volver al Panel de Control
      </Link>

      <h1 className="text-[24px] md:text-[36px] font-normal text-[#0F172A] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
        Propiedades
      </h1>

      <AdminPropertyTable properties={serialized} defaultType={searchParams?.type || ''} />
    </div>
  );
};

export default AdminPropertiesPage;
