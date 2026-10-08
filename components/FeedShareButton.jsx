'use client';
import { useState } from 'react';
import { Layers, Share } from 'lucide-react';
import { toast } from 'react-toastify';

export default function FeedShareButton({ property }) {
  const [status, setStatus] = useState('idle'); // 'idle', 'preparing', 'ready'
  const [progress, setProgress] = useState(0);
  const [filesToShare, setFilesToShare] = useState([]);

  // Limitar a máximo 7 fotos (coincidiendo con las fotos mostradas en la grilla negra principal)
  const maxImages = Math.min(property.images?.length || 0, 7);
  if (maxImages === 0) return null;

  const handlePrepare = async () => {
    setStatus('preparing');
    setProgress(0);
    const generatedFiles = [];

    try {
      for (let i = 0; i < maxImages; i++) {
        const url = `/api/feed/${property._id || property.id}?index=${i}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Error en foto ${i+1}`);
        }
        
        const blob = await response.blob();
        const file = new File([blob], `carrusel-${i+1}.png`, { type: 'image/png' });
        generatedFiles.push(file);
        setProgress(i + 1);
      }
      
      setFilesToShare(generatedFiles);
      setStatus('ready');
      toast.success('¡Fotos listas para compartir!');
    } catch (error) {
      console.error(error);
      toast.error('Hubo un error al preparar el carrusel.');
      setStatus('idle');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.canShare && navigator.canShare({ files: filesToShare })) {
        await navigator.share({
          files: filesToShare,
          title: 'Carrusel de Propiedad',
        });
        // Volver al estado inicial luego de compartir por si quiere hacerlo de nuevo
        setStatus('idle');
        setFilesToShare([]);
      } else {
        // Fallback si no soporta compartir nativo o el navegador de escritorio
        toast.warning('Tu navegador no soporta compartir directamente. Usa un celular.');
        setStatus('idle');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing', error);
        toast.error(`Error al compartir: ${error.message}`);
      }
    }
  };

  if (status === 'ready') {
    return (
      <button
        onClick={handleShare}
        className="w-full flex items-center justify-center gap-2 mt-4 text-[13px] font-bold uppercase tracking-wider text-white bg-green-600 border-2 border-green-600 hover:bg-transparent hover:text-green-600 transition-colors py-3 px-6"
      >
        <Share className="w-5 h-5" />
        Compartir a Instagram
      </button>
    );
  }

  return (
    <button
      onClick={handlePrepare}
      disabled={status === 'preparing'}
      className="w-full flex items-center justify-center gap-2 mt-4 text-[13px] font-bold uppercase tracking-wider text-[var(--color-brand)] bg-transparent border-2 border-[var(--color-brand)] hover:bg-[var(--color-brand)] hover:text-white transition-colors py-3 px-6 disabled:opacity-50 disabled:cursor-wait"
    >
      {status === 'preparing' ? (
        <>Generando foto {progress} de {maxImages}...</>
      ) : (
        <>
          <Layers className="w-5 h-5" />
          Preparar Carrusel ({maxImages} fotos)
        </>
      )}
    </button>
  );
}
