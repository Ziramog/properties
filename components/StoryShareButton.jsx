'use client';
import { useState } from 'react';
import { Share2, Share, Copy, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { generateWhatsAppLink } from '@/utils/whatsapp';

export default function StoryShareButton({ property }) {
  const [status, setStatus] = useState('idle'); // 'idle', 'preparing', 'ready'
  const [fileToShare, setFileToShare] = useState(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // Generate contextualized WhatsApp link for Instagram's Link Sticker
  const waLink = property ? generateWhatsAppLink({ property, context: 'story' }) : '';

  const handlePrepare = async () => {
    setStatus('preparing');
    setLinkCopied(false);
    try {
      const storyUrl = `/api/story/${property._id || property.id}?template=rr-story-v2.2`;
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

      // Intentar copiar automáticamente el enlace de WhatsApp para el Sticker
      let copiedAuto = false;
      if (typeof navigator !== 'undefined' && navigator.clipboard && waLink) {
        try {
          await navigator.clipboard.writeText(waLink);
          copiedAuto = true;
          setLinkCopied(true);
        } catch {
          copiedAuto = false;
        }
      }

      if (copiedAuto) {
        toast.success('Historia preparada. Enlace de WhatsApp copiado para el sticker.');
      } else {
        toast.info('Historia preparada. Podés copiar el enlace de WhatsApp abajo.');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error preparing story', error);
        toast.error(`Error: ${error.message}`);
      }
      setStatus('idle');
    }
  };

  const handleCopyLink = async () => {
    if (!waLink) return;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(waLink);
        setLinkCopied(true);
        toast.success('Enlace de WhatsApp copiado al portapapeles');
      } else {
        throw new Error('Portapapeles no soportado');
      }
    } catch (err) {
      toast.error('No se pudo copiar automáticamente. Tocá para reintentar.');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.canShare && navigator.canShare({ files: [fileToShare] })) {
        // NOTA CRÍTICA: NO agregar url al objeto navigator.share cuando se comparten archivos.
        // En iOS y Android, incluir 'url' hace que el sistema operativo comparta texto/link
        // en lugar de abrir directamente el editor de Historias de Instagram con la imagen.
        await navigator.share({
          files: [fileToShare],
          title: property.name || 'Propiedad en Roggero & Roma',
        });
        toast.info('Compartiendo imagen. Recordá agregar el sticker Enlace en Instagram.');
      } else {
        // Descarga directa alternativa para navegadores sin Web Share API
        const url = URL.createObjectURL(fileToShare);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileToShare.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Imagen guardada en tu dispositivo');
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
      <div className="w-full mt-4 space-y-2">
        {/* Acción 2: Compartir a Instagram */}
        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 text-[13px] font-bold uppercase tracking-wider text-white bg-green-600 border-2 border-green-600 hover:bg-green-700 transition-colors py-3 px-6 shadow-sm"
        >
          <Share className="w-5 h-5" />
          Compartir a Instagram
        </button>

        {/* Botón explícito: Copiar enlace de WhatsApp para sticker */}
        <button
          onClick={handleCopyLink}
          type="button"
          className="w-full flex items-center justify-center gap-2 text-[12px] font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-colors py-2.5 px-4"
        >
          {linkCopied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-700 font-bold">¡Enlace de WhatsApp Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-gray-600" />
              <span>Copiar enlace de WhatsApp</span>
            </>
          )}
        </button>

        {/* Micro-instrucción para el operador */}
        <p className="text-[11px] text-gray-500 text-center leading-tight">
          Pegá este enlace en el sticker <strong>Enlace</strong> de tu historia
        </p>

        {/* Volver a preparar si es necesario */}
        <div className="text-center pt-1">
          <button
            onClick={() => {
              setStatus('idle');
              setFileToShare(null);
            }}
            className="text-[11px] text-gray-400 hover:text-gray-600 underline"
          >
            Preparar otra versión
          </button>
        </div>
      </div>
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
