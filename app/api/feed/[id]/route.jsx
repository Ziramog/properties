import { ImageResponse } from 'next/og';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import mongoose from 'mongoose';
import { formatPriceDisplay } from '@/utils/priceUtils';
import { loadSocialBrandAssets, loadSocialExportFonts } from '@/utils/socialExportAssets';

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
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' },
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

  const priceDisplay = formatPriceDisplay(property.price, property.operation);

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
    const showLogo = searchParams.get('logo') !== '0';
    const showDetails = searchParams.get('details') !== '0';
    const fitMode = searchParams.get('fit') === 'contain' ? 'contain' : 'cover';
    const rawH = parseInt(searchParams.get('h') || '1350', 10);
    const imageToUse = property.images?.[index] || property.images?.[0];

    // Formato Feed oficial (1080x1350 en 4:5; alto dinámico 566..1350 en "Original (apaisado)")
    const targetW = 1080;
    const targetH = Number.isFinite(rawH) ? Math.max(566, Math.min(1350, rawH)) : 1350;
    const size = {
      width: targetW,
      height: targetH,
    };

    const isCompactLandscape = targetH < 1050;
    const compactScale = isCompactLandscape ? Math.max(0.56, targetH / 1350) : 1;

    const corporateOrange = '#F26B2E';

    // Si el navegador ya recortó y mejoró la imagen en <canvas>, se usa directamente sin hacer fetch
    const rawImgUrl = typeof imageToUse === 'string' ? imageToUse : imageToUse?.url;
    const imageUrl =
      clientImageBase64 && clientImageBase64.startsWith('data:image/')
        ? clientImageBase64
        : rawImgUrl
          ? await toDataUrl(rawImgUrl)
          : null;

    const assets = {
      ...loadSocialBrandAssets(),
      imageUrl,
    };

    // Fuentes oficiales del sitio (PT Serif + Lato .ttf compatibles con Satori)
    const fontOptions = loadSocialExportFonts();

    const data = extractFeedData(property);
    const titleFontSize = data.title.length > 48 ? 44 : data.title.length > 28 ? 52 : 60;
    const effectiveTitleFontSize = isCompactLandscape
      ? Math.round(titleFontSize * (targetH <= 650 ? 0.66 : 0.76))
      : titleFontSize;
    const logoWidth = isCompactLandscape ? Math.round(280 + (compactScale - 0.56) * 180) : 430;
    const logoHeight = isCompactLandscape ? Math.round((logoWidth * 174) / 430) : 174;
    const logoTop = isCompactLandscape ? Math.round(24 * compactScale + 8) : 56;
    const pinW = isCompactLandscape ? 20 : 28;
    const pinH = isCompactLandscape ? 24 : 32;
    const locFontSize = isCompactLandscape ? 22 : 30;
    const statFontSize = isCompactLandscape ? 26 : 38;
    const bedBathFontSize = isCompactLandscape ? 26 : 40;
    const statGap = isCompactLandscape ? '10px' : '14px';
    const statDividerHeight = isCompactLandscape ? '26px' : '38px';
    const statDividerMargin = isCompactLandscape ? '0 18px' : '0 26px';

    // Overlay Superior compartido (solo cuando se muestra el logo para no oscurecer cielos innecesariamente)
    const topOverlay = showLogo ? (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: isCompactLandscape ? '26%' : '28%',
          backgroundImage:
            'linear-gradient(to bottom, rgba(11, 13, 16, 0.78) 0%, rgba(11, 13, 16, 0.45) 45%, rgba(11, 13, 16, 0.12) 78%, rgba(11, 13, 16, 0) 100%)',
          display: 'flex',
        }}
      />
    ) : null;

    // Header institucional completo unificado en las 7 láminas (logo maestro con bajada integrada)
    const brandHeader = showLogo ? (
      <div
        style={{
          position: 'absolute',
          top: logoTop,
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 20,
        }}
      >
        <img
          src={assets.brandFullWhiteLogoUrl}
          width={logoWidth}
          height={logoHeight}
          style={{
            objectFit: 'contain',
            filter: 'drop-shadow(0px 4px 14px rgba(0,0,0,0.85))',
          }}
        />
      </div>
    ) : null;

    const badgeItems = data.badges.map((b, idx) => (
      <div
        key={idx}
        style={{
          backgroundColor: b.isPrimary ? corporateOrange : 'rgba(20, 26, 38, 0.85)',
          border: b.isPrimary ? 'none' : '1px solid rgba(255, 255, 255, 0.35)',
          padding: isCompactLandscape ? '6px 14px' : '10px 20px',
          borderRadius: isCompactLandscape ? '5px' : '6px',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.55)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            color: '#FFFFFF',
            fontSize: isCompactLandscape ? 15 : 20,
            fontWeight: 700,
            letterSpacing: isCompactLandscape ? '1.2px' : '1.5px',
            textTransform: 'uppercase',
            fontFamily: '"Lato", sans-serif',
          }}
        >
          {b.text}
        </span>
      </div>
    ));

    // ========================================================
    // CASO 1: IMAGEN INICIAL (index === 0) — Portada Editorial Feed
    // ========================================================
    if (index === 0) {
      return await renderImage(
        (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#0B0D10',
              fontFamily: '"Lato", sans-serif',
              position: 'relative',
            }}
          >
            {/* Fotografía principal */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: `${targetW}px`, height: `${targetH}px`, display: 'flex' }}>
              <img
                src={assets.imageUrl}
                width={targetW}
                height={targetH}
                style={{ width: `${targetW}px`, height: `${targetH}px`, objectFit: fitMode }}
              />
            </div>

            {topOverlay}

            {/* Overlay Inferior (46% en 4:5 o 66% en apaisado, solo visible si se muestran textos/detalles) */}
            {showDetails ? (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: isCompactLandscape ? '66%' : '46%',
                  backgroundImage:
                    'linear-gradient(to top, rgba(11, 13, 16, 0.88) 0%, rgba(11, 13, 16, 0.68) 42%, rgba(11, 13, 16, 0.28) 74%, rgba(11, 13, 16, 0) 100%)',
                  display: 'flex',
                }}
              />
            ) : null}

            {brandHeader}

            {/* Etiquetas flotantes en 4:5 (en apaisado compacto se integran arriba del título para no invadir el centro ni el logo) */}
            {showDetails && !isCompactLandscape ? (
              <div
                style={{
                  position: 'absolute',
                  top: 282,
                  left: 55,
                  display: 'flex',
                  gap: '10px',
                  zIndex: 20,
                }}
              >
                {badgeItems}
              </div>
            ) : null}

            {/* Bloque Editorial Inferior (directo sobre el contenedor raíz: evita Fragment en Satori) */}
            {showDetails ? (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: isCompactLandscape ? '0 44px 20px 44px' : '0 55px 30px 55px',
                  zIndex: 20,
                }}
              >
                {isCompactLandscape && badgeItems.length > 0 ? (
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                    {badgeItems}
                  </div>
                ) : null}

                {/* Título */}
                <h1
                  style={{
                    color: '#FFFFFF',
                    fontSize: effectiveTitleFontSize,
                    fontFamily: '"PT Serif", serif',
                    fontWeight: 700,
                    lineHeight: 1.14,
                    margin: isCompactLandscape ? '0 0 6px 0' : '0 0 12px 0',
                    textShadow: '0 3px 14px rgba(0,0,0,0.9)',
                  }}
                >
                  {data.title}
                </h1>

                {/* Ubicación con Pin Naranja Sólido al ras izquierdo */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: isCompactLandscape ? '8px' : '12px',
                    marginBottom: isCompactLandscape ? '10px' : '16px',
                  }}
                >
                  <svg width={pinW} height={pinH} viewBox="4.5 1.5 15 21" fill="none" style={{ flexShrink: 0 }}>
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
                      fontSize: locFontSize,
                      fontWeight: 400,
                      lineHeight: 1.25,
                      fontFamily: '"Lato", sans-serif',
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
                    marginBottom: isCompactLandscape ? '10px' : '18px',
                  }}
                />

                {/* Características — Íconos grandes estilo ficha web + solo cifras */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: isCompactLandscape ? '10px' : '18px' }}>
                  {Boolean(data.isLand && data.areaDisplay) ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: statGap }}>
                      <svg
                        width={isCompactLandscape ? 38 : 60}
                        height={isCompactLandscape ? 38 : 60}
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
                      <span style={{ color: '#FFFFFF', fontSize: statFontSize, fontWeight: 700, fontFamily: '"Lato", sans-serif' }}>
                        {data.areaDisplay}
                      </span>
                    </div>
                  ) : null}

                  {!data.isLand ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {Boolean(data.beds && data.beds > 0) ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: statGap }}>
                          <img
                            src={assets.bedIconUrl}
                            width={isCompactLandscape ? 46 : 70}
                            height={isCompactLandscape ? 36 : 54}
                            style={{ objectFit: 'contain' }}
                          />
                          <span style={{ color: '#FFFFFF', fontSize: bedBathFontSize, fontWeight: 700, fontFamily: '"Lato", sans-serif' }}>
                            {data.beds}
                          </span>
                        </div>
                      ) : null}

                      {Boolean(data.beds && data.beds > 0 && data.baths && data.baths > 0) ? (
                        <div
                          style={{
                            width: '1.5px',
                            height: statDividerHeight,
                            backgroundColor: 'rgba(255, 255, 255, 0.35)',
                            margin: statDividerMargin,
                          }}
                        />
                      ) : null}

                      {Boolean(data.baths && data.baths > 0) ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: statGap }}>
                          <img
                            src={assets.bathIconUrl}
                            width={isCompactLandscape ? 42 : 65}
                            height={isCompactLandscape ? 34 : 52}
                            style={{ objectFit: 'contain' }}
                          />
                          <span style={{ color: '#FFFFFF', fontSize: bedBathFontSize, fontWeight: 700, fontFamily: '"Lato", sans-serif' }}>
                            {data.baths}
                          </span>
                        </div>
                      ) : null}

                      {Boolean((data.beds > 0 || data.baths > 0) && data.coveredAreaDisplay) ? (
                        <div
                          style={{
                            width: '1.5px',
                            height: statDividerHeight,
                            backgroundColor: 'rgba(255, 255, 255, 0.35)',
                            margin: statDividerMargin,
                          }}
                        />
                      ) : null}

                      {Boolean(data.coveredAreaDisplay) ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: statGap }}>
                          <img
                            src={assets.sqftIconUrl}
                            width={isCompactLandscape ? 38 : 56}
                            height={isCompactLandscape ? 38 : 56}
                            style={{ objectFit: 'contain' }}
                          />
                          <span style={{ color: '#FFFFFF', fontSize: statFontSize, fontWeight: 700, fontFamily: '"Lato", sans-serif' }}>
                            {data.coveredAreaDisplay}
                          </span>
                        </div>
                      ) : null}

                      {Boolean(!data.coveredAreaDisplay && data.totalAreaDisplay) ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: statGap }}>
                          {(data.beds > 0 || data.baths > 0) ? (
                            <div
                              style={{
                                width: '1.5px',
                                height: statDividerHeight,
                                backgroundColor: 'rgba(255, 255, 255, 0.35)',
                                margin: statDividerMargin,
                              }}
                            />
                          ) : null}
                          <svg
                            width={isCompactLandscape ? 38 : 60}
                            height={isCompactLandscape ? 38 : 60}
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
                          <span style={{ color: '#FFFFFF', fontSize: statFontSize, fontWeight: 700, fontFamily: '"Lato", sans-serif' }}>
                            {data.totalAreaDisplay}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                {/* Fila del Precio Prominente */}
                <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: isCompactLandscape ? '14px' : '28px' }}>
                  <span
                    style={{
                      color: corporateOrange,
                      fontSize: isCompactLandscape ? 42 : 62,
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
                      width: isCompactLandscape ? '300px' : '440px',
                      height: isCompactLandscape ? '3px' : '4px',
                      backgroundColor: corporateOrange,
                      borderRadius: '2px',
                    }}
                  />
                </div>
              </div>
            ) : null}
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
            fontFamily: '"Lato", sans-serif',
            position: 'relative',
          }}
        >
          {/* Fotografía protagonista limpia */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: `${targetW}px`, height: `${targetH}px`, display: 'flex' }}>
            <img
              src={assets.imageUrl}
              width={targetW}
              height={targetH}
              style={{ width: `${targetW}px`, height: `${targetH}px`, objectFit: fitMode }}
            />
          </div>

          {topOverlay}

          {/* Degradado inferior progresivo (36% en 4:5 o 44% en apaisado, solo visible si se muestran textos/detalles) */}
          {showDetails ? (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: isCompactLandscape ? '44%' : '36%',
                backgroundImage:
                  'linear-gradient(to top, rgba(11, 13, 16, 0.82) 0%, rgba(11, 13, 16, 0.72) 32%, rgba(11, 13, 16, 0.48) 58%, rgba(11, 13, 16, 0.16) 82%, rgba(11, 13, 16, 0) 100%)',
                display: 'flex',
              }}
            />
          ) : null}

          {brandHeader}

          {/* Bottom Left: Título y Dirección de la Propiedad */}
          {showDetails ? (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: isCompactLandscape ? '0 44px 30px 44px' : '0 55px 60px 55px',
                zIndex: 20,
              }}
            >
              <span
                style={{
                  color: '#FFFFFF',
                  fontSize: effectiveTitleFontSize,
                  fontFamily: '"PT Serif", serif',
                  fontWeight: 700,
                  textAlign: 'left',
                  textShadow: '0 3px 14px rgba(0,0,0,0.9)',
                  lineHeight: 1.14,
                }}
              >
                {data.title}
              </span>
              {data.locationFull && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: isCompactLandscape ? '8px' : '12px',
                    marginTop: isCompactLandscape ? '8px' : '12px',
                  }}
                >
                  <svg width={pinW} height={pinH} viewBox="4.5 1.5 15 21" fill="none" style={{ flexShrink: 0 }}>
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
                      fontSize: locFontSize,
                      fontFamily: '"Lato", sans-serif',
                      fontWeight: 400,
                      lineHeight: 1.25,
                      textShadow: '0 2px 8px rgba(0,0,0,0.85)',
                      textAlign: 'left',
                    }}
                  >
                    {data.locationFull}
                  </span>
                </div>
              )}
            </div>
          ) : null}
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

