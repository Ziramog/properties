export const dynamic = 'force-dynamic';

import Link from 'next/link';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import { convertToSerializeableObject } from '@/utils/convertToObject';
import AdminPropertyTable from '@/components/admin/AdminPropertyTable';

const FILTER_PILLS = [
  { label: 'Todos', param: 'todos', value: '' },
  { label: 'Casas', param: 'type', value: 'Casa' },
  { label: 'Dptos', param: 'type', value: 'Departamento' },
  { label: 'Campos', param: 'type', value: 'Campo' },
  { label: 'Terrenos', param: 'type', value: 'Terreno' },
  { label: 'Comerciales', param: 'type', value: 'Inmueble Comercial' },
  { label: '★ Destacadas', param: 'featured', value: '1' },
  { label: 'Venta', param: 'operation', value: 'venta' },
  { label: 'Alquiler', param: 'operation', value: 'alquiler' },
];

const AdminPropertiesPage = async ({ searchParams }) => {
  await connectDB();

  const { type, featured, operation } = searchParams;
  const filter = {};
  if (type && type !== 'Todos') filter.type = type;
  if (featured === '1') filter.is_featured = true;
  if (operation) filter.operation = operation;

  const properties = await Property.find(filter).sort({ createdAt: -1 }).lean();
  const serialized = properties.map(p => convertToSerializeableObject(p));

  const buildHref = (param, value) => {
    const params = new URLSearchParams();
    if (param !== 'todos') {
      if (type && param !== 'type' && param !== 'todos') params.set('type', type);
      if (featured && param !== 'featured' && param !== 'todos') params.set('featured', featured);
      if (operation && param !== 'operation' && param !== 'todos') params.set('operation', operation);
      params.set(param, value);
    }
    const qs = params.toString();
    return `/admin/properties${qs ? `?${qs}` : ''}`;
  };

  const isActive = (pill) => {
    if (pill.param === 'todos') return !type && !featured && !operation;
    if (pill.param === 'type') return type === pill.value && !featured && !operation;
    if (pill.param === 'featured') return featured === '1';
    if (pill.param === 'operation') return operation === pill.value && !type && !featured;
    return false;
  };

  return (
    <div className="p-3 md:p-6">
      <Link href="/admin" className="inline-flex items-center gap-1 text-[var(--color-brand)] hover:underline text-sm font-medium mb-3">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
        Volver al Panel de Control
      </Link>

      <h1 className="text-[24px] md:text-[36px] font-normal text-[#0F172A] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
        Propiedades
      </h1>

      {/* Filter pills */}
      <div className="overflow-x-auto mb-4 -mx-3 md:-mx-6 px-3 md:px-6">
        <div className="flex gap-2 min-w-max pb-1">
          {FILTER_PILLS.map((pill) => (
            <Link
              key={pill.label}
              href={buildHref(pill.param, pill.value)}
              className={`flex-shrink-0 text-[12px] font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-colors ${
                isActive(pill)
                  ? 'bg-[var(--color-brand)] text-white'
                  : 'bg-white border border-[#ddd] text-[#666] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]'
              }`}
            >
              {pill.label}
            </Link>
          ))}
        </div>
      </div>

      <AdminPropertyTable properties={serialized} />
    </div>
  );
};

export default AdminPropertiesPage;
