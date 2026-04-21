import Hero from '@/components/Hero';
import FeaturedProperties from '@/components/FeaturedProperties';
import MapProperties from '@/components/MapProperties';
import Testimonials from '@/components/Testimonials';
import Clients from '@/components/Clients';
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
      <Hero />
      <MapProperties initialProperties={serializedProperties} />
      <FeaturedProperties />
      <Testimonials />
      <Clients />
    </>
  );
};

export default HomePage;
