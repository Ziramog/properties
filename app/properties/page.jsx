export const dynamic = 'force-dynamic';

import PropertyCard from '@/components/PropertyCard';
import Pagination from '@/components/Pagination';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import PropertiesFiltersInline from '@/components/PropertiesFiltersInline';

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
  if (city && city !== 'Todas las ciudades' && city !== 'Ciudad') filter['location.city'] = city;
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

  // Current filter values for the inline component
  const currentFilters = {
    type: type || 'Todos',
    city: city || 'Ciudad',
    minPrice: minPrice || '',
    maxPrice: maxPrice || '',
    bedrooms: bedrooms || '',
  };

  return (
    <div className="min-h-screen bg-[#DDD9D3]">
      {/* Header + Filters */}
      <section className="px-4 pt-28 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--color-brand)] mb-1">
                {granInversion === 'true' ? 'GRAN INVERSIÓN' : 'PROPIEDADES'}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-ink)]">
                {title}
              </h1>
            </div>
            <span className="text-sm text-[var(--color-ink-tertiary)] font-medium hidden md:block">
              {total > 0 ? `${total} resultados` : ''}
            </span>
          </div>

          {/* Inline Expandable Filters */}
          <PropertiesFiltersInline currentFilters={currentFilters} />
        </div>
      </section>

      {/* Results */}
      <section className="px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-[var(--color-ink-tertiary)]">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <p className="text-[15px] font-semibold text-[var(--color-ink)] mb-2">
                No se encontraron propiedades
              </p>
              <p className="text-[13px] text-[var(--color-ink-tertiary)]">
                Probá cambiando los filtros o{' '}
                <a href="/properties" className="text-[var(--color-brand)] hover:underline font-medium">ver todas</a>
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard property={property} key={property._id} />
              ))}
            </div>
          )}

          {showPagination && (
            <Pagination page={parseInt(page)} pageSize={parseInt(pageSize)} totalItems={total} />
          )}
        </div>
      </section>
    </div>
  );
};

export default PropertiesPage;
