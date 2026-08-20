'use client';
import { useState } from 'react';
import { Share2, X, Download } from 'lucide-react';
import { toast } from 'react-toastify';

export default function StoryShareButton({ property }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('1');
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const storyUrl = `/api/story/${property._id || property.id}?template=${selectedTemplate}`;
      
      if (navigator.share && navigator.canShare) {
        const response = await fetch(storyUrl);
        const blob = await response.blob();
        const file = new File([blob], `roggero-roma-${property._id || property.id}-story.png`, { type: 'image/png' });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: property.name || 'Propiedad en Roggero & Roma',
            text: '¡Mirá esta propiedad increíble en Roggero & Roma!',
          });
          toast.success('Compartido exitosamente');
          setIsOpen(false);
          setIsSharing(false);
          return;
        }
      }
      
      // Fallback for desktop or when share is not supported
      window.open(storyUrl, '_blank');
      toast.info('Imagen abierta. Podés guardarla y compartirla.');
      setIsOpen(false);
      
    } catch (error) {
      console.error('Error sharing', error);
      toast.error('Ocurrió un error al intentar compartir');
    }
    setIsSharing(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 mt-4 text-[13px] font-bold uppercase tracking-wider text-white bg-[var(--color-brand)] border-2 border-[var(--color-brand)] hover:bg-transparent hover:text-[var(--color-brand)] transition-colors py-3 px-6"
      >
        <Share2 className="w-5 h-5" />
        Compartir Historia
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white border border-gray-200 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black bg-gray-100 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h3 className="text-2xl font-bold text-[#0F172A] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Compartir Historia</h3>
            <p className="text-gray-500 mb-6 text-sm">Seleccioná el diseño que más te guste para descargar y compartir en Instagram o Facebook.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Template 1 */}
              <div 
                className={`relative overflow-hidden border-2 cursor-pointer transition-all ${selectedTemplate === '1' ? 'border-[var(--color-brand)] shadow-[0_0_15px_rgba(200,169,114,0.3)]' : 'border-gray-200 hover:border-gray-400'}`}
                onClick={() => setSelectedTemplate('1')}
              >
                <div className="aspect-[9/16] relative bg-[#0B0D10] flex flex-col">
                  {/* Mockup Template 1 */}
                  <div className="h-[55%] bg-gray-800 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] to-transparent"></div>
                  </div>
                  <div className="h-[45%] flex flex-col items-center justify-center p-4 gap-2">
                    <div className="w-3/4 h-4 bg-white/20 rounded"></div>
                    <div className="w-1/2 h-3 bg-white/10 rounded mb-4"></div>
                    <div className="w-2/3 h-6 bg-[var(--color-brand)]/80 rounded mb-4"></div>
                    <div className="w-1/3 h-5 bg-green-500/80 rounded-full"></div>
                  </div>
                </div>
                <div className="p-3 bg-white border-t border-gray-200 absolute bottom-0 w-full text-center font-semibold text-[#0F172A] text-sm uppercase tracking-wider">
                  Diseño Clásico
                </div>
                {selectedTemplate === '1' && (
                  <div className="absolute top-3 right-3 w-8 h-8 bg-[var(--color-brand)] flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
              </div>

              {/* Template 2 */}
              <div 
                className={`relative overflow-hidden border-2 cursor-pointer transition-all ${selectedTemplate === '2' ? 'border-[var(--color-brand)] shadow-[0_0_15px_rgba(200,169,114,0.3)]' : 'border-gray-200 hover:border-gray-400'}`}
                onClick={() => setSelectedTemplate('2')}
              >
                <div className="aspect-[9/16] relative bg-[#0B0D10] flex flex-col">
                  {/* Mockup Template 2 */}
                  <div className="h-[50%] bg-gray-800"></div>
                  <div className="h-[15%] flex gap-1 p-2">
                    <div className="flex-1 bg-gray-700 rounded-sm"></div>
                    <div className="flex-1 bg-gray-700 rounded-sm"></div>
                    <div className="flex-1 bg-gray-700 rounded-sm"></div>
                  </div>
                  <div className="h-[35%] flex flex-col justify-between p-3">
                    <div>
                      <div className="w-3/4 h-3 bg-white/20 rounded mb-1"></div>
                      <div className="w-1/2 h-2 bg-white/10 rounded mb-2"></div>
                      <div className="flex gap-1">
                        <div className="w-8 h-3 bg-gray-800 rounded"></div>
                        <div className="w-12 h-3 bg-gray-800 rounded"></div>
                      </div>
                    </div>
                    <div className="w-2/3 h-5 bg-[var(--color-brand)]/80 rounded"></div>
                  </div>
                </div>
                <div className="p-3 bg-white border-t border-gray-200 absolute bottom-0 w-full text-center font-semibold text-[#0F172A] text-sm uppercase tracking-wider">
                  Diseño Full
                </div>
                {selectedTemplate === '2' && (
                  <div className="absolute top-3 right-3 w-8 h-8 bg-[var(--color-brand)] flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleShare}
              disabled={isSharing}
              className="w-full flex items-center justify-center gap-2 text-[14px] font-bold uppercase tracking-wider text-white bg-[var(--color-brand)] border-2 border-[var(--color-brand)] hover:bg-transparent hover:text-[var(--color-brand)] transition-colors py-4 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSharing ? (
                <>Generando imagen...</>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Descargar / Compartir
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
