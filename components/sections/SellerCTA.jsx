'use client';
import SectionBox from '@/components/sections/SectionBox';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { generateWhatsAppLink } from '@/utils/whatsapp';

const SellerCTA = () => {
  return (
    <section className="pt-[30px] pb-[30px] px-4">
      <div className="bg-white rounded-3xl overflow-hidden max-w-[92vw] mx-auto">
        <div className="px-6 md:px-12 py-12 md:py-20">
          <div className="max-w-[80vw] mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          {/* Sell CTA */}
          <ScrollReveal delay={100}>
            <div className="relative rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)] h-full group max-w-[25vw]">
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85')" }}
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1C1C1A]/90 via-[#1C1C1A]/80 to-[#2A2A27]/85" />
              {/* Glass layer */}
              <div className="absolute inset-0 backdrop-blur-[2px]" />

              <div className="relative z-10 p-8 md:p-10 flex flex-col h-full">
                {/* Icon */}
                <div className="w-14 h-14 bg-[rgba(242,107,46,0.2)] backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 border border-[rgba(242,107,46,0.15)]">
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
                  style={{ fontFamily: 'var(--font-heading)' }}>
                  ¿Querés vender tu propiedad?
                </h3>

                {/* Body */}
                <p className="text-[15px] font-light text-white/70 leading-[1.6] mb-8 flex-1">
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
            </div>
          </ScrollReveal>

          {/* Invest CTA */}
          <ScrollReveal delay={200}>
            <div className="relative rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)] h-full group max-w-[25vw]">
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1200&q=85')" }}
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1C1C1A]/90 via-[#1C1C1A]/80 to-[#2A2A27]/85" />
              {/* Glass layer */}
              <div className="absolute inset-0 backdrop-blur-[2px]" />

              <div className="relative z-10 p-8 md:p-10 flex flex-col h-full">
                {/* Icon */}
                <div className="w-14 h-14 bg-[rgba(242,107,46,0.15)] backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 border border-[rgba(242,107,46,0.1)]">
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
                  style={{ fontFamily: 'var(--font-heading)' }}>
                  ¿Buscás invertir?
                </h3>

                {/* Body */}
                <p className="text-[15px] font-light text-white/70 leading-[1.6] mb-8 flex-1">
                  Encontrá las mejores oportunidades de inversión en propiedades seleccionadas por nuestro equipo de análisis de mercado.
                </p>

                {/* Ghost Button */}
                <a
                  href="/properties"
                  className="inline-flex items-center justify-center w-full h-[52px] bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-full text-sm font-bold uppercase tracking-[0.06em] transition-all duration-200 hover:-translate-y-px"
                >
                  Buscar inversión
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
        </div>
      </div>
    </section>
  );
};

export default SellerCTA;
