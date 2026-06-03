import { Schema, model, models } from 'mongoose';

const SiteConfigSchema = new Schema({
  logoUrl: { type: String, default: null },
  exchangeRateARS: { type: Number, default: null },
  signatureBase64: { type: String, default: null },
  contactEmail: { type: String, default: 'info@roggeroyroma.com.ar' },
  contactPhone: { type: String, default: '+54 9 3547 563911' },
  contactAddress: { type: String, default: 'Blvd. Carlos Pellegrini 710' },
  whatsappGroupLink: { type: String, default: '' },
}, { timestamps: true });

const SiteConfig = models.SiteConfig || model('SiteConfig', SiteConfigSchema);
export default SiteConfig;