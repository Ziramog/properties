export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 segundos timeout para generación IA

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import connectDB from '@/config/database';
import OpenAI from 'openai';

function buildRetouchPrompt(meta) {
  const W = Number(meta.width) || 1080;
  const H = Number(meta.height) || 1350;
  const area = meta.area || 'titles_logo';
  const userInstruction = (meta.instruction || '').trim();
  const layers = Array.isArray(meta.layers) ? meta.layers.filter((l) => l && l.visible !== false) : [];

  const logoLayer = layers.find((l) => l.id === 'logo');
  const titleLayers = layers.filter((l) => ['category', 'title', 'accent', 'support'].includes(l.id));
  const bottomLayers = layers.filter((l) => ['cta', 'location'].includes(l.id));

  let logoZoneDesc = `Upper 22% of the frame (y = 0px to ${Math.round(H * 0.24)}px, centered horizontally)`;
  if (logoLayer) {
    const y1 = Math.max(0, Math.round(logoLayer.y - 30));
    const y2 = Math.min(H, Math.round(logoLayer.y + (logoLayer.height || 160) + 40));
    logoZoneDesc = `Top zone from y = ${y1}px to ${y2}px (${Math.round((y1 / H) * 100)}% to ${Math.round((y2 / H) * 100)}% from the top edge, x = ${Math.round(logoLayer.x)}px to ${Math.round(logoLayer.x + logoLayer.width)}px)`;
  }

  let titlesZoneDesc = `Middle and center-left area from y = ${Math.round(H * 0.26)}px to ${Math.round(H * 0.82)}px (26% to 82% vertical height), strongest on the left and center where large white and orange serif headlines sit`;
  if (titleLayers.length > 0) {
    const minY = Math.max(0, Math.min(...titleLayers.map((l) => l.y)) - 40);
    const maxY = Math.min(H, Math.max(...titleLayers.map((l) => l.y + (l.height || 120))) + 45);
    const align = titleLayers[0]?.align || 'left';
    const horizFocus =
      align === 'center'
        ? 'centered horizontally across the middle of the frame'
        : align === 'right'
          ? 'strongest on the right side and center of the frame, feathering smoothly toward the left'
          : 'strongest on the left side and center of the frame, feathering smoothly toward the right so the property remains bright';
    titlesZoneDesc = `Headline & subtitle zone from y = ${Math.round(minY)}px to ${Math.round(maxY)}px (${Math.round((minY / H) * 100)}% to ${Math.round((maxY / H) * 100)}% vertical height), ${horizFocus}`;
  }

  let bottomZoneDesc = `Lower 18% of the frame (y = ${Math.round(H * 0.82)}px to ${H}px)`;
  if (bottomLayers.length > 0) {
    const minY = Math.max(0, Math.min(...bottomLayers.map((l) => l.y)) - 30);
    bottomZoneDesc = `Bottom footer/CTA zone from y = ${Math.round(minY)}px to ${H}px (${Math.round((minY / H) * 100)}% to 100% vertical height)`;
  }

  let targetZonesBlock = '';
  if (area === 'logo' || area === 'upper') {
    targetZonesBlock = `1. LOGO / UPPER ZONE (${logoZoneDesc}): Apply a deep, ultra-diffused dark graduated overlay (60% to 75% darkness at the top fading smoothly downward) so the white brand logo will have 100% crystal-clear contrast.`;
  } else if (area === 'lower') {
    targetZonesBlock = `1. LOWER / FOOTER ZONE (${bottomZoneDesc}): Apply a deep, ultra-diffused dark graduated overlay from the bottom upward so bottom text and CTA stand out clearly.`;
  } else {
    // 'titles_logo', 'titles', 'general' -> Always protect BOTH the Logo zone and the Titles zone (plus subtle bottom footer vignette)
    targetZonesBlock = `1. LOGO ZONE (${logoZoneDesc}): Apply a deep, ultra-diffused dark graduated overlay from the top edge downward (60% to 75% darkness at the top with a wide, silky-smooth feathering transition) so a white brand logo placed at the top stands out with crisp contrast against the sky or ceiling.
2. TITLES ZONE (${titlesZoneDesc}): Apply a wide, deep, ultra-soft, deeply diffused dark radial/atmospheric shadow overlay (60% to 75% darkness at the core with a very wide, seamless organic feathering transition) behind the headline and subtitle zone so large white and orange serif typography will read with 100% perfection.
3. FOOTER ZONE (${bottomZoneDesc}): Apply a soft, subtle dark bottom vignette so the location line at the bottom remains legible.`;
  }

  return `You are an expert architectural and editorial photo retoucher for a luxury real estate brand.
Edit the provided real estate photograph (Image 1, canvas ${W}x${H}) to create a rich, deep, ultra-diffused dark overlay (smooth atmospheric shadow vignette / soft-feathered dark gradient, 60% to 75% darkness at the core with a very wide, seamless feathering transition) in the following zones so that white and orange editorial text and a white brand logo will be 100% legible when overlaid later by the editor:

${targetZonesBlock}

CRITICAL RULES:
- The dark overlays must be clearly visible, deep, and ultra-diffused: zero hard borders, zero boxes, and zero sharp lines. Use smooth, wide organic gradient transitions like a professional graduated neutral-density (ND) filter and feathered radial burn in Lightroom/Capture One.
- Keep the main focal area of the property (where there is no text) naturally illuminated so the contrast between the dark diffused text/logo zones and the lit property looks dramatic, editorial, and high-end.
- NEVER draw, render, or add any text, letters, words, numbers, logos, watermarks, or buttons in the image. Output ONLY the clean retouched background photograph with the diffused dark overlays baked into the lighting.
- Preserve the exact real building architecture, doors, windows, pool, garden, geometry, materials, and perspective without inventing or removing any architectural features.
- Additional user guidance: ${userInstruction}`;
}

