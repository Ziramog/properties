import CheckIcon from './icons/CheckIcon';
import SectionTitle from './shared/SectionTitle';

const features = [
  { label: 'Bedrooms', value: 'beds' },
  { label: 'Bathrooms', value: 'baths' },
  { label: 'Sq.Feet', value: 'square_feet' },
  { label: 'Year Built', value: 'yearBuilt' },
  { label: 'Property type', value: 'type' },
];

const PropertyDetails = ({ property }) => {
  const coveredArea = property.covered_area;

  return (
    <main className="space-y-4">
      {/* Features grid — matches Senada style */}
      <div className="bg-white rounded-2xl p-6 md:p-8">
        <SectionTitle>Features</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {features.map(({ label, value }) => {
            const val = property[value];
            if (val == null) return null;
            return (
              <div key={value} className="text-center">
                <p className="text-2xl font-bold text-[#0F172A] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                  {typeof val === 'number' ? val.toLocaleString('es-AR') : val}
                </p>
                <p className="text-sm text-[#666]">{label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Description */}
      {property.description && (
        <div className="bg-white rounded-2xl p-6 md:p-8">
          <SectionTitle>Descripción de la Propiedad</SectionTitle>
          <p className="text-[#555] leading-relaxed whitespace-pre-line">{property.description}</p>
        </div>
      )}

      {/* Additional Info */}
      {(property.titles_status || property.garage != null || property.operation || coveredArea) && (
        <div className="bg-white rounded-2xl p-6 md:p-8">
          <SectionTitle>Información Adicional</SectionTitle>
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
            {coveredArea && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#999] mb-1">Área Cubierta</p>
                <p className="text-[#0F172A] font-medium text-sm">{coveredArea.toLocaleString('es-AR')} m²</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interior */}
      {property.interior && (property.interior.aberturas || property.interior.pisos || property.interior.calefaccion) && (
        <div className="bg-white rounded-2xl p-6 md:p-8">
          <SectionTitle>Interior</SectionTitle>
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
          <SectionTitle>Exterior</SectionTitle>
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
          <SectionTitle>Comodidades</SectionTitle>
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
          <SectionTitle>Servicios</SectionTitle>
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
    </main>
  );
};

export default PropertyDetails;
