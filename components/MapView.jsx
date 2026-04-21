'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const knownCities = {
  'Alta Gracia': [-31.6525, -64.4397],
  'Cordoba': [-31.4201, -64.1888],
  'Córdoba': [-31.4201, -64.1888],
  'Villa Carlos Paz': [-31.4247, -64.4978],
  'Carlos Paz': [-31.4247, -64.4978],
  'San Francisco': [-31.4279, -62.0857],
  'Rio Tercero': [-32.0278, -64.1055],
  'Jesus Maria': [-30.9815, -64.0932],
  'Jesús María': [-30.9815, -64.0932],
  'La Falda': [-31.0833, -64.4833],
  'Falda del Carmen': [-31.0833, -64.4833],
  'Villa General Belgrano': [-31.9667, -64.5500],
  'Miramar': [-31.5167, -64.2333],
  'Anisacate': [-31.7000, -64.4167],
  'Despeñaderos': [-32.1500, -64.3000],
  'Huerta Grande': [-31.0667, -64.5000],
  'La Paisanita': [-31.0833, -64.5000],
  'La Serranita': [-31.7167, -64.4000],
  'Los Aromos': [-31.6833, -64.3833],
  'Los Gigantes': [-31.9167, -64.6000],
  'Los Molinos': [-31.7667, -64.3667],
  'Potrero de Garay': [-31.7500, -64.4500],
  'San Clemente': [-31.8833, -64.4667],
  'Santa Ana': [-31.6333, -64.3667],
  'Mendiolaza': [-31.6167, -64.3167],
  'Unquillo': [-31.5833, -64.3167],
  'Rio Ceballos': [-31.5833, -64.3167],
  'Villa Allende': [-31.3500, -64.3000],
  'Cosquin': [-31.2000, -64.4500],
  'La Calera': [-31.4500, -64.3167],
  'Saldan': [-31.3333, -64.3000],
  'Malagueño': [-31.5500, -64.4167],
  'Toledo': [-31.5333, -64.3833],
};

const geocodeCity = (city) => {
  if (!city) return null;
  if (knownCities[city]) return knownCities[city];
  return null;
};

const MapView = ({ properties = [], onPropertySelect, selectedPropertyId }) => {
  const [geocodedProps, setGeocodedProps] = useState([]);

  useEffect(() => {
    const geo = properties.map((p) => {
      const coords = geocodeCity(p.location?.city) ||
        (p.geoLat != null && p.geoLng != null ? [p.geoLat, p.geoLng] : null);
      return { ...p, coords };
    }).filter((p) => p.coords != null);
    setGeocodedProps(geo);
  }, [properties]);

  const defaultCenter = [-31.7, -64.3];

  if (geocodedProps.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-l-xl">
        <p className="text-gray-500 text-sm px-4 text-center">
          Cargando mapa...
        </p>
      </div>
    );
  }

  return (
    <MapContainer
      center={defaultCenter}
      zoom={10}
      className="h-full w-full rounded-l-xl"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {geocodedProps.map((property) => (
        <Marker
          key={property._id}
          position={property.coords}
          icon={icon}
          eventHandlers={{
            click: () => onPropertySelect?.(property._id),
          }}
        >
          <Popup>
            <div className="min-w-[200px]">
              <img
                src={property.images?.[0] || '/placeholder.jpg'}
                alt={property.name}
                className="w-full h-32 object-cover rounded-md mb-2"
              />
              <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
                {property.name}
              </h3>
              <p className="text-xs text-gray-500">
                {property.location?.city}, {property.location?.state}
              </p>
              <p className="font-bold text-[#E94560] mt-1 text-sm">
                {property.price || 'Consultar'}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
