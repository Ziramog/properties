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
    { label: 'Precio', value: numericPrice ? `$${numericPrice.toLocaleString('es-AR')}` : 'Consultar' },
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
          <div className="py-[30px] md:py-[30px]">
            <div className="pb-[30px] px-6 md:px-[25px] lg:px-[100px] xl:px-[190px]">
              <SectionTitle>Características</SectionTitle>
            </div>
            <div className="flex flex-wrap">
              {featureItems.map(({ label, value }, i) => (
                <div
                  key={label}
                  className="flex-1 min-w-[50%] md:min-w-0 flex justify-center py-0 px-[20px] md:px-[40px] border-r border-[#e9e9e9] border-b md:border-b-0 border-[#e9e9e9] pb-[25px] md:pb-0 mb-[25px] md:mb-0"
                  style={{ borderRight: i === featureItems.length - 1 ? 'none' : undefined }}
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
          </div>
        </div>
      )}

      {/* 2-col: Description (70%) + Sidebar (30%) — Senada .info-section */}
      <div className="flex flex-col md:flex-row gap-[20px] mb-8">
        {/* Left: Description — 70% */}
        <div className="w-full md:w-[70%]">
          {property.description && (
            <div className="bg-white rounded-none md:rounded-[30px] overflow-hidden h-full flex flex-col">
              <div className="px-6 md:px-[25px] lg:px-[100px] xl:px-[190px] pt-10 md:pt-[40px] pb-0">
                <SectionTitle>Descripción</SectionTitle>
                <ReadMoreText text={property.description} maxChars={450} />
                {property.seller_info?.name && (
                  <p className="mt-6 text-[12px] italic text-[#999]">
                    Publicado por {property.seller_info.name}
                  </p>
                )}
                {/* Share */}
                <div className="mt-auto pt-8 pb-6">
                  <div className="flex justify-center items-center gap-0 md:gap-5">
                    <span className="text-[16px] uppercase text-[#999] pr-[30px]">Compartir</span>
                    <ShareButtons property={property} inline />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Sidebar — 30% */}
        <div className="w-full md:w-[30%]">
          {/* Additional Info */}
          {(property.square_feet || property.operation || coveredArea || property.garage != null || property.titles_status) && (
            <div className="bg-white rounded-none md:rounded-[30px] overflow-hidden mb-5">
              <div className="px-6 md:px-[25px] lg:px-[50px] pt-10 md:pt-[40px] pb-10 md:pb-[40px]">
                <SectionTitle>Información Adicional</SectionTitle>
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
              </div>
            </div>
          )}

          {/* Community Info */}
          {(property.location?.city || property.location?.state) && (
            <div className="bg-white rounded-none md:rounded-[30px] overflow-hidden mb-5">
              <div className="px-6 md:px-[25px] lg:px-[50px] pt-10 md:pt-[40px] pb-10 md:pb-[40px]">
                <SectionTitle>Información de la Zona</SectionTitle>
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
              </div>
            </div>
          )}

        </div>
      </div>

    </main>
  );
};

export default PropertyDetails;
