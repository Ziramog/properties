'use client';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getPropertyImage } from '@/utils/propertyDisplay';
import { generateWhatsAppLink } from '@/utils/whatsapp';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

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
  const [geocodedProps, setGeocodedProps] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [popupProperty, setPopupProperty] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const geo = initialProperties
      .map((p) => ({ ...p, coords: geocode(p) }))
      .filter((p) => p.coords != null);
    setGeocodedProps(geo);
  }, [initialProperties]);

  useEffect(() => {
    const mapInstance = mapRef.current?.getMap();
    if (!mapInstance || geocodedProps.length === 0) return;

    const bounds = geocodedProps.reduce(
      (acc, p) => [
        [Math.min(acc[0][0], p.coords.lng), Math.min(acc[0][1], p.coords.lat)],
        [Math.max(acc[1][0], p.coords.lng), Math.max(acc[1][1], p.coords.lat)],
      ],
      [[Infinity, Infinity], [-Infinity, -Infinity]]
    );

    mapInstance.fitBounds(bounds, { padding: 80, duration: 1000, maxZoom: 13 });
  }, [geocodedProps]);

  if (geocodedProps.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#E8E6E0]">
        <p className="text-gray-500">Cargando mapa...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-[#E8E6E0]">
      {/* Back button */}
      <Link
        href="/properties"
        className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-white/90 backdrop-blur-md border border-white/40 rounded-full px-4 py-2 text-[13px] font-semibold text-[#1A1A18] shadow-lg hover:bg-white transition-all"
      >
        <FaArrowLeft className="w-4 h-4" />
        Volver
      </Link>

      {/* Property count badge */}
      <div className="absolute top-4 right-4 z-30 bg-white/90 backdrop-blur-md rounded-full px-4 py-2 text-[12px] font-semibold text-[#1A1A18] shadow-lg">
        {geocodedProps.length} propiedades
      </div>

      <Map
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapLib={import('mapbox-gl')}
        initialViewState={{ longitude: -64.4397, latitude: -31.6525, zoom: 12 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/wolfim77/cmp93y2ft000s01qf5dxi9ar7"
        scrollZoom={true}
        attributionControl={false}
      >
        {geocodedProps.map((property) => {
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
                {/* Hover card */}
                {isHovered && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none">
                    <PropertyHoverCard property={property} />
                  </div>
                )}

                {/* Pin */}
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
    </div>
  );
}