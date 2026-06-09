require('dotenv').config({ path: '.env' });
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const https = require('https');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Generate a date string like YYYY-MM-DD
const now = new Date();
const dateStr = now.toISOString().split('T')[0];
const BACKUP_DIR = path.join('f:\\RoggeroyRoma Backup', `backup_${dateStr}`);

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
        return;
      }
      const fileStream = fs.createWriteStream(filepath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => reject(err));
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

async function runBackup() {
  console.log(`Starting Cloudinary backup to ${BACKUP_DIR}...`);
  let totalDownloaded = 0;
  let nextCursor = null;

  try {
    do {
      console.log('Fetching list of resources from Cloudinary...');
      const response = await cloudinary.api.resources({
        type: 'upload',
        max_results: 500,
        next_cursor: nextCursor,
      });

      const resources = response.resources;
      console.log(`Found ${resources.length} resources in this batch.`);

      for (const res of resources) {
        // Create a safe filename from the public_id
        const safeName = res.public_id.replace(/\//g, '_') + '.' + res.format;
        const filepath = path.join(BACKUP_DIR, safeName);

        if (fs.existsSync(filepath)) {
          console.log(`[SKIP] Already exists: ${safeName}`);
          continue;
        }

        try {
          await downloadImage(res.secure_url, filepath);
          totalDownloaded++;
          console.log(`[OK] Downloaded: ${safeName}`);
        } catch (err) {
          console.log(`[ERROR] Failed to download ${safeName}: ${err.message}`);
        }
      }

      nextCursor = response.next_cursor;
    } while (nextCursor);

    console.log(`\nBackup Complete! Successfully downloaded ${totalDownloaded} new images.`);
  } catch (error) {
    console.error('Error during backup:', error);
  }
}

runBackup();
