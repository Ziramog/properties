const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;

const PROMPTS = {
  es: `Eres un agente inmobiliario de lujo experto en redacción persuasiva.
Escribe UN párrafo de 3-4 oraciones presentando esta propiedad a un cliente potencial.
Tono: profesional, cálido, aspiracional. Sin exageraciones. Sin bullet points.
Personaliza mencionando el nombre del cliente.
Datos de la propiedad: {data}`,
};

export async function generateAIDescription(input) {
  if (!MINIMAX_API_KEY) return null;

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
    const response = await fetch('https://api.minimax.chat/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MINIMAX_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'MiniMax-M2',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error('[AI] MiniMax API error:', response.status);
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (err) {
    console.error('[AI] Error:', err.message);
    return null;
  }
}
