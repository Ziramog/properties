import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import { generateWhatsAppLink } from '@/utils/whatsapp';

export const dynamic = 'force-dynamic';

/**
 * Acortador público (/w/[id]) para el Sticker «Enlace» de Instagram Stories.
 * Mantiene una URL de ~50–65 caracteres aceptada por Instagram y redirige
 * al mensaje completo de WhatsApp con nombre, localidad y ficha de la propiedad.
 */
export async function GET(request, { params }) {
  const { id } = await params;
  const reqOrigin = new URL(request.url).origin;
  const isLocal = reqOrigin.includes('localhost') || reqOrigin.includes('127.0.0.1');
  const origin = isLocal
    ? process.env.NEXT_PUBLIC_DOMAIN || 'https://roggeroyroma.com'
    : reqOrigin;

  try {
    if (id && mongoose.Types.ObjectId.isValid(id)) {
      await connectDB();
      const property = await Property.findById(id).select('_id name operation location.city location.state').lean();
      if (property) {
        const targetUrl = generateWhatsAppLink({ property, context: 'story', origin });
        return NextResponse.redirect(targetUrl, {
          status: 302,
          headers: { 'Cache-Control': 'no-store' },
        });
      }
    }
  } catch (error) {
    console.error('[w/[id]] Error resolviendo redirect WhatsApp:', error);
  }

  const fallbackUrl = generateWhatsAppLink({ context: 'general' });
  return NextResponse.redirect(fallbackUrl, {
    status: 302,
    headers: { 'Cache-Control': 'no-store' },
  });
}
