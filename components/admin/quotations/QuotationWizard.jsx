'use client';
import { useState } from 'react';
import StepProperty from './steps/StepProperty';
import StepClient from './steps/StepClient';
import StepPayment from './steps/StepPayment';
import StepCustomize from './steps/StepCustomize';
import StepPreview from './steps/StepPreview';

const STEPS = [
  { id: 1, label: 'Propiedad', icon: '🏠' },
  { id: 2, label: 'Cliente', icon: '👤' },
  { id: 3, label: 'Pago', icon: '💳' },
  { id: 4, label: 'Diseño', icon: '🎨' },
  { id: 5, label: 'Generar', icon: '📄' },
];

export default function QuotationWizard() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPDFUrl, setGeneratedPDFUrl] = useState(null);
  const [generatedId, setGeneratedId] = useState(null);

  const [wizardState, setWizardState] = useState({
    properties: [],
    client: { name: '', email: '', phone: '', dni: '', notes: '' },
    payment: { type: 'contado', downPaymentPct: 30, downPayment: null, installments: null, installmentAmount: null, interestRate: null, notes: '' },
    customization: { template: 'modern', showAIDescription: false, aiDescription: null, agentNotes: '', validUntil: '' },
  });

  const updateState = (key, value) => setWizardState(prev => ({ ...prev, [key]: value }));
  const parsePrice = (val) => { if (!val) return 0; return parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0; };
  const totalPrice = wizardState.properties.reduce((sum, p) => sum + parsePrice(p.price), 0);

  // Calculate payment values from wizard state
  const paymentData = wizardState.payment;
  const calcDownPayment = paymentData.downPaymentPct ? totalPrice * (paymentData.downPaymentPct / 100) : 0;
  const calcInstallmentAmount = paymentData.installments ? (totalPrice - calcDownPayment) / paymentData.installments : 0;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Generate AI description if toggled
      let aiDescription = null;
      if (wizardState.customization.showAIDescription) {
        const firstProp = wizardState.properties[0];
        if (firstProp) {
          const aiRes = await fetch('/api/quotations/generate-ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              propertyTitle: firstProp.name || '',
              address: `${firstProp.location?.street || ''}, ${firstProp.location?.city || ''}`,
              type: firstProp.type || '',
              surface: firstProp.square_feet || null,
              bedrooms: firstProp.beds || null,
              bathrooms: firstProp.baths || null,
              priceUSD: totalPrice,
              clientName: wizardState.client.name || 'Cliente',
              agentNotes: wizardState.customization.agentNotes || '',
              language: 'es',
            }),
          });
          const aiData = await aiRes.json();
          aiDescription = aiData.description || null;
        }
      }

      const body = {
        properties: wizardState.properties.map(p => ({
          propertyId: p._id,
          title: p.name,
          address: `${p.location?.street || ''}, ${p.location?.city || ''}`,
          type: p.type || '',
          operation: p.operation || 'venta',
          price: parsePrice(p.price),
          surface: p.square_feet || null,
          bedrooms: p.beds || null,
          bathrooms: p.baths || null,
          photos: (p.images || []).map(i => i?.url).filter(Boolean),
        })),
        client: wizardState.client,
        payment: {
          type: wizardState.payment.type,
          downPaymentPct: wizardState.payment.downPaymentPct || null,
          downPayment: calcDownPayment || null,
          installments: wizardState.payment.installments || null,
          installmentAmount: calcInstallmentAmount || null,
          interestRate: wizardState.payment.interestRate || null,
          notes: wizardState.payment.notes || null,
        },
        customization: {
          template: wizardState.customization.template,
          showAIDescription: wizardState.customization.showAIDescription,
          aiDescription,
          agentNotes: wizardState.customization.agentNotes || null,
          validUntil: wizardState.customization.validUntil || null,
        },
      };

      const createRes = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!createRes.ok) throw new Error('Error al crear presupuesto');
      const { id } = await createRes.json();
      setGeneratedId(id);

      // Generate PDF
      const pdfRes = await fetch(`/api/quotations/${id}/generate-pdf`, { method: 'POST' });
      if (!pdfRes.ok) throw new Error('Error al generar PDF');

      // Create a blob URL from the response
      const blob = await pdfRes.blob();
      const url = URL.createObjectURL(blob);
      setGeneratedPDFUrl(url);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress steps */}
      <nav className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <button
              onClick={() => step > s.id && setStep(s.id)}
              disabled={step < s.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                step === s.id ? 'bg-[var(--color-brand)] text-white' :
                step > s.id ? 'bg-[#eee] text-[#666] hover:bg-[#ddd] cursor-pointer' :
                'text-[#ccc] cursor-default'
              }`}
            >
              <span>{s.icon}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && <div className={`w-6 h-px mx-1 ${step > s.id ? 'bg-[var(--color-brand)]' : 'bg-[#eee]'}`} />}
          </div>
        ))}
      </nav>

      {/* Steps */}
      {step === 1 && <StepProperty selected={wizardState.properties} onChange={(p) => updateState('properties', p)} onNext={() => setStep(2)} />}
      {step === 2 && <StepClient data={wizardState.client} onChange={(c) => updateState('client', c)} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <StepPayment data={wizardState.payment} propertyPrice={totalPrice} onChange={(p) => updateState('payment', p)} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
      {step === 4 && <StepCustomize data={wizardState.customization} onChange={(c) => updateState('customization', c)} onNext={() => setStep(5)} onBack={() => setStep(3)} />}
      {step === 5 && <StepPreview wizardState={wizardState} isGenerating={isGenerating} generatedPDFUrl={generatedPDFUrl} onGenerate={handleGenerate} onBack={() => setStep(4)} />}
    </div>
  );
}
