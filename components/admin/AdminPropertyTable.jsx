'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import deleteProperty from '@/app/actions/deleteProperty';
import { toast } from 'react-toastify';

const AdminPropertyTable = ({ properties = [] }) => {
  const router = useRouter();
  const [items, setItems] = useState(properties);

  const handleDelete = async (id, name) => {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    const res = await deleteProperty(id);
    if (res?.error) {
      toast.error(res.error);
      return;
    }
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
    Casa: '🏠 Casa',
    Departamento: '🏢 Depto',
    Terreno: '🌳 Terreno',
    Campo: '🌾 Campo',
    'Inmueble Comercial': '🏪 Comercial',
    'Gran Inversión': '💰 Inversión',
  };

  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-sm">
      {/* Header row */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#eee]">
        <h2 className="text-[20px] font-semibold text-[#0F172A]" style={{ fontFamily: 'var(--font-heading)' }}>
          Propiedades
        </h2>
        <Link
          href="/properties/add"
          className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-[13px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-[6px] transition-colors"
        >
          + Agregar Propiedad
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#eee] text-[11px] font-bold uppercase tracking-wider text-[#999]">
              <th className="px-6 py-3 font-medium">Propiedad</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Tipo</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Operación</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Precio</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Fotos</th>
              <th className="px-4 py-3 font-medium text-center">Dest.</th>
              <th className="px-6 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f5f5f5]">
            {items.map(prop => (
              <tr key={prop._id} className="hover:bg-[#fafafa] transition-colors">
                {/* Name + location */}
                <td className="px-6 py-3">
                  <Link href={`/properties/${prop._id}`} className="text-[14px] font-semibold text-[#0F172A] hover:text-[var(--color-brand)] transition-colors block leading-tight">
                    {prop.name}
                  </Link>
                  <p className="text-[12px] text-[#999] mt-0.5">{prop.location?.city || '—'}</p>
                </td>
                {/* Type */}
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-[13px] text-[#555]">{typeLabels[prop.type] || prop.type}</span>
                </td>
                {/* Operation */}
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className={`text-[12px] font-semibold uppercase px-2 py-1 rounded-[4px] ${
                    prop.operation === 'venta' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {prop.operation === 'venta' ? 'Venta' : prop.operation === 'alquiler' ? 'Alquiler' : prop.operation}
                  </span>
                </td>
                {/* Price */}
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-[13px] font-semibold text-[#0F172A]">{prop.price || 'Consultar'}</span>
                </td>
                {/* Photos */}
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-[13px] text-[#555]">{(prop.images || []).length}</span>
                </td>
                {/* Featured toggle */}
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleToggleFeatured(prop._id)}
                    className={`text-lg transition-colors ${prop.is_featured ? 'text-[var(--color-brand)]' : 'text-[#ddd] hover:text-[var(--color-brand)]'}`}
                    title={prop.is_featured ? 'Quitar destacada' : 'Marcar destacada'}
                  >
                    ★
                  </button>
                </td>
                {/* Actions */}
                <td className="px-6 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/properties/${prop._id}/edit`}
                      className="inline-flex items-center gap-1.5 bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-[13px] font-semibold px-4 py-2 rounded-[6px] transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(prop._id, prop.name)}
                      className="text-[12px] font-medium text-[#999] hover:text-red-600 transition-colors px-3 py-1.5 border border-[#eee] rounded-[6px] hover:border-red-300"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-[#999] text-[14px]">
                  No hay propiedades. <Link href="/properties/add" className="text-[var(--color-brand)] font-medium hover:underline">Agregar la primera</Link>
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
