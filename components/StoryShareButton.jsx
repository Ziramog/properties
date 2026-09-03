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
      const response = await fetch(storyUrl);
      
      if (!response.ok) {
        throw new Error(`Error generando imagen: ${response.status}`);
      }
      
      const blob = await response.blob();
      const fileName = `roggero-roma-${property._id || property.id}-story.png`;
      
      // Try native share on mobile
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], fileName, { type: 'image/png' });
        
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
      
      // Fallback: download file directly
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Imagen descargada');
      setIsOpen(false);
      
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing', error);
        toast.error('Ocurrió un error al generar la imagen. Intentá de nuevo.');
      }
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
          <div className="bg-white border border-gray-200 p-6 w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black bg-gray-100 rounded-full p-2 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h3 className="text-2xl font-bold text-[#0F172A] mb-2 pr-10" style={{ fontFamily: 'var(--font-heading)' }}>Diseños de Historia</h3>
            <p className="text-gray-500 mb-6 text-sm">Elegí la plantilla que mejor destaque la propiedad para tus redes.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              
              {/* Template 1: Inmersivo */}
              <div 
                className={`relative overflow-hidden border-2 cursor-pointer transition-all ${selectedTemplate === '1' ? 'border-[var(--color-brand)] shadow-[0_0_15px_rgba(200,169,114,0.3)]' : 'border-gray-200 hover:border-gray-400'}`}
                onClick={() => setSelectedTemplate('1')}
              >
                <div className="aspect-[9/16] relative bg-[#0B0D10] flex flex-col">
                  {/* Mockup Template 1 */}
                  <div className="absolute inset-0 bg-gray-800"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/40"></div>
                  <div className="absolute top-4 left-4 w-16 h-4 bg-white/50 rounded"></div>
                  <div className="absolute top-4 right-4 w-12 h-4 bg-[var(--color-brand)] rounded-full"></div>
                  <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
                    <div className="w-3/4 h-8 bg-white rounded"></div>
                    <div className="w-1/2 h-4 bg-white/70 rounded"></div>
                    <div className="w-1/3 h-3 bg-white/50 rounded"></div>
                    <div className="flex gap-2 mt-2">
                      <div className="w-12 h-6 bg-white/20 rounded-full border border-white/30"></div>
                      <div className="w-12 h-6 bg-white/20 rounded-full border border-white/30"></div>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-white border-t border-gray-200 absolute bottom-0 w-full text-center font-semibold text-[#0F172A] text-[11px] sm:text-[13px] uppercase tracking-wider">
                  1. Inmersivo
                </div>
                {selectedTemplate === '1' && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-[var(--color-brand)] flex items-center justify-center shadow-lg rounded-full">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
              </div>

              {/* Template 2: Editorial */}
              <div 
                className={`relative overflow-hidden border-2 cursor-pointer transition-all ${selectedTemplate === '2' ? 'border-[var(--color-brand)] shadow-[0_0_15px_rgba(200,169,114,0.3)]' : 'border-gray-200 hover:border-gray-400'}`}
                onClick={() => setSelectedTemplate('2')}
              >
                <div className="aspect-[9/16] relative bg-[#F8F9FA] flex flex-col p-4 border-[8px] border-white">
                  {/* Mockup Template 2 */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="w-16 h-4 bg-gray-300 rounded"></div>
                    <div className="w-20 h-2 bg-gray-300 rounded"></div>
                  </div>
                  <div className="w-full h-[45%] bg-gray-300 shadow-sm mb-4"></div>
                  <div className="flex flex-col gap-2">
                    <div className="w-full h-6 bg-gray-400 rounded"></div>
                    <div className="w-1/2 h-3 bg-gray-300 rounded mb-2"></div>
                    <div className="w-full h-[1px] bg-gray-300 mb-2"></div>
                    <div className="flex justify-between items-end">
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      </div>
                      <div className="w-24 h-6 bg-[var(--color-brand)] rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-white border-t border-gray-200 absolute bottom-0 w-full text-center font-semibold text-[#0F172A] text-[11px] sm:text-[13px] uppercase tracking-wider">
                  2. Editorial
                </div>
                {selectedTemplate === '2' && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-[var(--color-brand)] flex items-center justify-center shadow-lg rounded-full">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
              </div>

              {/* Template 3: Collage */}
              <div 
                className={`relative overflow-hidden border-2 cursor-pointer transition-all ${selectedTemplate === '3' ? 'border-[var(--color-brand)] shadow-[0_0_15px_rgba(200,169,114,0.3)]' : 'border-gray-200 hover:border-gray-400'}`}
                onClick={() => setSelectedTemplate('3')}
              >
                <div className="aspect-[9/16] relative bg-white flex flex-col">
                  {/* Mockup Template 3 */}
                  <div className="w-full h-[55%] bg-gray-400"></div>
                  <div className="w-full h-[45%] flex">
                    <div className="w-1/2 h-full bg-gray-300 border-r border-t border-white"></div>
                    <div className="w-1/2 h-full bg-gray-200 border-l border-t border-white"></div>
                  </div>
                  {/* Floating Box */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] h-1/3 bg-white border border-[var(--color-brand)] shadow-lg flex flex-col items-center justify-center p-2 gap-2">
                    <div className="w-16 h-3 bg-gray-300 rounded mb-1"></div>
                    <div className="w-12 h-3 bg-green-500 rounded"></div>
                    <div className="w-3/4 h-4 bg-gray-800 rounded"></div>
                    <div className="w-1/2 h-2 bg-gray-400 rounded"></div>
                    <div className="w-3/4 h-6 bg-[var(--color-brand)] rounded"></div>
                  </div>
                </div>
                <div className="p-3 bg-white border-t border-gray-200 absolute bottom-0 w-full text-center font-semibold text-[#0F172A] text-[11px] sm:text-[13px] uppercase tracking-wider">
                  3. Collage
                </div>
                {selectedTemplate === '3' && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-[var(--color-brand)] flex items-center justify-center shadow-lg rounded-full">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
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
