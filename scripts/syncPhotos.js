/**
 * syncPhotos.js
 * Fetches all photos from the old roggeroyroma.com.ar property pages
 * and updates the images array in our MongoDB.
 *
 * Usage: node scripts/syncPhotos.js
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

// ── All property URLs extracted from the old site listing page + slider ──
const PROPERTY_URLS = [
  'https://roggeroyroma.com.ar/property/alta-gracia-cordoba-importante-casona-de-estilo-en-barrio-pellegrini/',
  'https://roggeroyroma.com.ar/property/cordoba-anisacate-3-300-m2-con-frente-sobre-ruta-5-y-150-mts-de-costa-s-rio-anisacate/',
  'https://roggeroyroma.com.ar/property/cordoba-los-molinos-22-hectareas-sobre-ruta-5-frente-al-lago-los-molinos/',
  'https://roggeroyroma.com.ar/property/cordoba-alta-gracia-fraccion-de-44-hectareas-sobre-ruta-c45/',
  'https://roggeroyroma.com.ar/property/alta-gracia-cordoba-departamento-de-2-dormitorios-en-zona-de-el-golf/',
  'https://roggeroyroma.com.ar/property/hermosa-unidad-en-ph-de-2-dormitorios-a-1-cuadra-de-bv-pellegrini-alta-gracia-cordoba/',
  'https://roggeroyroma.com.ar/property/cordoba-los-gigantes-campo-de-1250-hectareas/',
  'https://roggeroyroma.com.ar/property/la-paisanita-campo-de-30-has-sobre-rio-con-casco-galpon-casa-de-puestero-y-3-cabanas/',
  'https://roggeroyroma.com.ar/property/la-falda-provincia-de-cordoba-sonada-casona-sobre-10-has-con-60-mts-de-costa-propia-sobre-rio/',
  'https://roggeroyroma.com.ar/property/alta-gracia-cordoba-barrio-norte-departamento-de-2-dormitorios-inmejorable-ubicacion-en-venta/',
  'https://roggeroyroma.com.ar/property/alta-gracia-cordoba-lote-de-1-216-m2-en-alta-gracia-country-golf/',
  'https://roggeroyroma.com.ar/property/alta-gracia-cordoba-departamento-de-3-dormitorios-en-zona-de-el-golf/',
  'https://roggeroyroma.com.ar/property/alta-gracia-cordoba-lote-de-877-m2-con-vista-a-las-sierras-en-b-el-golf/',
  'https://roggeroyroma.com.ar/property/cordoba-falda-del-carmen-15-hectareas-a-500-mts-del-asfalto/',
  'https://roggeroyroma.com.ar/property/alta-gracia-cordoba-barrio-poluyan-casa-de-3-hab-a-4-cuadras-del-tajamar/',
  'https://roggeroyroma.com.ar/property/cordoba-la-serranita-lote-de-4-745m2-a-85-mts-del-asfalto/',
  'https://roggeroyroma.com.ar/property/cordoba-potrero-de-garay-nautico-los-molinos-dpto-en-monte-molinos/',
  'https://roggeroyroma.com.ar/property/hermoso-duplex-de-2-dormitorios-a-3-cuadras-del-centro-alta-gracia-cordoba/',
  'https://roggeroyroma.com.ar/property/cordoba-despenaderos-8-hectareas-a-400mts-de-acceso-ruta-36/',
  'https://roggeroyroma.com.ar/property/cordoba-los-aromos-casa-de-2-dormitorios-100-refaccionada/',
  'https://roggeroyroma.com.ar/property/duplex-a-estrenar-de-3-dormitorios-en-b-pellegrini-alta-gracia-cordoba/',
  'https://roggeroyroma.com.ar/property/alta-gracia-cordoba-impecable-posada-de-6-habitaciones-en-funcionamiento/',
  'https://roggeroyroma.com.ar/property/cordoba-alta-gracia-2-hectareas-sobre-autovia-ruta-5-zona-industrial/',
  'https://roggeroyroma.com.ar/property/se-venden-2-lotes-de-1000-m2-sobre-ruta-en-eje-comercial-alta-gracia/',
  'https://roggeroyroma.com.ar/property/alta-gracia-cordoba-hermosa-casa-de-3-dormitorios-en-b-pellegrini/',
  // Slider-only additions
  'https://roggeroyroma.com.ar/property/casa-de-3-dormitorios-en-el-anglo-alta-gracia-cordoba/',
  'https://roggeroyroma.com.ar/property/cordoba-anisacate-villa-montenegro-casa-de-3-hab-a-1-cuadra-de-la-ruta/',
];

// ── Property Schema (minimal, for update) ──
const propertySchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);

// ── Helper: normalize a title for matching ──
function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\sáéíóúñü]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ── Fetch HTML from old site ──
async function fetchHTML(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

// ── Extract images from property banner ──
function extractImages(html) {
  const imgRegex = /<img[^>]+src="(https:\/\/roggeroyroma\.com\.ar\/wp-content\/uploads\/[^"]+)"[^>]*>/gi;
  const images = new Set();
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    images.add(match[1]);
  }
  return Array.from(images);
}

// ── Extract title from property page ──
function extractTitle(html) {
  const h1Match = html.match(/<h1[^>]*class="[^"]*property-detail-info-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) return h1Match[1].replace(/<[^>]+>/g, '').trim();
  const titleMatch = html.match(/<title>([^<]+)/i);
  if (titleMatch) return titleMatch[1].replace(/\s*–\s*Roggero.*$/, '').trim();
  return null;
}

// ── Match old title to our DB property name ──
async function findMatchingProperty(oldTitle) {
  if (!oldTitle) return null;
  const oldNorm = normalize(oldTitle);

  // Load all DB names for comparison (cached only once)
  if (!findMatchingProperty._cache) {
    const all = await Property.find({}, 'name').lean();
    findMatchingProperty._cache = all.map(p => ({ name: p.name, norm: normalize(p.name) }));
  }

  // 1. Exact normalized match
  for (const p of findMatchingProperty._cache) {
    if (p.norm === oldNorm) return p;
  }

  // 2. One is substring of the other (min 50% length ratio)
  for (const p of findMatchingProperty._cache) {
    if (oldNorm.includes(p.norm) || p.norm.includes(oldNorm)) {
      const shorter = Math.min(oldNorm.length, p.norm.length);
      const longer = Math.max(oldNorm.length, p.norm.length);
      if (shorter / longer >= 0.5) return p;
    }
  }

  // 3. Word overlap: 80%+ of shorter set is in longer set
  for (const p of findMatchingProperty._cache) {
    const oldWords = oldNorm.split(' ').filter(w => w.length > 2);
    const dbWords = p.norm.split(' ').filter(w => w.length > 2);
    const shorter = oldWords.length < dbWords.length ? oldWords : dbWords;
    const longer = oldWords.length < dbWords.length ? dbWords : oldWords;
    const matchCount = shorter.filter(w => longer.includes(w)).length;
    if (matchCount >= shorter.length * 0.8) return p;
  }

  return null;
}

// ── Main sync ──
async function main() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected.\n');

  let updated = 0;
  let skipped = 0;
  let unmatched = 0;

  for (let i = 0; i < PROPERTY_URLS.length; i++) {
    const url = PROPERTY_URLS[i];
    console.log(`[${i + 1}/${PROPERTY_URLS.length}] ${url.split('/property/')[1]?.split('/')[0]}`);

    try {
      const html = await fetchHTML(url);
      const images = extractImages(html);
      const oldTitle = extractTitle(html);

      if (!images.length) {
        console.log(`  ⚠ No images found, skipping`);
        skipped++;
        continue;
      }

      console.log(`  Title: "${oldTitle?.substring(0, 60)}..."`);
      console.log(`  Images: ${images.length}`);

      const matched = await findMatchingProperty(oldTitle);

      if (!matched) {
        console.log(`  ❌ NO MATCH FOUND in DB`);
        unmatched++;
        continue;
      }

      // Only update if the old site has MORE images than we currently have
      const currentCount = (matched.images || []).length;
      console.log(`  ✓ Matched: "${matched.name?.substring(0, 50)}..."`);
      console.log(`  DB images: ${currentCount} → Old site: ${images.length}`);

      if (images.length <= currentCount) {
        console.log(`  ⏭ Already has ${currentCount} images, skipping`);
        skipped++;
        continue;
      }

      await Property.updateOne(
        { _id: matched._id },
        { $set: { images } }
      );

      console.log(`  ✅ UPDATED: ${currentCount} → ${images.length} images`);
      updated++;
    } catch (err) {
      console.log(`  ⚠ Error: ${err.message}`);
      skipped++;
    }

    // Small delay between requests to be polite
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n─── Summary ───`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Unmatched: ${unmatched}`);
  console.log(`Total URLs: ${PROPERTY_URLS.length}`);

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch(console.error);
