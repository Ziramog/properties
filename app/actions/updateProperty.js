'use server';

import connectDB from '@/config/database';
import Property from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';
import { redirect } from 'next/navigation';
import cloudinary from '@/config/cloudinary';

async function updateProperty(propertyId, formData) {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error('Debes iniciar sesión para editar una propiedad.');
  }

  const { userId } = sessionUser;

  const existingProperty = await Property.findById(propertyId);

  if (!existingProperty) {
    throw new Error('Propiedad no encontrada.');
  }

  if (existingProperty.owner && existingProperty.owner.toString() !== userId && sessionUser.role !== 'admin') {
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

  const removedImages = formData.getAll('removedImages').filter(Boolean);
  let currentImages = (existingProperty.images || []).filter(
    (img) => !removedImages.includes(img)
  );

  const newImageFiles = formData.getAll('images').filter((img) => img && img.name && img.name !== '');

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
  }

  if (currentImages.length === 0) {
    throw new Error('Es necesario mantener al menos una foto de la propiedad.');
  }

  propertyData.images = currentImages;

  await Property.findByIdAndUpdate(propertyId, propertyData);

  redirect(`/properties/${propertyId}`);
}

export default updateProperty;