import { useFormStatus } from 'react-dom';
import { FaPaperPlane } from 'react-icons/fa';

const SubmitMessageButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      className='bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary/50 flex items-center justify-center'
      type='submit'
      disabled={pending}
    >
      <FaPaperPlane className='mr-2' />{' '}
      {pending ? 'Enviando...' : 'Enviar Mensaje'}
    </button>
  );
};

export default SubmitMessageButton;
