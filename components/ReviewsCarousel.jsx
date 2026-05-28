'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import ReviewCard from '@/components/reviews/ReviewCard';
import StarRating from '@/components/reviews/StarRating';

function GoogleIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function ArrowIcon({ direction }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      {direction === 'left'
        ? <path d="M15 18l-6-6 6-6" />
        : <path d="M9 18l6-6-6-6" />
      }
    </svg>
  );
}

export default function ReviewsCarousel({ reviews, googleRating, totalRatings }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragDelta, setDragDelta] = useState(0);
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const autoRotateRef = useRef(null);

  const totalCards = reviews.length;
  const isCarousel = totalCards > 3;

  const scrollTo = useCallback((index) => {
    const clamped = Math.max(0, Math.min(index, totalCards - 1));
    setActiveIndex(clamped);
    if (trackRef.current && trackRef.current.children[0]) {
      const cardWidth = trackRef.current.children[0].offsetWidth;
      const gap = 20;
      trackRef.current.scrollTo({
        left: clamped * (cardWidth + gap),
        behavior: 'smooth'
      });
    }
  }, [totalCards]);

  const next = useCallback(() => {
    scrollTo((activeIndex + 1) % totalCards);
  }, [activeIndex, totalCards, scrollTo]);

  const prev = useCallback(() => {
    scrollTo((activeIndex - 1 + totalCards) % totalCards);
  }, [activeIndex, totalCards, scrollTo]);

  useEffect(() => {
    if (isPaused || !isCarousel) return;
    autoRotateRef.current = setInterval(() => {
      setActiveIndex(prev => {
        const nextIdx = (prev + 1) % totalCards;
        if (trackRef.current && trackRef.current.children[0]) {
          const cardWidth = trackRef.current.children[0].offsetWidth;
          const gap = 20;
          trackRef.current.scrollTo({
            left: nextIdx * (cardWidth + gap),
            behavior: 'smooth'
          });
        }
        return nextIdx;
      });
    }, 5000);
    return () => clearInterval(autoRotateRef.current);
  }, [isPaused, totalCards, isCarousel]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !isCarousel) return;

    const handleScroll = () => {
      const scrollLeft = track.scrollLeft;
      const cardWidth = track.children[0]?.offsetWidth || 1;
      const gap = 20;
      const newIndex = Math.round(scrollLeft / (cardWidth + gap));
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < totalCards) {
        setActiveIndex(newIndex);
      }
    };

    track.addEventListener('scroll', handleScroll, { passive: true });
    return () => track.removeEventListener('scroll', handleScroll);
  }, [activeIndex, totalCards, isCarousel]);

  const handleDragStart = (e) => {
    setIsDragging(true);
    setDragStartX(e.type === 'touchstart' ? e.touches[0].clientX : e.clientX);
    setDragDelta(0);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    setDragDelta(x - dragStartX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (Math.abs(dragDelta) > 50) {
      if (dragDelta < 0) next();
      else prev();
    }
    setDragDelta(0);
  };

  if (totalCards === 0) return null;

  return (
    <section className="pt-[23px] pb-[23px]">
      <div className="bg-white w-full pt-[30px] pb-[30px] md:pt-[40px] md:pb-[40px]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">

          <div className="text-center mb-8 md:mb-10 js-animate">
            <h2 className="text-[28px] md:text-[40px] font-normal text-[#0F172A] leading-tight mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Lo que dicen nuestros clientes
            </h2>
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-7 h-px bg-[var(--color-brand)] flex-shrink-0" />
              <p className="text-[13px] md:text-[15px] font-medium text-[var(--color-brand)] uppercase tracking-[0.15em]">
                Experiencias reales
              </p>
              <span className="w-7 h-px bg-[var(--color-brand)] flex-shrink-0" />
            </div>
            {googleRating && (
              <div className="flex items-center justify-center gap-2 mt-3">
                <GoogleIcon className="w-4 h-4" />
                <span className="text-[14px] text-zinc-600">
                  <span className="font-semibold text-zinc-900">{googleRating.toFixed(1)}</span>
                  {totalRatings && (
                    <span className="text-zinc-400"> — {totalRatings} reseñas en Google</span>
                  )}
                </span>
              </div>
            )}
          </div>

          {totalCards <= 3 ? (
            <div className={`grid grid-cols-1 md:grid-cols-${totalCards} gap-5`}>
              {reviews.map((review, i) => (
                <div key={review.id} className="transition-all duration-500" style={{ transitionDelay: `${i * 80}ms` }}>
                  <ReviewCard review={review} variant={review.featured ? 'featured' : 'default'} />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="relative"
              ref={containerRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div
                ref={trackRef}
                className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pb-2 -mx-1 px-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
              >
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex-shrink-0 w-[85vw] md:w-[calc(33.333%-14px)] snap-start"
                  >
                    <ReviewCard review={review} variant={review.featured ? 'featured' : 'default'} />
                  </div>
                ))}
              </div>

              {totalCards > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-10 h-10 items-center justify-center rounded-full bg-white border border-zinc-200 shadow-lg hover:bg-zinc-50 hover:border-zinc-300 transition-all z-10"
                    aria-label="Anterior"
                  >
                    <ArrowIcon direction="left" />
                  </button>
                  <button
                    onClick={next}
                    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-10 h-10 items-center justify-center rounded-full bg-white border border-zinc-200 shadow-lg hover:bg-zinc-50 hover:border-zinc-300 transition-all z-10"
                    aria-label="Siguiente"
                  >
                    <ArrowIcon direction="right" />
                  </button>
                </>
              )}

              <div className="flex justify-center gap-2 mt-5">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollTo(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === activeIndex
                        ? 'bg-[var(--color-brand)] w-7'
                        : 'bg-zinc-200 w-2 hover:bg-zinc-300'
                    }`}
                    aria-label={`Ir a reseña ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}