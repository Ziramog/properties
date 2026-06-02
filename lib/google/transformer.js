import crypto from 'crypto';

export function deriveReviewId(review) {
  if (review.name) {
    return crypto.createHash('sha256').update(review.name).digest('hex').slice(0, 32);
  }
  const seed = `${review.authorAttribution?.uri || 'no-uri'}::${review.publishTime}`;
  return crypto.createHash('sha256').update(seed).digest('hex').slice(0, 32);
}

export function transformGoogleReview(review, googlePlaceId) {
  const reviewId = deriveReviewId(review);

  return {
    googlePlaceId,
    reviewId,
    authorName: review.authorAttribution.displayName,
    authorPhoto: review.authorAttribution.photoUri || null,
    authorUri: review.authorAttribution.uri || null,
    rating: review.rating,
    text: review.text?.text || null,
    textOriginalLanguage: review.originalText?.languageCode || review.text?.languageCode || null,
    publishTime: new Date(review.publishTime),
    relativeTimeDescription: review.relativePublishTimeDescription,
    googleUpdatedAt: new Date(review.publishTime),
    featured: false,
    hidden: false,
    priority: 0,
  };
}
