'use client';
import { useState, useEffect, useRef } from 'react';
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
  const [showMore, setShowMore] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [maxH, setMaxH] = useState('0px');
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const overlayRef = useRef(null);
  const filtersRef = useRef(null);
  const measuredRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (measuredRef.current) return;
    measuredRef.current = true;
    if (filtersRef.current) {
      setMaxH(`${filtersRef.current.scrollHeight}px`);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!openDropdown) return;
    const handleClick = (e) => {
      if (!e.target.closest('[data-dropdown]')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [openDropdown]);

  const cycleFilter = (key, values) => {
    const current = filters[key];
    const idx = values.indexOf(current);
    const next = values[(idx + 1) % values.length];
    setFilters(prev => ({ ...prev, [key]: next }));
  };

  const handleShowMoreToggle = () => {
    if (showMore) {
      setMaxH('0px');
      setOverlayVisible(false);
      setShowMore(false);
    } else {
      if (filtersRef.current) {
        setMaxH(`${filtersRef.current.scrollHeight}px`);
      }
      setOverlayVisible(true);
      setShowMore(true);
    }
  };

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
    <section className='relative overflow-hidden' style={{ height: 'calc(100vh + 200px)', minHeight: 'calc(100vh + 100px)' }}>

      {/* Dark overlay — fades in when filters expand on mobile, stays behind the search bar */}
      <div
        ref={overlayRef}
        style={{
          display: overlayVisible ? 'block' : 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, .8)',
          zIndex: 10,
          transition: 'opacity 0.4s ease',
          opacity: overlayVisible ? 1 : 0,
          pointerEvents: 'none',
        }}
      />

      {/* Background Video */}
      <div className='absolute inset-0 z-0'>
        <video
          src='/images/Modern_residential_building_Córd…_202604301151.mp4'
          autoPlay
          muted
          loop
          playsInline
          className='w-full h-full object-cover md:hidden'
        />
        <video
          src='/images/Modern_residential_building_Córd…_202604301151.mp4'
          autoPlay
          muted
          loop
          playsInline
          className='w-full h-full object-cover hidden md:block'
        />
        <div
          className='absolute inset-0'
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.10) 40%, rgba(0,0,0,0.55) 100%)',
          }}
        />
        <div className='absolute inset-0 z-10 pointer-events-none' style={{ backgroundImage: 'url(/senada/images/overlay-pattern.png)', backgroundRepeat: 'repeat', backgroundSize: '4px' }} />
      </div>

      {!scrolled && (
        <div className='md:hidden absolute bottom-[180px] left-1/2 -translate-x-1/2 z-20 scroll-indicator-container'>
          <img
            src='/senada/images/icons/ico_arrow-down.svg'
            alt='scroll'
            className='w-[25px] h-[23px]'
          />
        </div>
      )}

      <div className='hidden md:flex absolute inset-0 flex-col items-center justify-center w-full text-center px-6 z-10' style={{ paddingBottom: '200px' }}>
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
        <h1 className='font-display font-normal text-white mb-1 leading-tight' style={{ fontSize: 'clamp(40px, 5vw, 76px)', lineHeight: 1.0 }}>
          <HeadlineChar text={HERO_LINE1} className='block' />
        </h1>
        <h2 className='font-display font-normal text-white leading-tight' style={{ fontSize: 'clamp(40px, 5vw, 76px)', lineHeight: 1.0 }}>
          <HeadlineChar text={HERO_LINE2} className='block' />
        </h2>
      </div>

      <div className='md:hidden absolute top-[42%] left-0 right-0 flex flex-col items-center w-full text-center px-6 z-10' style={{ transform: 'translateY(calc(-50% - 100px))' }}>
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
        <h1 className='font-display font-normal text-white mb-1 leading-tight' style={{ fontSize: 'clamp(40px, 5vw, 76px)', lineHeight: 1.0 }}>
          <HeadlineChar text={HERO_LINE1} className='block' />
        </h1>
        <h2 className='font-display font-normal text-white leading-tight' style={{ fontSize: 'clamp(40px, 5vw, 76px)', lineHeight: 1.0 }}>
          <HeadlineChar text={HERO_LINE2} className='block' />
        </h2>
      </div>

      {/* Search Bar — always 200px from bottom of viewport */}
      <div className='absolute bottom-[200px] w-full z-20 px-4 pb-6'>
        <div
          className='mx-auto max-w-[880px] bg-black border border-white/10 px-2 py-2 flex items-center'
          style={{ animation: 'fadeUp 0.7s var(--ease-out) 0.45s both' }}
        >
          {/* Desktop: full filters */}
          <form onSubmit={handleSubmit} className='hidden md:flex items-center w-full'>
            <div className='flex-1 grid grid-cols-4 divide-x divide-white/15'>
              <div className={heroFilterCls}>
                <span className={heroLabelCls}>Operación</span>
                <span className={heroValueCls}>
                  <select name='operation' value={filters.operation} onChange={handleChange} className='bg-transparent text-white text-sm font-medium w-full cursor-pointer outline-none appearance-none'>
                    <option value='Venta' style={{ color: '#d4d4d4', backgroundColor: '#2a2a28' }}>Venta</option>
                    <option value='Alquiler' style={{ color: '#d4d4d4', backgroundColor: '#2a2a28' }}>Alquiler</option>
                    <option value='Todos' style={{ color: '#d4d4d4', backgroundColor: '#2a2a28' }}>Todos</option>
                  </select>
                  <svg className={heroIconCls} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M6 9l6 6 6-6' /></svg>
                </span>
              </div>
              <div className={heroFilterCls}>
                <span className={heroLabelCls}>Tipo</span>
                <span className={heroValueCls}>
                  <select name='type' value={filters.type} onChange={handleChange} className='bg-transparent text-white text-sm font-medium w-full cursor-pointer outline-none appearance-none'>
                    <option value='Todos' style={{ color: '#d4d4d4', backgroundColor: '#2a2a28' }}>Todos</option>
                    <option value='Casa' style={{ color: '#d4d4d4', backgroundColor: '#2a2a28' }}>Casas</option>
                    <option value='Departamento' style={{ color: '#d4d4d4', backgroundColor: '#2a2a28' }}>Departamentos</option>
                    <option value='Terreno' style={{ color: '#d4d4d4', backgroundColor: '#2a2a28' }}>Terrenos</option>
                    <option value='Campo' style={{ color: '#d4d4d4', backgroundColor: '#2a2a28' }}>Campos</option>
                    <option value='Inmueble Comercial' style={{ color: '#d4d4d4', backgroundColor: '#2a2a28' }}>Inmuebles Comerciales</option>
                    <option value='Gran Inversión' style={{ color: '#d4d4d4', backgroundColor: '#2a2a28' }}>Grandes Inversiones</option>
                  </select>
                  <svg className={heroIconCls} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M6 9l6 6 6-6' /></svg>
                </span>
              </div>
              <div className={heroFilterCls}>
                <span className={heroLabelCls}>Zona</span>
                <span className={heroValueCls}>
                  <select name='zone' value={filters.zone} onChange={handleChange} className='bg-transparent text-white text-sm font-medium w-full cursor-pointer outline-none appearance-none'>
                    <option value='Córdoba' style={{ color: '#d4d4d4', backgroundColor: '#2a2a28' }}>Córdoba</option>
                    <option value='Alta Gracia' style={{ color: '#d4d4d4', backgroundColor: '#2a2a28' }}>Alta Gracia</option>
                    <option value='Villa Allende' style={{ color: '#d4d4d4', backgroundColor: '#2a2a28' }}>Villa Allende</option>
                    <option value='Mina Clavero' style={{ color: '#d4d4d4', backgroundColor: '#2a2a28' }}>Mina Clavero</option>
                    <option value='Centro' style={{ color: '#d4d4d4', backgroundColor: '#2a2a28' }}>Centro</option>
                  </select>
                  <svg className={heroIconCls} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M6 9l6 6 6-6' /></svg>
                </span>
              </div>
              <div className={heroFilterCls}>
                <span className={heroLabelCls}>Precio</span>
                <span className={heroValueCls}>
                  <select name='price' value={filters.price} onChange={handleChange} className='bg-transparent text-white text-sm font-medium w-full cursor-pointer outline-none appearance-none'>
                    <option value='Cualquiera' style={{ color: '#d4d4d4', backgroundColor: '#2a2a28' }}>Cualquiera</option>
                    <option value='Hasta 150k' style={{ color: '#d4d4d4', backgroundColor: '#2a2a28' }}>Hasta U$S 150k</option>
                    <option value='150k-300k' style={{ color: '#d4d4d4', backgroundColor: '#2a2a28' }}>U$S 150k–300k</option>
                    <option value='+300k' style={{ color: '#d4d4d4', backgroundColor: '#2a2a28' }}>+ U$S 300k</option>
                  </select>
                  <svg className={heroIconCls} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M6 9l6 6 6-6' /></svg>
                </span>
              </div>
            </div>
            <button type='submit' className='bg-primary hover:bg-primary-hover text-white font-bold text-sm uppercase tracking-[0.06em] rounded-[18px] shrink-0 h-[52px] px-8 transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 flex items-center justify-center'>
              BUSCAR
            </button>
          </form>

          {/* Mobile: input + button + toggle all fixed; filters expand via position absolute below */}
          <div className='md:hidden w-full relative'>
            {/* Search input — stays fixed at top */}
            <div className='bg-black border border-white/10 flex items-center gap-2 px-3 py-2.5' style={{ borderRadius: 12 }}>
              <svg className='w-5 h-5 text-black flex-shrink-0' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.39zM11 18a7 7 0 1 1 7-7 7 7 0 0 1-7 7z'/>
              </svg>
              <input
                type='text'
                placeholder='Buscar por ciudad, zona o tipo'
                className='bg-transparent text-white text-sm placeholder:text-white/40 w-full outline-none'
              />
            </div>

            {/* Button — stays fixed below input */}
            <button
              type='button'
              onClick={() => router.push('/properties')}
              className='w-full bg-primary hover:bg-[#e05a23] text-white font-bold text-sm uppercase tracking-wider rounded-xl h-12 flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/30 mt-3'
            >
              <FaSearch className='w-4 h-4' />
              BUSCAR
            </button>

            {/* Toggle — stays fixed below button */}
            {scrolled && (
              <button
                type='button'
                onClick={() => handleShowMoreToggle()}
                className='flex items-center gap-1.5 w-full py-3 text-white/60 text-xs font-normal uppercase tracking-wide hover:text-white/80 transition-all'
              >
                <span className={`w-2.5 h-2.5 flex-shrink-0 bg-no-repeat bg-center bg-contain`} style={{ backgroundImage: showMore ? "url('data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\' fill=\\'%23919191\\'><path d=\\'M19 13H5v-2h14v2z\\'/></svg>')" : "url('data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\' fill=\\'%23919191\\'><path d=\\'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z\\'/></svg>')" }} />
                <span>{showMore ? 'Mostrar menos' : 'Mostrar más'}</span>
              </button>
            )}

            {/* Expanded Filters — position absolute below toggle, slides DOWN and covers content below */}
            <div
              ref={filtersRef}
              className='overflow-visible'
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                transition: 'max-height 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
                maxHeight: maxH,
                opacity: showMore ? 1 : 0,
                zIndex: 10,
              }}
            >
              <div
                className='bg-black w-full overflow-visible'
                style={{ borderRadius: 12, marginTop: 7 }}
              >
                <div className='grid grid-cols-2'>
                  {/* Tipo */}
                  <div
                    data-dropdown='type'
                    className='h-14 px-4 flex flex-col justify-center border-b border-r border-white/15 cursor-pointer hover:bg-white/5 transition-all relative overflow-visible'
                    onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
                  >
                    <span className='text-white/55 text-[10px] font-medium uppercase tracking-widest leading-none mb-1'>Tipo</span>
                    <span className='text-white text-sm font-medium flex items-center justify-between'>
                      {filters.type}
                      <svg className={`w-4 h-4 text-white/50 transition-transform ${openDropdown === 'type' ? 'rotate-180' : ''}`} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M6 9l6 6 6-6' /></svg>
                    </span>
                    {openDropdown === 'type' && (
                      <div className='absolute top-full left-0 right-0 bg-black border border-white/10 z-30' style={{ borderRadius: '0 0 12px 12px', overflow: 'visible' }}>
                        {['Todos', 'Casas', 'Departamentos', 'Terrenos', 'Campos', 'Inmuebles Comerciales', 'Grandes Inversiones'].map(v => (
                          <div key={v} onClick={(e) => { e.stopPropagation(); setFilters(prev => ({ ...prev, type: v })); setOpenDropdown(null); }} className={`h-12 px-4 flex items-center border-b border-white/10 hover:bg-white/5 cursor-pointer${filters.type === v ? ' bg-[var(--color-brand)]' : ''}`}>
                            <span className={`text-sm ${filters.type === v ? 'text-white font-semibold' : 'text-white/70'}`}>{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Operación */}
                  <div
                    data-dropdown='op'
                    className='h-14 px-4 flex flex-col justify-center border-b border-white/15 cursor-pointer hover:bg-white/5 transition-all relative overflow-visible'
                    onClick={() => setOpenDropdown(openDropdown === 'op' ? null : 'op')}
                  >
                    <span className='text-white/55 text-[10px] font-medium uppercase tracking-widest leading-none mb-1'>Operación</span>
                    <span className='text-white text-sm font-medium flex items-center justify-between'>
                      {filters.operation}
                      <svg className={`w-4 h-4 text-white/50 transition-transform ${openDropdown === 'op' ? 'rotate-180' : ''}`} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M6 9l6 6 6-6' /></svg>
                    </span>
                    {openDropdown === 'op' && (
                      <div className='absolute top-full left-0 right-0 bg-black border border-white/10 z-30' style={{ borderRadius: '0 0 12px 12px', overflow: 'visible' }}>
                        {['Venta', 'Alquiler', 'Todos'].map(v => (
                          <div key={v} onClick={(e) => { e.stopPropagation(); setFilters(prev => ({ ...prev, operation: v })); setOpenDropdown(null); }} className={`h-12 px-4 flex items-center border-b border-white/10 hover:bg-white/5 cursor-pointer${filters.operation === v ? ' bg-[var(--color-brand)]' : ''}`}>
                            <span className={`text-sm ${filters.operation === v ? 'text-white font-semibold' : 'text-white/70'}`}>{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Zona */}
                  <div
                    data-dropdown='zone'
                    className='h-14 px-4 flex flex-col justify-center border-r border-white/15 cursor-pointer hover:bg-white/5 transition-all relative overflow-visible'
                    onClick={() => setOpenDropdown(openDropdown === 'zone' ? null : 'zone')}
                  >
                    <span className='text-white/55 text-[10px] font-medium uppercase tracking-widest leading-none mb-1'>Zona</span>
                    <span className='text-white text-sm font-medium flex items-center justify-between'>
                      {filters.zone}
                      <svg className={`w-4 h-4 text-white/50 transition-transform ${openDropdown === 'zone' ? 'rotate-180' : ''}`} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M6 9l6 6 6-6' /></svg>
                    </span>
                    {openDropdown === 'zone' && (
                      <div className='absolute top-full left-0 right-0 bg-black border border-white/10 z-30' style={{ borderRadius: '0 0 12px 12px', overflow: 'visible' }}>
                        {['Córdoba', 'Alta Gracia', 'Villa Allende', 'Mina Clavero', 'Centro'].map(v => (
                          <div key={v} onClick={(e) => { e.stopPropagation(); setFilters(prev => ({ ...prev, zone: v })); setOpenDropdown(null); }} className={`h-12 px-4 flex items-center border-b border-white/10 hover:bg-white/5 cursor-pointer${filters.zone === v ? ' bg-[var(--color-brand)]' : ''}`}>
                            <span className={`text-sm ${filters.zone === v ? 'text-white font-semibold' : 'text-white/70'}`}>{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Precio */}
                  <div
                    data-dropdown='price'
                    className='h-14 px-4 flex flex-col justify-center cursor-pointer hover:bg-white/5 transition-all relative overflow-visible'
                    onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}
                  >
                    <span className='text-white/55 text-[10px] font-medium uppercase tracking-widest leading-none mb-1'>Precio</span>
                    <span className='text-white text-sm font-medium flex items-center justify-between'>
                      {filters.price}
                      <svg className={`w-4 h-4 text-white/50 transition-transform ${openDropdown === 'price' ? 'rotate-180' : ''}`} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M6 9l6 6 6-6' /></svg>
                    </span>
                    {openDropdown === 'price' && (
                      <div className='absolute top-full left-0 right-0 bg-black border border-white/10 z-30' style={{ borderRadius: '0 0 12px 12px', overflow: 'visible' }}>
                        {['Cualquiera', 'Hasta 150k', '150k-300k', '+300k'].map(v => (
                          <div key={v} onClick={(e) => { e.stopPropagation(); setFilters(prev => ({ ...prev, price: v })); setOpenDropdown(null); }} className={`h-12 px-4 flex items-center border-b border-white/10 hover:bg-white/5 cursor-pointer${filters.price === v ? ' bg-[var(--color-brand)]' : ''}`}>
                            <span className={`text-sm ${filters.price === v ? 'text-white font-semibold' : 'text-white/70'}`}>{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
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
          .scroll-indicator-container {
            animation: scrollBounce 2s ease-in-out infinite;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
