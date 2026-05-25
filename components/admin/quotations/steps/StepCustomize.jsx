'use client';
export default function StepCustomize({ data, onChange, onNext, onBack }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Personalizar propuesta</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] mb-1">Template</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'modern', label: 'Modern', desc: 'Clean & profesional' },
              { id: 'luxury', label: 'Luxury', desc: 'Elegante' },
              { id: 'minimal', label: 'Minimal', desc: 'Simple' },
            ].map(t => (
              <button key={t.id} onClick={() => update('template', t.id)}
                className={`p-4 rounded-xl border text-center transition-colors ${data.template === t.id ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/5' : 'border-[#eee] hover:border-[#ddd]'}`}>
                <p className="text-sm font-semibold">{t.label}</p>
                <p className="text-xs text-[#999] mt-1">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between bg-[#F9F9F9] rounded-xl px-4 py-3">
          <div>
            <p className="text-sm font-medium text-[#0F172A]">Descripción con IA</p>
            <p className="text-xs text-[#666]">MiniMax genera un párrafo persuasivo para la propuesta</p>
          </div>
          <button onClick={() => update('showAIDescription', !data.showAIDescription)}
            className={`relative w-12 h-7 rounded-full transition-colors ${data.showAIDescription ? 'bg-[var(--color-brand)]' : 'bg-zinc-300'}`}>
            <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${data.showAIDescription ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
          </button>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] mb-1">Notas generales</label>
          <textarea value={data.agentNotes || ''} onChange={(e) => update('agentNotes', e.target.value)} rows={3}
            className="w-full border border-[#ddd] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brand)]" placeholder="Notas personalizadas para el cliente..." />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] mb-1">Válido hasta</label>
          <input type="date" value={data.validUntil || ''} onChange={(e) => update('validUntil', e.target.value)}
            className="w-full border border-[#ddd] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brand)]" />
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="text-sm text-[#666] hover:text-[#333] px-4 py-2.5">← Atrás</button>
        <button onClick={onNext}
          className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-sm font-bold px-6 py-2.5 rounded-lg transition-colors uppercase tracking-wider">
          Continuar
        </button>
      </div>
    </div>
  );
}