export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Propiedades',
  description: 'Explorá todas las propiedades en venta y alquiler de Roggero & Roma Inmobiliaria en Alta Gracia, Córdoba. Casas, departamentos, campos y más.',
};

import FeaturedPropertyCard from '@/components/FeaturedPropertyCard';
import Pagination from '@/components/Pagination';
import SortBar from '@/components/shared/SortBar';
import ScrollReveal from '@/components/shared/ScrollReveal';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import User from '@/models/User';
import PropertiesSearch from '@/components/PropertiesSearch';
import { getSessionUser } from '@/utils/getSessionUser';
import ScrollToTop from '@/components/ScrollToTop';

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

  const total = await Property.countDocuments(filter);
  const properties = await Property.find(filter).sort(sortObj);

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

  // Apply sorting client-side (price is stored as formatted string in DB)
  if (sort === 'price-asc') {
    filteredProperties.sort((a, b) => (parsePrice(a.price) || 0) - (parsePrice(b.price) || 0));
  } else if (sort === 'price-desc') {
    filteredProperties.sort((a, b) => (parsePrice(b.price) || 0) - (parsePrice(a.price) || 0));
  }

  const title = favoritos === 'true'
    ? 'Mis Favoritos'
    : granInversion === 'true'
    ? 'Grandes Inversiones'
    : type && type !== 'Todos'
    ? type === 'Inmueble Comercial' ? 'Inmuebles Comerciales' : `${type}s`
    : term && term !== 'Ciudad'
    ? `Propiedades en ${term}`
    : 'Nuestras Propiedades';

  const subtitle = type && type !== 'Todos'
    ? `Búsqueda en ${type === 'Inmueble Comercial' ? 'INMUEBLES COMERCIALES' : type.toUpperCase() + 'S'}`
    : term && term !== 'Ciudad'
    ? `Búsqueda en ${term.toUpperCase()}`
    : 'Búsqueda de Propiedades';

  const isFiltered = !!(type && type !== 'Todos') || !!(term && term !== 'Ciudad');

  const currentFilters = {
    term: searchParams.term || '',
    address: searchParams.address || '',
    tipo: type || '',
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
      <ScrollToTop searchParams={searchParams} isFiltered={isFiltered} />
      {/* Header + Filters — full dark band */}
      <section className="bg-black px-4 md:px-[50px] pt-24 md:pt-28 pb-6">
        {/* Search */}
        <PropertiesSearch currentFilters={currentFilters} title={title} />
      </section>

      {/* Sort Bar */}
      <div id="resultados" className="bg-white px-4 md:px-[50px]">
        <div className="pt-6 pb-2 js-animate">
          <div className="flex items-center gap-3">
            <h2 className="text-[28px] md:text-[40px] font-normal text-[#0F172A] leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              {subtitle}
            </h2>
            <span className="w-7 h-px bg-[var(--color-brand)] flex-shrink-0" />
          </div>
        </div>
        <SortBar
          total={total}
          activeSort={sort}
          searchParams={searchParams}
        />
      </div>

      {/* Results */}
      <section className="bg-white px-4 md:px-[50px] pb-12">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-20 js-animate">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {filteredProperties.map((property, i) => (
                <ScrollReveal key={property._id} delay={i * 80}>
                  <FeaturedPropertyCard property={property} />
                </ScrollReveal>
              ))}
            </div>
          )}
      </section>
    </div>
  );
};

export default PropertiesPage;
