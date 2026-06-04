import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const PROMPTS = {
  es: `Eres un agente inmobiliario de lujo experto en redacción persuasiva.
Escribe UN párrafo de 3-4 oraciones presentando esta propiedad a un cliente potencial.
Tono: profesional, cálido, corporativo. Sin exageraciones. Sin bullet points.
Personaliza mencionando el nombre del cliente.
Datos de la propiedad: {data}`,
};

export async function generateAIDescription(input) {
  if (!OPENAI_API_KEY) {
    console.error('[AI] No OPENAI_API_KEY found.');
    return null;
  }

  const dataString = JSON.stringify({
    propiedad: input.propertyTitle,
    ubicacion: input.address,
    tipo: input.type,
    superficie: input.surface ? `${input.surface}m²` : null,
    dormitorios: input.bedrooms,
    banos: input.bathrooms,
    precio: `USD ${input.priceUSD?.toLocaleString()}`,
    cliente: input.clientName,
    notas_agente: input.agentNotes,
  });

  const prompt = (PROMPTS[input.language] || PROMPTS.es).replace('{data}', dataString);

  try {
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.7,
    });

    return completion.choices?.[0]?.message?.content?.trim() || null;
  } catch (err) {
    console.error('[AI] Error generating with OpenAI:', err.message);
    return null;
  }
}
