'use client';
import Link from 'next/link';
import Image from 'next/image';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import PropertyCardInfo from '@/components/PropertyCardInfo';
import { getAreaDisplay, getPriceDisplay, getPropertyImage, getStatusBadge } from '@/utils/propertyDisplay';
import { generateWhatsAppLink } from '@/utils/whatsapp';
import bookmarkProperty from '@/app/actions/bookmarkProperty';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-toastify';

const BedIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="9" width="20" height="11" rx="2"/>
    <path d="M0 18h24v2H0z"/>
    <path d="M7 9V6a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v3"/>
  </svg>
);

const BathIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
    <path d="M2 12h20v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-6z" fill="#fff"/>
    <path d="M6 12V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
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
  const badge = getStatusBadge(property);

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
            className="object-cover transition-transform duration-500 z-0 group-hover:scale-110"
            onLoad={() => setImgLoaded(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Gradient overlay — black default (bottom 1/5), orange on hover (bottom 1/5) */}
          <div className="absolute inset-0 z-10 group-hover:opacity-0 transition-opacity duration-300" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 20%, transparent 100%)' }} />
          <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(180deg, transparent 60%, var(--color-brand))' }} />

          {/* Status badge — top left */}
          {badge && (
            <span className={`absolute top-3 left-3 z-10 ${badge.bg} text-white text-[11px] font-bold px-2.5 py-1 rounded uppercase tracking-wider`}>
              {badge.label}
            </span>
          )}

          {/* Features overlay — bottom */}
          <div className="absolute bottom-0 left-0 right-0 z-10 flex items-end gap-3 px-4 pb-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
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
              <span
                className="ml-auto self-end text-white text-[32px] font-bold leading-none group-hover:scale-[1.1] transition-transform duration-300"
                style={{ fontFamily: 'var(--font-heading)', transformOrigin: 'right bottom' }}
              >
                {price}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <PropertyCardInfo property={property} />
      </Link>
    </article>
  );
};

export default FeaturedPropertyCard;
