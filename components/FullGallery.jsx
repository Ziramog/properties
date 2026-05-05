'use client';
import Image from 'next/image';
import { Gallery, Item } from 'react-photoswipe-gallery';

const FullGallery = ({ images = [], propertyName }) => {
  if (images.length === 0) return null;

  return (
    <Gallery>
      <section className="bg-white rounded-none md:rounded-[30px] overflow-hidden">
        <div className="px-6 py-6 md:p-8">
          <div className="pb-6">
            <h2
              className="text-[22px] md:text-[26px] font-semibold text-[#0F172A]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {propertyName ? `${propertyName} Photos` : 'Photos'}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[6px]">
            {images.map((image, index) => (
              <Item key={index} original={image} thumbnail={image} width="1200" height="800">
                {({ ref, open }) => (
                  <div
                    ref={ref}
                    onClick={open}
                    className="relative cursor-pointer overflow-hidden bg-[#f0f0f0] aspect-[4/3]"
                  >
                    <Image
                      src={image}
                      alt={`${propertyName || 'Property'} photo ${index + 1}`}
                      fill
                      className="object-cover hover:scale-[1.03] transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      loading="lazy"
                    />
                  </div>
                )}
              </Item>
            ))}
          </div>
        </div>
      </section>
    </Gallery>
  );
};

export default FullGallery;
