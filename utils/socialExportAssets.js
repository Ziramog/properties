import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Carga las tipografías oficiales del sitio (PT Serif y Lato) en formato .ttf
 * compatible con Satori / @vercel/og (que no soporta .woff2).
 */
export function loadSocialExportFonts() {
  // Rutas literales en join() para que @vercel/nft tracee las 4 fuentes en Vercel Serverless
  const fontSpecs = [
    { name: 'PT Serif', fullPath: join(process.cwd(), 'assets', 'fonts', 'pt-serif', 'PTSerif-Regular.ttf'), weight: 400 },
    { name: 'PT Serif', fullPath: join(process.cwd(), 'assets', 'fonts', 'pt-serif', 'PTSerif-Bold.ttf'), weight: 700 },
    { name: 'Lato', fullPath: join(process.cwd(), 'assets', 'fonts', 'lato', 'Lato-Regular.ttf'), weight: 400 },
    { name: 'Lato', fullPath: join(process.cwd(), 'assets', 'fonts', 'lato', 'Lato-Bold.ttf'), weight: 700 },
  ];

  const fonts = [];
  for (const spec of fontSpecs) {
    if (existsSync(spec.fullPath)) {
      fonts.push({
        name: spec.name,
        data: readFileSync(spec.fullPath),
        style: 'normal',
        weight: spec.weight,
      });
    }
  }
  return fonts;
}

/**
 * Carga el logotipo blanco oficial completo (R&R + SILVIA ROGGERO de ROMA)
 * junto con los íconos SVG utilizados en las exportaciones a Instagram.
 */
export function loadSocialBrandAssets() {
  const fullWhiteLogoPath = join(process.cwd(), 'public', 'images', 'roggero-roma-isotipo-nombre-blanco.png');
  const whiteIsoPath = join(process.cwd(), 'public', 'images', 'ISOTIPO R&R-White.png');
  const fallbackIsoPath = join(process.cwd(), 'public', 'images', 'ISOTIPO R&R-Photoroom.png');

  const toPngDataUrl = (filePath) =>
    `data:image/png;base64,${readFileSync(filePath).toString('base64')}`;

  const isoLogoUrl = existsSync(fallbackIsoPath) ? toPngDataUrl(fallbackIsoPath) : null;
  const isoWhiteLogoUrl = existsSync(whiteIsoPath) ? toPngDataUrl(whiteIsoPath) : isoLogoUrl;
  const brandFullWhiteLogoUrl = existsSync(fullWhiteLogoPath) ? toPngDataUrl(fullWhiteLogoPath) : isoWhiteLogoUrl;

  const rawBedSvg = readFileSync(join(process.cwd(), 'public', 'senada', 'images', 'icons', 'ico_bed.svg'), 'utf8');
  const bedIconUrl = `data:image/svg+xml;base64,${Buffer.from(
    rawBedSvg.replace(/stroke-width="[^"]*"/g, 'stroke-width="1.8"')
  ).toString('base64')}`;

  const rawBathSvg = readFileSync(join(process.cwd(), 'public', 'senada', 'images', 'icons', 'ico_bath.svg'), 'utf8');
  const bathIconUrl = `data:image/svg+xml;base64,${Buffer.from(rawBathSvg).toString('base64')}`;

  const rawSqftSvg = readFileSync(join(process.cwd(), 'public', 'senada', 'images', 'icons', 'ico_sqfoot.svg'), 'utf8');
  const sqftIconUrl = `data:image/svg+xml;base64,${Buffer.from(
    rawSqftSvg.replace(/stroke-width="[^"]*"/g, 'stroke-width="1.8"')
  ).toString('base64')}`;

  return {
    brandFullWhiteLogoUrl,
    isoLogoUrl,
    isoWhiteLogoUrl,
    bedIconUrl,
    bathIconUrl,
    sqftIconUrl,
  };
}
