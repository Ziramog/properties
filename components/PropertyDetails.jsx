import BedIcon from './icons/BedIcon';
import BathtubIcon from './icons/BathtubIcon';
import AreaIcon from './icons/AreaIcon';
import MapIcon from './icons/MapIcon';
import PropertyLocationTabs from '@/components/PropertyLocationTabs';
import PropertyNormalizedDescription from '@/components/PropertyNormalizedDescription';

const CheckIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 16 16'>
    <path stroke='#22c55e' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='m2.5 8 3.5 3.5 7.5-8' />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 16 16'>
    <path stroke='#E94560' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='m3 3 10 10M13 3 3 13' />
  </svg>
);

const PropertyDetails = ({ property }) => {
  return (
    <main>
      <div className='bg-white p-6 rounded-2xl border border-[var(--color-border)] shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-center md:text-left'>
        <div className='text-[#E94560] mb-4 font-medium'>{property.type}</div>
        <h1 className='text-3xl font-bold mb-4 text-[#1A1A2E]'>{property.name}</h1>
        <div className='text-gray-500 mb-4 flex align-middle justify-center md:justify-start'>
          <MapIcon className="text-[#E94560] mt-1 mr-1 w-4 h-4" />
          <p className='text-[#E94560]'>
            {property.location.street}, {property.location.city}{' '}
            {property.location.state}
          </p>
        </div>

        <h3 className='text-lg font-bold my-6 bg-[#1A1A2E] text-white p-2'>
          Valor de Venta
        </h3>
        <div className='text-3xl font-bold text-[#E94560] mb-4 text-center'>
          {property.price || 'Consultar'}
        </div>
      </div>

      <PropertyNormalizedDescription property={property} />

      {property.interior && (property.interior.aberturas || property.interior.pisos || property.interior.calefaccion) && (
        <div className='bg-white p-6 rounded-2xl border border-[var(--color-border)] shadow-[0_2px_8px_rgba(0,0,0,0.06)] mt-4'>
          <h3 className='text-lg font-bold mb-4 text-[#1A1A2E]'>Interior</h3>
          <ul className='space-y-2 text-gray-600'>
            {property.interior.aberturas && (
              <li><strong>Aberturas:</strong> {property.interior.aberturas}</li>
            )}
            {property.interior.pisos && (
              <li><strong>Pisos:</strong> {property.interior.pisos}</li>
            )}
            {property.interior.calefaccion && (
              <li><strong>Calefacción:</strong> {property.interior.calefaccion}</li>
            )}
          </ul>
        </div>
      )}

      {property.exterior && property.exterior.techos && (
        <div className='bg-white p-6 rounded-2xl border border-[var(--color-border)] shadow-[0_2px_8px_rgba(0,0,0,0.06)] mt-4'>
          <h3 className='text-lg font-bold mb-4 text-[#1A1A2E]'>Exterior</h3>
          <ul className='space-y-2 text-gray-600'>
            {property.exterior.techos && (
              <li><strong>Techos:</strong> {property.exterior.techos}</li>
            )}
          </ul>
        </div>
      )}

      {property.services && property.services.length > 0 && (
        <div className='bg-white p-6 rounded-2xl border border-[var(--color-border)] shadow-[0_2px_8px_rgba(0,0,0,0.06)] mt-4'>
          <h3 className='text-lg font-bold mb-4 text-[#1A1A2E]'>Servicios</h3>
          <ul className='grid grid-cols-2 md:grid-cols-3 list-none space-y-2'>
            {property.services.map((service, index) => (
              <li key={index}>
                <CheckIcon /> {service}
              </li>
            ))}
          </ul>
        </div>
      )}

      {property.titles_status && (
        <div className='bg-white p-6 rounded-2xl border border-[var(--color-border)] shadow-[0_2px_8px_rgba(0,0,0,0.06)] mt-4'>
          <h3 className='text-lg font-bold mb-4 text-[#1A1A2E]'>Título</h3>
          <p className='text-gray-600'>{property.titles_status}</p>
        </div>
      )}

      <div className='bg-white p-6 rounded-2xl border border-[var(--color-border)] shadow-[0_2px_8px_rgba(0,0,0,0.06)] mt-4'>
        <h3 className='text-lg font-bold mb-6 text-[#1A1A2E]'>Comodidades</h3>

        <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 list-none space-y-2'>
          {property.amenities.map((amenity, index) => (
            <li key={index}>
              <CheckIcon /> {amenity}
            </li>
          ))}
        </ul>
      </div>
      <div className='bg-white p-6 rounded-2xl border border-[var(--color-border)] shadow-[0_2px_8px_rgba(0,0,0,0.06)] mt-4'>
        <h3 className='text-lg font-bold mb-4 text-[#1A1A2E]'>Ubicación</h3>
        <PropertyLocationTabs property={property} />
      </div>
    </main>
  );
};

export default PropertyDetails;
