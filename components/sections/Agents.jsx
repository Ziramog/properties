'use client';
import ScrollReveal from '@/components/shared/ScrollReveal';

const AGENTS = [
  {
    id: 1,
    name: 'Franco Roma',
    specialty: 'Director Comercial',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
  },
  {
    id: 2,
    name: 'Martín González',
    specialty: 'Especialista en Ventas',
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&q=80',
  },
];

const Agents = () => {
  return (
    <section className="bg-[#E8E6E0] py-14 md:py-24 px-4 md:px-6 relative" id="equipo">
      {/* Brand accent line at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[var(--color-brand)] rounded-full" />
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <ScrollReveal>
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--color-brand)] block mb-3">
              EL EQUIPO
            </span>
          </ScrollReveal>
          <ScrollReveal delay={50}>
            <h2 className="text-[32px] font-semibold text-[var(--color-ink)] leading-tight tracking-[-0.01em] mb-3">
              Nuestros asesores
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-[17px] font-normal text-[var(--color-ink-secondary)] leading-[1.7]">
              Profesionales con conocimiento profundo del mercado cordobés
            </p>
          </ScrollReveal>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-2 gap-5 md:gap-8 max-w-2xl mx-auto">
          {AGENTS.map((agent, i) => (
            <ScrollReveal key={agent.id} delay={i * 100}>
              <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 md:p-8 flex flex-col items-center text-center shadow-[0_2px_8px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
                {/* Photo — circle frame */}
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[var(--color-brand)]/10 mb-5 shadow-md">
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Info */}
                <h3 className="text-[15px] font-semibold text-[var(--color-ink)] mb-1">
                  {agent.name}
                </h3>
                <p className="text-[13px] text-[var(--color-brand)] font-medium">
                  {agent.specialty}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Agents;
