import connectDB from '@/config/database';
import Property from '@/models/Property';

export default async function sitemap() {
  await connectDB();

  const properties = await Property.find({}).select('_id updatedAt').lean();

  const propertyUrls = properties.map((p) => ({
    url: `https://properties-srs5.vercel.app/properties/${p._id.toString()}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: 'https://properties-srs5.vercel.app',
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://properties-srs5.vercel.app/properties',
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://properties-srs5.vercel.app/contact',
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...propertyUrls,
  ];
}
