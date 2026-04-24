'use client';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { generateWhatsAppLink } from '@/utils/whatsapp';

const SellerCTA = () => {
  return (
    <section className="bg-white py-14 md:py-24 px-4 md:px-6 relative">
      {/* Brand accent line at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[var(--color-brand)] rounded-full" />
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          {/* Sell CTA — Primary */}
          <ScrollReveal delay={100}>
            <div className="rounded-3xl p-8 md:p-10 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_60px_rgba(0,0,0,0.28)] h-full border-l-4 border-[var(--color-brand)]" style={{ background: 'linear-gradient(135deg, #1C1C1A 0%, #2A2A27 100%)' }}>
              {/* Icon */}
              <div className="w-14 h-14 bg-[rgba(242,107,46,0.15)] rounded-xl flex items-center justify-center mb-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-[var(--color-brand)]">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>

              {/* Eyebrow */}
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--color-brand)] mb-3">
                PROPIETARIOS
              </p>

              {/* Heading */}
              <h3 className="text-[30px] font-bold text-white leading-tight mb-3"
                style={{ fontFamily: 'var(--font-display)' }}>
                ¿Querés vender tu propiedad?
              </h3>

              {/* Body */}
              <p className="text-[15px] font-normal text-white/65 leading-[1.6] mb-8 flex-1">
                Te ayudamos a valuar tu propiedad con el mercado actual y te acompañamos en cada paso del proceso de venta.
              </p>

              {/* Button */}
              <a
                href={generateWhatsAppLink({ context: 'seller' })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full h-[52px] bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white rounded-full text-sm font-bold uppercase tracking-[0.06em] transition-all duration-200 shadow-lg shadow-[var(--color-brand)]/30 hover:shadow-xl hover:shadow-[var(--color-brand)]/40 hover:-translate-y-px"
              >
                Solicitar tasación gratuita
              </a>
            </div>
          </ScrollReveal>

          {/* Invest CTA — Secondary */}
          <ScrollReveal delay={200}>
            <div className="border border-[rgba(255,255,255,0.08)] rounded-3xl p-8 md:p-10 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_60px_rgba(0,0,0,0.28)] h-full border-l-4 border-[rgba(255,255,255,0.15)]" style={{ background: 'linear-gradient(135deg, #1C1C1A 0%, #2A2A27 100%)' }}>
              {/* Icon */}
              <div className="w-14 h-14 bg-[rgba(242,107,46,0.10)] rounded-xl flex items-center justify-center mb-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-[var(--color-brand)]">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>

              {/* Eyebrow */}
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--color-brand)] mb-3">
                INVERSORES
              </p>

              {/* Heading */}
              <h3 className="text-[26px] font-bold text-white leading-tight mb-3"
                style={{ fontFamily: 'var(--font-display)' }}>
                ¿Buscás invertir?
              </h3>

              {/* Body */}
              <p className="text-[15px] font-normal text-white/65 leading-[1.6] mb-8 flex-1">
                Encontrá las mejores oportunidades de inversión en propiedades seleccionadas por nuestro equipo de análisis de mercado.
              </p>

              {/* Ghost Button */}
              <a
                href="/properties"
                className="inline-flex items-center justify-center w-full h-[52px] bg-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.22)] border border-[rgba(255,255,255,0.5)] text-white rounded-full text-sm font-bold uppercase tracking-[0.06em] transition-all duration-200 hover:-translate-y-px"
              >
                Buscar inversión
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default SellerCTA;
