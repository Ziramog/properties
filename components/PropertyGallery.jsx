'use client';
import Image from 'next/image';
import { Gallery, Item } from 'react-photoswipe-gallery';

const PropertyGallery = ({ images = [], property }) => {
  if (images.length === 0) return null;

  const beds = property?.beds;
  const baths = property?.baths;
  const area = property?.square_feet;

  return (
    <div id="gallery-section">
      <Gallery>
        <section className="bg-[#111]">
          <div className="w-full">

            {/* Hero image — always 16:9 horizontal, full bleed */}
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
              {images[0] && (
                <Item
                  original={images[0]}
                  thumbnail={images[0]}
                  width="1600"
                  height="900"
                >
                  {({ ref, open }) => (
                    <div
                      ref={ref}
                      onClick={open}
                      className="relative w-full h-full cursor-pointer"
                      style={{ aspectRatio: '16/9' }}
                    >
                      <Image
                        src={images[0]}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority={true}
                      />
                    </div>
                  )}
                </Item>
              )}

              {/* See all photos button — top RIGHT */}
              {images.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById('gallery-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="absolute top-5 right-5 bg-black/70 hover:bg-black/80 backdrop-blur-sm text-white text-sm font-bold px-5 py-2.5 rounded-md transition-colors cursor-pointer z-10"
                >
                  Ver todas las {images.length} fotos
                </button>
              )}
            </div>

            {/* Thumbnails row */}
            {images.length > 1 && (
              <div
                className="flex gap-2.5 mt-5 px-4 md:px-8 lg:px-12"
                style={{ maxWidth: '100%', overflowX: 'auto' }}
              >
                {images.slice(1).map((image, index) => (
                  <Item
                    key={index}
                    original={image}
                    thumbnail={image}
                    width="800"
                    height="600"
                  >
                    {({ ref, open }) => (
                      <div
                        ref={ref}
                        onClick={open}
                        className="relative flex-shrink-0 cursor-pointer overflow-hidden"
                        style={{ width: '150px', height: '100px' }}
                      >
                        <Image
                          src={image}
                          alt=""
                          fill
                          className="object-cover hover:scale-[1.03] transition-transform duration-300"
                          sizes="150px"
                        />
                      </div>
                    )}
                  </Item>
                ))}
              </div>
            )}

            {/* Dark info overlay — full width */}
            <div
              className="mt-10 px-6 md:px-8 lg:px-12 py-8 text-white"
              style={{ background: '#1a1a1a' }}
            >
              {/* Title — white */}
              <h1
                className="text-3xl md:text-4xl font-bold leading-tight text-white mb-2"
                style={{ fontFamily: 'var(--font-heading)', margin: '0 0 10px' }}
              >
                {property?.name}
              </h1>

              {/* Address with map pin icon */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property?.location?.street}, ${property?.location?.city}, ${property?.location?.state}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-base mb-5"
                style={{ margin: '0 0 20px' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {property?.location?.street}{property?.location?.street && property?.location?.city ? ', ' : ''}{property?.location?.city}{property?.location?.city && property?.location?.state ? ', ' : ''}{property?.location?.state}
              </a>

              {/* Stats row with icons */}
              <div className="flex gap-8 mb-5" style={{ margin: '0 0 20px' }}>
                {beds != null && (
                  <span className="flex items-center gap-2 text-lg font-semibold text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 12v6a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-6M3 12V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7" />
                    </svg>
                    {beds} {beds === 1 ? 'Dorm.' : 'Dorms.'}
                  </span>
                )}
                {baths != null && (
                  <span className="flex items-center gap-2 text-lg font-semibold text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12V4a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1" />
                      <circle cx="8" cy="8" r="1" fill="currentColor" />
                    </svg>
                    {baths} {baths === 1 ? 'Baño' : 'Baños'}
                  </span>
                )}
                {area && (
                  <span className="flex items-center gap-2 text-lg font-semibold text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v18h16.5V3.75M3.75 3.75L12 21l8.25-17.25M3.75 3.75h16.5M12 3.75v17.25" />
                    </svg>
                    {area.toLocaleString('es-AR')} m²
                  </span>
                )}
              </div>

              {/* Price + Contact */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <p
                  className="text-white font-bold"
                  style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', margin: 0 }}
                >
                  {property?.price || 'Consultar'}
                </p>
                <button
                  onClick={() => {
                    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-primary hover:bg-primary-hover text-white font-bold rounded-[5px] cursor-pointer transition-all duration-200"
                  style={{ display: 'inline-block', padding: '15px 30px', fontSize: '16px' }}
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </section>
      </Gallery>
    </div>
  );
};

export default PropertyGallery;
