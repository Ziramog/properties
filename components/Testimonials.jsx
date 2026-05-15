'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import ScrollReveal from '@/components/shared/ScrollReveal';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Maxi Ciappini',
    role: 'Grido',
    quote: 'Excelente atención y servicios. Muy profesional, la mejor inmobiliaria de la zona. Nos acompañaron en todo el proceso de compra.',
    rating: 5,
    avatar: '/images/testimonials/Maxi-Ciappini-20180725_190637.jpg',
  },
  {
    id: 2,
    name: 'Laura Malpeli de Jordaan',
    role: 'Styletto',
    quote: 'Excelente atención, sumamente recomendable. Encontramos exactamente lo que buscábamos gracias a su asesoramiento personalizado.',
    rating: 5,
    featured: true,
    avatar: '/images/testimonials/Laura-Malpeli-20180725_190653.jpg',
  },
  {
    id: 3,
    name: 'Mario Larizzate',
    role: 'Farmacia Sierras',
    quote: 'Excelencia en inmobiliaria. Los recomiendo sin dudar. Un equipo que realmente entiende las necesidades de cada cliente.',
    rating: 5,
    avatar: '/images/testimonials/Mario-Larizzate-20180725_190720.jpg',
  },
];

const StarIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 text-[var(--color-brand)] fill-[var(--color-brand)]">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const QuoteMark = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7 text-[var(--color-brand-light)] fill-current">
    <path d="M10 0H0v10C0 15.522 4.478 20 10 20v-6C6.866 14 6 11.522 6 10V0zm10 0H20v10c0 5.522-4.478 10-10 10v-6c3.134 0 6-2.522 6-10V0z"/>
  </svg>
);

const Testimonials = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((a) => (a + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="pt-[15px] pb-[15px] px-4 md:px-6 relative z-[2] isolate">
      <div className="bg-white w-full">
      <div className="max-w-7xl mx-auto">
        {/* Section Header — match homepage standard */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-[28px] md:text-[40px] font-normal text-[#0F172A] leading-tight mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Lo que dicen nuestros clientes
          </h2>
          <div className="flex items-center justify-center gap-3">
            <span className="w-7 h-px bg-[var(--color-brand)] flex-shrink-0" />
            <p className="text-[13px] md:text-[15px] font-medium text-[var(--color-brand)] uppercase tracking-[0.15em]">
              Experiencias reales
            </p>
            <span className="w-7 h-px bg-[var(--color-brand)] flex-shrink-0" />
          </div>
        </div>

        {/* Desktop — 3 columns */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <ScrollReveal key={t.id} delay={i * 80}>
              <div className={`
                relative bg-white border rounded-2xl p-8 pb-10
                ${t.featured
                  ? 'bg-[var(--color-brand-muted)] border-[var(--color-brand)] -translate-y-2 shadow-[var(--shadow-card-hover)]'
                  : 'border-[var(--color-border)] shadow-[var(--shadow-card)]'}
              `}>
                {/* Quote mark */}
                <div className="absolute top-6 left-6">
                  <QuoteMark />
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-4 relative z-10">
                  {[...Array(t.rating)].map((_, s) => (
                    <StarIcon key={s} />
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-[15px] font-normal text-[var(--color-ink-secondary)] leading-[1.7] mb-6 relative z-10">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-5 border-t border-[var(--color-border)] relative z-10">
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-[var(--color-brand-light)] flex items-center justify-center text-[var(--color-brand)] font-bold text-sm flex-shrink-0 border-2 border-[var(--color-brand-light)]">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      width={44}
                      height={44}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-ink)]">{t.name}</p>
                    <p className="text-xs text-[var(--color-ink-tertiary)]">{t.role}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <div className="relative">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.id}
                className={`flex flex-col transition-all duration-500 ${
                  i === active ? 'block' : 'hidden'
                }`}>
                <div className={`
                  relative bg-white border rounded-2xl p-7
                  ${t.featured
                    ? 'bg-[var(--color-brand-muted)] border-[var(--color-brand)]'
                    : 'border-[var(--color-border)]'}
                `}>
                  <div className="absolute top-5 left-5">
                    <QuoteMark />
                  </div>
                  <div className="flex gap-0.5 mb-4 relative z-10">
                    {[...Array(t.rating)].map((_, s) => (
                      <StarIcon key={s} />
                    ))}
                  </div>
                  <p className="text-[15px] font-normal text-[var(--color-ink-secondary)] leading-[1.7] mb-6 relative z-10">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-5 border-t border-[var(--color-border)] relative z-10">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-[var(--color-brand-light)] border-2 border-[var(--color-brand-light)] flex items-center justify-center text-[var(--color-brand)] font-bold text-sm flex-shrink-0">
                      <Image
                        src={t.avatar}
                        alt={t.name}
                        width={44}
                        height={44}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-ink)]">{t.name}</p>
                      <p className="text-xs text-[var(--color-ink-tertiary)]">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === active ? 'bg-[var(--color-brand)] w-7' : 'bg-[var(--color-border)] w-2'
                }`}
                aria-label={`Ir al testimonio ${i + 1}`}
              />
            ))}
          </div>

          {/* Google Reviews CTA */}
          <div className="text-center mt-10">
            <a
              href="https://www.google.com/maps/place/?q=place_id:ChIJo00-jbBQLZQRpkMte_gAehk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-[var(--color-brand)] text-[var(--color-brand)] text-[13px] font-bold uppercase tracking-wider rounded-[6px] transition-all duration-200 hover:bg-[var(--color-brand)] hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Ver reseñas en Google
            </a>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default Testimonials;
