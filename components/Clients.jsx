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
    <section ref={sectionRef} className="bg-[#F6F6F6] pt-8 md:pt-12 pb-10 md:pb-16">
      <div className="max-w-[1430px] mx-auto px-[15px]">
        {/* Client logo cards — horizontal scroll on mobile, grid on desktop */}
        <div className="flex md:grid overflow-x-auto md:overflow-visible gap-[15px] md:gap-[20px] scrollbar-hide md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {CLIENTS.map((client, i) => (
            <div
              key={client.id}
              className={`flex-shrink-0 w-[160px] md:w-auto transition-all duration-500 ease-in-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[50px]'}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="bg-white rounded-[20px] py-5 px-5 md:px-6 flex items-center justify-center min-h-[100px] md:min-h-[120px]">
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
