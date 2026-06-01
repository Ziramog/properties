'use client';
import { useEffect, useState, useMemo } from 'react';
import { Marker, useMap } from 'react-map-gl';
import useSupercluster from 'use-supercluster';
import { motion } from 'framer-motion';

function ClusterMarker({ count, onClick }) {
  const size = count < 5 ? 32 : count < 10 ? 40 : 48;
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
        fontSize: count < 5 ? 12 : 14,
        fontWeight: 600,
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
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

function RipplePin({ onClick, delay }) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="relative flex items-center justify-center cursor-pointer"
      style={{ width: 32, height: 32 }}
    >
      {/* Ripple ring behind the pin */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          border: '1.5px solid rgba(219, 115, 64, 0.5)',
        }}
        animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeOut',
          delay,
        }}
      />
      {/* Pin dot */}
      <div className="relative z-10 transition-transform hover:scale-125">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="6" fill="#db7340" stroke="white" strokeWidth="2.5" />
        </svg>
      </div>
    </div>
  );
}

export default function MapClusterLayer({ properties, onSelect }) {
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
        const delay = getDelayFromId(property.propertyId);
        return (
          <Marker
            key={`property-${property.propertyId}`}
            longitude={longitude}
            latitude={latitude}
            anchor="center"
          >
            <RipplePin
              delay={delay}
              onClick={() => onSelect?.(property)}
            />
          </Marker>
        );
      })}
    </>
  );
}
