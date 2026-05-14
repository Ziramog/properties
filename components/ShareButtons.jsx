'use client';
import { FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ShareButtons = ({ property, inline }) => {
  const shareUrl = `${process.env.NEXT_PUBLIC_DOMAIN || 'https://properties.roggeroyroma.com'}/properties/${property._id}`;
  const shareText = `Mirá esta propiedad: ${property.name}`;

  const handleInstagramShare = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('Enlace copiado al portapapeles');
    }).catch(() => {
      toast.error('No se pudo copiar el enlace');
    });
  };

  const iconSize = inline ? 'w-[35px] h-[35px]' : 'w-10 h-10';
  const svgSize = inline ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div>
      {!inline && (
        <p className="text-xs font-bold uppercase tracking-wider text-[#999] mb-4">Compartir</p>
      )}
      <div className={`flex ${inline ? 'gap-3' : 'gap-3'}`}>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center ${iconSize} rounded-full bg-black/50 hover:bg-[var(--color-brand)] transition-colors duration-300`}
          aria-label="Compartir en Facebook"
        >
          <img src="/senada/images/icons/ico_facebook.svg" alt="" className={`${svgSize} brightness-0 invert`} />
        </a>

        <button
          onClick={handleInstagramShare}
          className={`flex items-center justify-center ${iconSize} rounded-full bg-black/50 hover:bg-[var(--color-brand)] transition-colors duration-300`}
          aria-label="Compartir en Instagram"
        >
          <img src="/senada/images/icons/ico_instagram.svg" alt="" className={`${svgSize} brightness-0 invert`} />
        </button>

        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center ${iconSize} rounded-full bg-black/50 hover:bg-[var(--color-brand)] transition-colors duration-300`}
          aria-label="Compartir en WhatsApp"
        >
          <FaWhatsapp className={`text-white ${inline ? 'text-lg' : 'text-xl'}`} />
        </a>
      </div>
    </div>
  );
};

export default ShareButtons;