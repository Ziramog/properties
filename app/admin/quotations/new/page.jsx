export const metadata = {
  title: 'Admin — Nueva Propuesta',
  robots: { index: false, follow: false },
};

import Link from 'next/link';
import QuotationWizard from '@/components/admin/quotations/QuotationWizard';

export default function NewQuotationPage() {
  return (
    <div className="p-4 md:p-6">
      <Link href="/admin/quotations" className="inline-flex items-center gap-1 text-[var(--color-brand)] hover:underline text-sm font-medium mb-4">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
        Volver a Presupuestos
      </Link>
      <h1 className="text-[24px] md:text-[36px] font-normal text-white mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
        Nueva Propuesta
      </h1>
      <QuotationWizard />
    </div>
  );
}
