export const metadata = {
  title: 'Agregar Propiedad',
  robots: { index: false, follow: false },
};

import PropertyAddForm from '@/components/PropertyAddForm';
import ScrollReveal from '@/components/shared/ScrollReveal';

const PropertyAddPage = () => {
  return (
    <div className='container mx-auto px-4 py-8 max-w-3xl'>
      <ScrollReveal>
        <div className='bg-[#111] border border-[#333] px-6 py-8 shadow-xl rounded-xl'>
          <PropertyAddForm />
        </div>
      </ScrollReveal>
    </div>
  );
};
export default PropertyAddPage;
