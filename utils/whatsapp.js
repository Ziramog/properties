const WA_NUMBER = '5493547563911';

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
 * @param {string}  [options.context]       – 'hero' | 'seller' | 'float' | 'general'
 * @param {string}  [options.customMessage] – Override auto-generated message
 * @returns {string} Full WhatsApp URL
 */
export function generateWhatsAppLink({ property, context = 'general', customMessage } = {}) {
  let message;

  if (customMessage) {
    message = customMessage;
  } else if (property) {
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/properties/${property._id}`
        : `https://roggeroyroma.com.ar/properties/${property._id}`;
    message = `Hola! Vi la propiedad "${property.name}" en Roggero & Roma y me gustaría recibir más información.\n\n${url}`;
  } else {
    message = MESSAGES[context] || MESSAGES.general;
  }

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Expose the canonical number for tel: links */
export const WHATSAPP_NUMBER = WA_NUMBER;
export const PHONE_NUMBER = '+543547425454';
export const PHONE_DISPLAY = '(03547) 425454';
