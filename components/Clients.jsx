'use client'

import { useState } from 'react'
import Image from 'next/image'
import ScrollReveal from '@/components/shared/ScrollReveal'

const CLIENTS = [
  { id: 1, name: 'DINO-GRIS', logo: '/images/clients/DINO-GRIS-169x169.png' },
  { id: 2, name: 'SANTANDER', logo: '/images/clients/SANTANDER-169x169.png' },
  { id: 3, name: 'DRACMA-SA', logo: '/images/clients/DRACMA-SA-169x169.png' },
  { id: 4, name: 'DALINGER', logo: '/images/clients/DALINGER-169x169.png' },
  { id: 5, name: 'VILLAGE', logo: '/images/clients/VILLAGE-169x169.png' },
]

const Clients = () => {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent(c => (c - 1 + CLIENTS.length) % CLIENTS.length)
  const next = () => setCurrent(c => (c + 1) % CLIENTS.length)

  return (
    <section className='bg-white py-16 md:py-24 px-4'>
      <div className='max-w-6xl mx-auto'>
        <ScrollReveal>
          <div className='text-center mb-12'>
            <p className='text-primary font-bold text-sm uppercase tracking-widest mb-3'>Partners</p>
            <h2 className='font-heading text-3xl md:text-4xl font-extrabold text-heading mb-3 tracking-tight'>
              Empresas que confían en nosotros
            </h2>
            <p className='text-body text-lg'>
              Operaciones concretadas con clientes corporativos y estudios profesionales
            </p>
          </div>
        </ScrollReveal>

        {/* Carousel */}
        <div className='relative flex items-center justify-center gap-6'>
          <button
            onClick={prev}
            className='w-11 h-11 rounded-xl bg-gray-100 hover:bg-primary hover:text-white transition-all duration-200 flex items-center justify-center text-heading shrink-0 shadow-subtle'
            aria-label='Cliente anterior'
          >
            <svg width='16' height='16' fill='none' stroke='currentColor' viewBox='0 0 16 16'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M10 3 6 8l4 5' />
            </svg>
          </button>

          <div className='flex gap-8 overflow-hidden items-center'>
            {[0, 1, 2].map(offset => {
              const index = (current + offset) % CLIENTS.length
              const client = CLIENTS[index]
              const isCenter = offset === 1
              return (
                <div
                  key={client.id}
                  className={`flex flex-col items-center gap-3 transition-all duration-500 ${
                    isCenter ? 'scale-100 opacity-100' : 'scale-75 opacity-30'
                  }`}
                >
                  <div className='w-28 h-28 relative grayscale hover:grayscale-0 transition-all duration-300'>
                    <Image
                      src={client.logo}
                      alt={client.name}
                      fill
                      className='object-contain'
                      sizes='112px'
                    />
                  </div>
                  <span className='text-xs text-muted font-semibold tracking-wider uppercase'>
                    {client.name}
                  </span>
                </div>
              )
            })}
          </div>

          <button
            onClick={next}
            className='w-11 h-11 rounded-xl bg-gray-100 hover:bg-primary hover:text-white transition-all duration-200 flex items-center justify-center text-heading shrink-0 shadow-subtle'
            aria-label='Siguiente cliente'
          >
            <svg width='16' height='16' fill='none' stroke='currentColor' viewBox='0 0 16 16'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 3l4 5-4 5' />
            </svg>
          </button>
        </div>

        {/* Dots */}
        <div className='flex justify-center gap-2 mt-8'>
          {CLIENTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'bg-primary w-8' : 'bg-gray-200 w-2.5 hover:bg-gray-300'
              }`}
              aria-label={`Ir al cliente ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Clients
