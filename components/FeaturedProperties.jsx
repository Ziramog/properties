import FeaturedPropertyCard from '@/components/FeaturedPropertyCard';
import connectDB from '@/config/database';
import Property from '@/models/Property';

const FeaturedProperties = async () => {
  await connectDB();

  const properties = await Property.find({
    is_featured: true,
  }).lean();

  if (properties.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#F8F9FA] px-4 pt-12 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3">
            Propiedades Destacadas
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubrí las mejores opciones seleccionadas para vos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <FeaturedPropertyCard
              key={property._id}
              property={{
                ...property,
                _id: property._id.toString(),
              }}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="/properties"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1A2E] text-white rounded-lg font-medium hover:bg-[#E94560] transition-colors"
          >
            Ver todas las propiedades
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
