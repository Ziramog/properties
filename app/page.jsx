import Hero from '@/components/Hero';
import FeaturedProperties from '@/components/FeaturedProperties';
import MapProperties from '@/components/MapProperties';
import Testimonials from '@/components/Testimonials';
import Clients from '@/components/Clients';
import connectDB from '@/config/database';
import Property from '@/models/Property';

export const dynamic = 'force-dynamic';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

// Cache geocoded coords per city to avoid redundant API calls
const geoCache = {};

async function geocodeCity(city) {
  if (!city) return null;
  if (geoCache[city]) return geoCache[city];

  // Default coords for known cities in Córdoba
  const knownCities = {
    'Alta Gracia': [-31.6525, -64.4397],
    'Cordoba': [-31.4201, -64.1888],
    'Córdoba': [-31.4201, -64.1888],
    'Villa Carlos Paz': [-31.4247, -64.4978],
    'Carlos Paz': [-31.4247, -64.4978],
    'San Francisco': [-31.4279, -62.0857],
    'Rio Tercero': [-32.0278, -64.1055],
    'Jesus Maria': [-30.9815, -64.0932],
    'Jesús María': [-30.9815, -64.0932],
    'La Falda': [-31.0833, -64.4833],
    'Falda del Carmen': [-31.0833, -64.4833],
    'Villa General Belgrano': [-31.9667, -64.5500],
    'Miramar': [-31.5167, -64.2333],
    'Anisacate': [-31.7000, -64.4167],
    'Despeñaderos': [-32.1500, -64.3000],
    'Huerta Grande': [-31.0667, -64.5000],
    'La Paisanita': [-31.0833, -64.5000],
    'La Serranita': [-31.7167, -64.4000],
    'Los Aromos': [-31.6833, -64.3833],
    'Los Gigantes': [-31.9167, -64.6000],
    'Los Molinos': [-31.7667, -64.3667],
    'Potrero de Garay': [-31.7500, -64.4500],
    'San Clemente': [-31.8833, -64.4667],
    'Santa Ana': [-31.6333, -64.3667],
    'Mendiolaza': [-31.6167, -64.3167],
    'Unquillo': [-31.5833, -64.3167],
    'Rio Ceballos': [-31.5833, -64.3167],
    'Villa Allende': [-31.3500, -64.3000],
    'Cosquin': [-31.2000, -64.4500],
    'La Calera': [-31.4500, -64.3167],
    'Saldan': [-31.3333, -64.3000],
    'Malagueño': [-31.5500, -64.4167],
    'Toledo': [-31.5333, -64.3833],
  };

  const key = city.trim();
  if (knownCities[key]) {
    geoCache[key] = knownCities[key];
    return knownCities[key];
  }

  // Fallback: Nominatim API (rate-limited to 1 req/sec so we cache aggressively)
  try {
    const params = new URLSearchParams({
      q: `${city}, Córdoba, Argentina`,
      format: 'json',
      limit: '1',
    });
    const res = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: { 'User-Agent': 'RoggeroRoma-PropertyPulse/1.0' },
      next: { revalidate: 86400 }, // cache for 24h
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data[0]) {
        const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        geoCache[key] = coords;
        return coords;
      }
    }
  } catch {
    // silently fail — map will just skip this property
  }

  geoCache[key] = null;
  return null;
}

const HomePage = async () => {
  await connectDB();

  const properties = await Property.find({}).lean();

  // Geocode all properties in parallel
  const geocodePromises = properties.map(async (p) => {
    const coords = await geocodeCity(p.location?.city);
    return { id: p._id.toString(), coords };
  });

  const results = await Promise.all(geocodePromises);
  const geoMap = Object.fromEntries(results.map((r) => [r.id, r.coords]));

  const serializedProperties = properties.map((p) => ({
    ...p,
    _id: p._id.toString(),
    owner: p.owner?.toString(),
    createdAt: p.createdAt?.toISOString(),
    updatedAt: p.updatedAt?.toISOString(),
    // Inject geocoded coords so MapView can use them directly
    geoLat: geoMap[p._id.toString()]?.[0] ?? null,
    geoLng: geoMap[p._id.toString()]?.[1] ?? null,
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
