'use client';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import addMessage from '@/app/actions/addMessage';
import SubmitMessageButton from './SubmitMessageButton';

const PropertyContactForm = ({ property }) => {
  const { data: session } = useSession();

  const [state, formAction] = useFormState(addMessage, {});

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.submitted) toast.success('Mensaje enviado');
  }, [state]);

  if (!session) {
    return (
      <div className="bg-white rounded-xl p-5 border border-gray-100 text-center">
        <p className="text-sm text-[#666]">
          <a href="/api/auth/signin" className="text-[#E94560] font-medium hover:underline">Iniciá sesión</a> para contactar al vendedor.
        </p>
      </div>
    );
  }

  if (state.submitted) {
    return (
      <div className="bg-white rounded-xl p-5 border border-gray-100 text-center">
        <p className="text-green-600 font-medium">Tu mensaje ha sido enviado</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100">
      <p className="text-xs font-bold uppercase tracking-wider text-[#999] mb-4">Contactar al Vendedor</p>
      <form action={formAction}>
        <input type='hidden' id='property' name='property' defaultValue={property._id} />
        <input type='hidden' id='recipient' name='recipient' defaultValue={property.owner} />
        <div className='mb-3'>
          <input
            className='w-full border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-[#0F172A] bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#E94560]/30 focus:border-[#E94560] transition-all placeholder:text-[#999]'
            id='name'
            name='name'
            type='text'
            placeholder='Tu nombre'
            required
          />
        </div>
        <div className='mb-3'>
          <input
            className='w-full border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-[#0F172A] bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#E94560]/30 focus:border-[#E94560] transition-all placeholder:text-[#999]'
            id='email'
            name='email'
            type='email'
            placeholder='Tu email'
            required
          />
        </div>
        <div className='mb-3'>
          <input
            className='w-full border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-[#0F172A] bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#E94560]/30 focus:border-[#E94560] transition-all placeholder:text-[#999]'
            id='phone'
            name='phone'
            type='text'
            placeholder='Teléfono'
          />
        </div>
        <div className='mb-4'>
          <textarea
            className='w-full border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-[#0F172A] bg-gray-50 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-[#E94560]/30 focus:border-[#E94560] transition-all placeholder:text-[#999]'
            id='message'
            name='message'
            placeholder='Tu mensaje...'
          ></textarea>
        </div>
        <SubmitMessageButton />
      </form>
    </div>
  );
};
export default PropertyContactForm;
