'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import FeaturedPropertyCard from '@/components/FeaturedPropertyCard';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CARD_WIDTH = 380;
const CARD_GAP = 24;

const FeaturedProperties = ({ properties = [] }) => {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef(null);

  const total = properties.length;

  // Detect mobile on mount and resize
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = () => {
    setCurrent((prev) => (prev - 1 + total) % total);
  };

  const goTo = (index) => {
    setCurrent(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  useEffect(() => {
    if (isMobile || total <= 1) return;
    const interval = setInterval(next, 2000);
    return () => clearInterval(interval);
  }, [next, isAutoPlaying, isMobile, total]);

  const getTransform = (index) => {
    const diff = (index - current + total) % total;
    if (diff === 0) return 'translateX(0) scale(1)';
    if (diff === 1) return `translateX(${CARD_WIDTH + CARD_GAP}px) scale(0.92)`;
    if (diff === total - 1) return `translateX(-${CARD_WIDTH + CARD_GAP}px) scale(0.92)`;
    return 'translateX(100vw)';
  };

  if (properties.length === 0) {
    return null;
  }

  return (
    <section className='bg-white py-14 md:py-24 px-4 md:px-6 overflow-hidden'>
      <div className='max-w-7xl mx-auto'>

        {/* Section Header */}
        <div className='flex justify-between items-end mb-8 md:mb-12'>
          <div className='flex flex-col gap-2.5'>
            <ScrollReveal>
              <span className='text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--color-brand)]'>
                PROPIEDADES DESTACADAS
              </span>
            </ScrollReveal>
            <ScrollReveal delay={50}>
              <h2 className='text-2xl md:text-[32px] font-semibold text-heading leading-tight tracking-[-0.01em]'>
                Seleccionadas para vos
              </h2>
            </ScrollReveal>
          </div>
          <ScrollReveal>
            <a
              href='/properties'
              className='text-[var(--color-brand)] text-sm font-medium hover:underline hidden md:block'
            >
              Ver todas →
            </a>
          </ScrollReveal>
        </div>

        {/* Desktop: 3D Carousel */}
        <div className='hidden md:block'>
          <div className='relative'>
            <div className='relative overflow-hidden' style={{ height: '460px' }}>
              <div className='absolute inset-0 flex items-center justify-center'>
                {properties.map((property, i) => {
                  const diff = (i - current + total) % total;
                  const isCenter = diff === 0;
                  const isAdjacent = diff === 1 || diff === total - 1;

                  return (
                    <div
                      key={property._id?.toString() || i}
                      className='absolute transition-all duration-500 ease-out'
                      style={{
                        width: `${CARD_WIDTH}px`,
                        transform: getTransform(i),
                        zIndex: isCenter ? 10 : 1,
                        opacity: isCenter || isAdjacent ? 1 : 0,
                      }}
                    >
                      <FeaturedPropertyCard
                        property={{
                          ...property,
                          _id: property._id?.toString(),
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={prev}
              className='absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-heading hover:bg-white hover:scale-105 transition-all'
              aria-label='Anterior'
            >
              <ChevronLeft className='w-6 h-6' />
            </button>
            <button
              onClick={next}
              className='absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-heading hover:bg-white hover:scale-105 transition-all'
              aria-label='Siguiente'
            >
              <ChevronRight className='w-6 h-6' />
            </button>

            {/* Dot indicators */}
            <div className='flex justify-center gap-2 mt-8'>
              {properties.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all ${
                    i === current
                      ? 'w-6 h-2 bg-[var(--color-brand)]'
                      : 'w-2 h-2 bg-[var(--color-border)] hover:bg-[var(--color-ink-tertiary)]'
                  }`}
                  aria-label={`Ir a propiedad ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: Horizontal scroll cards */}
        <div className='md:hidden'>
          <div
            ref={scrollRef}
            className='flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4 pb-4'
          >
            {properties.map((property, i) => (
              <div
                key={property._id?.toString() || i}
                className='flex-shrink-0 w-[85vw] max-w-[340px] snap-start'
              >
                <FeaturedPropertyCard
                  property={{
                    ...property,
                    _id: property._id?.toString(),
                  }}
                />
              </div>
            ))}
          </div>
          {/* Dot indicators */}
          <div className='flex justify-center gap-2 mt-4'>
            {properties.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all ${
                  i === current
                    ? 'w-6 h-2 bg-[var(--color-brand)]'
                    : 'w-2 h-2 bg-[var(--color-border)] hover:bg-[var(--color-ink-tertiary)]'
                }`}
                aria-label={`Ir a propiedad ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <ScrollReveal delay={200}>
          <div className='text-center mt-8 md:mt-12'>
            <a
              href='/properties'
              className='inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-[var(--color-brand)]/25 hover:shadow-xl hover:shadow-[var(--color-brand)]/30 hover:-translate-y-px'
            >
              Explorar todas las propiedades
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
              </svg>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FeaturedProperties;
