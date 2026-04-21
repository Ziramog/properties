import Link from 'next/link';
import Image from 'next/image';
import BedIcon from './icons/BedIcon';
import BathtubIcon from './icons/BathtubIcon';
import AreaIcon from './icons/AreaIcon';

const FeaturedPropertyCard = ({ property }) => {
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
      className="block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={property.images?.[0] || 'https://via.placeholder.com/600x400'}
          alt={property.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-[#E94560] text-white text-xs font-semibold px-3 py-1 rounded-full">
            Destacada
          </span>
        </div>
        <div className="absolute bottom-3 left-3 bg-[#1A1A2E] text-white px-3 py-1 rounded-lg">
          <span className="font-semibold">{getRateDisplay()}</span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 text-[#E94560] text-sm font-medium mb-1">
          <span>{property.type}</span>
        </div>

        <h3 className="text-lg font-semibold text-[#1A1A2E] line-clamp-1 mb-2">
          {property.name}
        </h3>

        <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
          <span>{property.location?.city}</span>
          {property.location?.state && <span>, {property.location.state}</span>}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-600 pt-3 border-t">
          {property.beds != null && (
            <span className='flex items-center gap-1.5'>
              <BedIcon className='w-4 h-4' />
              {property.beds} <span className='hidden sm:inline'>Dorm.</span>
            </span>
          )}
          {property.baths != null && (
            <span className='flex items-center gap-1.5'>
              <BathtubIcon className='w-4 h-4' />
              {property.baths} <span className='hidden sm:inline'>Ba&ntilde;os</span>
            </span>
          )}
          {property.square_feet != null && (
            <span className='flex items-center gap-1.5'>
              <AreaIcon className='w-4 h-4' />
              {property.square_feet} <span className='hidden sm:inline'>m&sup2;</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default FeaturedPropertyCard;
