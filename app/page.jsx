import Hero from '@/components/Hero';
import FeaturedProperties from '@/components/FeaturedProperties';
import MapProperties from '@/components/MapProperties';
import connectDB from '@/config/database';
import Property from '@/models/Property';

const HomePage = async () => {
  await connectDB();

  // Fetch properties for the map view
  const properties = await Property.find({}).lean();

  // Serialize the properties for client components
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
    </>
  );
};

export default HomePage;
