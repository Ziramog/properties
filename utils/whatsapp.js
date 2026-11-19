const WA_NUMBER = '5493547563911';
const WA_RENTAL_NUMBER = '5493547596631';

/**
 * Devuelve el número de WhatsApp correspondiente para exportaciones a Instagram/Facebook:
 * alquileres usa la línea dedicada (5493547596631) y el resto conserva la principal (5493547563911).
 */
export function getSocialWhatsAppTarget(property) {
  const isRental = String(property?.operation || '').toLowerCase() === 'alquiler';
  return isRental
    ? { number: WA_RENTAL_NUMBER, display: '+54 9 3547 596631' }
    : { number: WA_NUMBER, display: '+54 9 3547 563911' };
}

const MESSAGES = {

  hero: 'Hola! Estoy buscando una propiedad en las Sierras de Córdoba. ¿Me pueden asesorar?',

  seller:

    'Hola! Quiero vender mi propiedad. ¿Me pueden dar información sobre su servicio de tasación?',

  rental: 'Hola! Estoy interesado en alquilar una propiedad. ¿Me pueden asesorar con las opciones disponibles?',

  float: 'Hola! Estoy navegando su sitio web y tengo una consulta.',

  general: 'Hola! Quisiera información sobre propiedades disponibles.',

};

/**
 * Generate a WhatsApp deep link with pre-filled message.
 *
 * @param {object}  [options]
 * @param {object}  [options.property]      – Property object (card / detail)
 * @param {string}  [options.context]       – 'hero' | 'seller' | 'float' | 'general' | 'story'
 * @param {string}  [options.customMessage] – Override auto-generated message
 * @param {string}  [options.origin]        – Canonical origin for server-side URLs
 * @returns {string} Full WhatsApp URL
 */
export function generateWhatsAppLink({ property, context = 'general', customMessage, origin } = {}) {
  let message;

  if (customMessage) {
    message = customMessage;
  } else if (property) {
    const baseOrigin =
      origin ||
      (typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_DOMAIN || 'https://roggeroyroma.com');
    const url = `${baseOrigin.replace(/\/$/, '')}/properties/${property._id}`;
    if (context === 'story') {
      const loc = [property.location?.city, property.location?.state].filter(Boolean).join(', ');
      const locStr = loc ? `, ${loc}` : '';
      message = `Hola, estoy interesado en la propiedad ${property.name || 'publicada'}${locStr}, publicada por Roggero & Roma. Quisiera recibir más información: ${url}`;
    } else {
      message = `Hola! Vi la propiedad "${property.name}" en Roggero & Roma y me gustaría recibir más información.\n\n${url}`;
    }
  } else {
    message = MESSAGES[context] || MESSAGES.general;
  }

  const targetNumber =
    context === 'story' || context === 'feed'
      ? getSocialWhatsAppTarget(property).number
      : WA_NUMBER;

  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * URL corta compatible con el Sticker «Enlace» de Instagram Stories (~50-65 chars).
 * Redirige vía /w/[id] al deep-link completo de WhatsApp con todos los datos de la propiedad.
 */
export function generateStoryShortWhatsAppLink({ propertyId, origin } = {}) {
  if (!propertyId) return `https://wa.me/${WA_NUMBER}`;
  const isBrowserProd = typeof window !== 'undefined' && !window.location.hostname.includes('localhost');
  const baseOrigin =
    origin ||
    (isBrowserProd
      ? window.location.origin
      : process.env.NEXT_PUBLIC_DOMAIN || 'https://roggeroyroma.com');
  return `${baseOrigin.replace(/\/$/, '')}/w/${propertyId}`;
}

/** Expose the canonical number for tel: links */
export const WHATSAPP_NUMBER = WA_NUMBER;
export const WHATSAPP_RENTAL_NUMBER = WA_RENTAL_NUMBER;
export const PHONE_NUMBER = '+543547425454';
export const PHONE_DISPLAY = '(03547) 425454';
