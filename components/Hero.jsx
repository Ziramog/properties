'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const HERO_LINE1 = 'Tu próximo hogar';
const HERO_LINE2 = 'te está esperando';

const charVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.02,
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const HeadlineChar = ({ text, className }) => (
  <span className={className} aria-hidden="true" style={{ display: 'inline-block', overflow: 'hidden' }}>
    {text.split('').map((char, i) => (
      <motion.span
        key={i}
        custom={i}
        variants={charVariant}
        initial="hidden"
        animate="visible"
        style={{ display: 'inline-block', marginRight: char === ' ' ? '0.3em' : 0 }}
      >
        {char}
      </motion.span>
    ))}
  </span>
);

const Hero = () => {
  const router = useRouter();
  const [filters, setFilters] = useState({
    operation: 'Venta',
    type: 'Todos',
    zone: 'Córdoba',
    price: 'Cualquiera',
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.type && filters.type !== 'Todos') params.set('type', filters.type);
    if (filters.zone && filters.zone !== 'Córdoba') params.set('city', filters.zone);
    if (filters.operation && filters.operation !== 'Todos') params.set('operation', filters.operation);
    const query = params.toString();
    router.push(`/properties${query ? `?${query}` : ''}`);
  };

  const heroFilterCls = 'flex flex-col justify-center h-[52px] px-5 border-r border-white/15 last:border-r-0 hover:bg-white/8 transition-all cursor-pointer';
  const heroLabelCls = 'text-white/55 text-[10px] font-medium uppercase tracking-widest leading-none mb-1';
  const heroValueCls = 'text-white text-sm font-medium flex items-center justify-between gap-2';
  const heroIconCls = 'w-4 h-4 text-white/50 flex-shrink-0';

  return (
    <section className='relative h-screen min-h-[700px] overflow-hidden'>
      {/* Background Image */}
      <div className='absolute inset-0 z-0'>
        {/* Mobile */}
        <div
          className='w-full h-full md:hidden'
          style={{
            backgroundImage: "url('/images/mobilehero_1.jpeg')",
            backgroundPosition: 'center 40%',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Desktop */}
        <div
          className='w-full h-full hidden md:block'
          style={{
            backgroundImage: "url('/images/necesito_otro_angulo_202604221402.jpeg')",
            backgroundPosition: 'center 40%',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div
          className='absolute inset-0'
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.10) 40%, rgba(0,0,0,0.55) 100%)',
          }}
        />
      </div>

      {/* Content Block */}
      <div className='absolute inset-0 flex flex-col items-center justify-center w-full text-center px-6 z-10'>

        {/* Eyebrow */}
        <motion.div
          className='flex items-center justify-center gap-3 mb-4'
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <span className='w-7 h-px bg-white/40 flex-shrink-0' />
          <span className='text-white/70 text-[11px] font-semibold uppercase tracking-[0.18em]'>
            Córdoba, Argentina
          </span>
          <span className='w-7 h-px bg-white/40 flex-shrink-0' />
        </motion.div>

        {/* Headline Line 1 */}
        <h1
          className='font-display italic font-normal text-white mb-1 leading-tight'
          style={{
            fontSize: 'clamp(40px, 5vw, 76px)',
            lineHeight: 1.0,
          }}
        >
          <HeadlineChar
            text={HERO_LINE1}
            className='block'
          />
        </h1>

        {/* Headline Line 2 */}
        <h2
          className='font-display font-bold text-white leading-tight'
          style={{
            fontSize: 'clamp(40px, 5vw, 76px)',
            lineHeight: 1.0,
          }}
        >
          <HeadlineChar
            text={HERO_LINE2}
            className='block'
          />
        </h2>
      </div>

      {/* Search Bar */}
      <div className='absolute bottom-8 w-full z-20 px-6'>
        <div
          className='mx-auto max-w-[880px] bg-black/20 backdrop-blur-xl border border-white/10 px-2 py-2 flex items-center'
          style={{ animation: 'fadeUp 0.7s var(--ease-out) 0.45s both' }}
        >
          <form onSubmit={handleSubmit} className='flex items-center w-full'>
            <div className='flex-1 grid grid-cols-4 divide-x divide-white/15'>
              {/* Operación */}
              <div className={heroFilterCls}>
                <span className={heroLabelCls}>Operación</span>
                <span className={heroValueCls}>
                  <select
                    name='operation'
                    value={filters.operation}
                    onChange={handleChange}
                    className='bg-transparent text-white text-sm font-medium w-full cursor-pointer outline-none appearance-none'
                  >
                    <option value='Venta' className='text-ink'>Venta</option>
                    <option value='Alquiler' className='text-ink'>Alquiler</option>
                    <option value='Todos' className='text-ink'>Todos</option>
                  </select>
                  <svg className={heroIconCls} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                    <path d='M6 9l6 6 6-6' />
                  </svg>
                </span>
              </div>

              {/* Tipo */}
              <div className={heroFilterCls}>
                <span className={heroLabelCls}>Tipo</span>
                <span className={heroValueCls}>
                  <select
                    name='type'
                    value={filters.type}
                    onChange={handleChange}
                    className='bg-transparent text-white text-sm font-medium w-full cursor-pointer outline-none appearance-none'
                  >
                    <option value='Todos' className='text-ink'>Todos</option>
                    <option value='Casa' className='text-ink'>Casas</option>
                    <option value='Departamento' className='text-ink'>Departamentos</option>
                    <option value='Terreno' className='text-ink'>Terrenos</option>
                    <option value='Campo' className='text-ink'>Campos</option>
                    <option value='Inmueble Comercial' className='text-ink'>Inmuebles Comerciales</option>
                    <option value='Gran Inversión' className='text-ink'>Grandes Inversiones</option>
                  </select>
                  <svg className={heroIconCls} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                    <path d='M6 9l6 6 6-6' />
                  </svg>
                </span>
              </div>

              {/* Zona */}
              <div className={heroFilterCls}>
                <span className={heroLabelCls}>Zona</span>
                <span className={heroValueCls}>
                  <select
                    name='zone'
                    value={filters.zone}
                    onChange={handleChange}
                    className='bg-transparent text-white text-sm font-medium w-full cursor-pointer outline-none appearance-none'
                  >
                    <option value='Córdoba' className='text-ink'>Córdoba</option>
                    <option value='Alta Gracia' className='text-ink'>Alta Gracia</option>
                    <option value='Villa Allende' className='text-ink'>Villa Allende</option>
                    <option value='Mina Clavero' className='text-ink'>Mina Clavero</option>
                    <option value='Centro' className='text-ink'>Centro</option>
                  </select>
                  <svg className={heroIconCls} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                    <path d='M6 9l6 6 6-6' />
                  </svg>
                </span>
              </div>

              {/* Precio */}
              <div className={heroFilterCls}>
                <span className={heroLabelCls}>Precio</span>
                <span className={heroValueCls}>
                  <select
                    name='price'
                    value={filters.price}
                    onChange={handleChange}
                    className='bg-transparent text-white text-sm font-medium w-full cursor-pointer outline-none appearance-none'
                  >
                    <option value='Cualquiera' className='text-ink'>Cualquiera</option>
                    <option value='Hasta 150k' className='text-ink'>Hasta U$S 150k</option>
                    <option value='150k-300k' className='text-ink'>U$S 150k–300k</option>
                    <option value='+300k' className='text-ink'>+ U$S 300k</option>
                  </select>
                  <svg className={heroIconCls} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                    <path d='M6 9l6 6 6-6' />
                  </svg>
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              type='submit'
              className='bg-primary hover:bg-primary-hover text-white font-bold text-sm uppercase tracking-[0.06em] rounded-[18px] shrink-0 h-[52px] px-8 transition-all duration-150 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-px active:translate-y-0 flex items-center justify-center'
            >
              BUSCAR
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
