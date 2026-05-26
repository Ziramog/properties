'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { Marker, useMap } from 'react-map-gl';
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

function MapHintOverlay() {
  const [dismissed, setDismissed] = useState(false);
  const isMobile = typeof window !== 'undefined' && 'ontouchstart' in window;

  useEffect(() => {
    if (dismissed) return;
    const container = document.querySelector('.mapboxgl-map');
    if (!container) return;

    const handler = (e) => {
      if (!isMobile && e.ctrlKey) { setDismissed(true); return; }
      if (isMobile && e.touches && e.touches.length >= 2) { setDismissed(true); }
    };

    container.addEventListener(isMobile ? 'touchstart' : 'wheel', handler);
    return () => container.removeEventListener(isMobile ? 'touchstart' : 'wheel', handler);
  }, [dismissed, isMobile]);

  if (dismissed) return null;

  return (
    <div
      className="absolute z-20 pointer-events-none select-none"
      style={{ bottom: 16, left: '50%', transform: 'translateX(-50%)' }}
    >
      <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white text-[11px] px-3 py-1.5 rounded-full shadow-lg">
        {isMobile ? (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 flex-shrink-0">
              <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
            </svg>
            <span>Usa dos dedos para hacer zoom</span>
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 flex-shrink-0">
              <rect x="5" y="2" width="14" height="20" rx="3"/>
              <path d="M12 6v4"/>
            </svg>
            <span>Ctrl + scroll para hacer zoom</span>
          </>
        )}
      </div>
    </div>
  );
}

function KeyboardControls({ mapRef }) {
  const map = useMap();

  useEffect(() => {
    const handleKeyDown = (e) => {
      const m = mapRef.current?.getMap();
      if (!m) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case '+':
        case '=':
          e.preventDefault();
          m.zoomIn({ duration: 300 });
          break;
        case '-':
        case '_':
          e.preventDefault();
          m.zoomOut({ duration: 300 });
          break;
        case 'ArrowUp':
          e.preventDefault();
          m.panBy([0, -100], { duration: 200 });
          break;
        case 'ArrowDown':
          e.preventDefault();
          m.panBy([0, 100], { duration: 200 });
          break;
        case 'ArrowLeft':
          e.preventDefault();
          m.panBy([-100, 0], { duration: 200 });
          break;
        case 'ArrowRight':
          e.preventDefault();
          m.panBy([100, 0], { duration: 200 });
          break;
        case 'Enter':
          e.preventDefault();
          m.flyTo({ center: m.getCenter(), zoom: 15, duration: 800 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mapRef, map]);

  return null;
}

const PropertyMap = ({ property }) => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [loading, setLoading] = useState(true);
  const [geocodeError, setGeocodeError] = useState(false);
  const mapRef = useRef();
  const disposed = useRef(false);
  const isMobile = typeof window !== 'undefined' && 'ontouchstart' in window;

  const onMapLoad = useCallback(() => {
    console.log('[PropertyMap] Map loaded successfully');
    const map = mapRef.current?.getMap();
    if (!map) return;

    map.scrollZoom.disable();
    map.dragRotate.disable();

    const container = map.getContainer();

    const wheelHandler = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaY || e.wheelDelta;
        if (delta < 0) {
          map.zoomIn({ duration: 0 });
        } else {
          map.zoomOut({ duration: 0 });
        }
      }
    };

    let lastTouchDist = null;
    const touchStartHandler = (e) => {
      if (e.touches.length === 1) {
        e.preventDefault();
      }
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastTouchDist = Math.hypot(dx, dy);
      }
    };
    const touchMoveHandler = (e) => {
      if (e.touches.length === 2 && lastTouchDist !== null) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const delta = dist - lastTouchDist;
        if (delta > 8) { map.zoomIn({ duration: 0 }); lastTouchDist = dist; }
        else if (delta < -8) { map.zoomOut({ duration: 0 }); lastTouchDist = dist; }
      }
    };
    const touchEndHandler = () => { lastTouchDist = null; };

    container.addEventListener('wheel', wheelHandler, { passive: false });
    container.addEventListener('touchstart', touchStartHandler, { passive: false });
    container.addEventListener('touchmove', touchMoveHandler, { passive: false });
    container.addEventListener('touchend', touchEndHandler, { passive: false });

    disposed.current = () => {
      container.removeEventListener('wheel', wheelHandler);
      container.removeEventListener('touchstart', touchStartHandler);
      container.removeEventListener('touchmove', touchMoveHandler);
      container.removeEventListener('touchend', touchEndHandler);
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
        doubleClickZoom={true}
        touchZoomRotate={false}
        touchPitch={false}
        keyboard={true}
      >
        <Marker longitude={lng} latitude={lat} anchor='bottom'>
          <Image src={pin} alt='location' width={40} height={40} />
        </Marker>
        <KeyboardControls mapRef={mapRef} />
      </Map>
      <MapHintOverlay />
    </div>
  );
};

export default PropertyMap;