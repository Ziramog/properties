'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { Marker } from 'react-map-gl';
import Image from 'next/image';
import pin from '@/assets/images/pin.svg';
import Spinner from './Spinner';

const knownCities = {
  'Alta Gracia': [-31.6525, -64.4397],
  'Córdoba': [-31.4201, -64.1888],
  Cordoba: [-31.4201, -64.1888],
  'Villa Carlos Paz': [-31.4247, -64.4977],
  'San Francisco': [-31.4279, -62.0857],
  'Rio Tercero': [-32.0278, -64.1055],
  'Jesús María': [-30.9815, -64.0932],
  'La Falda': [-31.0833, -64.4833],
  'Villa General Belgrano': [-31.9667, -64.55],
  Cosquín: [-31.24, -64.47],
  Mendiolaza: [-31.3, -64.3],
  Unquillo: [-31.23, -64.32],
  'Río Ceballos': [-31.17, -64.32],
  'Villa Allende': [-31.3, -64.3],
  'La Calera': [-31.35, -64.34],
  Malagueño: [-31.46, -64.36],
};

function geocodeCity(city) {
  if (!city) return null;
  const coords = knownCities[city];
  return coords ? { lat: coords[0], lng: coords[1] } : null;
}

const PropertyMap = ({ property }) => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [loading, setLoading] = useState(true);
  const [geocodeError, setGeocodeError] = useState(false);
  const mapRef = useRef();

  const onMapLoad = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    // Desktop: Ctrl+scroll zooms, drag pans normally
    map.scrollZoom.disable();
    map.dragRotate.disable();

    map.getContainer().addEventListener('wheel', (e) => {
      if (e.ctrlKey || e.metaKey) {
        map.scrollZoom.enable();
        requestAnimationFrame(() => map.scrollZoom.disable());
      }
    });

    // Mobile: two fingers for zoom + pan
    if ('ontouchstart' in window) {
      map.dragPan.disable();
      const c = map.getContainer();
      c.addEventListener('touchstart', (e) => {
        if (e.touches.length >= 2) {
          map.dragPan.enable();
          map.scrollZoom.enable();
        }
      });
      c.addEventListener('touchend', (e) => {
        if (e.touches.length < 2) {
          map.dragPan.disable();
          map.scrollZoom.disable();
        }
      });
    }
  }, []);

  useEffect(() => {
    const fetchCoords = async () => {
      const cityCoords = geocodeCity(property.location?.city);
      if (cityCoords) {
        setLat(cityCoords.lat);
        setLng(cityCoords.lng);
        setLoading(false);
        return;
      }

      const query = [property.location?.street, property.location?.city, property.location?.state, 'Argentina']
        .filter(Boolean)
        .join(', ');

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
          { headers: { 'User-Agent': 'property-pulse-app' } }
        );
        const data = await res.json();

        if (data.length === 0) {
          setGeocodeError(true);
          setLoading(false);
          return;
        }

        setLat(parseFloat(data[0].lat));
        setLng(parseFloat(data[0].lon));
        setLoading(false);
      } catch {
        setGeocodeError(true);
        setLoading(false);
      }
    };

    fetchCoords();
  }, [property.location]);

  if (loading) return <Spinner loading={loading} />;

  if (geocodeError) {
    return <div className='text-xl'>No location data found</div>;
  }

  return (
    <div className="relative">
      <Map
        ref={mapRef}
        onLoad={onMapLoad}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapLib={import('mapbox-gl')}
        initialViewState={{
          longitude: lng,
          latitude: lat,
          zoom: 15,
        }}
        style={{ width: '100%', height: 500 }}
        mapStyle='mapbox://styles/mapbox/light-v11'
        scrollZoom={false}
        dragPan={true}
        dragRotate={false}
        doubleClickZoom={false}
        keyboard={false}
      >
        <Marker longitude={lng} latitude={lat} anchor='bottom'>
          <Image src={pin} alt='location' width={40} height={40} />
        </Marker>
      </Map>

      {/* Mobile hint — Google Maps-style flat bar */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 z-10 bg-black/60 text-white/80 text-[11px] text-center py-1.5 px-3 pointer-events-none select-none">
        Usa dos dedos para mover y hacer zoom
      </div>
    </div>
  );
};

export default PropertyMap;