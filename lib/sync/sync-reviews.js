import connectDB from '@/config/database';
import Review from '@/models/Review';
import BusinessInfo from '@/models/BusinessInfo';
import { fetchPlaceReviews } from '@/lib/google/places-client';
import { transformGoogleReview } from '@/lib/google/transformer';

export async function syncReviews() {
  const GOOGLE_PLACE_ID = process.env.GOOGLE_PLACE_ID || 'ChIJo00-jbBQLZQRpkMte_gAehk';

  if (!GOOGLE_PLACE_ID) {
    return { success: false, error: 'GOOGLE_PLACE_ID no configurado. Verificá las variables de entorno en Vercel.' };
  }

  await connectDB();

  const start = Date.now();
  let result = { inserted: 0, updated: 0, unchanged: 0, errors: [], durationMs: 0 };

  try {
    const { reviews, name, overallRating, totalRatings } = await fetchPlaceReviews(GOOGLE_PLACE_ID);

    // Save overall business info from Google
    await BusinessInfo.findOneAndUpdate(
      { googlePlaceId: GOOGLE_PLACE_ID },
      { googleName: name, overallRating, totalUserRatings: totalRatings, lastSyncAt: new Date() },
      { upsert: true }
    );

    for (const googleReview of reviews) {
      try {
        const reviewData = transformGoogleReview(googleReview, GOOGLE_PLACE_ID);
        const existing = await Review.findOne({ googlePlaceId: GOOGLE_PLACE_ID, reviewId: reviewData.reviewId }).lean();

        if (!existing) {
          await Review.create({
            ...reviewData,
            firstSeenAt: new Date(),
            lastSeenAt: new Date(),
          });
          result.inserted++;
        } else {
          const hasChanged =
            existing.rating !== reviewData.rating ||
            existing.text !== reviewData.text;
          if (hasChanged) {
            await Review.findOneAndUpdate(
              { googlePlaceId: GOOGLE_PLACE_ID, reviewId: reviewData.reviewId },
              { $set: { rating: reviewData.rating, text: reviewData.text, relativeTimeDescription: reviewData.relativeTimeDescription, googleUpdatedAt: reviewData.googleUpdatedAt, lastSeenAt: new Date() } }
            );
            result.updated++;
          } else {
            await Review.findOneAndUpdate(
              { googlePlaceId: GOOGLE_PLACE_ID, reviewId: reviewData.reviewId },
              { $set: { lastSeenAt: new Date() } }
            );
            result.unchanged++;
          }
        }
      } catch (reviewError) {
        result.errors.push(reviewError.message);
      }
    }

    result.durationMs = Date.now() - start;
    return { ...result, name, overallRating, totalRatings, success: true };
  } catch (error) {
    result.durationMs = Date.now() - start;
    result.errors.push(error.message);
    return { ...result, success: false, error: error.message };
  }
}
