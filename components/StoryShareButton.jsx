'use client';
import { useState } from 'react';
import { Share2, Download } from 'lucide-react';
import { toast } from 'react-toastify';

export default function StoryShareButton({ property }) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
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
      
      // Download file directly
      // Note: navigator.share is blocked by mobile browsers if called after an async fetch
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Imagen descargada');
      
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing', error);
        toast.error('Ocurrió un error al generar la imagen. Intentá de nuevo.');
      }
    }
    setIsSharing(false);
  };

  return (
    <button
      onClick={handleShare}
      disabled={isSharing}
      className="w-full flex items-center justify-center gap-2 mt-4 text-[13px] font-bold uppercase tracking-wider text-white bg-[var(--color-brand)] border-2 border-[var(--color-brand)] hover:bg-transparent hover:text-[var(--color-brand)] transition-colors py-3 px-6 disabled:opacity-50 disabled:cursor-wait"
    >
      {isSharing ? (
        <>Generando imagen...</>
      ) : (
        <>
          <Share2 className="w-5 h-5" />
          Compartir Historia
        </>
      )}
    </button>
  );
}
