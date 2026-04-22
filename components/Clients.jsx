'use client'

import { useState } from 'react'
import Image from 'next/image'

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
    <section className='bg-white py-14 px-4 border-t border-gray-100'>
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-10'>
          <h2 className='text-2xl md:text-3xl font-bold text-[#1A1A2E] mb-2'>
            Empresas que confían en nosotros
          </h2>
          <p className='text-gray-500 text-sm'>
            Operaciones concretadas con clientes corporativos y estudios profesionales
          </p>
        </div>

        {/* Carousel */}
        <div className='relative flex items-center justify-center gap-4'>
          <button
            onClick={prev}
            className='w-10 h-10 rounded-full bg-gray-100 hover:bg-[#E94560] hover:text-white transition-colors flex items-center justify-center text-[#1A1A2E] shrink-0'
            aria-label='Cliente anterior'
          >
            <svg width='16' height='16' fill='none' stroke='currentColor' viewBox='0 0 16 16'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M10 3 6 8l4 5' />
            </svg>
          </button>

          <div className='flex gap-6 overflow-hidden'>
            {[0, 1, 2].map(offset => {
              const index = (current + offset) % CLIENTS.length
              const client = CLIENTS[index]
              const isCenter = offset === 1
              return (
                <div
                  key={client.id}
                  className={`flex flex-col items-center gap-2 transition-all duration-300 ${
                    isCenter ? 'scale-100 opacity-100' : 'scale-75 opacity-40'
                  }`}
                >
                  <div className='w-24 h-24 relative'>
                    <Image
                      src={client.logo}
                      alt={client.name}
                      fill
                      className='object-contain'
                      sizes='96px'
                    />
                  </div>
                  <span className='text-xs text-gray-500 font-medium tracking-wide'>
                    {client.name}
                  </span>
                </div>
              )
            })}
          </div>

          <button
            onClick={next}
            className='w-10 h-10 rounded-full bg-gray-100 hover:bg-[#E94560] hover:text-white transition-colors flex items-center justify-center text-[#1A1A2E] shrink-0'
            aria-label='Siguiente cliente'
          >
            <svg width='16' height='16' fill='none' stroke='currentColor' viewBox='0 0 16 16'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 3l4 5-4 5' />
            </svg>
          </button>
        </div>

        {/* Dots */}
        <div className='flex justify-center gap-2 mt-6'>
          {CLIENTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === current ? 'bg-[#E94560] w-6' : 'bg-gray-300 hover:bg-gray-400'
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
