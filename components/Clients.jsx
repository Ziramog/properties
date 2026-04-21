'use client'

// TODO: Replace with real client logos (upload SVGs/PNGs to /public/clients/)
// For now: text-based placeholder logos that look professional
const CLIENTS = [
  { id: 1, name: 'Estudio Jurídico Rosenberg', abbr: 'EJR' },
  { id: 2, name: 'Grupo Romano S.A.', abbr: 'GR' },
  { id: 3, name: 'Inmobiliaria Del Centro', abbr: 'IDC' },
  { id: 4, name: 'Mazzoni Construcciones', abbr: 'MC' },
  { id: 5, name: 'Río Tercero Propiedades', abbr: 'RTP' },
  { id: 6, name: 'Grupo Aguirre', abbr: 'GA' },
]

const ClientLogo = ({ client, index }) => {
  // Generate a deterministic hue from the index for subtle color variation
  const hue = (index * 47 + 220) % 360

  return (
    <div className='flex flex-col items-center justify-center gap-2 px-6 py-4'>
      {/* Abstract logo mark */}
      <div
        className='w-14 h-14 rounded-lg flex items-center justify-center font-bold text-lg text-white'
        style={{ backgroundColor: `hsl(${hue}, 45%, 40%)` }}
      >
        {client.abbr}
      </div>
      <span className='text-xs text-gray-500 text-center leading-tight max-w-[90px]'>
        {client.name}
      </span>
    </div>
  )
}

const Clients = () => {
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

        {/* Logo strip — scrolls on mobile */}
        <div className='flex flex-wrap justify-center gap-2 md:gap-0'>
          {CLIENTS.map((client, i) => (
            <ClientLogo key={client.id} client={client} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Clients
