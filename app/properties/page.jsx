export const dynamic = 'force-dynamic';

import PropertyCard from '@/components/PropertyCard';
import PropertyFilters from '@/components/PropertyFilters';
import Pagination from '@/components/Pagination';
import connectDB from '@/config/database';
import Property from '@/models/Property';

const PropertiesPage = async ({ searchParams }) => {
  await connectDB();

  // Parse filter params from URL
  const { pageSize = 9, page = 1, type, city, minPrice, maxPrice, bedrooms, granInversion } = searchParams;

  // Build MongoDB filter
  const filter = {};
  if (granInversion === 'true') {
    // Show all high-value properties: price >= 300000 USD OR area >= 10000 m²
    // We handle this client-side on the full dataset; here just skip type filter
  } else {
    if (type && type !== 'Todos') filter.type = type;
  }
  if (city && city !== 'Todas las ciudades') filter['location.city'] = city;
  if (minPrice) filter['rates.monthly'] = { ...filter['rates.monthly'], $gte: Number(minPrice) };
  if (maxPrice) filter['rates.monthly'] = { ...filter['rates.monthly'], $lte: Number(maxPrice) };
  if (bedrooms) {
    const num = parseInt(bedrooms.replace('+', ''));
    filter.beds = { $gte: num };
  }

  const skip = (Number(page) - 1) * Number(pageSize);
  const total = await Property.countDocuments(filter);
  const properties = await Property.find(filter).skip(skip).limit(Number(pageSize));

  const showPagination = total > Number(pageSize);

  // For Gran Inversión: fetch all (no pagination) and filter client-side
  let filteredProperties = properties.map((p) => ({
    ...p.toObject(),
    _id: p._id.toString(),
    owner: p.owner?.toString(),
  }));

  if (granInversion === 'true') {
    const { isGranInversion } = await import('@/utils/filterProperties');
    filteredProperties = filteredProperties.filter(isGranInversion);
  }

  const title = granInversion === 'true'
    ? 'Grandes Inversiones'
    : total > 0 ? `${total} propiedades encontradas` : 'Nuestras Propiedades';

  return (
    <>
      <section className='bg-transparent pt-4'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <PropertyFilters variant='full' />
        </div>
      </section>
      <section className='bg-[#F8F9FA] px-4 py-6'>
        <div className='max-w-7xl mx-auto px-4'>
          <h1 className='text-2xl mb-6 font-bold text-[#1A1A2E]'>
            {title}
          </h1>
          {filteredProperties.length === 0 ? (
            <div className='text-center py-16'>
              <p className='text-gray-500 text-lg mb-4'>
                No se encontraron propiedades con esos filtros.
              </p>
              <p className='text-gray-400 text-sm'>
                Probá cambiando los filtros o{' '}
                <a href='/properties' className='text-[#E94560] hover:underline'>
                  ver todas las propiedades
                </a>
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredProperties.map((property) => (
                <PropertyCard
                  property={property}
                  key={property._id}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default PropertiesPage;
