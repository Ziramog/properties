import https from 'https';
import fs from 'fs';

// Download the actual HTML from Vercel
const url = 'https://www.roggeroyroma.com/properties/6a1e2b8109dc76e1323c9459';

https.get(url, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    // Save full HTML for analysis
    fs.writeFileSync('F:/RoggeroyRoma Backup/debug_altagracia.html', body);
    
    // Find all cloudinary image references and their surrounding context
    const lines = body.split('\n');
    let found = 0;
    
    // Search for the srcSet or src attributes containing cloudinary URLs
    const regex = /src[Set]*[=:]"?([^"]*cloudinary[^"]*)"?/gi;
    let match;
    while ((match = regex.exec(body)) !== null) {
      found++;
      const start = Math.max(0, match.index - 50);
      const end = Math.min(body.length, match.index + match[0].length + 50);
      const context = body.substring(start, end);
      console.log(`\n--- Match #${found} ---`);
      console.log(`Full match: ${match[0].substring(0, 200)}`);
      // Check for trailing backslash
      if (match[1] && match[1].includes('\\')) {
        console.log('⚠️  CONTAINS BACKSLASH!');
      }
    }
    
    // Also search for _next/image which is the Next.js image optimizer
    const nextImgRegex = /\/_next\/image[^"'\s]*/g;
    let nimMatch;
    let nimCount = 0;
    console.log('\n\n=== NEXT.JS IMAGE OPTIMIZER URLs ===');
    while ((nimMatch = nextImgRegex.exec(body)) !== null) {
      nimCount++;
      console.log(`\n  next/image #${nimCount}: ${nimMatch[0].substring(0, 300)}`);
      if (nimMatch[0].includes('\\')) {
        console.log('  ⚠️  CONTAINS BACKSLASH!');
      }
    }
    
    // Search specifically for the backslash pattern
    console.log('\n\n=== BACKSLASH SEARCH ===');
    const bsRegex = /\.jpg\\|\.png\\|\.webp\\/g;
    let bsMatch;
    let bsCount = 0;
    while ((bsMatch = bsRegex.exec(body)) !== null) {
      bsCount++;
      const start = Math.max(0, bsMatch.index - 100);
      const end = Math.min(body.length, bsMatch.index + 50);
      console.log(`\n  backslash #${bsCount} at pos ${bsMatch.index}:`);
      console.log(`  ...${body.substring(start, end)}...`);
    }
    console.log(`\nTotal backslash occurrences: ${bsCount}`);

    console.log(`\nTotal HTML size: ${body.length} bytes`);
    console.log(`HTML saved to F:/RoggeroyRoma Backup/debug_altagracia.html`);
  });
}).on('error', e => console.error(e));
