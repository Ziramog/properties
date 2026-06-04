'use client';
export default function StepCustomize({ data, onChange, onNext, onBack }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-white">Personalizar propuesta</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] mb-1">Template</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'modern', label: 'Modern', desc: 'Clean & profesional' },
              { id: 'luxury', label: 'Luxury', desc: 'Elegante' },
              { id: 'minimal', label: 'Minimal', desc: 'Simple' },
            ].map(t => (
              <button key={t.id} onClick={() => update('template', t.id)}
                className={`p-4 rounded-sm border text-center transition-colors ${data.template === t.id ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/10' : 'border-[#333] bg-[#1a1a1a] hover:border-[#444]'}`}>
                <p className="text-sm font-semibold text-white">{t.label}</p>
                <p className="text-xs text-[#999] mt-1">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-[#111] border border-[#222] rounded-sm px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Descripción con IA</p>
              <p className="text-xs text-[#888]">Genera un párrafo persuasivo y profesional para la propuesta</p>
            </div>
            <button onClick={() => update('showAIDescription', !data.showAIDescription)}
              className={`relative w-11 h-6 rounded-full transition-colors ${data.showAIDescription ? 'bg-[var(--color-brand)]' : 'bg-zinc-700'}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${data.showAIDescription ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {data.showAIDescription && (
            <div className="pt-2 border-t border-[#222]">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] mb-1">Tono de la IA</label>
              <select 
                value={data.aiMode || 'whatsapp'} 
                onChange={(e) => update('aiMode', e.target.value)}
                className="w-full bg-[#1a1a1a] text-white border border-[#333] rounded-sm px-3 py-2 text-sm outline-none focus:border-[var(--color-brand)]"
              >
                <option value="formal">Formal - Ideal para email institucional</option>
                <option value="whatsapp">WhatsApp - Cercano, breve y natural</option>
                <option value="comercial">Comercial - Orientado a conversión</option>
              </select>
            </div>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] mb-1">Notas generales</label>
          <textarea value={data.agentNotes || ''} onChange={(e) => update('agentNotes', e.target.value)} rows={3}
            className="w-full bg-[#1a1a1a] text-white border border-[#333] rounded-sm px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brand)]" placeholder="Notas personalizadas para el cliente..." />
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-brand)]">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999]">Válido hasta</label>
          </div>
          <input type="date" value={data.validUntil || ''} onChange={(e) => update('validUntil', e.target.value)}
            className="w-full bg-[#1a1a1a] text-white border border-[#333] rounded-sm px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brand)] [color-scheme:dark]" />
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="text-sm text-[#888] hover:text-white px-4 py-2.5 transition-colors">← Atrás</button>
        <button onClick={onNext}
          className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-sm font-bold px-6 py-2.5 rounded-sm transition-colors uppercase tracking-wider">
          Continuar
        </button>
      </div>
    </div>
  );
}