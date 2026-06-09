import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthProvider from '@/components/AuthProvider';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { GlobalProvider } from '@/context/GlobalContext';
import { ToastContainer } from 'react-toastify';
import { Cormorant_Garamond } from 'next/font/google';
import localFont from 'next/font/local';
import 'react-toastify/dist/ReactToastify.css';
import '@/assets/styles/globals.css';
import 'photoswipe/dist/photoswipe.css';

const lato = localFont({
  src: [
    { path: '../assets/fonts/lato/Lato-Light.woff2', weight: '300', style: 'normal' },
    { path: '../assets/fonts/lato/Lato-LightItalic.woff2', weight: '300', style: 'italic' },
    { path: '../assets/fonts/lato/Lato-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../assets/fonts/lato/Lato-Italic.woff2', weight: '400', style: 'italic' },
    { path: '../assets/fonts/lato/Lato-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
});

const ptSerif = localFont({
  src: [
    { path: '../assets/fonts/pt-serif/PTSerif-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../assets/fonts/pt-serif/PTSerif-Bold.woff2', weight: '700', style: 'normal' },
  ],
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
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Roggero & Roma Inmobiliaria — Alta Gracia, Córdoba',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@roggeroroma',
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/images/favicon-square.png',
    apple: '/images/favicon-square.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { getSiteConfig } from '@/utils/getSiteConfig';

const MainLayout = async ({ children }) => {
  const siteConfig = await getSiteConfig();

  return (
    <AuthProvider>
      <GlobalProvider>
        <html lang='es' className={`${lato.variable} ${ptSerif.variable} ${cormorantGaramond.variable}`}>
          <body className='font-sans antialiased text-body'>
            <Navbar contactEmail={siteConfig.contactEmail} contactPhone={siteConfig.contactPhone} />
            <main className="relative pb-[12px]">{children}</main>
            <Footer footerDescription={siteConfig.footerDescription} contactEmail={siteConfig.contactEmail} contactPhone={siteConfig.contactPhone} contactAddress={siteConfig.contactAddress} />
            <ToastContainer />
            <GoogleAnalytics analyticsId={siteConfig.analyticsId} facebookPixelId={siteConfig.facebookPixelId} />
          </body>
        </html>
      </GlobalProvider>
    </AuthProvider>
  );
};

export default MainLayout;
