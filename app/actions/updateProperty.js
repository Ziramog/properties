'use server';

import connectDB from '@/config/database';
import Property from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';
import { redirect } from 'next/navigation';
import cloudinary from '@/config/cloudinary';

async function updateProperty(propertyId, formData) {
  console.log('[updateProperty] START — propertyId:', propertyId);

  try {
    await connectDB();
    console.log('[updateProperty] DB connected');
  } catch (dbConnErr) {
    console.error('[updateProperty] DB connection FAILED:', dbConnErr);
    throw dbConnErr;
  }

  let sessionUser;
  try {
    sessionUser = await getSessionUser();
    console.log('[updateProperty] Session user:', sessionUser ? { userId: sessionUser.userId, role: sessionUser.role } : null);
  } catch (sessionErr) {
    console.error('[updateProperty] getSessionUser FAILED:', sessionErr);
    throw sessionErr;
  }

  if (!sessionUser || !sessionUser.userId) {
    console.error('[updateProperty] No session user — rejecting');
    throw new Error('Debes iniciar sesión para editar una propiedad.');
  }

  const { userId } = sessionUser;

  let existingProperty;
  try {
    existingProperty = await Property.findById(propertyId);
    console.log('[updateProperty] Found property:', existingProperty ? existingProperty._id.toString() : null);
  } catch (findErr) {
    console.error('[updateProperty] Property.findById FAILED:', findErr);
    throw findErr;
  }

  if (!existingProperty) {
    console.error('[updateProperty] Property not found for id:', propertyId);
    throw new Error('Propiedad no encontrada.');
  }

  if (existingProperty.owner && existingProperty.owner.toString() !== userId && sessionUser.role !== 'admin') {
    console.error('[updateProperty] Permission denied — owner:', existingProperty.owner.toString(), 'userId:', userId);
    throw new Error('No tienes permiso para editar esta propiedad.');
  }

  const propertyData = {
    type: formData.get('type'),
    categories: formData.getAll('categories'),
    name: formData.get('name'),
    description: formData.get('description'),
    location: {
      street: formData.get('location.street'),
      city: formData.get('location.city'),
      state: formData.get('location.state'),
      zipcode: formData.get('location.zipcode'),
    },
    beds: formData.get('beds') || undefined,
    baths: formData.get('baths') || undefined,
    square_feet: formData.get('square_feet') || undefined,
    amenities: formData.getAll('amenities'),
    rates: {
      weekly: formData.get('rates.weekly') || undefined,
      monthly: formData.get('rates.monthly') || undefined,
      nightly: formData.get('rates.nightly') || undefined,
    },
    seller_info: {
      name: formData.get('seller_info.name'),
      email: formData.get('seller_info.email'),
      phone: formData.get('seller_info.phone'),
    },
    owner: userId,
    operation: formData.get('operation'),
    status: formData.get('status'),
  };

  console.log('[updateProperty] Built propertyData — name:', propertyData.name, 'categories:', propertyData.categories.length, 'images count TBD');

  const removedImages = formData.getAll('removedImages').filter(Boolean);
  let currentImages = (existingProperty.images || []).filter(
    (img) => !removedImages.includes(img)
  );

  const newImageFiles = formData.getAll('images').filter((img) => img && img.name && img.name !== '');
  console.log('[updateProperty] New image files to upload:', newImageFiles.length);

  for (const imageFile of newImageFiles) {
    try {
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
    } catch (cloudErr) {
      console.error('[updateProperty] Cloudinary upload FAILED:', cloudErr);
      throw cloudErr;
    }
  }

  if (currentImages.length === 0) {
    console.error('[updateProperty] No images left after removal');
    throw new Error('Es necesario mantener al menos una foto de la propiedad.');
  }

  propertyData.images = currentImages;
  console.log('[updateProperty] Final image count:', currentImages.length);

  try {
    await Property.findByIdAndUpdate(propertyId, propertyData);
    console.log('[updateProperty] DB update SUCCESS for property:', propertyId);
  } catch (dbUpdateErr) {
    console.error('[updateProperty] DB update FAILED:', dbUpdateErr);
    throw dbUpdateErr;
  }

  console.log('[updateProperty] Redirecting to /properties');
  redirect(`/properties`);
}

export default updateProperty;