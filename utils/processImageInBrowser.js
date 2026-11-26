/**
 * Dibuja la imagen en el canvas según el modo de encuadre:
 * - 'cover' (c_fill): llena todo el lienzo recortando excedentes centrados.
 * - 'contain': encuadra la foto completa sin recorte sobre fondo #0B0D10.
 */
function drawFittedImage(ctx, img, targetW, targetH, fit) {
  const imgRatio = img.width / img.height;
  const targetRatio = targetW / targetH;

  if (fit === 'contain') {
    ctx.fillStyle = '#0B0D10';
    ctx.fillRect(0, 0, targetW, targetH);

    let destW;
    let destH;
    let destX;
    let destY;

    if (imgRatio > targetRatio) {
      destW = targetW;
      destH = Math.round(targetW / imgRatio);
      destX = 0;
      destY = Math.round((targetH - destH) / 2);
    } else {
      destH = targetH;
      destW = Math.round(targetH * imgRatio);
      destX = Math.round((targetW - destW) / 2);
      destY = 0;
    }

    ctx.drawImage(img, 0, 0, img.width, img.height, destX, destY, destW, destH);
    return;
  }

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

  ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, 0, 0, targetW, targetH);
}

/**
 * Procesa una imagen en el navegador usando HTML5 <canvas> (0 créditos Cloudinary).
 * Descarga la URL original limpia de Cloudinary y realiza el encuadre (`cover` o `contain`)
 * y reescalado de alta calidad en el dispositivo del usuario.
 *
 * @param {string} imageUrl - URL original de la imagen en Cloudinary
 * @param {number} targetW - Ancho deseado (ej: 1080)
 * @param {number} targetH - Alto deseado (ej: 1920 para Story, 1350 para Feed)
 * @param {{ fit?: 'cover' | 'contain' }} [options] - Modo de encuadre ('cover' por defecto)
 * @returns {Promise<string|null>} - DataURL (Base64) en formato JPEG lista para Satori, o null si falla
 */
export async function processImageInBrowser(imageUrl, targetW, targetH, options = {}) {
  if (!imageUrl || typeof window === 'undefined') return null;

  const fit = options?.fit === 'contain' ? 'contain' : 'cover';

  // Asegurar que usamos la URL original limpia sin transformaciones de Cloudinary (0 créditos)
  const cleanUrl = imageUrl.replace(/\/upload\/[^/]+\/(v\d+\/)/, '/upload/$1');

  const attemptProcess = () =>
    new Promise((resolve) => {
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
            img.src = '';
            resolve(null);
            return;
          }

          // 1. Activar el motor de reescalado de máxima calidad del navegador
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // 2. Micro-contraste sutil solo en recorte editorial ('cover'); en 'contain' se respeta la foto cruda
          if (fit === 'cover' && 'filter' in ctx) {
            ctx.filter = 'contrast(1.04) saturate(1.03)';
          }

          // 3. Dibujar al tamaño final (1080x1920 o 1080x1350) según el encuadre elegido
          drawFittedImage(ctx, img, targetW, targetH, fit);

          // 5. Exportar como JPEG con calidad 92% (0.92) para Satori
          const base64Url = canvas.toDataURL('image/jpeg', 0.92);

          // 6. Liberar explícitamente la memoria de GPU/RAM del canvas (crítico en móviles al procesar carruseles de 7 fotos)
          ctx.clearRect(0, 0, targetW, targetH);
          canvas.width = 0;
          canvas.height = 0;
          img.src = '';

          resolve(base64Url);
        } catch (err) {
          console.warn('Fallback: no se pudo procesar en canvas local:', err);
          img.src = '';
          resolve(null);
        }
      };

      img.onerror = (err) => {
        console.warn('Fallback: error cargando imagen en canvas local:', err);
        img.src = '';
        resolve(null);
      };

      img.src = cleanUrl;
    });

  const firstTry = await attemptProcess();
  if (firstTry) return firstTry;

  // Reintento único tras breve pausa para permitir garbage collection en dispositivos móviles
  await new Promise((r) => setTimeout(r, 120));
  return attemptProcess();
}

/**
 * Lámina "apaisado completo" sin logo ni textos (modo marco 4:5, 0 créditos Cloudinary):
 * fondo = la misma foto ampliada y difuminada (desenfoque por reducción extrema + reescalado,
 * compatible con iOS Safari donde ctx.filter no está disponible) y, centrada verticalmente,
 * la foto entera sin recorte dentro de una caja de targetW x photoH.
 *
 * @returns {Promise<string|null>} DataURL JPEG targetW x targetH, o null si falla
 */
