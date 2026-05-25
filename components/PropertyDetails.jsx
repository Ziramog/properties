'use client';
import { useState } from 'react';
import CheckIcon from './icons/CheckIcon';
import ShareButtons from './ShareButtons';
import ScrollReveal from '@/components/shared/ScrollReveal';

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
        className="block mt-3 text-[13px] font-bold uppercase tracking-wider text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-colors"
      >
        {expanded ? 'Leer menos' : 'Leer más'}
      </button>
    </div>
  );
};

const SectionTitle = ({ children }) => (
  <div className="pb-[30px] flex items-center justify-between">
    <h2
      className="text-[28px] font-semibold text-[#0F172A] flex items-center"
      style={{ fontFamily: 'var(--font-heading)' }}
    >
      {children}
      <span
        aria-hidden="true"
        className="inline-block ml-5"
        style={{ width: '70px', height: '3px', background: 'var(--color-brand)' }}
      />
    </h2>
  </div>
);

const PropertyDetails = ({ property }) => {
  const coveredArea = property.covered_area;
  const operationLabel =
    property.operation === 'venta' ? 'Venta' :
    property.operation === 'alquiler' ? 'Alquiler' :
    property.operation === 'compra' ? 'Compra' : '';

  const rawPrice = property.price;
  const numericPrice = rawPrice ? parseFloat(String(rawPrice).replace(/[^0-9.-]/g, '')) : null;

  const featureItems = [
    { label: 'Precio', value: numericPrice ? `U$D ${numericPrice.toLocaleString('es-AR')}` : 'Consultar' },
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
      {/* Features — Senada .listing-feature */}
      {featureItems.length > 0 && (
        <div className="bg-white rounded-none md:rounded-[30px] overflow-hidden mb-8 md:mb-8">
          <div className="max-w-[1430px] mx-auto px-[15px] py-[30px] md:py-[30px]">
            <div className="pb-[30px] js-animate">
              <SectionTitle>Características</SectionTitle>
            </div>
            <ScrollReveal>
              <div className="flex flex-wrap">
                {featureItems.map(({ label, value }, i) => (
                  <div
                    key={label}
                    className={`flex-1 min-w-[50%] md:min-w-0 flex justify-center py-[30px] px-[20px] md:px-[40px] border-r border-b md:border-b-0 border-[#e9e9e9] ${i === featureItems.length - 1 ? 'border-r-0' : ''} md:[&:nth-last-child(-n+2)]:border-b-0`}
                  >
                    <div>
                      <h5 className="text-[22px] font-semibold text-[#0F172A] mb-[5px]"
                          style={{ fontFamily: 'var(--font-heading)' }}>
                        {typeof value === 'number' ? value.toLocaleString('es-AR') : value}
                      </h5>
                      <p className="text-[16px] leading-[24px] text-[#666]">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      )}

      {/* 2-col: Description (70%) + Sidebar (30%) — Senada .info-section */}
      <div className="flex flex-col md:flex-row gap-[20px] mb-8">
        {/* Left: Description — 70% */}
        <div className="w-full md:w-[70%]">
          {property.description && (
            <div className="bg-white rounded-none md:rounded-[30px] overflow-hidden h-full">
              <div className="px-[15px] md:pr-[130px] md:pl-[190px] pt-[40px] pb-0 flex flex-col h-full">
                <div className="js-animate">
                  <SectionTitle>Descripción</SectionTitle>
                </div>
                <ScrollReveal>
                  <ReadMoreText text={property.description} maxChars={450} />
                </ScrollReveal>
                {property.seller_info?.name && (
                  <p className="mt-6 text-[12px] italic text-[#999]">
                    Publicado por {property.seller_info.name}
                  </p>
                )}
                {/* Share */}
                <div className="share-wrapper border-t border-[#e9e9e9] pt-8 pb-6 mt-auto">
                  <span className="text-[16px] uppercase text-[#999] block text-center mb-4">Compartir</span>
                  <ShareButtons property={property} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Sidebar — 30% */}
        <div className="w-full md:w-[30%] flex flex-col gap-[20px]">
          {/* Additional Info */}
          {(property.square_feet || property.operation || coveredArea || property.garage != null || property.titles_status) && (
            <div className="bg-white rounded-none md:rounded-[30px] overflow-hidden">
              <div className="px-[15px] md:pr-[170px] md:pl-[50px] pt-[40px] pb-[40px]">
                <div className="js-animate">
                  <SectionTitle>Información Adicional</SectionTitle>
                </div>
                <ScrollReveal>
                  <ul>
                  {property.square_feet && (
                    <li className="flex justify-between items-center px-5 py-[10px] mb-[5px] text-[16px] gap-[10px] rounded-[6px] odd:bg-[#f6f6f6]">
                      <span className="text-[14px] text-[#888]">Sup. Cubierta</span>
                      <span className="text-[14px] font-semibold text-[#0F172A]">{property.square_feet.toLocaleString('es-AR')} m²</span>
                    </li>
                  )}
                  {coveredArea && (
                    <li className="flex justify-between items-center px-5 py-[10px] mb-[5px] text-[16px] gap-[10px] rounded-[6px] odd:bg-[#f6f6f6]">
                      <span className="text-[14px] text-[#888]">Sup. Total</span>
                      <span className="text-[14px] font-semibold text-[#0F172A]">{coveredArea.toLocaleString('es-AR')} m²</span>
                    </li>
                  )}
                  {property.garage != null && (
                    <li className="flex justify-between items-center px-5 py-[10px] mb-[5px] text-[16px] gap-[10px] rounded-[6px] odd:bg-[#f6f6f6]">
                      <span className="text-[14px] text-[#888]">Cochera</span>
                      <span className="text-[14px] font-semibold text-[#0F172A]">{property.garage} {property.garage === 1 ? 'lugar' : 'lugares'}</span>
                    </li>
                  )}
                  {property.operation && (
                    <li className="flex justify-between items-center px-5 py-[10px] mb-[5px] text-[16px] gap-[10px] rounded-[6px] odd:bg-[#f6f6f6]">
                      <span className="text-[14px] text-[#888]">Operación</span>
                      <span className="text-[14px] font-semibold text-[#0F172A]">{operationLabel}</span>
                    </li>
                  )}
                  {property.titles_status && (
                    <li className="flex justify-between items-center px-5 py-[10px] mb-[5px] text-[16px] gap-[10px] rounded-[6px] odd:bg-[#f6f6f6]">
                      <span className="text-[14px] text-[#888]">Estado de Títulos</span>
                      <span className="text-[14px] font-semibold text-[#0F172A]">{property.titles_status}</span>
                    </li>
                  )}
                  </ul>
                </ScrollReveal>
              </div>
            </div>
          )}

          {/* Community Info */}
          {(property.location?.city || property.location?.state) && (
            <div className="bg-white rounded-none md:rounded-[30px] overflow-hidden">
              <div className="px-[15px] md:pr-[170px] md:pl-[50px] pt-[40px] pb-[40px]">
                <div className="js-animate">
                  <SectionTitle>Información de la Zona</SectionTitle>
                </div>
                <ScrollReveal>
                  <ol className="list-none">
                  {property.location?.state && (
                    <li className="flex justify-between items-center px-5 py-[10px] mb-[5px] text-[16px] gap-[10px] rounded-[6px] odd:bg-[#f6f6f6]">
                      <span className="text-[14px] text-[#888]">Provincia</span>
                      <span className="text-[14px] font-semibold text-[#0F172A]">{property.location.state}</span>
                    </li>
                  )}
                  {property.location?.city && (
                    <li className="flex justify-between items-center px-5 py-[10px] mb-[5px] text-[16px] gap-[10px] rounded-[6px] odd:bg-[#f6f6f6]">
                      <span className="text-[14px] text-[#888]">Ciudad</span>
                      <span className="text-[14px] font-semibold text-[#0F172A]">{property.location.city}</span>
                    </li>
                  )}
                  {property.location?.street && (
                    <li className="flex justify-between items-center px-5 py-[10px] mb-[5px] text-[16px] gap-[10px] rounded-[6px] odd:bg-[#f6f6f6]">
                      <span className="text-[14px] text-[#888]">Dirección</span>
                      <span className="text-[14px] font-semibold text-[#0F172A] text-right max-w-[180px]">{property.location.street}</span>
                    </li>
                  )}
                  </ol>
                </ScrollReveal>
              </div>
            </div>
          )}
        </div>
      </div>

    </main>
  );
};

export default PropertyDetails;
