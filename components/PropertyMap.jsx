'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Map, Marker } from 'react-map-gl/mapbox';
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

function GlassZoomControl({ mapRef: mapboxRef }) {
  const handleZoomIn = () => {
    const map = mapboxRef.current?.getMap();
    map?.zoomIn({ duration: 300 });
  };
  const handleZoomOut = () => {
    const map = mapboxRef.current?.getMap();
    map?.zoomOut({ duration: 300 });
  };

  return (
    <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-[1px] overflow-hidden rounded-xl shadow-xl backdrop-blur-xl bg-white/10 border border-white/20">
      <button
        onClick={handleZoomIn}
        className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 text-lg font-light"
        aria-label="Zoom in"
      >
        +
      </button>
      <div className="h-[1px] bg-white/10" />
      <button
        onClick={handleZoomOut}
        className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 text-lg font-light"
        aria-label="Zoom out"
      >
        −
      </button>
    </div>
  );
}

const PropertyMap = ({ property }) => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [loading, setLoading] = useState(true);
  const [geocodeError, setGeocodeError] = useState(false);
  const mapRef = useRef();
  const disposed = useRef(false);

  const onMapLoad = useCallback(() => {
    console.log('[PropertyMap] Map loaded successfully');
    console.log('[PropertyMap] Style:', 'mapbox://styles/wolfim77/cmp93y2ft000s01qf5dxi9ar7');
    console.log('[PropertyMap] Token present:', !!process.env.NEXT_PUBLIC_MAPBOX_TOKEN);
    const map = mapRef.current?.getMap();
    if (!map) return;

    // Desktop: Ctrl+scroll zooms, drag pans normally
    map.scrollZoom.disable();
    map.dragRotate.disable();

    const container = map.getContainer();

    const wheelHandler = (e) => {
      if (e.ctrlKey || e.metaKey) {
        map.scrollZoom.enable();
        requestAnimationFrame(() => map.scrollZoom.disable());
      }
    };

    container.addEventListener('wheel', wheelHandler, { passive: true });

    // Mobile: two fingers for zoom + pan
    let touchCleanup = null;
    if ('ontouchstart' in window) {
      map.dragPan.disable();

      const touchStartHandler = (e) => {
        if (e.touches.length >= 2) {
          map.dragPan.enable();
          map.scrollZoom.enable();
        }
      };

      const touchEndHandler = (e) => {
        if (e.touches.length < 2) {
          map.dragPan.disable();
          map.scrollZoom.disable();
        }
      };

      container.addEventListener('touchstart', touchStartHandler, { passive: true });
      container.addEventListener('touchend', touchEndHandler, { passive: true });

      touchCleanup = () => {
        container.removeEventListener('touchstart', touchStartHandler);
        container.removeEventListener('touchend', touchEndHandler);
      };
    }

    // Cleanup
    disposed.current = () => {
      container.removeEventListener('wheel', wheelHandler);
      if (touchCleanup) touchCleanup();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (disposed.current) disposed.current();
    };
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
        mapStyle='mapbox://styles/wolfim77/cmp93y2ft000s01qf5dxi9ar7'
        onError={(e) => console.error('[PropertyMap] Map load ERROR:', e?.error?.message || e)}
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

      {/* Glassmorphism zoom controls */}
      <GlassZoomControl mapRef={mapRef} />

      {/* Desktop hint */}
      <div className="hidden md:block absolute bottom-0 left-0 right-0 z-10 bg-black/60 text-white/70 text-[11px] text-center py-1.5 px-3 pointer-events-none select-none backdrop-blur-sm">
        Ctrl + scroll para hacer zoom
      </div>

      {/* Mobile hint */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 z-10 bg-black/60 text-white/70 text-[11px] text-center py-1.5 px-3 pointer-events-none select-none backdrop-blur-sm">
        Usa dos dedos para mover y hacer zoom
      </div>
    </div>
  );
};

export default PropertyMap;