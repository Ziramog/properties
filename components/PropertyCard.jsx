'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FaBed, FaBath, FaRegHeart } from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa';
import AreaIcon from './icons/AreaIcon';
import { getAreaDisplay, getPriceDisplay, getPropertyImage, isNewListing } from '@/utils/propertyDisplay';
import { generateWhatsAppLink } from '@/utils/whatsapp';

const PropertyCard = ({ property, isSelected = false, onMouseEnter, onMouseLeave }) => {
  const image = getPropertyImage(property);
  const area = getAreaDisplay(property);
  const price = getPriceDisplay(property);
  const isNew = isNewListing(property);

  return (
    <div
      className={`
        group relative bg-white rounded-xl overflow-hidden border transition-all duration-300
        shadow-card hover:shadow-card-hover hover:-translate-y-1
        ${isSelected ? 'ring-2 ring-primary ring-offset-2 border-primary/30' : 'border-gray-100'}
      `}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link href={`/properties/${property._id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            src={image}
            alt={property.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Price overlay */}
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-navy/80 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-md">
              {price}
            </span>
          </div>

          {/* Heart */}
          <button
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all duration-200 shadow-sm z-10"
            onClick={(e) => e.preventDefault()}
            aria-label="Guardar propiedad"
          >
            <FaRegHeart className="w-3.5 h-3.5" />
          </button>

          {isNew && (
            <div className="absolute top-12 left-3 z-10">
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Nuevo
              </span>
            </div>
          )}

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

        <div className="p-4">
          <h3 className="text-sm font-bold text-heading leading-snug line-clamp-2 mb-1">
            {property.name}
          </h3>

          <p className="text-xs text-muted mb-3 line-clamp-1 flex items-center gap-1">
            <svg className="w-3 h-3 text-muted" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
            {property.location?.street
              ? `${property.location.street}, ${property.location?.city}`
              : `${property.location?.city}, ${property.location?.state}`}
          </p>

          <div className="flex items-center gap-4 text-xs text-muted border-t border-gray-100 pt-3">
            {property.beds != null && (
              <span className="flex items-center gap-1">
                <FaBed className="text-muted" />
                <span className="font-semibold text-body">{property.beds}</span>
              </span>
            )}
            {property.baths != null && (
              <span className="flex items-center gap-1">
                <FaBath className="text-muted" />
                <span className="font-semibold text-body">{property.baths}</span>
              </span>
            )}
            {area && (
              <span className="flex items-center gap-1">
                <AreaIcon className="w-3.5 h-3.5 text-muted" />
                <span className="font-semibold text-body">{area}</span>
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
