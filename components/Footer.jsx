import Link from 'next/link';
import Image from 'next/image';
import { FaWhatsapp } from 'react-icons/fa';
import logo from '@/assets/images/logo.png';
import { generateWhatsAppLink, PHONE_NUMBER, PHONE_DISPLAY } from '@/utils/whatsapp';
import '@/footer.css';

const EMAIL = 'info@roggeroyroma.com.ar';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  /* All links flattened for the mobile 2-col grid */
  const mobileLinks = [
    { href: '/properties?type=Casa', label: 'Casas' },
    { href: '/properties?type=Departamento', label: 'Departamentos' },
    { href: '/properties?type=Terreno', label: 'Terrenos' },
    { href: '/properties?type=Campo', label: 'Campos' },
    { href: '/properties', label: 'Propiedades' },
    { href: '/properties?type=Inmueble+Comercial', label: 'Propiedades Comerciales' },
    { href: '/contact', label: 'Contacto' },
  ];

  return (
    <footer className="text-white" style={{ background: '#110b11' }}>
      {/* ============================================
          DESKTOP FOOTER — visible md+ (≥768px)
          ============================================ */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="inline-block mb-4">
                <Image src={logo} alt="Roggero & Roma" width={130} height={40} className="h-auto brightness-0 invert" />
              </Link>
              <p className="text-white/55 text-sm leading-relaxed max-w-xs">
                Más de 10 años de experiencia en el mercado inmobiliario de Córdoba.
              </p>
            </div>

            {/* Properties */}
            <div>
              <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider mb-4">Propiedades</h3>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/properties?type=Casa" className="text-white/55 hover:text-white transition-colors">Casas</Link></li>
                <li><Link href="/properties?type=Departamento" className="text-white/55 hover:text-white transition-colors">Departamentos</Link></li>
                <li><Link href="/properties?type=Terreno" className="text-white/55 hover:text-white transition-colors">Terrenos</Link></li>
                <li><Link href="/properties?type=Campo" className="text-white/55 hover:text-white transition-colors">Campos</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider mb-4">Empresa</h3>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/properties" className="text-white/55 hover:text-white transition-colors">Propiedades</Link></li>
                <li><Link href="/properties?type=Inmueble+Comercial" className="text-white/55 hover:text-white transition-colors">Propiedades Comerciales</Link></li>
                <li><Link href="/contact" className="text-white/55 hover:text-white transition-colors">Contacto</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider mb-4">Contacto</h3>
              <div className="flex flex-wrap gap-3 mb-4">
                <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors">
                  <img src="/senada/images/icons/ico_mail.svg" alt="email" className="w-[17px] h-[17px]" style={{ filter: 'brightness(0) invert(1)' }} />
                  {EMAIL}
                </a>
                <a href={`tel:${PHONE_NUMBER}`} className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors">
                  <img src="/senada/images/icons/ico_phone.svg" alt="phone" className="w-[17px] h-[17px]" style={{ filter: 'brightness(0) invert(1)' }} />
                  {PHONE_DISPLAY}
                </a>
              </div>
              <div className="flex items-center gap-4">
                <a href={generateWhatsAppLink({ context: 'general' })} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors" aria-label="WhatsApp">
                  <FaWhatsapp className="text-xl" />
                </a>
                <a href="https://www.facebook.com/roggeroyroma" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors" aria-label="Facebook">
                  <img src="/senada/images/icons/ico_facebook.svg" alt="facebook" className="w-[20px] h-[20px]" />
                </a>
                <a href="https://www.instagram.com/roggeroyroma" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors" aria-label="Instagram">
                  <img src="/senada/images/icons/ico_instagram.svg" alt="instagram" className="w-[20px] h-[20px]" />
                </a>
                <a href="https://www.linkedin.com/company/roggeroyroma" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors" aria-label="LinkedIn">
                  <img src="/senada/images/icons/ico_linked.svg" alt="linkedin" className="w-[20px] h-[20px]" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-sm text-white/40 gap-2">
            <p>© {currentYear} Roggero & Roma. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>

      {/* ============================================
          MOBILE FOOTER — visible below md (<768px)
          ============================================ */}
      <div className="block md:hidden">
        <div className="footer-m-inner">
          {/* 2. Logo + tagline */}
          <div className="footer-m-brand">
            <Link href="/" className="inline-block">
              <Image src={logo} alt="Roggero & Roma" width={130} height={40} className="footer-m-logo brightness-0 invert" />
            </Link>
            <p className="footer-m-tagline">
              Más de 10 años de experiencia en el mercado inmobiliario de Córdoba.
            </p>
          </div>

          {/* 3. Flat 2-column links grid */}
          <div className="footer-m-links">
            {mobileLinks.map((link) => (
              <Link key={link.href} href={link.href} className="footer-m-link">
                {link.label}
              </Link>
            ))}
          </div>

          {/* 4. Compact contact row — senada SVG icons */}
          <div className="footer-m-contact">
            <a href={generateWhatsAppLink({ context: 'general' })} target="_blank" rel="noopener noreferrer"
              className="footer-m-icon-wa" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
            <a href={`mailto:${EMAIL}`} className="footer-m-icon-circle" aria-label="Email">
              <img src="/senada/images/icons/ico_mail.svg" alt="email" className="w-4 h-4" style={{ filter: 'brightness(0) invert(1)' }} />
            </a>
            <a href={`tel:${PHONE_NUMBER}`} className="footer-m-icon-circle" aria-label="Llamar">
              <img src="/senada/images/icons/ico_phone.svg" alt="phone" className="w-4 h-4" style={{ filter: 'brightness(0) invert(1)' }} />
            </a>
            <span className="footer-m-phone">{PHONE_DISPLAY}</span>
          </div>

          {/* 5. Copyright strip */}
          <div className="footer-m-copyright">
            © {currentYear} Roggero & Roma. Todos los derechos reservados.
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
