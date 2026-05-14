'use client';
import { FaWhatsapp } from 'react-icons/fa';

const ShareButtons = ({ property, inline }) => {
  const shareUrl = `${process.env.NEXT_PUBLIC_DOMAIN || 'https://properties.roggeroyroma.com'}/properties/${property._id}`;
  const shareTitle = property?.name || 'Propiedad';

  const iconSize = inline ? 'w-[35px] h-[35px]' : 'w-10 h-10';
  const svgSize = 'w-5 h-5';

  const btnClass = `${iconSize} flex items-center justify-center rounded-full bg-black/50 hover:bg-[var(--color-brand)] transition-colors duration-300`;

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
          className={btnClass}
          aria-label="Compartir en Facebook"
        >
          <img src="/senada/images/icons/icon_share_facebook.svg" alt="" className={svgSize} style={{ filter: 'brightness(0) invert(1)' }} />
        </a>

        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={btnClass}
          aria-label="Compartir en Twitter"
        >
          <img src="/senada/images/icons/icon_share_twitter.svg" alt="" className={svgSize} />
        </a>

        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={btnClass}
          aria-label="Compartir en LinkedIn"
        >
          <img src="/senada/images/icons/icon_share_linked.svg" alt="" className={svgSize} style={{ filter: 'brightness(0) invert(1)' }} />
        </a>

        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle}\n${shareUrl}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={btnClass}
          aria-label="Compartir en WhatsApp"
        >
          <FaWhatsapp className="text-white text-lg" />
        </a>
      </div>
    </div>
  );
};

export default ShareButtons;