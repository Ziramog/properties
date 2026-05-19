const BASE_URL = 'https://places.googleapis.com/v1';

const FIELD_MASK = [
  'id', 'displayName', 'rating', 'userRatingCount',
  'reviews(authorAttribution,rating,publishTime,relativePublishTimeDescription,text,originalText)',
].join(',');

export async function fetchPlaceReviews(placeId, languageCode = 'es') {
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

  if (!GOOGLE_API_KEY) {
    throw new Error('GOOGLE_API_KEY no configurada.');
  }

  const url = `${BASE_URL}/places/${placeId}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_API_KEY,
      'X-Goog-FieldMask': FIELD_MASK,
      'Accept-Language': languageCode,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const status = response.status;
    if (status === 429) throw new Error('Rate limit alcanzado');
    if (status === 403 || status === 401) throw new Error('Error de autenticación Google API');
    if (status === 404) throw new Error('Place no encontrado');
    throw new Error(`Google Places API error ${status}: ${JSON.stringify(errorBody)}`);
  }

  const data = await response.json();
  return {
    placeId: data.id,
    name: data.displayName?.text || '',
    reviews: data.reviews || [],
    overallRating: data.rating || null,
    totalRatings: data.userRatingCount || null,
  };
}
