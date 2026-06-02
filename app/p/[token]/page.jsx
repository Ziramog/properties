import connectDB from '@/config/database';
import Quotation from '@/models/Quotation';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PublicQuotationPage({ params }) {
  const { token } = params;

  await connectDB();
  
  // Find and update tracking stats
  const quotation = await Quotation.findOneAndUpdate(
    { 'delivery.trackingToken': token },
    { 
      $inc: { 'delivery.openCount': 1 },
      $set: { 'delivery.openedAt': new Date() }
    },
    { new: true }
  ).lean();

  if (!quotation) {
    notFound();
  }

  const { client, properties, payment, customization, quoteNumber, totalValue } = quotation;

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white selection:bg-[var(--color-brand)] selection:text-white pb-20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F0F0F]/80 backdrop-blur-md border-b border-[#222]">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-widest uppercase">Property Pulse</h1>
            <p className="text-[10px] text-[#888] tracking-widest uppercase">Exclusive Proposal</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[#888] tracking-widest uppercase">Ref</p>
            <p className="text-sm font-semibold">{quoteNumber}</p>
          </div>
        </div>
      </header>

      <main className="pt-32 max-w-5xl mx-auto px-6">
        {/* Intro */}
        <section className="mb-16">
          <p className="text-sm text-[var(--color-brand)] font-semibold uppercase tracking-widest mb-4">Para: {client.name}</p>
          <h2 className="text-4xl md:text-6xl font-light mb-6 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Tu Propuesta <br />Inmobiliaria
          </h2>
          {customization?.aiDescription && (
            <div className="bg-[#161616] border border-[#222] p-6 rounded-sm max-w-3xl">
              <p className="text-[#bbb] leading-relaxed text-sm md:text-base">
                {customization.aiDescription}
              </p>
            </div>
          )}
        </section>

        {/* Properties */}
        <section className="mb-16">
          <h3 className="text-xs text-[#888] font-bold uppercase tracking-widest mb-6 border-b border-[#222] pb-2">Propiedades Seleccionadas</h3>
          <div className="space-y-12">
            {properties.map((prop, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#161616] border border-[#222] rounded-sm overflow-hidden group">
                <div className="h-[300px] md:h-[400px] relative overflow-hidden">
                  {prop.photos?.[0] ? (
                    <img 
                      src={prop.photos[0]} 
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#222] flex items-center justify-center text-[#555]">Sin imagen</div>
                  )}
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm">
                    {prop.operation}
                  </div>
                </div>
                <div className="p-8 md:pr-12">
                  <p className="text-[10px] text-[var(--color-brand)] font-bold uppercase tracking-wider mb-2">{prop.type}</p>
                  <h4 className="text-2xl font-light mb-2">{prop.title}</h4>
                  <p className="text-sm text-[#888] mb-6">{prop.address}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {prop.bedrooms && (
                      <div>
                        <p className="text-[10px] text-[#666] uppercase tracking-wider mb-1">Dormitorios</p>
                        <p className="text-lg font-medium">{prop.bedrooms}</p>
                      </div>
                    )}
                    {prop.bathrooms && (
                      <div>
                        <p className="text-[10px] text-[#666] uppercase tracking-wider mb-1">Baños</p>
                        <p className="text-lg font-medium">{prop.bathrooms}</p>
                      </div>
                    )}
                    {prop.surface && (
                      <div>
                        <p className="text-[10px] text-[#666] uppercase tracking-wider mb-1">Superficie</p>
                        <p className="text-lg font-medium">{prop.surface} m²</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-6 border-t border-[#333]">
                    <p className="text-[10px] text-[#666] uppercase tracking-wider mb-1">Valor</p>
                    <p className="text-3xl font-light">U$D {prop.price?.toLocaleString('es-AR')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Investment Summary */}
        <section className="mb-16">
          <h3 className="text-xs text-[#888] font-bold uppercase tracking-widest mb-6 border-b border-[#222] pb-2">Resumen de Inversión</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#161616] border border-[#222] p-8 rounded-sm">
              <p className="text-[10px] text-[var(--color-brand)] font-bold uppercase tracking-wider mb-6">Condiciones de Pago</p>
              
              {payment.type === 'contado' ? (
                <div>
                  <p className="text-4xl font-light mb-2">U$D {totalValue?.toLocaleString('es-AR')}</p>
                  <p className="text-sm text-[#888]">Pago de contado</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] text-[#666] uppercase tracking-wider mb-1">Anticipo ({payment.downPaymentPct}%)</p>
                    <p className="text-2xl font-light">U$D {payment.downPayment?.toLocaleString('es-AR')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#666] uppercase tracking-wider mb-1">Financiación</p>
                    <p className="text-2xl font-light">{payment.installments} cuotas de U$D {payment.installmentAmount?.toLocaleString('es-AR')}</p>
                  </div>
                  <div className="pt-4 border-t border-[#333]">
                    <p className="text-[10px] text-[var(--color-brand)] uppercase tracking-wider mb-1">Valor Final Financiado</p>
                    <p className="text-3xl font-light">U$D {payment.totalPaid?.toLocaleString('es-AR')}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            {(payment.notes || customization?.agentNotes) && (
              <div className="bg-[#161616] border border-[#222] p-8 rounded-sm">
                 <p className="text-[10px] text-[#888] font-bold uppercase tracking-wider mb-6">Notas Importantes</p>
                 <div className="space-y-4">
                   {payment.notes && (
                     <div>
                       <p className="text-sm text-[#bbb] leading-relaxed">{payment.notes}</p>
                     </div>
                   )}
                   {customization?.agentNotes && (
                     <div className={payment.notes ? 'pt-4 border-t border-[#333]' : ''}>
                       <p className="text-sm text-[#bbb] leading-relaxed">{customization.agentNotes}</p>
                     </div>
                   )}
                 </div>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-[#222] text-center">
           <p className="text-xs text-[#666]">Ante cualquier consulta, por favor contactanos respondiendo el mensaje con el que recibiste este enlace.</p>
           {customization?.validUntil && (
             <p className="text-xs text-[#444] mt-2">Validez de la propuesta: {new Date(customization.validUntil).toLocaleDateString('es-AR')}</p>
           )}
        </div>
      </main>
    </div>
  );
}
