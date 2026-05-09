import Hero from '@/components/Hero';
import FeaturedPropertiesCarousel from '@/components/FeaturedPropertiesCarousel';
import SellerCTA from '@/components/sections/SellerCTA';
import StatsBar from '@/components/sections/StatsBar';
import Agents from '@/components/sections/Agents';
import connectDB from '@/config/database';
import Property from '@/models/Property';

export const dynamic = 'force-dynamic';

const HomePage = async () => {
  await connectDB();

  const properties = await Property.find({}).lean();

  const serializedProperties = properties.map((p) => ({
    ...p,
    _id: p._id.toString(),
    owner: p.owner?.toString(),
    createdAt: p.createdAt?.toISOString(),
    updatedAt: p.updatedAt?.toISOString(),
  }));

  return (
    <>
      {/* 1. Hero — emotional hook + search + trust strip */}
      <Hero />

      {/* 2. Stats Bar — social proof metrics */}
      <div style={{ paddingTop: '16px' }}>
        <StatsBar />
      </div>

      {/* 3. Featured — best inventory showcase */}
      <div id="propiedades-destacadas">
        <FeaturedPropertiesCarousel properties={serializedProperties.filter(p => p.is_featured && (p.images || []).length > 0).slice(0, 6)} />
      </div>

      {/* 4. CTA — seller + investor */}
      <SellerCTA />

      {/* 5. Agents — Roggero & Roma Historia */}
      <div id="nuestra-historia">
        <Agents />
      </div>
    </>
  );
};

export default HomePage;