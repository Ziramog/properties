'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapView = ({ properties = [], onPropertySelect, selectedPropertyId }) => {
  // Center on Córdoba, Argentina
  const defaultCenter = [-31.7, -64.3];

  const withCoords = properties.filter((p) => p.geoLat != null && p.geoLng != null);

  if (withCoords.length === 0) {
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
      {withCoords.map((property) => (
        <Marker
          key={property._id}
          position={[property.geoLat, property.geoLng]}
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
