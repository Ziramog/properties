/**
 * Convierte un Blob de imagen (PNG de Satori) a JPEG sRGB con las dimensiones exactas indicadas,
 * usando HTML5 <canvas>. Libera explícitamente la memoria del canvas al terminar (crítico en móviles).
 *
 * @param {Blob} blob - Imagen origen (PNG)
 * @param {number} width - Ancho final (ej: 1080)
 * @param {number} height - Alto final (ej: 1350)
 * @param {number} quality - Calidad JPEG 0..1 (por defecto 0.92)
 * @returns {Promise<Blob|null>} - Blob JPEG o null si falla (el llamador debe usar el original)
 */
export async function convertBlobToJpeg(blob, width, height, quality = 0.92) {
  if (!blob || typeof window === 'undefined') return null;

  const objectUrl = URL.createObjectURL(blob);

  try {
    const img = await new Promise((resolve, reject) => {
      const image = new window.Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = objectUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // JPEG no admite transparencia: fondo corporativo oscuro por seguridad
    ctx.fillStyle = '#0B0D10';
    ctx.fillRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, width, height);

    const jpegBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));

    ctx.clearRect(0, 0, width, height);
    canvas.width = 0;
    canvas.height = 0;
    img.src = '';

    return jpegBlob || null;
  } catch (err) {
    console.warn('Fallback: no se pudo convertir a JPEG, se usa el PNG original:', err);
    return null;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
