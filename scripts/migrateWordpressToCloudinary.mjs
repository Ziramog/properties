/**
 * scripts/migrateWordpressToCloudinary.mjs
 * Safe to re-run — already-migrated documents are skipped.
 * Run: node --env-file=.env scripts/migrateWordpressToCloudinary.mjs
 */

import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

const WORDPRESS_DOMAIN = 'roggeroyroma.com.ar';
const CLOUDINARY_FOLDER = 'roggero-roma/properties';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PropertySchema = new mongoose.Schema(
  { name: String, images: mongoose.Schema.Types.Mixed },
  { strict: false }
);
const Property =
  mongoose.models.Property || mongoose.model('Property', PropertySchema);

function isWordpress(img) {
  const url = typeof img === 'string' ? img : img?.url ?? '';
  return url.includes(WORDPRESS_DOMAIN);
}

function getUrl(img) {
  return typeof img === 'string' ? img : img?.url ?? '';
}

async function uploadToCloudinary(sourceUrl) {
  const result = await cloudinary.uploader.upload(sourceUrl, {
    folder:       CLOUDINARY_FOLDER,
    fetch_format: 'auto',
    quality:      'auto',
    width:        1200,
    crop:         'limit',
  });
  return { url: result.secure_url, public_id: result.public_id };
}

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');

  const all        = await Property.find({});
  const toMigrate  = all.filter(
    (p) => Array.isArray(p.images) && p.images.some(isWordpress)
  );

  console.log(`Properties to migrate : ${toMigrate.length}`);
  console.log(`Already migrated      : ${all.length - toMigrate.length}\n`);

  let uploaded = 0;
  let failed   = 0;

  for (const prop of toMigrate) {
    console.log(`\n📦  "${prop.name}" (${prop._id})  [${prop.images.length} images]`);
    const next = [];

    for (let i = 0; i < prop.images.length; i++) {
      const img = prop.images[i];
      const url = getUrl(img);

      if (!isWordpress(img)) {
        next.push(img);
        console.log(`  [${i + 1}] ⏭  already Cloudinary — skipped`);
        continue;
      }

      try {
        const result = await uploadToCloudinary(url);
        next.push(result);
        uploaded++;
        console.log(`  [${i + 1}] ✅  ${url.split('/').pop()}`);
        console.log(`        → ${result.url}`);
      } catch (err) {
        next.push(img); // keep original so property stays visible
        failed++;
        console.error(`  [${i + 1}] ❌  FAILED: ${url}`);
        console.error(`        ${err.message}`);
      }
    }

    await Property.findByIdAndUpdate(prop._id, { images: next });
    console.log(`  💾  saved`);
  }

  console.log('\n──────────────────────────────');
  console.log(`Uploaded : ${uploaded}`);
  console.log(`Failed   : ${failed}`);
  if (failed > 0) console.log('Re-run the script to retry failed images.');

  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
