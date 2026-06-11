import https from 'https';

// Test: request one of the /_next/image URLs that the browser would request
const testUrls = [
  // The first image (should work based on screenshot)
  'https://www.roggeroyroma.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdunkbcery%2Fimage%2Fupload%2Fv1780401401%2Froggero-roma%2Fproperties%2F6a1e2b8109dc76e1323c9459-se-venden-2-lotes-de-1000-m2-sobre-ruta-en-eje-comercial-alta-gracia%2Fn8tbyybvygmvvjzcuz9n.jpg&w=1920&q=75',
  // The second image (broken in screenshot)
  'https://www.roggeroyroma.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdunkbcery%2Fimage%2Fupload%2Fv1780401401%2Froggero-roma%2Fproperties%2F6a1e2b8109dc76e1323c9459-se-venden-2-lotes-de-1000-m2-sobre-ruta-en-eje-comercial-alta-gracia%2Faczki0fxi7e5lh99lbj5.jpg&w=1920&q=75',
  // Direct cloudinary URL for comparison
  'https://res.cloudinary.com/dunkbcery/image/upload/v1780401401/roggero-roma/properties/6a1e2b8109dc76e1323c9459-se-venden-2-lotes-de-1000-m2-sobre-ruta-en-eje-comercial-alta-gracia/aczki0fxi7e5lh99lbj5.jpg',
];

for (const url of testUrls) {
  const result = await new Promise((resolve) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({
        status: res.statusCode,
        contentType: res.headers['content-type'],
        contentLength: res.headers['content-length'],
        location: res.headers['location'],
        cacheStatus: res.headers['x-vercel-cache'],
      });
      res.resume(); // consume response
    });
    req.on('error', (e) => resolve({ status: 'ERROR', error: e.message }));
  });
  
  const shortUrl = url.length > 120 ? url.substring(0, 120) + '...' : url;
  console.log(`\n${shortUrl}`);
  console.log(`  Status: ${result.status}`);
  console.log(`  Content-Type: ${result.contentType}`);
  console.log(`  Content-Length: ${result.contentLength}`);
  console.log(`  Cache: ${result.cacheStatus}`);
  if (result.location) console.log(`  Location: ${result.location}`);
}
