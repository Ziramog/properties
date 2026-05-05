'use client';
import Image from 'next/image';
import { Gallery, Item } from 'react-photoswipe-gallery';

const PropertyGallery = ({ images = [], property }) => {
  if (images.length === 0) return null;

  const beds = property?.beds;
  const baths = property?.baths;
  const area = property?.square_feet;
  const rawPrice = property?.price;
  const numericPrice = rawPrice ? parseFloat(String(rawPrice).replace(/[^0-9.-]/g, '')) : null;

  const operationLabel =
    property?.operation === 'venta' ? 'Venta' :
    property?.operation === 'alquiler' ? 'Alquiler' :
    property?.operation === 'compra' ? 'Compra' : '';

  const statusMap = {
    active: 'Activo',
    active_under_contract: 'Bajo Contrato',
    closed: 'Vendido',
    coming_soon: 'Próximamente',
    pending: 'Pendiente',
  };
  const statusLabel = statusMap[property?.status];

  const subThumbs = images.slice(1, 7);

  const scrollToFullGallery = () => {
    const el = document.getElementById('full-gallery');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Gallery>
      <section className="bg-[#000] pt-[170px] pb-[30px]">
        {/* Gallery row — grid on desktop, stacked on mobile */}
        <div className="flex flex-col md:grid md:grid-cols-[2fr_3fr] md:gap-[5px] md:h-[720px] md:rounded-[30px] md:overflow-hidden">

          {/* Big image — 40% width on desktop */}
          <div className="relative cursor-pointer overflow-hidden bg-[#111]"
               style={{ minHeight: '300px' }}>
            {images[0] && (
              <Item original={images[0]} thumbnail={images[0]} width="1600" height="900">
                {({ ref, open }) => (
                  <div ref={ref} onClick={open}
                       className="relative w-full md:h-full"
                       style={{ minHeight: '300px' }}>
                    <Image
                      src={images[0]}
                      alt={property?.name || ''}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 40vw"
                      priority={true}
                    />
                  </div>
                )}
              </Item>
            )}
            {images.length > 1 && (
              <button
                onClick={scrollToFullGallery}
                className="absolute md:left-[30px] md:top-[30px] md:bottom-auto md:right-auto bottom-4 right-4 bg-[#652660] hover:opacity-90 text-white text-[13px] font-light px-5 py-2 rounded-[16px] transition-opacity z-10"
              >
                See all {images.length} photos
              </button>
            )}
          </div>

          {/* Thumbnail grid — 60% width on desktop */}
          {subThumbs.length > 0 && (
            <div>
              {/* Mobile: horizontal scroll */}
              <div className="md:hidden flex overflow-x-auto gap-[5px] py-2 px-3 scrollbar-hide">
                {subThumbs.map((image, index) => (
                  <Item key={index} original={image} thumbnail={image} width="800" height="600">
                    {({ ref, open }) => (
                      <div ref={ref} onClick={open}
                           className="relative flex-shrink-0 w-[130px] h-[86px] cursor-pointer overflow-hidden">
                        <Image src={image} alt="" fill className="object-cover" sizes="130px" loading="lazy" />
                      </div>
                    )}
                  </Item>
                ))}
              </div>
              {/* Desktop: 3-col x 2-row grid */}
              <div className="hidden md:grid grid-cols-3 gap-[5px] md:h-full"
                   style={{ gridTemplateRows: '1fr 1fr' }}>
                {subThumbs.map((image, index) => (
                  <Item key={index} original={image} thumbnail={image} width="800" height="600">
                    {({ ref, open }) => (
                      <div ref={ref} onClick={open}
                           className="relative cursor-pointer overflow-hidden bg-[#111] aspect-[16/9]">
                        <Image src={image} alt="" fill className="object-cover" sizes="20vw" loading="lazy" />
                      </div>
                    )}
                  </Item>
                ))}
                {Array.from({ length: 6 - subThumbs.length }).map((_, i) => (
                  <div key={`empty-${i}`} className="bg-[#000]" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dark info bar */}
        <div className="flex flex-col md:flex-row md:items-start gap-[25px] md:gap-[50px] px-4 md:px-[170px] pt-[30px] pb-0 text-white">
          {/* Left */}
          <div itemScope itemType="https://schema.org/Place">
            <h1 className="text-[32px] md:text-[36px] leading-[36px] md:leading-[42px] font-normal text-white mb-[10px]"
                style={{ fontFamily: 'var(--font-heading)' }}
                itemProp="name">
              {property?.name}
            </h1>

            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${property?.location?.street || ''}, ${property?.location?.city || ''}, ${property?.location?.state || ''}`
            )}`}
               target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-[10px] text-[#b8b8b8] hover:text-white transition-colors text-[16px] mb-4"
               itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              <span itemProp="streetAddress">
                {property?.location?.street}{property?.location?.street && property?.location?.city ? ', ' : ''}
                {property?.location?.city}{property?.location?.city && property?.location?.state ? ', ' : ''}
                {property?.location?.state}
              </span>
            </a>

            {/* Features row */}
            <div className="flex gap-[40px] flex-wrap">
              {beds != null && (
                <span className="flex items-center gap-[10px] text-white font-bold text-[22px]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 12v6a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-6M3 12V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7" />
                  </svg>
                  {beds}
                </span>
              )}
              {baths != null && (
                <span className="flex items-center gap-[10px] text-white font-bold text-[22px]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12V4a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1" />
                    <circle cx="8" cy="8" r="1" fill="currentColor" />
                  </svg>
                  {baths}
                </span>
              )}
              {area && (
                <span className="flex items-center gap-[10px] text-white font-bold text-[22px]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v18h16.5V3.75M3.75 3.75L12 21l8.25-17.25M3.75 3.75h16.5M12 3.75v17.25" />
                  </svg>
                  {area.toLocaleString('es-AR')} m²
                </span>
              )}
            </div>
          </div>

          {/* Right — Status + Price + CTA */}
          <div className="flex flex-col items-start md:items-end gap-0 flex-shrink-0">
            {(statusLabel || operationLabel) && (
              <p className="text-[#b8b8b8] text-[16px] leading-[19px] mt-[15px]">
                {operationLabel && <span className="text-white">{operationLabel}</span>}
                {operationLabel && statusLabel && <span className="text-[#b8b8b8]"> &middot; </span>}
                {statusLabel && <span className="text-white">{statusLabel}</span>}
              </p>
            )}

            <p className="text-white font-normal leading-none mb-[20px]"
               style={{ fontFamily: 'var(--font-heading)', fontSize: '40px' }}
               itemProp="offers" itemScope itemType="https://schema.org/Offer">
              <meta itemProp="priceCurrency" content="USD" />
              <span itemProp="price" content={numericPrice}>
                {numericPrice
                  ? `$${numericPrice.toLocaleString('es-AR')}`
                  : 'Consultar'}
              </span>
            </p>

            <button
              onClick={() => {
                document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full bg-[#652660] hover:bg-[#652660] text-white text-[14px] font-normal uppercase tracking-wider px-7 py-4 rounded-[4px] transition-colors"
              style={{
                backgroundImage: 'linear-gradient(135deg, #652660, #652660, #3c313e, #3c313e)',
                backgroundSize: '400% 100%',
              }}
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </Gallery>
  );
};

export default PropertyGallery;
