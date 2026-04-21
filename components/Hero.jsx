import PropertyFilters from './PropertyFilters';

const Hero = () => {
  return (
    <section className="relative bg-[#1A1A2E] py-16 md:py-24">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Encontrá tu próxima propiedad
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Más de 10 años guiando decisiones inmobiliarias en Córdoba
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <PropertyFilters variant="full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
