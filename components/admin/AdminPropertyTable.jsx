'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import deleteProperty from '@/app/actions/deleteProperty';
import { toast } from 'react-toastify';

const AdminPropertyTable = ({ properties = [] }) => {
  const router = useRouter();
  const [items, setItems] = useState(properties);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterOp, setFilterOp] = useState('');
  const [filterFeatured, setFilterFeatured] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = items;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.location?.city?.toLowerCase().includes(q)
      );
    }
    if (filterType) result = result.filter(p => p.type === filterType);
    if (filterOp) result = result.filter(p => p.operation === filterOp);
    if (filterFeatured === 'yes') result = result.filter(p => p.is_featured);
    if (filterFeatured === 'no') result = result.filter(p => !p.is_featured);
    if (filterStatus) result = result.filter(p => p.status === filterStatus);
    return result;
  }, [items, search, filterType, filterOp, filterFeatured, filterStatus]);

  const handleDelete = async (id, name) => {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    const res = await deleteProperty(id);
    if (res?.error) { toast.error(res.error); return; }
    setItems(prev => prev.filter(p => p._id !== id));
    toast.success('Propiedad eliminada');
    router.refresh();
  };

  const handleToggleFeatured = async (id) => {
    const res = await fetch('/api/admin/toggle-featured', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (data.success) {
      setItems(prev => prev.map(p => p._id === id ? { ...p, is_featured: !p.is_featured } : p));
      toast.success(data.is_featured ? 'Destacada' : 'No destacada');
      router.refresh();
    }
  };

  const typeLabels = {
    Casa: '🏠 Casa', Departamento: '🏢 Depto', Terreno: '🌳 Terreno',
    Campo: '🌾 Campo', 'Inmueble Comercial': '🏪 Comercial', 'Gran Inversión': '💰 Inversión',
  };

  const hasActiveFilters = search || filterType || filterOp || filterFeatured || filterStatus;

  const clearFilters = () => {
    setSearch(''); setFilterType(''); setFilterOp(''); setFilterFeatured(''); setFilterStatus('');
  };

  const selectCls = 'text-[12px] bg-[#F6F6F6] border border-[#eee] rounded-lg px-3 py-2 text-[#333] outline-none focus:border-[var(--color-brand)] transition-colors w-full';

  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-3 md:px-6 py-4 border-b border-[#eee]">
        <h2 className="text-[16px] md:text-[20px] font-semibold text-[#0F172A]" style={{ fontFamily: 'var(--font-heading)' }}>
          {filtered.length} {filtered.length === 1 ? 'propiedad' : 'propiedades'}
        </h2>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-[11px] text-[#999] hover:text-[var(--color-brand)] uppercase tracking-wider font-medium">
              Limpiar
            </button>
          )}
          <Link href="/properties/add" className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-[12px] md:text-[13px] font-bold uppercase tracking-wider px-4 md:px-5 py-2.5 rounded-[6px] transition-colors flex-shrink-0">
            + Agregar
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="px-3 md:px-6 py-3 border-b border-[#eee]">
        {/* Search row */}
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text" placeholder="Buscar por nombre o ciudad..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-[13px] bg-[#F6F6F6] border border-[#eee] rounded-lg outline-none focus:border-[var(--color-brand)] transition-colors"
            />
          </div>
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden text-[11px] text-[#666] uppercase tracking-wider font-medium flex-shrink-0 px-3 py-2 border border-[#eee] rounded-lg"
          >
            {showMobileFilters ? 'Ocultar' : 'Filtros'}
          </button>
        </div>

        {/* Filter selects — desktop: always visible, mobile: toggleable */}
        <div className={`${showMobileFilters || 'hidden'} md:flex md:flex-wrap md:items-center md:gap-3 mt-2`}>
          <div className="grid grid-cols-2 md:flex gap-2 md:gap-3">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={selectCls}>
              <option value="">Tipo: Todos</option>
              <option value="Casa">Casa</option>
              <option value="Departamento">Departamento</option>
              <option value="Campo">Campo</option>
              <option value="Terreno">Terreno</option>
              <option value="Inmueble Comercial">Comercial</option>
            </select>
            <select value={filterOp} onChange={(e) => setFilterOp(e.target.value)} className={selectCls}>
              <option value="">Operación: Todas</option>
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
            </select>
            <select value={filterFeatured} onChange={(e) => setFilterFeatured(e.target.value)} className={selectCls}>
              <option value="">★ Destacada: Todas</option>
              <option value="yes">Sí</option>
              <option value="no">No</option>
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={selectCls}>
              <option value="">Estado: Todos</option>
              <option value="active">Activa</option>
              <option value="pending">Pendiente</option>
              <option value="closed">Vendida</option>
              <option value="coming_soon">Próximo</option>
              <option value="active_under_contract">Bajo Contrato</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#eee] text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-[#999]">
              <th className="px-3 md:px-6 py-3 font-medium">Propiedad</th>
              <th className="px-2 md:px-4 py-3 font-medium hidden md:table-cell">Tipo</th>
              <th className="px-2 md:px-4 py-3 font-medium hidden md:table-cell">Operación</th>
              <th className="px-2 md:px-4 py-3 font-medium hidden md:table-cell">Precio</th>
              <th className="px-2 md:px-4 py-3 font-medium hidden md:table-cell">Fotos</th>
              <th className="px-2 md:px-4 py-3 font-medium text-center">Dest.</th>
              <th className="px-3 md:px-6 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f5f5f5]">
            {filtered.map(prop => (
              <tr key={prop._id} className="hover:bg-[#fafafa] transition-colors">
                <td className="px-3 md:px-6 py-3">
                  <Link href={`/properties/${prop._id}`} className="text-[13px] md:text-[14px] font-semibold text-[#0F172A] hover:text-[var(--color-brand)] transition-colors block leading-tight truncate max-w-[160px] md:max-w-none">
                    {prop.name}
                  </Link>
                  <p className="text-[12px] text-[#999] mt-0.5">{prop.location?.city || '—'}</p>
                </td>
                <td className="px-2 md:px-4 py-3 hidden md:table-cell">
                  <span className="text-[13px] text-[#555]">{typeLabels[prop.type] || prop.type}</span>
                </td>
                <td className="px-2 md:px-4 py-3 hidden md:table-cell">
                  <span className={`text-[12px] font-semibold uppercase px-2 py-1 rounded-[4px] ${
                    prop.operation === 'venta' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {prop.operation === 'venta' ? 'Venta' : prop.operation === 'alquiler' ? 'Alquiler' : prop.operation}
                  </span>
                </td>
                <td className="px-2 md:px-4 py-3 hidden md:table-cell">
                  <span className="text-[13px] font-semibold text-[#0F172A]">{prop.price || 'Consultar'}</span>
                </td>
                <td className="px-2 md:px-4 py-3 hidden md:table-cell">
                  <span className="text-[13px] text-[#555]">{(prop.images || []).length}</span>
                </td>
                <td className="px-2 md:px-4 py-3 text-center">
                  <button onClick={() => handleToggleFeatured(prop._id)}
                    className={`text-lg transition-colors ${prop.is_featured ? 'text-[var(--color-brand)]' : 'text-[#ddd] hover:text-[var(--color-brand)]'}`}
                    title={prop.is_featured ? 'Quitar destacada' : 'Marcar destacada'}
                  >★</button>
                </td>
                <td className="px-3 md:px-6 py-3 text-right">
                  <div className="flex items-center justify-end gap-1 md:gap-2">
                    <Link href={`/properties/${prop._id}/edit`}
                      className="inline-flex items-center justify-center md:gap-1.5 bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-[13px] font-semibold w-8 h-8 md:w-auto md:px-4 md:py-2 rounded-[6px] transition-colors"
                      title="Editar">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      <span className="hidden md:inline">Editar</span>
                    </Link>
                    <button onClick={() => handleDelete(prop._id, prop.name)}
                      className="inline-flex items-center justify-center md:gap-1.5 text-[12px] font-medium text-[#999] hover:text-red-600 w-8 h-8 md:w-auto md:px-3 md:py-1.5 border border-[#eee] hover:border-red-300 rounded-[6px] transition-colors"
                      title="Eliminar">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21h-8.276a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"/></svg>
                      <span className="hidden md:inline">Eliminar</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-[#999] text-[14px]">
                  No se encontraron propiedades.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPropertyTable;
