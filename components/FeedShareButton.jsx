'use client';
import { useState } from 'react';
import { Layers, Share, Copy, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { processImageInBrowser } from '@/utils/processImageInBrowser';
import { convertBlobToJpeg } from '@/utils/convertBlobToJpeg';
import { buildFeedCaption } from '@/utils/feedCaption';

function FeedToggleSwitch({ label, checked, disabled, isDark, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`flex items-center justify-between gap-2.5 px-3 py-2 border text-[12px] font-medium transition-colors disabled:opacity-50 ${
        isDark
          ? 'bg-[#1f1f1f] border-[#333] text-zinc-200 hover:border-[#444]'
          : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
      }`}
    >
      <span className="truncate">{label}</span>
      <span
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
          checked ? 'bg-[var(--color-brand)]' : isDark ? 'bg-[#3a3a3a]' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-[18px]' : 'translate-x-[3px]'
          }`}
        />
      </span>
    </button>
  );
}

export default function FeedShareButton({ property, variant = 'light' }) {
  const [status, setStatus] = useState('idle'); // 'idle', 'preparing', 'ready'
  const [progress, setProgress] = useState(0);
  const [filesToShare, setFilesToShare] = useState([]);
  const [showLogo, setShowLogo] = useState(true);
  const [showDetails, setShowDetails] = useState(true);
  const [captionCopied, setCaptionCopied] = useState(false);

  const isDark = variant === 'dark';

  // Limitar a máximo 7 fotos (coincidiendo con las fotos mostradas en la grilla negra principal)
  const maxImages = Math.min(property?.images?.length || 0, 7);
  if (maxImages === 0) return null;

  const handleToggleOption = (setter) => () => {
    setter((prev) => !prev);
    if (status === 'ready') {
      setStatus('idle');
      setFilesToShare([]);
      setProgress(0);
      setCaptionCopied(false);
    }
  };

  const handlePrepare = async () => {
    setStatus('preparing');
    setProgress(0);
    setCaptionCopied(false);
    const generatedFiles = [];
    const propertyId = property._id || property.id;

    try {
      for (let i = 0; i < maxImages; i++) {
        const imgEntry = property?.images?.[i] || property?.images?.[0];
        const rawImgUrl = typeof imgEntry === 'string' ? imgEntry : imgEntry?.url;

        // Procesar el recorte c_fill (1080x1350) y nitidez en el navegador del usuario (0 créditos Cloudinary)
        const imageBase64 = rawImgUrl
          ? await processImageInBrowser(rawImgUrl, 1080, 1350)
          : null;

        let file = null;

        // Si logo y textos están apagados y el navegador ya recortó a JPEG 1080x1350, evitar llamada innecesaria a Satori
        if (!showLogo && !showDetails && imageBase64) {
          const directRes = await fetch(imageBase64);
          const directBlob = await directRes.blob();
          file = new File([directBlob], `carrusel-${i + 1}.jpg`, { type: 'image/jpeg' });
        } else {
          const params = new URLSearchParams({
            index: String(i),
            logo: showLogo ? '1' : '0',
            details: showDetails ? '1' : '0',
          });
          const url = `/api/feed/${propertyId}?${params.toString()}`;
          const response = imageBase64
            ? await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageBase64 }),
              })
            : await fetch(url);

          if (!response.ok) {
            throw new Error(`Error en foto ${i + 1}`);
          }

          const blob = await response.blob();

          // Entregar JPEG sRGB 1080x1350 (liviano y estándar para Instagram). Reintento único ante fallos de memoria
          // en móviles para no mezclar .jpg y .png dentro del mismo lote; si vuelve a fallar, se usa el PNG original.
          let jpegBlob = await convertBlobToJpeg(blob, 1080, 1350, 0.92);
          if (!jpegBlob) {
            await new Promise((r) => setTimeout(r, 150));
            jpegBlob = await convertBlobToJpeg(blob, 1080, 1350, 0.92);
          }
          file = jpegBlob
            ? new File([jpegBlob], `carrusel-${i + 1}.jpg`, { type: 'image/jpeg' })
            : new File([blob], `carrusel-${i + 1}.png`, { type: 'image/png' });
        }

        generatedFiles.push(file);
        setProgress(i + 1);

        // Breve pausa entre láminas para liberar memoria de canvas/GPU en navegadores móviles (iOS Safari / Chrome)
        if (i < maxImages - 1) {
          await new Promise((r) => setTimeout(r, 40));
        }
      }

      setFilesToShare(generatedFiles);
      setStatus('ready');

      // Copiar el texto automáticamente durante la preparación para no interferir con el gesto de navigator.share en iOS
      const caption = buildFeedCaption(property);
      let copiedAuto = false;
      if (typeof navigator !== 'undefined' && navigator.clipboard && caption) {
        try {
          await navigator.clipboard.writeText(caption);
          copiedAuto = true;
          setCaptionCopied(true);
        } catch {
          copiedAuto = false;
        }
      }

      toast.success(
        copiedAuto
          ? '¡Carrusel 4:5 listo y texto copiado! En Instagram tocá Vertical (< >) en CADA lámina.'
          : '¡Carrusel 4:5 listo! Podés copiar el texto abajo antes de publicar.',
        { autoClose: 8000 }
      );
    } catch (error) {
      console.error(error);
      toast.error('Hubo un error al preparar el carrusel.');
      setStatus('idle');
    }
  };

  const handleCopyCaption = async () => {
    const caption = buildFeedCaption(property);
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(caption);
        setCaptionCopied(true);
        toast.success('Texto del post copiado al portapapeles');
      } else {
        throw new Error('Portapapeles no soportado');
      }
    } catch {
      toast.error('No se pudo copiar automáticamente. Tocá para reintentar.');
    }
  };

  const handleShare = async () => {
    try {
      const caption = buildFeedCaption(property);

      if (navigator.canShare && navigator.canShare({ files: filesToShare })) {
        await navigator.share({
          files: filesToShare,
          title: 'Carrusel de Propiedad',
          text: caption,
        });
        // Volver al estado inicial luego de compartir por si quiere hacerlo de nuevo
        setStatus('idle');
        setFilesToShare([]);
        setCaptionCopied(false);
      } else {
        // En escritorio, copiar al portapapeles si no estaba copiado y avisar
        if (!captionCopied && typeof navigator !== 'undefined' && navigator.clipboard) {
          try {
            await navigator.clipboard.writeText(caption);
            setCaptionCopied(true);
          } catch {}
        }
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

  return (
    <div className="mt-4 space-y-2.5">
      {/* Switches de estilo para las 7 láminas del Feed (contraste de grilla IG/FB) */}
      <div className="grid grid-cols-2 gap-2">
        <FeedToggleSwitch
          label="Logo en foto"
          checked={showLogo}
          disabled={status === 'preparing'}
          isDark={isDark}
          onChange={handleToggleOption(setShowLogo)}
        />
        <FeedToggleSwitch
          label="Textos en foto"
          checked={showDetails}
          disabled={status === 'preparing'}
          isDark={isDark}
          onChange={handleToggleOption(setShowDetails)}
        />
      </div>

      {status === 'ready' ? (
        <div className="space-y-2">
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 text-[13px] font-bold uppercase tracking-wider text-white bg-green-600 border-2 border-green-600 hover:bg-green-700 transition-colors py-3 px-6"
          >
            <Share className="w-5 h-5" />
            Compartir a Instagram
          </button>

          <button
            type="button"
            onClick={handleCopyCaption}
            className={`w-full flex items-center justify-center gap-2 text-[12px] font-semibold border transition-colors py-2.5 px-4 ${
              isDark
                ? 'text-zinc-200 bg-[#222] hover:bg-[#2c2c2c] border-[#3a3a3a]'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200 border-gray-300'
            }`}
          >
            {captionCopied ? (
              <>
                <Check className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                <span className={`${isDark ? 'text-green-400' : 'text-green-700'} font-bold`}>¡Texto del post Copiado!</span>
              </>
            ) : (
              <>
                <Copy className={`w-4 h-4 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`} />
                <span>Copiar texto del post</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <button
          onClick={handlePrepare}
          disabled={status === 'preparing'}
          className="w-full flex items-center justify-center gap-2 text-[13px] font-bold uppercase tracking-wider text-[var(--color-brand)] bg-transparent border-2 border-[var(--color-brand)] hover:bg-[var(--color-brand)] hover:text-white transition-colors py-3 px-6 disabled:opacity-50 disabled:cursor-wait"
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
      )}
    </div>
  );
}
