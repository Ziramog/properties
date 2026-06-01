export const dynamic = 'force-dynamic';

import connectDB from '@/config/database';
import Property from '@/models/Property';
import MapAllProperties from '@/components/MapAllProperties';
import MapErrorBoundary from '@/components/shared/MapErrorBoundary';
import { convertToSerializeableObject } from '@/utils/convertToObject';

export const metadata = {
  title: 'Mapa de Propiedades',
  description: 'Explorá todas las propiedades de Roggero & Roma Inmobiliaria en el mapa interactivo. Casas, departamentos, campos y terrenos en Alta Gracia y toda Córdoba.',
};

export default async function MapAllPage() {
  await connectDB();
  const docs = await Property.find({}).lean();
  const properties = docs.map(convertToSerializeableObject);

  return (
    <MapErrorBoundary>
      <MapAllProperties initialProperties={properties} />
    </MapErrorBoundary>
  );
}