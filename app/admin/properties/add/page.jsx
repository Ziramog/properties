export const metadata = {
  title: 'Agregar Propiedad',
  robots: { index: false, follow: false },
};

import PropertyAddForm from '@/components/PropertyAddForm';
import ScrollReveal from '@/components/shared/ScrollReveal';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const PropertyAddPage = () => {
  return (
    <div className='container mx-auto px-4 py-8 max-w-3xl'>
      <div className='mb-4'>
        <Link href='/admin/properties' className='inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm font-medium'>
          <ArrowLeft className='w-4 h-4 mr-2' />
          Volver a Propiedades
        </Link>
      </div>
      <ScrollReveal>
        <div className='bg-[#111] border border-[#333] px-6 py-8 shadow-xl rounded-xl'>
          <PropertyAddForm />
        </div>
      </ScrollReveal>
    </div>
  );
};
export default PropertyAddPage;
