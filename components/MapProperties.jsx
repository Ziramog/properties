'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import ScrollReveal from './shared/ScrollReveal';
import { filterProperties, isGranInversion } from '@/utils/filterProperties';
import { useFilters } from '@/hooks/useFilters';
import { generateWhatsAppLink } from '@/utils/whatsapp';
import { getPriceDisplay } from '@/utils/propertyDisplay';
import { FaBed, FaBath, FaWhatsapp, FaExpand, FaTimes } from 'react-icons/fa';
import { TrendingUp, MapPin } from 'lucide-react';

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-[#E8E6E0]">
      <div className="flex flex-col items-center gap-3 text-[var(--color-ink-tertiary)]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 opacity-50">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
          <line x1="8" y1="2" x2="8" y2="18"/>
          <line x1="16" y1="6" x2="16" y2="22"/>
        </svg>
        <span className="text-sm font-medium uppercase tracking-widest">Cargando mapa...</span>
      </div>
    </div>
  ),
});

const PROPERTY_TYPES = ['Casa', 'Departamento', 'Terreno', 'Campo', 'Inmueble Comercial'];
const PRICE_PRESETS = [
  { label: 'Todos', min: '', max: '' },
  { label: 'Hasta 150k', min: '', max: '150000' },
  { label: '150k-300k', min: '150000', max: '300000' },
  { label: '+300k', min: '300000', max: '' },
];

const EmptyState = ({ onClose }) => (
  <div className="flex flex-col items-center justify-center h-full text-center px-8">
    <div className="w-16 h-16 rounded-full bg-[var(--color-surface-soft)] flex items-center justify-center mb-4">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-[var(--color-ink-tertiary)]">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
        <line x1="8" y1="2" x2="8" y2="18"/>
        <line x1="16" y1="6" x2="16" y2="22"/>
      </svg>
    </div>
    <p className="text-[15px] font-semibold text-[var(--color-ink)] mb-2">Seleccioná una propiedad</p>
    <p className="text-[13px] text-[var(--color-ink-tertiary)] leading-relaxed">
      Hacé click en un pin del mapa para ver todos los detalles
    </p>
  </div>
);

const PropertyDetail = ({ property, onClose }) => {
  if (!property) return <EmptyState onClose={onClose} />;

  const price = getPriceDisplay(property);
  const image = property.images?.[0] || '/images/property-placeholder.jpg';

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
      {/* Full-width image */}
      <div className="relative h-[220px] bg-[var(--color-surface-soft)] flex-shrink-0 overflow-hidden">
        <img
          src={image}
          alt={property.name}
          className="w-full h-full object-cover"
        />
        {property.status && (
          <div className="absolute top-3 left-3">
            <span className={`text-[11px] font-bold px-[10px] py-1 rounded-[6px] uppercase tracking-wider ${
              property.status === 'available' ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]' :
              property.status === 'rented' ? 'bg-[var(--color-warn-bg)] text-[var(--color-warn)]' :
              'bg-white text-[var(--color-brand)] border border-[var(--color-brand)]'
            }`}>
              {property.status === 'available' ? 'Disponible' : property.status === 'rented' ? 'Arrendado' : 'A consultar'}
            </span>
          </div>
        )}
        <a
          href={`/properties/${property._id}`}
          className="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          <FaExpand className="w-4 h-4 text-white" />
        </a>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-4 flex flex-col gap-3">
        <div>
          <p className="text-[24px] font-bold text-[var(--color-ink)] leading-tight">
            {price}
          </p>
          <p className="text-[14px] text-[var(--color-ink-secondary)] mt-0.5">
            {property.name}
          </p>
        </div>

        <div className="flex items-center gap-2 text-[13px] text-[var(--color-ink-tertiary)]">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          {property.location?.city}
        </div>

        <div className="flex items-center gap-4 text-[13px] font-medium text-[var(--color-ink-secondary)] border-t border-b border-[var(--color-border)] py-2.5">
          {property.beds != null && (
            <span className="flex items-center gap-1.5">
              <FaBed className="w-4 h-4 text-[var(--color-ink-tertiary)]" />
              {property.beds} Dorm.
            </span>
          )}
          {property.baths != null && (
            <span className="flex items-center gap-1.5">
              <FaBath className="w-4 h-4 text-[var(--color-ink-tertiary)]" />
              {property.baths} Baños
            </span>
          )}
          {property.area && (
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[var(--color-ink-tertiary)]">
                <polyline points="15 3 21 3 21 9"/>
                <polyline points="9 21 3 21 3 15"/>
                <line x1="21" y1="3" x2="14" y2="10"/>
                <line x1="3" y1="21" x2="10" y2="14"/>
              </svg>
              {property.area} m²
            </span>
          )}
        </div>

        {property.description && (
          <p className="text-[13px] text-[var(--color-ink-secondary)] leading-relaxed line-clamp-3">
            {property.description}
          </p>
        )}

        <div className="flex-1" />

        <div className="flex flex-col gap-2 pt-2 border-t border-[var(--color-border)]">
          <a
            href={generateWhatsAppLink({ property })}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full h-[44px] bg-whatsapp hover:bg-whatsapp-hover text-white rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-md"
          >
            <FaWhatsapp className="w-5 h-5" />
            WhatsApp
          </a>
          <a
            href={`/properties/${property._id}`}
            className="flex items-center justify-center gap-2 w-full h-[44px] bg-[var(--color-ink)] hover:bg-[var(--color-ink-secondary)] text-white rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-200"
          >
            Ver propiedad
          </a>
        </div>
      </div>
    </div>
  );
};

