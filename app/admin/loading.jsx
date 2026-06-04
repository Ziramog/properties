import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <div className="relative">
        <div className="absolute inset-0 rounded-full blur-md bg-[var(--color-brand)]/20 animate-pulse" />
        <Loader2 className="w-10 h-10 text-[var(--color-brand)] animate-spin relative z-10" />
      </div>
      <p className="mt-4 text-[11px] font-bold text-[#888] tracking-widest uppercase animate-pulse">
        Cargando...
      </p>
    </div>
  );
}
