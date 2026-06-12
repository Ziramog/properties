
import connectDB from '@/config/database';
import Property from '@/models/Property';
import dynamic from 'next/dynamic';
import MapErrorBoundary from '@/components/shared/MapErrorBoundary';
import { convertToSerializeableObject } from '@/utils/convertToObject';

const MapAllProperties = dynamic(() => import('@/components/MapAllProperties'), {
  ssr: false,
});

export const metadata = {
  title: 'Mapa de Propiedades',
  description: 'Explorá todas las propiedades de Roggero & Roma Inmobiliaria en el mapa interactivo. Casas, departamentos, campos y terrenos en Alta Gracia y toda Córdoba.',
};

export const revalidate = 600;

export default async function MapAllPage() {
  await connectDB();
  const docs = await Property.find({ is_published: { $ne: false } }).lean();
  const properties = docs.map(convertToSerializeableObject);

  return (
    <MapErrorBoundary>
      <MapAllProperties initialProperties={properties} />
    </MapErrorBoundary>
  );
}