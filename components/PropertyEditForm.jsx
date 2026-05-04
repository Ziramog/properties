'use client';
import { useState } from 'react';
import Image from 'next/image';
import updateProperty from '@/app/actions/updateProperty';

const PropertyEditForm = ({ property }) => {
  const updatePropertyById = updateProperty.bind(null, property._id);

  const [removedImages, setRemovedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const existingImages = (property.images || []).filter(
    (img) => !removedImages.includes(img)
  );

  const handleRemoveImage = (imgUrl) => {
    setRemovedImages([...removedImages, imgUrl]);
  };

  const handleUndoRemove = (imgUrl) => {
    setRemovedImages(removedImages.filter((url) => url !== imgUrl));
  };

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setPreviewImages([...previewImages, ...previews]);
  };

  const handleRemovePreview = (index) => {
    const updated = [...previewImages];
    updated.splice(index, 1);
    setPreviewImages(updated);
  };

  return (
    <form action={updatePropertyById}>
      <h2 className='text-3xl text-center font-semibold mb-6'>Editar Propiedad</h2>

      {/* Hidden removed images */}
      {removedImages.map((url) => (
        <input key={url} type='hidden' name='removedImages' value={url} />
      ))}

      <div className='mb-4'>
        <label htmlFor='type' className='block text-gray-700 font-bold mb-2'>
          Tipo de Propiedad
        </label>
        <select
          id='type'
          name='type'
          className='border rounded w-full py-2 px-3'
          defaultValue={property.type || ''}
        >
          <option value=''>Sin tipo específico</option>
          <option value='Casa'>Casa</option>
          <option value='Departamento'>Departamento</option>
          <option value='Campo'>Campo</option>
          <option value='Terreno'>Terreno</option>
          <option value='Inmueble Comercial'>Inmueble Comercial</option>
        </select>
      </div>

      <div className='mb-4'>
        <label htmlFor='operation' className='block text-gray-700 font-bold mb-2'>Operación</label>
        <select id='operation' name='operation' className='border rounded w-full py-2 px-3' defaultValue={property.operation || 'venta'}>
          <option value='venta'>Venta</option>
          <option value='alquiler'>Alquiler</option>
        </select>
      </div>

      <div className='mb-4'>
        <label htmlFor='status' className='block text-gray-700 font-bold mb-2'>Estado</label>
        <select id='status' name='status' className='border rounded w-full py-2 px-3' defaultValue={property.status || 'active'}>
          <option value='active'>Active</option>
          <option value='active_under_contract'>Active Under Contract</option>
          <option value='pending'>Pending</option>
          <option value='coming_soon'>Coming Soon</option>
          <option value='closed'>Closed</option>
        </select>
      </div>

      <div className='mb-4'>
        <label className='block text-gray-700 font-bold mb-2'>
          Categorías
        </label>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-2 bg-[#f5f0e8] p-4 rounded'>
          {['Casa', 'Departamento', 'Terreno', 'Campo', 'Inmueble Comercial', 'Gran Inversión'].map((cat) => (
            <div key={cat}>
              <input type='checkbox' id={`cat_${cat}`} name='categories' value={cat} className='mr-2'
                defaultChecked={property.categories?.includes(cat)} />
              <label htmlFor={`cat_${cat}`}>{cat}</label>
            </div>
          ))}
        </div>
      </div>

      <div className='mb-4'>
        <label className='block text-gray-700 font-bold mb-2'>Nombre</label>
        <input type='text' id='name' name='name' className='border rounded w-full py-2 px-3 mb-2'
          required defaultValue={property.name} />
      </div>

      <div className='mb-4'>
        <label className='block text-gray-700 font-bold mb-2'>Descripción</label>
        <textarea id='description' name='description' className='border rounded w-full py-2 px-3' rows='4'
          defaultValue={property.description} />
      </div>

      <div className='mb-4 bg-[#f5f0e8] p-4'>
        <label className='block text-gray-700 font-bold mb-2'>Ubicación</label>
        <input type='text' id='street' name='location.street' className='border rounded w-full py-2 px-3 mb-2'
          placeholder='Calle' defaultValue={property.location?.street} />
        <input type='text' id='city' name='location.city' className='border rounded w-full py-2 px-3 mb-2'
          placeholder='Ciudad' required defaultValue={property.location?.city} />
        <input type='text' id='state' name='location.state' className='border rounded w-full py-2 px-3 mb-2'
          placeholder='Provincia' required defaultValue={property.location?.state} />
        <input type='text' id='zipcode' name='location.zipcode' className='border rounded w-full py-2 px-3 mb-2'
          placeholder='Código Postal' defaultValue={property.location?.zipcode} />
      </div>

      <div className='mb-4 flex flex-wrap'>
        <div className='w-full sm:w-1/3 pr-2'>
          <label className='block text-gray-700 font-bold mb-2'>Dormitorios</label>
          <input type='number' id='beds' name='beds' className='border rounded w-full py-2 px-3' required
            defaultValue={property.beds} />
        </div>
        <div className='w-full sm:w-1/3 px-2'>
          <label className='block text-gray-700 font-bold mb-2'>Baños</label>
          <input type='number' id='baths' name='baths' className='border rounded w-full py-2 px-3' required
            defaultValue={property.baths} />
        </div>
        <div className='w-full sm:w-1/3 pl-2'>
          <label className='block text-gray-700 font-bold mb-2'>Metros²</label>
          <input type='number' id='square_feet' name='square_feet' className='border rounded w-full py-2 px-3' required
            defaultValue={property.square_feet} />
        </div>
      </div>

      <div className='mb-4'>
        <label className='block text-gray-700 font-bold mb-2'>Comodidades</label>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
          {[
            ['Wifi', 'Wifi'],
            ['Full kitchen', 'Cocina completa'],
            ['Washer & Dryer', 'Lavadora/Secadora'],
            ['Free Parking', 'Estacionamiento'],
            ['Swimming Pool', 'Pileta'],
            ['Hot Tub', 'Hidromasaje'],
            ['24/7 Security', 'Seguridad 24hs'],
            ['Air Conditioning', 'Aire acondicionado'],
            ['Smart TV', 'Smart TV'],
          ].map(([val, label]) => (
            <div key={val}>
              <input type='checkbox' id={`amenity_${val}`} name='amenities' value={val} className='mr-2'
                defaultChecked={property.amenities?.includes(val)} />
              <label htmlFor={`amenity_${val}`}>{label}</label>
            </div>
          ))}
        </div>
      </div>

      <div className='mb-4 bg-[#e8f0f5] p-4'>
        <label className='block text-gray-700 font-bold mb-2'>Tarifas (USD)</label>
        <div className='flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4'>
          <div className='flex-1'>
            <label className='text-xs text-gray-500 mb-1 block'>Semanal</label>
            <input type='number' name='rates.weekly' className='border rounded w-full py-2 px-3'
              defaultValue={property.rates?.weekly} />
          </div>
          <div className='flex-1'>
            <label className='text-xs text-gray-500 mb-1 block'>Mensual</label>
            <input type='number' name='rates.monthly' className='border rounded w-full py-2 px-3'
              defaultValue={property.rates?.monthly} />
          </div>
          <div className='flex-1'>
            <label className='text-xs text-gray-500 mb-1 block'>Por Noche</label>
            <input type='number' name='rates.nightly' className='border rounded w-full py-2 px-3'
              defaultValue={property.rates?.nightly} />
          </div>
        </div>
      </div>

      <div className='mb-4'>
        <label className='block text-gray-700 font-bold mb-2'>Vendedor - Nombre</label>
        <input type='text' id='seller_name' name='seller_info.name' className='border rounded w-full py-2 px-3 mb-2'
          defaultValue={property.seller_info?.name} />
      </div>
      <div className='mb-4'>
        <label className='block text-gray-700 font-bold mb-2'>Vendedor - Email</label>
        <input type='email' id='seller_email' name='seller_info.email' className='border rounded w-full py-2 px-3 mb-2'
          required defaultValue={property.seller_info?.email} />
      </div>
      <div className='mb-4'>
        <label className='block text-gray-700 font-bold mb-2'>Vendedor - Teléfono</label>
        <input type='tel' id='seller_phone' name='seller_info.phone' className='border rounded w-full py-2 px-3 mb-4'
          defaultValue={property.seller_info?.phone} />
      </div>

      {/* Images section */}
      <div className='mb-6'>
        <label className='block text-gray-700 font-bold mb-3'>Imágenes</label>

        {existingImages.length > 0 && (
          <div className='grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4'>
            {existingImages.map((img, i) => (
              <div key={img} className='relative group'>
                <Image src={img} alt={`Imagen ${i + 1}`} width={200} height={150}
                  className='w-full h-32 object-cover rounded-lg border' />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(img)}
                  className='absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow'
                  title='Eliminar imagen'
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {removedImages.length > 0 && (
          <p className='text-xs text-gray-500 mb-2'>
            {removedImages.length} imagen(es) marcada(s) para eliminar
          </p>
        )}

        <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center'>
          <input
            type='file'
            id='new_images'
            name='images'
            className='hidden'
            accept='image/*'
            multiple
            onChange={handleNewImageChange}
          />
          <label htmlFor='new_images' className='cursor-pointer'>
            <div className='text-gray-500 text-sm'>
              + Agregar nuevas imágenes
            </div>
          </label>
        </div>

        {previewImages.length > 0 && (
          <div className='grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3'>
            {previewImages.map((preview, i) => (
              <div key={i} className='relative'>
                <Image src={preview.url} alt={`Nuevo ${i + 1}`} width={200} height={150}
                  className='w-full h-32 object-cover rounded-lg border' />
                <button
                  type='button'
                  onClick={() => handleRemovePreview(i)}
                  className='absolute top-1 right-1 w-6 h-6 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center text-xs font-bold'
                  title='Quitar'
                >
                  ×
                </button>
                <div className='absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1 rounded'>
                  Nueva
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        className='bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white font-bold py-3 px-4 rounded-md w-full transition-colors'
        type='submit'
      >
        Guardar Cambios
      </button>
    </form>
  );
};
export default PropertyEditForm;
