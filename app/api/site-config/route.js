import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import SiteConfig from '@/models/SiteConfig';
import { getSessionUser } from '@/utils/getSessionUser';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const config = await SiteConfig.findOne({}).lean();
    return NextResponse.json({
      logoUrl: config?.logoUrl || null,
      exchangeRateARS: config?.exchangeRateARS || null,
      signatureBase64: config?.signatureBase64 || null,
      contactEmail: config?.contactEmail || 'info@roggeroyroma.com.ar',
      contactPhone: config?.contactPhone || '+54 9 3547 563911',
      contactAddress: config?.contactAddress || 'Blvd. Carlos Pellegrini 710',
      whatsappGroupLink: config?.whatsappGroupLink || '',
      heroTitle: config?.heroTitle || 'Vendemos Inmuebles, Construimos Confianza',
      heroSubtitle: config?.heroSubtitle || 'Alta Gracia, Córdoba, Argentina',
      aboutTitle: config?.aboutTitle || 'Silvia Roggero de Roma',
      aboutSubtitle: config?.aboutSubtitle || 'NEGOCIOS INMOBILIARIOS',
      aboutText: config?.aboutText || 'Contamos con 20 años de experiencia propia en el rubro inmobiliario. Trabajamos con el objetivo de brindar confianza y seriedad en el rubro, dar información real y adecuada sobre el mercado y ofrecer la mejor variedad de alternativas a nuestros clientes.',
      footerDescription: config?.footerDescription || 'En Roggero & Roma te acompañamos en cada paso. Nuestra experiencia asegura las mejores oportunidades del mercado inmobiliario.',
      analyticsId: config?.analyticsId || 'G-PW4FH9WHQB',
      facebookPixelId: config?.facebookPixelId || '',
      whatsappDefaultMessage: config?.whatsappDefaultMessage || 'Hola, vengo desde la web y me gustaría recibir más información.',
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const sessionUser = await getSessionUser();
    // Allow both admin and superadmin to update site config
    if (!sessionUser || (sessionUser.role !== 'admin' && sessionUser.role !== 'superadmin')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const update = {};
    
    // Config normal
    if (body.exchangeRateARS !== undefined) update.exchangeRateARS = body.exchangeRateARS || null;
    if (body.signatureBase64 !== undefined) update.signatureBase64 = body.signatureBase64;
    if (body.contactEmail !== undefined) update.contactEmail = body.contactEmail;
    if (body.contactPhone !== undefined) update.contactPhone = body.contactPhone;
    if (body.contactAddress !== undefined) update.contactAddress = body.contactAddress;
    if (body.whatsappGroupLink !== undefined) update.whatsappGroupLink = body.whatsappGroupLink;
    
    // CMS Fields
    if (body.heroTitle !== undefined) update.heroTitle = body.heroTitle;
    if (body.heroSubtitle !== undefined) update.heroSubtitle = body.heroSubtitle;
    if (body.aboutTitle !== undefined) update.aboutTitle = body.aboutTitle;
    if (body.aboutSubtitle !== undefined) update.aboutSubtitle = body.aboutSubtitle;
    if (body.aboutText !== undefined) update.aboutText = body.aboutText;
    if (body.footerDescription !== undefined) update.footerDescription = body.footerDescription;
    
    // Extras
    if (body.analyticsId !== undefined) update.analyticsId = body.analyticsId;
    if (body.facebookPixelId !== undefined) update.facebookPixelId = body.facebookPixelId;
    if (body.whatsappDefaultMessage !== undefined) update.whatsappDefaultMessage = body.whatsappDefaultMessage;
    
    if (Object.keys(update).length === 0) {
      return NextResponse.json({ success: true });
    }

    await SiteConfig.findOneAndUpdate({}, { $set: update }, { upsert: true });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}