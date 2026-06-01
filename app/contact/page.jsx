'use client'

import WhatsAppIcon from '@/components/icons/WhatsAppIcon'
import ScrollReveal from '@/components/shared/ScrollReveal'

const WHATSAPP_NUMBER = '+5493547563911'

const contactInfo = [
  {
    label: 'Teléfono',
    value: '+54 9 9354 7563911',
    href: 'tel:+5493547563911',
  },
  {
    label: 'Email',
    value: 'info@roggeroyroma.com.ar',
    href: 'mailto:info@roggeroyroma.com.ar',
  },
  {
    label: 'Dirección',
    value: 'Alta Gracia, Córdoba, Argentina',
    href: null,
  },
]

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FA] py-12">
      <div className="max-w-3xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[#1A1A2E] mb-2">Contacto</h1>
            <p className="text-gray-600">
              ¿Tenés alguna consulta? Comunicate con nosotros.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <ul className="space-y-6 mb-8">
            {contactInfo.map((item) => (
              <li key={item.label} className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-500 w-24">{item.label}</span>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-[#E94560] hover:underline font-medium"
                  >
                    {item.value}
                  </a>
                ) : (
                  <span className="text-[#1A1A2E] font-medium">{item.value}</span>
                )}
              </li>
            ))}
          </ul>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center justify-center gap-3 w-full py-4 px-6
              bg-[#25D366] hover:bg-[#20bd5a] text-white
              font-semibold rounded-xl shadow-lg
              transition-all duration-200 hover:shadow-xl hover:scale-[1.02]
              active:scale-[0.98]
            "
          >
            <WhatsAppIcon className="w-6 h-6" />
            <span className="text-base">Contactar por WhatsApp</span>
          </a>
        </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-4">
            Roggero & Roma
          </h2>
          <p className="text-gray-600 text-sm">
            Tu inmobiliaria de confianza en Alta Gracia y toda la provincia de Córdoba.
            Más de 30 años ayudando a familias a encontrar su hogar ideal.
          </p>
        </div>
        </ScrollReveal>
      </div>
    </main>
  )
}