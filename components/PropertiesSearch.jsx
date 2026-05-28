'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const TIPO_OPTIONS = [
  { value: '', label: '' },
  { value: 'Casa', label: 'Casa' },
  { value: 'Departamento', label: 'Departamento' },
  { value: 'Terreno', label: 'Terreno' },
  { value: 'Campo', label: 'Campo' },
  { value: 'Inmueble Comercial', label: 'Inmueble Comercial' },
];
const PRECIO_RANGES = [
  { value: '', label: '' },
  { value: '0-100000', label: 'Hasta U$S 100,000' },
  { value: '100000-300000', label: 'U$S 100,000-300,000' },
  { value: '300000-500000', label: 'U$S 300,000-500,000' },
  { value: '500000-1000000', label: 'U$S 500,000-1,000,000' },
  { value: '1000000-2000000', label: 'U$S 1,000,000-2,000,000' },
  { value: '2000000-0', label: '>U$S 2,000,000' },
];
const AREA_RANGES = [
  { value: '', label: '' },
  { value: '0-500', label: '0-500 m²' },
  { value: '500-1000', label: '500-1000 m²' },
  { value: '1000-2000', label: '1000-2000 m²' },
  { value: '2000-5000', label: '2000-5000 m²' },
  { value: '5000-0', label: '> 5000 m²' },
];
const BEDROOM_OPTS = ['', '1', '2', '3', '4', '5+'];
const BATH_OPTS = ['', '1', '2', '3', '4', '5+'];
const PROPERTY_TYPES_CHECKBOXES = [
  { value: 'residential', label: 'Residencial' },
  { value: 'multi_family', label: 'Multi Familiar' },
  { value: 'land', label: 'Terreno' },
  { value: 'commercial', label: 'Comercial' },
  { value: 'industrial', label: 'Industrial' },
];
const STATUS_CHECKBOXES = [
  { value: 'NUEVA', label: 'Nueva' },
  { value: 'PRECIO MEJORADO', label: 'Precio Mejorado' },
  { value: 'ULTIMA UNIDAD', label: 'Última Unidad' },
  { value: 'UNICO EN SU TIPO', label: 'Único en su Tipo' },
];

