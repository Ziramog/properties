import Hero from '@/components/Hero';
import FeaturedPropertiesCarousel from '@/components/FeaturedPropertiesCarousel';
import MapProperties from '@/components/MapProperties';
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

      {/* 2. Featured — best inventory showcase */}
      <FeaturedPropertiesCarousel properties={serializedProperties.filter(p => p.is_featured && (p.images || []).length > 0).slice(0, 6)} />

      {/* 3. Map — geographic exploration */}
      <div className="bg-white rounded-3xl overflow-hidden max-w-[92vw] mx-auto">
        <MapProperties initialProperties={serializedProperties} />
      </div>

      {/* 4. Stats Bar — social proof metrics */}
      <StatsBar />

      {/* 5. CTA — seller + investor */}
      <SellerCTA />

      {/* 6. Agents */}
      <Agents />
    </>
  );
};

export default HomePage;