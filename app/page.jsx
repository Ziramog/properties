import Hero from '@/components/Hero';
import FeaturedPropertiesCarousel from '@/components/FeaturedPropertiesCarousel';
import SellerCTA from '@/components/sections/SellerCTA';
import StatsBar from '@/components/sections/StatsBar';
import Agents from '@/components/sections/Agents';
import ReviewsSection from '@/components/ReviewsSection';
import Clients from '@/components/Clients';
import ScrollReveal from '@/components/shared/ScrollReveal';
import JsonLd from '@/components/JsonLd';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import { getSiteConfig } from '@/utils/getSiteConfig';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Inicio',
  description: 'Roggero & Roma — Agencia inmobiliaria en Alta Gracia, Córdoba. Compra, venta y alquiler de propiedades con más de 10 años de experiencia.',
};

const HomePage = async () => {
  await connectDB();

  const properties = await Property.find({ is_published: { $ne: false } }).lean();
  const siteConfig = await getSiteConfig();

  const serializedProperties = properties.map((p) => ({
    ...p,
    _id: p._id.toString(),
    owner: p.owner?.toString(),
    createdAt: p.createdAt?.toISOString(),
    updatedAt: p.updatedAt?.toISOString(),
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://properties-srs5.vercel.app/#organization',
        name: 'Roggero & Roma',
        url: 'https://properties-srs5.vercel.app',
        logo: 'https://properties-srs5.vercel.app/images/ISOTIPO%20R&R-Photoroom.png',
        sameAs: [
          'https://www.facebook.com/roggeroyroma',
          'https://www.instagram.com/roggeroyroma',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+54-9-3547-563911',
          contactType: 'sales',
          areaServed: 'AR',
          availableLanguage: 'Spanish',
        },
      },
      {
        '@type': 'RealEstateAgent',
        '@id': 'https://properties-srs5.vercel.app/#realestateagent',
        name: 'Roggero & Roma',
        image: 'https://properties-srs5.vercel.app/images/ISOTIPO%20R&R-Photoroom.png',
        url: 'https://properties-srs5.vercel.app',
        telephone: siteConfig.contactPhone || '+54 9 9354 7563911',
        email: siteConfig.contactEmail || 'info@roggeroyroma.com.ar',
        address: {
          '@type': 'PostalAddress',
          streetAddress: siteConfig.contactAddress || 'Blvd. Carlos Pellegrini 710',
          addressLocality: 'Alta Gracia',
          addressRegion: 'Córdoba',
          postalCode: 'X5186',
          addressCountry: 'AR',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: -31.6529,
          longitude: -64.4286,
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00',
        },
        priceRange: '$$$',
      },
      {
        '@type': 'WebSite',
        '@id': 'https://properties-srs5.vercel.app/#website',
        url: 'https://properties-srs5.vercel.app',
        name: 'Roggero & Roma Inmobiliaria',
        publisher: { '@id': 'https://properties-srs5.vercel.app/#organization' },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://properties-srs5.vercel.app/properties?term={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <div>
      <JsonLd data={jsonLd} />
      {/* 1. Hero — emotional hook + search + trust strip */}
      <Hero title={siteConfig.heroTitle} subtitle={siteConfig.heroSubtitle} />

      {/* 2. Stats Bar — social proof metrics (flush with hero) */}
      <StatsBar />

      {/* 3. Featured — best inventory showcase */}
      <div id="propiedades-destacadas">
        <FeaturedPropertiesCarousel properties={serializedProperties.filter(p => p.is_featured && (p.images || []).length > 0).slice(0, 6)} />
      </div>

      {/* 4. CTA — seller + investor */}
      <SellerCTA />

      {/* 5. Agents — Roggero & Roma Historia */}
      <div id="nuestra-historia">
        <Agents 
          title={siteConfig.aboutTitle} 
          subtitle={siteConfig.aboutSubtitle} 
          text={siteConfig.aboutText} 
        />
      </div>

      {/* 6. Reviews — Nuestros Clientes */}
      <ScrollReveal variant="fadeScale">
        <ReviewsSection />
      </ScrollReveal>

      {/* 7. Clients — Empresas y Proyectos */}
      <Clients />
    </div>
  );
};

export default HomePage;