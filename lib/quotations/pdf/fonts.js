import { Font } from '@react-pdf/renderer';
import fs from 'fs';
import path from 'path';

let fontsLoaded = false;

function loadFontData(relativePath) {
  const filePath = path.join(process.cwd(), 'public', 'senada', 'fonts', relativePath);
  const buffer = fs.readFileSync(filePath);
  return { data: buffer, format: 'woff2' };
}

try {
  Font.register({
    family: 'Lato',
    fonts: [
      { src: loadFontData('lato/Lato-Light.woff2'), fontWeight: 300 },
      { src: loadFontData('lato/Lato-Regular.woff2'), fontWeight: 400 },
      { src: loadFontData('lato/Lato-Italic.woff2'), fontWeight: 400, fontStyle: 'italic' },
      { src: loadFontData('lato/Lato-Bold.woff2'), fontWeight: 700 },
    ],
  });

  Font.register({
    family: 'PT Serif',
    fonts: [
      { src: loadFontData('new/PTSerif-Regular.woff2'), fontWeight: 400 },
      { src: loadFontData('new/PTSerif-Bold.woff2'), fontWeight: 700 },
    ],
  });

  fontsLoaded = true;
} catch (e) {
  console.warn('[pdf/fonts] Font registration failed, falling back to Helvetica:', e.message);
}

export { fontsLoaded };
