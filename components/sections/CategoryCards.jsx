'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Building2, Mountain, Sprout, Store, TrendingUp } from 'lucide-react';

const CATEGORIES = [
  { type: 'Casa', icon: Home, label: 'Casas' },
  { type: 'Departamento', icon: Building2, label: 'Departamentos' },
  { type: 'Terreno', icon: Mountain, label: 'Terrenos' },
  { type: 'Campo', icon: Sprout, label: 'Campos' },
  { type: 'Local', icon: Store, label: 'Locales' },
  { type: 'Inversión', icon: TrendingUp, label: 'Inversión' },
];

const CategoryCards = () => {
  const router = useRouter();
  const [active, setActive] = useState(null);

  const handleClick = (type) => {
    setActive(type);
    router.push(`/properties?type=${encodeURIComponent(type)}`);
  };

  return (
    <section className='bg-[var(--color-surface-soft)] py-20 px-6'>
      <div className='max-w-7xl mx-auto'>

        {/* Header — centered per demo */}
        <div className='text-center mb-12'>

          {/* Eyebrow */}
          <span
            className='text-[11px] font-bold uppercase tracking-[0.1em] text-primary block mb-3'
          >
            CATEGORÍAS
          </span>

          {/* Title */}
          <h2
            className='text-[32px] font-semibold text-heading leading-tight tracking-[-0.01em] mb-3'
          >
            Explorá por categoría
          </h2>

          {/* Subtitle */}
          <p className='text-[17px] font-normal text-[var(--color-ink-secondary)] leading-[1.7]'>
            Encontrá el tipo de propiedad que mejor se adapta a vos
          </p>

        </div>

        {/* Cards Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
          {CATEGORIES.map(({ type, label, icon: Icon }) => {
            const isActive = active === type;
            return (
              <article
                key={type}
                onClick={() => handleClick(type)}
                className={`
                  group relative bg-white border rounded-2xl p-7 pb-6
                  flex flex-col items-center gap-3.5 cursor-pointer
                  border-[var(--color-border)]
                  shadow-[var(--shadow-card)]
                  transition-all duration-200
                  hover:border-primary
                  hover:shadow-[var(--shadow-card-hover)]
                  hover:-translate-y-0.5
                  ${isActive ? 'bg-[var(--color-brand-light)] border-primary' : ''}
                `}
              >
                {/* Icon */}
                <div
                  className={`
                    w-[52px] h-[52px] rounded-xl flex items-center justify-center
                    bg-[var(--color-surface-soft)]
                    transition-colors duration-150
                    group-hover:bg-[var(--color-brand-light)]
                    ${isActive ? 'bg-[var(--color-brand-light)]' : ''}
                  `}
                >
                  <Icon
                    className='w-7 h-7 text-primary'
                    strokeWidth={1.5}
                  />
                </div>

                {/* Label */}
                <span
                  className={`
                    text-sm font-medium text-center
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
