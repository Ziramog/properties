export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import { isSocialStudioAuthorized } from '@/utils/socialStudioAuth';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import { formatPriceDisplay } from '@/utils/priceUtils';
import { getAreaDisplay } from '@/utils/propertyDisplay';

function orderImages(images = [], galleryOrder = []) {
  const normalized = images
    .map((img) => (typeof img === 'string' ? img : img?.url))
    .filter(Boolean);

  if (!Array.isArray(galleryOrder) || galleryOrder.length === 0) {
    return normalized.map((url) => ({ url }));
  }

  return [...normalized]
    .sort((a, b) => {
      const idxA = galleryOrder.indexOf(a);
      const idxB = galleryOrder.indexOf(b);
      return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
    })
    .map((url) => ({ url }));
}

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!isSocialStudioAuthorized(session)) {
      return NextResponse.json(
        { error: 'Acceso no autorizado: requiere rol superadmin o administrador autorizado' },
        { status: 401 }
      );
    }

    const rawProperties = await Property.find({})
      .select(
        'name type operation price location beds baths garage covered_area square_feet images gallery_order is_published is_featured updatedAt createdAt'
      )
      .sort({ updatedAt: -1, createdAt: -1 })
      .lean();

    const properties = rawProperties.map((prop) => ({
      _id: String(prop._id),
      name: prop.name || '',
      type: prop.type || '',
      operation: prop.operation || 'venta',
      priceDisplay: formatPriceDisplay(prop.price, prop.operation),
      areaDisplay: getAreaDisplay(prop),
      beds: Number(prop.beds) || 0,
      baths: Number(prop.baths) || 0,
      garage: Number(prop.garage) || 0,
      isPublished: prop.is_published !== false,
      isFeatured: Boolean(prop.is_featured),
      location: {
        city: prop.location?.city || '',
        state: prop.location?.state || '',
      },
      images: orderImages(prop.images, prop.gallery_order),
    }));

    return NextResponse.json({ properties }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('[SocialStudio-Properties] Error:', err);
    return NextResponse.json({ error: 'Error al cargar propiedades' }, { status: 500 });
  }
}
