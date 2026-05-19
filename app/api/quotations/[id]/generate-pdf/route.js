import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Quotation from '@/models/Quotation';
import { renderQuotationPDF } from '@/lib/quotations/pdf/renderer';

export const dynamic = 'force-dynamic';

async function generatePDF(quotationId) {
  await connectDB();
  const quotation = await Quotation.findById(quotationId).lean();
  if (!quotation) {
    return NextResponse.json({ error: 'Presupuesto no encontrado' }, { status: 404 });
  }

  const pdfBuffer = await renderQuotationPDF(quotation, { name: 'Roggero & Roma' });

  // Try to save to Vercel Blob if token is set
  let pdfUrl = null;
  try {
    const { put } = await import('@vercel/blob');
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`quotations/propuesta-${quotation.quoteNumber}.pdf`, pdfBuffer, {
        contentType: 'application/pdf',
        access: 'public',
      });
      pdfUrl = blob.url;
    }
  } catch (blobError) {
    console.log('[generate-pdf] Blob upload skipped:', blobError.message);
  }

  // Update delivery record
  const update = { 'delivery.pdfGeneratedAt': new Date() };
  if (pdfUrl) update['delivery.pdfUrl'] = pdfUrl;
  await Quotation.findByIdAndUpdate(quotationId, { $set: update });

  // If saved to blob, redirect to the permanent URL
  if (pdfUrl) {
    return NextResponse.redirect(pdfUrl, 302);
  }

  // Fallback: return inline PDF
  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="propuesta-${quotation.quoteNumber}.pdf"`,
      'Content-Length': pdfBuffer.length.toString(),
    },
  });
}

export async function POST(request, { params }) {
  return generatePDF(params.id);
}

export async function GET(request, { params }) {
  return generatePDF(params.id);
}