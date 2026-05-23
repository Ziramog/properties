import { Font } from '@react-pdf/renderer';
import fs from 'fs';
import path from 'path';

function loadFont(relativePath) {
  const filePath = path.join(process.cwd(), 'public', 'senada', 'fonts', relativePath);
  return fs.readFileSync(filePath);
}

try {
  Font.register({
    family: 'Lato',
    fonts: [
      { src: loadFont('lato/Lato-Light.woff2'), fontWeight: 300 },
      { src: loadFont('lato/Lato-Regular.woff2'), fontWeight: 400 },
      { src: loadFont('lato/Lato-Italic.woff2'), fontWeight: 400, fontStyle: 'italic' },
      { src: loadFont('lato/Lato-Bold.woff2'), fontWeight: 700 },
    ],
  });

  Font.register({
    family: 'PT Serif',
    fonts: [
      { src: loadFont('new/PTSerif-Regular.woff2'), fontWeight: 400 },
      { src: loadFont('new/PTSerif-Bold.woff2'), fontWeight: 700 },
    ],
  });
} catch (e) {
  console.warn('[pdf/fonts] Font registration failed, using Helvetica fallback:', e.message);
}
