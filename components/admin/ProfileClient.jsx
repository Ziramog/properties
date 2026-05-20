'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import SignatureCanvas from 'react-signature-canvas';

export default function ProfileClient({ user, totalProps, payments, config: initialConfig }) {
  const [config, setConfig] = useState(initialConfig || {});
  const [uploading, setUploading] = useState(false);
  const [savingRate, setSavingRate] = useState(false);
  const [savingSig, setSavingSig] = useState(false);
  const [rateValue, setRateValue] = useState(config?.exchangeRateARS || '');
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

  const saveSignature = async () => {
    setSavingSig(true);
    try {
      // Get canvas data regardless of isEmpty state
      const dataUrl = sigRef.current?.toDataURL?.('image/png');

      // Check if canvas is effectively empty
      // isEmpty() can be unreliable, so we check if dataUrl is a blank canvas
      const isEmpty = !dataUrl || dataUrl === 'data:image/png;base64,';

      if (isEmpty) {
        // Clear signature
        const res = await fetch('/api/site-config', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ signatureBase64: null }),
        });
        if (res.ok) {
          setConfig(prev => ({ ...prev, signatureBase64: null }));
        } else {
          const errData = await res.json();
          alert('Error al limpiar firma: ' + (errData.error || res.status));
        }
      } else {
        // Save signature
        const res = await fetch('/api/site-config', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ signatureBase64: dataUrl }),
        });
        if (res.ok) {
          setConfig(prev => ({ ...prev, signatureBase64: dataUrl }));
        } else {
          const errData = await res.json();
          alert('Error al guardar firma: ' + (errData.error || res.status));
        }
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSavingSig(false);
    }
  };

  const clearSignaturePad = () => {
    if (sigRef.current) {
      sigRef.current.clear();
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl">
      <h1 className="text-[28px] md:text-[36px] font-normal text-[#0F172A] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
        Perfil
      </h1>

      {/* Plan card */}
      <div className="bg-gradient-to-br from-[#1C1C1A] to-[#2A2A27] rounded-2xl p-6 md:p-8 mb-6 text-white">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--color-brand)] mb-2">Plan Actual</p>
            <h2 className="text-[32px] font-bold leading-tight mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Pro</h2>
            <p className="text-white/50 text-sm">Propiedades: {totalProps} activas</p>
          </div>
          <div className="text-right">
            <p className="text-[24px] font-bold">U$D 25<span className="text-sm font-normal text-white/50">/mes</span></p>
            <p className="text-white/50 text-xs">Sin vencimiento</p>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-white/10">
          <a href="https://mpago.la/ejemplo" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-sm font-bold px-6 py-3 rounded-lg transition-colors uppercase tracking-wider">
            Suscribir / Renovar
          </a>
        </div>
      </div>

      {/* User info */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6">
        <div className="flex items-center gap-5">
          <Image
            src={user?.image || '/images/profile.png'}
            alt="Avatar"
            width={64}
            height={64}
            className="rounded-full object-cover w-16 h-16"
          />
          <div>
            <h3 className="text-[18px] font-semibold text-[#0F172A]">{user?.name || 'Admin'}</h3>
            <p className="text-[13px] text-[#666]">{user?.email || ''}</p>
          </div>
        </div>
      </div>

      {/* Logo de la inmobiliaria */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6">
        <h3 className="text-[18px] font-semibold text-[#0F172A] mb-4">Logo de la Inmobiliaria</h3>
        <p className="text-[13px] text-[#666] mb-4">Este logo aparecerá en las propuestas PDF.</p>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-xl border border-[#eee] flex items-center justify-center overflow-hidden bg-[#f9f9f9]">
            {config.logoUrl ? (
              <img src={config.logoUrl} alt="Logo" className="object-contain w-full h-full" />
            ) : (
              <span className="text-[#ccc] text-[11px] text-center px-2">Sin logo</span>
            )}
          </div>
          <div>
            <label className="inline-block bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors cursor-pointer uppercase tracking-wider">
              {uploading ? 'Subiendo...' : 'Seleccionar archivo'}
              <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleLogoUpload} disabled={uploading} />
            </label>
            <p className="text-[11px] text-[#999] mt-2">PNG o JPG, fondo transparente ideal</p>
          </div>
        </div>
      </div>

      {/* Tipo de cambio */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6">
        <h3 className="text-[18px] font-semibold text-[#0F172A] mb-4">Tipo de Cambio ARS/USD</h3>
        <p className="text-[13px] text-[#666] mb-4">Se usa para mostrar el precio en ARS en las propuestas.</p>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[#666] font-medium">$</span>
            <input type="number" value={rateValue} onChange={(e) => setRateValue(e.target.value)}
              className="w-40 border border-[#ddd] rounded-lg pl-7 pr-4 py-2.5 text-sm outline-none focus:border-[var(--color-brand)]"
              placeholder="Ej: 1200" min="0" step="1" />
          </div>
          <span className="text-[13px] text-[#666]">ARS por 1 USD</span>
          <button onClick={saveExchangeRate} disabled={savingRate}
            className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors uppercase tracking-wider disabled:opacity-40">
            {savingRate ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
        {config.exchangeRateARS && (
          <p className="text-[12px] text-[#999] mt-2">Tipo de cambio actual: $ {parseFloat(config.exchangeRateARS).toLocaleString('es-AR')} ARS/USD</p>
        )}
      </div>

      {/* Firma digital */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6">
        <h3 className="text-[18px] font-semibold text-[#0F172A] mb-4">Firma Digital del Agente</h3>
        <p className="text-[13px] text-[#666] mb-4">Firmá una vez y la firma aparecerá automáticamente en todas las propuestas PDF.</p>
        <div className="border border-[#ddd] rounded-lg overflow-hidden mb-3">
          <SignatureCanvas
            ref={sigRef}
            penColor="#1a1a1a"
            canvasProps={{ className: 'w-full h-28', style: { width: '100%', height: 112 } }}
          />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={clearSignaturePad}
            className="text-sm text-[#666] hover:text-[#333] border border-[#ddd] px-4 py-2 rounded-lg transition-colors">
            Limpiar
          </button>
          <button onClick={saveSignature} disabled={savingSig}
            className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors uppercase tracking-wider disabled:opacity-40">
            {savingSig ? 'Guardando...' : 'Guardar Firma'}
          </button>
        </div>
        {config.signatureBase64 && (
          <div className="mt-3 p-3 bg-[#f9f9f9] rounded-lg">
            <p className="text-[11px] text-[#999] mb-2 uppercase tracking-wider font-bold">Firma actual:</p>
            <img src={config.signatureBase64} alt="Firma guardada" className="h-10" />
          </div>
        )}
      </div>

      {/* Configuración del Sitio */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6">
        <h3 className="text-[18px] font-semibold text-[#0F172A] mb-4">Configuración del Sitio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] mb-1">Email de contacto</label>
            <p className="text-[14px] text-[#333]">info@roggeroyroma.com.ar</p>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] mb-1">WhatsApp</label>
            <p className="text-[14px] text-[#333]">+54 9 3547 563911</p>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] mb-1">Dirección</label>
            <p className="text-[14px] text-[#333]">Blvd. Carlos Pellegrini 710, Alta Gracia</p>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#999] mb-1">Dominio</label>
            <p className="text-[14px] text-[#333]">properties-srs5.vercel.app</p>
          </div>
        </div>
      </div>

      {/* Historial de pagos */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
        <h3 className="text-[18px] font-semibold text-[#0F172A] mb-4">Historial de Pagos</h3>
        {payments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[13px] text-[#999]">No hay pagos registrados.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#eee]">
                <th className="text-left py-2 font-semibold text-[#333]">Fecha</th>
                <th className="text-left py-2 font-semibold text-[#333]">Plan</th>
                <th className="text-right py-2 font-semibold text-[#333]">Monto</th>
                <th className="text-right py-2 font-semibold text-[#333]">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eee]">
              {payments.map((p) => (
                <tr key={p._id}>
                  <td className="py-2.5 text-[#666]">{new Date(p.createdAt).toLocaleDateString('es-AR')}</td>
                  <td className="py-2.5 text-[#333] font-medium capitalize">{p.plan}</td>
                  <td className="py-2.5 text-right font-medium text-[#0F172A]">{p.currency || 'U$D'} {p.amount?.toLocaleString('es-AR')}</td>
                  <td className="py-2.5 text-right">
                    <span className={`text-[11px] font-bold px-2 py-1 rounded uppercase tracking-wider text-white ${
                      p.status === 'paid' ? 'bg-green-500' : p.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
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
  );
}