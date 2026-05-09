'use client';
import Link from 'next/link';
import Image from 'next/image';
import { FaWhatsapp } from 'react-icons/fa';
import logo from '@/assets/images/logo.png';
import { generateWhatsAppLink, PHONE_NUMBER, PHONE_DISPLAY } from '@/utils/whatsapp';

const EMAIL = 'info@roggeroyroma.com.ar';

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
                  src={logo}
                  alt="Roggero & Roma"
                  style={{ height: '65px', width: 'auto' }}
                  className="brightness-0 invert"
                />
              </Link>
              <h2 className="text-[15px] text-white uppercase font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                Roggero & Roma
              </h2>
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
                  <div className="relative">
                    <img src="/senada/images/icons/ico_newsletter_email.svg" alt="" className="absolute left-[15px] top-1/2 -translate-y-1/2 w-[25px] h-[20px]" style={{ filter: 'brightness(0) invert(1)' }} />
                    <input
                      type="email"
                      placeholder="Tu email"
                      className="w-[285px] h-[40px] bg-white/[0.06] border-none rounded-[5px] text-white font-bold text-[14px] pl-[50px] pr-4 outline-none placeholder:text-white/30"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Bottom — Border top + Copyright + Social + Wolfim */}
          <div className="flex items-center justify-between mt-[35px] pt-[35px] md:mt-[50px] md:pt-[50px] border-t-2 border-white/[0.1]">
            <p className="text-white text-[14px] uppercase font-bold">
              &copy; {currentYear} Roggero & Roma
            </p>
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
            <Image
              src="/images/wolfim studio white-Photoroom.png"
              alt="Wolfim Studio"
              width={80}
              height={30}
              style={{ height: '30px', width: 'auto' }}
              className="opacity-50 hover:opacity-80 transition-opacity"
            />
          </div>
        </div>
      </div>

      {/* Mobile — simplified Senada layout */}
      <div className="block md:hidden">
        <div className="px-5 py-8">
          {/* Logo */}
          <Link href="/" className="inline-block mb-6">
            <Image
              src={logo}
              alt="Roggero & Roma"
              style={{ height: '28px', width: 'auto' }}
              className="brightness-0 invert"
            />
          </Link>

          {/* Links — 2 columns */}
          <div className="grid grid-cols-2 gap-y-1 gap-x-6 mb-6">
            {[
              { href: '/#propiedades-destacadas', label: 'Listado Premium' },
              { href: '/properties?type=Casa', label: 'Casas' },
              { href: '/properties?type=Departamento', label: 'Departamentos' },
              { href: '/properties?type=Campo', label: 'Campos' },
              { href: '/properties?type=Terreno', label: 'Terrenos' },
              { href: '/properties', label: 'Propiedades' },
              { href: '/#nuestra-historia', label: 'Nuestra Historia' },
              { href: '/contact', label: 'Contacto' },
            ].map(l => (
              <Link key={l.href + l.label} href={l.href} className="text-[13px] text-white/60 font-light py-[3px] leading-[2.2] hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Contact icons + phone */}
          <div className="flex items-center gap-[10px] mb-6">
            <a href={generateWhatsAppLink({ context: 'general' })} target="_blank" rel="noopener noreferrer"
              className="w-[36px] h-[36px] bg-[#25D366] rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110">
              <FaWhatsapp className="text-white text-[18px]" />
            </a>
            <a href={`mailto:${EMAIL}`}
              className="w-[36px] h-[36px] bg-white/[0.10] rounded-full flex items-center justify-center transition-all duration-200 hover:bg-[var(--color-brand)]">
              <img src="/senada/images/icons/ico_mail.svg" alt="email" className="w-4 h-4" style={{ filter: 'brightness(0) invert(1)' }} />
            </a>
            <a href={`tel:${PHONE_NUMBER}`}
              className="w-[36px] h-[36px] bg-white/[0.10] rounded-full flex items-center justify-center transition-all duration-200 hover:bg-[var(--color-brand)]">
              <img src="/senada/images/icons/ico_phone.svg" alt="phone" className="w-4 h-4" style={{ filter: 'brightness(0) invert(1)' }} />
            </a>
            <span className="text-[13px] text-white/60 ml-1">{PHONE_DISPLAY}</span>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/[0.08] pt-4 text-[11px] text-white/40 text-center">
            &copy; {currentYear} Roggero & Roma. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
