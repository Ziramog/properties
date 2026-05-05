'use client';
import { useState } from 'react';
import CheckIcon from './icons/CheckIcon';
import ShareButtons from './ShareButtons';

const ReadMoreText = ({ text, maxChars = 400 }) => {
  const [expanded, setExpanded] = useState(false);
  if (!text || text.length <= maxChars) {
    return <div className="text-[#555] leading-[1.8] whitespace-pre-line text-[15px]">{text}</div>;
  }
  return (
    <div className="text-[#555] leading-[1.8] whitespace-pre-line text-[15px]">
      {expanded ? text : text.slice(0, maxChars).trimEnd() + '…'}
      <button
        onClick={() => setExpanded(!expanded)}
        className="block mt-3 text-[13px] font-bold uppercase tracking-wider text-[#E94560] hover:text-[#d13a54] transition-colors"
      >
        {expanded ? 'Read less' : 'Read more'}
      </button>
    </div>
  );
};

const PropertyDetails = ({ property }) => {
  const coveredArea = property.covered_area;
  const operationLabel =
    property.operation === 'venta' ? 'Venta' :
    property.operation === 'alquiler' ? 'Alquiler' :
    property.operation === 'compra' ? 'Compra' : '';

  // Features items matching reference pattern: large value + small label
  const featureItems = [
    { label: 'Price', value: property.price ? `$${Number(property.price).toLocaleString('es-AR')}` : 'Consultar' },
    { label: 'Área Total', value: coveredArea ? `${coveredArea.toLocaleString('es-AR')} m²` : null },
    { label: 'Dormitorios', value: property.beds },
    { label: 'Baños', value: property.baths },
    { label: 'Cochera', value: property.garage != null ? property.garage : null },
    { label: 'Tipo', value: property.type },
    { label: 'Operación', value: operationLabel || null },
    { label: 'Títulos', value: property.titles_status || null },
  ].filter(f => f.value != null);

  return (
    <main className="space-y-0">
      {/* Features grid — Senada-style white card */}
      {featureItems.length > 0 && (
        <div className="bg-white rounded-none md:rounded-[30px] overflow-hidden">
          <div className="px-6 py-6 md:p-8">
            <div className="pb-6">
              <h2
                className="text-[22px] md:text-[26px] font-semibold text-[#0F172A]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Features
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8">
              {featureItems.map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p
                    className="text-[18px] md:text-[22px] font-bold text-[#0F172A] mb-0.5"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {typeof value === 'number' ? value.toLocaleString('es-AR') : value}
                  </p>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#999]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2-col layout: Description (left) + side cards (right) */}
      <div className="flex flex-col md:flex-row gap-0 md:gap-8 mt-0 md:mt-8">
        {/* Left: Description */}
        <div className="flex-1">
          {property.description && (
            <div className="bg-white rounded-none md:rounded-[30px] overflow-hidden">
              <div className="px-6 py-6 md:p-8">
                <div className="pb-6">
                  <h2
                    className="text-[22px] md:text-[26px] font-semibold text-[#0F172A]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Description
                  </h2>
                </div>

                <ReadMoreText text={property.description} maxChars={450} />

                {/* Disclaimer */}
                {property.seller_info?.name && (
                  <p className="mt-6 text-[12px] italic text-[#999]">
                    Publicado por {property.seller_info.name}
                  </p>
                )}

                {/* Share — inline inside description card */}
                <div className="mt-7 pt-5 border-t border-[#eee]">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-0">
                    <span className="text-[12px] font-bold uppercase tracking-wider text-[#999] md:mr-5">Share</span>
                    <ShareButtons property={property} inline />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Additional Info + Community Info */}
        <div className="w-full md:w-[380px] flex-shrink-0">
          {/* Additional Info card */}
          {(property.square_feet || property.operation || coveredArea || property.garage != null || property.titles_status) && (
            <div className="bg-white rounded-none md:rounded-[30px] overflow-hidden">
              <div className="px-6 py-6 md:p-8">
                <div className="pb-6">
                  <h2
                    className="text-[22px] md:text-[26px] font-semibold text-[#0F172A]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Additional Info
                  </h2>
                </div>
                <ul className="divide-y divide-[#eee]">
                  {property.square_feet && (
                    <li className="flex justify-between py-3 text-[14px]">
                      <span className="text-[#888] font-medium">Sup. Cubierta</span>
                      <span className="text-[#0F172A] font-medium">{property.square_feet.toLocaleString('es-AR')} m²</span>
                    </li>
                  )}
                  {coveredArea && (
                    <li className="flex justify-between py-3 text-[14px]">
                      <span className="text-[#888] font-medium">Sup. Total</span>
                      <span className="text-[#0F172A] font-medium">{coveredArea.toLocaleString('es-AR')} m²</span>
                    </li>
                  )}
                  {property.garage != null && (
                    <li className="flex justify-between py-3 text-[14px]">
                      <span className="text-[#888] font-medium">Cochera</span>
                      <span className="text-[#0F172A] font-medium">{property.garage} {property.garage === 1 ? 'lugar' : 'lugares'}</span>
                    </li>
                  )}
                  {property.operation && (
                    <li className="flex justify-between py-3 text-[14px]">
                      <span className="text-[#888] font-medium">Operación</span>
                      <span className="text-[#0F172A] font-medium">{operationLabel}</span>
                    </li>
                  )}
                  {property.titles_status && (
                    <li className="flex justify-between py-3 text-[14px]">
                      <span className="text-[#888] font-medium">Estado de Títulos</span>
                      <span className="text-[#0F172A] font-medium">{property.titles_status}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Community Info card (Location) */}
          {(property.location?.city || property.location?.state) && (
            <div className="bg-white rounded-none md:rounded-[30px] overflow-hidden mt-0 md:mt-8">
              <div className="px-6 py-6 md:p-8">
                <div className="pb-6">
                  <h2
                    className="text-[22px] md:text-[26px] font-semibold text-[#0F172A]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Community Info
                  </h2>
                </div>
                <div itemScope itemType="https://schema.org/PostalAddress">
                  <ol className="divide-y divide-[#eee] list-none">
                    {property.location?.state && (
                      <li className="flex justify-between py-3 text-[14px]">
                        <span className="text-[#888] font-medium">Provincia</span>
                        <span className="text-[#0F172A] font-medium" itemProp="addressRegion">{property.location.state}</span>
                      </li>
                    )}
                    {property.location?.city && (
                      <li className="flex justify-between py-3 text-[14px]">
                        <span className="text-[#888] font-medium">Ciudad</span>
                        <span className="text-[#0F172A] font-medium" itemProp="addressLocality">{property.location.city}</span>
                      </li>
                    )}
                    {property.location?.street && (
                      <li className="flex justify-between py-3 text-[14px]">
                        <span className="text-[#888] font-medium">Dirección</span>
                        <span className="text-[#0F172A] font-medium text-right max-w-[180px]" itemProp="streetAddress">{property.location.street}</span>
                      </li>
                    )}
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Interior card */}
          {property.interior && (property.interior.aberturas || property.interior.pisos || property.interior.calefaccion) && (
            <div className="bg-white rounded-none md:rounded-[30px] overflow-hidden mt-0 md:mt-8">
              <div className="px-6 py-6 md:p-8">
                <div className="pb-6">
                  <h2
                    className="text-[22px] md:text-[26px] font-semibold text-[#0F172A]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Interior
                  </h2>
                </div>
                <ul className="space-y-2.5">
                  {property.interior.aberturas && (
                    <li className="flex items-center gap-2.5">
                      <CheckIcon />
                      <span className="text-[#555] text-[14px]">
                        <strong className="text-[#0F172A]">Aberturas:</strong> {property.interior.aberturas}
                      </span>
                    </li>
                  )}
                  {property.interior.pisos && (
                    <li className="flex items-center gap-2.5">
                      <CheckIcon />
                      <span className="text-[#555] text-[14px]">
                        <strong className="text-[#0F172A]">Pisos:</strong> {property.interior.pisos}
                      </span>
                    </li>
                  )}
                  {property.interior.calefaccion && (
                    <li className="flex items-center gap-2.5">
                      <CheckIcon />
                      <span className="text-[#555] text-[14px]">
                        <strong className="text-[#0F172A]">Calefacción:</strong> {property.interior.calefaccion}
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Exterior card */}
      {property.exterior && property.exterior.techos && (
        <div className="bg-white rounded-none md:rounded-[30px] overflow-hidden mt-0 md:mt-8">
          <div className="px-6 py-6 md:p-8">
            <div className="pb-6">
              <h2
                className="text-[22px] md:text-[26px] font-semibold text-[#0F172A]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Exterior
              </h2>
            </div>
            <ul className="space-y-2.5">
              {property.exterior.techos && (
                <li className="flex items-center gap-2.5">
                  <CheckIcon />
                  <span className="text-[#555] text-[14px]">
                    <strong className="text-[#0F172A]">Techos:</strong> {property.exterior.techos}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Amenities card */}
      {property.amenities && property.amenities.length > 0 && (
        <div className="bg-white rounded-none md:rounded-[30px] overflow-hidden mt-0 md:mt-8">
          <div className="px-6 py-6 md:p-8">
            <div className="pb-6">
              <h2
                className="text-[22px] md:text-[26px] font-semibold text-[#0F172A]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Comodidades
              </h2>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2.5">
              {property.amenities.map((amenity, index) => (
                <li key={index} className="flex items-center gap-2.5">
                  <CheckIcon />
                  <span className="text-[#555] text-[14px]">{amenity}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Services card */}
      {property.services && property.services.length > 0 && (
        <div className="bg-white rounded-none md:rounded-[30px] overflow-hidden mt-0 md:mt-8">
          <div className="px-6 py-6 md:p-8">
            <div className="pb-6">
              <h2
                className="text-[22px] md:text-[26px] font-semibold text-[#0F172A]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Servicios
              </h2>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2.5">
              {property.services.map((service, index) => (
                <li key={index} className="flex items-center gap-2.5">
                  <CheckIcon />
                  <span className="text-[#555] text-[14px]">{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
};

export default PropertyDetails;
