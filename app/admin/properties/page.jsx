export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin — Propiedades',
  robots: { index: false, follow: false },
};

import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import { isSocialStudioAuthorized } from '@/utils/socialStudioAuth';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import { convertToSerializeableObject } from '@/utils/convertToObject';
import AdminPropertyTable from '@/components/admin/AdminPropertyTable';
import SiteConfig from '@/models/SiteConfig';

const AdminPropertiesPage = async ({ searchParams }) => {
  await connectDB();

  const [session, properties, config] = await Promise.all([
    getServerSession(authOptions),
    Property.find({}).sort({ createdAt: -1 }).lean(),
    SiteConfig.findOne({}).lean(),
  ]);
  const canShareSocial = isSocialStudioAuthorized(session);
  const serialized = properties.map(p => convertToSerializeableObject(p));
  const customLabels = config?.customPropertyLabels || ['PRECIO MEJORADO', 'ULTIMA UNIDAD', 'UNICO EN SU TIPO', 'MEJOR PRECIO', 'EXCELENTE PRECIO', 'AMOBLADA'];

  return (
    <div className="p-3 md:p-6">

      <h1 className="text-[24px] md:text-[36px] font-normal text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
        Propiedades
      </h1>

      <AdminPropertyTable 
        properties={serialized} 
        customLabels={customLabels}
        canShareSocial={canShareSocial}
        defaultType={searchParams?.type || ''} 
        defaultOperation={searchParams?.operation || ''}
        defaultGranInversion={searchParams?.granInversion === 'true'} 
        defaultFeatured={searchParams?.is_featured === 'true' ? 'yes' : ''}
        defaultPublished={searchParams?.status === 'active' ? 'yes' : ''}
      />
    </div>
  );
};

export default AdminPropertiesPage;
