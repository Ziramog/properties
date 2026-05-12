/**
 * fixBadMatches.js
 * Corrects the fuzzy matches from syncPhotos.js that matched wrong properties.
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

// ── Manual mapping: old URL slug → correct DB property name (exact) ──
// These fix the bad fuzzy matches from the first sync
const CORRECTIONS = [
  {
    url: 'https://roggeroyroma.com.ar/property/hermosa-unidad-en-ph-de-2-dormitorios-a-1-cuadra-de-bv-pellegrini-alta-gracia-cordoba/',
    // This is a NEW property not in seed data. We DON'T have it in DB — leave unmatched.
    // The sync incorrectly matched it to "Casa de 3 dormitorios en El Anglo" which already got 60 images.
    // REVERT: reset Casa de 3 dormitorios en El Anglo back to its correct images from URL #26
    action: 'revertAndRematch',
    revertTarget: 'Casa de 3 dormitorios en El Anglo, Alta Gracia, Córdoba.',
    correctUrl: 'https://roggeroyroma.com.ar/property/casa-de-3-dormitorios-en-el-anglo-alta-gracia-cordoba/',
  },
  {
    // Property 12: "Depto 3 Dorm El Golf" incorrectly got images from "Depto 2 Dorm"
    revertName: 'Alta Gracia, Córdoba, Departamento de 3 Dormitorios en zona de El Golf',
    correctUrl: 'https://roggeroyroma.com.ar/property/alta-gracia-cordoba-departamento-de-3-dormitorios-en-zona-de-el-golf/',
  },
  {
    // Property 13: "Lote 877 m2" incorrectly got images from "Lote 1216 m2"  
    revertName: 'Alta Gracia, Córdoba, Lote de 877 m2 con vista a las sierras en B El Golf',
    correctUrl: 'https://roggeroyroma.com.ar/property/alta-gracia-cordoba-lote-de-877-m2-con-vista-a-las-sierras-en-b-el-golf/',
  },
  {
    // Property 15: "Casa Barrio Poluyan" incorrectly got images from "Casa El Anglo"
    revertName: 'Alta Gracia, Córdoba, Barrio Poluyan, Casa de 3 hab. a 4 cuadras del Tajamar',
    correctUrl: null, // Need to find or skip
  },
  {
    // Property 18: "Hermoso Duplex" incorrectly got images from "Casa El Anglo"
    revertName: 'Hermoso Dúplex de 2 dormitorios a 3 cuadras del centro, Alta Gracia, Córdoba',
    correctUrl: null, // Need to find
  },
  {
    // Property 23: "2 Hectareas Ruta 5" incorrectly got images from "Fraccion 1.4 Has"
    revertName: 'Córdoba, Alta Gracia, 2 Hectáreas sobre autovía Ruta 5, zona Industrial',
    correctUrl: 'https://roggeroyroma.com.ar/property/cordoba-alta-gracia-2-hectareas-sobre-autovia-ruta-5-zona-industrial/',
  },
  {
    // Property 24: "2 Lotes" incorrectly got images from "Salon comercial"
    revertName: 'SE VENDEN 2 LOTES DE 1000 M2 SOBRE RUTA EN EJE COMERCIAL',
    correctUrl: null,
  },
  {
    // Property 25: "Hermosa casa B Pellegrini" incorrectly got images from "Los Aromos"
    revertName: 'Alta Gracia, Córdoba, Hermosa casa de 3 dormitorios en B° Pellegrini',
    correctUrl: null,
  },
  {
    // Property 26: "Casa 3 dorm El Anglo" incorrectly got images from "Depto 2 Dorm"
    revertName: 'Casa de 3 dormitorios en El Anglo, Alta Gracia, Córdoba.',
    correctUrl: 'https://roggeroyroma.com.ar/property/casa-de-3-dormitorios-en-el-anglo-alta-gracia-cordoba/',
  },
];

// Also fix the original 2 bad matches from correction #1
const propertySchema = new mongoose.Schema({}, { strict: false });
const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);

// Helper: normalize for matching
function normalize(s) {
  return s.toLowerCase().replace(/[^\w\sáéíóúñü]/g, '').replace(/\s+/g, ' ').trim();
}

async function fetchHTML(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function extractImages(html) {
  const imgRegex = /<img[^>]+src="(https:\/\/roggeroyroma\.com\.ar\/wp-content\/uploads\/[^"]+)"[^>]*>/gi;
  const images = new Set();
  let match;
  while ((match = imgRegex.exec(html)) !== null) images.add(match[1]);
  return Array.from(images);
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected.\n');

  // First: Handle correction #1 (Casa El Anglo got wrong images from Hermosa PH, needs its own images)
  console.log('── Fixing: Casa de 3 dormitorios en El Anglo ← correct URL');
  try {
    const html = await fetchHTML('https://roggeroyroma.com.ar/property/casa-de-3-dormitorios-en-el-anglo-alta-gracia-cordoba/');
    const images = extractImages(html);
    console.log(`  Found ${images.length} images`);
    const prop = await Property.findOne({ name: 'Casa de 3 dormitorios en El Anglo, Alta Gracia, Córdoba.' });
    if (prop) {
      await Property.updateOne({ _id: prop._id }, { $set: { images } });
      console.log(`  ✅ Updated "${prop.name}" with ${images.length} images`);
    }
  } catch (err) {
    console.log(`  ⚠ ${err.message}`);
  }

  // Process remaining corrections
  for (const c of CORRECTIONS.slice(1)) {
    if (!c.correctUrl) {
      console.log(`\n⚠ SKIP: "${c.revertName.substring(0, 50)}..." — no correct URL available, needs old site page`);
      continue;
    }
    console.log(`\n── Fixing: "${c.revertName.substring(0, 50)}..."`);
    try {
      const html = await fetchHTML(c.correctUrl);
      const images = extractImages(html);
      console.log(`  Found ${images.length} images`);
      const prop = await Property.findOne({ name: c.revertName });
      if (prop) {
        await Property.updateOne({ _id: prop._id }, { $set: { images } });
        console.log(`  ✅ Updated with ${images.length} images`);
      } else {
        console.log(`  ❌ Property not found in DB by exact name`);
      }
    } catch (err) {
      console.log(`  ⚠ ${err.message}`);
    }
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\nDone.');
  await mongoose.disconnect();
}

main().catch(console.error);
