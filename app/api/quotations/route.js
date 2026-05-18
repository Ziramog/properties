import connectDB from '@/config/database';
import Quotation from '@/models/Quotation';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  await connectDB();
  const quotes = await Quotation.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json(quotes);
}

export async function POST(request) {
  await connectDB();
  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Generate quote number
    const year = new Date().getFullYear();
    const count = await Quotation.countDocuments({ createdAt: { $gte: new Date(`${year}-01-01`) } });
    const sequential = String(count + 1).padStart(4, '0');
    const quoteNumber = `RR-${year}-${sequential}`;

    const totalValue = body.properties.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0);

    const quotation = await Quotation.create({
      quoteNumber,
      properties: body.properties,
      client: body.client,
      payment: body.payment,
      customization: body.customization || {},
      totalValue,
      createdBy: sessionUser.userId,
    });

    revalidatePath('/admin/quotations');
    return NextResponse.json({ id: quotation._id.toString(), quoteNumber }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/quotations] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
