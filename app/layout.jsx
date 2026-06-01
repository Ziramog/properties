import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthProvider from '@/components/AuthProvider';
import { GlobalProvider } from '@/context/GlobalContext';
import { ToastContainer } from 'react-toastify';
import { Lato, PT_Serif, Cormorant_Garamond } from 'next/font/google';
import 'react-toastify/dist/ReactToastify.css';
import '@/assets/styles/globals.css';
import 'photoswipe/dist/photoswipe.css';
import ScrollAnimation from '@/components/ScrollAnimation';

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-body',
  display: 'swap',
});

const ptSerif = PT_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-heading',
  display: 'swap',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://properties-srs5.vercel.app'),
  title: {
    template: '%s · Roggero & Roma',
    default: 'Roggero & Roma | Negocios Inmobiliarios en Alta Gracia, Córdoba',
  },
  description:
    'Agencia inmobiliaria en Alta Gracia, Córdoba. Más de 10 años de experiencia en compra, venta y alquiler de casas, departamentos, campos y locales comerciales.',
  keywords:
    'inmobiliaria, propiedades, casas, departamentos, campos, Alta Gracia, Córdoba, Argentina, venta, alquiler',
  authors: [{ name: 'Roggero & Roma' }],
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'Roggero & Roma Inmobiliaria',
    images: ['/images/og-default.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@roggeroroma',
  },
  alternates: {
    canonical: '/',
  },
};

const MainLayout = ({ children }) => {
  return (
    <AuthProvider>
      <GlobalProvider>
        <html lang='es' className={`${lato.variable} ${ptSerif.variable} ${cormorantGaramond.variable}`}>
          <body className='font-sans antialiased text-body'>
            <Navbar />
            <main className="relative z-[1]">{children}</main>
            <Footer />
            <ToastContainer />
            <ScrollAnimation />
          </body>
        </html>
      </GlobalProvider>
    </AuthProvider>
  );
};

export default MainLayout;
