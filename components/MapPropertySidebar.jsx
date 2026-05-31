'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateWhatsAppLink } from '@/utils/whatsapp';
import { getPropertyImage } from '@/utils/propertyDisplay';

export default function MapPropertySidebar({ property, onClose }) {
  const router = useRouter();
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Reset photo index when property changes
  useEffect(() => {
    setCurrentPhoto(0);
  }, [property?._id]);

  if (!property) return null;

  const images = property.images?.map((img) =>
    typeof img === 'string' ? img : img?.url
  ).filter(Boolean) || [];

  const price = property.price || 'Consultar';
  const city = property.location?.city || '';
  const street = property.location?.street || '';
  const beds = property.beds;
  const baths = property.baths;
  const area = property.square_feet;

  const nextPhoto = () => setCurrentPhoto((i) => (i + 1) % images.length);
  const prevPhoto = () => setCurrentPhoto((i) => (i - 1 + images.length) % images.length);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      className={`fixed z-30 bg-white shadow-2xl overflow-hidden flex flex-col ${
        isMobile
          ? 'bottom-0 left-0 right-0 h-[70vh] rounded-t-[30px] animate-slide-up'
          : 'top-0 right-0 w-[400px] h-screen animate-slide-in-right'
      }`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header / Close */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <h3 className="text-[15px] font-semibold text-[#0F172A] uppercase tracking-wider">
          Detalle
        </h3>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Cerrar"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-500">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Photo carousel */}
        <div className="relative aspect-[3/2] bg-gray-100">
          {images.length > 0 ? (
            <>
              <img
                src={images[currentPhoto]}
                alt={property.name}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M15 18l-6-6 6-6"/>
                    </svg>
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPhoto(i)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          i === currentPhoto ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Sin imágenes
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-5 py-5">
          <p className="text-[24px] font-bold text-[#E94560] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
            {price}
          </p>
          <h2 className="text-[17px] font-semibold text-[#0F172A] leading-snug mb-1">
            {property.name}
          </h2>
          <p className="text-[13px] text-[#666] mb-4">
            {street ? `${street}, ` : ''}{city}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-3 mb-6">
            {beds != null && (
              <div className="flex items-center gap-1.5 text-[13px] text-[#555]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                  <path d="M2 20h20M5 20v-5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5"/>
                </svg>
                <span>{beds} dorm.</span>
              </div>
            )}
            {baths != null && (
              <div className="flex items-center gap-1.5 text-[13px] text-[#555]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                  <path d="M4 12h16M4 12v-2a2 2 0 0 1 2-2h2M16 10v-2a2 2 0 0 1 2-2h2"/>
                </svg>
                <span>{baths} baños</span>
              </div>
            )}
            {area != null && (
              <div className="flex items-center gap-1.5 text-[13px] text-[#555]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                </svg>
                <span>{area.toLocaleString('es-AR')} m²</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push(`/properties/${property._id}`)}
              className="w-full py-3 bg-[#0F172A] text-white text-[14px] font-semibold uppercase tracking-wider rounded-md hover:bg-[#1e293b] transition-colors"
            >
              Ver detalle
            </button>
            <a
              href={generateWhatsAppLink({ property })}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#25D366] text-white text-[14px] font-semibold uppercase tracking-wider rounded-md hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.134 1.589 5.94L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
