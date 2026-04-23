'use client';

import Image from 'next/image';

const CLIENTS = [
  { id: 1, name: 'DINO', logo: '/images/clients/DINO-GRIS-169x169.png' },
  { id: 2, name: 'SANTANDER', logo: '/images/clients/SANTANDER-169x169.png' },
  { id: 3, name: 'DRACMA SA', logo: '/images/clients/DRACMA-SA-169x169.png' },
  { id: 4, name: 'DALINGER', logo: '/images/clients/DALINGER-169x169.png' },
  { id: 5, name: 'VILLAGE', logo: '/images/clients/VILLAGE-169x169.png' },
];

const ClientMarquee = () => {
  // Double the items for seamless loop
  const items = [...CLIENTS, ...CLIENTS];

  return (
    <section className="bg-white py-10 border-t border-gray-100 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 mb-6">
        <p className="text-center text-sm font-medium text-gray-400 uppercase tracking-widest">
          Empresas que confían en nosotros
        </p>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

        {/* Scrolling track */}
        <div className="flex animate-marquee items-center gap-16 w-max">
          {items.map((client, i) => (
            <div
              key={`${client.id}-${i}`}
              className="flex-shrink-0 w-28 h-16 relative grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <Image
                src={client.logo}
                alt={client.name}
                fill
                className="object-contain"
                sizes="112px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientMarquee;
