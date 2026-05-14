'use server';

import connectDB from '@/config/database';
import Property from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';
import cloudinary from '@/config/cloudinary';

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
    let currentImages = (prop.images || []).filter((img) => !removedImages.includes(img));

    const newImageFiles = formData.getAll('images').filter(
      (img) => img && img.name && img.name !== '' && img.size > 0
    );

    for (const imageFile of newImageFiles) {
      const imageBuffer = await imageFile.arrayBuffer();
      const imageArray = Array.from(new Uint8Array(imageBuffer));
      const imageData = Buffer.from(imageArray);
      const imageBase64 = imageData.toString('base64');

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
          { folder: 'propertypulse' }
        );
        stream.write(imageData);
        stream.end();
      });
      currentImages.push(result.secure_url);
    }

    if (currentImages.length === 0) {
      return { error: 'Es necesario mantener al menos una foto de la propiedad.' };
    }

    prop.set({
      type: formData.get('type'),
      name: formData.get('name'),
      description: formData.get('description'),
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

    return { success: true, redirected: '/properties' };
  } catch (err) {
    console.error('[updateProperty] Error:', err);
    const message = (err && typeof err.message === 'string') ? err.message : JSON.stringify(err);
    return { error: `[${err.constructor?.name || 'Error'}] ${message}` };
  }
}

export default updateProperty;