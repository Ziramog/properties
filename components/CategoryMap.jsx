'use client';
import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import Map, { Marker } from 'react-map-gl';
import { useRouter } from 'next/navigation';

const knownCities = {
  'Alta Gracia': [-31.6525, -64.4397],
  'Córdoba': [-31.4201, -64.1888],
  Cordoba: [-31.4201, -64.1888],
  'Villa Carlos Paz': [-31.4247, -64.4977],
  'Carlos Paz': [-31.4247, -64.4977],
  'San Francisco': [-31.4279, -62.0857],
  'Rio Tercero': [-32.0278, -64.1055],
  'Jesús María': [-30.9815, -64.0932],
  'Jesus Maria': [-30.9815, -64.0932],
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
  'Río Ceballos': [-31.17, -64.32],
  'Villa Allende': [-31.3, -64.3],
  Cosquin: [-31.24, -64.47],
  Cosquín: [-31.24, -64.47],
  'La Calera': [-31.35, -64.34],
  Saldan: [-31.31, -64.31],
  Malagueño: [-31.46, -64.36],
  Toledo: [-31.55, -64.01],
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

const CategoryMap = ({ properties = [] }) => {
  const [hintDismissed, setHintDismissed] = useState(false);
  const mapRef = useRef();
  const router = useRouter();

  const markers = useMemo(() => {
    const list = [];
    // Track how many times each city was used to add jitter and avoid perfect overlap
    const cityCount = new Map();
    properties.forEach((p) => {
      let coords = null;

      // 1. Exact coordinates from DB
      if (p.coordinates?.lat != null && p.coordinates?.lng != null) {
        coords = { lat: p.coordinates.lat, lng: p.coordinates.lng };
      }
      // 2. Known cities dictionary
      else if (p.location?.city) {
        coords = geocodeCity(p.location.city);
      }

      if (coords && coords.lat != null && coords.lng != null) {
        const cityKey = p.location?.city || 'unknown';
        const count = cityCount.get(cityKey) || 0;
        cityCount.set(cityKey, count + 1);

        // Add small random offset so multiple pins in same city don't stack perfectly
        const offset = () => (Math.random() - 0.5) * 0.008;
        list.push({
          id: p._id,
          name: p.name,
          lat: coords.lat + (count > 0 ? offset() : 0),
          lng: coords.lng + (count > 0 ? offset() : 0),
        });
      }
    });
    return list;
  }, [properties]);

  const onMapLoad = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

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

  // fitBounds when markers change
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || markers.length === 0) return;

    if (markers.length === 1) {
      map.flyTo({ center: [markers[0].lng, markers[0].lat], zoom: 14, duration: 500 });
      return;
    }

    const bounds = markers.reduce(
      (acc, m) => [
        [Math.min(acc[0][0], m.lng), Math.min(acc[0][1], m.lat)],
        [Math.max(acc[1][0], m.lng), Math.max(acc[1][1], m.lat)],
      ],
      [[Infinity, Infinity], [-Infinity, -Infinity]]
    );

    map.fitBounds(bounds, { padding: 60, maxZoom: 14, duration: 500 });
  }, [markers]);

  if (markers.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-[#999] text-[15px]">
        No hay ubicaciones disponibles para mostrar
      </div>
    );
  }

  return (
    <div className="relative rounded-[30px] overflow-hidden">
      <Map
        ref={mapRef}
        onLoad={onMapLoad}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapLib={mapboxgl}
        initialViewState={{
          longitude: markers[0]?.lng || -64.4397,
          latitude: markers[0]?.lat || -31.6525,
          zoom: 12,
        }}
        style={{ width: '100%', height: 500 }}
        mapStyle='mapbox://styles/wolfim77/cmp93y2ft000s01qf5dxi9ar7'
        scrollZoom={false}
        dragPan={true}
        dragRotate={false}
        doubleClickZoom={true}
        touchZoomRotate={false}
        touchPitch={false}
        keyboard={true}
      >
        {markers.map((m) => (
          <Marker key={m.id} longitude={m.lng} latitude={m.lat} anchor='bottom'>
            <div
              onClick={() => router.push(`/properties/${m.id}`)}
              className="block cursor-pointer hover:scale-110 transition-transform"
              role="button"
              tabIndex={0}
            >
              <svg width="44" height="44" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <path d="m32 0a24.028 24.028 0 0 0 -24 24c0 16.228 22.342 38.756 23.293 39.707a1 1 0 0 0 1.414 0c.951-.951 23.293-23.479 23.293-39.707a24.028 24.028 0 0 0 -24-24z" fill="#db7340"/>
                <circle cx="32" cy="24" fill="#c06030" r="13"/>
                <circle cx="32" cy="24" fill="#fff" opacity="0.25" r="6"/>
              </svg>
            </div>
          </Marker>
        ))}
      </Map>
      <MapHintOverlay dismissed={hintDismissed} onDismiss={() => setHintDismissed(true)} />
    </div>
  );
};

export default CategoryMap;
