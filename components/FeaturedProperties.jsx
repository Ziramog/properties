import FeaturedPropertyCard from '@/components/FeaturedPropertyCard';
import ScrollReveal from '@/components/shared/ScrollReveal';
import connectDB from '@/config/database';
import Property from '@/models/Property';

const FeaturedProperties = async () => {
  await connectDB();

  const properties = await Property.find({
    is_featured: true,
  }).limit(6).lean();

  if (properties.length === 0) {
    return null;
  }

  return (
    <section className='bg-white py-20 px-6'>
      <div className='max-w-7xl mx-auto'>

        {/* Section Header — left-aligned per demo */}
        <div className='flex justify-between items-end mb-10'>
          <div className='flex flex-col gap-2.5'>
            <ScrollReveal>
              <span
                className='text-[11px] font-bold uppercase tracking-[0.1em] text-primary'
              >
                PROPIEDADES DESTACADAS
              </span>
            </ScrollReveal>
            <ScrollReveal delay={50}>
              <h2 className='text-[32px] font-semibold text-heading leading-tight tracking-[-0.01em]'>
                Seleccionadas para vos
              </h2>
            </ScrollReveal>
          </div>
          <ScrollReveal>
            <a
              href='/properties'
              className='text-primary text-sm font-medium hover:underline hidden md:block'
            >
              Ver todas →
            </a>
          </ScrollReveal>
        </div>

        {/* Cards Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {properties.map((property, i) => (
            <ScrollReveal key={property._id.toString()} delay={i * 80}>
              <FeaturedPropertyCard
                property={{
                  ...property,
                  _id: property._id.toString(),
                }}
              />
            </ScrollReveal>
          ))}
        </div>

        {/* Mobile "Ver todas" link */}
        <ScrollReveal className='sm:hidden mt-6 text-center'>
          <a href='/properties' className='text-primary text-sm font-medium hover:underline'>
            Ver todas →
          </a>
        </ScrollReveal>

        {/* Bottom CTA */}
        <ScrollReveal delay={200}>
          <div className='text-center mt-12'>
            <a
              href='/properties'
              className='inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-px'
            >
              Explorar todas las propiedades
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
              </svg>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FeaturedProperties;