export async function POST(request) {
  try {
    await connectDB();
    // 1. Verificación estricta de sesión y rol Superadmin
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Acceso no autorizado: requiere rol superadmin' },
        { status: 401 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'El servicio de IA no está configurado en el servidor (falta OPENAI_API_KEY)' },
        { status: 503 }
      );
    }

    // 2. Parseo de multipart/form-data
    const formData = await request.formData();
    const metadataStr = formData.get('metadata');
    if (!metadataStr) {
      return NextResponse.json(
        { error: 'Payload inválido: metadata no proporcionada' },
        { status: 400 }
      );
    }

    let meta;
    try {
      meta = JSON.parse(metadataStr);
    } catch {
      return NextResponse.json(
        { error: 'Metadata corrupta: no es un JSON válido' },
        { status: 400 }
      );
    }

    if (meta.schema !== 'rr-ai-retouch-v1') {
      return NextResponse.json(
        { error: 'Esquema de solicitud no soportado' },
        { status: 422 }
      );
    }

    // Usamos source-photo.png (o background.png) como lienzo fotográfico limpio sin letras
    // para que gpt-image-2 esculpa el overlay oscuro ultra-difuso directamente sobre la foto real
    const photoFile = formData.get('source-photo.png') || formData.get('background.png');

    if (!photoFile || typeof photoFile.arrayBuffer !== 'function') {
      return NextResponse.json(
        { error: 'Se requiere source-photo.png o background.png para procesar el retoque' },
        { status: 400 }
      );
    }

    // Límite de tamaño: 15MB
    const MAX_FILE_SIZE = 15 * 1024 * 1024;
    if (photoFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'El archivo excede el tamaño máximo permitido (15MB)' },
        { status: 413 }
      );
    }

    const buf = Buffer.from(await photoFile.arrayBuffer());
    const mime = photoFile.type && photoFile.type.startsWith('image/') ? photoFile.type : 'image/jpeg';
    const ext = mime.includes('png') ? 'png' : 'jpg';

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const bgUpload = await OpenAI.toFile(buf, `background.${ext}`, { type: mime });

    const combinedPrompt = buildRetouchPrompt(meta);

    console.log(
      `[SocialStudio-Retouch] Procesando pieza "${meta.pieceName || meta.pieceIndex}" (${meta.width}x${meta.height}) - Área: ${meta.area || 'titles_logo'}`
    );

    const aiResponse = await openai.images.edit({
      model: 'gpt-image-2',
      image: bgUpload,
      prompt: combinedPrompt,
      size: 'auto',
      quality: 'medium',
      output_format: 'jpeg',
      output_compression: 92,
    });

    const resultImage = aiResponse?.data?.[0];
    if (!resultImage || !resultImage.b64_json) {
      console.error('[SocialStudio-Retouch] Respuesta vacía de OpenAI:', aiResponse);
      return NextResponse.json(
        { error: 'El proveedor de IA no devolvió los datos de imagen esperados' },
        { status: 502 }
      );
    }

    const base64Data = resultImage.b64_json;
    const dataUrl = `data:image/jpeg;base64,${base64Data}`;

    console.log(`[SocialStudio-Retouch] Éxito: Retoque generado correctamente (${base64Data.length} chars)`);

    // 5. Retornar según el contrato del frontend 2.9
    return NextResponse.json({
      imageDataUrl: dataUrl,
      image_base64: base64Data,
    });
  } catch (error) {
    console.error('[SocialStudio-Retouch] Error en procesamiento:', error);

    const status = error.status || (error.code === 'rate_limit_exceeded' ? 429 : 500);
    const clientMessage =
      error.status === 429
        ? 'Cuota o límite de peticiones de IA excedido temporalmente. Intente nuevamente en unos minutos.'
        : error.message && !error.message.includes('sk-')
          ? error.message
          : 'Error interno al procesar el retoque fotográfico.';

    return NextResponse.json({ error: clientMessage }, { status });
  }
}
