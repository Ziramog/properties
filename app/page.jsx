import Hero from '@/components/Hero';
import CategoryCards from '@/components/sections/CategoryCards';
import FeaturedProperties from '@/components/FeaturedProperties';
import MapProperties from '@/components/MapProperties';
import Testimonials from '@/components/Testimonials';
import ClientMarquee from '@/components/sections/ClientMarquee';
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

      {/* 2. Categories — quick intent selection */}
      <CategoryCards counts={typeCounts} />

      {/* 3. Featured — best inventory showcase */}
      <FeaturedProperties />

      {/* 4. Stats Bar */}
      <StatsBar />

      {/* 5. Dual CTA */}
      <SellerCTA />

      {/* 6. Map — geographic exploration */}
      <MapProperties initialProperties={serializedProperties} />

      {/* 7. Social proof — testimonials */}
      <Testimonials />

      {/* 8. Client logos */}
      <ClientMarquee />

      {/* 9. Agents */}
      <Agents />

      {/* 7. Seller + Investor CTA — lead capture */}
      <SellerCTA />
    </>
  );
};

export default HomePage;
