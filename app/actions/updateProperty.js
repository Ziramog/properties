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
  console.log('[updateProperty] CALLED with propertyId:', propertyId, 'formData type:', typeof formData, 'instanceof FormData:', formData instanceof FormData);
  const actualFormData = (formData instanceof FormData) ? formData : arguments[2];
  console.log('[updateProperty] actualFormData instanceof FormData:', actualFormData instanceof FormData);

  if (!actualFormData || !(actualFormData instanceof FormData)) {
    console.error('[updateProperty] No FormData received. propertyId:', propertyId, 'formData type:', typeof formData);
    return { error: 'No se recibió información del formulario.' };
  }

  try {
    console.log('[updateProperty] STEP 1: DB connect');
    await connectDB();
    console.log('[updateProperty] STEP 2: getSessionUser');
    const sessionUser = await getSessionUser();
    console.log('[updateProperty] Session user:', sessionUser ? { userId: sessionUser.userId, role: sessionUser.role } : null);

    if (!sessionUser || !sessionUser.userId) {
      console.error('[updateProperty] No session user — rejecting');
      return { error: 'Debes iniciar sesión para editar una propiedad.' };
    }

    const { userId } = sessionUser;

    console.log('[updateProperty] STEP 3: find property —', propertyId);
    const prop = await Property.findById(propertyId);
    console.log('[updateProperty] STEP 3 done. prop:', prop ? prop._id.toString() : null);

    if (!prop) {
      console.error('[updateProperty] Property not found for id:', propertyId);
      return { error: 'Propiedad no encontrada.' };
    }

    console.log('[updateProperty] STEP 4: process images');
    const removedImages = actualFormData.getAll('removedImages').filter(Boolean);
    let currentImages = (prop.images || []).filter((img) => !removedImages.includes(img));

    const newImageFiles = actualFormData.getAll('images').filter((img) => img && img.name && img.name !== '');
    console.log('[updateProperty] STEP 4: images entries from FormData, total:', actualFormData.getAll('images').length, 'filtered:', newImageFiles.length);
    for (let j = 0; j < actualFormData.getAll('images').length; j++) {
      const img = actualFormData.getAll('images')[j];
      console.log('[updateProperty] STEP 4: images entry', j, 'type:', typeof img, 'constructor:', img?.constructor?.name, 'size:', img?.size, 'name:', img?.name);
    }
    console.log('[updateProperty] STEP 4: removed:', removedImages.length, 'current kept:', currentImages.length, 'new files:', newImageFiles.length);

    for (let i = 0; i < newImageFiles.length; i++) {
      console.log('[updateProperty] STEP 4: uploading image', i + 1);
      const imageFile = newImageFiles[i];
      console.log('[updateProperty] STEP 4: imageFile type:', imageFile.constructor.name, 'size:', imageFile.size, 'name:', imageFile.name);
      const imageBuffer = await imageFile.arrayBuffer();
      console.log('[updateProperty] STEP 4: imageBuffer byteLength:', imageBuffer.byteLength);
      const imageArray = Array.from(new Uint8Array(imageBuffer));
      console.log('[updateProperty] STEP 4: imageArray length:', imageArray.length);
      const imageData = Buffer.from(imageArray);
      console.log('[updateProperty] STEP 4: imageData length:', imageData.length);
      const imageBase64 = imageData.toString('base64');
      console.log('[updateProperty] STEP 4: imageBase64 length:', imageBase64.length, 'first 50 chars:', imageBase64.substring(0, 50));

      // upload_stream with callback → promise
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'propertypulse' },
          (error, result) => {
            console.log('[updateProperty] STEP 4: cloudinary callback error:', error);
            console.log('[updateProperty] STEP 4: cloudinary callback result:', result ? 'success' : 'null');
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.on('error', (err) => console.log('[updateProperty] STEP 4: stream error event:', err));
        stream.write(imageData);
        stream.end();
      });
      currentImages.push(result.secure_url);
      console.log('[updateProperty] STEP 4: uploaded', i + 1, result.secure_url);
    }

    if (currentImages.length === 0) {
      console.error('[updateProperty] STEP 4: No images left');
      return { error: 'Es necesario mantener al menos una foto de la propiedad.' };
    }

    console.log('[updateProperty] STEP 5: prop.set()');
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
    console.log('[updateProperty] STEP 5: prop.set() done');

    console.log('[updateProperty] STEP 6: prop.save()');
    await prop.save();
    console.log('[updateProperty] STEP 6: prop.save() SUCCESS');

    return { success: true, redirected: '/properties' };

  } catch (err) {
    console.error('[updateProperty] Unexpected error:', err);
    console.error('[updateProperty] Error type:', err.constructor.name);
    console.error('[updateProperty] Error stack:', err.stack);
    const ownProps = err && typeof err === 'object' ? Object.keys(err) : [];
    console.error('[updateProperty] Error own properties:', ownProps);
    const message = (err && typeof err.message === 'string') ? err.message : JSON.stringify(err);
    return { error: `[${err.constructor.name}] ${message}`, errorKeys: ownProps };
  }
}

export default updateProperty;