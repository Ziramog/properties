'use client';
import ScrollReveal from '@/components/shared/ScrollReveal';

const AGENTS = [
  {
    id: 1,
    name: 'Franco Roma',
    specialty: 'Director Comercial',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
  },
  {
    id: 2,
    name: 'Martín González',
    specialty: 'Especialista en Ventas',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
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
              <div className="group bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
                {/* Photo */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Info */}
                <div className="p-4 md:p-5 text-center">
                  <h3 className="text-[15px] font-semibold text-[var(--color-ink)] mb-0.5">
                    {agent.name}
                  </h3>
                  <p className="text-[13px] text-[var(--color-brand)] font-medium">
                    {agent.specialty}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Agents;
