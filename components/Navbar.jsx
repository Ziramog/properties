'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPhone, FaWhatsapp, FaBars, FaTimes, FaInstagram, FaLinkedin, FaFacebook, FaEnvelope } from 'react-icons/fa';
import { generateWhatsAppLink, PHONE_NUMBER, PHONE_DISPLAY } from '@/utils/whatsapp';
import logo from '@/assets/images/logo-white.png';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';

const EMAIL = 'info@roggeroyroma.com.ar';
const WHATSAPP_NUMBER = '5493547563911';

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

    const handleResize = () => setIsMobileMenuOpen(false);
    window.addEventListener('resize', handleResize);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight * 0.4);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Desktop Nav */}
      <header
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isGlassMode ? 'bg-black shadow-lg shadow-black/20' : 'bg-transparent'
        }`}
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 8px) + 15px)', paddingBottom: '15px' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-12 h-full">
          <Link className="flex items-center flex-shrink-0" href="/">
            <Image className="brightness-0 invert" src={logo} alt="Roggero & Roma" style={{ height: '48px', width: 'auto' }} />
          </Link>

          <nav className="flex gap-10 lg:gap-14">
            <Link href="/" className={`${pathname === '/' ? 'text-[var(--color-brand)]' : 'text-white'} hover:text-[var(--color-brand)] transition-colors text-[13px] font-medium uppercase tracking-[0.08em]`}>Inicio</Link>
            <Link href="/properties" className={`${pathname.startsWith('/properties') ? 'text-[var(--color-brand)]' : 'text-white'} hover:text-[var(--color-brand)] transition-colors text-[13px] font-medium uppercase tracking-[0.08em]`}>Propiedades</Link>
            <Link href="/contact" className={`${pathname === '/contact' ? 'text-[var(--color-brand)]' : 'text-white'} hover:text-[var(--color-brand)] transition-colors text-[13px] font-medium uppercase tracking-[0.08em]`}>Contacto</Link>
          </nav>

          <div className="flex items-center gap-5">
            {!session && providers && Object.values(providers).map((provider) => (
              <button key={provider.id} onClick={() => signIn(provider.id)} className="text-white hover:text-[var(--color-brand)] px-6 py-2.5 font-bold text-sm uppercase tracking-wider transition-all">Ingresar</button>
            ))}
            {session && (
              <div className="flex items-center gap-3">
                {session.user?.role === 'admin' && (
                  <Link href="/properties/add" className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wider transition-all">Agregar</Link>
                )}
                <span className="text-white/80 text-sm hidden lg:block">{session.user?.name?.split(' ')[0]}</span>
                <button onClick={() => signOut()} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full font-medium text-sm transition-all">Salir</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-[60] transition-all duration-300"
        style={{ height: 'calc(env(safe-area-inset-top, 8px) + 60px)', backgroundColor: isGlassMode ? 'rgba(0,0,0,1)' : 'transparent' }}
      >
        <div className="flex items-center justify-between px-6 h-full">
          {/* Logo — isotipo */}
          <Link className="flex items-center flex-shrink-0" href="/">
            <Image
              className="brightness-0 invert"
              src="/images/ISOTIPO R&R-Photoroom.png"
              alt="Roggero & Roma"
              width={120}
              height={40}
              style={{ height: '40px', width: 'auto' }}
            />
          </Link>

          {/* Hamburger / Close */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-8 h-8 flex items-center justify-center text-white"
            aria-label="Menú"
          >
            <motion.div initial={false} animate={{ rotate: isMobileMenuOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </motion.div>
          </button>
        </div>

        {/* Fullscreen Overlay — below header */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: '-60px' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '-60px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-0 right-0 bg-black flex flex-col"
              style={{ top: 'calc(env(safe-area-inset-top, 8px) + 60px)', bottom: 0 }}
            >
              {/* Top row: isotipo + close */}
              <div className="flex items-center justify-between px-4 h-[60px] flex-shrink-0">
                <Link className="flex items-center flex-shrink-0" href="/">
                  <Image src="/images/ISOTIPO R&R-Photoroom.png" alt="Roggero & Roma" width={120} height={40} style={{ height: '40px', width: 'auto' }} />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-white"
                  aria-label="Cerrar menú"
                >
                  <motion.div initial={false} animate={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                    <FaTimes size={24} />
                  </motion.div>
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 flex flex-col justify-center px-8 gap-6">
                <Link href="/" className="text-white text-[28px] font-normal" style={{ fontFamily: 'var(--font-heading)' }} onClick={() => setIsMobileMenuOpen(false)}>Inicio</Link>
                <Link href="/properties" className="text-white text-[28px] font-normal" style={{ fontFamily: 'var(--font-heading)' }} onClick={() => setIsMobileMenuOpen(false)}>Propiedades</Link>
                <Link href="/contact" className="text-white text-[28px] font-normal" style={{ fontFamily: 'var(--font-heading)' }} onClick={() => setIsMobileMenuOpen(false)}>Contacto</Link>
                {session && (
                  <Link href="/profile" className="text-white text-[28px] font-normal" style={{ fontFamily: 'var(--font-heading)' }} onClick={() => setIsMobileMenuOpen(false)}>Perfil</Link>
                )}
              </nav>

              {/* Bottom: phone, email, icons */}
              <div className="flex-shrink-0 px-8 pb-10" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 16px) + 16px)' }}>
                <div className="flex flex-col gap-3 mb-6">
                  <a href={`tel:${PHONE_NUMBER}`} className="flex items-center gap-3 text-white text-[15px]">
                    <FaPhone size={16} />
                    {PHONE_DISPLAY}
                  </a>
                  <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 text-white text-[15px]">
                    <FaEnvelope size={16} />
                    {EMAIL}
                  </a>
                </div>
                <div className="flex items-center gap-5">
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-white"><FaWhatsapp size={20} /></a>
                  <a href="https://www.instagram.com/roggeroyroma" target="_blank" rel="noopener noreferrer" className="text-white"><FaInstagram size={20} /></a>
                  <a href="https://www.facebook.com/roggeroyroma" target="_blank" rel="noopener noreferrer" className="text-white"><FaFacebook size={20} /></a>
                  <a href="https://www.linkedin.com/company/roggeroyroma" target="_blank" rel="noopener noreferrer" className="text-white"><FaLinkedin size={20} /></a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Navbar;
