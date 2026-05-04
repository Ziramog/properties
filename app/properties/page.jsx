export const dynamic = 'force-dynamic';

import FeaturedPropertyCard from '@/components/FeaturedPropertyCard';
import Pagination from '@/components/Pagination';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import User from '@/models/User';
import PropertiesSearch from '@/components/PropertiesSearch';
import { getSessionUser } from '@/utils/getSessionUser';

const PropertiesPage = async ({ searchParams }) => {
  await connectDB();

  const { pageSize = 9, page = 1, type, term, minPrice, maxPrice, bedrooms, baths, operation, area, propertyType, status, sort, favoritos, granInversion } = searchParams;

  const filter = {};

  // Gran Inversion — handled client-side
  if (granInversion !== 'true') {
    if (type && type !== 'Todos') filter.type = type;
  }
  // term = city search from PropertiesSearch
  if (term && term !== 'Ciudad') filter['location.city'] = { $regex: term, $options: 'i' };
  if (bedrooms) {
    const num = parseInt(bedrooms.replace('+', ''));
    filter.beds = { $gte: num };
  }
  if (baths) {
    const num = parseInt(baths.replace('+', ''));
    filter.baths = { $gte: num };
  }
  if (operation) filter.operation = operation;
  if (area) {
    const [minArea, maxArea] = area.split('-');
    filter.square_feet = {};
    if (minArea && minArea !== '0') filter.square_feet.$gte = Number(minArea);
    if (maxArea && maxArea !== '0') filter.square_feet.$lte = Number(maxArea);
  }
  if (propertyType) {
    const types = propertyType.split('|');
    if (types.length === 1) {
      filter.property_type = types[0];
    } else {
      filter.property_type = { $in: types };
    }
  }
  if (status) {
    const statuses = status.split('|');
    if (statuses.length === 1) {
      filter.status = statuses[0];
    } else {
      filter.status = { $in: statuses };
    }
  }

  // Favoritos filter: only show properties in user's bookmarks
  let bookmarkedIds = [];
  if (favoritos === 'true') {
    const sessionUser = await getSessionUser();
    if (sessionUser?.userId) {
      const user = await User.findById(sessionUser.userId).lean();
      bookmarkedIds = (user?.bookmarks || []).map((b) => b.toString());
      if (bookmarkedIds.length > 0) {
        filter._id = { $in: bookmarkedIds };
      }
    }
  }

  // Build sort object — use createdAt since rates.monthly is null for venta properties
  let sortObj = {};
  if (sort === 'newest') sortObj = { createdAt: -1 };
  else sortObj = { createdAt: -1 }; // default newest

  const skip = (Number(page) - 1) * Number(pageSize);
  const total = await Property.countDocuments(filter);
  const properties = await Property.find(filter).sort(sortObj).skip(skip).limit(Number(pageSize));

  const showPagination = total > Number(pageSize);

  // Parse price string "USD 320,000" to number for filtering
  const parsePrice = (priceStr) => {
    if (!priceStr) return null;
    const cleaned = priceStr.replace(/[^0-9]/g, '');
    if (!cleaned) return null;
    return parseInt(cleaned, 10);
  };

  // Apply price filter client-side (price is stored as string "USD XXX,XXX" in DB)
  const priceMin = minPrice ? Number(minPrice) : null;
  const priceMax = maxPrice ? Number(maxPrice) : null;

  let filteredProperties = properties.map((p) => ({
    ...p.toObject(),
    _id: p._id.toString(),
    owner: p.owner?.toString(),
  }));

  // Price filter (client-side since price is a formatted string in DB)
  if (priceMin || priceMax) {
    filteredProperties = filteredProperties.filter((p) => {
      const numericPrice = parsePrice(p.price);
      if (numericPrice === null) return true; // keep "Consultar" properties
      if (priceMin && numericPrice < priceMin) return false;
      if (priceMax && numericPrice > priceMax) return false;
      return true;
    });
  }

  if (granInversion === 'true') {
    const { isGranInversion } = await import('@/utils/filterProperties');
    filteredProperties = filteredProperties.filter(isGranInversion);
  }

  const title = favoritos === 'true'
    ? 'Mis Favoritos'
    : granInversion === 'true'
    ? 'Grandes Inversiones'
    : total > 0 ? `${total} propiedades encontradas` : 'Nuestras Propiedades';

  const currentFilters = {
    term: searchParams.term || '',
    address: searchParams.address || '',
    operation: operation || 'venta',
    area: area || '',
    price: searchParams.price || '',
    minPrice: minPrice || '',
    maxPrice: maxPrice || '',
    bedrooms: bedrooms || '',
    baths: baths || '',
    'property-type': propertyType ? propertyType.split('|') : [],
    status: status ? status.split('|') : [],
    sort: sort || 'price-desc',
    favoritos: favoritos || '',
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header + Filters — full dark band */}
      <section className="bg-[#111] px-4 pt-24 md:pt-28 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Search */}
          <PropertiesSearch currentFilters={currentFilters} />
        </div>
      </section>

      {/* Results */}
      <section className="px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl border border-[#eee] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-[#f5f5f5] flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-[#999]">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <p className="text-[15px] font-semibold text-[#333] mb-2">
                No se encontraron propiedades
              </p>
              <p className="text-[13px] text-[#999]">
                Probá cambiando los filtros o{' '}
                <a href="/properties" className="text-[#652660] hover:underline font-medium">ver todas</a>
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 p-4 md:p-6">
              {filteredProperties.map((property) => (
                <FeaturedPropertyCard property={property} key={property._id} />
              ))}
            </div>
          )}

          {showPagination && (
            <div className="mt-4 px-4 md:px-6 pb-6">
              <Pagination page={parseInt(page)} pageSize={parseInt(pageSize)} totalItems={total} />
            </div>
          )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertiesPage;
