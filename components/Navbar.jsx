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
  const pathname = usePathname();

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    setAuthProviders();
    window.addEventListener('resize', () => setIsMobileMenuOpen(false));
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-2 md:p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-3 md:px-12 py-5 md:py-6 bg-black/10 backdrop-blur-xl border border-white/10 md:rounded-full shadow-2xl">
        {/* Logo */}
        <Link className="flex flex-shrink-0 items-center" href="/">
          <Image className="h-12 md:h-14 w-auto brightness-0 invert" src={logo} alt="Roggero & Roma" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-12 lg:gap-14 text-white text-base md:text-lg font-bold uppercase tracking-wider">
          <Link href="/" className={`${pathname === '/' ? 'text-primary' : 'text-white/90'} hover:text-primary transition-colors`}>
            Inicio
          </Link>
          <Link href="/properties" className={`${pathname === '/properties' ? 'text-primary' : 'text-white/90'} hover:text-primary transition-colors`}>
            Propiedades
          </Link>
          <Link href="/contact" className={`${pathname === '/contact' ? 'text-primary' : 'text-white/90'} hover:text-primary transition-colors`}>
            Contacto
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-5">
          <span className="text-white/60 text-sm md:text-base hidden lg:block font-light tracking-widest">
            {PHONE_DISPLAY}
          </span>

          {!session && providers && Object.values(providers).map((provider) => (
            <button
              key={provider.name}
              onClick={() => signIn(provider.id)}
              className="bg-primary hover:bg-primary-hover text-white px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-sm md:text-base transition-all uppercase tracking-wider shadow-lg shadow-primary/20"
            >
              Ingresar
            </button>
          ))}

          {session && (
            <Link
              href="/properties/add"
              className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full font-bold text-sm transition-all uppercase tracking-wider shadow-lg shadow-primary/20"
            >
              Agregar
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 mx-4">
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
        </div>
      )}
    </header>
  );
};

export default Navbar;