export default function PropertiesSearch({ currentFilters = {}, onFilter, title = 'Búsqueda de Propiedades', isFiltered = false }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [citySearch, setCitySearch] = useState(currentFilters.term || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchVisible, setSearchVisible] = useState(!isFiltered);
  const cityInputRef = useRef(null);
  const suggestionTimerRef = useRef(null);

  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    if (!openDropdown) return;
    const handleClick = (e) => {
      if (!e.target.closest('[data-dropdown]')) setOpenDropdown(null);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [openDropdown]);

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

  const [focused, setFocused] = useState({ term: false });

  const labelActive = (field) => {
    if (field === 'term') return focused.term || filters.term !== '';
    if (field === 'type') return focused.type || filters.tipo !== '';
    if (field === 'area') return focused.area || filters.area !== '';
    if (field === 'price') return focused.price || filters.price !== '';
    if (field === 'bedrooms') return focused.bedrooms || filters.bedrooms !== '';
    if (field === 'baths') return focused.baths || filters.baths !== '';
    return false;
  };

  const precioRanges = PRECIO_RANGES;

  const FILTER_CONFIG = [
    { name: 'tipo', label: 'Tipo',
      options: TIPO_OPTIONS.filter((t) => t.value).map((t) => ({ value: t.value, label: t.label })),
      className: 'w-full min-[651px]:w-1/2 min-[992px]:w-1/6' },
    { name: 'area', label: 'Superficie',
      options: AREA_RANGES.filter((r) => r.value).map((r) => ({ value: r.value, label: r.label })),
      className: 'w-full min-[651px]:w-1/2 min-[992px]:w-1/3 xl:w-[14%]' },
    { name: 'price', label: 'Precio',
      options: PRECIO_RANGES.filter((r) => r.value).map((r) => ({ value: r.value, label: r.label })),
      className: 'w-full min-[651px]:w-1/2 min-[992px]:w-1/3 xl:w-[15%]' },
    { name: 'bedrooms', label: 'Dormitorios',
      options: BEDROOM_OPTS.filter((o) => o).map((o) => ({ value: o, label: o + '+' })),
      className: 'w-full min-[651px]:w-1/2 min-[992px]:w-1/3 xl:w-[11%]' },
    { name: 'baths', label: 'Baños',
      options: BATH_OPTS.filter((o) => o).map((o) => ({ value: o, label: o + '+' })),
      className: 'w-full min-[651px]:w-1/2 min-[992px]:w-1/3 xl:w-[11%]' },
  ];

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
    if (onFilter) {
      onFilter(filters);
    } else {
      window.location.href = `/properties${query ? `?${query}` : ''}`;
    }
  };

  const handleReset = () => {
    setFilters({
      term: '', address: '', tipo: '', operation: 'venta', area: '',
      price: '', bedrooms: '', baths: '', 'property-type': [], status: [], sort: 'price-desc',
    });
    setCitySearch('');
    if (onFilter) {
      onFilter(null);
    } else {
      router.push('/properties');
    }
  };

  return (
    <div className="search-form" style={{ background: '#000' }}>
      <div className="js-animate pb-4 text-center">
        <h1 className="text-[28px] md:text-[40px] font-normal text-white leading-tight" style={{ fontFamily: 'var(--font-heading)', margin: 0 }}>
          {title}
        </h1>
      </div>
      {!searchVisible && (
        <div className="text-center pb-4">
          <button
            type="button"
            onClick={() => setSearchVisible(true)}
            className="text-[#a29696] text-[12px] uppercase tracking-wider hover:text-white transition-colors"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Mostrar búsqueda
          </button>
        </div>
      )}
      {searchVisible && (
      <form onSubmit={handleSubmit} className="searchForm" style={{ border: '1px solid #2a2626', borderRadius: '8px', background: '#000', position: 'relative', zIndex: 1 }}>
        <div className="top-part py-3 min-[651px]:py-5" style={{
          borderRadius: '12px', background: '#000',
          display: 'flex', flexWrap: 'wrap', gap: 0, marginTop: '16px',
        }}>
          {/* City / term — elatus-autocomplete */}
          <div className="form-group elatus-autocomplete w-full min-[651px]:w-full min-[992px]:w-1/2 xl:w-[22%] border-r border-[#2a2626] max-[650px]:border-r-0 max-[650px]:border-b max-[650px]:border-[#2a2626]" style={{
            position: 'relative',
          }} onFocus={() => setFocused((p) => ({ ...p, term: true }))} onBlur={() => setFocused((p) => ({ ...p, term: false }))}>
            <svg style={{
              position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
              width: '19px', height: '19px', zIndex: 9, filter: 'brightness(0) invert(1)',
            }} viewBox="0 0 24 24" fill="currentColor"><path d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.39zM11 18a7 7 0 1 1 7-7 7 7 0 0 1-7 7z"/></svg>
            <label className={`animated-label ${focused.term || filters.term ? 'active' : ''}`} style={{
              position: 'absolute', color: focused.term || filters.term ? '#fff' : '#a29696', fontSize: focused.term || filters.term ? '12px' : '16px',
              fontWeight: focused.term || filters.term ? '500' : '400', zIndex: 9, left: '50px', top: focused.term || filters.term ? '-15px' : '10px',
              pointerEvents: 'none', transition: 'all 0.3s ease-in-out',
            }}>Ciudad o código</label>
            <div className="input-wrap" style={{ display: 'flex', gap: '15px' }}>
              <input
                ref={cityInputRef}
                type="text" name="term" autoComplete="off"
                value={citySearch}
                onChange={(e) => { setCitySearch(e.target.value); handleChange(e); }}
                onFocus={() => { setShowCityDropdown(true); setFocused((p) => ({ ...p, term: true })); }}
                onBlur={() => { setTimeout(() => setShowCityDropdown(false), 200); setFocused((p) => ({ ...p, term: false })); }}
                style={{ color: '#a29696', background: 'transparent', fontSize: '16px', fontWeight: 400, border: '1px solid transparent', paddingLeft: '50px', width: '100%', outline: 'none' }}
              />
            </div>
            {showCityDropdown && suggestions.length > 0 && (
              <div style={{ position: 'absolute', zIndex: 50, top: '100%', left: 0, right: 0, marginTop: '1px', background: '#000', border: '1px solid #2a2626', borderRadius: '8px', overflow: 'hidden' }}>
                <ul style={{ maxHeight: '240px', overflowY: 'auto', margin: 0, padding: 0, listStyle: 'none' }}>
                  {suggestions.map((s, i) => (
                    <li key={i} onMouseDown={() => handleCitySelect(s.label || s)}
                      style={{ padding: '12px 16px', color: '#fff', fontSize: '14px', cursor: 'pointer', borderBottom: '1px solid #2a2626' }}
                      onMouseEnter={(e) => e.target.style.background = '#1a1a1a'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >{s.label || s}</li>
                  ))}
                </ul>
              </div>
            )}
            {showCityDropdown && citySearch.length >= 2 && suggestions.length === 0 && !isLoading && (
              <div style={{ position: 'absolute', zIndex: 50, top: '100%', left: 0, right: 0, marginTop: '1px', background: '#000', border: '1px solid #2a2626', borderRadius: '8px', padding: '12px 16px' }}>
                <p style={{ color: '#a29696', fontSize: '13px', margin: 0, textTransform: 'uppercase' }}>No results found!</p>
              </div>
            )}
          </div>

          {/* Filter dropdowns (Tipo, Superficie, Precio, Dormitorios, Baños) */}
          {FILTER_CONFIG.map((f) => {
            const isOpen = openDropdown === f.name;
            const hasValue = filters[f.name] !== '';
            const currentLabel = f.options.find((o) => o.value === filters[f.name])?.label || f.label;
            return (
              <div key={f.name} data-dropdown={f.name}
                className={`form-group notranslate ${f.name}-group ${f.className} border-r border-[#2a2626] max-[650px]:border-r-0 max-[650px]:border-b max-[650px]:border-[#2a2626]`}
                style={{ position: 'relative', marginBottom: 0, padding: 0, outline: 'none' }}>
                <label className={`animated-label ${isOpen || hasValue ? 'active' : ''}`} style={{
                  position: 'absolute', color: isOpen || hasValue ? '#fff' : '#a29696',
                  fontSize: isOpen || hasValue ? '12px' : '16px',
                  fontWeight: isOpen || hasValue ? '500' : '400', zIndex: 9, left: '15px',
                  top: isOpen || hasValue ? '-15px' : '10px',
                  pointerEvents: 'none', transition: 'all 0.3s ease-in-out',
                }}>{f.label}</label>
                <div onClick={() => setOpenDropdown(isOpen ? null : f.name)}
                  className="w-full h-10 flex items-center justify-between cursor-pointer px-3"
                  style={{ color: hasValue ? '#fff' : '#a29696', fontSize: '16px' }}>
                  <span>{hasValue ? currentLabel : ''}</span>
                  <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#888', flexShrink: 0 }}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
                {isOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-[#2a2626] rounded-xl py-2 z-50 shadow-xl max-h-[250px] overflow-y-auto">
                    {f.options.map((o) => (
                      <div key={o.value}
                        onClick={() => { handleChange({ target: { name: f.name, value: o.value } }); setOpenDropdown(null); }}
                        className="h-12 px-4 flex items-center cursor-pointer hover:bg-white/5 transition-colors">
                        <span className={`text-sm px-3 py-1.5 rounded-lg ${filters[f.name] === o.value ? 'bg-[var(--color-brand)] text-white font-semibold' : 'text-white/70'}`}>
                          {o.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Search button */}
          <button type="submit" className="btn btn-primary btnSubmit" style={{
            background: 'var(--color-brand)', color: '#fff', border: 'none',
            fontSize: '13px', fontWeight: 700, textTransform: 'uppercase',
            padding: '0 24px', borderRadius: '4px', cursor: 'pointer',
            whiteSpace: 'nowrap', height: '40px', alignSelf: 'center',
            letterSpacing: '0.06em', transition: 'opacity 0.2s',
            marginLeft: '10px', flexShrink: 0,
          }} onMouseEnter={(e) => e.target.style.opacity = '0.85'} onMouseLeave={(e) => e.target.style.opacity = '1'}>
            Buscar
          </button>
        </div>

        {/* Bottom-part expandable filters — slide animation */}
        <div style={{
          maxHeight: expanded ? '450px' : '0',
          opacity: expanded ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 500ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease',
        }}>
          <div className="bottom-part" style={{
            background: '#000', borderRadius: '12px', padding: '20px 0',
            marginTop: '1px',
          }}>
          <div className="inner grid-cols-1 min-[601px]:grid-cols-[2fr_3fr]" style={{ gap: '20px', display: 'grid' }}>
            <div className="left">
              <p style={{ color: '#a29696', fontSize: '14px', textTransform: 'uppercase', margin: '0 0 15px' }}>Tipo de Propiedad</p>
              <div className="filter-wrapper" style={{ display: 'grid', columnGap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
                {PROPERTY_TYPES_CHECKBOXES.map((pt) => (
                  <div key={pt.value} className="custom-checkbox-wrapper" style={{ marginBottom: '10px' }}>
                    <label style={{
                      color: '#fff', fontSize: '13px', paddingLeft: '25px',
                      position: 'relative', cursor: 'pointer', display: 'inline-block',
                    }}>
                      <input type="checkbox" name="property-type" value={pt.value}
                        checked={(filters['property-type'] || []).includes(pt.value)}
                        onChange={handleChange}
                        style={{ position: 'absolute', opacity: 0, cursor: 'pointer' }}
                      />
                      <span style={{
                        position: 'absolute', left: 0, top: '1px', width: '14px', height: '14px',
                        background: '#403941', borderRadius: '2px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {(filters['property-type'] || []).includes(pt.value) && (
                          <svg viewBox="0 0 12 12" width="10" height="10" fill="#fff"><path d="M10 2L4.5 7.5 2 5" stroke="#fff" strokeWidth="2" fill="none"/></svg>
                        )}
                      </span>
                      {pt.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="right">
              <p style={{ color: '#a29696', fontSize: '14px', textTransform: 'uppercase', margin: '0 0 15px' }}>Estado</p>
              <div className="filter-wrapper" style={{ display: 'grid', columnGap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
                {STATUS_CHECKBOXES.map((st) => (
                  <div key={st.value} className="custom-checkbox-wrapper" style={{ marginBottom: '10px' }}>
                    <label style={{
                      color: '#fff', fontSize: '13px', paddingLeft: '25px',
                      position: 'relative', cursor: 'pointer', display: 'inline-block',
                    }}>
                      <input type="checkbox" name="status" value={st.value}
                        checked={(filters.status || []).includes(st.value)}
                        onChange={handleChange}
                        style={{ position: 'absolute', opacity: 0, cursor: 'pointer' }}
                      />
                      <span style={{
                        position: 'absolute', left: 0, top: '1px', width: '14px', height: '14px',
                        background: '#403941', borderRadius: '2px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {(filters.status || []).includes(st.value) && (
                          <svg viewBox="0 0 12 12" width="10" height="10" fill="#fff"><path d="M10 2L4.5 7.5 2 5" stroke="#fff" strokeWidth="2" fill="none"/></svg>
                        )}
                      </span>
                      {st.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </form>
      )}

      {searchVisible && (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0 20px' }}>
        <button type="button" onClick={handleReset}
          style={{ background: 'none', border: 'none', color: '#919191', fontSize: '12px', cursor: 'pointer', textTransform: 'uppercase', padding: 0 }}
          onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
          onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
        >Limpiar</button>
        <button type="button" onClick={() => setExpanded(!expanded)}
          style={{
            background: 'none', border: 'none', color: '#919191', fontSize: '12px',
            cursor: 'pointer', textTransform: 'uppercase', padding: 0,
            display: 'flex', alignItems: 'center', gap: '5px',
          }}
          onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
          onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
        >
          <span style={{
            display: 'inline-block', width: '10px', height: '10px',
            background: expanded
              ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23919191'%3E%3Cpath d='M19 13H5v-2h14v2z'/%3E%3C/svg%3E\") center/contain no-repeat"
              : "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23919191'%3E%3Cpath d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/%3E%3C/svg%3E\") center/contain no-repeat",
          }} />
          {expanded ? 'Búsqueda Simple' : 'Búsqueda Avanzada'}
        </button>
      </div>
      )}
    </div>
  );
}
