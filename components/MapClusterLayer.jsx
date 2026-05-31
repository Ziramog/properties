'use client';
import { useMemo, useCallback } from 'react';
import { Source, Layer } from 'react-map-gl';

export default function MapClusterLayer({ properties, onSelect }) {
  const geojson = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: properties
        .filter((p) => p.coords != null)
        .map((p) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [p.coords.lng, p.coords.lat],
          },
          properties: {
            id: p._id,
            name: p.name,
            price: p.price,
            city: p.location?.city,
            image: p.images?.[0]?.url,
            beds: p.beds,
            baths: p.baths,
            area: p.square_feet,
          },
        })),
    };
  }, [properties]);

  const onClick = useCallback(
    (event) => {
      const map = event.target;
      const features = event.features || [];
      if (features.length === 0) return;

      const feature = features[0];
      const clusterId = feature.properties.cluster_id;

      if (clusterId != null) {
        const source = map.getSource('properties');
        if (!source) return;
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;
          map.flyTo({
            center: feature.geometry.coordinates,
            zoom: Math.min(zoom, 16),
            duration: 500,
          });
        });
      } else {
        const id = feature.properties.id;
        const prop = properties.find((p) => p._id === id);
        if (prop && onSelect) onSelect(prop);
      }
    },
    [properties, onSelect]
  );

  const onMouseEnter = useCallback((event) => {
    if (event.target) event.target.getCanvas().style.cursor = 'pointer';
  }, []);

  const onMouseLeave = useCallback((event) => {
    if (event.target) event.target.getCanvas().style.cursor = '';
  }, []);

  return (
    <Source
      id="properties"
      type="geojson"
      data={geojson}
      cluster={true}
      clusterMaxZoom={14}
      clusterRadius={50}
    >
      <Layer
        id="clusters"
        type="circle"
        filter={['has', 'point_count']}
        paint={{
          'circle-color': '#db7340',
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            24,
            5,  30,
            10, 36,
            20, 42,
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
      <Layer
        id="cluster-count"
        type="symbol"
        filter={['has', 'point_count']}
        layout={{
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 14,
        }}
        paint={{
          'text-color': '#ffffff',
        }}
      />
      <Layer
        id="unclustered-point"
        type="circle"
        filter={['!', ['has', 'point_count']]}
        paint={{
          'circle-radius': 10,
          'circle-color': 'transparent',
          'circle-stroke-width': 3,
          'circle-stroke-color': '#db7340',
        }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    </Source>
  );
}
