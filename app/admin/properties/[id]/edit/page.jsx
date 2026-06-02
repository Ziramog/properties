export const metadata = {
  title: 'Editar Propiedad',
  robots: { index: false, follow: false },
};

import PropertyEditForm from '@/components/PropertyEditForm';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import { convertToSerializeableObject } from '@/utils/convertToObject';

const PropertyEditPage = async ({ params }) => {
  await connectDB();

  const propertyDoc = await Property.findById(params.id).lean();
  const property = convertToSerializeableObject(propertyDoc);

  if (!property) {
    return (
      <h1 className='text-center text-2xl font-bold mt-10 text-white'>
        Propiedad No Encontrada
      </h1>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-3xl'>
      <div className='bg-[#111] border border-[#333] px-6 py-8 shadow-xl rounded-xl'>
        <PropertyEditForm property={property} />
      </div>
    </div>
  );
};

export default PropertyEditPage;
