export const dynamic = 'force-dynamic';

import PropertyDetails from '@/components/PropertyDetails';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import PropertyGallery from '@/components/PropertyGallery';
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
    <div className="bg-[#E8E6E0] min-h-screen">
      {/* Gallery — full width, no gap */}
      <PropertyGallery images={property.images} />

      {/* Back button + content */}
      <section className="px-4 md:px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          {/* Back button */}
          <div className="py-4">
            <Link
              href='/properties'
              className='text-[var(--color-brand)] hover:text-[var(--color-ink)] flex items-center font-medium transition-colors text-sm'
            >
              <svg className='mr-1.5 w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 16 16'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M10 3 6 8l4 5' />
              </svg>
              Volver a Propiedades
            </Link>
          </div>

          {/* Main grid */}
          <div className='grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 pb-12'>
            <PropertyDetails property={property} />

            {/* Sidebar */}
            <aside className='space-y-4 lg:sticky lg:top-24 lg:self-start'>
              <WhatsAppButton property={property} />
              <BookmarkButton property={property} />
              <ShareButtons property={property} />
              <PropertyContactForm property={property} />
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};
export default PropertyPage;
