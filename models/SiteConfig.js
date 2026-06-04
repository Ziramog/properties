import { Schema, model, models } from 'mongoose';

const SiteConfigSchema = new Schema({
  logoUrl: { type: String, default: null },
  exchangeRateARS: { type: Number, default: null },
  signatureBase64: { type: String, default: null },
  contactEmail: { type: String, default: 'info@roggeroyroma.com.ar' },
  contactPhone: { type: String, default: '+54 9 3547 563911' },
  contactAddress: { type: String, default: 'Blvd. Carlos Pellegrini 710' },
  whatsappGroupLink: { type: String, default: '' },
  
  // CMS Fields (Superadmin)
  heroTitle: { type: String, default: 'Descubrí la Belleza de lo Inesperado' },
  heroSubtitle: { type: String, default: 'Casas y Departamentos Exclusivos en Alta Gracia.' },
  aboutTitle: { type: String, default: 'Silvia Roggero de Roma' },
  aboutSubtitle: { type: String, default: 'NEGOCIOS INMOBILIARIOS' },
  aboutText: { type: String, default: 'Contamos con 20 años de trayectoria ininterrumpida, siendo un estandarte de las transacciones inmobiliarias y brindando soluciones en Alta Gracia y toda la Provincia de Córdoba.' },
  footerDescription: { type: String, default: 'En Roggero & Roma te acompañamos en cada paso. Nuestra experiencia asegura las mejores oportunidades del mercado inmobiliario.' },
  
  // Marketing & Extras
  analyticsId: { type: String, default: 'G-PW4FH9WHQB' },
  facebookPixelId: { type: String, default: '' },
  whatsappDefaultMessage: { type: String, default: 'Hola, vengo desde la web y me gustaría recibir más información.' },
}, { timestamps: true });

const SiteConfig = models.SiteConfig || model('SiteConfig', SiteConfigSchema);
export default SiteConfig;