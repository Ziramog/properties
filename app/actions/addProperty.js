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

    let lat = formData.get('coordinates.lat');
    let lng = formData.get('coordinates.lng');

    let parsedLat = undefined;
    let parsedLng = undefined;

    if (lat && lng) {
      lat = lat.replace(',', '.');
      lng = lng.replace(',', '.');
      const tempLat = parseFloat(lat);
      const tempLng = parseFloat(lng);
      
      // Valida rangos: latitud de -90 a 90, longitud de -180 a 180
      if (!isNaN(tempLat) && !isNaN(tempLng) && tempLat >= -90 && tempLat <= 90 && tempLng >= -180 && tempLng <= 180) {
        parsedLat = tempLat;
        parsedLng = tempLng;
      }
    }

    // Create the propertyData object with embedded seller_info
    const propertyData = {
      type: formData.get('type'),
      name: formData.get('name'),
      description: formData.get('description'),
      price: formData.get('operation') === 'alquiler' || formData.get('price') === 'Consultar' || !formData.get('price') ? 'Consultar' : `${formData.get('price_currency') || 'USD'} ${formData.get('price')}`,
      location: {
        street: formData.get('location.street'),
        city: formData.get('location.city'),
        state: formData.get('location.state'),
        zipcode: formData.get('location.zipcode'),
      },
      coordinates: (parsedLat !== undefined && parsedLng !== undefined) ? {
        lat: parsedLat,
        lng: parsedLng,
      } : undefined,
      beds: formData.get('beds') || undefined,
      baths: formData.get('baths') || undefined,
      square_feet: formData.get('square_feet') || undefined,
      amenities,
      owner: userId,
      operation: formData.get('operation') || 'venta',
      status: formData.get('status') || 'active',
    };

    const uploadPromises = images.map(async (imageFile) => {
      const imageBuffer = await imageFile.arrayBuffer();
      const imageData = Buffer.from(imageBuffer);

      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'roggero-roma/properties',
            fetch_format: 'auto',
            quality: 'auto',
            width: 1200,
            crop: 'limit',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve({ url: result.secure_url, public_id: result.public_id });
          }
        );
        stream.end(imageData);
      });
    });

    const imageUrls = await Promise.all(uploadPromises);

    propertyData.images = imageUrls;

    const newProperty = new Property(propertyData);
    await newProperty.save();

    revalidatePath('/admin/properties');

    return { success: true, redirected: `/admin/properties` };
  } catch (error) {
    console.error('Failed to add property:', error);
    return { error: error.message || 'Error al agregar la propiedad.' };
  }
}

export default addProperty;
