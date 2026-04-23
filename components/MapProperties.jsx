'use client';
import { useState, useRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import PropertyCard from './PropertyCard';
import FilterBar from './search/FilterBar';
import ScrollReveal from './shared/ScrollReveal';
import { filterProperties } from '@/utils/filterProperties';
import { useFilters } from '@/hooks/useFilters';

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-xl">
      <div className="flex flex-col items-center gap-2 text-gray-400">
        <div className="w-10 h-10 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
        <span className="text-sm">Cargando mapa...</span>
      </div>
    </div>
  ),
});

const MapProperties = ({ initialProperties = [] }) => {
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const { filters, updateFilter, resetFilters, activeCount, hasActiveFilters } = useFilters();
  const mapRef = useRef(null);
  const cardRefs = useRef({});

  // Filter properties client-side
  const filteredProperties = useMemo(
    () => filterProperties(initialProperties, filters),
    [initialProperties, filters]
  );

  // Pin click → scroll to card
  const handleMarkerClick = useCallback((propertyId) => {
    setSelectedPropertyId(propertyId);
    const el = cardRefs.current[propertyId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // Card hover → highlight pin
  const handleCardHover = useCallback((propertyId) => {
    setSelectedPropertyId(propertyId);
  }, []);

  // Card click → fly map to property
  const handleCardClick = useCallback(
    (propertyId) => {
      const prop = initialProperties.find((p) => p._id === propertyId);
      if (prop && mapRef.current) {
        const lat = prop.location?.lat;
        const lng = prop.location?.lng;
        if (lat && lng) {
          mapRef.current.flyTo([lat, lng], 15);
        }
      }
    },
    [initialProperties]
  );

  return (
    <section className="bg-surface py-12 md:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-8">
            <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">Mapa interactivo</p>
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-heading mb-4 tracking-tight">
              Explorá en el mapa
            </h2>

            {/* SaaS-style filter bar */}
            <FilterBar
              properties={initialProperties}
              filters={filters}
              updateFilter={updateFilter}
              resetFilters={resetFilters}
              activeCount={activeCount}
              hasActiveFilters={hasActiveFilters}
              filteredCount={filteredProperties.length}
            />
          </div>
        </ScrollReveal>

        {/* Mobile map toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMap(!showMap)}
            className="w-full py-3.5 bg-heading text-white rounded-xl font-bold flex items-center justify-center gap-2.5 hover:bg-heading/90 transition-all duration-200 shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            {showMap ? 'Ocultar Mapa' : 'Ver Mapa'}
          </button>
        </div>

        {/* Split view: Map + Cards */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Map */}
          <div
            className={`${
              showMap ? 'block' : 'hidden'
            } lg:block lg:w-[55%] h-[500px] lg:h-[700px] bg-gray-100 rounded-2xl overflow-hidden sticky top-24 shadow-card border border-gray-200/50`}
          >
            <MapView
              ref={mapRef}
              properties={filteredProperties}
              onMarkerClick={handleMarkerClick}
              selectedId={selectedPropertyId}
            />
          </div>

          {/* Property cards */}
          <div className="lg:w-[45%]">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-navy">{filteredProperties.length}</span>{' '}
                propiedades
              </p>
              <select
                value={filters.sort || 'newest'}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              >
                <option value="newest">Más recientes</option>
                <option value="price_asc">Menor precio</option>
                <option value="price_desc">Mayor precio</option>
              </select>
            </div>

            <div className="space-y-5 max-h-[700px] overflow-y-auto pr-1 scrollbar-hide">
              {filteredProperties.length === 0 ? (
                <div className="text-center py-16">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-navy mb-2">
                    No encontramos propiedades
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Probá ampliando tus filtros o buscando en otra zona
                  </p>
                  <button
                    onClick={resetFilters}
                    className="btn-primary text-sm"
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                filteredProperties.map((property) => (
                  <div
                    key={property._id}
                    ref={(el) => {
                      cardRefs.current[property._id] = el;
                    }}
                  >
                    <PropertyCard
                      property={property}
                      isSelected={selectedPropertyId === property._id}
                      onMouseEnter={() => handleCardHover(property._id)}
                      onMouseLeave={() => setSelectedPropertyId(null)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapProperties;
