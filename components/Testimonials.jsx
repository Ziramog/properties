'use client'

import { useState } from 'react'
import Image from 'next/image'

// TODO: Replace with real testimonials from Franco
const TESTIMONIALS = [
  {
    id: 1,
    name: 'María González',
    role: 'Compradora — Casa en Jesús María',
    quote: 'Franco me acompañó en todo el proceso de compra. La atención fue impecable y encontré mi hogar ideal en tiempo récord.',
    avatar: null,
  },
  {
    id: 2,
    name: 'Roberto Fernández',
    role: 'Vendedor — Departamento en Villa General Belgrano',
    quote: 'Profesionalismo total. Vendieron mi propiedad en menos de 60 días y el proceso fue透明 y sin sorpresas.',
    avatar: null,
  },
  {
    id: 3,
    name: 'Laura Mazzoni',
    role: 'Inversora — 3 departamentos en Córdoba Capital',
    quote: 'Confío en Roggero & Roma para todas mis operaciones inmobiliarias. El conocimiento del mercado local es incomparable.',
    avatar: null,
  },
]

const TestimonialCard = ({ testimonial, isActive }) => {
  const initials = testimonial.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)

  return (
    <div
      className={`
        absolute inset-0 flex flex-col items-center justify-center text-center
        transition-all duration-500
        ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}
      `}
    >
      {/* Quote mark */}
      <div className='text-6xl text-[#E94560] font-serif leading-none mb-4'>"</div>

      {/* Quote */}
      <blockquote className='max-w-2xl'>
        <p className='text-lg md:text-xl text-[#1A1A2E] leading-relaxed mb-6'>
          {testimonial.quote}
        </p>
      </blockquote>

      {/* Author */}
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-full bg-[#E94560] flex items-center justify-center text-white font-bold text-sm'>
          {initials}
        </div>
        <div className='text-left'>
          <p className='font-semibold text-[#1A1A2E] text-sm'>{testimonial.name}</p>
          <p className='text-xs text-gray-500'>{testimonial.role}</p>
        </div>
      </div>
    </div>
  )
}

const Testimonials = () => {
  const [active, setActive] = useState(0)

  const prev = () => setActive(a => (a - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  const next = () => setActive(a => (a + 1) % TESTIMONIALS.length)

  return (
    <section className='bg-[#1A1A2E] py-16 px-4'>
      <div className='max-w-4xl mx-auto'>
        <div className='text-center mb-10'>
          <h2 className='text-3xl md:text-4xl font-bold text-white mb-3'>
            Lo que dicen nuestros clientes
          </h2>
          <p className='text-gray-400'>
           Experiencias reales de personas que confiaron en nosotros
          </p>
        </div>

        {/* Card */}
        <div className='relative bg-white rounded-2xl p-8 md:p-12 min-h-[280px] overflow-hidden shadow-xl'>
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.id} testimonial={t} isActive={i === active} />
          ))}

          {/* Navigation arrows */}
          <button
            onClick={prev}
            className='absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-100 hover:bg-[#E94560] hover:text-white transition-colors flex items-center justify-center text-[#1A1A2E]'
            aria-label='Testimonio anterior'
          >
            <svg width='16' height='16' fill='none' stroke='currentColor' viewBox='0 0 16 16'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M10 3 6 8l4 5' />
            </svg>
          </button>
          <button
            onClick={next}
            className='absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-100 hover:bg-[#E94560] hover:text-white transition-colors flex items-center justify-center text-[#1A1A2E]'
            aria-label='Siguiente testimonio'
          >
            <svg width='16' height='16' fill='none' stroke='currentColor' viewBox='0 0 16 16'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 3l4 5-4 5' />
            </svg>
          </button>
        </div>

        {/* Dots */}
        <div className='flex justify-center gap-2 mt-6'>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === active ? 'bg-[#E94560] w-6' : 'bg-gray-600 hover:bg-gray-400'
              }`}
              aria-label={`Ir al testimonio ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
