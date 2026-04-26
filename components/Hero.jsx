'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';

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
    router.push(`/properties${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const heroFilterCls = 'flex flex-col justify-center h-[52px] px-5 border-r border-white/15 last:border-r-0 hover:bg-white/8 transition-all cursor-pointer';
  const heroLabelCls = 'text-white/55 text-[10px] font-medium uppercase tracking-widest leading-none mb-1';
  const heroValueCls = 'text-white text-sm font-medium flex items-center justify-between gap-2';
  const heroIconCls = 'w-4 h-4 text-white/50 flex-shrink-0';

  return (
    <section className='relative h-screen min-h-[700px] overflow-hidden'>

      {/* Background Image */}
      <div className='absolute inset-0 z-0'>
        <picture>
          <source media='(min-width: 768px)' srcSet='/images/necesito_otro_angulo_202604221402.jpeg' />
          <img
            src='/images/mobilehero_1.jpeg'
            alt=''
            className='w-full h-full object-cover object-center hero-bg-zoom'
          />
        </picture>
        <div
          className='absolute inset-0'
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.10) 40%, rgba(0,0,0,0.55) 100%)',
          }}
        />
      </div>

      {/* Scroll indicator — mobile only, above pill */}
      <div className='md:hidden absolute bottom-[180px] left-1/2 -translate-x-1/2 z-20 scroll-indicator-container'>
        <svg className='w-[22px] h-[22px] text-white/55' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M19 9l-7 7-7-7' />
        </svg>
      </div>

      {/* Content Block — desktop centered, mobile upper 1/3 */}
      {/* Desktop: centered vertically and horizontally */}
      <div className='hidden md:flex absolute inset-0 flex-col items-center justify-center w-full text-center px-6 z-10'>
        <motion.div
          className='flex items-center justify-center gap-3 mb-4'
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <span className='w-7 h-px bg-white/40 flex-shrink-0' />
          <span className='text-white/70 text-[11px] font-semibold uppercase tracking-[0.18em]'>Córdoba, Argentina</span>
          <span className='w-7 h-px bg-white/40 flex-shrink-0' />
        </motion.div>
        <h1 className='font-display italic font-normal text-white mb-1 leading-tight' style={{ fontSize: 'clamp(40px, 5vw, 76px)', lineHeight: 1.0 }}>
          <HeadlineChar text={HERO_LINE1} className='block' />
        </h1>
        <h2 className='font-display font-bold text-white leading-tight' style={{ fontSize: 'clamp(40px, 5vw, 76px)', lineHeight: 1.0 }}>
          <HeadlineChar text={HERO_LINE2} className='block' />
        </h2>
      </div>

      {/* Mobile: content at top: 42%, vertically centered */}
      <div className='md:hidden absolute top-[42%] left-0 right-0 flex flex-col items-center w-full text-center px-6 z-10' style={{ transform: 'translateY(-50%)' }}>
        <motion.div
          className='flex items-center justify-center gap-3 mb-4'
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <span className='w-7 h-px bg-white/40 flex-shrink-0' />
          <span className='text-white/70 text-[11px] font-semibold uppercase tracking-[0.18em]'>Córdoba, Argentina</span>
          <span className='w-7 h-px bg-white/40 flex-shrink-0' />
        </motion.div>
        <h1 className='font-display italic font-normal text-white mb-1 leading-tight' style={{ fontSize: 'clamp(40px, 5vw, 76px)', lineHeight: 1.0 }}>
          <HeadlineChar text={HERO_LINE1} className='block' />
        </h1>
        <h2 className='font-display font-bold text-white leading-tight' style={{ fontSize: 'clamp(40px, 5vw, 76px)', lineHeight: 1.0 }}>
          <HeadlineChar text={HERO_LINE2} className='block' />
        </h2>
      </div>

      {/* Search Bar */}
      <div className='absolute bottom-[100px] w-full z-20 px-4'>
        <div
          className='mx-auto max-w-[880px] bg-black/20 backdrop-blur-xl border border-white/10 px-2 py-2 flex items-center'
          style={{ animation: 'fadeUp 0.7s var(--ease-out) 0.45s both' }}
        >
          {/* Desktop: full filters */}
          <form onSubmit={handleSubmit} className='hidden md:flex items-center w-full'>
            <div className='flex-1 grid grid-cols-4 divide-x divide-white/15'>
              <div className={heroFilterCls}>
                <span className={heroLabelCls}>Operación</span>
                <span className={heroValueCls}>
                  <select name='operation' value={filters.operation} onChange={handleChange} className='bg-transparent text-white text-sm font-medium w-full cursor-pointer outline-none appearance-none'>
                    <option value='Venta' style={{ color: '#1C1C1A', backgroundColor: '#fff' }}>Venta</option>
                    <option value='Alquiler' style={{ color: '#1C1C1A', backgroundColor: '#fff' }}>Alquiler</option>
                    <option value='Todos' style={{ color: '#1C1C1A', backgroundColor: '#fff' }}>Todos</option>
                  </select>
                  <svg className={heroIconCls} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M6 9l6 6 6-6' /></svg>
                </span>
              </div>
              <div className={heroFilterCls}>
                <span className={heroLabelCls}>Tipo</span>
                <span className={heroValueCls}>
                  <select name='type' value={filters.type} onChange={handleChange} className='bg-transparent text-white text-sm font-medium w-full cursor-pointer outline-none appearance-none'>
                    <option value='Todos' style={{ color: '#1C1C1A', backgroundColor: '#fff' }}>Todos</option>
                    <option value='Casa' style={{ color: '#1C1C1A', backgroundColor: '#fff' }}>Casas</option>
                    <option value='Departamento' style={{ color: '#1C1C1A', backgroundColor: '#fff' }}>Departamentos</option>
                    <option value='Terreno' style={{ color: '#1C1C1A', backgroundColor: '#fff' }}>Terrenos</option>
                    <option value='Campo' style={{ color: '#1C1C1A', backgroundColor: '#fff' }}>Campos</option>
                    <option value='Inmueble Comercial' style={{ color: '#1C1C1A', backgroundColor: '#fff' }}>Inmuebles Comerciales</option>
                    <option value='Gran Inversión' style={{ color: '#1C1C1A', backgroundColor: '#fff' }}>Grandes Inversiones</option>
                  </select>
                  <svg className={heroIconCls} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M6 9l6 6 6-6' /></svg>
                </span>
              </div>
              <div className={heroFilterCls}>
                <span className={heroLabelCls}>Zona</span>
                <span className={heroValueCls}>
                  <select name='zone' value={filters.zone} onChange={handleChange} className='bg-transparent text-white text-sm font-medium w-full cursor-pointer outline-none appearance-none'>
                    <option value='Córdoba' style={{ color: '#1C1C1A', backgroundColor: '#fff' }}>Córdoba</option>
                    <option value='Alta Gracia' style={{ color: '#1C1C1A', backgroundColor: '#fff' }}>Alta Gracia</option>
                    <option value='Villa Allende' style={{ color: '#1C1C1A', backgroundColor: '#fff' }}>Villa Allende</option>
                    <option value='Mina Clavero' style={{ color: '#1C1C1A', backgroundColor: '#fff' }}>Mina Clavero</option>
                    <option value='Centro' style={{ color: '#1C1C1A', backgroundColor: '#fff' }}>Centro</option>
                  </select>
                  <svg className={heroIconCls} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M6 9l6 6 6-6' /></svg>
                </span>
              </div>
              <div className={heroFilterCls}>
                <span className={heroLabelCls}>Precio</span>
                <span className={heroValueCls}>
                  <select name='price' value={filters.price} onChange={handleChange} className='bg-transparent text-white text-sm font-medium w-full cursor-pointer outline-none appearance-none'>
                    <option value='Cualquiera' style={{ color: '#1C1C1A', backgroundColor: '#fff' }}>Cualquiera</option>
                    <option value='Hasta 150k' style={{ color: '#1C1C1A', backgroundColor: '#fff' }}>Hasta U$S 150k</option>
                    <option value='150k-300k' style={{ color: '#1C1C1A', backgroundColor: '#fff' }}>U$S 150k–300k</option>
                    <option value='+300k' style={{ color: '#1C1C1A', backgroundColor: '#fff' }}>+ U$S 300k</option>
                  </select>
                  <svg className={heroIconCls} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M6 9l6 6 6-6' /></svg>
                </span>
              </div>
            </div>
            <button type='submit' className='bg-primary hover:bg-primary-hover text-white font-bold text-sm uppercase tracking-[0.06em] rounded-[18px] shrink-0 h-[52px] px-8 transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 flex items-center justify-center'>
              BUSCAR
            </button>
          </form>

          {/* Mobile: glass pillar buscar button */}
          <button
            type='button'
            onClick={() => router.push('/properties')}
            className='md:hidden flex items-center justify-center gap-2 w-full text-white font-bold text-sm uppercase tracking-wider rounded-full py-3.5 px-8 transition-all shadow-xl'
            style={{ background: '#F26B2E' }}
          >
            <FaSearch className='w-4 h-4' />
            Buscar ahora
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0px); opacity: 0.6; }
          50% { transform: translateY(8px); opacity: 1; }
        }
        .scroll-indicator-container {
          animation: scrollBounce 2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: no-preference) {
          .hero-bg-zoom {
            animation: heroZoom 20s ease-in-out infinite alternate;
          }
          .scroll-indicator-container {
            animation: scrollBounce 2s ease-in-out infinite;
          }
        }
        @keyframes heroZoom {
          from { transform: scale(1.0); }
          to { transform: scale(1.06); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
