'use client';
import Link from 'next/link';
import Image from 'next/image';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { getAreaDisplay, getPriceDisplay, getPropertyImage, isNewListing } from '@/utils/propertyDisplay';
import { generateWhatsAppLink } from '@/utils/whatsapp';
import bookmarkProperty from '@/app/actions/bookmarkProperty';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-toastify';

const BedIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="30.23" height="24.184" viewBox="0 0 30.23 24.184" fill="none" className={className}>
    <path d="M25.192-14.542a4.029,4.029,0,0,0-4.031,4.031H19.146V-8.5h6.046v-2.015H23.176a1.913,1.913,0,0,1,2.015-2.015,1.913,1.913,0,0,1,2.015,2.015v6.046H0V-2.45H1.2L2.74,5.2v.031A3.085,3.085,0,0,0,4.755,7.469L4.031,9.642H6.046l.661-2.015H23.523l.661,2.015H26.2l-.724-2.173a3.055,3.055,0,0,0,2.11-2.236V5.2L29.034-2.45h1.2V-4.466H29.222v-6.046A4.028,4.028,0,0,0,25.192-14.542ZM3.244-2.45H27.018L25.6,4.824a1.032,1.032,0,0,1-1.008.787H5.731a1.006,1.006,0,0,1-1.008-.819Z" transform="translate(0 14.542)" fill="#fff"/>
  </svg>
);

const BathIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="33.034" height="25.627" viewBox="0 0 33.034 25.627" fill="none" className={className}>
    <path d="M27.386-4.2H2.7v-8.024a3.11,3.11,0,0,1,3.086-3.086H24.3a3.11,3.11,0,0,1,3.086,3.086Z" transform="translate(777.008 1112.272)" stroke="#fff" strokeWidth="1.5"/>
    <path d="M.468,4.945V-3.7A4.976,4.976,0,0,1,5.406-8.634H27.628A4.976,4.976,0,0,1,32.566-3.7V4.945" transform="translate(775.532 1116.702)" stroke="#fff" strokeWidth="1.5"/>
    <path d="M.468.516V-.1A1.866,1.866,0,0,1,2.32-1.953H30.714A1.866,1.866,0,0,1,32.566-.1V.516" transform="translate(775.532 1121.131)" stroke="#fff" strokeWidth="1.5"/>
    <path d="M3.438-7.158V-8.392a2.488,2.488,0,0,1,2.469-2.469h6.173a2.488,2.488,0,0,1,2.469,2.469v1.235" transform="translate(777.5 1115.225)" stroke="#fff" strokeWidth="1.5"/>
    <path d="M10.119-7.158V-8.392a2.488,2.488,0,0,1,2.469-2.469H18.76a2.487,2.487,0,0,1,2.469,2.469v1.235" transform="translate(781.93 1115.225)" stroke="#fff" strokeWidth="1.5"/>
  </svg>
);

const SqftIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24.739" height="24.739" viewBox="0 0 24.739 24.739" fill="none" className={className}>
    <path d="M18.2-16.364h7.624V7.356H2.1v-23.72H8.877l5.083,3.389M12.266,7.356V-4.5M8.03-4.5H16.5m5.083,0h4.236" transform="translate(-1.591 16.873)" stroke="#fff" strokeWidth="1.019"/>
  </svg>
);

const FeaturedPropertyCard = ({ property }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const isAdmin = session?.user?.role === 'admin';
  const router = useRouter();

  const image = getPropertyImage(property);
  const area = getAreaDisplay(property);
  const price = getPriceDisplay(property);
  const isNew = isNewListing(property);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) {
      toast.error('Debes iniciar sesión para guardar una propiedad');
      return;
    }
    if (toggling) return;
    setToggling(true);
    const res = await bookmarkProperty(property._id);
    if (res?.error) {
      toast.error(res.error);
    } else {
      setIsBookmarked(res?.isBookmarked ?? false);
      toast.success(res?.isBookmarked ? 'Propiedad guardada' : 'Propiedad removida');
    }
    setToggling(false);
  };

  return (
    <article className="group">
      <Link href={`/properties/${property._id}`} className="block">
        {/* Card image area */}
        <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: '3/2' }}>
          <Image
            src={image}
            alt={property.name}
            fill
            className="object-cover transition-transform duration-500 z-0"
            onLoad={() => setImgLoaded(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Gradient overlay — black default, purple on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#652660] to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Tag — top left */}
          {isNew && (
            <span className="absolute top-3 left-3 z-10 bg-[#652660] text-white text-[11px] font-bold px-2 py-1 rounded uppercase tracking-wider">
              Nuevo
            </span>
          )}

          {/* Heart bookmark — top right */}
          <button
            onClick={handleBookmark}
            className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              isBookmarked
                ? 'bg-red-500 text-white'
                : 'bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500'
            }`}
            aria-label={isBookmarked ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          >
            {isBookmarked ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
          </button>

          {/* Edit button — admin only */}
          {isAdmin && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/properties/${property._id}/edit`); }}
              className="absolute top-3 right-12 bg-white/80 hover:bg-white text-gray-700 p-1.5 rounded-full transition-all duration-200 z-10 opacity-0 group-hover:opacity-100"
              aria-label="Editar propiedad"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          )}

          {/* Features overlay — bottom */}
          <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center gap-3 px-4 pb-4">
            <div className="flex items-center gap-3">
              {property.beds != null && (
                <span className="flex items-center gap-1 text-white text-[14px] font-normal" style={{ fontFamily: 'var(--font-heading)' }}>
                  <BedIcon className="w-5 h-5" />
                  {property.beds}
                </span>
              )}
              {property.baths != null && (
                <span className="flex items-center gap-1 text-white text-[14px] font-normal" style={{ fontFamily: 'var(--font-heading)' }}>
                  <BathIcon className="w-5 h-5" />
                  {property.baths}
                </span>
              )}
              {area && (
                <span className="flex items-center gap-1 text-white text-[14px] font-normal" style={{ fontFamily: 'var(--font-heading)' }}>
                  <SqftIcon className="w-5 h-5" />
                  {area}
                </span>
              )}
            </div>

            {price && (
              <span className="ml-auto text-white text-[28px] font-bold leading-none" style={{ fontFamily: 'var(--font-heading)' }}>
                {price}
              </span>
            )}
          </div>

          {/* WhatsApp button */}
          <a
            href={generateWhatsAppLink({ property })}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-16 right-4 bg-[#25D366] hover:bg-[#20BD5A] text-white p-2 rounded-full transition-all duration-200 hover:scale-110 z-10"
            onClick={(e) => e.stopPropagation()}
            aria-label="Consultar por WhatsApp"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>

        {/* Footer */}
        <div className="px-4 py-3">
          <h3 className="text-[16px] font-medium text-[#0F172A] leading-snug line-clamp-2 mb-0.5" style={{ fontFamily: 'var(--font-heading)' }}>
            {property.name}
          </h3>
          <p className="text-[13px] text-[#878787] leading-tight">
            {property.location?.city}
          </p>
        </div>
      </Link>
    </article>
  );
};

export default FeaturedPropertyCard;
