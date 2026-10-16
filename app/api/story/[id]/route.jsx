import { ImageResponse } from 'next/og';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import mongoose from 'mongoose';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { getSessionUser } from '@/utils/getSessionUser';
import { isAdmin } from '@/utils/isAdmin';
import { formatPriceDisplay } from '@/utils/priceUtils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getPropertyByIdOrSlug(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const property = await Property.findById(id).lean();
    if (property) return property;
  }
  return null;
}

const formatPriceLegacy = (price) => {
  if (!price) return 'Consultar';
  const rawPrice = String(price).replace(/[^0-9]/g, '');
  if (!rawPrice) return 'Consultar';
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(rawPrice);
};

// Devuelve la URL original limpia sin consumir créditos de transformación en Cloudinary
function optimizeImageUrl(url) {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace(/\/upload\/[^/]+\/(v\d+\/)/, '/upload/$1');
}

async function toDataUrl(url) {
  const cleanUrl = optimizeImageUrl(url);
  const res = await fetch(cleanUrl);
  if (!res.ok) throw new Error(`Failed to fetch image: ${cleanUrl} (${res.status})`);
  const contentType = res.headers.get('content-type') || 'image/jpeg';
  const buffer = await res.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  return `data:${contentType};base64,${base64}`;
}

async function renderImage(jsx, options) {
  const imgResponse = new ImageResponse(jsx, options);
  const buffer = await imgResponse.arrayBuffer();
  return new Response(buffer, {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' },
  });
}

function extractStoryData(property) {
  const operation = property.operation
    ? (property.operation === 'venta' ? 'VENTA' : property.operation.toUpperCase())
    : 'DISPONIBLE';

  const priceDisplay = formatPriceDisplay(property.price);

  const isLand = ['Terreno', 'Lote', 'Campo', 'Chacra'].includes(property.type) ||
    /lote|terreno|fracci[oó]n|campo/i.test(property.name || '') ||
    /lote|terreno/i.test(property.type || '');

  let areaDisplay = null;
  if (isLand) {
    if (property.square_feet != null && property.square_feet > 0) {
      if (property.square_feet >= 10000) {
        const has = property.square_feet / 10000;
        areaDisplay = `${has >= 1 ? has.toFixed(has % 1 === 0 ? 0 : 1) : has.toFixed(2)} has`;
      } else {
        areaDisplay = `${property.square_feet.toLocaleString('es-AR')} m²`;
      }
    } else if (property.covered_area != null && property.covered_area > 0) {
      areaDisplay = `${property.covered_area.toLocaleString('es-AR')} m²`;
    }
  } else {
    if (property.covered_area != null && property.covered_area > 0) {
      areaDisplay = `${property.covered_area.toLocaleString('es-AR')} m² cub`;
    } else if (property.square_feet != null && property.square_feet > 0) {
      areaDisplay = `${property.square_feet.toLocaleString('es-AR')} m² tot`;
    }
  }

  const beds = (!isLand && property.beds > 0) ? property.beds : null;
  const baths = (!isLand && property.baths > 0) ? property.baths : null;

  let rawTitle = property.name || property.location?.street || property.type || 'Propiedad Exclusiva';
  if (rawTitle.length > 72) {
    rawTitle = rawTitle.slice(0, 69).trim() + '...';
  }

  const locality = [property.location?.city || 'Alta Gracia', property.location?.state || 'Córdoba']
    .filter(Boolean)
    .join(' · ')
    .toUpperCase();

  return {
    operation,
    priceDisplay,
    isLand,
    areaDisplay,
    beds,
    baths,
    title: rawTitle,
    locality,
  };
}

