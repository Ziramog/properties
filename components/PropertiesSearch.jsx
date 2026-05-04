'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaChevronDown, FaTimes } from 'react-icons/fa';

const TIPO_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'Casa', label: 'Casa' },
  { value: 'Departamento', label: 'Departamento' },
  { value: 'Terreno', label: 'Terreno' },
  { value: 'Campo', label: 'Campo' },
  { value: 'Inmueble Comercial', label: 'Inmueble Comercial' },
];
const PRECIO_RANGES = [
  { value: '0-100000', label: 'Hasta U$S 100,000' },
  { value: '100000-300000', label: 'U$S 100,000-300,000' },
  { value: '300000-500000', label: 'U$S 300,000-500,000' },
  { value: '500000-1000000', label: 'U$S 500,000-1,000,000' },
  { value: '1000000-2000000', label: 'U$S 1,000,000-2,000,000' },
  { value: '2000000-0', label: '>U$S 2,000,000' },
];
const AREA_RANGES = [
  { value: '0-500', label: '0-500 m²' },
  { value: '500-1000', label: '500-1000 m²' },
  { value: '1000-2000', label: '1000-2000 m²' },
  { value: '2000-5000', label: '2000-5000 m²' },
  { value: '5000-0', label: '> 5000 m²' },
];
const BEDROOM_OPTS = ['1', '2', '3', '4', '5+'];
const BATH_OPTS = ['1', '2', '3', '4', '5+'];
const PROPERTY_TYPES = [
  { value: 'residential', label: 'Casa' },
  { value: 'multi_family', label: 'Duplex' },
  { value: 'land', label: 'Terreno' },
  { value: 'commercial', label: 'Inmueble Comercial' },
  { value: 'industrial', label: 'Campo' },
];
const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'active_under_contract', label: 'Active Under Contract' },
  { value: 'pending', label: 'Pending' },
  { value: 'coming_soon', label: 'Coming Soon' },
  { value: 'closed', label: 'Closed' },
];

