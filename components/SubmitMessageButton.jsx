import { useFormStatus } from 'react-dom';
import { FaPaperPlane } from 'react-icons/fa';

const SubmitMessageButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      className='bg-[#d4a574] hover:bg-[#c49664] text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline flex items-center justify-center'
      type='submit'
      disabled={pending}
    >
      <FaPaperPlane className='mr-2' />{' '}
      {pending ? 'Enviando...' : 'Enviar Mensaje'}
    </button>
  );
};

export default SubmitMessageButton;
