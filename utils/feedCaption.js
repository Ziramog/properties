import { parsePrice } from './priceUtils.js';

const ABBREV_REGEX = /\b(Av|Bv|Pje|Gral|Ing|Arq|Dr|Dra|Sr|Sra|Nro|aprox|ej|hs|tel|urb)\.\s+/gi;

/**
 * Formatea el precio del caption para Feed según la operación:
 * - Alquiler: en pesos con emoji 💲 (ej. `💲 2.500.000`).
 * - Venta u otras operaciones: en dólares con emoji 💲 y aclaración USD (ej. `💲 USD 150.000`).
 * - Sin monto informado: `💲 Consultar`.
 */
export function formatFeedCaptionPrice(property) {
  const isRental = String(property?.operation || '').toLowerCase() === 'alquiler';
  const { numericPrice } = parsePrice(property?.price);

  if (!numericPrice) {
    return '💲 Consultar';
  }

  const formatted = numericPrice.toLocaleString('es-AR');
  return isRental ? `💲 ${formatted}` : `💲 USD ${formatted}`;
}

/**
 * Construye la primera viñeta física unida por `|` sin emojis redundantes.
 */
function buildSpecsLine(property) {
  const parts = [];

  if (property?.covered_area > 0) {
    parts.push(`${Number(property.covered_area).toLocaleString('es-AR')} m² cub`);
  } else if (property?.square_feet > 0) {
    const sqft = Number(property.square_feet);
    if (sqft >= 10000) {
      const has = sqft / 10000;
      parts.push(`${has.toFixed(has % 1 === 0 ? 0 : 1)} has`);
    } else {
      parts.push(`${sqft.toLocaleString('es-AR')} m²`);
    }
  }

  if (property?.beds > 0) {
    parts.push(`${property.beds} ${property.beds === 1 ? 'Dormitorio' : 'Dormitorios'}`);
  }

  if (property?.baths > 0) {
    parts.push(`${property.baths} ${property.baths === 1 ? 'Baño' : 'Baños'}`);
  }

  if (property?.garage > 0) {
    parts.push(`${property.garage} ${property.garage === 1 ? 'Cochera' : 'Cocheras'}`);
  }

  return parts.join(' | ');
}

/**
 * Divide la descripción en puntos breves y legibles respetando números con punto de miles
 * (ej. `$2.500.000`), abreviaturas comunes (`Av.`, `Ing.`) y signos sin usar lookbehind.
 */
export function extractDescriptionBullets(property, maxBullets = 4, maxChars = 420) {
  const rawDesc = (property?.description || '').trim();
  const normalizedItems = [
    ...(property?.normalizedDescription?.highlights || []),
    ...(property?.normalizedDescription?.detalles || []),
  ]
    .map((s) => String(s || '').trim())
    .filter(Boolean);

  let candidates = [];

  if (rawDesc) {
    // Proteger abreviaturas comunes para no cortar en puntos internos (ej. "Av. San Martín")
    const protectedText = rawDesc.replace(ABBREV_REGEX, (m) => m.replace('.', '__DOT__'));
    const lines = protectedText
      .split(/\r?\n+/)
      .flatMap((line) =>
        line
          .replace(/([.!?]+)\s+(?=[A-ZÁÉÍÓÚÑ¿¡])/g, '$1\n')
          .split('\n')
      )
      .map((s) =>
        s
          .replace(/__DOT__/g, '.')
          .replace(/^[\s\-*•✔✔️]+/, '')
          .replace(/\s+/g, ' ')
          .trim()
      )
      .filter((s) => s.length >= 6);

    candidates = lines;
  } else if (normalizedItems.length > 0) {
    candidates = normalizedItems;
  }

  const bullets = [];
  let charCount = 0;

  for (const item of candidates) {
    if (bullets.length >= maxBullets) break;
    if (bullets.length > 0 && charCount + item.length > maxChars) break;
    const text =
      item.length > maxChars
        ? item.slice(0, maxChars).replace(/\s+\S*$/, '').trimEnd() + '...'
        : item;
    bullets.push(text);
    charCount += text.length;
  }

  return bullets;
}

/**
 * Genera el caption limpio para Feed de Instagram / Facebook con pocos emojis,
 * moneda diferenciada por operación (`💲` en pesos, `💲 USD` en dólares),
 * características con `✔️` y enlace al sitio web oficial.
 */
export function buildFeedCaption(property) {
  const title = (property?.name || property?.type || 'Propiedad').trim();
  const operation = property?.operation ? property.operation.toUpperCase() : 'DISPONIBLE';
  const endsWithOperation = new RegExp(`\\ben\\s+${operation}$`, 'i').test(title);
  const headline = endsWithOperation ? title : `${title} en ${operation}`;

  const location = [property?.location?.city, property?.location?.state].filter(Boolean).join(', ');
  const priceLine = formatFeedCaptionPrice(property);

  const specsLine = buildSpecsLine(property);
  const descBullets = extractDescriptionBullets(property);
  const characteristicLines = [];
  if (specsLine) characteristicLines.push(`✔️ ${specsLine}`);
  for (const bullet of descBullets) {
    characteristicLines.push(`✔️ ${bullet}`);
  }

  const cityTag = property?.location?.city?.replace(/\s+/g, '') || 'Propiedades';

  const sections = [headline];
  if (location) sections.push(`📍 ${location}`);
  sections.push(priceLine);

  if (characteristicLines.length > 0) {
    sections.push(`Características:\n\n${characteristicLines.join('\n')}`);
  }

  sections.push(
    `🔗 Más info en www.roggeroyroma.com\n#BienesRaices #Inmobiliaria #RoggeroYRoma #${cityTag}`
  );

  return sections.join('\n\n');
}
