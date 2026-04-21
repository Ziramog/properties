import Image from 'next/image';
import Link from 'next/link';
import { FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';

const PropertyCard = ({ property, isSelected = false, onMouseEnter, onMouseLeave }) => {
  const getRateDisplay = () => {
    if (property.rates?.sale) {
      return 'En Venta';
    }
    if (property.price) {
      return property.price;
    }
    if (property.rates?.monthly) {
      return `$${property.rates.monthly.toLocaleString()}/mes`;
    } else if (property.rates?.weekly) {
      return `$${property.rates.weekly.toLocaleString()}/sem`;
    } else if (property.rates?.nightly) {
      return `$${property.rates.nightly.toLocaleString()}/noche`;
    }
    return 'Consultar';
  };

  return (
    <Link
      href={`/properties/${property._id}`}
      className={`
        block bg-white rounded-xl overflow-hidden shadow-md transition-all duration-200
        hover:shadow-xl hover:scale-[1.02]
        ${isSelected ? 'ring-2 ring-[#E94560]' : ''}
      `}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.images?.[0] || 'https://via.placeholder.com/400x300'}
          alt={property.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-[#E94560] text-white text-xs font-semibold px-3 py-1 rounded-full">
            {property.type}
          </span>
        </div>
      </div>

      <div className="p-4">
        <p className="text-2xl font-bold text-[#1A1A2E] mb-1">
          {getRateDisplay()}
        </p>

        <h3 className="text-sm font-medium text-gray-700 line-clamp-1 mb-2">
          {property.name}
        </h3>

        <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
          <span>{property.location?.city}</span>
          {property.location?.state && (
            <>, <span>{property.location.state}</span></>
          )}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-600 border-t pt-3">
          {property.beds != null && (
            <span className="flex items-center gap-1">
              <FaBed className="text-[#E94560]" />
              {property.beds}
            </span>
          )}
          {property.baths != null && (
            <span className="flex items-center gap-1">
              <FaBath className="text-[#E94560]" />
              {property.baths}
            </span>
          )}
          {property.square_feet != null && (
            <span className="flex items-center gap-1">
              <FaRulerCombined className="text-[#E94560]" />
              {property.square_feet} m²
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
