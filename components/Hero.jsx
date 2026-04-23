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
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push('/properties');
  };

  return (
    <section className='relative h-screen min-h-[700px] overflow-hidden'>
      {/* Background Image */}
      <div className='absolute inset-0 z-0'>
        <img
          src='/images/mobilehero_1.jpeg'
          srcSet='/images/mobilehero_1.jpeg 800w, /images/necesito_otro_angulo_202604221402.jpeg 1600w'
          sizes='100vw'
          alt=''
          className='w-full h-full object-cover object-center'
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
          className='mx-auto max-w-[880px] bg-black/20 backdrop-blur-xl border border-white/10 px-2 py-2 flex items-center gap-2'
          style={{ animation: 'fadeUp 0.7s var(--ease-out) 0.45s both' }}
        >
          <form onSubmit={handleSubmit} className='flex items-center w-full gap-2'>
            <input
              type='text'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Explorá propiedades en Córdoba'
              className='flex-1 bg-black/20 border border-white/10 text-white text-sm font-medium py-4 px-5 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all outline-none placeholder:text-white/40'
            />
            <button
              type='submit'
              className='hidden sm:flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold text-sm uppercase tracking-wider rounded-xl shrink-0 h-[52px] px-8 transition-all shadow-lg shadow-primary/30'
            >
              <FaSearch className='w-4 h-4' />
              Buscar
            </button>
          </form>
        </div>

        {/* Mobile floating buscar button */}
        <button
          type='button'
          onClick={() => router.push('/properties')}
          className='sm:hidden flex items-center justify-center gap-2 mx-auto mt-3 bg-black/20 backdrop-blur-xl border border-white/10 text-white font-bold text-sm uppercase tracking-wider rounded-full px-10 py-3.5 transition-all shadow-xl'
        >
          <FaSearch className='w-4 h-4' />
          Buscar ahora
        </button>
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
