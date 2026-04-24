'use client';
import ScrollReveal from '@/components/shared/ScrollReveal';

const CLIENTS = [
  { id: 1, name: 'DINO', logo: '/images/clients/DINO-GRIS-169x169.png' },
  { id: 2, name: 'SANTANDER', logo: '/images/clients/SANTANDER-169x169.png' },
  { id: 3, name: 'DRACMA SA', logo: '/images/clients/DRACMA-SA-169x169.png' },
  { id: 4, name: 'DALINGER', logo: '/images/clients/DALINGER-169x169.png' },
  { id: 5, name: 'VILLAGE', logo: '/images/clients/VILLAGE-169x169.png' },
];

const ClientMarquee = () => {
  const items = [...CLIENTS, ...CLIENTS];

  return (
    <section className="bg-white py-10 md:py-14 border-t border-[var(--color-border)] overflow-hidden">
      <ScrollReveal>
        <p className="text-center text-[13px] font-medium text-[var(--color-ink-tertiary)] uppercase tracking-widest mb-10">
          Empresas que confían en nosotros
        </p>
      </ScrollReveal>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

        {/* Scrolling track */}
        <div className="flex animate-marquee items-center gap-20 w-max">
          {items.map((client, i) => (
            <div
              key={`${client.id}-${i}`}
              className="flex-shrink-0 w-32 h-24 relative grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <img
                src={client.logo}
                alt={client.name}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientMarquee;
