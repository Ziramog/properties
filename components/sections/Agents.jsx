'use client';
import SectionBox from '@/components/sections/SectionBox';
import ScrollReveal from '@/components/shared/ScrollReveal';

const Agents = () => {
  return (
    <section className="pb-[30px] pt-[30px]" id="equipo">
      <SectionBox className="px-4 md:px-8 py-16 md:py-24">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <ScrollReveal>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-brand)] flex items-center justify-center gap-4">
              <span className="block w-[53px] h-px bg-[var(--color-brand)]" />
              Nuestra Historia
              <span className="block w-[53px] h-px bg-[var(--color-brand)]" />
            </h3>
          </ScrollReveal>
          <ScrollReveal delay={50}>
            <h2 className="text-[28px] md:text-[40px] font-normal text-[#0F172A] leading-tight mt-4 mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              Roggero & Roma
            </h2>
          </ScrollReveal>
        </div>

        {/* Body text */}
        <ScrollReveal delay={100}>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-[16px] md:text-[18px] font-light text-[#475569] leading-[1.8]" style={{ fontFamily: 'var(--font-body)' }}>
              Contamos con 20 años de experiencia propia en el rubro inmobiliario y diversos casos de éxito en importantes negocios inmobiliarios. Trabajamos constantemente con el objetivo de brindar confianza y seriedad en el rubro, dar información real y adecuada sobre el mercado y ofrecer la mayor variedad de alternativas de inversión a nuestros clientes.
            </p>
          </div>
        </ScrollReveal>
      </SectionBox>
    </section>
  );
};

export default Agents;
