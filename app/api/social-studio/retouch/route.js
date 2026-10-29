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
  const tightBoxes = Array.isArray(meta.tightBoxes) ? meta.tightBoxes : [];

  const boxDescriptions = tightBoxes
    .map(
      (b, idx) =>
        `  - Zone ${idx + 1} (${b.label || b.id}): tight box x=${Math.round(b.x)}..${Math.round(b.x + b.w)}px, y=${Math.round(b.y)}..${Math.round(b.y + b.h)}px`
    )
    .join('\n');

  return `You are a precision editorial photo retoucher for a real estate brand.
Edit the provided real estate photograph (canvas ${W}x${H}) with STRICT LOCALIZED RESTRAINT:

PRIMARY OBJECTIVE:
Apply ONLY small, localized, soft-feathered dark cushions (35% to 45% subtle darkening, NEVER pitch black) strictly behind the exact bounding boxes of the text and logo listed below, while keeping 100% of the rest of the photograph at its EXACT original brightness, luminosity, sky color, and daytime/sunset exposure.

TARGET TIGHT ZONES (darken ONLY inside these small localized boxes with a soft ~60px Gaussian feather):
${boxDescriptions || `  - Logo box at top center and title lines on the left (focus: ${area})`}

CRITICAL RULES — DO NOT VIOLATE:
1. DO NOT darken the overall photograph! Do NOT turn a bright sky, sunset, white house, or swimming pool dark outside the tight target boxes above. At least 75% to 85% of the image must retain its exact original brightness and natural colors.
2. Do NOT apply full-width dark bands across the top or bottom of the image. The soft shadow cushion behind the logo must ONLY cover the width of the logo itself, leaving the sky to its left and right completely bright.
3. The soft shadow cushion behind the titles and subtitles must ONLY cover the actual width of the words (not the full width of the photo), leaving the property and pool next to the text completely bright and untouched.
4. NEVER draw, render, or add any text, letters, words, numbers, logos, or buttons in the image. Output ONLY the clean background photograph.
5. Preserve 100% of the real building architecture, geometry, materials, and perspective.
- User guidance: ${userInstruction}`;
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

    const photoFile = formData.get('source-photo.png') || formData.get('background.png');

    if (!photoFile || typeof photoFile.arrayBuffer !== 'function') {
      return NextResponse.json(
        { error: 'Se requiere source-photo.png o background.png para procesar el retoque' },
        { status: 400 }
      );
    }

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
      `[SocialStudio-Retouch] Procesando pieza "${meta.pieceName || meta.pieceIndex}" (${meta.width}x${meta.height}) - Área: ${meta.area || 'titles_logo'} - Cajas: ${meta.tightBoxes?.length || 0}`
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
