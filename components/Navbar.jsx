'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaPhone, FaWhatsapp } from 'react-icons/fa';
import { generateWhatsAppLink, PHONE_NUMBER, PHONE_DISPLAY } from '@/utils/whatsapp';
import logo from '@/assets/images/logo.png';
import { signIn, useSession, getProviders } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [providers, setProviders] = useState(null);
  const [navState, setNavState] = useState('hero');
  const pathname = usePathname();

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    setAuthProviders();

    let lastY = 0;
    const handler = () => {
      const currentY = window.scrollY;
      if (currentY < 80) {
        setNavState('hero');
      } else if (currentY > lastY) {
        setNavState('down');
      } else {
        setNavState('up');
      }
      lastY = currentY;
    };

    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Mobile nav states
  const isHero = navState === 'hero';
  const isDown = navState === 'down';
  const isUp = navState === 'up';

  return (
    <>
      {/* Mobile scroll-aware navbar */}
      <header
        className={`
          md:p-4 fixed top-0 left-0 right-0 z-50
          transition-transform duration-300
          ${isHero ? 'translate-y-0' : ''}
          ${isDown ? '-translate-y-full' : ''}
          ${isUp ? 'translate-y-0' : ''}
        `}
        style={{
          paddingTop: 'env(safe-area-inset-top, 8px)',
          paddingBottom: isUp ? 'env(safe-area-inset-bottom, 0px)' : '0',
          background: isUp ? 'rgba(255,255,255,0.96)' : 'transparent',
          backdropFilter: isUp ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: isUp ? 'blur(12px)' : 'none',
          borderBottom: isUp ? '1px solid rgba(0,0,0,0.06)' : 'none',
          boxShadow: isUp ? '0 1px 12px rgba(0,0,0,0.08)' : 'none',
          height: isUp ? '52px' : 'auto',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-3 md:px-12" style={{ height: isUp ? '52px' : 'auto' }}>

          {/* Mobile: show only monogram + Contactar pill when scrolled up */}
          {isUp ? (
            <>
              <Link className="flex items-center" href="/">
                <Image className="h-[28px] w-auto" src={logo} alt="Roggero & Roma" />
              </Link>
              <a
                href={generateWhatsAppLink({ context: 'general' })}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center text-white font-semibold text-[12px] rounded-full"
                style={{ background: '#F26B2E', height: '32px', padding: '0 16px' }}
              >
                Contactar
              </a>
            </>
          ) : (
            <>
              {/* Mobile: hero state — placeholder for balance */}
              <div className="md:hidden w-8" />

              {/* Logo — centered on mobile (hero), left on desktop */}
              <div className="absolute left-1/2 -translate-x-1/2 md:static md:-translate-x-0 top-[35px] md:top-auto">
                <Link className="flex items-center flex-shrink-0" href="/">
                  <Image
                    className="h-[72px] md:h-[84px] w-auto brightness-0 invert"
                    src={logo}
                    alt="Roggero & Roma"
                  />
                </Link>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Desktop Nav — separate from mobile scroll behavior */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-12 py-6">
          {/* Logo — left aligned on desktop */}
          <Link className="flex items-center" href="/">
            <Image className="h-[84px] w-auto brightness-0 invert" src={logo} alt="Roggero & Roma" />
          </Link>

          {/* Desktop Nav */}
          <nav className="flex gap-14 text-white">
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

          {/* Right side */}
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
    </>
  );
};

export default Navbar;
