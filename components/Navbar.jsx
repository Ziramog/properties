'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { FaPhone, FaWhatsapp, FaBars, FaTimes } from 'react-icons/fa';
import { generateWhatsAppLink, PHONE_NUMBER, PHONE_DISPLAY } from '@/utils/whatsapp';
import logo from '@/assets/images/logo.png';
import { signIn, useSession, getProviders } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [providers, setProviders] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    setAuthProviders();

    const handleResize = () => {
      setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);

    // Scroll detection — threshold ~40% of viewport
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = window.innerHeight * 0.4;
      setIsScrolled(scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // check initial state

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Desktop Nav — always visible, no scroll effects */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 p-4" style={{ paddingTop: 'env(safe-area-inset-top, 8px)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-12">
          <Link className="flex items-center flex-shrink-0" href="/">
            <Image className="h-[84px] w-auto brightness-0 invert" src={logo} alt="Roggero & Roma" />
          </Link>

          <nav className="flex gap-12 lg:gap-14 text-white">
            <Link href="/" className={`${pathname === '/' ? 'text-primary' : 'text-white'} hover:text-primary transition-colors text-[13px] font-medium uppercase tracking-[0.08em]`} style={{ textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>
              Inicio
            </Link>
            <Link href="/properties" className={`${pathname === '/properties' ? 'text-primary' : 'text-white'} hover:text-primary transition-colors text-[13px] font-medium uppercase tracking-[0.08em]`} style={{ textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>
              Propiedades
            </Link>
            <Link href="/contact" className={`${pathname === '/contact' ? 'text-primary' : 'text-white'} hover:text-primary transition-colors text-[13px] font-medium uppercase tracking-[0.08em]`} style={{ textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>
              Contacto
            </Link>
          </nav>

          <div className="flex items-center gap-5">
            <span className="text-white/75 text-sm font-light tracking-widest" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>
              {PHONE_DISPLAY}
            </span>

            {!session && providers && Object.values(providers).map((provider) => (
              <a
                href={generateWhatsAppLink({ context: 'general' })}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wider shadow-lg shadow-primary/20 transition-all"
              >
                Contactar
              </a>
            ))}

            {session && (
              <Link
                href="/properties/add"
                className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wider shadow-lg shadow-primary/20 transition-all"
              >
                Agregar
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Nav — scroll-aware glass bar */}
      <motion.header
        className="md:hidden fixed top-0 left-0 right-0 z-50"
        style={{
          paddingTop: 'env(safe-area-inset-top, 8px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
        animate={{
          height: isScrolled ? '60px' : 'auto',
          backgroundColor: isScrolled
            ? 'rgba(0, 0, 0, 0.55)'
            : 'transparent',
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="max-w-7xl mx-auto flex items-center px-4 relative"
          animate={{
            paddingTop: isScrolled ? '10px' : '35px',
            paddingBottom: isScrolled ? '10px' : '0px',
            justifyContent: isScrolled ? 'space-between' : 'center',
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Logo — centered on hero, left-aligned when scrolled */}
          <motion.div
            animate={{
              scale: isScrolled ? 0.75 : 1,
              opacity: isScrolled ? 0.9 : 1,
            }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ originX: 0.5, originY: 0.5 }}
          >
            <Link className="flex items-center flex-shrink-0" href="/">
              <Image
                className="brightness-0 invert"
                src={logo}
                alt="Roggero & Roma"
                style={{ height: isScrolled ? '44px' : '72px', width: 'auto', transition: 'height 0.35s ease' }}
              />
            </Link>
          </motion.div>

          {/* Right side — Contact pill on scrolled, hamburger on not scrolled */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {isScrolled ? (
            <motion.a
              href={generateWhatsAppLink({ context: 'general' })}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/20"
            >
              Contactar
            </motion.a>
          ) : (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-8 flex items-center justify-center text-white/80 hover:text-white transition-colors"
              aria-label="Menú"
            >
              {isMobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          )}
          </div>
        </motion.div>

        {/* Mobile menu — slides in below the bar */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="mx-4 mt-2"
            >
              <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-3">
                <Link href="/" className="block text-white/90 text-sm font-medium py-2 px-3 rounded-lg hover:bg-white/10">Inicio</Link>
                <Link href="/properties" className="block text-white/90 text-sm font-medium py-2 px-3 rounded-lg hover:bg-white/10">Propiedades</Link>
                <Link href="/contact" className="block text-white/90 text-sm font-medium py-2 px-3 rounded-lg hover:bg-white/10">Contacto</Link>
                <div className="pt-3 border-t border-white/10 flex items-center gap-4">
                  <a href={`tel:${PHONE_NUMBER}`} className="text-white/60 text-sm flex items-center gap-2">
                    <FaPhone className="text-xs" />{PHONE_DISPLAY}
                  </a>
                  <a href={generateWhatsAppLink({ context: 'general' })} target="_blank" rel="noopener noreferrer"
                    className="bg-whatsapp text-white p-2 rounded-lg"><FaWhatsapp /></a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};

export default Navbar;
