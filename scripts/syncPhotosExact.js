/**
 * syncPhotosExact.js
 *
 * Extracts property photos from old roggeroyroma.com.ar site using
 * HARDCODED exact URL → DB name mappings. Only scrapes images from
 * the property banner slider (.header_slider_container), not the
 * entire page. Zero fuzzy matching.
 *
 * Usage: node scripts/syncPhotosExact.js
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

// ── HARDCODED EXACT MAPPINGS ──
// Each entry: { url, dbName } — only these properties get updated.
const MAPPINGS = [
  {
    url: 'https://roggeroyroma.com.ar/property/alta-gracia-cordoba-importante-casona-de-estilo-en-barrio-pellegrini/',
    dbName: 'Importante Casona de estilo en Barrio Pellegrini',
  },
  {
    url: 'https://roggeroyroma.com.ar/property/cordoba-anisacate-3-300-m2-con-frente-sobre-ruta-5-y-150-mts-de-costa-s-rio-anisacate/',
    dbName: 'Córdoba, Anisacate, 3.300 m2 con frente sobre Ruta 5 y 150 mts de costa s/Rio Anisacate',
  },
  {
    url: 'https://roggeroyroma.com.ar/property/cordoba-los-molinos-22-hectareas-sobre-ruta-5-frente-al-lago-los-molinos/',
    dbName: 'Córdoba, Los Molinos, 22 Hectáreas sobre Ruta 5 frente al lago Los Molinos',
  },
  {
    url: 'https://roggeroyroma.com.ar/property/cordoba-alta-gracia-fraccion-de-44-hectareas-sobre-ruta-c45/',
    dbName: 'Córdoba, Alta Gracia, Fracción de 1,4 Hectáreas sobre ruta c45',
  },
  {
    url: 'https://roggeroyroma.com.ar/property/alta-gracia-cordoba-departamento-de-2-dormitorios-en-zona-de-el-golf/',
    dbName: 'Alta Gracia, Córdoba, Departamento de 2 Dormitorios en zona de El Golf',
  },
  {
    url: 'https://roggeroyroma.com.ar/property/cordoba-los-gigantes-campo-de-1250-hectareas/',
    dbName: 'Córdoba, Los Gigantes, Campo de 1250 Hectáreas',
  },
  {
    url: 'https://roggeroyroma.com.ar/property/la-paisanita-campo-de-30-has-sobre-rio-con-casco-galpon-casa-de-puestero-y-3-cabanas/',
    dbName: 'La Paisanita, Campo de 30 Has. sobre Río con Casco, Galpón, casa de Puestero y 3 Cabañas',
  },
  {
    url: 'https://roggeroyroma.com.ar/property/la-falda-provincia-de-cordoba-sonada-casona-sobre-10-has-con-60-mts-de-costa-propia-sobre-rio/',
    dbName: 'Soñada Casona sobre 10 Has con 60 mts de costa propia sobre Río',
  },
  {
    url: 'https://roggeroyroma.com.ar/property/alta-gracia-cordoba-barrio-norte-departamento-de-2-dormitorios-inmejorable-ubicacion-en-venta/',
    dbName: 'Alta Gracia, Córdoba, Barrio Norte, Departamento de 2 dormitorios, inmejorable ubicación EN VENTA',
  },
  {
    url: 'https://roggeroyroma.com.ar/property/alta-gracia-cordoba-lote-de-1-216-m2-en-alta-gracia-country-golf/',
    dbName: 'Alta Gracia, Córdoba, Lote de 1.216 m2 en Alta Gracia Country Golf',
  },
  {
    url: 'https://roggeroyroma.com.ar/property/alta-gracia-cordoba-departamento-de-3-dormitorios-en-zona-de-el-golf/',
    dbName: 'Alta Gracia, Córdoba, Departamento de 3 Dormitorios en zona de El Golf',
  },
  {
    url: 'https://roggeroyroma.com.ar/property/alta-gracia-cordoba-lote-de-877-m2-con-vista-a-las-sierras-en-b-el-golf/',
    dbName: 'Alta Gracia, Córdoba, Lote de 877 m2 con vista a las sierras en B° El Golf',
  },
  {
    url: 'https://roggeroyroma.com.ar/property/cordoba-falda-del-carmen-15-hectareas-a-500-mts-del-asfalto/',
    dbName: 'Córdoba, Falda del Carmen, 1,5 Hectáreas a 500 mts. del Asfalto',
  },
  {
    url: 'https://roggeroyroma.com.ar/property/cordoba-la-serranita-lote-de-4-745m2-a-85-mts-del-asfalto/',
    dbName: 'Córdoba, La Serranita, Lote de 4.745m2 a 85 mts. del Asfalto',
  },
  {
    url: 'https://roggeroyroma.com.ar/property/cordoba-potrero-de-garay-nautico-los-molinos-dpto-en-monte-molinos/',
    dbName: 'Córdoba, Potrero de Garay, Náutico Los Molinos, Dpto. en Monte Molinos',
  },
  {
    url: 'https://roggeroyroma.com.ar/property/hermoso-duplex-de-2-dormitorios-a-3-cuadras-del-centro-alta-gracia-cordoba/',
    dbName: 'Hermoso Dúplex de 2 dormitorios a 3 cuadras del centro, Alta Gracia, Córdoba',
  },
  {
    url: 'https://roggeroyroma.com.ar/property/cordoba-despenaderos-8-hectareas-a-400mts-de-acceso-ruta-36/',
    dbName: 'Córdoba, Despeñaderos, 8 Hectáreas a 400mts de acceso ruta 36',
  },
  {
    url: 'https://roggeroyroma.com.ar/property/cordoba-los-aromos-casa-de-2-dormitorios-100-refaccionada/',
    dbName: 'Córdoba, Los Aromos, Casa de 3 dormitorios a 250 mts del Río, 100% Refaccionada',
  },
  {
    url: 'https://roggeroyroma.com.ar/property/duplex-a-estrenar-de-3-dormitorios-en-b-pellegrini-alta-gracia-cordoba/',
    dbName: 'Alta Gracia, Córdoba, Duplex a Estrenar de 3 Dormatorios en B° Pellegrini',
  },
  {
    url: 'https://roggeroyroma.com.ar/property/alta-gracia-cordoba-impecable-posada-de-6-habitaciones-en-funcionamiento/',
    dbName: 'Alta Gracia, Córdoba, Impecable Posada de 6 habitaciones en funcionamiento',
  },
  {
    url: 'https://roggeroyroma.com.ar/property/cordoba-alta-gracia-2-hectareas-sobre-autovia-ruta-5-zona-industrial/',
    dbName: 'Córdoba, Alta Gracia, 2 Hectáreas sobre autovía Ruta 5, zona Industrial',
  },
  {
    url: 'https://roggeroyroma.com.ar/property/casa-de-3-dormitorios-en-el-anglo-alta-gracia-cordoba/',
    dbName: 'Casa de 3 dormitorios en El Anglo, Alta Gracia, Córdoba',
  },
  {
    url: 'https://roggeroyroma.com.ar/property/cordoba-anisacate-villa-montenegro-casa-de-3-hab-a-1-cuadra-de-la-ruta/',
    dbName: 'Córdoba, Anisacate, Villa Montenegro, Casa de 3 hab. a 1 cuadra de la Ruta',
  },
];

const propertySchema = new mongoose.Schema({}, { strict: false });
const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);

// ── Fetch HTML ──
async function fetchHTML(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

// ── Extract images ONLY from .header_slider_container ──
function extractImages(html) {
  // Extract the header_slider_container section
  const sectionMatch = html.match(
    /<div class="header_slider_container"[^>]*>([\s\S]*?)(?:<button class="previous_image_btn"|<\/div>\s*<div class="shadow")/
  );
  if (!sectionMatch) {
    console.log('    ⚠ Could not find .header_slider_container');
    return [];
  }
  const section = sectionMatch[1];

  // Extract img src from the section only
  const imgRegex = /<img[^>]+src="(https:\/\/roggeroyroma\.com\.ar\/wp-content\/uploads\/[^"]+)"[^>]*>/gi;
  const images = new Set();
  let match;
  while ((match = imgRegex.exec(section)) !== null) {
    images.add(match[1]);
  }
  return Array.from(images);
}

// ── Main ──
async function main() {
  console.log(`Connecting to MongoDB...`);
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected.\n');

  let updated = 0;
  let errors = 0;
  let notFound = 0;

  for (let i = 0; i < MAPPINGS.length; i++) {
    const { url, dbName } = MAPPINGS[i];
    const slug = url.split('/property/')[1]?.split('/')[0] || 'unknown';
    console.log(`[${i + 1}/${MAPPINGS.length}] ${slug}`);

    try {
      const html = await fetchHTML(url);
      const images = extractImages(html);

      if (!images.length) {
        console.log(`  ⚠ No images in banner slider`);
        errors++;
        continue;
      }

      // Show filename prefix for verification
      const firstFname = images[0].split('/').pop().replace(/\.[^.]+$/, '');
      console.log(`  Found ${images.length} photos | prefix: "${firstFname?.substring(0, 30)}"`);

      // Find by EXACT name
      const prop = await Property.findOne({ name: dbName });
      if (!prop) {
        console.log(`  ❌ DB property NOT FOUND: "${dbName.substring(0, 50)}..."`);
        notFound++;
        continue;
      }

      const before = (prop.images || []).length;
      await Property.updateOne({ _id: prop._id }, { $set: { images } });
      console.log(`  ✅ "${prop.name.substring(0, 45)}..." | ${before} → ${images.length} images`);
      updated++;
    } catch (err) {
      console.log(`  ⚠ Error: ${err.message}`);
      errors++;
    }

    await new Promise(r => setTimeout(r, 400));
  }

  console.log(`\n─── Done ───`);
  console.log(`Updated: ${updated} | Not found: ${notFound} | Errors: ${errors}`);

  // Final audit
  const all = await Property.find({}, 'name images').lean().sort({ name: 1 });
  let totalImgs = 0;
  console.log(`\n─── Final Audit (by filename prefix) ───`);
  for (const p of all) {
    const imgs = p.images || [];
    totalImgs += imgs.length;
    const fname = (imgs[0] || '').split('/').pop().replace(/\.[^.]+$/, '') || 'EMPTY';
    console.log(`  ${String(imgs.length).padStart(2)} photos | ${fname.substring(0, 28).padEnd(28)} | ${p.name.substring(0, 55)}`);
  }
  console.log(`\nTotal: ${all.length} properties, ${totalImgs} images`);

  await mongoose.disconnect();
  console.log('Disconnected.');
}

main().catch(console.error);
