/**
 * Recorta (c_fill) y mejora una imagen en el navegador usando HTML5 <canvas>.
 * Descarga la URL original limpia de Cloudinary (0 créditos de transformación)
 * y realiza el reescalado bicúbico/Lanczos en la GPU/CPU del dispositivo del usuario.
 *
 * @param {string} imageUrl - URL original de la imagen en Cloudinary
 * @param {number} targetW - Ancho deseado (ej: 1080)
 * @param {number} targetH - Alto deseado (ej: 1920 para Story, 1350 para Feed)
 * @returns {Promise<string|null>} - DataURL (Base64) en formato JPEG lista para Satori, o null si falla
 */
export async function processImageInBrowser(imageUrl, targetW, targetH) {
  if (!imageUrl || typeof window === 'undefined') return null;

  // Asegurar que usamos la URL original limpia sin transformaciones de Cloudinary (0 créditos)
  const cleanUrl = imageUrl.replace(/\/upload\/[^/]+\/(v\d+\/)/, '/upload/$1');

  return new Promise((resolve) => {
    const img = new window.Image();
    // Necesario para exportar el canvas a Base64 sin bloqueo CORS
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(null);
          return;
        }

        // 1. Activar el motor de reescalado de máxima calidad del navegador
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // 2. Micro-contraste y saturación sutil para compensar la compresión posterior de Instagram
        if ('filter' in ctx) {
          ctx.filter = 'contrast(1.04) saturate(1.03)';
        }

        // 3. Matemática para simular "c_fill" (centrado sin deformar, equivalente a object-fit: cover)
        const imgRatio = img.width / img.height;
        const targetRatio = targetW / targetH;

        let sourceW;
        let sourceH;
        let sourceX;
        let sourceY;

        if (imgRatio > targetRatio) {
          // Foto original más horizontal que el lienzo: recortar lados
          sourceH = img.height;
          sourceW = img.height * targetRatio;
          sourceX = (img.width - sourceW) / 2;
          sourceY = 0;
        } else {
          // Foto original más vertical que el lienzo: recortar arriba y abajo
          sourceW = img.width;
          sourceH = img.width / targetRatio;
          sourceX = 0;
          sourceY = (img.height - sourceH) / 2;
        }

        // 4. Dibujar el recorte exacto directamente al tamaño final (1080x1920 o 1080x1350)
        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceW,
          sourceH,
          0,
          0,
          targetW,
          targetH
        );

        // 5. Exportar como JPEG con calidad 92% (0.92) para Satori
        const base64Url = canvas.toDataURL('image/jpeg', 0.92);
        resolve(base64Url);
      } catch (err) {
        console.warn('Fallback: no se pudo procesar en canvas local:', err);
        resolve(null);
      }
    };

    img.onerror = (err) => {
      console.warn('Fallback: error cargando imagen en canvas local:', err);
      resolve(null);
    };

    img.src = cleanUrl;
  });
}
