'use client';
import { useMemo, useCallback } from 'react';
import { Source, Layer } from 'react-map-gl';

const PIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 64 64"><path d="m32 0a24.028 24.028 0 0 0 -24 24c0 16.228 22.342 38.756 23.293 39.707a1 1 0 0 0 1.414 0c.951-.951 23.293-23.479 23.293-39.707a24.028 24.028 0 0 0 -24-24z" fill="#db7340"/><circle cx="32" cy="24" fill="#c06030" r="13"/><circle cx="32" cy="24" fill="#fff" opacity="0.25" r="6"/></svg>`;

export function addPinImage(map) {
  if (map.hasImage('custom-pin')) return Promise.resolve();
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(PIN_SVG)}`;
  return new Promise((resolve, reject) => {
    map.loadImage(url, (error, image) => {
      if (error) { reject(error); return; }
      if (!map.hasImage('custom-pin')) {
        map.addImage('custom-pin', image);
      }
      resolve();
    });
  });
}

export default function MapClusterLayer({ properties, mapRef, onSelect }) {
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
      const map = mapRef?.current?.getMap?.() || event.target;
      if (!map) return;

      const features = map.queryRenderedFeatures(event.point, {
        layers: ['clusters', 'unclustered-point'],
      });

      if (!features || features.length === 0) return;

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
    [mapRef, properties, onSelect]
  );

  const onMouseEnter = useCallback(() => {
    const map = mapRef?.current?.getMap?.();
    if (map) map.getCanvas().style.cursor = 'pointer';
  }, [mapRef]);

  const onMouseLeave = useCallback(() => {
    const map = mapRef?.current?.getMap?.();
    if (map) map.getCanvas().style.cursor = '';
  }, [mapRef]);

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
        type="symbol"
        filter={['!', ['has', 'point_count']]}
        layout={{
          'icon-image': 'custom-pin',
          'icon-size': 0.8,
          'icon-anchor': 'bottom',
        }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    </Source>
  );
}
