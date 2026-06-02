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
    
    let propertyInfo = `Tipo: ${type}`;
    if (city) propertyInfo += `\nUbicación: ${city}`;
    if (beds) propertyInfo += `\nDormitorios: ${beds}`;
    if (baths) propertyInfo += `\nBaños: ${baths}`;
    if (amenities) propertyInfo += `\nComodidades: ${amenities}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Eres un redactor y agente inmobiliario experto de la agencia Roggero & Roma. Tu objetivo es escribir descripciones atractivas, elegantes y persuasivas para anuncios de propiedades. Usa un tono profesional, claro y persuasivo. Evita usar viñetas o listas. Escribe un texto fluido, preferiblemente en dos párrafos.'
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
