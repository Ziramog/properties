export const dynamic = 'force-dynamic';

import Image from 'next/image';
import profileDefault from '@/assets/images/profile.png';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import Payment from '@/models/Payment';
import { getSessionUser } from '@/utils/getSessionUser';

const AdminProfilePage = async () => {
  await connectDB();

  const sessionUser = await getSessionUser();
  const { userId } = sessionUser;

  if (!userId) {
    return <div className="p-6">Error: No se pudo obtener la sesión.</div>;
  }

  const totalProps = await Property.countDocuments({});
  const userProperties = await Property.countDocuments({ owner: userId });
  const payments = await Payment.find({}).sort({ createdAt: -1 }).limit(6).lean();

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
            <p className="text-[24px] font-bold">U$D 50<span className="text-sm font-normal text-white/50">/mes</span></p>
            <p className="text-white/50 text-xs">Sin vencimiento</p>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-white/10">
          <a
            href="https://mpago.la/ejemplo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-sm font-bold px-6 py-3 rounded-lg transition-colors uppercase tracking-wider"
          >
            Suscribir / Renovar
          </a>
        </div>
      </div>

      {/* User info */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6">
        <div className="flex items-center gap-5">
          <Image
            src={sessionUser.user.image || profileDefault}
            alt="Avatar"
            width={64}
            height={64}
            className="rounded-full object-cover w-16 h-16"
          />
          <div>
            <h3 className="text-[18px] font-semibold text-[#0F172A]">{sessionUser.user.name || 'Admin'}</h3>
            <p className="text-[13px] text-[#666]">{sessionUser.user.email || ''}</p>
          </div>
        </div>
      </div>

      {/* Configuración */}
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
                <tr key={p._id.toString()}>
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
};

export default AdminProfilePage;
