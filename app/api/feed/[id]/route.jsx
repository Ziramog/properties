import { ImageResponse } from 'next/og';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import mongoose from 'mongoose';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
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

function parseFeedTitleAndCondition(property) {
  const rawName = (property.name || '').trim();
  const rawDesc = (property.description || '').trim();
  const allText = `${rawName} ${rawDesc}`;
  const city = (property.location?.city || '').trim().toLowerCase();

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

  let cleanTitle = rawName;
  cleanTitle = cleanTitle.replace(/EDIFICIO\s+["“]([^"”]+)["”]/gi, 'EDIFICIO $1');

  if (cleanTitle.includes(',')) {
    const parts = cleanTitle.split(',').map((s) => s.trim()).filter(Boolean);

    if (parts.length === 2 && !/^c[oó]rdoba$/i.test(parts[0]) && !/permuta|canje/i.test(parts[1])) {
      return {
        title: cleanTitle,
        condition,
      };
    }

    const filteredParts = parts.filter((part) => {
      if (/^c[oó]rdoba$/i.test(part)) return false;
      if (/permuta|canje|toma/i.test(part)) return false;
      if (/^en venta$/i.test(part)) return false;
      return true;
    });

    const typePartIndex = filteredParts.findIndex((p) =>
      /casa|dpto|depto|departamento|d[uú]plex|lote|terreno|campo|chacra|galp[oó]n|oficina|local/i.test(p)
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

function extractPublicationBadges(property) {
  const badges = [];

  if (property.is_featured) {
    badges.push({ text: 'DESTACADA', isPrimary: true });
  }

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

  const rawText = `${property.name || ''} ${property.description || ''}`;
  if (/permuta|canje|toma menor|toma veh[ií]culo/i.test(rawText)) {
    if (!badges.some((b) => b.text.includes('PERMUTA'))) {
      badges.push({ text: 'ACEPTA PERMUTA', isPrimary: badges.length === 0 });
    }
  }

  if (badges.length === 0) {
    const op = property.operation === 'alquiler' ? 'ALQUILER' : 'VENTA';
    badges.push({ text: op, isPrimary: true });
  }

  return badges;
}

function extractFeedData(property) {
  const isBuiltType =
    ['Casa', 'Departamento', 'Dpto', 'Duplex', 'Dúplex', 'Chalet', 'Villa', 'Local', 'Oficina', 'Galpón', 'Galpon', 'Cochera', 'Edificio', 'Hotel'].includes(property.type) ||
    Number(property.beds) > 0 ||
    Number(property.baths) > 0 ||
    (property.covered_area != null && Number(property.covered_area) > 0);

  const isLand =
    !isBuiltType &&
    (['Terreno', 'Lote', 'Campo', 'Chacra'].includes(property.type) ||
      /lote|terreno/i.test(property.type || '') ||
      /lote|terreno|fracci[oó]n|campo/i.test(property.name || ''));

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
      areaDisplay = `${property.covered_area.toLocaleString('es-AR')} m²`;
    } else if (property.square_feet != null && property.square_feet > 0) {
      areaDisplay = `${property.square_feet.toLocaleString('es-AR')} m²`;
    }
  }

  const coveredAreaDisplay =
    !isLand && property.covered_area != null && property.covered_area > 0
      ? `${property.covered_area.toLocaleString('es-AR')} m²`
      : null;

  const totalAreaDisplay =
    !isLand && property.square_feet != null && property.square_feet > 0
      ? `${property.square_feet.toLocaleString('es-AR')} m²`
      : null;

  const beds = !isLand && Number(property.beds) > 0 ? Number(property.beds) : null;
  const baths = !isLand && Number(property.baths) > 0 ? Number(property.baths) : null;

  const { title, condition } = parseFeedTitleAndCondition(property);
  const badges = extractPublicationBadges(property);

  if (condition && !badges.some((b) => b.text.toLowerCase() === condition.toLowerCase())) {
    badges.push({ text: condition.toUpperCase(), isPrimary: false });
  }

  const priceDisplay = formatPriceDisplay(property.price);

  const locParts = [
    property.location?.street,
    property.location?.city || 'Alta Gracia',
    property.location?.state || 'Córdoba',
  ].filter(Boolean);
  const locationFull = locParts.join(', ');

  return {
    title,
    priceDisplay,
    isLand,
    areaDisplay,
    coveredAreaDisplay,
    totalAreaDisplay,
    beds,
    baths,
    locationFull,
    badges,
  };
}

async function handleFeedRequest(request, { params }, clientImageBase64 = null) {
  try {
    await connectDB();
    const { id } = await params;
    const property = await getPropertyByIdOrSlug(id);

    if (!property) {
      return new Response('Not found', { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const index = parseInt(searchParams.get('index') || '0', 10);
    const imageToUse = property.images?.[index] || property.images?.[0];

    // Formato Feed 4:5 oficial de Instagram (1080 x 1350)
    const size = {
      width: 1080,
      height: 1350,
    };

    const corporateOrange = '#F26B2E';

    // Carga de logotipo oficial blanco (idéntico a historias con fallback)
    const logoBuffer = readFileSync(join(process.cwd(), 'public', 'images', 'ISOTIPO R&R-Photoroom.png'));
    const isoLogoUrl = `data:image/png;base64,${logoBuffer.toString('base64')}`;

    const whiteLogoPath = join(process.cwd(), 'public', 'images', 'ISOTIPO R&R-White.png');
    const isoWhiteLogoUrl = existsSync(whiteLogoPath)
      ? `data:image/png;base64,${readFileSync(whiteLogoPath).toString('base64')}`
      : isoLogoUrl;

    // Si el navegador ya recortó y mejoró la imagen en <canvas>, se usa directamente sin hacer fetch
    const rawImgUrl = typeof imageToUse === 'string' ? imageToUse : imageToUse?.url;
    const imageUrl =
      clientImageBase64 && clientImageBase64.startsWith('data:image/')
        ? clientImageBase64
        : rawImgUrl
          ? await toDataUrl(rawImgUrl)
          : null;

    // Íconos SVG oficiales con trazo calibrado
    const rawBedSvg = readFileSync(join(process.cwd(), 'public', 'senada', 'images', 'icons', 'ico_bed.svg'), 'utf8');
    const bedIconUrl = `data:image/svg+xml;base64,${Buffer.from(rawBedSvg.replace(/stroke-width="[^"]*"/g, 'stroke-width="1.8"')).toString('base64')}`;

    const rawBathSvg = readFileSync(join(process.cwd(), 'public', 'senada', 'images', 'icons', 'ico_bath.svg'), 'utf8');
    const bathIconUrl = `data:image/svg+xml;base64,${Buffer.from(rawBathSvg).toString('base64')}`;

    const rawSqftSvg = readFileSync(join(process.cwd(), 'public', 'senada', 'images', 'icons', 'ico_sqfoot.svg'), 'utf8');
    const sqftIconUrl = `data:image/svg+xml;base64,${Buffer.from(rawSqftSvg.replace(/stroke-width="[^"]*"/g, 'stroke-width="1.8"')).toString('base64')}`;

    const assets = {
      isoLogoUrl,
      isoWhiteLogoUrl,
      imageUrl,
      bedIconUrl,
      bathIconUrl,
      sqftIconUrl,
    };

    // Fuentes oficiales
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

    const data = extractFeedData(property);

    // ========================================================
    // CASO 1: IMAGEN INICIAL (index === 0) — Portada Editorial Feed
    // ========================================================
    if (index === 0) {
      const titleFontSize = data.title.length > 48 ? 44 : data.title.length > 28 ? 52 : 60;

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
            {/* Fotografía principal (4:5 nativo 1080x1350) */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '1080px', height: '1350px', display: 'flex' }}>
              <img
                src={assets.imageUrl}
                width={1080}
                height={1350}
                style={{ width: '1080px', height: '1350px', objectFit: 'cover' }}
              />
            </div>

            {/* Overlay Superior (28% = 378px, difusión progresiva 0% -> 100% del bloque) */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '28%',
                backgroundImage:
                  'linear-gradient(to bottom, rgba(11, 13, 16, 0.78) 0%, rgba(11, 13, 16, 0.45) 45%, rgba(11, 13, 16, 0.12) 78%, rgba(11, 13, 16, 0) 100%)',
                display: 'flex',
              }}
            />

            {/* Overlay Inferior (46% = 621px, difusión progresiva sin franja negra dura) */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '46%',
                backgroundImage:
                  'linear-gradient(to top, rgba(11, 13, 16, 0.88) 0%, rgba(11, 13, 16, 0.68) 42%, rgba(11, 13, 16, 0.28) 74%, rgba(11, 13, 16, 0) 100%)',
                display: 'flex',
              }}
            />

            {/* Header Institucional (Safe Zone Feed 4:5: top 64px, unificado en las 7 láminas) */}
            <div
              style={{
                position: 'absolute',
                top: 64,
                left: 0,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 20,
              }}
            >
              <img
                src={assets.isoWhiteLogoUrl}
                width={200}
                height={88}
                style={{
                  objectFit: 'contain',
                  filter: 'drop-shadow(0px 4px 14px rgba(0,0,0,0.85))',
                  marginBottom: '8px',
                }}
              />

              <span
                style={{
                  color: '#FFFFFF',
                  fontSize: 30,
                  fontFamily: '"Montserrat", sans-serif',
                  fontWeight: 700,
                  letterSpacing: '3.5px',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  textShadow: '0 2px 10px rgba(0,0,0,0.9)',
                  marginBottom: '5px',
                }}
              >
                SILVIA ROGGERO & ROMA
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '38px', height: '2px', backgroundColor: corporateOrange }} />
                <span
                  style={{
                    color: '#FFFFFF',
                    fontSize: 16,
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
                <div style={{ width: '38px', height: '2px', backgroundColor: corporateOrange }} />
              </div>
            </div>

            {/* Etiquetas (Badges) — Ajustadas al margen superior 4:5 */}
            <div
              style={{
                position: 'absolute',
                top: 232,
                left: 55,
                display: 'flex',
                gap: '10px',
                zIndex: 20,
              }}
            >
              {data.badges.map((b, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: b.isPrimary ? corporateOrange : 'rgba(20, 26, 38, 0.85)',
                    border: b.isPrimary ? 'none' : '1px solid rgba(255, 255, 255, 0.35)',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.55)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      color: '#FFFFFF',
                      fontSize: 20,
                      fontWeight: 700,
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      fontFamily: '"Montserrat", sans-serif',
                    }}
                  >
                    {b.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Bloque Editorial Inferior (Safe Zone Feed 4:5: padding-bottom 58px sin banda muerta) */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: '0 55px 58px 55px',
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
                  lineHeight: 1.14,
                  margin: '0 0 12px 0',
                  textShadow: '0 3px 14px rgba(0,0,0,0.9)',
                }}
              >
                {data.title}
              </h1>

              {/* Ubicación con Pin Naranja Sólido al ras izquierdo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <svg width="28" height="32" viewBox="4.5 1.5 15 21" fill="none" style={{ flexShrink: 0 }}>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2ZM12 11.5C10.6193 11.5 9.5 10.3807 9.5 9C9.5 7.61929 10.6193 6.5 12 6.5C13.3807 6.5 14.5 7.61929 14.5 9C14.5 10.3807 13.3807 11.5 12 11.5Z"
                    fill={corporateOrange}
                  />
                </svg>
                <span
                  style={{
                    color: '#F1F5F9',
                    fontSize: 30,
                    fontWeight: 500,
                    lineHeight: 1.25,
                    fontFamily: '"Montserrat", sans-serif',
                    textShadow: '0 2px 8px rgba(0,0,0,0.85)',
                  }}
                >
                  {data.locationFull}
                </span>
              </div>

              {/* Separador fino */}
              <div
                style={{
                  width: '100%',
                  height: '1px',
                  backgroundColor: 'rgba(255, 255, 255, 0.22)',
                  marginBottom: '18px',
                }}
              />

              {/* Características — Íconos grandes estilo ficha web + solo cifras */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '18px' }}>
                {Boolean(data.isLand && data.areaDisplay) ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <svg
                      width="60"
                      height="60"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={corporateOrange}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m12 8 6-3-6-3v10" />
                      <path d="m8 11.99-5.5 3.14a1 1 0 0 0 0 1.74l8.5 4.86a2 2 0 0 0 2 0l8.5-4.86a1 1 0 0 0 0-1.74L16 12" />
                      <path d="m6.49 12.85 11.02 6.3" />
                      <path d="M17.51 12.85 6.49 19.15" />
                    </svg>
                    <span style={{ color: '#FFFFFF', fontSize: 38, fontWeight: 700, fontFamily: '"Montserrat", sans-serif' }}>
                      {data.areaDisplay}
                    </span>
                  </div>
                ) : null}

                {!data.isLand ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {Boolean(data.beds && data.beds > 0) ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img src={assets.bedIconUrl} width={70} height={54} style={{ objectFit: 'contain' }} />
                        <span style={{ color: '#FFFFFF', fontSize: 40, fontWeight: 700, fontFamily: '"Montserrat", sans-serif' }}>
                          {data.beds}
                        </span>
                      </div>
                    ) : null}

                    {Boolean(data.beds && data.beds > 0 && data.baths && data.baths > 0) ? (
                      <div style={{ width: '1.5px', height: '38px', backgroundColor: 'rgba(255, 255, 255, 0.35)', margin: '0 26px' }} />
                    ) : null}

                    {Boolean(data.baths && data.baths > 0) ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img src={assets.bathIconUrl} width={65} height={52} style={{ objectFit: 'contain' }} />
                        <span style={{ color: '#FFFFFF', fontSize: 40, fontWeight: 700, fontFamily: '"Montserrat", sans-serif' }}>
                          {data.baths}
                        </span>
                      </div>
                    ) : null}

                    {Boolean((data.beds > 0 || data.baths > 0) && data.coveredAreaDisplay) ? (
                      <div style={{ width: '1.5px', height: '38px', backgroundColor: 'rgba(255, 255, 255, 0.35)', margin: '0 26px' }} />
                    ) : null}

                    {Boolean(data.coveredAreaDisplay) ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img src={assets.sqftIconUrl} width={56} height={56} style={{ objectFit: 'contain' }} />
                        <span style={{ color: '#FFFFFF', fontSize: 38, fontWeight: 700, fontFamily: '"Montserrat", sans-serif' }}>
                          {data.coveredAreaDisplay}
                        </span>
                      </div>
                    ) : null}

                    {Boolean(!data.coveredAreaDisplay && data.totalAreaDisplay) ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        {(data.beds > 0 || data.baths > 0) ? (
                          <div style={{ width: '1.5px', height: '38px', backgroundColor: 'rgba(255, 255, 255, 0.35)', margin: '0 26px' }} />
                        ) : null}
                        <svg
                          width="60"
                          height="60"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={corporateOrange}
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m12 8 6-3-6-3v10" />
                          <path d="m8 11.99-5.5 3.14a1 1 0 0 0 0 1.74l8.5 4.86a2 2 0 0 0 2 0l8.5-4.86a1 1 0 0 0 0-1.74L16 12" />
                          <path d="m6.49 12.85 11.02 6.3" />
                          <path d="M17.51 12.85 6.49 19.15" />
                        </svg>
                        <span style={{ color: '#FFFFFF', fontSize: 38, fontWeight: 700, fontFamily: '"Montserrat", sans-serif' }}>
                          {data.totalAreaDisplay}
                        </span>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {/* Fila del Precio Prominente */}
              <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '22px' }}>
                <span
                  style={{
                    color: corporateOrange,
                    fontSize: 62,
                    fontFamily: '"PT Serif", serif',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    textShadow: '0 2px 10px rgba(0,0,0,0.6)',
                  }}
                >
                  {data.priceDisplay}
                </span>
              </div>

              {/* Línea editorial naranja centrada en X (en consonancia con Social Studio e Historias) */}
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: '440px',
                    height: '4px',
                    backgroundColor: corporateOrange,
                    borderRadius: '2px',
                  }}
                />
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

    // ========================================================
    // CASO 2: IMÁGENES SECUNDARIAS (index > 0)
    // "las secundarias solo isologo blanco con titulo propiedad"
    // ========================================================
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
          {/* Fotografía protagonista limpia (4:5 nativo 1080x1350) */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '1080px', height: '1350px', display: 'flex' }}>
            <img
              src={assets.imageUrl}
              width={1080}
              height={1350}
              style={{ width: '1080px', height: '1350px', objectFit: 'cover' }}
            />
          </div>

          {/* Degradado superior progresivo (34% = 459px, 0% -> 100% del contenedor; cubre el isologo ubicado en la zona segura central y sobrevive a un recorte 1:1) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '34%',
              backgroundImage:
                'linear-gradient(to bottom, rgba(11, 13, 16, 0.70) 0%, rgba(11, 13, 16, 0.62) 30%, rgba(11, 13, 16, 0.38) 55%, rgba(11, 13, 16, 0.12) 80%, rgba(11, 13, 16, 0) 100%)',
              display: 'flex',
            }}
          />

          {/* Degradado inferior progresivo (34% = 459px, 0% -> 100% del contenedor; cubre título y ubicación ubicados en la zona segura central) */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '34%',
              backgroundImage:
                'linear-gradient(to top, rgba(11, 13, 16, 0.78) 0%, rgba(11, 13, 16, 0.68) 30%, rgba(11, 13, 16, 0.40) 55%, rgba(11, 13, 16, 0.12) 80%, rgba(11, 13, 16, 0) 100%)',
              display: 'flex',
            }}
          />

          {/* Top Center: SOLO Isologo Blanco (Safe Zone central: top 145px; se mantiene visible aunque Instagram recorte la lámina a 1:1, que quita 135px por lado) */}
          <div
            style={{
              position: 'absolute',
              top: 145,
              left: 0,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              zIndex: 20,
            }}
          >
            <img
              src={assets.isoWhiteLogoUrl}
              width={200}
              height={88}
              style={{
                objectFit: 'contain',
                filter: 'drop-shadow(0px 4px 14px rgba(0,0,0,0.85))',
              }}
            />
          </div>

          {/* Bottom Center: SOLO Título y Ubicación de la Propiedad (Safe Zone central: padding-bottom 145px; visible aunque Instagram recorte a 1:1) */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '0 55px 145px 55px',
              zIndex: 20,
            }}
          >
            <span
              style={{
                color: '#FFFFFF',
                fontSize: 34,
                fontFamily: '"PT Serif", serif',
                fontWeight: 700,
                textAlign: 'center',
                textShadow: '0 2px 14px rgba(0,0,0,0.95)',
                lineHeight: 1.2,
              }}
            >
              {data.title}
            </span>
            {data.locationFull && (
              <span
                style={{
                  color: '#CBD5E1',
                  fontSize: 20,
                  fontFamily: '"Montserrat", sans-serif',
                  fontWeight: 500,
                  marginTop: '8px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.9)',
                  textAlign: 'center',
                }}
              >
                {data.locationFull}
              </span>
            )}
          </div>
        </div>
      ),
      {
        ...size,
        fonts: fontOptions,
      }
    );
  } catch (error) {
    console.error('Error generating feed image:', error);
    return new Response(
      JSON.stringify({
        error: 'Error generating feed image',
        message: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function GET(request, context) {
  return handleFeedRequest(request, context, null);
}

export async function POST(request, context) {
  let imageBase64 = null;
  try {
    const body = await request.json();
    imageBase64 = body?.imageBase64 || null;
  } catch {}
  return handleFeedRequest(request, context, imageBase64);
}

