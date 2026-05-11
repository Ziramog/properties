'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaWhatsapp } from 'react-icons/fa';
import { generateWhatsAppLink, PHONE_NUMBER, PHONE_DISPLAY } from '@/utils/whatsapp';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';

const EMAIL = 'info@roggeroyroma.com.ar';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { data: session } = useSession();
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  return (
    <footer className="text-white" style={{ background: '#110b11' }}>
      {/* Desktop */}
      <div className="hidden md:block">
        <div className="max-w-[1430px] mx-auto px-4 py-[35px]">
          {/* Top — 2-column */}
          <div className="flex justify-between flex-wrap">
            {/* Left: Logo + Address + Contact */}
            <div className="flex flex-col gap-1">
              <Link href="/" className="inline-block mb-10">
                <Image
                  src="/images/LOGO R&R 2023.png"
                  alt="Roggero & Roma"
                  width={200}
                  height={100}
                  style={{ height: '100px', width: 'auto' }}
                  className="brightness-0 invert"
                />
              </Link>
              <ul>
                <li className="text-[13px] text-white/70 font-light py-[5px] block">Alta Gracia</li>
                <li className="text-[13px] text-white/70 font-light py-[5px] block">Córdoba, Argentina</li>
              </ul>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-[5px] text-[13px] text-white font-light py-[5px] hover:text-white/70 transition-colors">
                <img src="/senada/images/icons/ico_mail.svg" alt="email" className="w-[17px] h-[17px]" style={{ filter: 'brightness(0) invert(1)' }} />
                {EMAIL}
              </a>
              <a href={`tel:${PHONE_NUMBER}`} className="flex items-center gap-[5px] text-[13px] text-white font-light py-[5px] hover:text-white/70 transition-colors">
                <img src="/senada/images/icons/ico_phone.svg" alt="phone" className="w-[17px] h-[17px]" style={{ filter: 'brightness(0) invert(1)' }} />
                {PHONE_DISPLAY}
              </a>
            </div>

            {/* Right: Nav + Newsletter */}
            <div className="flex">
              {/* Footer nav — 3 columns */}
              <nav className="pr-[35px] md:pr-[75px]">
                <ul className="flex gap-[50px] md:gap-[100px]">
                  {/* PROPIEDADES */}
                  <li>
                    <span className="block text-[15px] text-white uppercase font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                      Propiedades
                    </span>
                    <ul>
                      {[
                        { href: '/properties?type=Casa', label: 'Casas' },
                        { href: '/properties?type=Departamento', label: 'Departamentos' },
                        { href: '/properties?type=Campo', label: 'Campos' },
                        { href: '/properties?type=Terreno', label: 'Terrenos' },
                      ].map(l => (
                        <li key={l.href}>
                          <Link href={l.href} className="block text-[13px] text-white/70 font-light py-[5px] pr-[10px] hover:text-white transition-colors">
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  {/* EMPRESA */}
                  <li>
                    <span className="block text-[15px] text-white uppercase font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                      Empresa
                    </span>
                    <ul>
                      {[
                        { href: '/#nuestra-historia', label: 'Nuestra Historia' },
                        { href: '/contact', label: 'Contacto' },
                      ].map(l => (
                        <li key={l.href}>
                          <Link href={l.href} className="block text-[13px] text-white/70 font-light py-[5px] pr-[10px] hover:text-white transition-colors">
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  {/* LISTADO PREMIUM */}
                  <li>
                    <span className="block text-[15px] text-white uppercase font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                      Listado Premium
                    </span>
                    <ul>
                      <li>
                        <Link href="/#propiedades-destacadas" className="block text-[13px] text-white/70 font-light py-[5px] pr-[10px] hover:text-white transition-colors">
                          Propiedades Destacadas
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </nav>

              {/* Newsletter */}
              <div className="newsletter">
                <h3 className="text-[15px] text-white uppercase font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  Newsletter
                </h3>
                <form className="pt-[30px]">
                  <div className="relative mb-3">
                    <img src="/senada/images/icons/ico_newsletter_email.svg" alt="" className="absolute left-[15px] top-1/2 -translate-y-1/2 w-[25px] h-[20px]" style={{ filter: 'brightness(0) invert(1)' }} />
                    <input
                      type="email"
                      placeholder="Tu email"
                      className="w-[285px] h-[40px] bg-white/[0.06] border-none rounded-[5px] text-white font-bold text-[14px] pl-[50px] pr-4 outline-none placeholder:text-white/30"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white font-bold text-sm uppercase tracking-wider rounded-[5px] h-[40px] px-6 transition-all"
                  >
                    Suscribir
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Bottom — Border top + Copyright + Social + Wolfim */}
          <div className="flex items-center justify-between mt-[35px] pt-[35px] md:mt-[50px] md:pt-[50px] border-t-2 border-white/[0.1]">
            <p className="text-white text-[14px] uppercase font-bold">
              &copy; {currentYear} Roggero & Roma <sup>TM</sup>
            </p>
            {!session && providers && Object.values(providers).map((provider) => (
              <button key={provider.id} onClick={() => signIn(provider.id)} className="text-white/30 text-[13px] uppercase font-bold hover:text-white/60 transition-colors">
                Ingresar
              </button>
            ))}
            {session && (
              <button onClick={() => signOut()} className="text-white/30 text-[13px] uppercase font-bold hover:text-white/60 transition-colors">
                Salir
              </button>
            )}
            <ul className="flex items-center gap-[25px]">
              <li>
                <a href={`mailto:${EMAIL}`} className="flex items-center justify-center w-[40px] h-[40px] rounded-[9px] bg-white/[0.15] hover:bg-[var(--color-brand)] transition-all duration-300" aria-label="Email">
                  <img src="/senada/images/icons/ico_mail.svg" alt="email" className="w-[20px] h-[20px]" style={{ filter: 'brightness(0)' }} />
                </a>
              </li>
              <li>
                <a href={generateWhatsAppLink({ context: 'general' })} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-[40px] h-[40px] rounded-[9px] bg-white/[0.15] hover:bg-[var(--color-brand)] transition-all duration-300" aria-label="WhatsApp">
                  <FaWhatsapp className="text-xl" />
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/roggeroyroma" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-[40px] h-[40px] rounded-[9px] bg-white/[0.15] hover:bg-[var(--color-brand)] transition-all duration-300" aria-label="Facebook">
                  <img src="/senada/images/icons/ico_facebook.svg" alt="facebook" className="w-[20px] h-[20px]" style={{ filter: 'brightness(0) invert(1)' }} />
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/roggeroyroma" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-[40px] h-[40px] rounded-[9px] bg-white/[0.15] hover:bg-[var(--color-brand)] transition-all duration-300" aria-label="Instagram">
                  <img src="/senada/images/icons/ico_instagram.svg" alt="instagram" className="w-[20px] h-[20px]" style={{ filter: 'brightness(0) invert(1)' }} />
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/roggeroyroma" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-[40px] h-[40px] rounded-[9px] bg-white/[0.15] hover:bg-[var(--color-brand)] transition-all duration-300" aria-label="LinkedIn">
                  <img src="/senada/images/icons/ico_linked.svg" alt="linkedin" className="w-[20px] h-[20px]" style={{ filter: 'brightness(0) invert(1)' }} />
                </a>
              </li>
            </ul>
            <p className="text-white/50 text-[14px] uppercase font-bold">
              Powered by{' '}
              <a href="https://wolfimstudio.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white transition-colors">
                <Image
                  src="/images/wolfim studio white-Photoroom.png"
                  alt="Wolfim Studio"
                  width={80}
                  height={30}
                  style={{ height: '22px', width: 'auto' }}
                  className="opacity-50 hover:opacity-80 transition-opacity"
                />
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile — matches desktop structure, stacked */}
      <div className="block md:hidden">
        <div className="px-5 py-8">
          {/* Logo + Company info */}
          <div className="flex flex-col gap-2 mb-8">
            <Link href="/" className="inline-block">
              <Image
                src="/images/LOGO R&R 2023.png"
                alt="Roggero & Roma"
                width={200}
                height={100}
                style={{ height: '55px', width: 'auto' }}
                className="brightness-0 invert"
              />
            </Link>
            <p className="text-[13px] text-white/60 font-light mt-3">Alta Gracia</p>
            <p className="text-[13px] text-white/60 font-light">Córdoba, Argentina</p>
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 text-[13px] text-white font-light">
              <img src="/senada/images/icons/ico_mail.svg" alt="email" className="w-[17px] h-[17px]" style={{ filter: 'brightness(0) invert(1)' }} />
              {EMAIL}
            </a>
            <a href={`tel:${PHONE_NUMBER}`} className="flex items-center gap-2 text-[13px] text-white font-light">
              <img src="/senada/images/icons/ico_phone.svg" alt="phone" className="w-[17px] h-[17px]" style={{ filter: 'brightness(0) invert(1)' }} />
              {PHONE_DISPLAY}
            </a>
          </div>

          {/* Nav columns — stacked with headings */}
          <div className="flex flex-col gap-6 mb-8">
            {/* Propiedades */}
            <div>
              <span className="block text-[15px] text-white uppercase font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Propiedades</span>
              <div className="grid grid-cols-2 gap-y-1">
                {[
                  { href: '/properties?type=Casa', label: 'Casas' },
                  { href: '/properties?type=Departamento', label: 'Departamentos' },
                  { href: '/properties?type=Campo', label: 'Campos' },
                  { href: '/properties?type=Terreno', label: 'Terrenos' },
                ].map(l => (
                  <Link key={l.href} href={l.href} className="text-[13px] text-white/60 font-light py-[3px] hover:text-white transition-colors">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
            {/* Empresa */}
            <div>
              <span className="block text-[15px] text-white uppercase font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Empresa</span>
              <div className="grid grid-cols-2 gap-y-1">
                {[
                  { href: '/#nuestra-historia', label: 'Nuestra Historia' },
                  { href: '/contact', label: 'Contacto' },
                ].map(l => (
                  <Link key={l.href} href={l.href} className="text-[13px] text-white/60 font-light py-[3px] hover:text-white transition-colors">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
            {/* Listado Premium */}
            <div>
              <span className="block text-[15px] text-white uppercase font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Listado Premium</span>
              <Link href="/#propiedades-destacadas" className="text-[13px] text-white/60 font-light py-[3px] hover:text-white transition-colors">
                Propiedades Destacadas
              </Link>
            </div>
            {/* Newsletter */}
            <div>
              <span className="block text-[15px] text-white uppercase font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Newsletter</span>
              <form>
                <div className="relative mb-3">
                  <img src="/senada/images/icons/ico_newsletter_email.svg" alt="" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-4" style={{ filter: 'brightness(0) invert(1)' }} />
                  <input
                    type="email"
                    placeholder="Tu email"
                    className="w-full h-10 bg-white/[0.06] border-none rounded-[5px] text-white font-bold text-[14px] pl-[50px] pr-4 outline-none placeholder:text-white/30"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white font-bold text-sm uppercase tracking-wider rounded-[5px] h-10 px-6 transition-all w-full"
                >
                  Suscribir
                </button>
              </form>
            </div>
          </div>

          {/* Copyright + Social + Powered by */}
          <div className="border-t border-white/[0.08] pt-6 flex flex-col items-center gap-4">
            <p className="text-[14px] text-white uppercase font-bold mb-2">
              &copy; {currentYear} Roggero & Roma <sup>TM</sup>
            </p>
            {!session && providers && Object.values(providers).map((provider) => (
              <button key={provider.id} onClick={() => signIn(provider.id)} className="text-white/30 text-[13px] uppercase font-bold hover:text-white/60 transition-colors">
                Ingresar
              </button>
            ))}
            {session && (
              <button onClick={() => signOut()} className="text-white/30 text-[13px] uppercase font-bold hover:text-white/60 transition-colors">
                Salir
              </button>
            )}
            <ul className="flex items-center gap-[25px]">
              <li>
                <a href={`mailto:${EMAIL}`} className="flex items-center justify-center w-[40px] h-[40px] rounded-[9px] bg-white/[0.15] hover:bg-[var(--color-brand)] transition-all duration-300" aria-label="Email">
                  <img src="/senada/images/icons/ico_mail.svg" alt="email" className="w-5 h-5" style={{ filter: 'brightness(0)' }} />
                </a>
              </li>
              <li>
                <a href={generateWhatsAppLink({ context: 'general' })} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-[40px] h-[40px] rounded-[9px] bg-white/[0.15] hover:bg-[var(--color-brand)] transition-all duration-300" aria-label="WhatsApp">
                  <FaWhatsapp className="text-xl" />
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/roggeroyroma" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-[40px] h-[40px] rounded-[9px] bg-white/[0.15] hover:bg-[var(--color-brand)] transition-all duration-300" aria-label="Facebook">
                  <img src="/senada/images/icons/ico_facebook.svg" alt="facebook" className="w-5 h-5" style={{ filter: 'brightness(0) invert(1)' }} />
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/roggeroyroma" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-[40px] h-[40px] rounded-[9px] bg-white/[0.15] hover:bg-[var(--color-brand)] transition-all duration-300" aria-label="Instagram">
                  <img src="/senada/images/icons/ico_instagram.svg" alt="instagram" className="w-5 h-5" style={{ filter: 'brightness(0) invert(1)' }} />
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/roggeroyroma" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-[40px] h-[40px] rounded-[9px] bg-white/[0.15] hover:bg-[var(--color-brand)] transition-all duration-300" aria-label="LinkedIn">
                  <img src="/senada/images/icons/ico_linked.svg" alt="linkedin" className="w-5 h-5" style={{ filter: 'brightness(0) invert(1)' }} />
                </a>
              </li>
            </ul>
            <p className="text-[14px] text-white/40">
              Powered by{' '}
              <a href="https://wolfimstudio.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors">
                <Image
                  src="/images/wolfim studio white-Photoroom.png"
                  alt="Wolfim Studio"
                  width={80}
                  height={22}
                  style={{ height: '18px', width: 'auto' }}
                  className="opacity-60 inline-block align-middle"
                />
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
