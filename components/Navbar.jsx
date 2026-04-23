'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaPhone, FaWhatsapp, FaSearch } from 'react-icons/fa';
import { generateWhatsAppLink, PHONE_NUMBER, PHONE_DISPLAY } from '@/utils/whatsapp';
import logo from '@/assets/images/logo.png';
import { signIn, useSession, getProviders } from 'next-auth/react';
import PropertyFilters from './PropertyFilters';

const PROPERTY_TYPES = ['Todos', 'Casa', 'Departamento', 'Terreno', 'Campo', 'Inmueble Comercial', 'Gran Inversión'];
const CITIES = ['Ciudad', 'Alta Gracia', 'Anisacate', 'Despeñaderos', 'Falda del Carmen', 'Huerta Grande'];
const BEDROOM_OPTS = ['', '1', '2', '3', '4', '5'];

const Navbar = () => {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [providers, setProviders] = useState(null);
  const pathname = usePathname();
  const isProperties = pathname === '/properties';

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    setAuthProviders();
    window.addEventListener('resize', () => setIsMobileMenuOpen(false));
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Main navbar row */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 md:py-5 bg-black/10 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-between gap-4">
        {/* Logo */}
        <Link className="flex flex-shrink-0 items-center" href="/">
          <Image className="h-11 md:h-13 w-auto brightness-0 invert" src={logo} alt="Roggero & Roma" />
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-10 text-white text-base font-bold uppercase tracking-wider">
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
        <div className="flex items-center gap-4">
          <span className="text-white/60 text-sm hidden lg:block font-light tracking-widest">{PHONE_DISPLAY}</span>

          {!session && providers && Object.values(providers).map((provider) => (
            <button
              key={provider.name}
              onClick={() => signIn(provider.id)}
              className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-wider shadow-lg shadow-primary/20 transition-all"
            >
              Ingresar
            </button>
          ))}

          {session && (
            <Link href="/properties/add" className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-wider shadow-lg shadow-primary/20 transition-all">
              Agregar
            </Link>
          )}
        </div>
      </div>

      {/* Filters row — only on properties page */}
      {isProperties && (
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-3 bg-black/10 backdrop-blur-xl border-t border-white/10">
          <form className="flex items-center gap-3">
            <select name="type" className="bg-black/20 border border-white/10 text-white text-sm py-2.5 px-4 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/30 outline-none appearance-none cursor-pointer flex-1 min-w-[120px]">
              {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select name="city" className="bg-black/20 border border-white/10 text-white text-sm py-2.5 px-4 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/30 outline-none appearance-none cursor-pointer flex-1 min-w-[120px]">
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="number" name="maxPrice" placeholder="Precio máx USD" className="bg-black/20 border border-white/10 text-white text-sm py-2.5 px-4 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/30 outline-none placeholder:text-white/40 flex-1 min-w-[120px]" />
            <select name="bedrooms" className="bg-black/20 border border-white/10 text-white text-sm py-2.5 px-4 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/30 outline-none appearance-none cursor-pointer flex-1 min-w-[100px]">
              <option value="">Dormitorios</option>
              {BEDROOM_OPTS.filter(o => o).map((o) => <option key={o} value={o}>{o}+</option>)}
            </select>
            <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold py-2.5 px-6 rounded-xl text-sm uppercase tracking-wider flex items-center gap-2 transition-all shadow-md">
              <FaSearch className="w-4 h-4" />
              <span className="hidden sm:inline">Buscar</span>
            </button>
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mx-4 mt-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-3">
          <Link href="/" className="block text-white/90 text-sm font-medium py-2 px-3 rounded-lg hover:bg-white/10">Inicio</Link>
          <Link href="/properties" className="block text-white/90 text-sm font-medium py-2 px-3 rounded-lg hover:bg-white/10">Propiedades</Link>
          <Link href="/contact" className="block text-white/90 text-sm font-medium py-2 px-3 rounded-lg hover:bg-white/10">Contacto</Link>
          <div className="pt-3 border-t border-white/10 flex items-center gap-4">
            <a href={`tel:${PHONE_NUMBER}`} className="text-white/60 text-sm flex items-center gap-2"><FaPhone className="text-xs" />{PHONE_DISPLAY}</a>
            <a href={generateWhatsAppLink({ context: 'general' })} target="_blank" rel="noopener noreferrer" className="bg-whatsapp text-white p-2 rounded-lg"><FaWhatsapp /></a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
