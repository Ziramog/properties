'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const PropertyFilters = ({ variant = 'hero' }) => {
  const router = useRouter();
  const [filters, setFilters] = useState({
    type: 'Todos',
    city: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
  });

  const propertyTypes = [
    'Todos',
    'Casa',
    'Departamento',
    'Campo',
    'Terreno',
    'Inmueble Comercial',
    'Gran Inversión',
  ];

  const cities = [
    'Todas las ciudades',
    'Alta Gracia',
    'Anisacate',
    'Despeñaderos',
    'Falda del Carmen',
    'Huerta Grande',
    'La Paisanita',
    'La Serranita',
    'Los Aromos',
    'Los Gigantes',
    'Los Molinos',
    'Potrero de Garay',
    'San Clemente',
    'Santa Ana',
  ];

  const bedroomOptions = ['', '1+', '2+', '3+', '4+', '5+'];

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (filters.type && filters.type !== 'Todos') params.set('type', filters.type);
    if (filters.city && filters.city !== 'Todas las ciudades') params.set('city', filters.city);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.bedrooms) params.set('bedrooms', filters.bedrooms);

    const query = params.toString();
    router.push(`/properties${query ? `?${query}` : ''}`);
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-center">
        <select
          name="type"
          value={filters.type}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E94560]"
        >
          {propertyTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select
          name="city"
          value={filters.city}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E94560]"
        >
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <button
          type="submit"
          className="px-4 py-2 bg-[#E94560] text-white rounded-lg text-sm font-medium hover:bg-[#d13d54] transition-colors"
        >
          Buscar
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-xs text-gray-600 mb-1 font-medium">Tipo</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560]"
          >
            {propertyTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1 font-medium">Ciudad</label>
          <select
            name="city"
            value={filters.city}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560]"
          >
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1 font-medium">Precio Mín.</label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="USD"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560]"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1 font-medium">Precio Máx.</label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder="USD"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E94560]"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1 font-medium">Dormitorios</label>
          <div className="flex gap-1">
            {bedroomOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setFilters({ ...filters, bedrooms: opt })}
                className={`
                  flex-1 py-2 text-sm rounded-lg border transition-colors
                  ${filters.bedrooms === opt
                    ? 'bg-[#E94560] text-white border-[#E94560]'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-[#E94560]'
                  }
                `}
              >
                {opt || 'Any'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-[#E94560] text-white rounded-lg font-medium hover:bg-[#d13d54] transition-colors"
        >
          Aplicar Filtros
        </button>
      </div>
    </form>
  );
};

export default PropertyFilters;
