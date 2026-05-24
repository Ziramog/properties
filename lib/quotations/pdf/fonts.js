import { Font } from '@react-pdf/renderer';
import fs from 'fs';
import path from 'path';

let fontsLoaded = false;

function getBaseUrl() {
  const url =
    process.env.VERCEL_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL;
  if (url) return `https://${url}`;
  return null;
}

function loadFontDataURI(relativePath) {
  const filePath = path.join(process.cwd(), 'public', 'senada', 'fonts', relativePath);
  const buffer = fs.readFileSync(filePath);
  return `data:font/woff2;base64,${buffer.toString('base64')}`;
}

(function registerFonts() {
  // Strategy 1: URL-based (works on Vercel where public/ is served)
  const baseUrl = getBaseUrl();
  if (baseUrl) {
    try {
      Font.register({
        family: 'Lato',
        fonts: [
          { src: `${baseUrl}/senada/fonts/lato/Lato-Light.woff2`, fontWeight: 300 },
          { src: `${baseUrl}/senada/fonts/lato/Lato-Regular.woff2`, fontWeight: 400 },
          { src: `${baseUrl}/senada/fonts/lato/Lato-Italic.woff2`, fontWeight: 400, fontStyle: 'italic' },
          { src: `${baseUrl}/senada/fonts/lato/Lato-Bold.woff2`, fontWeight: 700 },
        ],
      });
      Font.register({
        family: 'PT Serif',
        fonts: [
          { src: `${baseUrl}/senada/fonts/new/PTSerif-Regular.woff2`, fontWeight: 400 },
          { src: `${baseUrl}/senada/fonts/new/PTSerif-Bold.woff2`, fontWeight: 700 },
        ],
      });
      fontsLoaded = true;
      console.log('[pdf/fonts] Registered via URL');
      return;
    } catch (e) {
      console.warn('[pdf/fonts] URL registration failed:', e.message);
    }
  }

  // Strategy 2: data URI (works in local Node.js)
  try {
    Font.register({
      family: 'Lato',
      fonts: [
        { src: loadFontDataURI('lato/Lato-Light.woff2'), fontWeight: 300 },
        { src: loadFontDataURI('lato/Lato-Regular.woff2'), fontWeight: 400 },
        { src: loadFontDataURI('lato/Lato-Italic.woff2'), fontWeight: 400, fontStyle: 'italic' },
        { src: loadFontDataURI('lato/Lato-Bold.woff2'), fontWeight: 700 },
      ],
    });
    Font.register({
      family: 'PT Serif',
      fonts: [
        { src: loadFontDataURI('new/PTSerif-Regular.woff2'), fontWeight: 400 },
        { src: loadFontDataURI('new/PTSerif-Bold.woff2'), fontWeight: 700 },
      ],
    });
    fontsLoaded = true;
    console.log('[pdf/fonts] Registered via data URI');
    return;
  } catch (e) {
    console.warn('[pdf/fonts] Data URI registration failed:', e.message);
  }

  fontsLoaded = false;
  console.warn('[pdf/fonts] Both strategies failed, using Helvetica');
})();

export { fontsLoaded };
