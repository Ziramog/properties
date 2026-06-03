export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin — Propiedades',
  robots: { index: false, follow: false },
};

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

      <h1 className="text-[24px] md:text-[36px] font-normal text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
        Propiedades
      </h1>

      <AdminPropertyTable properties={serialized} defaultType={searchParams?.type || ''} defaultGranInversion={searchParams?.granInversion === 'true'} />
    </div>
  );
};

export default AdminPropertiesPage;
