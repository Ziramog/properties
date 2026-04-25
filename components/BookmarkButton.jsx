'use client';
import { useState, useEffect } from 'react';
import { FaBookmark } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import bookmarkProperty from '@/app/actions/bookmarkProperty';
import checkBookmarkStatus from '@/app/actions/checkBookmarkStatus';
import { toast } from 'react-toastify';

const BookmarkButton = ({ property }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    checkBookmarkStatus(property._id).then((res) => {
      if (res?.error) {
        toast.error(res.error);
      }
      setIsBookmarked(res?.isBookmarked ?? false);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [userId, property._id]);

  const handleClick = async () => {
    if (!userId) {
      toast.error('Debes iniciar sesión para guardar una propiedad');
      return;
    }

    const res = await bookmarkProperty(property._id);
    if (res?.error) {
      toast.error(res.error);
      return;
    }
    setIsBookmarked(res?.isBookmarked ?? false);
    if (res?.isBookmarked) {
      toast.success('Propiedad guardada');
    } else {
      toast.success('Propiedad removida de favoritos');
    }
  };

  if (loading) return <p className='text-center py-3 text-sm text-gray-500'>Cargando...</p>;

  return isBookmarked ? (
    <button
      onClick={handleClick}
      className='bg-red-500 hover:bg-red-600 text-white font-bold w-full py-2 px-4 rounded-md flex items-center justify-center'
    >
      <FaBookmark className='mr-2' /> Quitar de Favoritos
    </button>
  ) : (
    <button
      onClick={handleClick}
      className='bg-primary hover:bg-primary-hover text-white font-bold w-full py-2 px-4 rounded-md flex items-center justify-center'
    >
      <FaBookmark className='mr-2' /> Guardar Propiedad
    </button>
  );
};
export default BookmarkButton;
