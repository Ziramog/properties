'use client';
import { useEffect, useState, useRef, useMemo } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getPropertyImage } from '@/utils/propertyDisplay';
import { generateWhatsAppLink } from '@/utils/whatsapp';
import { FaArrowLeft, FaSearch, FaTimes } from 'react-icons/fa';
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

const TYPE_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'Casa', label: 'Casas' },
  { value: 'Departamento', label: 'Deptos' },
  { value: 'Terreno', label: 'Terrenos' },
  { value: 'Campo', label: 'Campos' },
  { value: 'Inmueble Comercial', label: 'Comercial' },
];

const PRICE_OPTIONS = [
  { value: '', label: 'Cualquier precio' },
  { value: '0-150000', label: 'Hasta U$S 150k' },
  { value: '150000-300000', label: 'U$S 150k – 300k' },
  { value: '300000-500000', label: 'U$S 300k – 500k' },
  { value: '500000-1000000', label: 'U$S 500k – 1M' },
  { value: '1000000-0', label: '+ U$S 1M' },
];

const BEDS_OPTIONS = [
  { value: '', label: 'Dormitorios' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
];

export default function MapAllProperties({ initialProperties = [] }) {
  const [allProps, setAllProps] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [popupProperty, setPopupProperty] = useState(null);
  const mapRef = useRef(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [filterBeds, setFilterBeds] = useState('');

  useEffect(() => {
    const geo = initialProperties
      .map((p) => ({ ...p, coords: geocode(p) }))
      .filter((p) => p.coords != null);
    setAllProps(geo);
  }, [initialProperties]);

  const filteredProps = useMemo(() => {
    let result = allProps;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.location?.city?.toLowerCase().includes(q) ||
        p.location?.street?.toLowerCase().includes(q)
      );
    }

    if (filterType) {
      result = result.filter(p => p.type === filterType);
    }

    if (filterPrice) {
      const [min, max] = filterPrice.split('-').map(Number);
      result = result.filter(p => {
        const price = parsePrice(p.price);
        if (price === 0) return false;
        if (max === 0) return price >= min;
        return price >= min && price <= max;
      });
    }

    if (filterBeds) {
      const minBeds = parseInt(filterBeds, 10);
      result = result.filter(p => {
        const beds = parseInt(p.beds, 10);
        return !isNaN(beds) && beds >= minBeds;
      });
    }

    return result;
  }, [allProps, searchTerm, filterType, filterPrice, filterBeds]);

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

  const hasFilters = searchTerm || filterType || filterPrice || filterBeds;

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setFilterPrice('');
    setFilterBeds('');
  };

  if (allProps.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#E8E6E0]">
        <p className="text-gray-500">Cargando mapa...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-[#E8E6E0]">
      {/* Search Bar — Senada style */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-black/90 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-4 py-3">
          {/* Top row: back + search input + count */}
          <div className="flex items-center gap-3">
            <Link
              href="/properties"
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex-shrink-0"
            >
              <FaArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Buscar por nombre o ciudad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-9 pr-4 bg-white/10 border border-white/10 rounded-lg text-white text-[13px] outline-none focus:border-[var(--color-brand)] transition-colors placeholder:text-white/40"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                  <FaTimes className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-2 flex-shrink-0">
              <span className="text-white text-[13px] font-semibold">{filteredProps.length}</span>
              <span className="text-white/50 text-[11px]">propiedades</span>
            </div>
          </div>

          {/* Filter row */}
          <div className="flex items-center gap-2 mt-2 overflow-x-auto scrollbar-hide">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="h-8 px-3 bg-white/10 border border-white/10 rounded-lg text-white text-[12px] outline-none focus:border-[var(--color-brand)] appearance-none cursor-pointer min-w-[100px]"
            >
              {TYPE_OPTIONS.map(o => (
                <option key={o.value} value={o.value} className="bg-black text-white">{o.label}</option>
              ))}
            </select>

            <select
              value={filterPrice}
              onChange={(e) => setFilterPrice(e.target.value)}
              className="h-8 px-3 bg-white/10 border border-white/10 rounded-lg text-white text-[12px] outline-none focus:border-[var(--color-brand)] appearance-none cursor-pointer min-w-[120px]"
            >
              {PRICE_OPTIONS.map(o => (
                <option key={o.value} value={o.value} className="bg-black text-white">{o.label}</option>
              ))}
            </select>

            <select
              value={filterBeds}
              onChange={(e) => setFilterBeds(e.target.value)}
              className="h-8 px-3 bg-white/10 border border-white/10 rounded-lg text-white text-[12px] outline-none focus:border-[var(--color-brand)] appearance-none cursor-pointer min-w-[100px]"
            >
              {BEDS_OPTIONS.map(o => (
                <option key={o.value} value={o.value} className="bg-black text-white">{o.label}</option>
              ))}
            </select>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="h-8 px-3 text-[var(--color-brand)] text-[12px] font-semibold uppercase tracking-wider hover:text-white transition-colors flex-shrink-0"
              >
                Limpiar
              </button>
            )}

            {/* Mobile count */}
            <div className="sm:hidden flex items-center gap-1.5 ml-auto flex-shrink-0">
              <span className="text-white text-[13px] font-semibold">{filteredProps.length}</span>
              <span className="text-white/50 text-[11px]">props</span>
            </div>
          </div>
        </div>
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
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none" style={{ top: 120 }}>
          <div className="bg-black/80 backdrop-blur-md rounded-xl px-6 py-4 text-center">
            <p className="text-white font-semibold text-[15px]">No se encontraron propiedades</p>
            <p className="text-white/50 text-[12px] mt-1">Probá con otros filtros</p>
            {hasFilters && (
              <button onClick={clearFilters} className="mt-2 text-[var(--color-brand)] text-[12px] font-bold uppercase tracking-wider hover:text-white transition-colors">
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
