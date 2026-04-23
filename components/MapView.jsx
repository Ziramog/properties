'use client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { getPropertyImage } from '@/utils/propertyDisplay';
import { generateWhatsAppLink } from '@/utils/whatsapp';

// ── Custom price marker icon — all orange to match Stitch ──
function createPriceIcon(property, isSelected = false) {
  const priceStr = property.price;
  let label = '?';

  if (priceStr) {
    const cleaned = priceStr.replace(/[^0-9]/g, '');
    const num = parseInt(cleaned, 10);
    if (!isNaN(num)) {
      if (num >= 1000000) label = `USD $${(num / 1000000).toFixed(1)}M`;
      else if (num >= 1000) label = `USD ${Math.round(num / 1000)}k`;
      else label = `USD $${num}`;
    }
  }

  const scale = isSelected ? 'transform:scale(1.25);z-index:1000;' : '';
  const ring = isSelected
    ? 'box-shadow:0 0 0 3px #fff,0 0 0 5px #D84315,0 4px 12px rgba(0,0,0,0.3);'
    : 'box-shadow:0 2px 8px rgba(0,0,0,0.2);';

  const html = `<div style="
    background:#D84315;color:#fff;padding:4px 10px;border-radius:6px;
    font-size:11px;font-weight:700;font-family:Inter,system-ui,sans-serif;
    white-space:nowrap;border:2px solid #fff;
    cursor:pointer;
    transition:transform 0.2s,box-shadow 0.2s;
    ${scale}${ring}
  ">${label}</div>`;

  return L.divIcon({
    html,
    className: 'price-marker',
    iconSize: null,
    iconAnchor: [40, 15],
  });
}

// ── Known city coordinates (geocoding fallback) ──
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
    return [property.location.lat, property.location.lng];
  }
  const city = property.location?.city;
  if (city && knownCities[city]) {
    const base = knownCities[city];
    const offset = () => (Math.random() - 0.5) * 0.008;
    return [base[0] + offset(), base[1] + offset()];
  }
  return null;
}

// ── Map controller ──
function MapController({ flyToCoords, flyToZoom }) {
  const map = useMap();
  useEffect(() => {
    if (flyToCoords) {
      map.flyTo(flyToCoords, flyToZoom || 15, { duration: 0.8 });
    }
  }, [flyToCoords, flyToZoom, map]);
  return null;
}

// ── Main MapView component ──
const MapView = forwardRef(({ properties = [], onMarkerClick, selectedId }, ref) => {
  const [geocodedProps, setGeocodedProps] = useState([]);
  const [flyTarget, setFlyTarget] = useState(null);
  const mapRef = useRef(null);

  useImperativeHandle(ref, () => ({
    flyTo: (coords, zoom) => setFlyTarget({ coords, zoom }),
  }));

  useEffect(() => {
    const geo = properties
      .map((p) => ({ ...p, coords: geocode(p) }))
      .filter((p) => p.coords != null);
    setGeocodedProps(geo);
  }, [properties]);

  const defaultCenter = [-31.65, -64.43];

  if (geocodedProps.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="text-sm">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={defaultCenter}
      zoom={11}
      className="h-full w-full rounded-lg"
      scrollWheelZoom={true}
      ref={mapRef}
    >
      {/* Grayscale tile layer — matches Stitch design */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      <MapController flyToCoords={flyTarget?.coords} flyToZoom={flyTarget?.zoom} />

      {geocodedProps.map((property) => (
        <Marker
          key={property._id}
          position={property.coords}
          icon={createPriceIcon(property, selectedId === property._id)}
          eventHandlers={{
            click: () => onMarkerClick?.(property._id),
          }}
        >
          <Popup>
            <div className="min-w-[220px] max-w-[260px]">
              <img
                src={getPropertyImage(property)}
                alt={property.name}
                className="w-full h-32 object-cover rounded-md mb-2"
              />
              <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">{property.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {property.location?.city}, {property.location?.state}
              </p>
              <p className="font-bold text-primary mt-1 text-base">{property.price || 'Consultar'}</p>
              <a
                href={generateWhatsAppLink({ property })}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center justify-center gap-1.5 w-full py-1.5 bg-whatsapp text-white text-xs font-semibold rounded-md hover:bg-whatsapp-hover transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
});

MapView.displayName = 'MapView';
export default MapView;