export async function processFramedBlurImageInBrowser(imageUrl, targetW, targetH, photoH) {
  if (!imageUrl || typeof window === 'undefined') return null;

  const cleanUrl = imageUrl.replace(/\/upload\/[^/]+\/(v\d+\/)/, '/upload/$1');
  const boxH = Math.min(targetH, Math.max(1, Math.round(photoH)));

  const attemptProcess = () =>
    new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvases = [];
        const makeCanvas = (w, h) => {
          const c = document.createElement('canvas');
          c.width = w;
          c.height = h;
          canvases.push(c);
          return c;
        };
        const release = () => {
          for (const c of canvases) {
            c.width = 0;
            c.height = 0;
          }
          img.src = '';
        };

        try {
          const canvas = makeCanvas(targetW, targetH);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            release();
            resolve(null);
            return;
          }

          // 1. Fondo difuminado: cover en miniatura (≈1/30) y reescalado en dos pasos con suavizado
          const tinyW = Math.max(8, Math.round(targetW / 30));
          const tinyH = Math.max(8, Math.round(targetH / 30));
          const tiny = makeCanvas(tinyW, tinyH);
          const tinyCtx = tiny.getContext('2d');
          const mid = makeCanvas(Math.round(targetW / 6), Math.round(targetH / 6));
          const midCtx = mid.getContext('2d');

          if (tinyCtx && midCtx) {
            tinyCtx.imageSmoothingEnabled = true;
            tinyCtx.imageSmoothingQuality = 'high';
            drawFittedImage(tinyCtx, img, tinyW, tinyH, 'cover');

            midCtx.imageSmoothingEnabled = true;
            midCtx.imageSmoothingQuality = 'high';
            midCtx.drawImage(tiny, 0, 0, mid.width, mid.height);

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(mid, 0, 0, targetW, targetH);
          } else {
            ctx.fillStyle = '#0B0D10';
            ctx.fillRect(0, 0, targetW, targetH);
          }

          // Velo oscuro sutil para que la foto nítida se despegue del fondo
          ctx.fillStyle = 'rgba(11, 13, 16, 0.38)';
          ctx.fillRect(0, 0, targetW, targetH);

          // 2. Foto entera (contain) centrada en la caja targetW x boxH, sin recorte
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          const imgRatio = img.width / img.height;
          const boxRatio = targetW / boxH;
          let destW;
          let destH;
          if (imgRatio > boxRatio) {
            destW = targetW;
            destH = Math.round(targetW / imgRatio);
          } else {
            destH = boxH;
            destW = Math.round(boxH * imgRatio);
          }
          const destX = Math.round((targetW - destW) / 2);
          const destY = Math.round((targetH - destH) / 2);
          ctx.drawImage(img, 0, 0, img.width, img.height, destX, destY, destW, destH);

          const base64Url = canvas.toDataURL('image/jpeg', 0.92);
          release();
          resolve(base64Url);
        } catch (err) {
          console.warn('Fallback: no se pudo componer la lámina difuminada:', err);
          release();
          resolve(null);
        }
      };

      img.onerror = (err) => {
        console.warn('Fallback: error cargando imagen para lámina difuminada:', err);
        img.src = '';
        resolve(null);
      };

      img.src = cleanUrl;
    });

  const firstTry = await attemptProcess();
  if (firstTry) return firstTry;
  await new Promise((r) => setTimeout(r, 120));
  return attemptProcess();
}

/**
 * Calcula las dimensiones seguras de Instagram Feed (ancho fijo 1080px,
 * alto dinámico entre 566px [1.91:1] y 1350px [4:5]) respetando la relación
 * de aspecto natural de la imagen original (sin barras negras).
 */
export async function getFeedCanvasSizeForImage(imageUrl) {
  const fallback = { width: 1080, height: 1350 };
  if (!imageUrl || typeof window === 'undefined') return fallback;

  const cleanUrl = imageUrl.replace(/\/upload\/[^/]+\/(v\d+\/)/, '/upload/$1');

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    let settled = false;

    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      img.onload = null;
      img.onerror = null;
      img.src = '';
      resolve(result);
    };

    const timer = setTimeout(() => finish(fallback), 8000);

    img.onload = () => {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      if (!w || !h) {
        finish(fallback);
        return;
      }
      const ratio = w / h;
      const targetH = Math.max(566, Math.min(1350, Math.round(1080 / ratio)));
      finish({ width: 1080, height: targetH });
    };

    img.onerror = () => finish(fallback);
    img.src = cleanUrl;
  });
}
