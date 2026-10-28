export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 segundos timeout para generación IA

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import connectDB from '@/config/database';
import OpenAI from 'openai';

const SYSTEM_EDITORIAL_DIRECTIVE = `Retouch only the photographic background of the provided real estate composition (Image 1).
If additional images are provided:
- Image 1 is the clean photographic background with current framing and subtle overlays (NO text or logos). Edit Image 1 as the base.
- Image 2 (if present) is the unedited original photo to preserve exact architectural details.
- Image 3 (if present) is the full layout reference ONLY to understand where the editorial title, logo, and call-to-action will be placed by the editor.
CRITICAL RULES:
1. NEVER render, copy, or draw any letters, words, numbers, logos, watermarks, or graphic buttons in the output image. The output must be 100% clean photographic background only.
2. Make localized lighting, soft depth, and tonal transitions so that the editor's typography will be clearly legible when overlaid.
3. Preserve the exact real building structure, doors, windows, geometry, landscape, materials, angles, and perspective. Do not invent, add, remove, or rearrange any property features.
4. Do not introduce heavy orange/yellow tint or excessive global darkening unless specifically requested.`;

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
    const sourceFile = formData.get('source-photo.png');
    const refFile = formData.get('reference.png');

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

    const toOpenAIFile = async (file, fallbackName) => {
      if (!file || typeof file.arrayBuffer !== 'function') return null;
      const buf = Buffer.from(await file.arrayBuffer());
      const mime = file.type && file.type.startsWith('image/') ? file.type : 'image/jpeg';
      const ext = mime.includes('png') ? 'png' : 'jpg';
      return OpenAI.toFile(buf, `${fallbackName}.${ext}`, { type: mime });
    };

    const [bgUpload, sourceUpload, refUpload] = await Promise.all([
      toOpenAIFile(bgFile, 'background'),
      sourceFile && sourceFile !== bgFile ? toOpenAIFile(sourceFile, 'source-photo') : Promise.resolve(null),
      toOpenAIFile(refFile, 'reference'),
    ]);

    const imageInputs = [bgUpload, sourceUpload, refUpload].filter(Boolean);

    // 3. Preparación del prompt de retoque
    const userInstruction = (meta.instruction || '').trim();
    const area = meta.area || 'titles';
    const areaDescriptions = {
      titles: 'local area behind editorial titles (typically upper-middle or center-left/center)',
      logo: 'local area behind the official brand logo at the top',
      upper: 'upper third of the composition',
      lower: 'lower third of the composition',
      general: 'localized tone and lighting balance across the composition while preserving architecture',
    };

    const targetArea = areaDescriptions[area] || area;
    const combinedPrompt = `${SYSTEM_EDITORIAL_DIRECTIVE}\nTarget localized area: ${targetArea}.\nCanvas dimensions: ${meta.width || 1080}x${meta.height || 1350} (${meta.constraints?.outputAspectRatio || 'preserve input aspect ratio'}).\nSpecific user guidance: ${userInstruction || 'Enhance local contrast and soft depth behind typography while preserving real architecture.'}`;

    // 4. Instancia de OpenAI e invocación del modelo gpt-image-2
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    console.log(
      `[SocialStudio-Retouch] Procesando pieza "${meta.pieceName || meta.pieceIndex}" (${meta.width}x${meta.height}) - Área: ${area} - Refs: ${imageInputs.length}`
    );

    const aiResponse = await openai.images.edit({
      model: 'gpt-image-2',
      image: imageInputs.length > 1 ? imageInputs : bgUpload,
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

    // Mapeo seguro de códigos de error sin filtrar secretos
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
