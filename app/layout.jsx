import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthProvider from '@/components/AuthProvider';
import { GlobalProvider } from '@/context/GlobalContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/assets/styles/globals.css';
import 'photoswipe/dist/photoswipe.css';

export const metadata = {
  title: 'Roggero & Roma | Negocios Inmobiliarios',
  description: 'Agencia inmobiliaria en Alta Gracia, Córdoba. Más de 10 años de experiencia en compra, venta y alquiler de propiedades.',
  keywords: 'inmobiliaria, propiedades, casas, departamentos, campos, Alta Gracia, Córdoba, Argentina',
};

const MainLayout = ({ children }) => {
  return (
    <AuthProvider>
      <GlobalProvider>
        <html lang='en'>
          <body>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <ToastContainer />
          </body>
        </html>
      </GlobalProvider>
    </AuthProvider>
  );
};

export default MainLayout;
