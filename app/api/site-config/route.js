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
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser || sessionUser.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const update = {};
    if (body.exchangeRateARS !== undefined) update.exchangeRateARS = body.exchangeRateARS || null;
    if (body.signatureBase64 !== undefined) update.signatureBase64 = body.signatureBase64;
    if (body.contactEmail !== undefined) update.contactEmail = body.contactEmail;
    if (body.contactPhone !== undefined) update.contactPhone = body.contactPhone;
    if (body.contactAddress !== undefined) update.contactAddress = body.contactAddress;
    
    if (Object.keys(update).length === 0) {
      return NextResponse.json({ success: true });
    }

    await SiteConfig.findOneAndUpdate({}, { $set: update }, { upsert: true });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}