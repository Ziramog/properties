export const dynamic = 'force-dynamic';

import Link from 'next/link';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import { convertToSerializeableObject } from '@/utils/convertToObject';

const AdminCreateQuotePage = async () => {
  await connectDB();
  const properties = await Property.find({}).sort({ name: 1 }).lean();
  const serialized = properties.map(p => convertToSerializeableObject(p));

  return (
    <div className="p-4 md:p-6">
      <Link href="/admin/quotes" className="text-[var(--color-brand)] hover:underline text-sm font-medium mb-4 inline-block">
        ← Volver a Presupuestos
      </Link>
      <h1 className="text-[28px] md:text-[36px] font-normal text-[#0F172A] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
        Nuevo Presupuesto
      </h1>

      <form action="/app/actions/addQuote" method="POST" className="bg-white rounded-2xl p-6 md:p-8 shadow-sm max-w-3xl">
        {/* property selector */}
        <div className="mb-5">
          <label className="block text-[13px] font-bold text-[#333] uppercase tracking-wider mb-2">Propiedad</label>
          <select name="property" required className="w-full bg-white border border-[#ddd] rounded-lg px-4 py-3 text-sm text-[#333] outline-none focus:border-[var(--color-brand)] transition-colors">
            <option value="">Seleccionar propiedad...</option>
            {serialized.map(p => (
              <option key={p._id} value={p._id}>{p.name} — {p.location?.city || ''}</option>
            ))}
          </select>
        </div>

        {/* client fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div>
            <label className="block text-[13px] font-bold text-[#333] uppercase tracking-wider mb-2">Nombre del Cliente</label>
            <input type="text" name="clientName" required className="w-full bg-white border border-[#ddd] rounded-lg px-4 py-3 text-sm text-[#333] outline-none focus:border-[var(--color-brand)] transition-colors" />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#333] uppercase tracking-wider mb-2">Email</label>
            <input type="email" name="clientEmail" className="w-full bg-white border border-[#ddd] rounded-lg px-4 py-3 text-sm text-[#333] outline-none focus:border-[var(--color-brand)] transition-colors" />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#333] uppercase tracking-wider mb-2">Teléfono</label>
            <input type="tel" name="clientPhone" className="w-full bg-white border border-[#ddd] rounded-lg px-4 py-3 text-sm text-[#333] outline-none focus:border-[var(--color-brand)] transition-colors" />
          </div>
        </div>

        {/* items (line items) */}
        <div className="mb-5">
          <label className="block text-[13px] font-bold text-[#333] uppercase tracking-wider mb-3">Items</label>
          <div id="items-container" className="space-y-3">
            <div className="flex gap-3 items-start item-row">
              <input type="text" name="itemDescription" placeholder="Descripción" required className="flex-1 bg-white border border-[#ddd] rounded-lg px-4 py-3 text-sm text-[#333] outline-none focus:border-[var(--color-brand)]" />
              <input type="number" name="itemAmount" placeholder="Monto" required step="0.01" className="w-[140px] bg-white border border-[#ddd] rounded-lg px-4 py-3 text-sm text-[#333] outline-none focus:border-[var(--color-brand)]" />
              <select name="itemCurrency" className="w-[80px] bg-white border border-[#ddd] rounded-lg px-2 py-3 text-sm text-[#333] outline-none focus:border-[var(--color-brand)]">
                <option value="U$D">U$D</option>
                <option value="$">$</option>
              </select>
              <button type="button" onClick={() => {}} className="text-red-500 hover:text-red-700 px-2 py-3 text-sm remove-item" disabled>✕</button>
            </div>
          </div>
          <button
            type="button"
            className="mt-3 text-[var(--color-brand)] hover:underline text-sm font-medium"
            onClick={() => {
              const container = document.getElementById('items-container');
              const row = container.querySelector('.item-row').cloneNode(true);
              row.querySelectorAll('input').forEach(i => i.value = '');
              row.querySelector('.remove-item').disabled = false;
              row.querySelector('.remove-item').onclick = () => row.remove();
              container.appendChild(row);
            }}
          >
            + Agregar Item
          </button>
        </div>

        {/* extra fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-[13px] font-bold text-[#333] uppercase tracking-wider mb-2">Válido hasta</label>
            <input type="date" name="validUntil" className="w-full bg-white border border-[#ddd] rounded-lg px-4 py-3 text-sm text-[#333] outline-none focus:border-[var(--color-brand)] transition-colors" />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#333] uppercase tracking-wider mb-2">Notas</label>
            <input type="text" name="notes" className="w-full bg-white border border-[#ddd] rounded-lg px-4 py-3 text-sm text-[#333] outline-none focus:border-[var(--color-brand)] transition-colors" />
          </div>
        </div>

        <button
          type="submit"
          className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white font-bold text-sm px-8 py-3 rounded-lg transition-colors uppercase tracking-wider"
        >
          Crear Presupuesto
        </button>
      </form>
    </div>
  );
};

export default AdminCreateQuotePage;
