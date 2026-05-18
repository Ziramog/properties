import { renderToBuffer } from '@react-pdf/renderer';
import { ModernTemplate } from './templates/modern';

export async function renderQuotationPDF(quotation, branding = {}) {
  const Template = ModernTemplate;

  const pdfBuffer = await renderToBuffer(
    <Template quotation={quotation} branding={branding} />
  );

  return Buffer.from(pdfBuffer);
}
