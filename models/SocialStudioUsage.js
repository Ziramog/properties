import { Schema, model, models } from 'mongoose';

const SocialStudioUsageSchema = new Schema(
  {
    month: { type: String, required: true, unique: true }, // Formato YYYY-MM (ej: 2026-11)
    limit: { type: Number, default: 50 },
    used: { type: Number, default: 0 },
    lastUsedAt: { type: Date, default: null },
    lastUserEmail: { type: String, default: null },
  },
  { timestamps: true }
);

const SocialStudioUsage =
  models.SocialStudioUsage || model('SocialStudioUsage', SocialStudioUsageSchema);

export default SocialStudioUsage;
