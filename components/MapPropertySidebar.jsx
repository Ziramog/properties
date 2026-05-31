'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { generateWhatsAppLink } from '@/utils/whatsapp';
import { getPropertyImage, getAreaDisplay, getStatusBadge } from '@/utils/propertyDisplay';

export default function MapPropertySidebar({ property, onClose }) {
  const router = useRouter();
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Trigger entrance animation after mount
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  // Reset photo index when property changes
  useEffect(() => {
    setCurrentPhoto(0);
  }, [property?._id]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!property) return null;

  const images = property.images?.map((img) =>
    typeof img === 'string' ? img : img?.url
  ).filter(Boolean) || [];

  const image = getPropertyImage(property);
  const area = getAreaDisplay(property);
  const badge = getStatusBadge(property);
  const city = property.location?.city || '';

  const nextPhoto = useCallback(() => setCurrentPhoto((i) => (i + 1) % images.length), [images.length]);
  const prevPhoto = useCallback(() => setCurrentPhoto((i) => (i - 1 + images.length) % images.length), [images.length]);

  return (
    <>
      {/* Dark overlay behind sidebar */}
      <div
        className={`absolute inset-0 z-20 bg-black/40 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        className={`z-30 bg-white shadow-[0_0_60px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col ${
          isMobile
            ? 'fixed bottom-0 left-0 right-0 h-[70vh] rounded-t-[30px] transition-transform duration-500'
            : 'absolute top-0 right-0 h-full w-[420px] transition-transform duration-500'
        }`}
        style={{
          transform: isVisible
            ? 'translateX(0)'
            : isMobile
            ? 'translateY(100%)'
            : 'translateX(100%)',
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Close button — absolute top-right over image */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md hover:bg-white transition-colors shadow-lg"
          aria-label="Cerrar"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-[#0F172A]">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Photo card */}
          <div className="relative group" style={{ aspectRatio: '3/2' }}>
            <Image
              src={images.length > 0 ? images[currentPhoto] : image}
              alt={property.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 420px"
              priority
            />

            {/* Black gradient overlay */}
            <div
              className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 15%, transparent 100%)',
              }}
            />
            {/* Orange hover gradient */}
            <div
              className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(180deg, transparent 70%, var(--color-brand))',
              }}
            />

            {/* Status badge — top left */}
            {badge && (
              <span className="absolute top-4 left-4 z-20 bg-[var(--color-brand)] text-white text-[11px] font-bold px-2.5 py-1 uppercase tracking-wider shadow-md">
                {badge.label}
              </span>
            )}

            {/* Photo arrows (only when multiple images) */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  aria-label="Foto anterior"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#0F172A]">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  aria-label="Foto siguiente"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#0F172A]">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </>
            )}

            {/* Dot indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setCurrentPhoto(i); }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === currentPhoto ? 'bg-white' : 'bg-white/50'
                    }`}
                    aria-label={`Foto ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Features overlay — bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-20 flex items-end gap-3 px-4 pb-4 pointer-events-none">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                {property.beds != null && (
                  <span className="flex items-center gap-1 text-white text-[14px] font-normal" style={{ fontFamily: 'var(--font-heading)' }}>
                    <img src="/senada/images/icons/ico_bed.svg" alt="" className="w-5 h-5" />
                    {property.beds}
                  </span>
                )}
                {property.baths != null && (
                  <span className="flex items-center gap-1 text-white text-[14px] font-normal" style={{ fontFamily: 'var(--font-heading)' }}>
                    <img src="/senada/images/icons/ico_bath.svg" alt="" className="w-5 h-5" />
                    {property.baths}
                  </span>
                )}
                {area && (
                  <span className="flex items-center gap-1 text-white text-[14px] font-normal" style={{ fontFamily: 'var(--font-heading)' }}>
                    <img src="/senada/images/icons/ico_sqfoot.svg" alt="" className="w-5 h-5" />
                    {area}
                  </span>
                )}
              </div>

              {/* Price */}
              <span
                className="ml-auto self-end text-white text-[32px] font-bold leading-none"
                style={{ fontFamily: 'var(--font-heading)', transformOrigin: 'right bottom' }}
              >
                {property.price || 'Consultar'}
              </span>
            </div>
          </div>

          {/* Info footer */}
          <div className="px-5 py-4">
            <h3
              className="text-[22px] font-medium text-[#0F172A] leading-snug line-clamp-2 mb-1"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {property.name}
            </h3>
            <p className="text-[16px] text-[#878787] leading-tight line-clamp-1">
              {city}
            </p>
          </div>

          {/* Actions */}
          <div className="px-5 pb-6 flex flex-col gap-3">
            <button
              onClick={() => router.push(`/properties/${property._id}`)}
              className="w-full py-3.5 bg-[var(--color-brand)] text-white text-[13px] font-bold uppercase tracking-wider transition-colors hover:bg-[#d13d55]"
            >
              Ver detalle
            </button>
            <a
              href={generateWhatsAppLink({ property })}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-[#25D366] text-white text-[13px] font-bold uppercase tracking-wider transition-colors hover:bg-[#128C7E] flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.134 1.589 5.94L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
