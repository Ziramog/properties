import Hero from '@/components/Hero';
import CategoryCards from '@/components/sections/CategoryCards';
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

  // Compute type counts for category cards
  const typeCounts = {};
  serializedProperties.forEach((p) => {
    if (p.type) {
      typeCounts[p.type] = (typeCounts[p.type] || 0) + 1;
    }
  });

  return (
    <>
      {/* 1. Hero — emotional hook + search + trust strip */}
      <Hero />

      {/* 2. Stats Bar — social proof metrics */}
      <StatsBar />

      {/* 3. Categories — quick intent selection */}
      <CategoryCards counts={typeCounts} />

      {/* 4. Featured — best inventory showcase */}
      <FeaturedPropertiesCarousel properties={serializedProperties.filter(p => p.is_featured && (p.images || []).length > 0).slice(0, 6)} />

      {/* 5. Map — geographic exploration */}
      <div className="relative rounded-2xl overflow-hidden" style={{ isolation: 'isolate' }}>
        <MapProperties initialProperties={serializedProperties} />
      </div>

      {/* 6. CTA — seller + investor */}
      <SellerCTA />

      {/* 7. Agents */}
      <Agents />
    </>
  );
};

export default HomePage;
