'use client';
import { useState } from 'react';

export default function StepPreview({ wizardState, isGenerating, generatedPDFUrl, onGenerate, onBack }) {
  const { properties, client, payment, customization } = wizardState;
  const totalValue = properties.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Resumen y generación</h2>

      <div className="space-y-4">
        {/* Propiedades */}
        <div className="bg-[#F9F9F9] rounded-xl p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#999] mb-2">Propiedades ({properties.length})</p>
          {properties.map((p, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-[#eee] last:border-0">
              {p.images?.[0]?.url && <img src={p.images[0].url} alt="" className="w-10 h-10 rounded-lg object-cover" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.name}</p>
                <p className="text-xs text-[#999]">{p.location?.city || ''}</p>
              </div>
              <span className="text-sm font-semibold">{p.price || '—'}</span>
            </div>
          ))}
          <div className="flex justify-between pt-2 mt-1 border-t border-[#ddd]">
            <span className="text-sm font-semibold">Valor total</span>
            <span className="text-sm font-bold text-[var(--color-brand)]">U$D {totalValue.toLocaleString('es-AR')}</span>
          </div>
        </div>

        {/* Cliente */}
        <div className="bg-[#F9F9F9] rounded-xl p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#999] mb-1">Cliente</p>
          <p className="text-sm font-medium">{client.name}</p>
          {client.email && <p className="text-xs text-[#666]">{client.email}</p>}
          {client.phone && <p className="text-xs text-[#666]">{client.phone}</p>}
        </div>

        {/* Pago */}
        <div className="bg-[#F9F9F9] rounded-xl p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#999] mb-1">Pago</p>
          <p className="text-sm capitalize">{payment.type === 'contado' ? 'Contado' : 'Financiado'}</p>
          {payment.downPaymentPct > 0 && <p className="text-xs text-[#666]">{payment.downPaymentPct}% anticipo</p>}
          {payment.installments > 0 && <p className="text-xs text-[#666]">{payment.installments} cuotas</p>}
        </div>

        {/* Generar PDF */}
        {generatedPDFUrl ? (
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-sm font-semibold text-green-700 mb-2">✅ PDF generado correctamente</p>
            <a href={generatedPDFUrl} target="_blank" rel="noopener noreferrer"
              className="inline-block bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-sm font-bold px-6 py-2.5 rounded-lg transition-colors uppercase tracking-wider">
              Descargar PDF
            </a>
          </div>
        ) : (
          <button onClick={onGenerate} disabled={isGenerating}
            className="w-full bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-sm font-bold px-6 py-3 rounded-lg transition-colors uppercase tracking-wider disabled:opacity-40">
            {isGenerating ? 'Generando PDF...' : 'Generar Propuesta'}
          </button>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="text-sm text-[#666] hover:text-[#333] px-4 py-2.5">← Atrás</button>
      </div>
    </div>
  );
}
