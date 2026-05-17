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
  { value: 'residential', label: 'Residential' },
  { value: 'multi_family', label: 'Multi Family' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
];
const STATUS_CHECKBOXES = [
  { value: 'active', label: 'Active' },
  { value: 'active_under_contract', label: 'Active Under Contract' },
  { value: 'closed', label: 'Closed' },
  { value: 'coming_soon', label: 'Coming soon' },
  { value: 'pending', label: 'Pending' },
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

  const [focused, setFocused] = useState({
    term: false, type: false, area: false, price: false, bedrooms: false, baths: false,
  });

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

  return (
    <div className="search-form" style={{ border: '1px solid #2a2626', borderRadius: '8px', background: 'transparent' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', lineHeight: '1.2', color: '#fff', padding: '20px 20px 0', margin: 0, fontWeight: 400 }}>
        Búsqueda de Propiedades
      </h1>
      <form onSubmit={handleSubmit} className="searchForm" style={{ position: 'relative', zIndex: 1 }}>
        <div className="top-part" style={{
          padding: '20px', borderRadius: '12px', background: '#000',
          display: 'flex', flexWrap: 'wrap', gap: 0, marginTop: '16px', marginLeft: '20px', marginRight: '20px',
        }}>
          {/* City / term — elatus-autocomplete */}
          <div className="form-group elatus-autocomplete w-full min-[651px]:w-full min-[992px]:w-1/2 xl:w-[22%]" style={{
            position: 'relative', borderRight: '1px solid #2a2626',
          }} onFocus={() => setFocused((p) => ({ ...p, term: true }))} onBlur={() => setFocused((p) => ({ ...p, term: false }))}>
            <svg style={{
              position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
              width: '19px', height: '19px', zIndex: 9, filter: 'brightness(0) invert(1)',
            }} viewBox="0 0 24 24" fill="currentColor"><path d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.39zM11 18a7 7 0 1 1 7-7 7 7 0 0 1-7 7z"/></svg>
            <label className={`animated-label ${labelActive('term') ? 'active' : ''}`} style={{
              position: 'absolute', color: labelActive('term') ? '#fff' : '#a29696', fontSize: labelActive('term') ? '12px' : '16px',
              fontWeight: labelActive('term') ? '500' : '400', zIndex: 9, left: '50px', top: labelActive('term') ? '-15px' : '10px',
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

          {/* Type — type-group */}
          <FormGroup name="tipo" label="Tipo" active={labelActive('type')}
            className="w-full min-[651px]:w-1/2 min-[992px]:w-1/6"
            onFocus={() => setFocused((p) => ({ ...p, type: true }))}
            onBlur={() => setFocused((p) => ({ ...p, type: false }))}>
            <select name="tipo" value={filters.tipo} onChange={handleChange} style={{ width: '100%', maxWidth: '100%', background: '#000', border: 'none', color: '#a29696', fontSize: '16px', fontWeight: 400, outline: 'none', paddingRight: '20px' }}>
              <option value="" hidden disabled></option>
              {TIPO_OPTIONS.filter((t) => t.value).map((t) => <option key={t.value} value={t.value} style={{ background: '#000' }}>{t.label}</option>)}
            </select>
          </FormGroup>

          {/* Area — sqfeet-group */}
          <FormGroup name="area" label="Sq.Feet" active={labelActive('area')}
            className="w-full min-[651px]:w-1/2 min-[992px]:w-1/3 xl:w-[14%]"
            onFocus={() => setFocused((p) => ({ ...p, area: true }))}
            onBlur={() => setFocused((p) => ({ ...p, area: false }))}>
            <select name="area" value={filters.area} onChange={handleChange} style={{ width: '100%', maxWidth: '100%', background: '#000', border: 'none', color: '#a29696', fontSize: '16px', fontWeight: 400, outline: 'none', paddingRight: '20px' }}>
              <option value="" hidden disabled></option>
              {AREA_RANGES.filter((r) => r.value).map((r) => <option key={r.value} value={r.value} style={{ background: '#000' }}>{r.label}</option>)}
            </select>
          </FormGroup>

          {/* Price — price-group */}
          <FormGroup name="price" label="Price" active={labelActive('price')}
            className="w-full min-[651px]:w-1/2 min-[992px]:w-1/3 xl:w-[15%]"
            onFocus={() => setFocused((p) => ({ ...p, price: true }))}
            onBlur={() => setFocused((p) => ({ ...p, price: false }))}>
            <select name="price" value={filters.price} onChange={handleChange} style={{ width: '100%', maxWidth: '100%', background: '#000', border: 'none', color: '#a29696', fontSize: '16px', fontWeight: 400, outline: 'none', paddingRight: '20px' }}>
              <option value="" hidden disabled></option>
              {PRECIO_RANGES.filter((r) => r.value).map((r) => <option key={r.value} value={r.value} style={{ background: '#000' }}>{r.label}</option>)}
            </select>
          </FormGroup>

          {/* Bedrooms — bedrooms-group */}
          <FormGroup name="bedrooms" label="Bedrooms" active={labelActive('bedrooms')}
            className="w-full min-[651px]:w-1/2 min-[992px]:w-1/3 xl:w-[11%]"
            onFocus={() => setFocused((p) => ({ ...p, bedrooms: true }))}
            onBlur={() => setFocused((p) => ({ ...p, bedrooms: false }))}>
            <select name="bedrooms" value={filters.bedrooms} onChange={handleChange} style={{ width: '100%', maxWidth: '100%', background: '#000', border: 'none', color: '#a29696', fontSize: '16px', fontWeight: 400, outline: 'none', paddingRight: '20px' }}>
              <option value="" hidden disabled></option>
              {BEDROOM_OPTS.filter((o) => o).map((o) => <option key={o} value={o} style={{ background: '#000' }}>{o}+</option>)}
            </select>
          </FormGroup>

          {/* Baths — baths-group */}
          <FormGroup name="baths" label="Baths" active={labelActive('baths')}
            className="w-full min-[651px]:w-1/2 min-[992px]:w-1/3 xl:w-[11%]"
            onFocus={() => setFocused((p) => ({ ...p, baths: true }))}
            onBlur={() => setFocused((p) => ({ ...p, baths: false }))}>
            <select name="baths" value={filters.baths} onChange={handleChange} style={{ width: '100%', maxWidth: '100%', background: '#000', border: 'none', color: '#a29696', fontSize: '16px', fontWeight: 400, outline: 'none', paddingRight: '20px' }}>
              <option value="" hidden disabled></option>
              {BATH_OPTS.filter((o) => o).map((o) => <option key={o} value={o} style={{ background: '#000' }}>{o}+</option>)}
            </select>
          </FormGroup>

          {/* Search button */}
          <button type="submit" className="btn btn-primary btnSubmit" style={{
            background: 'var(--color-brand)', color: '#fff', border: 'none',
            fontSize: '13px', fontWeight: 700, textTransform: 'uppercase',
            padding: '0 24px', borderRadius: '4px', cursor: 'pointer',
            whiteSpace: 'nowrap', height: '40px', alignSelf: 'center',
            letterSpacing: '0.06em', transition: 'opacity 0.2s',
            marginLeft: '10px', flexShrink: 0,
          }} onMouseEnter={(e) => e.target.style.opacity = '0.85'} onMouseLeave={(e) => e.target.style.opacity = '1'}>
            Search
          </button>
        </div>

        {/* Bottom-part expandable filters */}
        <div className="bottom-part" style={{
          display: expanded ? 'block' : 'none',
          background: '#000', borderRadius: '12px', padding: '20px',
          marginTop: '1px', marginLeft: '20px', marginRight: '20px',
        }}>
          <div className="inner" style={{
            display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '20px',
          }}>
            <div className="left">
              <p style={{ color: '#a29696', fontSize: '14px', textTransform: 'uppercase', margin: '0 0 15px' }}>Property type</p>
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
              <p style={{ color: '#a29696', fontSize: '14px', textTransform: 'uppercase', margin: '0 0 15px' }}>Status</p>
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
      </form>

      {/* Toggle + Reset */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 20px 20px' }}>
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
          {expanded ? 'Standard Search' : 'Advanced Search'}
        </button>
      </div>
    </div>
  );
}

function FormGroup({ name, label, active, onFocus, onBlur, children, className = '' }) {
  return (
    <div className={`form-group notranslate ${name}-group ${className}`} style={{
      position: 'relative', borderRight: '1px solid #2a2626', marginBottom: 0, padding: 0, outline: 'none',
    }} tabIndex={-1} onFocus={onFocus} onBlur={onBlur}>
      <label className={`animated-label ${active ? 'active' : ''}`} style={{
        position: 'absolute', color: active ? '#fff' : '#a29696', fontSize: active ? '12px' : '16px',
        fontWeight: active ? '500' : '400', zIndex: 9, left: '15px', top: active ? '-15px' : '10px',
        pointerEvents: 'none', transition: 'all 0.3s ease-in-out',
      }}>{label}</label>
      {children}
    </div>
  );
}
