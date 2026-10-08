'use client';
import { useState } from 'react';
import { Share2, Share, Download } from 'lucide-react';
import { toast } from 'react-toastify';

export default function StoryShareButton({ property }) {
  const [status, setStatus] = useState('idle'); // 'idle', 'preparing', 'ready'
  const [fileToShare, setFileToShare] = useState(null);

  const handlePrepare = async () => {
    setStatus('preparing');
    try {
      const storyUrl = `/api/story/${property._id || property.id}?template=1`;
      const response = await fetch(storyUrl);
      
      if (!response.ok) {
        let errMsg = `Error generando imagen: ${response.status}`;
        try {
          const errData = await response.json();
          errMsg = errData.message || errMsg;
        } catch {}
        throw new Error(errMsg);
      }
      
      const blob = await response.blob();
      const fileName = `roggero-roma-${property._id || property.id}-story.png`;
      const file = new File([blob], fileName, { type: 'image/png' });
      
      setFileToShare(file);
      setStatus('ready');
      toast.success('¡Historia lista para compartir!');
      
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing', error);
        toast.error(`Error: ${error.message}`);
      }
      setStatus('idle');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.canShare && navigator.canShare({ files: [fileToShare] })) {
        await navigator.share({
          files: [fileToShare],
          title: 'Historia de Propiedad',
        });
        setStatus('idle');
        setFileToShare(null);
      } else {
        // Fallback for desktop or unsupported browsers (like the old behavior)
        const url = URL.createObjectURL(fileToShare);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileToShare.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Imagen descargada');
        setStatus('idle');
        setFileToShare(null);
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
      className="w-full flex items-center justify-center gap-2 mt-4 text-[13px] font-bold uppercase tracking-wider text-white bg-[var(--color-brand)] border-2 border-[var(--color-brand)] hover:bg-transparent hover:text-[var(--color-brand)] transition-colors py-3 px-6 disabled:opacity-50 disabled:cursor-wait"
    >
      {status === 'preparing' ? (
        <>Generando historia...</>
      ) : (
        <>
          <Share2 className="w-5 h-5" />
          Preparar Historia
        </>
      )}
    </button>
  );
}
