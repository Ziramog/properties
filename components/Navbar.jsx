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

  const isHeroPage = pathname === '/';
  const isGlassMode = !isHeroPage || isScrolled;

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
      {/* Desktop Nav */}
      <header
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isGlassMode
            ? 'bg-[#1C1C1A]/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/10'
            : 'bg-transparent'
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top, 8px)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-12 h-[72px]">
          <Link className="flex items-center flex-shrink-0" href="/">
            <Image
              className="brightness-0 invert"
              src={logo}
              alt="Roggero & Roma"
              style={{ height: isGlassMode ? '48px' : '72px', width: 'auto', transition: 'height 0.3s ease' }}
            />
          </Link>

          <nav className="flex gap-10 lg:gap-14">
            <Link href="/" className={`${pathname === '/' ? 'text-[var(--color-brand)]' : 'text-white'} hover:text-[var(--color-brand)] transition-colors text-[13px] font-medium uppercase tracking-[0.08em]`}>
              Inicio
            </Link>
            <Link href="/properties" className={`${pathname.startsWith('/properties') ? 'text-[var(--color-brand)]' : 'text-white'} hover:text-[var(--color-brand)] transition-colors text-[13px] font-medium uppercase tracking-[0.08em]`}>
              Propiedades
            </Link>
            <Link href="/contact" className={`${pathname === '/contact' ? 'text-[var(--color-brand)]' : 'text-white'} hover:text-[var(--color-brand)] transition-colors text-[13px] font-medium uppercase tracking-[0.08em]`}>
              Contacto
            </Link>
          </nav>

          <div className="flex items-center gap-5">
            <span className="text-white/60 text-sm font-light tracking-widest hidden lg:block">
              {PHONE_DISPLAY}
            </span>

            {!session && providers && Object.values(providers).map((provider) => (
              <button
                key={provider.id}
                onClick={() => signIn(provider.id)}
                className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-wider shadow-lg shadow-[var(--color-brand)]/20 transition-all"
              >
                Ingresar
              </button>
            ))}

            {session && session.user?.role === 'admin' && (
              <Link
                href="/properties/add"
                className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-wider shadow-lg shadow-[var(--color-brand)]/20 transition-all"
              >
                Agregar
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <motion.header
        className="md:hidden fixed top-0 left-0 right-0 z-50"
        style={{
          paddingTop: 'env(safe-area-inset-top, 8px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
        animate={{
          height: isGlassMode ? '60px' : 'auto',
          backgroundColor: isGlassMode
            ? 'rgba(28, 28, 26, 0.85)'
            : 'transparent',
          borderBottomWidth: isGlassMode ? '1px' : '0px',
          borderColor: isGlassMode ? 'rgba(255,255,255,0.05)' : 'transparent',
          backdropFilter: isGlassMode ? 'blur(20px)' : 'blur(0px)',
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="max-w-7xl mx-auto flex items-center px-4 relative"
          animate={{
            paddingTop: isGlassMode ? '10px' : '35px',
            paddingBottom: isGlassMode ? '10px' : '0px',
            justifyContent: isGlassMode ? 'space-between' : 'center',
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Logo */}
          <motion.div
            animate={{
              scale: isGlassMode ? 0.75 : 1,
              opacity: isGlassMode ? 0.9 : 1,
            }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ originX: 0.5, originY: 0.5 }}
          >
            <Link className="flex items-center flex-shrink-0" href="/">
              <Image
                className="brightness-0 invert"
                src={logo}
                alt="Roggero & Roma"
                style={{ height: isGlassMode ? '44px' : '72px', width: 'auto', transition: 'height 0.35s ease' }}
              />
            </Link>
          </motion.div>

          {/* Right side */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {isGlassMode ? (
            <motion.a
              href={generateWhatsAppLink({ context: 'general' })}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg shadow-[var(--color-brand)]/20"
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

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="mx-4 mt-2"
            >
              <div className="bg-[#1C1C1A]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-3">
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
