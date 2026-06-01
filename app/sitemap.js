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

  const categoryUrls = [
    { url: 'https://properties-srs5.vercel.app/properties?type=Casa', priority: 0.7 },
    { url: 'https://properties-srs5.vercel.app/properties?type=Departamento', priority: 0.7 },
    { url: 'https://properties-srs5.vercel.app/properties?type=Campo', priority: 0.7 },
    { url: 'https://properties-srs5.vercel.app/properties?type=Terreno', priority: 0.7 },
    { url: 'https://properties-srs5.vercel.app/properties?type=Inmueble+Comercial', priority: 0.7 },
    { url: 'https://properties-srs5.vercel.app/properties?operation=venta', priority: 0.7 },
    { url: 'https://properties-srs5.vercel.app/properties?operation=alquiler', priority: 0.7 },
  ];

  const now = new Date().toISOString();

  return [
    {
      url: 'https://properties-srs5.vercel.app',
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://properties-srs5.vercel.app/properties',
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://properties-srs5.vercel.app/properties/map-all',
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...categoryUrls.map((c) => ({
      url: c.url,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: c.priority,
    })),
    ...propertyUrls,
  ];
}
