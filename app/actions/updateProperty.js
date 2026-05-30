'use server';

import connectDB from '@/config/database';
import Property from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';
import cloudinary from '@/config/cloudinary';
import { revalidatePath } from 'next/cache';

const cleanNumber = (val) => {
  if (val === '' || val === null || val === undefined) return undefined;
  const num = parseFloat(val);
  return isNaN(num) ? undefined : num;
};

async function updateProperty(prevState, formData) {
  const propertyId = formData.get('propertyId');

  if (!propertyId) {
    return { error: 'Falta el ID de la propiedad.' };
  }

  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return { error: 'Debes iniciar sesión para editar una propiedad.' };
    }

    const { userId } = sessionUser;

    const prop = await Property.findById(propertyId);

    if (!prop) {
      return { error: 'Propiedad no encontrada.' };
    }

    const removedImages = formData.getAll('removedImages').filter(Boolean);
    const getImageUrl = (img) => (typeof img === 'string' ? img : img?.url);

    // Destroy removed images from Cloudinary
    for (const removedUrl of removedImages) {
      const entry = (prop.images || []).find((img) => getImageUrl(img) === removedUrl);
      const pid = typeof entry === 'object' ? entry?.public_id : null;
      if (pid) {
        try {
          await cloudinary.uploader.destroy(pid);
        } catch (e) {
          console.error('Cloudinary destroy failed:', e.message);
        }
      }
    }

    let currentImages = (prop.images || []).filter(
      (img) => !removedImages.includes(getImageUrl(img))
    );

    const newImageFiles = formData.getAll('images').filter(
      (img) => img && img.name && img.name !== '' && img.size > 0
    );

    for (const imageFile of newImageFiles) {
      const imageBuffer = await imageFile.arrayBuffer();
      const imageData = Buffer.from(imageBuffer);
      const imageBase64 = imageData.toString('base64');

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'roggero-roma/properties', fetch_format: 'auto', quality: 'auto', width: 1200, crop: 'limit' },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(imageData);
      });
      currentImages.push({ url: result.secure_url, public_id: result.public_id });
    }

    if (currentImages.length === 0) {
      return { error: 'Es necesario mantener al menos una foto de la propiedad.' };
    }

    prop.set({
      type: formData.get('type'),
      name: formData.get('name'),
      description: formData.get('description'),
      price: formData.get('price') === 'Consultar' ? 'Consultar' : `${formData.get('price_currency') || 'USD'} ${formData.get('price')}`,
      location: {
        street: formData.get('location.street'),
        city: formData.get('location.city'),
        state: formData.get('location.state'),
        zipcode: formData.get('location.zipcode'),
      },
      beds: cleanNumber(formData.get('beds')),
      baths: cleanNumber(formData.get('baths')),
      square_feet: cleanNumber(formData.get('square_feet')),
      amenities: formData.getAll('amenities'),
      rates: {
        weekly: cleanNumber(formData.get('rates.weekly')),
        monthly: cleanNumber(formData.get('rates.monthly')),
        nightly: cleanNumber(formData.get('rates.nightly')),
      },
      seller_info: {
        name: formData.get('seller_info.name'),
        email: formData.get('seller_info.email'),
        phone: formData.get('seller_info.phone'),
      },
      owner: userId,
      operation: formData.get('operation'),
      status: formData.get('status'),
      images: currentImages,
    });

    await prop.save();

    revalidatePath('/');
    revalidatePath('/properties');
    revalidatePath(`/properties/${propertyId}`);
    revalidatePath('/profile');

    return { success: true, redirected: '/properties' };
  } catch (err) {
    console.error('[updateProperty] Error:', err);
    const message = (err && typeof err.message === 'string') ? err.message : JSON.stringify(err);
    return { error: `[${err.constructor?.name || 'Error'}] ${message}` };
  }
}

export default updateProperty;