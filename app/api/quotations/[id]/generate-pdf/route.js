import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import connectDB from '@/config/database';
import Quotation from '@/models/Quotation';
import SiteConfig from '@/models/SiteConfig';
import { renderQuotationPDF } from '@/lib/quotations/pdf/renderer';

export const dynamic = 'force-dynamic';

function getDefaultLogoBase64() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'images', 'LOGO R&R 2023.png');
    const buffer = fs.readFileSync(filePath);
    return `data:image/png;base64,${buffer.toString('base64')}`;
  } catch (e) {
    console.log('[generate-pdf] Logo fallback failed:', e.message);
    return null;
  }
}

async function generatePDF(quotationId) {
  await connectDB();
  const quotation = await Quotation.findById(quotationId).lean();
  if (!quotation) {
    return NextResponse.json({ error: 'Presupuesto no encontrado' }, { status: 404 });
  }

  const config = await SiteConfig.findOne({}).lean();

  const branding = {
    name: 'Roggero & Roma',
    logoUrl: config?.logoUrl || getDefaultLogoBase64(),
    signatureBase64: config?.signatureBase64 || null,
  };

  let pdfBuffer;
  try {
    pdfBuffer = await renderQuotationPDF(quotation, branding);
  } catch (renderErr) {
    console.error('[generate-pdf] Render failed:', renderErr);
    return NextResponse.json({ error: 'Error al renderizar PDF: ' + renderErr.message }, { status: 500 });
  }

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
  try {
    return await generatePDF(params.id);
  } catch (err) {
    console.error('[generate-pdf] Error:', err);
    return NextResponse.json({ error: err.message || 'Error al generar PDF' }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    return await generatePDF(params.id);
  } catch (err) {
    console.error('[generate-pdf] Error:', err);
    return NextResponse.json({ error: err.message || 'Error al generar PDF' }, { status: 500 });
  }
}