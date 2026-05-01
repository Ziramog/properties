import Link from 'next/link';
import Image from 'next/image';
import { FaWhatsapp, FaPhone, FaTelegram, FaYoutube } from 'react-icons/fa';
import logo from '@/assets/images/logo.png';
import { generateWhatsAppLink, PHONE_NUMBER, PHONE_DISPLAY } from '@/utils/whatsapp';
import '@/footer.css';

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
    <footer className="text-white" style={{ background: 'linear-gradient(180deg, #1C1C1A 0%, #141412 100%)' }}>
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
              <div className="flex flex-wrap gap-2.5 mb-4">
                <a href={generateWhatsAppLink({ context: 'general' })} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-whatsapp rounded-full flex items-center justify-center text-white hover:scale-110 hover:shadow-[0_4px_16px_rgba(37,211,102,0.4)] transition-all duration-200" aria-label="WhatsApp">
                  <FaWhatsapp className="text-base" />
                </a>
                <a href={`tel:${PHONE_NUMBER}`}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-[var(--color-brand)] hover:shadow-[0_4px_16px_rgba(242,107,46,0.4)] transition-all duration-200" aria-label="Llamar">
                  <FaPhone className="text-sm" />
                </a>
                <a href="#"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-[var(--color-brand)] hover:shadow-[0_4px_16px_rgba(242,107,46,0.4)] transition-all duration-200" aria-label="Telegram">
                  <FaTelegram className="text-base" />
                </a>
                <a href="#"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-[var(--color-brand)] hover:shadow-[0_4px_16px_rgba(242,107,46,0.4)] transition-all duration-200" aria-label="YouTube">
                  <FaYoutube className="text-base" />
                </a>
              </div>
              <p className="text-white/55 text-sm">{PHONE_DISPLAY}</p>
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

          {/* 4. Compact contact row */}
          <div className="footer-m-contact">
            <a href={generateWhatsAppLink({ context: 'general' })} target="_blank" rel="noopener noreferrer"
              className="footer-m-icon-wa" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
            <a href={`tel:${PHONE_NUMBER}`}
              className="footer-m-icon-circle" aria-label="Llamar">
              <FaPhone />
            </a>
            <a href="#"
              className="footer-m-icon-circle" aria-label="Telegram">
              <FaTelegram />
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
