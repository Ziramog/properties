export const dynamic = 'force-dynamic';

import PropertyDetails from '@/components/PropertyDetails';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import PropertyGallery from '@/components/PropertyGallery';
import FullGallery from '@/components/FullGallery';
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
    <div className="min-h-screen" style={{ background: '#F6F6F6' }}>
      {/* Gallery subheader — full width */}
      <PropertyGallery images={property.images} property={property} />

      {/* Content */}
      <section className="px-[15px] pb-16">
        {/* Back button */}
          <div className="py-4 px-4 md:px-0">
            <Link
              href='/properties'
              className='text-[#E94560] hover:text-[#0F172A] inline-flex items-center font-medium transition-colors text-[13px]'
            >
              <svg className='mr-1.5 w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 16 16'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M10 3 6 8l4 5' />
              </svg>
              Volver a Propiedades
            </Link>
          </div>

          {/* Property details + contact */}
          <div>
            <PropertyDetails property={property} />

            {/* Contact & Actions */}
            <div className="mt-0 md:mt-8 space-y-0 md:space-y-4">
              {/* Contact form — full card */}
              <div id="contact-form">
                <PropertyContactForm property={property} />
              </div>

              {/* Desktop: WhatsApp + Bookmark + Share row */}
              <div className="hidden md:flex md:flex-wrap md:gap-4 mt-4">
                <div className="flex-1 min-w-[200px]">
                  <WhatsAppButton property={property} />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <BookmarkButton property={property} />
                </div>
                <div className="hidden md:block w-full mt-4">
                  <ShareButtons property={property} />
                </div>
              </div>

              {/* Mobile: WhatsApp + Bookmark + Share */}
              <div className="md:hidden px-4 space-y-3 mb-0">
                <WhatsAppButton property={property} />
                <BookmarkButton property={property} />
                <ShareButtons property={property} />
              </div>
            </div>
          </div>

          {/* Full gallery at bottom */}
          {property.images && property.images.length > 0 && (
            <div className="mt-8" id="full-gallery">
              <FullGallery images={property.images} propertyName={property.name} />
            </div>
          )}
      </section>
    </div>
  );
};
export default PropertyPage;