export default function PropertiesSearch({ currentFilters = {} }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [citySearch, setCitySearch] = useState(currentFilters.term || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const cityInputRef = useRef(null);
  const suggestionTimerRef = useRef(null);

  const [filters, setFilters] = useState({
    term: currentFilters.term || '',
    address: currentFilters.address || '',
    tipo: currentFilters.tipo || '',
    operation: currentFilters.operation || 'venta',
    area: currentFilters.area || '',
    price: currentFilters.price || '',
    minPrice: currentFilters.minPrice || '',
    maxPrice: currentFilters.maxPrice || '',
    bedrooms: currentFilters.bedrooms || '',
    baths: currentFilters.baths || '',
    'property-type': currentFilters['property-type'] || [],
    status: currentFilters.status || [],
    sort: currentFilters.sort || 'price-desc',
  });

  const precioRanges = PRECIO_RANGES;

  const fetchCitySuggestions = useCallback(async (query) => {
    if (query.length < 2) { setSuggestions([]); return; }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/autocomplete/cities?search=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.results || []);
      }
    } catch (err) {
      console.error('Autocomplete error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(suggestionTimerRef.current);
    if (citySearch.length >= 2) {
      suggestionTimerRef.current = setTimeout(() => fetchCitySuggestions(citySearch), 300);
    } else {
      setSuggestions([]);
    }
    return () => clearTimeout(suggestionTimerRef.current);
  }, [citySearch, fetchCitySuggestions]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFilters((prev) => ({
        ...prev,
        [name]: checked ? [...prev[name], value] : prev[name].filter((v) => v !== value),
      }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCitySelect = (city) => {
    setFilters((prev) => ({ ...prev, term: city }));
    setCitySearch(city);
    setSuggestions([]);
    setShowCityDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!filters.term && !filters.tipo && !filters.price && !filters.area && !filters.bedrooms && !filters.baths && !filters.status) {
      alert('Por favor, selecioná al menos un filtro para buscar.');
      return;
    }
    const params = new URLSearchParams();
    if (filters.term) params.set('term', filters.term);
    if (filters.address) params.set('address', filters.address);
    if (filters.tipo) params.set('type', filters.tipo);
    if (filters.operation) params.set('operation', filters.operation);
    if (filters.area) params.set('area', filters.area);
    if (filters.price) {
      const [min, max] = filters.price.split('-');
      if (min) params.set('minPrice', min);
      if (max && max !== '0') params.set('maxPrice', max);
    }
    if (filters.bedrooms) params.set('bedrooms', filters.bedrooms);
    if (filters.baths) params.set('baths', filters.baths);
    if (filters['property-type']?.length) params.set('propertyType', filters['property-type'].join('|'));
    if (filters.status?.length) params.set('status', filters.status.join('|'));
    if (filters.sort) params.set('sort', filters.sort);
    const query = params.toString();
    window.location.href = `/properties${query ? `?${query}` : ''}`;
  };

  const handleReset = () => {
    setFilters({
      term: '', address: '', tipo: '', operation: 'venta', area: '',
      price: '', bedrooms: '', baths: '', 'property-type': [], status: [], sort: 'price-desc',
    });
    setCitySearch('');
    router.push('/properties');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.term) count++;
    if (filters.address) count++;
    if (filters.tipo) count++;
    if (filters.area) count++;
    if (filters.price) count++;
    if (filters.bedrooms) count++;
    if (filters.baths) count++;
    if (filters['property-type']?.length) count++;
    if (filters.status?.length) count++;
    return count;
  };

  const activeCount = getActiveFilterCount();

  const inputCls = 'w-full bg-[#1a1a1a] border border-[#333] text-white text-sm py-2.5 px-3.5 rounded-lg focus:ring-2 focus:ring-[#F26B2E]/40 focus:border-[#F26B2E] outline-none placeholder:text-[#888] transition-all';
  const selectCls = 'w-full bg-[#1a1a1a] border border-[#333] text-white text-sm py-2.5 px-3.5 rounded-lg focus:ring-2 focus:ring-[#F26B2E]/40 focus:border-[#F26B2E] outline-none appearance-none cursor-pointer transition-all';
  const labelCls = 'text-[10px] font-bold uppercase tracking-widest text-[#aaa] mb-1.5 block';

  return (
    <div className="bg-[#111] rounded-2xl overflow-hidden border border-[#222] shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      <form onSubmit={handleSubmit}>
        <div className="p-4 md:p-5">
          <h1 className="text-[28px] md:text-[40px] font-normal text-white leading-tight mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Busqueda de Propiedades</h1>

          {/* ── SCREEN 1: Always visible ── */}
          <div className="space-y-3">
            {/* Keyword input */}
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none">
                <FaSearch className="w-4 h-4" />
              </span>
              <input
                ref={cityInputRef}
                type="text"
                name="term"
                value={citySearch}
                onChange={(e) => { setCitySearch(e.target.value); handleChange(e); }}
                onFocus={() => setShowCityDropdown(true)}
                onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
                placeholder="Ciudad, barrio, zona..."
                className={`${inputCls} pl-10`}
                autoComplete="off"
              />
              {showCityDropdown && suggestions.length > 0 && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-lg overflow-hidden">
                  <ul className="max-h-60 overflow-y-auto">
                    {suggestions.map((s, i) => (
                      <li key={i}
                        onMouseDown={() => handleCitySelect(s.label || s)}
                        className="px-3 py-2.5 text-sm text-white hover:bg-[#F26B2E] cursor-pointer transition-colors">
                        {s.label || s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {showCityDropdown && citySearch.length >= 2 && suggestions.length === 0 && !isLoading && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-lg p-3">
                  <p className="text-sm text-[#888]">No results found!</p>
                </div>
              )}
            </div>

            {/* Tipo + Precio on same row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <label className={labelCls}>Tipo</label>
                <select name="tipo" value={filters.tipo} onChange={handleChange} className={selectCls}>
                  {TIPO_OPTIONS.map((t) => <option key={t.value} value={t.value} className="bg-[#1a1a1a]">{t.label}</option>)}
                </select>
              </div>
              <div className="flex flex-col">
                <label className={labelCls}>Precio</label>
                <select name="price" value={filters.price} onChange={handleChange} className={selectCls}>
                  <option value="" className="bg-[#1a1a1a]">Cualquiera</option>
                  {precioRanges.map((r) => <option key={r.value} value={r.value} className="bg-[#1a1a1a]">{r.label}</option>)}
                </select>
              </div>
            </div>

            {/* Buscar button full width */}
            <button type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#F26B2E] hover:bg-[#C94E16] text-white font-bold py-3 rounded-lg text-sm uppercase tracking-wider transition-all shadow-md">
              <FaSearch className="w-4 h-4" />
              Buscar
            </button>

            {/* Advanced search link — always shown */}
            <div className="flex justify-center">
              <button type="button" onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#F26B2E] hover:text-[#C94E16] transition-colors">
                {expanded ? 'Mostrar menos' : 'Búsqueda Avanzada'}
                <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* ── SCREEN 2: Slides down when expanded ── */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
            <div className="border-t border-[#222] pt-4 space-y-3">
              {/* Superficie + Estado */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <label className={labelCls}>Superficie</label>
                  <select name="area" value={filters.area} onChange={handleChange} className={selectCls}>
                    <option value="" className="bg-[#1a1a1a]">Cualquiera</option>
                    {AREA_RANGES.map((r) => <option key={r.value} value={r.value} className="bg-[#1a1a1a]">{r.label}</option>)}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className={labelCls}>Estado</label>
                  <select name="status" value={filters.status[0] || ''} onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value ? [e.target.value] : [] }))} className={selectCls}>
                    <option value="" className="bg-[#1a1a1a]">Cualquiera</option>
                    {STATUS_OPTIONS.map((so) => <option key={so.value} value={so.value} className="bg-[#1a1a1a]">{so.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Dormitorios + Baños */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <label className={labelCls}>Dormitorios</label>
                  <select name="bedrooms" value={filters.bedrooms} onChange={handleChange} className={selectCls}>
                    <option value="" className="bg-[#1a1a1a]">Cualquiera</option>
                    {BEDROOM_OPTS.map((o) => <option key={o} value={o} className="bg-[#1a1a1a]">{o}+</option>)}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className={labelCls}>Baños</label>
                  <select name="baths" value={filters.baths} onChange={handleChange} className={selectCls}>
                    <option value="" className="bg-[#1a1a1a]">Cualquiera</option>
                    {BATH_OPTS.map((o) => <option key={o} value={o} className="bg-[#1a1a1a]">{o}+</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
