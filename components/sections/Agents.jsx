'use client';
import { useState, useEffect, useRef } from 'react';
import SectionBox from '@/components/sections/SectionBox';

const Agents = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="pt-[12px] pb-[12px]" id="equipo" ref={ref}>
      <SectionBox className="px-4 md:px-8 py-16 md:py-24">
        {/* Section Header — same pattern as Featured Properties */}
        <div className="text-center mb-10 md:mb-14 js-animate">
          <h2 className="text-[28px] md:text-[40px] font-normal text-[#0F172A] leading-tight mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Roggero & Roma
          </h2>
          <div className="flex items-center justify-center gap-3">
            <span className="w-7 h-px bg-[var(--color-brand)] flex-shrink-0" />
            <p className="text-[13px] md:text-[15px] font-medium text-[var(--color-brand)] uppercase tracking-[0.15em]">
              Nuestra Historia
            </p>
            <span className="w-7 h-px bg-[var(--color-brand)] flex-shrink-0" />
          </div>
        </div>

        {/* Body text — animated fade-up like Featured Properties cards */}
        <div className={`max-w-2xl mx-auto text-center transition-all duration-500 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{ transitionDelay: '100ms' }}>
          <p className="text-[16px] md:text-[18px] font-light text-[#475569] leading-[1.8]" style={{ fontFamily: 'var(--font-body)' }}>
            Contamos con 20 años de experiencia propia en el rubro inmobiliario y diversos casos de éxito en importantes negocios inmobiliarios. Trabajamos constantemente con el objetivo de brindar confianza y seriedad en el rubro, dar información real y adecuada sobre el mercado y ofrecer la mayor variedad de alternativas de inversión a nuestros clientes.
          </p>
        </div>
      </SectionBox>
    </section>
  );
};

export default Agents;
