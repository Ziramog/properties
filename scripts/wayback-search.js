const https = require('https');
const fs = require('fs');
const path = require('path');

const CDX_API_URL = 'https://web.archive.org/cdx/search/cdx?url=roggeroyroma.com.ar/wp-content/uploads/*&collapse=urlkey&output=json&fl=original,timestamp,mimetype,statuscode';

function fetchCDX() {
  return new Promise((resolve, reject) => {
    https.get(CDX_API_URL, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Querying Wayback Machine CDX API for roggeroyroma.com.ar uploads...');
  const results = await fetchCDX();
  
  if (!results || results.length === 0) {
    console.log('No snapshots found in Wayback Machine for wp-content/uploads.');
    return;
  }
  
  // The first row is the header: ["original", "timestamp", "mimetype", "statuscode"]
  const headers = results.shift();
  
  // Filter for images that have a successful status code (200)
  const images = results.filter(row => row[2] && row[2].startsWith('image/') && row[3] === '200');
  
  console.log(`Found ${images.length} unique image URLs archived in Wayback Machine!`);
  
  // Group by property roughly by checking if any of the URLs match property names/slugs
  const urls = images.map(row => row[0]);
  
  console.log('\nSample of recovered URLs:');
  for (let i = 0; i < Math.min(10, urls.length); i++) {
    console.log(urls[i]);
  }
  
  fs.writeFileSync('wayback-urls.json', JSON.stringify(images, null, 2));
  console.log('\nSaved all found archive records to wayback-urls.json');
}

run();
