'use client';
import Link from 'next/link';
import Image from 'next/image';
import { FaBed, FaBath, FaRegHeart, FaWhatsapp } from 'react-icons/fa';
import AreaIcon from './icons/AreaIcon';
import { getAreaDisplay, getPriceDisplay, getPropertyImage, isNewListing } from '@/utils/propertyDisplay';
import { generateWhatsAppLink } from '@/utils/whatsapp';

const FeaturedPropertyCard = ({ property }) => {
  const image = getPropertyImage(property);
  const area = getAreaDisplay(property);
  const price = getPriceDisplay(property);
  const isNew = isNewListing(property);

  // Status: determine badge variant
  const status = property.status;
  const statusLabel = status === 'available' ? 'Disponible'
    : status === 'rented' ? 'Arrendado'
    : status === 'consult' ? 'A consultar'
    : null;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-[0_4px_16px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15),0_4px_16px_rgba(0,0,0,0.08)] hover:-translate-y-1">
      <Link href={`/properties/${property._id}`} className="block">
        {/* Image — fixed 210px height per demo */}
        <div className="relative h-[210px] overflow-hidden bg-gray-100">
          <Image
            src={image}
            alt={property.name}
            fill
            className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Price badge */}
          {price && (
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-[var(--color-ink)] text-white text-[13px] font-semibold px-[10px] py-1 rounded-[6px] shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                {price}
              </span>
            </div>
          )}

          {/* Status badge — stacked below price when price exists, otherwise top-left */}
          {statusLabel && (
            <div className={`absolute z-10 ${price ? 'top-[52px]' : 'top-3'} left-3`}>
              <span
                className={`
                  text-[11px] font-bold px-[10px] py-1 rounded-[6px]
                  uppercase tracking-wider
                  ${status === 'available' ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]' : ''}
                  ${status === 'rented' ? 'bg-[var(--color-warn-bg)] text-[var(--color-warn)]' : ''}
                  ${status === 'consult' ? 'bg-white text-[var(--color-brand)] border border-[var(--color-brand)]' : ''}
                `}
              >
                {statusLabel}
              </span>
            </div>
          )}

          {/* Heart icon */}
          <button
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all duration-200 shadow-sm z-10"
            onClick={(e) => e.preventDefault()}
            aria-label="Guardar propiedad"
          >
            <FaRegHeart className="w-4 h-4" />
          </button>

          {/* WhatsApp */}
          <a
            href={generateWhatsAppLink({ property })}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 bg-whatsapp hover:bg-whatsapp-hover text-white p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110 z-10"
            onClick={(e) => e.stopPropagation()}
            aria-label="Consultar por WhatsApp"
          >
            <FaWhatsapp className="w-4 h-4" />
          </a>
        </div>

        {/* Content — padding per demo: 16px 18px 18px */}
        <div className="p-4 pl-[18px] pr-[18px] pb-[18px]">
          {/* Title */}
          <h3 className="text-[15px] font-semibold text-heading leading-[1.4] line-clamp-2 mb-1.5">
            {property.name}
          </h3>

          {/* Location */}
          <p className="text-[13px] text-[var(--color-ink-tertiary)] mb-3.5 line-clamp-1 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-[var(--color-ink-tertiary)] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {property.location?.city}
          </p>

          {/* Divider */}
          <div className="h-px bg-[var(--color-border)] mb-3.5" />

          {/* Specs Row */}
          <div className="flex items-center gap-4 text-[13px] font-medium text-[var(--color-ink-secondary)]">
            {property.beds != null && (
              <span className="flex items-center gap-1.5">
                <FaBed className="w-4 h-4 text-[var(--color-ink-tertiary)]" />
                {property.beds} Dorm.
              </span>
            )}
            {property.baths != null && (
              <span className="flex items-center gap-1.5">
                <FaBath className="w-4 h-4 text-[var(--color-ink-tertiary)]" />
                {property.baths} Baños
              </span>
            )}
            {area && (
              <span className="flex items-center gap-1.5">
                <AreaIcon className="w-4 h-4 text-[var(--color-ink-tertiary)]" />
                {area}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default FeaturedPropertyCard;
