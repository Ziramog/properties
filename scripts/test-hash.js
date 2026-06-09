const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const CACHE_VERSION = 3;

function getHash(items) {
  const hash = crypto.createHash('sha256');
  for (let item of items) {
    if (typeof item === 'number') hash.update(String(item));
    else {
      hash.update(item);
    }
  }
  return hash.digest('base64').replace(/\//g, '-');
}

const url = 'https://res.cloudinary.com/dunkbcery/image/upload/v1778980810/roggero-roma/properties/csdlcgvehij7fqvca63f.jpg';
const widths = [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];
const qualities = [75];
const mimeTypes = ['image/webp', 'image/avif', 'image/jpeg', 'image/png'];

const cacheDir = path.join(__dirname, '..', '.next', 'cache', 'images');
const existingFolders = fs.existsSync(cacheDir) ? fs.readdirSync(cacheDir) : [];

let found = false;
for (const w of widths) {
  for (const q of qualities) {
    for (const m of mimeTypes) {
      const hash = getHash([CACHE_VERSION, url, w, q, m]);
      
      if (existingFolders.includes(hash)) {
        console.log(`MATCH FOUND! Width: ${w}, Mime: ${m}, Folder: ${hash}`);
        found = true;
      }
    }
  }
}

if (!found) console.log('No match found for this URL.');
