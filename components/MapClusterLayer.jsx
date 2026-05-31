'use client';
import { useMemo } from 'react';
import { Source, Layer } from 'react-map-gl';

export default function MapClusterLayer({ properties }) {
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
      />
    </Source>
  );
}
