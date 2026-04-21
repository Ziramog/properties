export const dynamic = 'force-dynamic';

import PropertyHeaderImage from '@/components/PropertyHeaderImage';
import PropertyDetails from '@/components/PropertyDetails';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import PropertyImages from '@/components/PropertyImages';
import BookmarkButton from '@/components/BookmarkButton';
import ShareButtons from '@/components/ShareButtons';
import PropertyContactForm from '@/components/PropertyContactForm';
import WhatsAppButton from '@/components/WhatsAppButton';
import { convertToSerializeableObject } from '@/utils/convertToObject';
import Link from 'next/link';

const PropertyPage = async ({ params }) => {
  await connectDB();
  const propertyDoc = await Property.findById(params.id).lean();

  if (!propertyDoc) {
    return (
      <h1 className='text-center text-2xl font-bold mt-10'>
        Propiedad No Encontrada
      </h1>
    );
  }

  const property = convertToSerializeableObject(propertyDoc);

  return (
    <>
      <PropertyHeaderImage image={property.images[0]} />
      <section>
        <div className='container m-auto py-6 px-6'>
          <Link
            href='/properties'
            className='text-[#E94560] hover:text-[#1A1A2E] flex items-center font-medium transition-colors'
          >
            <svg className='mr-2 w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 16 16'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M10 3 6 8l4 5' />
            </svg>
            Volver a Propiedades
          </Link>
        </div>
      </section>
      <section className='bg-gray-50'>
        <div className='container m-auto py-10 px-6'>
          <div className='grid grid-cols-1 md:grid-cols-70/30 w-full gap-6'>
            <PropertyDetails property={property} />

            {/* <!-- Sidebar --> */}
            <aside className='space-y-4'>
              <WhatsAppButton property={property} />
              <BookmarkButton property={property} />
              <ShareButtons property={property} />
              <PropertyContactForm property={property} />
            </aside>
          </div>
        </div>
      </section>
      <PropertyImages images={property.images} />
    </>
  );
};
export default PropertyPage;
