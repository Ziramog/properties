'use client';
import SectionBox from '@/components/sections/SectionBox';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { generateWhatsAppLink } from '@/utils/whatsapp';

const SellerCTA = () => {
  return (
    <section className="pt-[15px] pb-[15px]">
      <div className="bg-white w-full">
        <div className="px-6 md:px-12 py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Sell CTA */}
          <ScrollReveal delay={100}>
            <div className="relative rounded-3xl overflow-hidden flex flex-col transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)] h-full group backface-hidden" style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}>
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
                  className="inline-flex items-center justify-center w-full h-[52px] bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white rounded-[6px] text-sm font-bold uppercase tracking-[0.06em] transition-[background-color,box-shadow,transform] duration-200 shadow-lg shadow-[var(--color-brand)]/30 hover:shadow-xl hover:shadow-[var(--color-brand)]/40 hover:-translate-y-px"
                >
                  Solicitar tasación gratuita
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Invest CTA */}
          <ScrollReveal delay={200}>
            <div className="relative rounded-3xl overflow-hidden flex flex-col transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)] h-full group backface-hidden" style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}>
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=85')" }}
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
                  className="inline-flex items-center justify-center w-full h-[52px] bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-[6px] text-sm font-bold uppercase tracking-[0.06em] transition-[background-color,transform] duration-200 hover:-translate-y-px"
                >
                  Buscar inversión
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Rental CTA */}
          <ScrollReveal delay={300}>
            <div className="relative rounded-3xl overflow-hidden flex flex-col transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)] h-full group backface-hidden" style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}>
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=85')" }}
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1C1C1A]/90 via-[#1C1C1A]/80 to-[#2A2A27]/85" />
              {/* Glass layer */}
              <div className="absolute inset-0 backdrop-blur-[2px]" />

              <div className="relative z-10 p-8 md:p-10 flex flex-col h-full">
                {/* Icon */}
                <div className="w-14 h-14 bg-[rgba(242,107,46,0.15)] backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 border border-[rgba(242,107,46,0.1)]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-[var(--color-brand)]">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                    <path d="M10 12h4v3a2 2 0 0 1-4 0v-3z" fill="currentColor" stroke="none"/>
                  </svg>
                </div>

                {/* Eyebrow */}
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--color-brand)] mb-3">
                  ALQUILERES
                </p>

                {/* Heading */}
                <h3 className="text-[26px] font-bold text-white leading-tight mb-3"
                  style={{ fontFamily: 'var(--font-heading)' }}>
                  ¿Querés alquilar?
                </h3>

                {/* Body */}
                <p className="text-[15px] font-light text-white/70 leading-[1.6] mb-8 flex-1">
                  Encontrá la propiedad ideal para alquilar en Alta Gracia y zona. Te guiamos para que encuentres el hogar perfecto.
                </p>

                {/* Ghost Button */}
                <a
                  href={generateWhatsAppLink({ context: 'rental' })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full h-[52px] bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-[6px] text-sm font-bold uppercase tracking-[0.06em] transition-[background-color,box-shadow,transform] duration-200 shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 hover:-translate-y-px"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.489-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Contactar por WhatsApp
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
