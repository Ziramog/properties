'use client';
import { useEffect, useState, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import addProperty from '@/app/actions/addProperty';
import { generateDescription } from '@/app/actions/generateDescription';
import LocationPickerMap from '@/components/shared/LocationPickerMap';

const SubmitButton = ({ isRedirecting }) => {
  const { pending } = useFormStatus();
  const disabled = pending || isRedirecting;
  return (
    <div className="flex gap-4 mt-8">
      <Link href="/admin/properties" className="bg-transparent border border-[#555] hover:bg-[#222] text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center">
        Cancelar
      </Link>
      <button
        className='bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white font-bold py-3 px-4 rounded-md flex-1 transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
        type='submit'
        disabled={disabled}
      >
        {isRedirecting ? 'Redirigiendo...' : pending ? 'Agregando...' : 'Agregar Propiedad'}
      </button>
    </div>
  );
};

const PropertyAddForm = () => {
  const [state, formAction] = useFormState(async (prevState, formData) => {
    try {
      const imageFiles = formData.getAll('images');
      if (imageFiles.length > 0 && imageFiles[0].size > 0) {
        formData.delete('images');
        const options = { maxSizeMB: 0.6, maxWidthOrHeight: 1600, useWebWorker: true };
        for (const file of imageFiles) {
          if (file.name === '' || file.size === 0) continue;
          try {
            const compressedFile = await imageCompression(file, options);
            formData.append('images', compressedFile, compressedFile.name);
          } catch (error) {
            console.error('Error compressing image:', error);
            formData.append('images', file, file.name);
          }
        }
      }
      return await addProperty(prevState, formData);
    } catch (err) {
      console.error("Action error:", err);
      return { error: 'Error de red. Las imágenes pueden ser demasiado grandes (límite 4.5MB).' };
    }
  }, {});

  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (state?.error) toast.error(state.error);
    if (state?.success) {
      toast.success('Propiedad Agregada con éxito');
      if (state.redirected) {
        setIsRedirecting(true);
        setTimeout(() => {
          router.push(state.redirected);
        }, 1500);
      }
    }
  }, [state, router]);

  const [operation, setOperation] = useState('venta');
  const [isGenerating, setIsGenerating] = useState(false);
  const formRef = useRef(null);
  const [description, setDescription] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });

  const handleLocationChange = (lat, lng) => {
    setCoordinates({ lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) });
  };

  const handleGenerateAI = async () => {
    if (!formRef.current) return;
    
    const currentFormData = new FormData(formRef.current);
    const type = currentFormData.get('type');
    const city = currentFormData.get('location.city');
    const beds = currentFormData.get('beds');
    const baths = currentFormData.get('baths');
    const sqft = currentFormData.get('square_feet');

    const isLand = type === 'Terreno' || type === 'Campo' || type === 'Gran Inversión';

    if (!type || !city) {
      toast.warn('Complete Tipo y Ciudad antes de generar.');
      return;
    }

    if (!isLand && (!beds || !baths || !sqft)) {
      toast.warn('Para este tipo de propiedad, complete Dormitorios, Baños y Metros².');
      return;
    }

    setIsGenerating(true);
    const res = await generateDescription(currentFormData);
    if (res.error) {
      toast.error(res.error);
    } else if (res.description) {
      setDescription(res.description);
      toast.success('Descripción generada con IA');
    }
    setIsGenerating(false);
  };

  const inputClass = 'bg-[#111] border border-[#333] text-white rounded w-full py-2 px-3 focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-colors';
  const labelClass = 'block text-white/80 font-bold mb-2 text-sm';
  const helperClass = 'text-[11px] text-gray-500 mt-1';

  return (
    <form ref={formRef} action={formAction}>
      <h2 className='text-[28px] md:text-3xl text-center font-normal mb-8 text-white' style={{ fontFamily: 'var(--font-heading)' }}>
        Agregar Propiedad
      </h2>

      {/* Tipo */}
      <div className='mb-4'>
        <label htmlFor='type' className={labelClass}>Tipo de Propiedad</label>
        <select id='type' name='type' className={inputClass} required>
          <option value=''>Seleccione un tipo</option>
          <option value='Casa'>Casa</option>
          <option value='Departamento'>Departamento</option>
          <option value='Campo'>Campo</option>
          <option value='Terreno'>Terreno</option>
          <option value='Inmueble Comercial'>Inmueble Comercial</option>
          <option value='Gran Inversión'>Gran Inversión</option>
        </select>
      </div>

      {/* Operacion */}
      <div className='mb-4'>
        <label htmlFor='operation' className={labelClass}>Operación</label>
        <select id='operation' name='operation' className={inputClass} value={operation} onChange={(e) => setOperation(e.target.value)}>
          <option value='venta'>Venta</option>
          <option value='alquiler'>Alquiler</option>
        </select>
      </div>

      {/* Estado */}
      <div className='mb-4'>
        <label htmlFor='status' className={labelClass}>Etiqueta Especial</label>
        <select id='status' name='status' className={inputClass}>
          <option value='active'>Sin etiqueta</option>
          <option value='PRECIO MEJORADO'>Precio Mejorado</option>
          <option value='ULTIMA UNIDAD'>Última Unidad</option>
          <option value='UNICO EN SU TIPO'>Única en su Tipo</option>
          <option value='NUEVA'>Nueva</option>
          <option value='MEJOR PRECIO'>Mejor Precio del Mercado</option>
        </select>
      </div>

      {/* Nombre */}
      <div className='mb-4'>
        <label htmlFor='name' className={labelClass}>Nombre del Anuncio</label>
        <input type='text' id='name' name='name' className={inputClass} placeholder='Ej. Hermosa Casa en Alta Gracia' required />
        <p className={helperClass}>Un título atractivo y descriptivo, sin mayúsculas sostenidas.</p>
      </div>

      {/* Descripción */}
      <div className='mb-4'>
        <div className="flex justify-between items-end mb-2">
          <label htmlFor='description' className="block text-white/80 font-bold text-sm">Descripción</label>
          <button type="button" onClick={handleGenerateAI} disabled={isGenerating} className="text-[var(--color-brand)] hover:text-white text-[12px] font-semibold flex items-center gap-1 transition-colors disabled:opacity-50">
            {isGenerating ? 'Generando...' : '✨ Generar con IA'}
          </button>
        </div>
        <textarea id='description' name='description' className={inputClass} rows='5' placeholder='Describe tu propiedad o usa el botón de IA...' value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        <p className={helperClass}>Si vas a usar la IA, completa primero el tipo, ubicación, y comodidades para un mejor resultado.</p>
      </div>

      {/* Ubicacion */}
      <div className='mb-4 bg-[#181818] border border-[#222] p-4 rounded-lg'>
        <label className={labelClass}>Ubicación</label>
        <input type='text' id='street' name='location.street' className={`${inputClass} mb-3`} placeholder='Calle' />
        <div className='grid grid-cols-2 gap-3 mb-3'>
          <input type='text' id='city' name='location.city' className={inputClass} placeholder='Ciudad' required />
          <input type='text' id='state' name='location.state' className={inputClass} placeholder='Provincia' required />
        </div>
        <input type='text' id='zipcode' name='location.zipcode' className={`${inputClass} mb-3`} placeholder='Código Postal' />
        
        <label className={`${labelClass} mt-4`}>Coordenadas del Mapa</label>
        <div className='flex gap-3 mb-3'>
          <input type='number' step='any' id='lat' name='coordinates.lat' className={inputClass} placeholder='Latitud' value={coordinates.lat} onChange={(e) => setCoordinates(prev => ({...prev, lat: e.target.value}))} />
          <input type='number' step='any' id='lng' name='coordinates.lng' className={inputClass} placeholder='Longitud' value={coordinates.lng} onChange={(e) => setCoordinates(prev => ({...prev, lng: e.target.value}))} />
        </div>
        <div className="mb-2">
          <LocationPickerMap
            initialLat={coordinates.lat ? parseFloat(coordinates.lat) : undefined}
            initialLng={coordinates.lng ? parseFloat(coordinates.lng) : undefined}
            onLocationChange={handleLocationChange}
          />
        </div>
        <div className="flex justify-between items-start mt-1">
          <p className={helperClass}>El pin inicia en el centro de la ciudad. Podés arrastrarlo para afinar la ubicación.</p>
          <a href="https://www.google.com/maps" target="_blank" rel="noreferrer" className="text-[var(--color-brand)] hover:underline text-[11px] font-medium flex items-center gap-1">
            Abrir Google Maps ↗
          </a>
        </div>
      </div>

      {/* Características */}
      <div className='mb-4 flex flex-wrap gap-3'>
        <div className='flex-1 min-w-[30%]'>
          <label htmlFor='beds' className={labelClass}>Dormitorios</label>
          <input type='number' id='beds' name='beds' className={inputClass} required />
        </div>
        <div className='flex-1 min-w-[30%]'>
          <label htmlFor='baths' className={labelClass}>Baños</label>
          <input type='number' id='baths' name='baths' className={inputClass} required />
        </div>
        <div className='flex-1 min-w-[30%]'>
          <label htmlFor='square_feet' className={labelClass}>Metros²</label>
          <input type='number' id='square_feet' name='square_feet' className={inputClass} required />
        </div>
      </div>

      {/* Precio */}
      <div className='mb-6'>
        <label className={labelClass}>Precio de Venta</label>
        <div className='flex gap-2 items-start'>
          <select name='price_currency' className={`${inputClass} !w-[110px] flex-shrink-0`} disabled={operation === 'alquiler'}>
            <option value='USD'>U$D</option>
            <option value='$'>$</option>
            <option value='ARS'>ARS</option>
          </select>
          <div className='flex-1'>
            {operation === 'alquiler' ? (
              <input type='text' name='price' className={`${inputClass} bg-[#222] text-gray-500`} value='Consultar' readOnly />
            ) : (
              <input type='text' name='price' className={inputClass} placeholder='Ej: 502000' />
            )}
            <p className={helperClass}>
              {operation === 'alquiler' 
                ? 'Para alquileres, el precio se fija en "Consultar".' 
                : 'Ej: 502000 — Escribí solo números. Usá coma para miles. Escribí "Consultar" si no querés publicar el precio.'}
            </p>
          </div>
        </div>
      </div>

      {/* Comodidades */}
      <div className='mb-6'>
        <label className={labelClass}>Comodidades</label>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-3 bg-[#181818] border border-[#222] p-4 rounded-lg'>
          {[
            ['Wifi', 'Wifi'],
            ['Free Parking', 'Estacionamiento'],
            ['24/7 Security', 'Seguridad 24hs'],
            ['Balcony/Patio', 'Balcón/Patio'],
            ['Swimming Pool', 'Pileta'],
            ['Hot Tub', 'Hidromasaje'],
            ['Gym/Fitness Center', 'Gimnasio'],
            ['Elevator Access', 'Ascensor'],
            ['Wheelchair Accessible', 'Acceso Discapacitados'],
          ].map(([val, label]) => (
            <div key={val} className="flex items-center gap-2">
              <input type='checkbox' id={`amenity_${val}`} name='amenities' value={val} className='w-4 h-4 accent-[var(--color-brand)] bg-[#111] border-[#333]' />
              <label htmlFor={`amenity_${val}`} className="text-white/70 text-sm cursor-pointer">{label}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Imagenes */}
      <div className='mb-8'>
        <label htmlFor='images' className={labelClass}>
          Imágenes de la Propiedad
        </label>
        <div className="border-2 border-dashed border-[#333] hover:border-[var(--color-brand)] transition-colors bg-[#111] rounded-lg p-6 text-center">
          <input type='file' id='images' name='images' className='w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-[#222] file:text-white hover:file:bg-[#333] cursor-pointer' accept='image/*' multiple required />
          <p className={helperClass + ' mt-2'}>Puedes seleccionar múltiples imágenes. Límite sugerido: 4 fotos destacadas.</p>
        </div>
      </div>

      <SubmitButton isRedirecting={isRedirecting} />
    </form>
  );
};

export default PropertyAddForm;
