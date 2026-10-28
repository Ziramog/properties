export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 segundos timeout para generación IA

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import connectDB from '@/config/database';
import OpenAI from 'openai';

const SYSTEM_EDITORIAL_DIRECTIVE = `Retouch only the photographic background of the provided real estate composition. Use the full composition as a placement reference for the editorial title, logo and call-to-action, but never render any letters, words, logos or graphic controls. The output must be background-only. Make minimal local lighting and tonality corrections so that the existing typography will remain legible when the editor redraws it. Preserve the exact real building structure, doors, windows, geometry, landscape, materials, angles and perspective. Do not invent, add, remove or rearrange any property features. Keep the subject and camera framing consistent. Do not introduce orange/yellow tint or heavy global darkening unless specifically requested. Output a photographic raster with the requested aspect ratio; no text.`;

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

    // Archivos enviados por el frontend 2.9
    // background.png: la base con overlays manuales (sin textos)
    // source-photo.png: fotografía original recortada al lienzo
    // reference.png: composición completa con tipografía (solo referencia visual)
    const bgFile = formData.get('background.png') || formData.get('source-photo.png');
    if (!bgFile || typeof bgFile.arrayBuffer !== 'function') {
      return NextResponse.json(
        { error: 'Se requiere background.png o source-photo.png para procesar el retoque' },
        { status: 400 }
      );
    }

    // Límite de tamaño: 15MB
    const MAX_FILE_SIZE = 15 * 1024 * 1024;
    if (bgFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'El archivo excede el tamaño máximo permitido (15MB)' },
        { status: 413 }
      );
    }

    const bgBuffer = Buffer.from(await bgFile.arrayBuffer());

    // 3. Preparación del prompt de retoque
    const userInstruction = (meta.instruction || '').trim();
    const area = meta.area || 'titles';
    const areaDescriptions = {
      titles: 'local area behind editorial titles (typically upper or lower third)',
      logo: 'local area behind the official brand logo',
      upper: 'upper third of the composition',
      lower: 'lower third of the composition',
      general: 'localized tone adjustment across the composition while preserving architecture',
    };

    const targetArea = areaDescriptions[area] || area;
    const combinedPrompt = `${SYSTEM_EDITORIAL_DIRECTIVE}\nTarget localized area: ${targetArea}.\nSpecific user guidance: ${userInstruction || 'Enhance local contrast and soft depth behind typography while preserving real architecture.'}`;

    // 4. Instancia de OpenAI e invocación del modelo
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const imageUpload = await OpenAI.toFile(bgBuffer, 'background.png', { type: 'image/png' });

    console.log(`[SocialStudio-Retouch] Procesando pieza "${meta.pieceName || meta.pieceIndex}" - Área: ${area}`);

    const aiResponse = await openai.images.edit({
      model: 'gpt-image-2',
      image: imageUpload,
      prompt: combinedPrompt,
      size: 'auto',
      output_format: 'png',
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
    const dataUrl = `data:image/png;base64,${base64Data}`;

    console.log(`[SocialStudio-Retouch] Éxito: Retoque generado correctamente (${base64Data.length} chars)`);

    // 5. Retornar según el contrato del frontend 2.9
    return NextResponse.json({
      imageDataUrl: dataUrl,
      image_base64: base64Data,
    });
  } catch (error) {
    console.error('[SocialStudio-Retouch] Error en procesamiento:', error);

    // Mapeo seguro de códigos de error sin filtrar secretos
    const status = error.status || (error.code === 'rate_limit_exceeded' ? 429 : 500);
    const clientMessage = error.status === 429
      ? 'Cuota o límite de peticiones de IA excedido temporalmente. Intente nuevamente en unos minutos.'
      : error.message && !error.message.includes('sk-')
        ? error.message
        : 'Error interno al procesar el retoque fotográfico.';

    return NextResponse.json({ error: clientMessage }, { status });
  }
}
