'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import SignatureCanvas from 'react-signature-canvas';
import AgentNameForm from '@/components/AgentNameForm';

export default function ProfileClient({ user, totalProps, payments, config: initialConfig }) {
  const [config, setConfig] = useState(initialConfig || {});
  const [uploading, setUploading] = useState(false);
  const [savingRate, setSavingRate] = useState(false);
  const [savingSig, setSavingSig] = useState(false);
  const [savingContact, setSavingContact] = useState(false);
  const [rateValue, setRateValue] = useState(config?.exchangeRateARS || '');
  const [contactData, setContactData] = useState({
    contactEmail: config?.contactEmail || 'info@roggeroyroma.com.ar',
    contactPhone: config?.contactPhone || '+54 9 3547 563911',
    contactAddress: config?.contactAddress || 'Blvd. Carlos Pellegrini 710'
  });
  const sigRef = useRef(null);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('logo', file);
      const res = await fetch('/api/quotations/upload-logo', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.logoUrl) {
        setConfig(prev => ({ ...prev, logoUrl: data.logoUrl }));
      } else {
        alert('Error: ' + (data.error || 'No se pudo subir el logo'));
      }
    } catch (err) {
      alert('Error al subir logo: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const saveExchangeRate = async () => {
    setSavingRate(true);
    try {
      const res = await fetch('/api/site-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exchangeRateARS: parseFloat(rateValue) || null }),
      });
      const data = await res.json();
      if (data.success) {
        setConfig(prev => ({ ...prev, exchangeRateARS: parseFloat(rateValue) || null }));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSavingRate(false);
    }
  };

  const saveContactInfo = async () => {
    setSavingContact(true);
    try {
      const res = await fetch('/api/site-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });
      const data = await res.json();
      if (data.success) {
        setConfig(prev => ({ ...prev, ...contactData }));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSavingContact(false);
    }
  };

  const saveSignature = async () => {
    setSavingSig(true);
    try {
      const dataUrl = sigRef.current?.toDataURL?.('image/png');
      const isEmpty = !dataUrl || dataUrl === 'data:image/png;base64,';
      const res = await fetch('/api/site-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signatureBase64: isEmpty ? null : dataUrl }),
      });
      if (res.ok) {
        setConfig(prev => ({ ...prev, signatureBase64: isEmpty ? null : dataUrl }));
      } else {
        const errData = await res.json();
        alert('Error al guardar firma: ' + (errData.error || res.status));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSavingSig(false);
    }
  };

  const clearSignaturePad = () => {
    if (sigRef.current) sigRef.current.clear();
  };

  const cardCls = 'bg-[#161616]/70 backdrop-blur-md border border-[#222] rounded-sm p-5 shadow-2xl';
  const labelCls = 'text-[11px] font-bold uppercase tracking-wider text-[#888] mb-1 block';
  const inputCls = 'w-full bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-white outline-none focus:border-[var(--color-brand)] transition-colors placeholder:text-[#555]';
  const btnPrimary = 'bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-xs font-bold px-4 py-2 rounded-sm transition-colors uppercase tracking-wider disabled:opacity-40';
  const btnSecondary = 'text-xs text-[#999] hover:text-white border border-[#333] px-3 py-2 rounded-sm transition-colors';

  return (
    <div className="p-4 md:p-6 max-w-[1600px]">
      <h1 className="text-[24px] md:text-[30px] font-normal text-white mb-5" style={{ fontFamily: 'var(--font-heading)' }}>
        Perfil
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* 1. User */}
        <div className={cardCls}>
          <div className="flex items-center gap-3">
            <Image
              src={user?.image || '/images/profile.png'}
              alt="Avatar"
              width={48}
              height={48}
              className="rounded-full object-cover w-12 h-12"
            />
            <div>
              <h3 className="text-[15px] font-semibold text-white">{user?.name || 'Admin'}</h3>
              <p className="text-[12px] text-[#888]">{user?.email || ''}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[#222]">
            <AgentNameForm initialName={user?.agentName} />
          </div>
        </div>

        {/* 2. Plan */}
        <div className={`${cardCls} bg-gradient-to-br from-[#1C1C1A]/80 to-[#2A2A27]/80`}>
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--color-brand)] mb-1">Plan Actual</p>
          <h2 className="text-[28px] font-bold leading-tight mb-1 text-white" style={{ fontFamily: 'var(--font-heading)' }}>Pro</h2>
          <p className="text-white/50 text-xs">Propiedades: {totalProps} activas</p>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <div>
              <p className="text-[20px] font-bold text-white">U$D 25<span className="text-xs font-normal text-white/50">/mes</span></p>
              <p className="text-[9px] text-[#888] uppercase tracking-wider mt-0.5">Abonado en efectivo</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-900/30 px-2 py-1 rounded-sm border border-green-800">
              Activo
            </span>
          </div>
        </div>

        {/* 3. Logo */}
        <div className={cardCls}>
          <p className={labelCls}>Logo Inmobiliaria</p>
          <p className="text-[12px] text-[#666] mb-3">Aparece en propuestas PDF.</p>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-sm border border-[#333] flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
              {config.logoUrl ? (
                <img src={config.logoUrl} alt="Logo" className="object-contain w-full h-full" />
              ) : (
                <span className="text-[#555] text-[10px] text-center px-1">Sin logo</span>
              )}
            </div>
            <div>
              <label className={`${btnPrimary} cursor-pointer inline-block`}>
                {uploading ? 'Subiendo...' : 'Seleccionar'}
                <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleLogoUpload} disabled={uploading} />
              </label>
              <p className="text-[10px] text-[#555] mt-1">PNG o JPG ideal</p>
            </div>
          </div>
        </div>

        {/* 4. Exchange rate */}
        <div className={cardCls}>
          <p className={labelCls}>Tipo de Cambio</p>
          <p className="text-[12px] text-[#666] mb-3">Para precios en ARS.</p>
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[12px] text-[#666]">$</span>
              <input type="number" value={rateValue} onChange={(e) => setRateValue(e.target.value)}
                className={`${inputCls} w-28 pl-5`} placeholder="1200" min="0" step="1" />
            </div>
            <span className="text-[12px] text-[#666]">ARS/USD</span>
            <button onClick={saveExchangeRate} disabled={savingRate} className={btnPrimary}>
              {savingRate ? '...' : 'Guardar'}
            </button>
          </div>
          {config.exchangeRateARS && (
            <p className="text-[11px] text-[#555] mt-2">Actual: $ {parseFloat(config.exchangeRateARS).toLocaleString('es-AR')}</p>
          )}
        </div>

        {/* 5. Config + Payments combined */}
        <div className={`${cardCls} md:col-span-2 xl:col-span-2 flex flex-col`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
            {/* Site config */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className={labelCls + ' mb-0'}>Configuración de Contacto</p>
                <button onClick={saveContactInfo} disabled={savingContact} className="text-[10px] text-[var(--color-brand)] font-bold uppercase hover:underline">
                  {savingContact ? '...' : 'Guardar'}
                </button>
              </div>
              <div className="space-y-3 mt-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase text-[#555] mb-1">Email</label>
                  <input type="email" value={contactData.contactEmail} onChange={e => setContactData({...contactData, contactEmail: e.target.value})} className={inputCls + " py-1.5"} />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-[#555] mb-1">WhatsApp</label>
                  <input type="text" value={contactData.contactPhone} onChange={e => setContactData({...contactData, contactPhone: e.target.value})} className={inputCls + " py-1.5"} />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-[#555] mb-1">Dirección</label>
                  <input type="text" value={contactData.contactAddress} onChange={e => setContactData({...contactData, contactAddress: e.target.value})} className={inputCls + " py-1.5"} />
                </div>
              </div>
            </div>

            {/* Payments */}
            <div className="flex flex-col">
              <p className={labelCls}>Historial de Pagos</p>
              <div className="overflow-auto flex-1" style={{ maxHeight: 200 }}>
                {payments.length === 0 ? (
                  <p className="text-[12px] text-[#666] text-center py-4">No hay pagos registrados.</p>
                ) : (
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr className="border-b border-[#333] text-[#888] uppercase tracking-wider text-[9px]">
                        <th className="text-left py-1">Fecha</th>
                        <th className="text-left py-1">Plan</th>
                        <th className="text-right py-1">Monto</th>
                        <th className="text-right py-1">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222]">
                      {payments.map((p) => (
                        <tr key={p._id}>
                          <td className="py-1.5 text-[#999]">{new Date(p.createdAt).toLocaleDateString('es-AR')}</td>
                          <td className="py-1.5 text-white capitalize">{p.plan}</td>
                          <td className="py-1.5 text-right text-white font-medium">{p.currency || 'U$D'} {p.amount?.toLocaleString('es-AR')}</td>
                          <td className="py-1.5 text-right">
                            <span className={`text-[9px] font-bold px-1 py-0.5 rounded-sm uppercase tracking-wider text-white ${
                              p.status === 'paid' ? 'bg-green-600' : p.status === 'pending' ? 'bg-yellow-600' : 'bg-red-600'
                            }`}>
                              {p.status === 'paid' ? 'Pagado' : p.status === 'pending' ? 'Pendiente' : 'Vencido'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 6. Signature */}
        <div className={`${cardCls} md:col-span-2 xl:col-span-2`}>
          <div className="flex items-center justify-between mb-2">
            <p className={labelCls + ' mb-0'}>Firma Digital</p>
            {config.signatureBase64 && (
              <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Guardada</span>
            )}
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="border border-[#333] rounded-sm overflow-hidden mb-2 bg-white" style={{ filter: 'invert(1) hue-rotate(180deg)' }}>
                <SignatureCanvas
                  ref={sigRef}
                  penColor="#1a1a1a"
                  canvasProps={{ className: 'w-full', style: { width: '100%', height: 90 } }}
                />
              </div>
              <div className="flex items-center gap-2">
                <button onClick={clearSignaturePad} className={btnSecondary}>Limpiar</button>
                <button onClick={saveSignature} disabled={savingSig} className={btnPrimary}>
                  {savingSig ? 'Guardando...' : 'Guardar Firma'}
                </button>
              </div>
            </div>
            {config.signatureBase64 && (
              <div className="w-32 p-2 bg-[#0a0a0a] border border-[#222] rounded-sm flex items-center justify-center flex-shrink-0">
                <img src={config.signatureBase64} alt="Firma" className="h-10" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
