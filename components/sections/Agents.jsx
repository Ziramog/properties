'use client';
import SectionBox from '@/components/sections/SectionBox';
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
    <section className="pb-[30px] pt-[30px] px-4" id="equipo">
      <SectionBox className="max-w-[92vw] mx-auto px-4 md:px-8 py-16 md:py-24">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <ScrollReveal>
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#652660] block mb-3">
              EL EQUIPO
            </span>
          </ScrollReveal>
          <ScrollReveal delay={50}>
            <h2 className="text-[28px] md:text-[36px] font-normal text-[#0F172A] leading-tight mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              Nuestros asesores
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-[15px] font-light text-[#475569] leading-[1.7]">
              Profesionales con conocimiento profundo del mercado cordobés
            </p>
          </ScrollReveal>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-2 gap-5 md:gap-8 max-w-2xl mx-auto">
          {AGENTS.map((agent, i) => (
            <ScrollReveal key={agent.id} delay={i * 100}>
              <div className="border border-[#e1e1e1] rounded-2xl p-6 md:p-8 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                {/* Photo */}
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#f0f0f0] mb-5 shadow-md">
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Info */}
                <h3 className="text-[15px] font-medium text-[#0F172A] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                  {agent.name}
                </h3>
                <p className="text-[13px] text-[#652660] font-normal">
                  {agent.specialty}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </SectionBox>
    </section>
  );
};

export default Agents;
