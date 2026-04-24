'use client';
import ScrollReveal from '@/components/shared/ScrollReveal';

const AGENTS = [
  {
    id: 1,
    name: 'Franco Roma',
    specialty: 'Director Comercial',
    initials: 'FR',
    properties: 45,
    years: 8,
  },
  {
    id: 2,
    name: 'Martín González',
    specialty: 'Especialista en Ventas',
    initials: 'MG',
    properties: 38,
    years: 6,
  },
  {
    id: 3,
    name: 'Laura Rodríguez',
    specialty: 'Asesora Legal',
    initials: 'LR',
    properties: 22,
    years: 5,
  },
  {
    id: 4,
    name: 'Pedro Sánchez',
    specialty: 'Gestión de Propiedades',
    initials: 'PS',
    properties: 55,
    years: 10,
  },
];

const Agents = () => {
  return (
    <section className="bg-white py-14 md:py-24 px-4 md:px-6" id="equipo">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {AGENTS.map((agent, i) => (
            <ScrollReveal key={agent.id} delay={i * 80}>
              <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5 md:p-6 flex flex-col items-center text-center shadow-[0_2px_8px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-[var(--color-brand-light)] flex items-center justify-center mb-4">
                  <span className="text-[var(--color-brand)] font-bold text-xl">
                    {agent.initials}
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-[15px] font-semibold text-[var(--color-ink)] mb-1">
                  {agent.name}
                </h3>

                {/* Specialty — brand colored */}
                <p className="text-[13px] text-[var(--color-brand)] font-medium mb-3">
                  {agent.specialty}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-2 text-[12px] text-[var(--color-ink-secondary)] mb-4">
                  <span>{agent.properties} propiedades</span>
                  <span className="text-[var(--color-border)]">·</span>
                  <span>{agent.years} años</span>
                </div>

                {/* Contact Button — brand colored */}
                <button className="w-full h-10 border border-[var(--color-brand)] text-[var(--color-brand)] hover:bg-[var(--color-brand)] hover:text-white rounded-lg text-[13px] font-medium transition-all duration-200 flex items-center justify-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  Contactar
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Agents;
