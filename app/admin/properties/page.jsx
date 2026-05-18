export const dynamic = 'force-dynamic';

import connectDB from '@/config/database';
import Property from '@/models/Property';
import { convertToSerializeableObject } from '@/utils/convertToObject';
import AdminPropertyTable from '@/components/admin/AdminPropertyTable';

const AdminPropertiesPage = async () => {
  await connectDB();

  const properties = await Property.find({}).sort({ createdAt: -1 }).lean();
  const serialized = properties.map(p => convertToSerializeableObject(p));

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-[28px] md:text-[36px] font-normal text-[#0F172A] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
        Propiedades
      </h1>
      <AdminPropertyTable properties={serialized} />
    </div>
  );
};

export default AdminPropertiesPage;
