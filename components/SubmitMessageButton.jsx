import { useFormStatus } from 'react-dom';
import { FaPaperPlane } from 'react-icons/fa';

const SubmitMessageButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      className='bg-[#E94560] hover:bg-[#d13a54] text-white font-bold py-3 px-4 rounded-xl w-full transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60'
      type='submit'
      disabled={pending}
    >
      <FaPaperPlane className='w-4 h-4' />
      {pending ? 'Enviando...' : 'Enviar Mensaje'}
    </button>
  );
};

export default SubmitMessageButton;
