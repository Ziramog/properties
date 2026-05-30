'use client';
import ReviewCard from '@/components/reviews/ReviewCard';

export default function ReviewsCarousel({ reviews, googleRating, totalRatings }) {
  const totalCards = reviews.length;
  if (totalCards === 0) return null;

  return (
    <section className="pt-[12px] pb-[12px]">
      <div className="bg-white w-full pt-[30px] pb-[30px] md:pt-[50px] md:pb-[50px]">
        <div className="max-w-[1820px] mx-auto px-4 md:px-[50px]">

          <div className="text-center mb-10 md:mb-14 js-animate">
            <h2 className="text-[28px] md:text-[40px] font-normal text-[#0F172A] leading-tight mb-3 md:mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-[12px] md:text-[13px] font-medium text-[var(--color-brand)] uppercase tracking-[0.2em]">
              Experiencias reales
            </p>
            {googleRating && (
              <div className="mt-4">
                <span className="text-[14px] text-zinc-500">
                  <span className="font-semibold text-zinc-900">{googleRating.toFixed(1)}</span>
                  {totalRatings && (
                    <span className="text-zinc-400"> — {totalRatings} reseñas en Google</span>
                  )}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {reviews.map((review, i) => (
              <div
                key={review.id}
                className="js-animate"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <ReviewCard review={review} variant="minimal" />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
