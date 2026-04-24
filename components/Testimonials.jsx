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
    <section className="bg-white py-20 px-6 mt-20 md:mt-28">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <ScrollReveal>
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--color-brand)] block mb-3">
              LO QUE DICEN NUESTROS CLIENTES
            </span>
          </ScrollReveal>
          <ScrollReveal delay={50}>
            <h2 className="text-[32px] font-semibold text-[var(--color-ink)] leading-tight tracking-[-0.01em] mb-3">
              Experiencias reales
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-[17px] font-normal text-[var(--color-ink-secondary)] leading-[1.7]">
              Personas que encontraron su hogar con nosotros
            </p>
          </ScrollReveal>
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
          <div className="relative min-h-[300px]">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.id}
                className={`absolute inset-0 flex flex-col transition-all duration-500 ${
                  i === active ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'
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
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
