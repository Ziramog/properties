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

async function updateProperty(propertyId, formData) {
  // useFormState calls: action(previousState, formData)
  // When bound with .bind(null, propertyId), arguments become: (propertyId, previousState, formData)
  // So formData is actually arguments[2]
  const actualFormData = (formData instanceof FormData) ? formData : arguments[2];

  if (!actualFormData || !(actualFormData instanceof FormData)) {
    console.error('[updateProperty] No FormData received. propertyId:', propertyId, 'formData type:', typeof formData);
    return { error: 'No se recibió información del formulario.' };
  }

  try {
    console.log('[updateProperty] START — propertyId:', propertyId);

    await connectDB();
    console.log('[updateProperty] DB connected');

    const sessionUser = await getSessionUser();
    console.log('[updateProperty] Session user:', sessionUser ? { userId: sessionUser.userId, role: sessionUser.role } : null);

    if (!sessionUser || !sessionUser.userId) {
      console.error('[updateProperty] No session user — rejecting');
      return { error: 'Debes iniciar sesión para editar una propiedad.' };
    }

    const { userId } = sessionUser;

    const prop = await Property.findById(propertyId);
    console.log('[updateProperty] Found property:', prop ? prop._id.toString() : null);

    if (!prop) {
      console.error('[updateProperty] Property not found for id:', propertyId);
      return { error: 'Propiedad no encontrada.' };
    }

    if (prop.owner && prop.owner.toString() !== userId && sessionUser.role !== 'admin') {
      console.error('[updateProperty] Permission denied — owner:', prop.owner.toString(), 'userId:', userId);
      return { error: 'No tienes permiso para editar esta propiedad.' };
    }

    const removedImages = actualFormData.getAll('removedImages').filter(Boolean);
    let currentImages = (prop.images || []).filter((img) => !removedImages.includes(img));

    const newImageFiles = actualFormData.getAll('images').filter((img) => img && img.name && img.name !== '');
    console.log('[updateProperty] New image files to upload:', newImageFiles.length);

    for (const imageFile of newImageFiles) {
      const imageBuffer = await imageFile.arrayBuffer();
      const imageArray = Array.from(new Uint8Array(imageBuffer));
      const imageData = Buffer.from(imageArray);
      const imageBase64 = imageData.toString('base64');

      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${imageBase64}`,
        { folder: 'propertypulse' }
      );
      currentImages.push(result.secure_url);
      console.log('[updateProperty] Uploaded image:', result.secure_url);
    }

    if (currentImages.length === 0) {
      console.error('[updateProperty] No images left after removal');
      return { error: 'Es necesario mantener al menos una foto de la propiedad.' };
    }

    prop.set({
      type: actualFormData.get('type'),
      categories: actualFormData.getAll('categories'),
      name: actualFormData.get('name'),
      description: actualFormData.get('description'),
      location: {
        street: actualFormData.get('location.street'),
        city: actualFormData.get('location.city'),
        state: actualFormData.get('location.state'),
        zipcode: actualFormData.get('location.zipcode'),
      },
      beds: cleanNumber(actualFormData.get('beds')),
      baths: cleanNumber(actualFormData.get('baths')),
      square_feet: cleanNumber(actualFormData.get('square_feet')),
      amenities: actualFormData.getAll('amenities'),
      rates: {
        weekly: cleanNumber(actualFormData.get('rates.weekly')),
        monthly: cleanNumber(actualFormData.get('rates.monthly')),
        nightly: cleanNumber(actualFormData.get('rates.nightly')),
      },
      seller_info: {
        name: actualFormData.get('seller_info.name'),
        email: actualFormData.get('seller_info.email'),
        phone: actualFormData.get('seller_info.phone'),
      },
      owner: userId,
      operation: actualFormData.get('operation'),
      status: actualFormData.get('status'),
      images: currentImages,
    });

    await prop.save();
    console.log('[updateProperty] DB update SUCCESS for property:', propertyId);

    return { success: true, redirected: '/properties' };

  } catch (err) {
    console.error('[updateProperty] Unexpected error:', err);
    const message = err.message || 'Ocurrió un error inesperado al guardar.';
    console.error('[updateProperty] Error type:', err.constructor.name);
    console.error('[updateProperty] Error stack:', err.stack);
    return { error: message, errorType: err.constructor.name };
  }
}

export default updateProperty;