'use client';
import { useEffect, useState, useMemo } from 'react';
import { Marker, useMap } from 'react-map-gl';
import useSupercluster from 'use-supercluster';
import { motion } from 'framer-motion';

function ClusterMarker({ count, onClick }) {
  const size = count < 5 ? 36 : count < 10 ? 44 : 52;
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="flex items-center justify-center rounded-full cursor-pointer transition-transform hover:scale-110"
      style={{
        width: size,
        height: size,
        backgroundColor: '#db7340',
        border: '2px solid white',
        color: 'white',
        fontSize: count < 5 ? 13 : 15,
        fontWeight: 600,
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {count}
    </div>
  );
}

// Deterministic pseudo-random delay from string id (avoids hydration mismatch)
function getDelayFromId(id) {
  let hash = 0;
  for (let i = 0; i < String(id).length; i++) {
    hash = ((hash << 5) - hash + String(id).charCodeAt(i)) | 0;
  }
  return (Math.abs(hash) % 2000) / 1000; // 0 - 2 seconds
}

function NormalPin({ onClick, delay }) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="relative flex items-center justify-center cursor-pointer"
      style={{ width: 44, height: 44 }}
    >
      {/* Ripple ring behind the pin */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          border: '2px solid rgba(219, 115, 64, 0.45)',
        }}
        animate={{ scale: [1, 2.4], opacity: [0.55, 0] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeOut',
          delay,
        }}
      />
      {/* Pin dot */}
      <div className="relative z-10 transition-transform hover:scale-125">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="7" fill="#db7340" stroke="white" strokeWidth="2.5" />
        </svg>
      </div>
    </div>
  );
}

function SelectedPin({ onClick }) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="relative cursor-pointer"
      style={{ width: 40, height: 52 }}
    >
      {/* Double ripple for selected */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: '50%',
          top: '78%',
          width: 24,
          height: 24,
          marginLeft: -12,
          marginTop: -12,
          borderRadius: '50%',
          border: '2px solid rgba(219, 115, 64, 0.6)',
        }}
        animate={{ scale: [1, 3], opacity: [0.7, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: '50%',
          top: '78%',
          width: 24,
          height: 24,
          marginLeft: -12,
          marginTop: -12,
          borderRadius: '50%',
          border: '1.5px solid rgba(219, 115, 64, 0.4)',
        }}
        animate={{ scale: [1, 3.5], opacity: [0.5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
      />
      {/* Location pin SVG */}
      <svg
        width="40"
        height="52"
        viewBox="0 0 40 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 transition-transform hover:scale-110"
        style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.35))' }}
      >
        <path
          d="M20 0C9.2 0 0.8 8.4 0.8 19.2c0 14.4 17.6 30.4 18.4 31.2 0.4 0.4 0.8 0.4 1.6 0 0.8-0.8 18.4-16.8 18.4-31.2C39.2 8.4 30.8 0 20 0z"
          fill="#db7340"
        />
        <circle cx="20" cy="19" r="8" fill="white" />
        <circle cx="20" cy="19" r="5" fill="#db7340" />
      </svg>
    </div>
  );
}

export default function MapClusterLayer({ properties, onSelect, selectedId }) {
  const { current: map } = useMap();
  const [bounds, setBounds] = useState([-180, -85, 180, 85]);
  const [zoom, setZoom] = useState(10);

  useEffect(() => {
    if (!map) return;
    const updateBounds = () => {
      const b = map.getBounds();
      if (!b) return;
      setBounds([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()]);
      setZoom(map.getZoom());
    };
    updateBounds();
    map.on('move', updateBounds);
    return () => map.off('move', updateBounds);
  }, [map]);

  const points = useMemo(() => {
    return properties
      .filter((p) => p.coords != null)
      .map((p) => ({
        type: 'Feature',
        properties: {
          cluster: false,
          propertyId: p._id,
          ...p,
        },
        geometry: {
          type: 'Point',
          coordinates: [p.coords.lng, p.coords.lat],
        },
      }));
  }, [properties]);

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 60, maxZoom: 16 },
  });

  return (
    <>
      {clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const { cluster: isCluster, point_count: pointCount } = cluster.properties;

        if (isCluster) {
          return (
            <Marker key={`cluster-${cluster.id}`} longitude={longitude} latitude={latitude} anchor="center">
              <ClusterMarker
                count={pointCount}
                onClick={() => {
                  if (!supercluster || !map) return;
                  const expansionZoom = Math.min(
                    supercluster.getClusterExpansionZoom(cluster.id),
                    20
                  );
                  map.flyTo({ center: [longitude, latitude], zoom: expansionZoom, duration: 500 });
                }}
              />
            </Marker>
          );
        }

        const property = cluster.properties;
        const isSelected = selectedId === property.propertyId;

        if (isSelected) {
          return (
            <Marker
              key={`property-${property.propertyId}`}
              longitude={longitude}
              latitude={latitude}
              anchor="bottom"
            >
              <SelectedPin onClick={() => onSelect?.(property)} />
            </Marker>
          );
        }

        const delay = getDelayFromId(property.propertyId);
        return (
          <Marker
            key={`property-${property.propertyId}`}
            longitude={longitude}
            latitude={latitude}
            anchor="center"
          >
            <NormalPin delay={delay} onClick={() => onSelect?.(property)} />
          </Marker>
        );
      })}
    </>
  );
}
