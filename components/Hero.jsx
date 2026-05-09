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
    price: 'Cualquiera',
    term: '',
    bedrooms: '',
    baths: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.term && filters.term.trim()) params.set('city', filters.term.trim());
    if (filters.type && filters.type !== 'Todos') params.set('type', filters.type);
    if (filters.bedrooms) params.set('bedrooms', filters.bedrooms);
    if (filters.baths) params.set('baths', filters.baths);
    if (filters.price && filters.price !== 'Cualquiera') params.set('price', filters.price);
    if (filters.operation && filters.operation !== 'Todos') params.set('operation', filters.operation);
    router.push(`/properties${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <section className='relative h-[calc(100vh+200px)] min-h-[calc(100vh+100px)] md:h-[100dvh] md:min-h-[100dvh]'>

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

      <div className='hidden md:flex absolute inset-0 flex-col items-center justify-center w-full text-center px-6 z-10' style={{ paddingBottom: '140px' }}>
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
      <div className='absolute bottom-[200px] md:bottom-[80px] w-full z-20 px-4 pb-6'>
        <div
          className='mx-auto max-w-[880px]'
          style={{ animation: 'fadeUp 0.7s var(--ease-out) 0.45s both' }}
        >
          {/* Desktop: Senada .homepage-search-form */}
          <form onSubmit={handleSubmit} className='hidden md:flex flex-col'>
            {/* .top-part — Senada: bg-black, rounded-12px, padding 20px */}
            <div className='flex items-end gap-3 bg-black rounded-xl p-5'>
              <div className='flex-1'>
                <label className='block text-white/60 text-[11px] font-medium uppercase tracking-wider mb-2'>Buscar por ciudad, zona, dirección o palabra clave</label>
                <div className='relative'>
                  <svg className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30' viewBox='0 0 24 24' fill='currentColor'><path d='M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.39zM11 18a7 7 0 1 1 7-7 7 7 0 0 1-7 7z'/></svg>
                  <input type='text' name='term' placeholder='Ej: Alta Gracia, Pellegrini 123, casa...' className='w-full h-[54px] pl-12 pr-4 rounded-md bg-white/[0.06] border border-white/10 text-white text-sm placeholder:text-white/25 outline-none focus:border-white/30 transition-colors' value={filters.term || ''} onChange={(e) => setFilters(prev => ({ ...prev, term: e.target.value }))} required />
                </div>
              </div>
              <button type='button' onClick={() => setShowMore(!showMore)} className='h-[54px] text-white/55 text-xs font-normal uppercase tracking-wider hover:text-white transition-colors flex-shrink-0 self-end pb-0.5'>{showMore ? 'Mostrar menos' : 'Mostrar más'}</button>
              <button type='submit' className='bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white font-bold text-sm uppercase tracking-[0.06em] rounded-md h-[54px] px-8 transition-all shadow-lg shadow-[var(--color-brand)]/30 flex-shrink-0 self-end'>Buscar</button>
            </div>
            {/* .bottom-part */}
            <div className='overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]' style={{ maxHeight: showMore ? '200px' : '0', opacity: showMore ? 1 : 0, marginTop: showMore ? '16px' : '0' }}>
              <div className='flex items-end gap-3 bg-black rounded-xl p-5'>
                {[{label:'Tipo', name:'type', opts:[{v:'Todos',l:'Todos'},{v:'Casa',l:'Casas'},{v:'Departamento',l:'Departamentos'},{v:'Terreno',l:'Terrenos'},{v:'Campo',l:'Campos'},{v:'Inmueble Comercial',l:'Inmuebles Comerciales'}]},{label:'Operación', name:'operation', opts:[{v:'Todos',l:'Todos'},{v:'Venta',l:'Venta'},{v:'Alquiler',l:'Alquiler'}]},{label:'Dormitorios', name:'bedrooms', opts:[{v:'',l:'Cualquiera'},{v:'1',l:'1'},{v:'2',l:'2'},{v:'3',l:'3'},{v:'4',l:'4'},{v:'5+',l:'5+'}]},{label:'Baños', name:'baths', opts:[{v:'',l:'Cualquiera'},{v:'1',l:'1'},{v:'2',l:'2'},{v:'3',l:'3'},{v:'4',l:'4'},{v:'5+',l:'5+'}]},{label:'Precio', name:'price', opts:[{v:'Cualquiera',l:'Cualquiera'},{v:'Hasta 150k',l:'Hasta U$S 150k'},{v:'150k-300k',l:'U$S 150k–300k'},{v:'+300k',l:'+ U$S 300k'}]}].map(f => (
                  <div key={f.name} className='flex-1'>
                    <label className='block text-white/60 text-[11px] font-medium uppercase tracking-wider mb-2'>{f.label}</label>
                    <select name={f.name} value={filters[f.name] || f.opts[0].v} onChange={(e) => setFilters(prev => ({ ...prev, [f.name]: e.target.value }))} className='w-full h-[54px] px-4 rounded-md bg-white/[0.06] border border-white/10 text-white text-sm outline-none cursor-pointer appearance-none focus:border-white/30 transition-colors'>
                      {f.opts.map(o => <option key={o.v} value={o.v} style={{color:'#333',backgroundColor:'#fff'}}>{o.l}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </form>

          {/* Popular locations — Senada .search-suggestions */}
          <div className='hidden md:flex items-center gap-3 mt-4'>
            <span className='text-white/40 text-xs font-medium uppercase tracking-wider flex-shrink-0'>Zonas populares:</span>
            {['Alta Gracia','Córdoba','Villa Allende','Mina Clavero'].map(loc => (
              <a key={loc} href={`/properties?city=${encodeURIComponent(loc)}`} className='text-white/55 hover:text-white text-xs font-medium transition-colors px-3 py-1.5 border border-white/10 rounded-full hover:border-white/25'>{loc}</a>
            ))}
          </div>
        </div>

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
                zIndex: 20,
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
                      <div className='absolute top-full left-0 right-0 bg-black border border-white/10 z-50' style={{ borderRadius: '0 0 12px 12px', overflow: 'visible' }}>
                        {['Todos', 'Casas', 'Departamentos', 'Terrenos', 'Campos', 'Inmuebles Comerciales', 'Grandes Inversiones'].map(v => (
                          <div key={v} onClick={(e) => { e.stopPropagation(); setFilters(prev => ({ ...prev, type: v })); setOpenDropdown(null); }} className={`h-12 px-4 flex items-center border-b border-white/10 hover:bg-white/5 cursor-pointer`}>
                            <span className={`text-sm px-3 py-1.5 rounded-lg ${filters.type === v ? 'bg-[var(--color-brand)] text-white font-semibold' : 'text-white/70'}`}>{v}</span>
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
                          <div key={v} onClick={(e) => { e.stopPropagation(); setFilters(prev => ({ ...prev, operation: v })); setOpenDropdown(null); }} className={`h-12 px-4 flex items-center border-b border-white/10 hover:bg-white/5 cursor-pointer`}>
                            <span className={`text-sm px-3 py-1.5 rounded-lg ${filters.operation === v ? 'bg-[var(--color-brand)] text-white font-semibold' : 'text-white/70'}`}>{v}</span>
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
                          <div key={v} onClick={(e) => { e.stopPropagation(); setFilters(prev => ({ ...prev, zone: v })); setOpenDropdown(null); }} className={`h-12 px-4 flex items-center border-b border-white/10 hover:bg-white/5 cursor-pointer`}>
                            <span className={`text-sm px-3 py-1.5 rounded-lg ${filters.zone === v ? 'bg-[var(--color-brand)] text-white font-semibold' : 'text-white/70'}`}>{v}</span>
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
                          <div key={v} onClick={(e) => { e.stopPropagation(); setFilters(prev => ({ ...prev, price: v })); setOpenDropdown(null); }} className={`h-12 px-4 flex items-center border-b border-white/10 hover:bg-white/5 cursor-pointer`}>
                            <span className={`text-sm px-3 py-1.5 rounded-lg ${filters.price === v ? 'bg-[var(--color-brand)] text-white font-semibold' : 'text-white/70'}`}>{v}</span>
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
