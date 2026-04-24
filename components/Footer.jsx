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
    <footer className="bg-navy text-white">
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
              <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                Más de 10 años de experiencia en el mercado inmobiliario de Córdoba.
              </p>
            </div>

            {/* Properties */}
            <div>
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-4">Propiedades</h3>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/properties?type=Casa" className="text-white/40 hover:text-white transition-colors">Casas</Link></li>
                <li><Link href="/properties?type=Departamento" className="text-white/40 hover:text-white transition-colors">Departamentos</Link></li>
                <li><Link href="/properties?type=Terreno" className="text-white/40 hover:text-white transition-colors">Terrenos</Link></li>
                <li><Link href="/properties?type=Campo" className="text-white/40 hover:text-white transition-colors">Campos</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-4">Empresa</h3>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/properties" className="text-white/40 hover:text-white transition-colors">Propiedades</Link></li>
                <li><Link href="/properties?type=Inmueble+Comercial" className="text-white/40 hover:text-white transition-colors">Propiedades Comerciales</Link></li>
                <li><Link href="/contact" className="text-white/40 hover:text-white transition-colors">Contacto</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-4">Contacto</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <a href={generateWhatsAppLink({ context: 'general' })} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-whatsapp rounded-lg flex items-center justify-center text-white hover:scale-105 transition-transform" aria-label="WhatsApp">
                  <FaWhatsapp className="text-base" />
                </a>
                <a href={`tel:${PHONE_NUMBER}`}
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors" aria-label="Llamar">
                  <FaPhone className="text-sm" />
                </a>
                <a href="#"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors" aria-label="Telegram">
                  <FaTelegram className="text-base" />
                </a>
                <a href="#"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors" aria-label="YouTube">
                  <FaYoutube className="text-base" />
                </a>
              </div>
              <p className="text-white/40 text-sm">{PHONE_DISPLAY}</p>
            </div>
          </div>

          <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-sm text-white/30 gap-2">
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

      {/* WhatsApp FAB */}
      <a href={generateWhatsAppLink({ context: 'float' })} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-whatsapp text-white p-4 rounded-2xl shadow-float hover:scale-110 transition-all duration-200 z-50 animate-pulse-wa" aria-label="Contactar por WhatsApp">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </footer>
  );
};

export default Footer;
