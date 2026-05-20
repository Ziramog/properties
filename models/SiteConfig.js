import { Schema, model, models } from 'mongoose';

const SiteConfigSchema = new Schema({
  logoUrl: { type: String, default: null },
  exchangeRateARS: { type: Number, default: null },
  signatureBase64: { type: String, default: null },
}, { timestamps: true });

const SiteConfig = models.SiteConfig || model('SiteConfig', SiteConfigSchema);
export default SiteConfig;