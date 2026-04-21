'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import PropertyCard from './PropertyCard';
import PropertyFilters from './PropertyFilters';

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <div className="animate-pulse text-gray-500">Cargando mapa...</div>
    </div>
  ),
});

const MapProperties = ({ initialProperties = [] }) => {
  const [properties, setProperties] = useState(initialProperties);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [showMap, setShowMap] = useState(false);

  // Filter properties based on search params
  useEffect(() => {
    setProperties(initialProperties);
  }, [initialProperties]);

  const handlePropertySelect = (propertyId) => {
    setSelectedPropertyId(propertyId);
    // Scroll to property card
    const element = document.getElementById(`property-${propertyId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCardHover = (propertyId) => {
    setSelectedPropertyId(propertyId);
  };

  return (
    <section className="bg-[#F8F9FA] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Filters */}
        <div className="mb-6">
          <PropertyFilters variant="compact" />
        </div>

        {/* Map Toggle Button (Mobile) */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowMap(!showMap)}
            className="w-full py-3 bg-[#1A1A2E] text-white rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            {showMap ? 'Ocultar Mapa' : 'Ver Mapa'}
          </button>
        </div>

        {/* Split View: Map + Cards */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Map - Hidden on mobile unless toggled */}
          <div className={`${showMap ? 'block' : 'hidden'} md:block md:w-[60%] h-[500px] md:h-[600px] bg-gray-200 rounded-xl overflow-hidden`}>
            <MapView
              properties={properties}
              onPropertySelect={handlePropertySelect}
              selectedPropertyId={selectedPropertyId}
            />
          </div>

          {/* Property Cards */}
          <div className="md:w-[40%]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#1A1A2E]">
                {properties.length} propiedades encontradas
              </h2>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
              {properties.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No se encontraron propiedades con esos filtros.</p>
                </div>
              ) : (
                properties.map((property) => (
                  <div key={property._id} id={`property-${property._id}`}>
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
