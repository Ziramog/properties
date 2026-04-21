'use client'

import WhatsAppIcon from './icons/WhatsAppIcon'

// Franco's WhatsApp Business number (replace with actual number)
const WHATSAPP_NUMBER = '+5493571646525'

const WhatsAppButton = ({ property }) => {
  // Build pre-filled message
  const message = encodeURIComponent(
    `Hola! Vi la propiedad "${property.name}" en Roggero & Roma y me gustaría recibir más información.`
  )

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${message}`

  return (
    <a
      href={whatsappUrl}
      target='_blank'
      rel='noopener noreferrer'
      className='
        flex items-center justify-center gap-3 w-full py-4 px-6
        bg-[#25D366] hover:bg-[#20bd5a] text-white
        font-semibold rounded-xl shadow-lg
        transition-all duration-200 hover:shadow-xl hover:scale-[1.02]
        active:scale-[0.98]
      '
    >
      <WhatsAppIcon className='w-6 h-6' />
      <span className='text-base'>Contactar por WhatsApp</span>
    </a>
  )
}

export default WhatsAppButton
