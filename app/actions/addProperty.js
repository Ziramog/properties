'use server';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';
import cloudinary from '@/config/cloudinary';

async function addProperty(prevState, formData) {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return { error: 'Debes iniciar sesión para agregar una propiedad.' };
    }

    const { userId } = sessionUser;

    // Access all values for amenities and images
    const amenities = formData.getAll('amenities');
    const images = formData.getAll('images').filter((image) => image.name !== '');

    if (images.length === 0) {
      return { error: 'Es necesario agregar al menos una foto de la propiedad.' };
    }
    if (images.length > 10) {
      return { error: 'Máximo 10 imágenes por propiedad.' };
    }

    const lat = formData.get('coordinates.lat');
    const lng = formData.get('coordinates.lng');

    // Create the propertyData object with embedded seller_info
    const propertyData = {
      type: formData.get('type'),
      name: formData.get('name'),
      description: formData.get('description'),
      location: {
        street: formData.get('location.street'),
        city: formData.get('location.city'),
        state: formData.get('location.state'),
        zipcode: formData.get('location.zipcode'),
      },
      coordinates: (lat && lng) ? {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      } : undefined,
      beds: formData.get('beds') || undefined,
      baths: formData.get('baths') || undefined,
      square_feet: formData.get('square_feet') || undefined,
      amenities,
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
      operation: formData.get('operation') || 'venta',
      status: formData.get('status') || 'active',
    };

    const imageUrls = [];

    for (const imageFile of images) {
      const imageBuffer = await imageFile.arrayBuffer();
      const imageData = Buffer.from(imageBuffer);

      // Convert the image data to base64
      const imageBase64 = imageData.toString('base64');

      // Make request to upload to Cloudinary
      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${imageBase64}`,
        {
          folder: 'roggero-roma/properties',
          fetch_format: 'auto',
          quality: 'auto',
          width: 1200,
          crop: 'limit',
        }
      );

      imageUrls.push({ url: result.secure_url, public_id: result.public_id });
    }

    propertyData.images = imageUrls;

    const newProperty = new Property(propertyData);
    await newProperty.save();

    revalidatePath('/', 'layout');

    return { success: true, redirected: `/properties/${newProperty._id}` };
  } catch (error) {
    console.error('Failed to add property:', error);
    return { error: error.message || 'Error al agregar la propiedad.' };
  }
}

export default addProperty;
