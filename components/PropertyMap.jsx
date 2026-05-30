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

function MapHintOverlay({ dismissed, onDismiss }) {
  const isMobile = typeof window !== 'undefined' && 'ontouchstart' in window;

  useEffect(() => {
    if (dismissed) return;
    const container = document.querySelector('.mapboxgl-map');
    if (!container) return;

    const handler = (e) => {
      if (!isMobile && e.ctrlKey) { onDismiss(); return; }
      if (isMobile && e.touches && e.touches.length >= 2) { onDismiss(); }
    };

    container.addEventListener(isMobile ? 'touchstart' : 'wheel', handler);
    return () => container.removeEventListener(isMobile ? 'touchstart' : 'wheel', handler);
  }, [dismissed, isMobile, onDismiss]);

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

const PropertyMap = ({ property }) => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [loading, setLoading] = useState(true);
  const [geocodeError, setGeocodeError] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);
  const mapRef = useRef();

  const onMapLoad = useCallback(() => {
    console.log('[PropertyMap] Map loaded successfully');
    const map = mapRef.current?.getMap();
    if (!map) return;

    // Disable default scroll zoom — we handle it manually with Ctrl check
    map.scrollZoom.disable();

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
        setHintDismissed(true);
      } else {
        // Show hint again when scrolling without Ctrl
        setHintDismissed(false);
      }
    };

    let lastTouchDist = null;
    let lastTouchCenter = null;
    const touchStartHandler = (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastTouchDist = Math.hypot(dx, dy);
        lastTouchCenter = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        };
        setHintDismissed(true);
      }
    };
    const touchMoveHandler = (e) => {
      if (e.touches.length === 2 && lastTouchDist !== null) {
        e.preventDefault();

        const tdx = e.touches[0].clientX - e.touches[1].clientX;
        const tdy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(tdx, tdy);
        const delta = dist - lastTouchDist;

        if (delta > 8) { map.zoomIn({ duration: 0 }); lastTouchDist = dist; }
        else if (delta < -8) { map.zoomOut({ duration: 0 }); lastTouchDist = dist; }

        if (lastTouchCenter) {
          const center = {
            x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
            y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
          };
          const pdx = center.x - lastTouchCenter.x;
          const pdy = center.y - lastTouchCenter.y;
          if (Math.abs(pdx) > 5 || Math.abs(pdy) > 5) {
            map.panBy([-pdx, -pdy], { duration: 0 });
            lastTouchCenter = center;
          }
        }
      }
    };
    const touchEndHandler = (e) => {
      if (e.touches.length < 2) {
        lastTouchDist = null;
        lastTouchCenter = null;
      }
    };

    container.addEventListener('wheel', wheelHandler, { passive: false });
    container.addEventListener('touchstart', touchStartHandler, { passive: false });
    container.addEventListener('touchmove', touchMoveHandler, { passive: false });
    container.addEventListener('touchend', touchEndHandler, { passive: false });

    return () => {
      container.removeEventListener('wheel', wheelHandler);
      container.removeEventListener('touchstart', touchStartHandler);
      container.removeEventListener('touchmove', touchMoveHandler);
      container.removeEventListener('touchend', touchEndHandler);
    };
  }, []);

  useEffect(() => {
    const fetchCoords = async () => {
      // 1. Exact coordinates from DB
      if (property.coordinates?.lat != null && property.coordinates?.lng != null) {
        setLat(property.coordinates.lat);
        setLng(property.coordinates.lng);
        setLoading(false);
        return;
      }

      // 2. Known cities dictionary
      const cityCoords = geocodeCity(property.location?.city);
      if (cityCoords) {
        setLat(cityCoords.lat);
        setLng(cityCoords.lng);
        setLoading(false);
        return;
      }

      // 3. Nominatim geocoding fallback
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
  }, [property.coordinates, property.location]);

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
          <svg width="44" height="44" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <path d="m32 0a24.028 24.028 0 0 0 -24 24c0 16.228 22.342 38.756 23.293 39.707a1 1 0 0 0 1.414 0c.951-.951 23.293-23.479 23.293-39.707a24.028 24.028 0 0 0 -24-24z" fill="#db7340"/>
            <circle cx="32" cy="24" fill="#c06030" r="13"/>
            <circle cx="32" cy="24" fill="#fff" opacity="0.25" r="6"/>
          </svg>
        </Marker>
      </Map>
      <MapHintOverlay dismissed={hintDismissed} onDismiss={() => setHintDismissed(true)} />
    </div>
  );
};

export default PropertyMap;