const MapProperties = ({ initialProperties = [] }) => {
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [activeType, setActiveType] = useState('Casa');
  const [activePrice, setActivePrice] = useState('Todos');
  const [showGranInversion, setShowGranInversion] = useState(false);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const { filters } = useFilters();
  const mapRef = useRef(null);

  const filteredProperties = useMemo(() => {
    let result = filterProperties(initialProperties, { ...filters, type: activeType });
    if (showGranInversion) {
      result = result.filter(isGranInversion);
    }
    return result;
  }, [initialProperties, filters, activeType, showGranInversion]);

  const selectedProperty = useMemo(
    () => initialProperties.find((p) => p._id === selectedPropertyId) || null,
    [initialProperties, selectedPropertyId]
  );

  const handleMarkerClick = useCallback((propertyId) => {
    setSelectedPropertyId(propertyId);
    setShowMobileDetail(true);
    const prop = initialProperties.find((p) => p._id === propertyId);
    if (prop && mapRef.current) {
      const lat = prop.location?.lat;
      const lng = prop.location?.lng;
      if (lat && lng) mapRef.current.flyTo([lat, lng], 15);
    }
  }, [initialProperties]);

  const handleCloseMobileDetail = () => {
    setShowMobileDetail(false);
    setSelectedPropertyId(null);
  };

  return (
    <section className="bg-[var(--color-surface-soft)] pb-16 md:pb-20 px-4 md:px-6 mb-0 md:mb-0 relative overflow-hidden isolate z-[1]" id="mapa">
      <div className="max-w-7xl mx-auto">
        {/* Section Header — compact on mobile */}
        <div className="mb-4 md:mb-6">
          <ScrollReveal>
            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--color-brand)] block mb-1 md:mb-2">
              MAPA INTERACTIVO
            </span>
          </ScrollReveal>
          <ScrollReveal delay={50}>
            <h2 className="text-3xl md:text-[52px] font-bold text-[var(--color-ink)] leading-[1.1] tracking-[-0.01em] mb-3 md:mb-6">
              Explorá en el mapa
            </h2>
          </ScrollReveal>

          {/* Filter pills — scrollable horizontal on mobile */}
          <ScrollReveal delay={100}>
            <div className="flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-2.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0 -mx-1 px-1 md:mx-0 md:px-0">
              {PROPERTY_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`h-8 md:h-9 px-3 md:px-5 bg-white border text-[12px] md:text-[13px] font-medium rounded-full transition-all duration-150 whitespace-nowrap ${
                    activeType === type
                      ? 'bg-[var(--color-brand)] border-[var(--color-brand)] text-white'
                      : 'border-[var(--color-border)] text-[var(--color-ink-secondary)] hover:border-[var(--color-border-strong)]'
                  }`}
                >
                  {type}
                </button>
              ))}

              <div className="w-px h-5 bg-[var(--color-border)] flex-shrink-0 mx-1 hidden md:block" />

              <button
                onClick={() => {
                  setShowGranInversion((prev) => !prev);
                  if (!showGranInversion) setActiveType('Todos');
                }}
                className={`h-8 md:h-9 px-3 md:px-5 bg-white border text-[12px] md:text-[13px] font-medium rounded-full transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap ${
                  showGranInversion
                    ? 'bg-[var(--color-brand)] border-[var(--color-brand)] text-white'
                    : 'border-[var(--color-border)] text-[var(--color-ink-secondary)] hover:border-[var(--color-border-strong)]'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                +300k
              </button>

              <div className="w-px h-5 bg-[var(--color-border)] flex-shrink-0 mx-1 hidden md:block" />

              <div className="flex items-center bg-black/[0.04] rounded-full px-1.5 py-1 gap-1">
                {PRICE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setActivePrice(preset.label)}
                    className={`h-[26px] md:h-[30px] px-2 md:px-3 text-[11px] md:text-[13px] font-medium rounded-full transition-all duration-150 ${
                      activePrice === preset.label
                        ? 'bg-[var(--color-brand)] text-white'
                        : 'text-[var(--color-ink-secondary)] hover:bg-black/[0.06]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Desktop: Map + Sidebar | Mobile: Full-screen Map + Bottom Sheet */}
        <ScrollReveal delay={150}>
          <div className="hidden lg:block">
            <div className="grid grid-cols-12 gap-6 h-[560px] overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-[var(--shadow-card)]">
              <div className="col-span-8 relative bg-[#E8E6E0] overflow-hidden">
                <MapView
                  ref={mapRef}
                  properties={filteredProperties}
                  onMarkerClick={handleMarkerClick}
                  selectedId={selectedPropertyId}
                />
              </div>
              <div className="col-span-4 bg-white border-l border-[var(--color-border)] flex flex-col overflow-hidden">
                <PropertyDetail property={selectedProperty} />
              </div>
            </div>
          </div>

          {/* Mobile: full-screen map + bottom sheet */}
          <div className="lg:hidden relative" style={{ minHeight: '65vh' }}>
            <div className="h-[65vh] rounded-2xl border border-[var(--color-border)] shadow-[var(--shadow-card)] relative overflow-hidden" style={{ contain: 'layout paint' }}>
              <MapView
                ref={mapRef}
                properties={filteredProperties}
                onMarkerClick={handleMarkerClick}
                selectedId={selectedPropertyId}
              />
            </div>

            {/* Bottom sheet */}
            <div
              className={`absolute inset-x-0 bottom-0 z-10 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 overflow-hidden ${
                showMobileDetail && selectedProperty ? 'translate-y-0' : 'translate-y-full'
              }`}
              style={{ height: '55vh', maxHeight: '60vh', zIndex: 10 }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2 sticky top-0 bg-white z-10">
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>
              {/* Close button */}
              <button
                onClick={handleCloseMobileDetail}
                className="absolute top-4 right-4 w-8 h-8 bg-black/10 backdrop-blur-sm rounded-full flex items-center justify-center z-20"
              >
                <FaTimes className="w-4 h-4 text-[var(--color-ink)]" />
              </button>
              <div className="overflow-y-auto" style={{ height: 'calc(100% - 28px)' }}>
                <PropertyDetail property={selectedProperty} />
              </div>
            </div>

            {/* Backdrop */}
            {showMobileDetail && (
              <div
                className="absolute inset-0 bg-black/30 z-[5] lg:hidden"
                onClick={handleCloseMobileDetail}
              />
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default MapProperties;
