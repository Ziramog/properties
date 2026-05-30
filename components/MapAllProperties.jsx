'use client';
import { useEffect, useState, useRef, useMemo } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getPropertyImage } from '@/utils/propertyDisplay';
import { generateWhatsAppLink } from '@/utils/whatsapp';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import PropertiesSearch from '@/components/PropertiesSearch';

const knownCities = {
  'Alta Gracia': [-31.6525, -64.4397],
  Cordoba: [-31.4201, -64.1888],
  Córdoba: [-31.4201, -64.1888],
  'Villa Carlos Paz': [-31.4247, -64.4978],
  'Carlos Paz': [-31.4247, -64.4978],
  'San Francisco': [-31.4279, -62.0857],
  'Rio Tercero': [-32.0278, -64.1055],
  'Jesus Maria': [-30.9815, -64.0932],
  'Jesús María': [-30.9815, -64.0932],
  'La Falda': [-31.0833, -64.4833],
  'Falda del Carmen': [-31.6333, -64.4500],
  'Villa General Belgrano': [-31.9667, -64.55],
  Anisacate: [-31.7, -64.4167],
  Despeñaderos: [-32.15, -64.3],
  'Huerta Grande': [-31.0667, -64.5],
  'La Paisanita': [-31.72, -64.48],
  'La Serranita': [-31.7167, -64.4],
  'Los Aromos': [-31.6833, -64.3833],
  'Los Gigantes': [-31.4, -64.8],
  'Los Molinos': [-31.7667, -64.3667],
  'Potrero de Garay': [-31.75, -64.45],
  'San Clemente': [-31.8833, -64.4667],
  'Santa Ana': [-31.6333, -64.3667],
  Mendiolaza: [-31.3, -64.3],
  Unquillo: [-31.23, -64.32],
  'Rio Ceballos': [-31.17, -64.32],
  'Villa Allende': [-31.3, -64.3],
  Cosquin: [-31.24, -64.47],
  'La Calera': [-31.35, -64.34],
  Saldan: [-31.31, -64.31],
  Malagueño: [-31.46, -64.36],
  Toledo: [-31.55, -64.01],
};

function geocode(property) {
  if (property.location?.lat && property.location?.lng) {
    return { lat: property.location.lat, lng: property.location.lng };
  }
  const city = property.location?.city;
  if (city && knownCities[city]) {
    const base = knownCities[city];
    const offset = () => (Math.random() - 0.5) * 0.008;
    return { lat: base[0] + offset(), lng: base[1] + offset() };
  }
  return null;
}