function parseStoryTitleAndCondition(property) {
  const rawName = (property.name || '').trim();
  const rawDesc = (property.description || '').trim();
  const allText = `${rawName} ${rawDesc}`;
  const city = (property.location?.city || '').trim().toLowerCase();

  // 1. Detect Commercial Conditions confirmed by property data
  let condition = null;
  if (/permuta|canje|toma menor|toma veh[ií]culo/i.test(allText)) {
    condition = 'Acepta permuta';
  } else if (/apto cr[eé]dito/i.test(allText)) {
    condition = 'Apto crédito';
  } else if (/en construcci[oó]n|en pozo/i.test(allText)) {
    condition = 'En pozo';
  } else if (/escritura inmediata|con escritura/i.test(allText) && ['Terreno', 'Lote'].includes(property.type)) {
    condition = 'Con escritura';
  }

  // 2. Parse Title into clean commercial representation without arbitrary cuts
  let cleanTitle = rawName;

  // Clean quotes around building names: EDIFICIO "LAS PIRCAS" -> EDIFICIO LAS PIRCAS
  cleanTitle = cleanTitle.replace(/EDIFICIO\s+["“]([^"”]+)["”]/gi, 'EDIFICIO $1');

  if (cleanTitle.includes(',')) {
    const parts = cleanTitle.split(',').map((s) => s.trim()).filter(Boolean);

    // If it's simply a 2-part address + neighborhood (e.g. "Las Rosas 1100, B° El Golf")
    if (parts.length === 2 && !/^c[oó]rdoba$/i.test(parts[0]) && !/permuta|canje/i.test(parts[1])) {
      return {
        title: cleanTitle,
        condition,
      };
    }

    // Filter out redundant province/state or condition text that became a badge
    const filteredParts = parts.filter((part) => {
      if (/^c[oó]rdoba$/i.test(part)) return false;
      if (/permuta|canje|toma/i.test(part)) return false;
      if (/^en venta$/i.test(part)) return false;
      return true;
    });

    // Look for property type descriptor (e.g. "Casa de 2 dormitorios", "DPTO 1\"F\"")
    const typePartIndex = filteredParts.findIndex((p) =>
      /casa|dpto|depto|departamento|lote|terreno|campo|chacra|galp[oó]n|oficina|local/i.test(p)
    );

    if (typePartIndex !== -1) {
      const typePart = filteredParts[typePartIndex];
      const otherParts = filteredParts.filter((_, idx) => idx !== typePartIndex);

      const hasEmbeddedLocation = /en |sobre |b° |barrio /i.test(typePart);

      if (hasEmbeddedLocation) {
        cleanTitle = typePart;
      } else if (otherParts.length > 0) {
        cleanTitle = filteredParts.join(' · ');
        if (/^dpto\s+[^·]+·\s*torre/i.test(cleanTitle)) {
          cleanTitle = cleanTitle.replace(/^(dpto\s+[^·]+?)\s*·\s*(torre)/i, '$1, $2');
        }
      } else {
        cleanTitle = typePart;
      }
    } else {
      cleanTitle = filteredParts.join(' · ');
    }
  }

  if (!cleanTitle || cleanTitle.length < 5) {
    cleanTitle = property.location?.street || property.type || 'Propiedad Exclusiva';
  }

  return {
    title: cleanTitle,
    condition,
  };
}

function extractStoryDataV2_1(property) {
  const base = extractStoryData(property);
  const { title, condition } = parseStoryTitleAndCondition(property);

  return {
    ...base,
    title,
    condition,
  };
}

function extractPublicationBadges(property) {
  const badges = [];

  // 1. Featured badge
  if (property.is_featured) {
    badges.push({ text: 'DESTACADA', isPrimary: true });
  }

  // 2. Status badge from publication
  const statusMap = {
    'PRECIO MEJORADO': 'PRECIO MEJORADO',
    'ULTIMA UNIDAD': 'ÚLTIMA UNIDAD',
    'UNICO EN SU TIPO': 'ÚNICA EN SU TIPO',
    'MEJOR PRECIO': 'MEJOR PRECIO',
    'NUEVA': 'NUEVA',
    'EXCELENTE PRECIO': 'EXCELENTE PRECIO',
    'AMOBLADA': 'AMOBLADA',
    'APTA CREDITO': 'APTO CRÉDITO',
    'APTO CREDITO': 'APTO CRÉDITO',
  };

  if (property.status && property.status !== 'active') {
    const label = statusMap[property.status] || property.status.toUpperCase();
    badges.push({
      text: label,
      isPrimary: badges.length === 0,
    });
  }

  // 3. Commercial condition (permuta, etc.)
  const rawText = `${property.name || ''} ${property.description || ''}`;
  if (/permuta|canje|toma menor|toma veh[ií]culo/i.test(rawText)) {
    if (!badges.some((b) => b.text.includes('PERMUTA'))) {
      badges.push({ text: 'ACEPTA PERMUTA', isPrimary: badges.length === 0 });
    }
  }

  // 4. Default to Operation if no badge
  if (badges.length === 0) {
    const op = property.operation === 'alquiler' ? 'ALQUILER' : 'VENTA';
    badges.push({ text: op, isPrimary: true });
  }

  return badges;
}

function extractStoryDataV2_3(property) {
  const isLand =
    ['Terreno', 'Lote', 'Campo', 'Chacra'].includes(property.type) ||
    /lote|terreno|fracci[oó]n|campo/i.test(property.name || '') ||
    /lote|terreno/i.test(property.type || '');

  let areaDisplay = null;
  if (isLand) {
    if (property.square_feet != null && property.square_feet > 0) {
      if (property.square_feet >= 10000) {
        const has = property.square_feet / 10000;
        areaDisplay = `${has >= 1 ? has.toFixed(has % 1 === 0 ? 0 : 1) : has.toFixed(2)} has`;
      } else {
        areaDisplay = `${property.square_feet.toLocaleString('es-AR')} m²`;
      }
    } else if (property.covered_area != null && property.covered_area > 0) {
      areaDisplay = `${property.covered_area.toLocaleString('es-AR')} m²`;
    }
  }

  let coveredAreaDisplay = null;
  if (!isLand && property.covered_area != null && property.covered_area > 0) {
    coveredAreaDisplay = `${property.covered_area.toLocaleString('es-AR')} m² cub`;
  }

  let totalAreaDisplay = null;
  if (!isLand && property.square_feet != null && property.square_feet > 0) {
    totalAreaDisplay = `${property.square_feet.toLocaleString('es-AR')} m² tot`;
  }

  const beds = !isLand && property.beds != null && Number(property.beds) > 0 ? Number(property.beds) : null;
  const baths = !isLand && property.baths != null && Number(property.baths) > 0 ? Number(property.baths) : null;

  const badges = extractPublicationBadges(property);
  const priceDisplay = formatPriceDisplay(property.price);
  const { title } = parseStoryTitleAndCondition(property);

  const street = property.location?.street?.trim();
  const city = property.location?.city?.trim() || 'Alta Gracia';
  const state = property.location?.state?.trim() || 'Córdoba';
  const locationFull = [street, city, state].filter(Boolean).join(', ');

  return {
    title,
    locationFull,
    badges,
    priceDisplay,
    isLand,
    areaDisplay,
    coveredAreaDisplay,
    totalAreaDisplay,
    beds,
    baths,
  };
}

async function handleStoryRequest(request, { params }, clientImageBase64 = null) {
  try {
    await connectDB();
    const { id } = await params;
    const property = await getPropertyByIdOrSlug(id);

    if (!property) {
      return new Response('Not found', { status: 404 });
    }

    // User authorization check
    const sessionUser = await getSessionUser();
    const internalSecret = request.headers.get('x-internal-secret');
    const isAuthorized = isAdmin(sessionUser) ||
      (internalSecret && internalSecret === process.env.NEXTAUTH_SECRET) ||
      (process.env.NODE_ENV === 'development' && request.headers.get('x-allow-dev') === '1');

    if (!isAuthorized) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { searchParams } = new URL(request.url);
    const template = searchParams.get('template') || 'rr-story-v2.2';
    const isV1 = template === 'v1' || template === 'legacy';
    const isV2_1 = template === 'rr-story-v2.1' || template === 'v2.1';
    const isV2 = template === 'rr-story-v2' || template === 'v2';
    const isV2_2 = !isV1 && !isV2_1 && !isV2;
    const variantB = template === 'rr-story-v2.2-b' || template === 'v2.2-b' || template.endsWith('-b') || searchParams.get('variant') === 'b';

    const size = {
      width: 1080,
      height: 1920,
    };

    // Load static assets
    const logoBuffer = readFileSync(join(process.cwd(), 'public', 'images', 'ISOTIPO R&R-Photoroom.png'));
    const isoLogoUrl = `data:image/png;base64,${logoBuffer.toString('base64')}`;

    const whiteLogoPath = join(process.cwd(), 'public', 'images', 'ISOTIPO R&R-White.png');
    const isoWhiteLogoUrl = existsSync(whiteLogoPath)
      ? `data:image/png;base64,${readFileSync(whiteLogoPath).toString('base64')}`
      : isoLogoUrl;

    // Si el navegador ya recortó y mejoró la imagen en <canvas>, se usa directamente sin hacer fetch
    const firstImg = property.images?.[0];
    const rawImgUrl = typeof firstImg === 'string' ? firstImg : firstImg?.url;
    const imageUrl =
      clientImageBase64 && clientImageBase64.startsWith('data:image/')
        ? clientImageBase64
        : rawImgUrl
          ? await toDataUrl(rawImgUrl)
          : null;

    // Load icons with calibrated stroke for high-res 1080x1920
    const rawBedSvg = readFileSync(join(process.cwd(), 'public', 'senada', 'images', 'icons', 'ico_bed.svg'), 'utf8');
    const enhancedBedSvg = rawBedSvg.replace(/stroke-width="[^"]*"/g, 'stroke-width="1.8"');
    const bedIconUrl = `data:image/svg+xml;base64,${Buffer.from(enhancedBedSvg).toString('base64')}`;

    const bathIconBuffer = readFileSync(join(process.cwd(), 'public', 'senada', 'images', 'icons', 'ico_bath.svg'));
    const bathIconUrl = `data:image/svg+xml;base64,${bathIconBuffer.toString('base64')}`;

    const rawSqftSvg = readFileSync(join(process.cwd(), 'public', 'senada', 'images', 'icons', 'ico_sqfoot.svg'), 'utf8');
    const enhancedSqftSvg = rawSqftSvg.replace(/stroke-width="[^"]*"/g, 'stroke-width="1.8"');
    const sqftIconUrl = `data:image/svg+xml;base64,${Buffer.from(enhancedSqftSvg).toString('base64')}`;

    const assets = {
      isoLogoUrl,
      isoWhiteLogoUrl,
      imageUrl,
      bedIconUrl,
      bathIconUrl,
      sqftIconUrl,
    };

    // ==========================================
    // PLANTILLA V2.2: rr-story-v2.2 (REFINAMIENTO DEFINITIVO SEGÚN REFERENCIA)
    // ==========================================
    if (isV2_2) {
      const data = extractStoryDataV2_3(property);
      const corporateOrange = '#F26B2E';

      // Load PT Serif Bold and Montserrat fonts for exact editorial typography match
      const fontOptions = [];
      const ptSerifPath = join(process.cwd(), 'assets', 'fonts', 'pt-serif', 'PTSerif-Bold.ttf');
      if (existsSync(ptSerifPath)) {
        fontOptions.push({
          name: 'PT Serif',
          data: readFileSync(ptSerifPath),
          style: 'normal',
          weight: 700,
        });
      }

      const montserratBoldPath = join(process.cwd(), 'assets', 'fonts', 'montserrat', 'Montserrat-Bold.woff');
      if (existsSync(montserratBoldPath)) {
        fontOptions.push({
          name: 'Montserrat',
          data: readFileSync(montserratBoldPath),
          style: 'normal',
          weight: 700,
        });
      }

      const montserratRegularPath = join(process.cwd(), 'assets', 'fonts', 'montserrat', 'Montserrat-Regular.woff');
      if (existsSync(montserratRegularPath)) {
        fontOptions.push({
          name: 'Montserrat',
          data: readFileSync(montserratRegularPath),
          style: 'normal',
          weight: 400,
        });
      }

      // Title adaptive sizing
      const titleFontSize = data.title.length > 50 ? 46 : (data.title.length > 32 ? 56 : 66);

      return await renderImage(
        (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#0B0D10',
              fontFamily: '"Montserrat", sans-serif',
              position: 'relative',
            }}
          >
            {/* ZONA 2: Fotografía Protagonista Real */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex' }}>
              <img src={assets.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* Overlays Calibrados */}
            {/* Overlay Superior para sostener el Header institucional sobre cielos o fachadas */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '35%',
                backgroundImage: 'linear-gradient(to bottom, rgba(11, 13, 16, 0.88) 0%, rgba(11, 13, 16, 0.45) 20%, transparent 35%)',
                display: 'flex',
              }}
            />

            {/* Overlay Inferior para sostener los datos editoriales */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '62%',
                backgroundImage: 'linear-gradient(to top, rgba(11, 13, 16, 0.98) 0%, rgba(11, 13, 16, 0.92) 28%, rgba(11, 13, 16, 0.55) 48%, transparent 62%)',
                display: 'flex',
              }}
            />

            {/* ZONA 1: Header Institucional (Top Center) */}
            <div
              style={{
                position: 'absolute',
                top: 65,
                left: 0,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 20,
              }}
            >
              {/* Isotipo: blanco oficial en alta definición con sombra */}
              <img
                src={assets.isoWhiteLogoUrl}
                width={220}
                height={98}
                style={{
                  objectFit: 'contain',
                  filter: 'drop-shadow(0px 4px 14px rgba(0,0,0,0.85))',
                  marginBottom: '10px',
                }}
              />

              <span
                style={{
                  color: '#FFFFFF',
                  fontSize: 34,
                  fontFamily: '"Montserrat", sans-serif',
                  fontWeight: 700,
                  letterSpacing: '3.5px',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  textShadow: '0 2px 10px rgba(0,0,0,0.9)',
                  marginBottom: '6px',
                }}
              >
                SILVIA ROGGERO & ROMA
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '2px', backgroundColor: corporateOrange }} />
                <span
                  style={{
                    color: '#FFFFFF',
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: '4.5px',
                    fontFamily: '"Montserrat", sans-serif',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                  }}
                >
                  NEGOCIOS INMOBILIARIOS
                </span>
                <div style={{ width: '40px', height: '2px', backgroundColor: corporateOrange }} />
              </div>
            </div>

            {/* ZONA 2: Etiquetas de la Publicación (Top-Left) */}
            <div
              style={{
                position: 'absolute',
                top: 320,
                left: 65,
                display: 'flex',
                gap: '12px',
                zIndex: 20,
              }}
            >
              {data.badges.map((b, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: b.isPrimary ? corporateOrange : 'rgba(20, 26, 38, 0.85)',
                    border: b.isPrimary ? 'none' : '1px solid rgba(255, 255, 255, 0.35)',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.55)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      color: '#FFFFFF',
                      fontSize: 24,
                      fontWeight: 700,
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      fontFamily: '"Montserrat", sans-serif',
                    }}
                  >
                    {b.text}
                  </span>
                </div>
              ))}
            </div>

            {/* ZONA 3: Bloque de Información Inferior */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: '0 65px 125px 65px',
                zIndex: 20,
              }}
            >
              {/* Título */}
              <h1
                style={{
                  color: '#FFFFFF',
                  fontSize: titleFontSize,
                  fontFamily: '"PT Serif", serif',
                  fontWeight: 700,
                  lineHeight: 1.15,
                  margin: '0 0 16px 0',
                  textShadow: '0 3px 14px rgba(0,0,0,0.9)',
                }}
              >
                {data.title}
              </h1>

              {/* Ubicación con Pin Naranja Sólido */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2ZM12 11.5C10.6193 11.5 9.5 10.3807 9.5 9C9.5 7.61929 10.6193 6.5 12 6.5C13.3807 6.5 14.5 7.61929 14.5 9C14.5 10.3807 13.3807 11.5 12 11.5Z"
                    fill={corporateOrange}
                  />
                </svg>
                <span style={{ color: '#F1F5F9', fontSize: 26, fontWeight: 500, fontFamily: '"Montserrat", sans-serif' }}>
                  {data.locationFull}
                </span>
              </div>

              {/* Separador fino bajo la ubicación */}
              <div
                style={{
                  width: '100%',
                  height: '1px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  marginBottom: '20px',
                }}
              />

              {/* Características — Estilo Mosaic con divisores verticales */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '22px' }}>
                {/* Terreno / Campo: Icono LandPlot de Lucide */}
                {Boolean(data.isLand && data.areaDisplay) ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={corporateOrange}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m12 8 6-3-6-3v10" />
                      <path d="m8 11.99-5.5 3.14a1 1 0 0 0 0 1.74l8.5 4.86a2 2 0 0 0 2 0l8.5-4.86a1 1 0 0 0 0-1.74L16 12" />
                      <path d="m6.49 12.85 11.02 6.3" />
                      <path d="M17.51 12.85 6.49 19.15" />
                    </svg>
                    <span style={{ color: '#FFFFFF', fontSize: 30, fontWeight: 600, fontFamily: '"Montserrat", sans-serif' }}>
                      {data.areaDisplay}
                    </span>
                  </div>
                ) : null}

                {/* Vivienda: Dormitorios, Baños, Superficies con divisores verticales */}
                {!data.isLand ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {Boolean(data.beds && data.beds > 0) ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={assets.bedIconUrl} width={34} height={27} style={{ objectFit: 'contain' }} />
                        <span style={{ color: '#FFFFFF', fontSize: 30, fontWeight: 600, fontFamily: '"Montserrat", sans-serif' }}>
                          {data.beds} Dorms
                        </span>
                      </div>
                    ) : null}

                    {Boolean(data.beds && data.beds > 0 && data.baths && data.baths > 0) ? (
                      <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255, 255, 255, 0.35)', margin: '0 24px' }} />
                    ) : null}

                    {Boolean(data.baths && data.baths > 0) ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={assets.bathIconUrl} width={32} height={25} style={{ objectFit: 'contain' }} />
                        <span style={{ color: '#FFFFFF', fontSize: 30, fontWeight: 600, fontFamily: '"Montserrat", sans-serif' }}>
                          {data.baths} Baños
                        </span>
                      </div>
                    ) : null}

                    {Boolean((data.beds > 0 || data.baths > 0) && data.coveredAreaDisplay) ? (
                      <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255, 255, 255, 0.35)', margin: '0 24px' }} />
                    ) : null}

                    {Boolean(data.coveredAreaDisplay) ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={assets.sqftIconUrl} width={28} height={28} style={{ objectFit: 'contain' }} />
                        <span style={{ color: '#FFFFFF', fontSize: 30, fontWeight: 600, fontFamily: '"Montserrat", sans-serif' }}>
                          {data.coveredAreaDisplay}
                        </span>
                      </div>
                    ) : null}

                    {Boolean(!data.coveredAreaDisplay && data.totalAreaDisplay) ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {(data.beds > 0 || data.baths > 0) ? (
                          <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255, 255, 255, 0.35)', margin: '0 24px' }} />
                        ) : null}
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={corporateOrange}
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m12 8 6-3-6-3v10" />
                          <path d="m8 11.99-5.5 3.14a1 1 0 0 0 0 1.74l8.5 4.86a2 2 0 0 0 2 0l8.5-4.86a1 1 0 0 0 0-1.74L16 12" />
                          <path d="m6.49 12.85 11.02 6.3" />
                          <path d="M17.51 12.85 6.49 19.15" />
                        </svg>
                        <span style={{ color: '#FFFFFF', fontSize: 30, fontWeight: 600, fontFamily: '"Montserrat", sans-serif' }}>
                          {data.totalAreaDisplay}
                        </span>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {/* Fila del Precio Prominente */}
              <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '20px' }}>
                <span
                  style={{
                    color: corporateOrange,
                    fontSize: 74,
                    fontFamily: '"PT Serif", serif',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    textShadow: '0 2px 10px rgba(0,0,0,0.6)',
                  }}
                >
                  {data.priceDisplay}
                </span>
              </div>

              {/* Zona CTA Orientativa */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  backgroundColor: 'rgba(11, 13, 16, 0.8)',
                  border: '1.5px solid #F26B2E',
                  borderRadius: '16px',
                  padding: '18px 24px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.55)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413z"
                      fill="#25D366"
                    />
                  </svg>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span
                      style={{
                        color: '#FFFFFF',
                        fontSize: 24,
                        fontWeight: 700,
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        fontFamily: '"Montserrat", sans-serif',
                      }}
                    >
                      CONSULTÁ POR WHATSAPP
                    </span>
                    <span
                      style={{
                        color: '#CBD5E1',
                        fontSize: 18,
                        fontWeight: 400,
                        letterSpacing: '0.5px',
                        fontFamily: '"Montserrat", sans-serif',
                        marginTop: '2px',
                      }}
                    >
                      Tocá el sticker enlace o escribinos
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(242, 107, 46, 0.25)',
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={corporateOrange}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ),
        {
          ...size,
          fonts: fontOptions,
        }
      );
    }

    // ==========================================
    // PLANTILLA V2.1: rr-story-v2.1 (REFINAMIENTO EDITORIAL)
    // ==========================================
    if (isV2_1) {
      const data = extractStoryDataV2_1(property);
      const corporateOrange = '#F26B2E';

      // Load PT Serif Bold font for editorial headings
      const fontPath = join(process.cwd(), 'assets', 'fonts', 'pt-serif', 'PTSerif-Bold.ttf');
      let fontOptions = [];
      if (existsSync(fontPath)) {
        const ptSerifBuffer = readFileSync(fontPath);
        fontOptions.push({
          name: 'PT Serif',
          data: ptSerifBuffer,
          style: 'normal',
          weight: 700,
        });
      }

      // Title adaptive sizing (+20-25% from V2)
      const titleFontSize = data.title.length > 48 ? 44 : (data.title.length > 32 ? 54 : 66);

      const pillStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.16)',
        border: '1.5px solid rgba(255, 255, 255, 0.28)',
        padding: '12px 26px',
        borderRadius: '35px',
      };

      const pillTextStyle = {
        color: '#FFFFFF',
        fontSize: 26,
        fontWeight: 700,
      };

      return await renderImage(
        (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#0B0D10',
              fontFamily: 'sans-serif',
              position: 'relative',
            }}
          >
            {/* ZONA 2: Fotografía Protagonista Real */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex' }}>
              <img src={assets.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* ZONA 3: Overlays Calibrados V2.1 */}
            {/* Overlay Superior con gradiente denso detrás del logo para cielos claros y fachadas */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '40%',
                backgroundImage: 'linear-gradient(to bottom, rgba(11, 13, 16, 0.94) 0%, rgba(11, 13, 16, 0.78) 16%, rgba(11, 13, 16, 0.40) 28%, transparent 40%)',
                display: 'flex',
              }}
            />

            {/* Overlay Inferior en Degradado Editorial */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '60%',
                backgroundImage: 'linear-gradient(to top, rgba(11, 13, 16, 0.97) 0%, rgba(11, 13, 16, 0.88) 22%, rgba(11, 13, 16, 0.40) 42%, transparent 60%)',
                display: 'flex',
              }}
            />

            {/* ZONA 1: Header / Marca Integrado (+45% tamaño de isotipo, mayor legibilidad) */}
            <div
              style={{
                position: 'absolute',
                top: 120,
                left: 0,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 20,
              }}
            >
              <img
                src={assets.isoLogoUrl}
                width={160}
                height={160}
                style={{
                  objectFit: 'contain',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 12 }}>
                <span
                  style={{
                    color: '#FFFFFF',
                    fontSize: 25,
                    fontWeight: 800,
                    letterSpacing: '5px',
                    textTransform: 'uppercase',
                    textShadow: '0 2px 10px rgba(0,0,0,0.85)',
                  }}
                >
                  SILVIA ROGGERO & ROMA
                </span>
                <span
                  style={{
                    color: corporateOrange,
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: '7px',
                    textTransform: 'uppercase',
                    marginTop: 4,
                    textShadow: '0 2px 8px rgba(0,0,0,0.85)',
                  }}
                >
                  NEGOCIOS INMOBILIARIOS
                </span>
              </div>
            </div>

            {/* CONTENIDO PRINCIPAL INFERIOR (Zonas 4 a 9) */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                padding: '0 60px 135px 60px',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 20,
              }}
            >
              {/* ZONA 4: Badges de Operación y Condición Comercial */}
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div
                  style={{
                    backgroundColor: corporateOrange,
                    color: '#FFFFFF',
                    fontSize: 17,
                    fontWeight: 800,
                    padding: '8px 22px',
                    borderRadius: '24px',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                  }}
                >
                  {data.operation}
                </div>

                {data.condition && (
                  <div
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.18)',
                      border: '1.5px solid rgba(255, 255, 255, 0.40)',
                      color: '#FFFFFF',
                      fontSize: 16,
                      fontWeight: 700,
                      padding: '7px 20px',
                      borderRadius: '24px',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                    }}
                  >
                    {data.condition}
                  </div>
                )}
              </div>

              {/* ZONA 5: Precio (+20% con tipografía Serif PT Serif Bold) */}
              <div
                style={{
                  color: '#FFFFFF',
                  fontSize: 104,
                  fontFamily: '"PT Serif", serif',
                  fontWeight: 700,
                  lineHeight: 1.0,
                  marginBottom: '16px',
                }}
              >
                {data.priceDisplay}
              </div>

              {/* ZONA 6: Título / Dirección (+20-25% tamaño, adaptativo) */}
              <div
                style={{
                  color: '#FFFFFF',
                  fontSize: titleFontSize,
                  fontWeight: 700,
                  lineHeight: 1.15,
                  marginBottom: '12px',
                }}
              >
                {data.title}
              </div>

              {/* ZONA 7: Localidad */}
              <div
                style={{
                  color: '#E2E8F0',
                  fontSize: 25,
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  marginBottom: '26px',
                }}
              >
                {data.locality}
              </div>

              {/* ZONA 8: Datos Técnicos Dinámicos (Pills más legibles con íconos vectoriales) */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '16px',
                  alignItems: 'center',
                  marginBottom: '32px',
                  flexWrap: 'wrap',
                }}
              >
                {/* Si es Terreno/Lote/Campo: Solo superficie */}
                {data.isLand ? (
                  data.areaDisplay && (
                    <div style={pillStyle}>
                      <img src={assets.sqftIconUrl} width={32} height={32} />
                      <span style={pillTextStyle}>{data.areaDisplay}</span>
                    </div>
                  )
                ) : (
                  /* Si es Casa / Departamento / Comercial */
                  <>
                    {data.beds && (
                      <div style={pillStyle}>
                        <img src={assets.bedIconUrl} width={32} height={32} />
                        <span style={pillTextStyle}>{data.beds} Dorms</span>
                      </div>
                    )}
                    {data.baths && (
                      <div style={pillStyle}>
                        <img src={assets.bathIconUrl} width={32} height={32} />
                        <span style={pillTextStyle}>{data.baths} Baños</span>
                      </div>
                    )}
                    {data.areaDisplay && (
                      <div style={pillStyle}>
                        <img src={assets.sqftIconUrl} width={32} height={32} />
                        <span style={pillTextStyle}>{data.areaDisplay}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* ZONA 9: Pie de publicación / Cierre de Marca (Limpio, sin "Propiedades Exclusivas", alta legibilidad mobile) */}
              <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.22)', marginBottom: '18px' }} />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <span
                  style={{
                    color: corporateOrange,
                    fontSize: 24,
                    letterSpacing: '5px',
                    textTransform: 'uppercase',
                    fontWeight: 800,
                  }}
                >
                  ROGGEROYROMA.COM.AR
                </span>
              </div>
            </div>
          </div>
        ),
        {
          ...size,
          fonts: fontOptions,
        }
      );
    }

    // ==========================================
    // PLANTILLA V2: rr-story-v2 (NUEVO REDISEÑO)
    // ==========================================
    if (isV2) {
      const data = extractStoryData(property);
      const corporateOrange = '#F26B2E';

      // Load PT Serif Bold font for editorial headings
      const fontPath = join(process.cwd(), 'assets', 'fonts', 'pt-serif', 'PTSerif-Bold.ttf');
      let fontOptions = [];
      if (existsSync(fontPath)) {
        const ptSerifBuffer = readFileSync(fontPath);
        fontOptions.push({
          name: 'PT Serif',
          data: ptSerifBuffer,
          style: 'normal',
          weight: 700,
        });
      }

      // Title adaptive sizing
      const titleFontSize = data.title.length > 50 ? 38 : (data.title.length > 28 ? 46 : 54);

      const pillStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.22)',
        padding: '10px 22px',
        borderRadius: '30px',
      };

      const pillTextStyle = {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 600,
      };

      return await renderImage(
        (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#0B0D10',
              fontFamily: 'sans-serif',
              position: 'relative',
            }}
          >
            {/* ZONA 2: Fotografía Protagonista Real */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex' }}>
              <img src={assets.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* ZONA 3: Overlays Calibrados */}
            {/* Overlay Superior Sutil para sostener el branding sin oscurecer la foto */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '32%',
                backgroundImage: 'linear-gradient(to bottom, rgba(11, 13, 16, 0.78) 0%, rgba(11, 13, 16, 0.35) 15%, transparent 32%)',
                display: 'flex',
              }}
            />

            {/* Overlay Inferior en Degradado Editorial para lectura impecable */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '62%',
                backgroundImage: 'linear-gradient(to top, rgba(11, 13, 16, 0.98) 0%, rgba(11, 13, 16, 0.90) 25%, rgba(11, 13, 16, 0.45) 45%, transparent 62%)',
                display: 'flex',
              }}
            />

            {/* ZONA 1: Header / Marca Integrado (Sin barras pesadas, respetando zona segura) */}
            <div
              style={{
                position: 'absolute',
                top: 130,
                left: 0,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 20,
              }}
            >
              <img
                src={assets.isoLogoUrl}
                width={110}
                height={110}
                style={{
                  objectFit: 'contain',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>
                <span
                  style={{
                    color: '#FFFFFF',
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: '4px',
                    textTransform: 'uppercase',
                  }}
                >
                  SILVIA ROGGERO & ROMA
                </span>
                <span
                  style={{
                    color: corporateOrange,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '5px',
                    textTransform: 'uppercase',
                    marginTop: 3,
                  }}
                >
                  NEGOCIOS INMOBILIARIOS
                </span>
              </div>
            </div>

            {/* CONTENIDO PRINCIPAL INFERIOR (Zonas 4 a 9) */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                padding: '0 55px 140px 55px',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 20,
              }}
            >
              {/* ZONA 4: Badge de Operación */}
              <div style={{ display: 'flex' }}>
                <div
                  style={{
                    backgroundColor: corporateOrange,
                    color: '#FFFFFF',
                    fontSize: 15,
                    fontWeight: 800,
                    padding: '7px 20px',
                    borderRadius: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    marginBottom: '18px',
                  }}
                >
                  {data.operation}
                </div>
              </div>

              {/* ZONA 5: Precio (Máxima Jerarquía con tipografía Serif) */}
              <div
                style={{
                  color: '#FFFFFF',
                  fontSize: 88,
                  fontFamily: '"PT Serif", serif',
                  fontWeight: 700,
                  lineHeight: 1.0,
                  marginBottom: '16px',
                }}
              >
                {data.priceDisplay}
              </div>

              {/* ZONA 6: Título / Dirección Principal */}
              <div
                style={{
                  color: '#FFFFFF',
                  fontSize: titleFontSize,
                  fontWeight: 700,
                  lineHeight: 1.18,
                  marginBottom: '10px',
                }}
              >
                {data.title}
              </div>

              {/* ZONA 7: Localidad */}
              <div
                style={{
                  color: '#CBD5E1',
                  fontSize: 22,
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  marginBottom: '26px',
                }}
              >
                {data.locality}
              </div>

              {/* ZONA 8: Datos Técnicos Dinámicos */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '14px',
                  alignItems: 'center',
                  marginBottom: '30px',
                  flexWrap: 'wrap',
                }}
              >
                {/* Si es Terreno/Lote/Campo: Solo superficie, nunca dormitorios ni baños */}
                {data.isLand ? (
                  data.areaDisplay && (
                    <div style={pillStyle}>
                      <img src={assets.sqftIconUrl} width={26} height={26} />
                      <span style={pillTextStyle}>{data.areaDisplay}</span>
                    </div>
                  )
                ) : (
                  /* Si es Casa / Departamento / Comercial */
                  <>
                    {data.beds && (
                      <div style={pillStyle}>
                        <img src={assets.bedIconUrl} width={28} height={28} />
                        <span style={pillTextStyle}>{data.beds} Dorms</span>
                      </div>
                    )}
                    {data.baths && (
                      <div style={pillStyle}>
                        <img src={assets.bathIconUrl} width={28} height={28} />
                        <span style={pillTextStyle}>{data.baths} Baños</span>
                      </div>
                    )}
                    {data.areaDisplay && (
                      <div style={pillStyle}>
                        <img src={assets.sqftIconUrl} width={26} height={26} />
                        <span style={pillTextStyle}>{data.areaDisplay}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* ZONA 9: Cierre de Marca y Dominio */}
              <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: '18px' }} />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <span
                  style={{
                    color: 'rgba(255,255,255,0.65)',
                    fontSize: 15,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                  }}
                >
                  PROPIEDADES EXCLUSIVAS
                </span>
                <span
                  style={{
                    color: corporateOrange,
                    fontSize: 17,
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    fontWeight: 800,
                  }}
                >
                  ROGGEROYROMA.COM.AR
                </span>
              </div>
            </div>
          </div>
        ),
        {
          ...size,
          fonts: fontOptions,
        }
      );
    }

    // ==========================================
    // PLANTILLA V1: LEGACY PRESERVADA (DEFAULT)
    // ==========================================
    const getAreaDisplayV1 = () => {
      if (property.covered_area) return `${property.covered_area.toLocaleString('es-AR')} m² cub`;
      if (property.square_feet) return `${property.square_feet.toLocaleString('es-AR')} m² tot`;
      return null;
    };
    const areaLabelV1 = getAreaDisplayV1();
    const brandColorV1 = '#A47D4C';

    return await renderImage(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#0B0D10',
            fontFamily: 'sans-serif',
            position: 'relative',
          }}
        >
          {/* Full Background Image */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex' }}>
            <img src={assets.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Top Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '40%',
              backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)',
              display: 'flex',
            }}
          />

          {/* Bottom Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '60%',
              backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 30%, transparent 100%)',
              display: 'flex',
            }}
          />

          {/* Top Isotipo Center */}
          <div style={{ position: 'absolute', top: 80, left: 0, width: '100%', display: 'flex', justifyContent: 'center', zIndex: 20 }}>
            <img src={assets.isoLogoUrl} width={320} height={320} style={{ objectFit: 'contain' }} />
          </div>

          {/* Content - Bottom Aligned */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              padding: '60px 40px',
              zIndex: 20,
            }}
          >
            <div
              style={{
                backgroundColor: brandColorV1,
                color: '#FFFFFF',
                fontSize: 26,
                fontWeight: 'bold',
                padding: '12px 30px',
                borderRadius: '30px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: '30px',
              }}
            >
              {property.operation ? (property.operation === 'venta' ? 'VENTA' : property.operation.toUpperCase()) : 'DISPONIBLE'}
            </div>

            <h2
              style={{
                color: '#FFFFFF',
                fontSize: 130,
                fontWeight: '900',
                margin: '0 0 15px 0',
                textAlign: 'center',
              }}
            >
              {formatPriceLegacy(property.price)}
            </h2>

            <h1
              style={{
                color: '#E2E8F0',
                fontSize: 65,
                fontWeight: 'bold',
                margin: '0 0 25px 0',
                lineHeight: 1.2,
                textAlign: 'center',
              }}
            >
              {property.name || property.type || 'Propiedad Exclusiva'}
            </h1>

            <p
              style={{
                color: '#CBD5E1',
                fontSize: 40,
                margin: '0 0 45px 0',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              {property.location?.city || ''}
            </p>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '50px', justifyContent: 'center' }}>
              {areaLabelV1 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    padding: '15px 30px',
                    borderRadius: '40px',
                    border: '1px solid rgba(255,255,255,0.3)',
                  }}
                >
                  <span style={{ color: '#FFFFFF', fontSize: 32, fontWeight: '500' }}>{areaLabelV1}</span>
                </div>
              )}
              {property.beds > 0 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    padding: '15px 30px',
                    borderRadius: '40px',
                    border: '1px solid rgba(255,255,255,0.3)',
                  }}
                >
                  <span style={{ color: '#FFFFFF', fontSize: 32, fontWeight: '500' }}>{property.beds} Dorms</span>
                </div>
              )}
              {property.baths > 0 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    padding: '15px 30px',
                    borderRadius: '40px',
                    border: '1px solid rgba(255,255,255,0.3)',
                  }}
                >
                  <span style={{ color: '#FFFFFF', fontSize: 32, fontWeight: '500' }}>{property.baths} Baños</span>
                </div>
              )}
            </div>

            <div style={{ width: '80%', height: '1px', backgroundColor: 'rgba(255,255,255,0.3)', marginBottom: '30px' }} />

            <p
              style={{
                color: brandColorV1,
                fontSize: 32,
                letterSpacing: '4px',
                textTransform: 'uppercase',
                margin: 0,
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              roggeroyroma.com.ar
            </p>
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (error) {
    console.error('Error generating story image:', error);
    return new Response(
      JSON.stringify({
        error: 'Error generating story image',
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 5).join('\n'),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function GET(request, context) {
  return handleStoryRequest(request, context, null);
}

export async function POST(request, context) {
  let imageBase64 = null;
  try {
    const body = await request.json();
    imageBase64 = body?.imageBase64 || null;
  } catch {}
  return handleStoryRequest(request, context, imageBase64);
}

