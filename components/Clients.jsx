'use client';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

const CLIENTS = [
  { id: 1, name: 'DINO', logo: '/images/images roggero clients/dino.png' },
  { id: 2, name: 'SANTANDER', logo: '/images/images roggero clients/santander.png' },
  { id: 3, name: 'DRACMA', logo: '/images/images roggero clients/dracma.png' },
  { id: 4, name: 'DALLINGER', logo: '/images/images roggero clients/dallinger.png' },
  { id: 5, name: 'PELLEGRINI', logo: '/images/images roggero clients/pellegrini.png' },
];

const Clients = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#F6F6F6] py-16 md:py-24">
      <div className="max-w-[1430px] mx-auto px-[15px]">
        {/* Title with orange line */}
        <div className="pb-[50px]">
          <h2
            className="text-[28px] font-semibold text-[#0F172A] flex items-center"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Empresas y Proyectos que han operado con nosotros
            <span aria-hidden="true" className="inline-block ml-5" style={{ width: '70px', height: '3px', background: 'var(--color-brand)' }} />
          </h2>
        </div>

        {/* Client logo cards — match Senada stagger animation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[15px] md:gap-[20px]">
          {CLIENTS.map((client, i) => (
            <div
              key={client.id}
              className={`transition-all duration-500 ease-in-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[50px]'}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="bg-white rounded-[20px] p-5 md:p-6 flex items-center justify-center min-h-[100px] md:min-h-[120px]">
                <Image
                  src={client.logo}
                  alt={client.name}
                  width={120}
                  height={120}
                  className="object-contain max-w-full max-h-full"
                  style={{ filter: 'grayscale(1)' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;