function formatPrice(property) {
  const priceStr = property.price;
  if (!priceStr) return '?';
  const cleaned = priceStr.replace(/[^0-9]/g, '');
  const num = parseInt(cleaned, 10);
  if (isNaN(num)) return '?';
  if (num >= 1000000) return `USD $${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `USD ${Math.round(num / 1000)}k`;
  return `USD $${num}`;
}

function parsePrice(priceStr) {
  if (!priceStr) return 0;
  const cleaned = priceStr.replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 0;
}

function PropertyHoverCard({ property }) {
  const price = property.price || 'Consultar';
  const image = property.images?.[0]?.url || '/images/property-placeholder.jpg';

  return (
    <Link
      href={`/properties/${property._id}`}
      className="flex items-center gap-3 bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-200 cursor-pointer"
      style={{ width: 260 }}
    >
      <img
        src={image}
        alt={property.name}
        className="w-20 h-20 object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0 py-2 pr-3">
        <p className="text-[13px] font-bold truncate" style={{ color: '#C93E15' }}>{price}</p>
        <p className="text-[12px] font-medium text-gray-800 truncate">{property.name || 'Propiedad'}</p>
        <p className="text-[11px] text-gray-500 truncate">{property.location?.city}</p>
      </div>
    </Link>
  );
}

export default function MapAllProperties({ initialProperties = [] }) {
  const [allProps, setAllProps] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [popupProperty, setPopupProperty] = useState(null);
  const mapRef = useRef(null);
  const [activeFilters, setActiveFilters] = useState(null);

  useEffect(() => {
    const geo = initialProperties
      .map((p) => ({ ...p, coords: geocode(p) }))
      .filter((p) => p.coords != null);
    setAllProps(geo);
  }, [initialProperties]);

  const filteredProps = useMemo(() => {
    if (!activeFilters) return allProps;

    let result = allProps;

    // City / name search
    if (activeFilters.term) {
      const q = activeFilters.term.toLowerCase();
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.location?.city?.toLowerCase().includes(q) ||
        p.location?.street?.toLowerCase().includes(q)
      );
    }

    // Property type (from dropdown)
    if (activeFilters.tipo) {
      result = result.filter(p => p.type === activeFilters.tipo);
    }

    // Price range
    if (activeFilters.price) {
      const [min, max] = activeFilters.price.split('-').map(Number);
      result = result.filter(p => {
        const price = parsePrice(p.price);
        if (price === 0) return false;
        if (max === 0) return price >= min;
        return price >= min && price <= max;
      });
    }

    // Min price
    if (activeFilters.minPrice) {
      const min = parseInt(activeFilters.minPrice, 10);
      result = result.filter(p => parsePrice(p.price) >= min);
    }

    // Max price
    if (activeFilters.maxPrice) {
      const max = parseInt(activeFilters.maxPrice, 10);
      result = result.filter(p => {
        const price = parsePrice(p.price);
        return price > 0 && price <= max;
      });
    }

    // Bedrooms
    if (activeFilters.bedrooms) {
      const minBeds = parseInt(activeFilters.bedrooms, 10);
      result = result.filter(p => {
        const beds = parseInt(p.beds, 10);
        return !isNaN(beds) && beds >= minBeds;
      });
    }

    // Baths
    if (activeFilters.baths) {
      const minBaths = parseInt(activeFilters.baths, 10);
      result = result.filter(p => {
        const baths = parseInt(p.baths, 10);
        return !isNaN(baths) && baths >= minBaths;
      });
    }

    // Area range
    if (activeFilters.area) {
      const [minArea, maxArea] = activeFilters.area.split('-').map(Number);
      result = result.filter(p => {
        const area = parseInt(p.square_feet || p.covered_area, 10);
        if (isNaN(area) || area === 0) return false;
        if (maxArea === 0) return area >= minArea;
        return area >= minArea && area <= maxArea;
      });
    }

    // Property type checkboxes
    if (activeFilters['property-type']?.length) {
      const typeMap = {
        residential: ['Casa', 'Departamento'],
        multi_family: ['Departamento'],
        land: ['Terreno', 'Campo'],
        commercial: ['Inmueble Comercial'],
        industrial: ['Inmueble Comercial'],
      };
      const allowedTypes = activeFilters['property-type'].flatMap(t => typeMap[t] || []);
      if (allowedTypes.length > 0) {
        result = result.filter(p => allowedTypes.includes(p.type));
      }
    }

    // Status checkboxes
    if (activeFilters.status?.length) {
      result = result.filter(p => activeFilters.status.includes(p.status));
    }

    return result;
  }, [allProps, activeFilters]);

  useEffect(() => {
    const mapInstance = mapRef.current?.getMap();
    if (!mapInstance || filteredProps.length === 0) return;

    const bounds = filteredProps.reduce(
      (acc, p) => [
        [Math.min(acc[0][0], p.coords.lng), Math.min(acc[0][1], p.coords.lat)],
        [Math.max(acc[1][0], p.coords.lng), Math.max(acc[1][1], p.coords.lat)],
      ],
      [[Infinity, Infinity], [-Infinity, -Infinity]]
    );

    mapInstance.fitBounds(bounds, { padding: 80, duration: 1000, maxZoom: 13 });
  }, [filteredProps]);

  if (allProps.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F6F6F6]">
        <p className="text-gray-500">Cargando mapa...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F6F6]">
      {/* Search bar — idéntico a /properties */}
      <section className="bg-black px-4 pt-4 pb-6">
        <div className="max-w-7xl mx-auto">
          <PropertiesSearch onFilter={setActiveFilters} />
        </div>
      </section>

      {/* Map in white container */}
      <div className="max-w-[1820px] mx-auto px-4 md:px-[50px] py-[12px]">
        <div className="bg-white rounded-none overflow-hidden relative" style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}>
          {/* Back button */}
          <Link
            href="/properties"
            className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md border border-white/40 rounded-full px-4 py-2 text-[13px] font-semibold text-[#1A1A18] shadow-lg hover:bg-white transition-all"
          >
            <FaArrowLeft className="w-4 h-4" />
            Volver
          </Link>

          {/* Property count badge */}
          <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md rounded-full px-4 py-2 text-[12px] font-semibold text-[#1A1A18] shadow-lg">
            {filteredProps.length} propiedades
          </div>

          <Map
            ref={mapRef}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            initialViewState={{ longitude: -64.4397, latitude: -31.6525, zoom: 12 }}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/wolfim77/cmp93y2ft000s01qf5dxi9ar7"
            scrollZoom={true}
            attributionControl={false}
          >
            {filteredProps.map((property) => {
              const isHovered = hoveredId === property._id;

              return (
                <Marker
                  key={property._id}
                  longitude={property.coords.lng}
                  latitude={property.coords.lat}
                  anchor="bottom"
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    setPopupProperty(property);
                  }}
                >
                  <div
                    className="relative"
                    onMouseEnter={() => setHoveredId(property._id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {isHovered && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none">
                        <PropertyHoverCard property={property} />
                      </div>
                    )}

                    <div
                      style={{
                        background: isHovered ? '#E94560' : '#C93E15',
                        borderRadius: '10px',
                        padding: '4px 8px',
                        boxShadow: isHovered
                          ? '0 0 0 3px rgba(233,69,96,0.4), 0 8px 24px rgba(0,0,0,0.35)'
                          : '0 4px 16px rgba(0,0,0,0.3)',
                        transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span style={{ color: '#fff', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {formatPrice(property)}
                      </span>
                    </div>
                  </div>
                </Marker>
              );
            })}

            {popupProperty && (
              <Popup
                longitude={popupProperty.coords.lng}
                latitude={popupProperty.coords.lat}
                anchor="top"
                onClose={() => setPopupProperty(null)}
                closeButton={true}
                closeOnClick={false}
                maxWidth="280px"
              >
                <div className="min-w-[220px] max-w-[260px]">
                  <img
                    src={getPropertyImage(popupProperty)}
                    alt={popupProperty.name}
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                  <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">{popupProperty.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {popupProperty.location?.city}
                  </p>
                  <p className="font-bold mt-1 text-base" style={{ color: '#C93E15' }}>
                    {popupProperty.price || 'Consultar'}
                  </p>
                  <a
                    href={generateWhatsAppLink({ property: popupProperty })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center justify-center gap-1.5 w-full py-1.5 bg-whatsapp text-white text-xs font-semibold rounded-md hover:bg-whatsapp-hover transition-colors"
                  >
                    WhatsApp
                  </a>
                </div>
              </Popup>
            )}
          </Map>

          {/* No results overlay */}
          {filteredProps.length === 0 && allProps.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="bg-black/80 backdrop-blur-md rounded-xl px-6 py-4 text-center">
                <p className="text-white font-semibold text-[15px]">No se encontraron propiedades</p>
                <p className="text-white/50 text-[12px] mt-1">Probá con otros filtros</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
