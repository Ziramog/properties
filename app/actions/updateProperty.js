'use server';

import connectDB from '@/config/database';
import Property from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import cloudinary from '@/config/cloudinary';

async function updateProperty(propertyId, formData) {
  await connectDB();

  const sessionUser = await getSessionUser();

  const { userId } = sessionUser;

  const existingProperty = await Property.findById(propertyId);

  // Verify ownership
  if (existingProperty.owner.toString() !== userId) {
    throw new Error('Current user does not own this property.');
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
    beds: formData.get('beds'),
    baths: formData.get('baths'),
    square_feet: formData.get('square_feet'),
    amenities: formData.getAll('amenities'),
    rates: {
      weekly: formData.get('rates.weekly'),
      monthly: formData.get('rates.monthly'),
      nightly: formData.get('rates.nightly'),
    },
    seller_info: {
      name: formData.get('seller_info.name'),
      email: formData.get('seller_info.email'),
      phone: formData.get('seller_info.phone'),
    },
    owner: userId,
  };

  // Handle images: get removed images and new uploads
  const removedImages = formData.getAll('removedImages').filter(Boolean);
  let currentImages = (existingProperty.images || []).filter(
    (img) => !removedImages.includes(img)
  );

  const newImages = formData.getAll('images').filter((img) => img.name !== '');

  for (const imageFile of newImages) {
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

  propertyData.images = currentImages;

  await Property.findByIdAndUpdate(propertyId, propertyData);

  revalidatePath('/', 'layout');

  redirect(`/properties/${propertyId}`);
}

export default updateProperty;
