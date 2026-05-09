'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaWhatsapp } from 'react-icons/fa';
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
  const [desktopDropdown, setDesktopDropdown] = useState(null);
  const dropdownTimeout = useRef(null);
  const pathname = usePathname();

  const openDropdown = (name) => {
    clearTimeout(dropdownTimeout.current);
    setDesktopDropdown(name);
  };
  const closeDropdown = () => {
    dropdownTimeout.current = setTimeout(() => setDesktopDropdown(null), 200);
  };

  const isHeroPage = pathname === '/';
  const isGlassMode = !isHeroPage || isScrolled || isMobileMenuOpen;

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

  useEffect(() => {
    if (!desktopDropdown) return;
    const close = (e) => {
      if (!e.target.closest('.desktop-dropdown')) setDesktopDropdown(null);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [desktopDropdown]);

  return (
    <>
      {/* Desktop Nav — Senada-style */}
      <header
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isGlassMode ? 'bg-black shadow-lg shadow-black/20' : 'bg-transparent'
        }`}
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 8px) + 15px)', paddingBottom: '15px' }}
      >
        <div className="max-w-[1820px] mx-auto flex items-center px-[70px] h-full">
          {/* Logo */}
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

          {/* Main Nav — Senada .mainMenu */}
          <nav className="desktop-dropdown flex items-center gap-8 lg:gap-10 ml-auto">
            <Link href="/#propiedades-destacadas" className="text-white hover:text-[var(--color-brand)] transition-colors text-[15px] font-normal tracking-[0.02em] uppercase">
              Listado Premium
            </Link>

            {/* Propiedades dropdown — Senada .dropdown */}
            <div className="relative" onMouseEnter={() => openDropdown('props')} onMouseLeave={closeDropdown}>
              <button className="flex items-center gap-1 text-white hover:text-[var(--color-brand)] transition-colors text-[15px] font-normal tracking-[0.02em] uppercase">
                Propiedades
                <svg className={`w-3 h-3 transition-transform ${desktopDropdown === 'props' ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              </button>
              {desktopDropdown === 'props' && (
                <ul className="absolute top-full left-0 mt-2 bg-[#222] border border-white/10 rounded-md py-2 min-w-[200px] shadow-xl z-50">
                  {[
                    { label: 'Casas', query: 'type=Casa' },
                    { label: 'Departamentos', query: 'type=Departamento' },
                    { label: 'Campos', query: 'type=Campo' },
                    { label: 'Inmuebles Comerciales', query: 'type=Inmueble+Comercial' },
                    { label: 'Terrenos', query: 'type=Terreno' },
                    { label: 'Todas las propiedades', query: '' },
                  ].map(item => (
                    <li key={item.label}>
                      <Link href={`/properties${item.query ? `?${item.query}` : ''}`} className="block px-5 py-2.5 text-[13px] text-white/70 hover:text-white hover:bg-white/5 transition-colors font-normal">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Link href="/#nuestra-historia" className="text-white hover:text-[var(--color-brand)] transition-colors text-[15px] font-normal tracking-[0.02em] uppercase">
              Roggero&Roma Historia
            </Link>
          </nav>

          {/* Side Nav — Senada .sideMenu: Phone | Search | Show More */}
          <div className="desktop-dropdown flex items-center gap-4 ml-8">
            {/* Phone */}
            <a href={`tel:${PHONE_NUMBER}`} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors" aria-label="Llamar">
              <img src="/senada/images/icons/ico_phone.svg" alt="Teléfono" className="w-5 h-5" style={{ filter: 'brightness(0) invert(1)' }} />
            </a>
            {/* Search */}
            <Link href="/properties" className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors" aria-label="Buscar">
              <img src="/senada/images/icons/ico_search.svg" alt="Buscar" className="w-5 h-5" style={{ filter: 'brightness(0) invert(1)' }} />
            </Link>
            {/* Show More / Hamburger */}
            <div className="relative" onMouseEnter={() => openDropdown('more')} onMouseLeave={closeDropdown}>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors" aria-label="Más">
                <span className="space-y-1 flex flex-col items-center">
                  <span className="block w-[18px] h-[2px] bg-white rounded-sm"></span>
                  <span className="block w-[18px] h-[2px] bg-white rounded-sm"></span>
                  <span className="block w-[18px] h-[2px] bg-white rounded-sm"></span>
                </span>
              </button>
              {desktopDropdown === 'more' && (
                <ul className="absolute top-full right-0 mt-2 bg-[#222] border border-white/10 rounded-md py-2 min-w-[180px] shadow-xl z-50">
                  <li><Link href="/" className="block px-5 py-2.5 text-[13px] text-white/70 hover:text-white hover:bg-white/5 transition-colors font-normal">Inicio</Link></li>
                  <li><Link href="/contact" className="block px-5 py-2.5 text-[13px] text-white/70 hover:text-white hover:bg-white/5 transition-colors font-normal">Contacto</Link></li>
                  {!session && providers && Object.values(providers).map((provider) => (
                    <li key={provider.id}>
                      <button onClick={() => signIn(provider.id)} className="block w-full text-left px-5 py-2.5 text-[13px] text-white/70 hover:text-white hover:bg-white/5 transition-colors font-normal">Ingresar</button>
                    </li>
                  ))}
                  {session && (
                    <>
                      {session.user?.role === 'admin' && (
                        <li><Link href="/properties/add" className="block px-5 py-2.5 text-[13px] text-white/70 hover:text-white hover:bg-white/5 transition-colors font-normal">Agregar Propiedad</Link></li>
                      )}
                      <li><Link href="/profile" className="block px-5 py-2.5 text-[13px] text-white/70 hover:text-white hover:bg-white/5 transition-colors font-normal">Perfil</Link></li>
                      <li><button onClick={() => signOut()} className="block w-full text-left px-5 py-2.5 text-[13px] text-white/70 hover:text-white hover:bg-white/5 transition-colors font-normal">Salir</button></li>
                    </>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <div
        className={`md:hidden fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
          isGlassMode ? 'bg-black' : 'bg-transparent'
        }`}
        style={{ height: 'calc(env(safe-area-inset-top, 8px) + 60px)' }}
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

          {/* Search icon — 20px left of hamburger */}
          <div className="flex items-center gap-5">
            <Link href="/properties" className="w-8 h-8 flex items-center justify-center">
              <img src="/senada/images/icons/ico_search.svg" alt="Buscar" className="w-6 h-6" style={{ filter: 'brightness(0) invert(1)' }} />
            </Link>

            {/* Hamburger / Close — senada style */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`rButton w-8 h-8 flex items-center justify-center ${isMobileMenuOpen ? 'active' : ''}`}
              aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              <div className="hamburger">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </div>

        {/* Fullscreen Overlay — senada style: rOptions */}
        <div
          className="rOptions absolute inset-x-0 z-[999] flex flex-col bg-black"
          style={{
            top: 'calc(env(safe-area-inset-top, 8px) + 60px)',
            height: 'calc(var(--vh, 1vh) * 100 - env(safe-area-inset-top, 8px) - 60px)',
            padding: '80px 12px 20px',
            overflowY: 'auto',
            transformOrigin: 'top',
            transform: isMobileMenuOpen ? 'scaleY(1)' : 'scaleY(0)',
            opacity: isMobileMenuOpen ? 1 : 0,
            transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease',
            pointerEvents: isMobileMenuOpen ? 'auto' : 'none',
          }}>
          {/* Nav links */}
          <nav className="flex-1 flex flex-col justify-center px-8">
            <Link href="/" className="flex items-center justify-between text-white text-[28px] font-normal py-4 border-b border-white/10" style={{ fontFamily: 'var(--font-heading)' }} onClick={() => setIsMobileMenuOpen(false)}>
              Inicio
              <img src="/senada/images/icons/ico_chevron-right.svg" alt="" className="w-5 h-5 opacity-50" style={{ filter: 'brightness(0) invert(1)' }} />
            </Link>
            <Link href="/properties" className="flex items-center justify-between text-white text-[28px] font-normal py-4 border-b border-white/10" style={{ fontFamily: 'var(--font-heading)' }} onClick={() => setIsMobileMenuOpen(false)}>
              Propiedades
              <img src="/senada/images/icons/ico_chevron-right.svg" alt="" className="w-5 h-5 opacity-50" style={{ filter: 'brightness(0) invert(1)' }} />
            </Link>
            <Link href="/contact" className="flex items-center justify-between text-white text-[28px] font-normal py-4 border-b border-white/10" style={{ fontFamily: 'var(--font-heading)' }} onClick={() => setIsMobileMenuOpen(false)}>
              Contacto
              <img src="/senada/images/icons/ico_chevron-right.svg" alt="" className="w-5 h-5 opacity-50" style={{ filter: 'brightness(0) invert(1)' }} />
            </Link>
            {session && (
              <Link href="/profile" className="flex items-center justify-between text-white text-[28px] font-normal py-4 border-b border-white/10" style={{ fontFamily: 'var(--font-heading)' }} onClick={() => setIsMobileMenuOpen(false)}>
                Perfil
                <img src="/senada/images/icons/ico_chevron-right.svg" alt="" className="w-5 h-5 opacity-50" style={{ filter: 'brightness(0) invert(1)' }} />
              </Link>
            )}
          </nav>

          {/* Bottom: phone, email, icons — using senada SVG icons */}
          <div className="flex-shrink-0 px-8 pt-6 pb-10 border-t border-white/10" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 16px) + 16px)' }}>
            <div className="flex flex-col gap-4 mb-6">
              <a href={`tel:${PHONE_NUMBER}`} className="flex items-center gap-4 text-white text-[16px]">
                <img src="/senada/images/icons/ico_phone.svg" alt="phone" className="w-6 h-6" style={{ filter: 'brightness(0) invert(1)' }} />
                {PHONE_DISPLAY}
              </a>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-4 text-white text-[16px]">
                <img src="/senada/images/icons/ico_mail.svg" alt="email" className="w-6 h-6" style={{ filter: 'brightness(0) invert(1)' }} />
                {EMAIL}
              </a>
            </div>
            <div className="flex items-center gap-5">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-white"><FaWhatsapp size={24} /></a>
              <a href="https://www.instagram.com/roggeroyroma" target="_blank" rel="noopener noreferrer" className="text-white"><img src="/senada/images/icons/ico_instagram.svg" alt="instagram" className="w-6 h-6" /></a>
              <a href="https://www.facebook.com/roggeroyroma" target="_blank" rel="noopener noreferrer" className="text-white"><img src="/senada/images/icons/ico_facebook.svg" alt="facebook" className="w-6 h-6" /></a>
              <a href="https://www.linkedin.com/company/roggeroyroma" target="_blank" rel="noopener noreferrer" className="text-white"><img src="/senada/images/icons/ico_linked.svg" alt="linkedin" className="w-6 h-6" /></a>
            </div>
          </div>
        </div>
      </div>
    {/* CSS for hamburger animation — senada style */}
      <style jsx>{`
        .rButton .hamburger span {
          display: block;
          width: 25px;
          height: 3px;
          background: #fff;
          border-radius: 3px;
          margin: 5px 0;
          position: relative;
          transition: all 0.3s ease;
        }
        .rButton.active .hamburger span:nth-child(1) {
          top: 8px;
          transform: rotate(135deg);
        }
        .rButton.active .hamburger span:nth-child(2) {
          opacity: 0;
          transform: translateX(-30px);
        }
        .rButton.active .hamburger span:nth-child(3) {
          width: 25px;
          margin: unset;
          top: -8px;
          transform: rotate(-135deg);
        }
        .rButton.active .hamburger span:nth-child(2) {
          opacity: 0;
          transform: translateX(-30px);
        }
        .rButton.active .hamburger span:nth-child(3) {
          width: 25px;
          margin: unset;
          top: -8px;
          transform: rotate(-135deg);
        }
        .rOptions {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 999;
          background: #000;
          width: 100%;
          height: calc(var(--vh, 1vh) * 100);
          padding: 80px 12px 20px;
          overflow-y: auto;
          transform: translateY(-100%);
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
          display: flex;
          flex-direction: column;
        }
        .rOptions.menu-open {
          transform: translateY(0);
          display: flex;
        }
        /* Desktop dropdown animation — Senada .top_level */
        .desktop-dropdown ul {
          animation: dropdownFade 0.2s ease-out;
        }
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default Navbar;
