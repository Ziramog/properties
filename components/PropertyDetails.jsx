import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaTimes,
  FaCheck,
  FaMapMarker,
} from 'react-icons/fa';
import PropertyMap from '@/components/PropertyMap';

const PropertyDetails = ({ property }) => {
  return (
    <main>
      <div className='bg-white p-6 rounded-lg shadow-md text-center md:text-left'>
        <div className='text-[#E94560] mb-4 font-medium'>{property.type}</div>
        <h1 className='text-3xl font-bold mb-4 text-[#1A1A2E]'>{property.name}</h1>
        <div className='text-gray-500 mb-4 flex align-middle justify-center md:justify-start'>
          <FaMapMarker className='text-[#E94560] mt-1 mr-1' />
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

      <div className='bg-white p-6 rounded-lg shadow-md mt-6'>
        <h3 className='text-lg font-bold mb-6 text-[#1A1A2E]'>Descripción y Detalles</h3>
        <div className='flex justify-center gap-4 text-[#E94560] mb-4 text-xl space-x-9'>
          <p>
            <FaBed className='inline-block mr-2' /> {property.beds}{' '}
            <span className='hidden sm:inline'>Dorm.</span>
          </p>
          <p>
            <FaBath className='inline-block mr-2' /> {property.baths}{' '}
            <span className='hidden sm:inline'>Baños</span>
          </p>
          <p>
            <FaRulerCombined className='inline-block mr-2' />
            {property.square_feet}{' '}
            <span className='hidden sm:inline'>m²</span>
          </p>
          {property.garage && (
            <p>
              <FaCheck className='inline-block mr-2' /> {property.garage}{' '}
              <span className='hidden sm:inline'>Garage</span>
            </p>
          )}
        </div>
        {property.covered_area && (
          <p className='text-gray-600 mb-2'>
            <strong>Cubierta:</strong> {property.covered_area} m²
          </p>
        )}
        <p className='text-gray-500 mb-4'>{property.description}</p>
      </div>

      {property.interior && (property.interior.aberturas || property.interior.pisos || property.interior.calefaccion) && (
        <div className='bg-white p-6 rounded-lg shadow-md mt-6'>
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
        <div className='bg-white p-6 rounded-lg shadow-md mt-6'>
          <h3 className='text-lg font-bold mb-4 text-[#1A1A2E]'>Exterior</h3>
          <ul className='space-y-2 text-gray-600'>
            {property.exterior.techos && (
              <li><strong>Techos:</strong> {property.exterior.techos}</li>
            )}
          </ul>
        </div>
      )}

      {property.services && property.services.length > 0 && (
        <div className='bg-white p-6 rounded-lg shadow-md mt-6'>
          <h3 className='text-lg font-bold mb-4 text-[#1A1A2E]'>Servicios</h3>
          <ul className='grid grid-cols-2 md:grid-cols-3 list-none space-y-2'>
            {property.services.map((service, index) => (
              <li key={index}>
                <FaCheck className='inline-block text-green-600 mr-2' /> {service}
              </li>
            ))}
          </ul>
        </div>
      )}

      {property.titles_status && (
        <div className='bg-white p-6 rounded-lg shadow-md mt-6'>
          <h3 className='text-lg font-bold mb-4 text-[#1A1A2E]'>Título</h3>
          <p className='text-gray-600'>{property.titles_status}</p>
        </div>
      )}

      <div className='bg-white p-6 rounded-lg shadow-md mt-6'>
        <h3 className='text-lg font-bold mb-6 text-[#1A1A2E]'>Comodidades</h3>

        <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 list-none space-y-2'>
          {property.amenities.map((amenity, index) => (
            <li key={index}>
              <FaCheck className='inline-block text-green-600 mr-2' /> {amenity}
            </li>
          ))}
        </ul>
      </div>
      <div className='bg-white p-6 rounded-lg shadow-md mt-6'>
        <PropertyMap property={property} />
      </div>
    </main>
  );
};

export default PropertyDetails;
