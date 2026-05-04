import BedIcon from './icons/BedIcon';
import BathtubIcon from './icons/BathtubIcon';
import AreaIcon from './icons/AreaIcon';
import PropertyNormalizedDescription from './PropertyNormalizedDescription';
import Link from 'next/link';

const CheckIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 16 16'>
    <path stroke='#22c55e' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='m2.5 8 3.5 3.5 7.5-8' />
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='1.5'>
    <path strokeLinecap='round' strokeLinejoin='round' d='M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' />
    <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z' />
  </svg>
);

const PropertyDetails = ({ property }) => {
  const beds = property.beds;
  const baths = property.baths;
  const area = property.square_feet;
  const coveredArea = property.covered_area;

  return (
    <main className="space-y-4">
      {/* Header Card */}
      <div className="bg-white rounded-2xl p-6 md:p-8">
        {/* Type badge */}
        {property.type && (
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#E94560] mb-3">
            {property.type}
          </span>
        )}

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] leading-tight mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {property.name}
        </h1>

        {/* Location */}
        <div className="flex items-start gap-1.5 text-[#666] mb-6">
          <MapPinIcon />
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.location.street}, ${property.location.city}, ${property.location.state}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:text-[#E94560] transition-colors"
          >
            {property.location.street}{property.location.street && property.location.city ? ', ' : ''}{property.location.city}{property.location.city && property.location.state ? ', ' : ''}{property.location.state}
          </a>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-6 md:gap-10 py-4 border-t border-b border-gray-100 mb-6">
          {beds != null && (
            <div className="flex items-center gap-2">
              <BedIcon />
              <span className="text-[#0F172A] font-semibold text-lg">{beds}</span>
              <span className="text-[#999] text-sm">{beds === 1 ? 'Dormitorio' : 'Dormitorios'}</span>
            </div>
          )}
          {baths != null && (
            <div className="flex items-center gap-2">
              <BathtubIcon />
              <span className="text-[#0F172A] font-semibold text-lg">{baths}</span>
              <span className="text-[#999] text-sm">{baths === 1 ? 'Baño' : 'Baños'}</span>
            </div>
          )}
          {area && (
            <div className="flex items-center gap-2">
              <AreaIcon />
              <span className="text-[#0F172A] font-semibold text-lg">{area.toLocaleString('es-AR')}</span>
              <span className="text-[#999] text-sm">m² total</span>
            </div>
          )}
          {coveredArea && (
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17" className="text-[#E94560]">
                <path stroke="#E94560" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 15.75V5.25M.75 14.25l1.5 1.5 1.5-1.5M3.75 6.75l-1.5-1.5-1.5 1.5M5.25 2.25h10.5M6.75.75l-1.5 1.5 1.5 1.5M14.25 3.75l1.5-1.5-1.5-1.5M7.75 8.95v4.8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4.8" />
              </svg>
              <span className="text-[#0F172A] font-semibold text-lg">{coveredArea.toLocaleString('es-AR')}</span>
              <span className="text-[#999] text-sm">m² cub.</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="text-3xl md:text-4xl font-bold text-[#E94560]" style={{ fontFamily: 'var(--font-heading)' }}>
            {property.price || 'Consultar'}
          </span>
          {property.price && (
            <span className="text-[#999] text-sm uppercase tracking-wide">USD</span>
          )}
        </div>

        {/* Operation type */}
        {property.operation && (
          <div className="mt-3">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#666] bg-gray-100 px-3 py-1 rounded-full">
              {property.operation === 'venta' ? 'Venta' : property.operation === 'alquiler' ? 'Alquiler' : property.operation}
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      {property.description && (
        <div className="bg-white rounded-2xl p-6 md:p-8">
          <h2 className="text-lg font-bold text-[#0F172A] mb-4 uppercase tracking-wide">Descripción</h2>
          <p className="text-[#555] leading-relaxed whitespace-pre-line">{property.description}</p>
        </div>
      )}

      {/* Normalized Description (highlights, details) */}
      <PropertyNormalizedDescription property={property} />

      {/* Interior */}
      {property.interior && (property.interior.aberturas || property.interior.pisos || property.interior.calefaccion) && (
        <div className="bg-white rounded-2xl p-6 md:p-8">
          <h2 className="text-lg font-bold text-[#0F172A] mb-4 uppercase tracking-wide">Interior</h2>
          <ul className="space-y-2">
            {property.interior.aberturas && (
              <li className="flex items-center gap-2"><CheckIcon /><span className="text-[#555]"><strong className="text-[#0F172A]">Aberturas:</strong> {property.interior.aberturas}</span></li>
            )}
            {property.interior.pisos && (
              <li className="flex items-center gap-2"><CheckIcon /><span className="text-[#555]"><strong className="text-[#0F172A]">Pisos:</strong> {property.interior.pisos}</span></li>
            )}
            {property.interior.calefaccion && (
              <li className="flex items-center gap-2"><CheckIcon /><span className="text-[#555]"><strong className="text-[#0F172A]">Calefacción:</strong> {property.interior.calefaccion}</span></li>
            )}
          </ul>
        </div>
      )}

      {/* Exterior */}
      {property.exterior && property.exterior.techos && (
        <div className="bg-white rounded-2xl p-6 md:p-8">
          <h2 className="text-lg font-bold text-[#0F172A] mb-4 uppercase tracking-wide">Exterior</h2>
          <ul className="space-y-2">
            {property.exterior.techos && (
              <li className="flex items-center gap-2"><CheckIcon /><span className="text-[#555]"><strong className="text-[#0F172A]">Techos:</strong> {property.exterior.techos}</span></li>
            )}
          </ul>
        </div>
      )}

      {/* Amenities */}
      {property.amenities && property.amenities.length > 0 && (
        <div className="bg-white rounded-2xl p-6 md:p-8">
          <h2 className="text-lg font-bold text-[#0F172A] mb-4 uppercase tracking-wide">Comodidades</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2">
            {property.amenities.map((amenity, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckIcon />
                <span className="text-[#555]">{amenity}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Services */}
      {property.services && property.services.length > 0 && (
        <div className="bg-white rounded-2xl p-6 md:p-8">
          <h2 className="text-lg font-bold text-[#0F172A] mb-4 uppercase tracking-wide">Servicios</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2">
            {property.services.map((service, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckIcon />
                <span className="text-[#555]">{service}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Property Info */}
      <div className="bg-white rounded-2xl p-6 md:p-8">
        <h2 className="text-lg font-bold text-[#0F172A] mb-4 uppercase tracking-wide">Detalles de la Propiedad</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
          {property.titles_status && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#999] mb-1">Estado de Títulos</p>
              <p className="text-[#0F172A] font-medium text-sm">{property.titles_status}</p>
            </div>
          )}
          {property.garage != null && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#999] mb-1">Cochera</p>
              <p className="text-[#0F172A] font-medium text-sm">{property.garage} {property.garage === 1 ? 'place' : 'places'}</p>
            </div>
          )}
          {property.operation && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#999] mb-1">Operación</p>
              <p className="text-[#0F172A] font-medium text-sm">{property.operation === 'venta' ? 'Venta' : property.operation === 'alquiler' ? 'Alquiler' : property.operation}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default PropertyDetails;
