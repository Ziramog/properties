'use server';
import OpenAI from 'openai';
import { getSessionUser } from '@/utils/getSessionUser';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateDescription(formData) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return { error: 'Debes iniciar sesión para usar la inteligencia artificial.' };
    }

    const type = formData.get('type') || 'Propiedad';
    const beds = formData.get('beds');
    const baths = formData.get('baths');
    const city = formData.get('location.city');
    const amenities = formData.getAll('amenities').join(', ');
    const tone = formData.get('ai_tone') || 'estándar';
    
    let propertyInfo = `Tipo: ${type}`;
    if (city) propertyInfo += `\nUbicación: ${city}`;
    if (beds) propertyInfo += `\nDormitorios: ${beds}`;
    if (baths) propertyInfo += `\nBaños: ${baths}`;
    if (amenities) propertyInfo += `\nComodidades: ${amenities}`;

    let toneInstruction = 'Escribe un texto fluido, preferiblemente en dos párrafos.';
    if (tone === 'corta') toneInstruction = 'Escribe un solo párrafo corto, muy directo al punto y atractivo.';
    if (tone === 'larga') toneInstruction = 'Escribe una descripción extensa y muy detallada de al menos tres o cuatro párrafos, resaltando todos los lujos y beneficios.';
    if (tone === 'formal') toneInstruction = 'Escribe un texto fluido y estructurado con vocabulario altamente formal, sobrio, elegante e institucional.';
    if (tone === 'informal') toneInstruction = 'Escribe un texto fluido, muy amigable, usando el "vos" argentino de manera sutil, cercana y relajada.';

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Eres un redactor y agente inmobiliario experto de la agencia Roggero & Roma. Tu objetivo es escribir descripciones para anuncios de propiedades. Evita usar viñetas o listas. ${toneInstruction}`
        },
        {
          role: 'user',
          content: `Por favor, genera una descripción atractiva para la siguiente propiedad basándote en estos datos:\n\n${propertyInfo}`
        }
      ],
      temperature: 0.7,
      max_tokens: 350,
    });

    const description = response.choices[0].message.content.trim();
    return { success: true, description };

  } catch (error) {
    console.error('OpenAI Error:', error);
    return { error: 'Ocurrió un error al generar la descripción. Revisa tu cuota o clave de la API.' };
  }
}
