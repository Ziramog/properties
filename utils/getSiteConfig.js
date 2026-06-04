import connectDB from '@/config/database';
import SiteConfig from '@/models/SiteConfig';

export const getSiteConfig = async () => {
  try {
    await connectDB();
    const config = await SiteConfig.findOne({}).lean();
    
    // Default values if nothing in DB yet
    return {
      heroTitle: config?.heroTitle || 'Vendemos Inmuebles, Construimos Confianza',
      heroSubtitle: config?.heroSubtitle || 'Alta Gracia, Córdoba, Argentina',
      aboutTitle: config?.aboutTitle || 'Silvia Roggero de Roma',
      aboutSubtitle: config?.aboutSubtitle || 'NEGOCIOS INMOBILIARIOS',
      aboutText: config?.aboutText || 'Contamos con 20 años de trayectoria ininterrumpida, siendo un estandarte de las transacciones inmobiliarias y brindando soluciones en Alta Gracia y toda la Provincia de Córdoba.',
      footerDescription: config?.footerDescription || 'En Roggero & Roma te acompañamos en cada paso. Nuestra experiencia asegura las mejores oportunidades del mercado inmobiliario.',
      contactEmail: config?.contactEmail || 'info@roggeroyroma.com.ar',
      contactPhone: config?.contactPhone || '+54 9 3547 563911',
      contactAddress: config?.contactAddress || 'Blvd. Carlos Pellegrini 710',
      whatsappGroupLink: config?.whatsappGroupLink || '',
      whatsappDefaultMessage: config?.whatsappDefaultMessage || 'Hola, vengo desde la web y me gustaría recibir más información.',
      analyticsId: config?.analyticsId || 'G-PW4FH9WHQB',
      facebookPixelId: config?.facebookPixelId || '',
    };
  } catch (error) {
    console.error('Error fetching site config:', error);
    // Fallback defaults
    return {
      heroTitle: 'Vendemos Inmuebles, Construimos Confianza',
      heroSubtitle: 'Alta Gracia, Córdoba, Argentina',
      aboutTitle: 'Silvia Roggero de Roma',
      aboutSubtitle: 'NEGOCIOS INMOBILIARIOS',
      aboutText: 'Contamos con 20 años de trayectoria ininterrumpida...',
      footerDescription: 'En Roggero & Roma te acompañamos en cada paso.',
      contactEmail: 'info@roggeroyroma.com.ar',
      contactPhone: '+54 9 3547 563911',
      contactAddress: 'Blvd. Carlos Pellegrini 710',
      whatsappGroupLink: '',
      whatsappDefaultMessage: 'Hola, vengo desde la web...',
      analyticsId: 'G-PW4FH9WHQB',
      facebookPixelId: '',
    };
  }
};
