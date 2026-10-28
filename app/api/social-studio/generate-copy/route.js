export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import connectDB from '@/config/database';
import OpenAI from 'openai';

export async function POST(request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Acceso no autorizado: requiere rol superadmin' },
        { status: 401 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Falta OPENAI_API_KEY en el servidor' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const {
      pieceName = '',
      studioType = 'feed',
      category = '',
      title = '',
      accent = '',
      support = '',
      cta = '',
      location = 'Alta Gracia, Córdoba',
      customContext = '',
    } = body || {};

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 450,
      messages: [
        {
          role: 'system',
          content: `Sos el redactor editorial senior de Roggero & Roma Negocios Inmobiliarios (Alta Gracia, Córdoba, Argentina).
Tu tarea es redactar el copy / pie de publicación para Instagram y Facebook que acompaña la pieza gráfica actual.
Reglas de estilo:
- Español rioplatense (voseo argentino: "buscás", "querés", "contanos", "escribinos"), sobrio, cálido, profesional y confiable.
- Sin exageraciones artificiales ni clichés vacíos; enfoque en cercanía, experiencia inmobiliaria real y asesoramiento transparente.
- Estructura limpia con párrafos breves (2 a 3 bloques cortos), llamada a la acción clara al final y 5 a 7 hashtags relevantes de cierre (#RoggeroYRoma #InmobiliariaAltaGracia #AltaGracia #Cordoba #BienesRaices, etc.).
- Devolvé únicamente el texto listo para copiar y pegar, sin comillas ni explicaciones previas.`,
        },
        {
          role: 'user',
          content: `Generá el copy para esta pieza gráfica:
- Formato: ${studioType} (${pieceName})
- Categoría: ${category}
- Titular principal: ${title}
- Titular acento: ${accent}
- Subtítulo / apoyo: ${support}
- Botón CTA: ${cta}
- Ubicación: ${location}
${customContext ? `- Notas adicionales de la propiedad/publicación: ${customContext}` : ''}`,
        },
      ],
    });

    const copy = completion.choices?.[0]?.message?.content?.trim() || '';
    if (!copy) {
      return NextResponse.json(
        { error: 'OpenAI no devolvió texto para el copy' },
        { status: 502 }
      );
    }

    return NextResponse.json({ copy });
  } catch (error) {
    console.error('[SocialStudio-GenerateCopy] Error:', error);
    const status = error.status || 500;
    const message =
      error.message && !error.message.includes('sk-')
        ? error.message
        : 'Error al generar el copy con OpenAI.';
    return NextResponse.json({ error: message }, { status });
  }
}
