'use client';
import { useState } from 'react';
import { updateQuotationStatus } from '@/app/actions/updateQuotationStatus';
import { deleteQuotation } from '@/app/actions/deleteQuotation';

export default function QuotationActions({ quotationId, currentStatus, trackingToken }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleStatusChange = async (newStatus) => {
    setIsOpen(false);
    await updateQuotationStatus(quotationId, newStatus);
  };

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de eliminar esta propuesta?')) {
      setIsDeleting(true);
      await deleteQuotation(quotationId);
    }
  };

  const handleCopyLink = () => {
    if (!trackingToken) {
      alert('Esta propuesta es antigua y no tiene link de seguimiento.');
      return;
    }
    const link = `${window.location.origin}/p/${trackingToken}`;
    navigator.clipboard.writeText(link);
    alert('¡Link copiado! ' + link);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button 
        onClick={toggleOpen} disabled={isDeleting}
        className="inline-flex items-center justify-center w-7 h-7 bg-[#222] text-[#888] rounded-sm hover:bg-[#333] hover:text-white transition-colors"
        title="Opciones"
      >
        •••
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-1 w-40 origin-top-right rounded-sm bg-[#1a1a1a] border border-[#333] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <button onClick={handleCopyLink} className="block w-full text-left px-4 py-2 text-[11px] font-medium text-[#bbb] hover:bg-[#222] hover:text-white">
              🔗 Copiar Link Público
            </button>
            <div className="border-t border-[#333] my-1"></div>
            <p className="px-4 py-1 text-[9px] font-bold uppercase text-[#666]">Estado</p>
            {['draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired'].map(s => (
              <button 
                key={s} 
                onClick={() => handleStatusChange(s)}
                className={`block w-full text-left px-4 py-1.5 text-[11px] font-medium ${currentStatus === s ? 'text-[var(--color-brand)] bg-[var(--color-brand)]/10' : 'text-[#888] hover:bg-[#222] hover:text-white'}`}
              >
                {s.toUpperCase()}
              </button>
            ))}
            <div className="border-t border-[#333] my-1"></div>
            <button onClick={handleDelete} className="block w-full text-left px-4 py-2 text-[11px] font-medium text-red-500 hover:bg-[#222]">
              🗑 Eliminar
            </button>
          </div>
        </div>
      )}
      
      {/* Click outside to close - simple hack */}
      {isOpen && (
        <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)}></div>
      )}
    </div>
  );
}
