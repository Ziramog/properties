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
  heroTitle: { type: String, default: 'Vendemos Inmuebles, Construimos Confianza' },
  heroSubtitle: { type: String, default: '' },
  aboutTitle: { type: String, default: 'Silvia Roggero de Roma' },
  aboutSubtitle: { type: String, default: 'Negocios Inmobiliarios' },
  aboutText: { type: String, default: 'Contamos con 20 años de experiencia propia en el rubro inmobiliario. Trabajamos con el objetivo de brindar confianza y seriedad en el rubro, dar información real y adecuada sobre el mercado y ofrecer la mejor variedad de alternativas a nuestros clientes.' },
  footerDescription: { type: String, default: 'En Roggero & Roma te acompañamos en cada paso. Nuestra experiencia asegura las mejores oportunidades del mercado inmobiliario.' },
  
  // Marketing & Extras
  analyticsId: { type: String, default: 'G-PW4FH9WHQB' },
  facebookPixelId: { type: String, default: '' },
  whatsappDefaultMessage: { type: String, default: 'Hola, vengo desde la web y me gustaría recibir más información.' },
  
  // Custom Labels
  customPropertyLabels: { 
    type: [String], 
    default: ['PRECIO MEJORADO', 'ULTIMA UNIDAD', 'UNICO EN SU TIPO', 'MEJOR PRECIO', 'EXCELENTE PRECIO', 'AMOBLADA'] 
  },
}, { timestamps: true });

const SiteConfig = models.SiteConfig || model('SiteConfig', SiteConfigSchema);
export default SiteConfig;