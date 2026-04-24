'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Building2, Mountain, Sprout, Store, TrendingUp } from 'lucide-react';
import { isGranInversion } from '@/utils/filterProperties';

const CATEGORIES = [
  { type: 'Casa', icon: Home, label: 'Casas' },
  { type: 'Departamento', icon: Building2, label: 'Departamentos' },
  { type: 'Terreno', icon: Mountain, label: 'Terrenos' },
  { type: 'Campo', icon: Sprout, label: 'Campos' },
  { type: 'Inmueble Comercial', icon: Store, label: 'Locales' },
  { type: 'Gran Inversión', icon: TrendingUp, label: 'Inversión' },
];

const CategoryCards = () => {
  const router = useRouter();
  const [active, setActive] = useState(null);

  const handleClick = (type) => {
    setActive(type);
    if (type === 'Gran Inversión') {
      router.push('/properties?granInversion=true');
    } else {
      router.push(`/properties?type=${encodeURIComponent(type)}`);
    }
  };

  return (
    <section className='bg-[#F7F6F2] py-14 md:py-24 px-4 md:px-6 relative'>
      {/* Brand accent line at top */}
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[var(--color-brand)] rounded-full' />
      <div className='max-w-7xl mx-auto'>

        {/* Header */}
        <div className='text-center mb-10 md:mb-14'>

          {/* Eyebrow */}
          <span
            className='text-[11px] font-bold uppercase tracking-[0.1em] text-primary block mb-2 md:mb-3'
          >
            CATEGORÍAS
          </span>

          {/* Title */}
          <h2
            className='text-2xl md:text-[32px] font-semibold text-heading leading-tight tracking-[-0.01em] mb-2 md:mb-3'
          >
            Explorá por categoría
          </h2>

          {/* Subtitle */}
          <p className='text-[14px] md:text-[17px] font-normal text-[var(--color-ink-secondary)] leading-[1.7]'>
            Encontrá el tipo de propiedad que mejor se adapta a vos
          </p>

        </div>

        {/* Cards Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-5'>
          {CATEGORIES.map(({ type, label, icon: Icon }) => {
            const isActive = active === type;
            return (
              <article
                key={type}
                onClick={() => handleClick(type)}
                className={`
                  group relative bg-white border rounded-2xl p-5 pb-4 md:p-8 md:pb-7
                  flex flex-col items-center gap-3 md:gap-4 cursor-pointer
                  border-[var(--color-border)]
                  shadow-[0_2px_8px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]
                  transition-all duration-200
                  hover:border-[var(--color-brand)]
                  hover:shadow-[0_8px_32px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.06)]
                  hover:-translate-y-1
                  ${isActive ? 'bg-[var(--color-brand-light)] border-[var(--color-brand)]' : ''}
                `}
              >
                {/* Icon */}
                <div
                  className={`
                    w-10 h-10 md:w-[52px] md:h-[52px] rounded-xl flex items-center justify-center
                    bg-[var(--color-surface-soft)]
                    transition-colors duration-150
                    group-hover:bg-[var(--color-brand-light)]
                    ${isActive ? 'bg-[var(--color-brand-light)]' : ''}
                  `}
                >
                  <Icon
                    className='w-5 h-5 md:w-7 md:h-7 text-primary'
                    strokeWidth={1.5}
                  />
                </div>

                {/* Label */}
                <span
                  className={`
                    text-[12px] md:text-sm font-medium text-center
                    ${isActive ? 'text-primary' : 'text-[var(--color-ink-secondary)]'}
                    transition-colors duration-150
                    group-hover:text-primary
                  `}
                >
                  {label}
                </span>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CategoryCards;
