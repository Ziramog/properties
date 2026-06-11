import 'dotenv/config';
import mongoose from 'mongoose';
import https from 'https';
import fs from 'fs';
import path from 'path';

// ========== AUDIT ONLY - ZERO WRITES ==========

const PROP_ID = '6a1e2b8109dc76e1323c9459';

function checkUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      resolve({ status: res.statusCode, headers: res.headers });
    });
    req.on('error', (e) => resolve({ status: 'ERROR', error: e.message }));
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ status: 'TIMEOUT' });
    });
  });
}

const run = async () => {
  try {
    // Load backup
    const backupPath = 'F:/RoggeroyRoma Backup/mongodb_backup/backup_2026-06-10T12-39-27-847Z.json';
    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
    const backupProps = backupData.properties || [];

    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    const liveProp = await db.collection('properties').findOne({ _id: new mongoose.Types.ObjectId(PROP_ID) });
    const backupProp = backupProps.find(p => {
      const id = typeof p._id === 'object' ? p._id.$oid || p._id.toString() : p._id;
      return id === PROP_ID;
    });

    console.log('='.repeat(90));
    console.log(`AUDITORÍA PROFUNDA: ${PROP_ID}`);
    console.log(`Nombre Live: ${liveProp?.name}`);
    console.log(`Nombre Backup: ${backupProp?.name}`);
    console.log('='.repeat(90));

    // Check ALL live images
    const liveImgs = liveProp?.images || [];
    console.log(`\n[LIVE DB] Total imágenes: ${liveImgs.length}`);
    for (let i = 0; i < liveImgs.length; i++) {
      const img = liveImgs[i];
      const url = typeof img === 'string' ? img : img.url;
      const publicId = typeof img === 'object' ? img.public_id : 'N/A';
      const result = await checkUrl(url);
      const broken = result.status !== 200;
      console.log(`  [${broken ? '❌ ROTA' : '✅ OK  '}] live[${i}]: HTTP ${result.status}`);
      console.log(`         URL: ${url}`);
      if (publicId !== 'N/A') console.log(`         public_id: ${publicId}`);
      if (broken && result.headers) {
        console.log(`         content-type: ${result.headers['content-type']}`);
      }
    }

    // Check ALL backup images
    const backupImgs = backupProp?.images || [];
    console.log(`\n[BACKUP PRE-PURGA] Total imágenes: ${backupImgs.length}`);
    for (let i = 0; i < backupImgs.length; i++) {
      const img = backupImgs[i];
      const url = typeof img === 'string' ? img : img.url;
      const publicId = typeof img === 'object' ? img.public_id : 'N/A';
      const result = await checkUrl(url);
      const broken = result.status !== 200;
      console.log(`  [${broken ? '❌ ROTA' : '✅ OK  '}] backup[${i}]: HTTP ${result.status}`);
      console.log(`         URL: ${url}`);
      if (publicId !== 'N/A') console.log(`         public_id: ${publicId}`);
    }

    // Diff analysis
    console.log('\n[ANÁLISIS DE DIFERENCIAS]');
    const getUrl = (img) => typeof img === 'string' ? img : img.url;
    const getPid = (img) => typeof img === 'object' ? img.public_id : null;
    
    for (let i = 0; i < Math.max(liveImgs.length, backupImgs.length); i++) {
      const liveUrl = i < liveImgs.length ? getUrl(liveImgs[i]) : null;
      const backupUrl = i < backupImgs.length ? getUrl(backupImgs[i]) : null;
      if (liveUrl !== backupUrl) {
        console.log(`  [DIFF ${i}]`);
        console.log(`    Backup: ${backupUrl || 'N/A'}`);
        console.log(`    Live:   ${liveUrl || 'N/A'}`);
      }
    }

    // Check local files
    const huerfanasPath = 'F:/RoggeroyRoma Backup/backup_ordenado/_HUERFANAS';
    const dirs = fs.readdirSync(huerfanasPath);
    const matches = dirs.filter(d => d.includes(PROP_ID));
    if (matches.length > 0) {
      for (const m of matches) {
        const dirFull = path.join(huerfanasPath, m);
        const files = fs.readdirSync(dirFull);
        console.log(`\n[_HUERFANAS] Carpeta: ${m}`);
        console.log(`[_HUERFANAS] Total archivos: ${files.length}`);
        files.forEach(f => console.log(`  ${f}`));
      }
    }

    // Check the page HTML to see what Vercel is actually serving
    console.log('\n[VERIFICACIÓN VERCEL - HTML SERVIDO]');
    const pageResult = await new Promise((resolve) => {
      https.get(`https://www.roggeroyroma.com/properties/${PROP_ID}`, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ status: res.statusCode, body, headers: res.headers }));
      }).on('error', e => resolve({ status: 'ERROR', error: e.message }));
    });
    
    console.log(`  HTTP Status: ${pageResult.status}`);
    console.log(`  Cache headers: ${pageResult.headers?.['x-vercel-cache'] || 'N/A'}`);
    console.log(`  Age: ${pageResult.headers?.['age'] || 'N/A'}`);
    
    // Extract image URLs from the HTML
    const imgRegex = /https:\/\/res\.cloudinary\.com\/dunkbcery\/image\/upload\/[^"'\s)]+/g;
    const htmlImages = [...new Set(pageResult.body.match(imgRegex) || [])];
    console.log(`\n[VERCEL HTML] Imágenes de Cloudinary encontradas en el HTML: ${htmlImages.length}`);
    for (const htmlImg of htmlImages) {
      const result = await checkUrl(htmlImg);
      const broken = result.status !== 200;
      console.log(`  [${broken ? '❌ ROTA' : '✅ OK  '}] HTTP ${result.status} | ${htmlImg}`);
    }

  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};
run();
