import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Quotation from '@/models/Quotation';
import { renderQuotationPDF } from '@/lib/quotations/pdf/renderer';

export const dynamic = 'force-dynamic';

export async function POST(request, { params }) {
  try {
    await connectDB();
    const quotation = await Quotation.findById(params.id).lean();
    if (!quotation) {
      return NextResponse.json({ error: 'Presupuesto no encontrado' }, { status: 404 });
    }

    const pdfBuffer = await renderQuotationPDF(quotation, { name: 'Roggero & Roma' });

    // Update delivery: mark as generated
    await Quotation.findByIdAndUpdate(params.id, {
      $set: { 'delivery.pdfGeneratedAt': new Date(), status: quotation.status === 'draft' ? 'draft' : quotation.status },
    });

    // Return PDF inline
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="propuesta-${quotation.quoteNumber}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (err) {
    console.error('[generate-pdf] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
