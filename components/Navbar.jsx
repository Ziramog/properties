'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaGoogle, FaFacebook, FaPhone, FaWhatsapp } from 'react-icons/fa';
import logo from '@/assets/images/logo.png';
import profileDefault from '@/assets/images/profile.png';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';
import UnreadMessageCount from './UnreadMessageCount';

const Navbar = () => {
  const { data: session } = useSession();
  const profileImage = session?.user?.image;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [providers, setProviders] = useState(null);

  const pathname = usePathname();

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };

    setAuthProviders();

    window.addEventListener('resize', () => {
      setIsMobileMenuOpen(false);
    });
  }, []);

  return (
    <nav className="bg-[#1A1A2E] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
            <button
              type="button"
              id="mobile-dropdown-button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-200 hover:bg-[#E94560] hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Abrir menú</span>
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            {/* Logo */}
            <Link className="flex flex-shrink-0 items-center" href="/">
              <Image className="h-10 w-auto" src={logo} alt="Roggero & Roma" />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:ml-8 md:block">
              <div className="flex space-x-2">
                <Link
                  href="/"
                  className={`${
                    pathname === '/' ? 'bg-[#E94560]' : ''
                  } text-white hover:bg-[#E94560] rounded-md px-3 py-2 text-sm font-medium transition-colors`}
                >
                  Inicio
                </Link>
                <Link
                  href="/properties"
                  className={`${
                    pathname === '/properties' ? 'bg-[#E94560]' : ''
                  } text-white hover:bg-[#E94560] rounded-md px-3 py-2 text-sm font-medium transition-colors`}
                >
                  Propiedades
                </Link>
                {session && (
                  <Link
                    href="/properties/add"
                    className={`${
                      pathname === '/properties/add' ? 'bg-[#E94560]' : ''
                    } text-white hover:bg-[#E94560] rounded-md px-3 py-2 text-sm font-medium transition-colors`}
                  >
                    Agregar Propiedad
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Phone & WhatsApp */}
          <div className="hidden md:flex items-center gap-4 mr-4">
            <a
              href="tel:+543547425454"
              className="text-white hover:text-[#E94560] flex items-center gap-2 text-sm"
            >
              <FaPhone className="text-[#E94560]" />
              (03547) 425454
            </a>
            <a
              href="https://wa.me/549113XXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white p-2 rounded-full hover:scale-110 transition-transform"
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="text-xl" />
            </a>
          </div>

          {/* Right Side Menu (Logged Out) */}
          {!session && (
            <div className="hidden md:block md:ml-6">
              <div className="flex items-center space-x-3">
                <a
                  href="https://facebook.com/roggeroyroma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#E94560]"
                >
                  <FaFacebook className="h-5 w-5" />
                </a>
                {providers &&
                  Object.values(providers).map((provider) => (
                    <button
                      key={provider.name}
                      onClick={() => signIn(provider.id)}
                      className="flex items-center text-white bg-[#E94560] hover:bg-[#d13d54] rounded-md px-3 py-2 text-sm font-medium transition-colors"
                    >
                      <FaGoogle className="text-white mr-2" />
                      Ingresar
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Right Side Menu (Logged In) */}
          {session && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0">
              <Link href="/messages" className="relative group">
                <button
                  type="button"
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5"></span>
                  <span className="sr-only">Ver notificaciones</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                    />
                  </svg>
                </button>
                <UnreadMessageCount />
              </Link>

              {/* Profile dropdown */}
              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                  >
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">Abrir menú de usuario</span>
                    <Image
                      className="h-8 w-8 rounded-full"
                      src={profileImage || profileDefault}
                      alt=""
                      width={40}
                      height={40}
                    />
                  </button>
                </div>

                {isProfileMenuOpen && (
                  <div
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                  >
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Tu Perfil
                    </Link>
                    <Link
                      href="/properties/saved"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Propiedades Guardadas
                    </Link>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link
              href="/"
              className={`${
                pathname === '/' ? 'bg-[#E94560]' : ''
              } text-white block rounded-md px-3 py-2 text-base font-medium`}
            >
              Inicio
            </Link>
            <Link
              href="/properties"
              className={`${
                pathname === '/properties' ? 'bg-[#E94560]' : ''
              } text-white block rounded-md px-3 py-2 text-base font-medium`}
            >
              Propiedades
            </Link>
            {session && (
              <Link
                href="/properties/add"
                className={`${
                  pathname === '/properties/add' ? 'bg-[#E94560]' : ''
                } text-white block rounded-md px-3 py-2 text-base font-medium`}
              >
                Agregar Propiedad
              </Link>
            )}

            {/* Mobile contact */}
            <div className="pt-4 pb-2 border-t border-gray-700 mt-4">
              <div className="flex items-center gap-4 px-3">
                <a
                  href="tel:+543547425454"
                  className="text-white text-sm flex items-center gap-2"
                >
                  <FaPhone className="text-[#E94560]" />
                  (03547) 425454
                </a>
                <a
                  href="https://wa.me/549113XXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white p-2 rounded-full"
                >
                  <FaWhatsapp className="text-lg" />
                </a>
              </div>
            </div>

            {!session && (
              <div className="mt-4 px-2">
                {providers &&
                  Object.values(providers).map((provider) => (
                    <button
                      key={provider.name}
                      onClick={() => signIn(provider.id)}
                      className="flex items-center w-full text-white bg-[#E94560] hover:bg-[#d13d54] rounded-md px-3 py-2 mb-2"
                    >
                      <FaGoogle className="text-white mr-2" />
                      Ingresar con Google
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
