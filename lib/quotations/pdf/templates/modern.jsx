import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { fontsLoaded } from '../fonts';

// ── Typography ──
const BODY = fontsLoaded ? 'Lato' : 'Helvetica';
const HEADING = fontsLoaded ? 'PT Serif' : 'Helvetica';

// ── Color System (exact match to property website) ──
const BRAND = '#f26b2e';
const INK = '#1a1a18';
const INK2 = '#4b4b48';
const INK3 = '#8c8c88';
const SURFACE = '#f7f6f2';
const SURFACE_DARK = '#1c1c1a';
const BORDER = '#e8e6e0';
const WHITE = '#ffffff';
const BLACK = '#000000';
const MUTED = '#b8b8b8';

// ── Status colors ──
const STATUS_COLORS = {
  'NUEVA': { bg: '#22C55E', text: WHITE },
  'PRECIO MEJORADO': { bg: '#F59E0B', text: WHITE },
  'ULTIMA UNIDAD': { bg: '#EF4444', text: WHITE },
  'UNICO EN SU TIPO': { bg: '#8B5CF6', text: WHITE },
};

// ── Helpers ──
function fmt(n) { return n?.toLocaleString('es-AR') || '0'; }

function opLabel(op) {
  if (op === 'venta') return 'Venta';
  if (op === 'alquiler') return 'Alquiler';
  return op || '';
}

function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function todayShort() {
  return new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
}

// ── Shared Styles Builder ──
function buildStyles() {
  return StyleSheet.create({
    // ── Page & Layout ──
    page: { fontFamily: BODY, backgroundColor: WHITE, padding: 0, fontSize: 9, color: INK2, lineHeight: 1.6 },
    contentWrap: { paddingTop: 32, paddingBottom: 32, paddingLeft: 40, paddingRight: 40 },
    row: { flexDirection: 'row' },
    col65: { width: '65%', paddingRight: 20 },
    col35: { width: '35%' },
    col50: { width: '50%' },

    // ── Header (shared across content pages) ──
    pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, paddingBottom: 16, paddingLeft: 40, paddingRight: 40, borderBottom: `0.5 solid ${BORDER}` },
    headerLogoBox: { width: 28, height: 28, backgroundColor: WHITE, borderRadius: 3, justifyContent: 'center', alignItems: 'center', padding: 2, border: `0.5 solid ${BORDER}` },
    headerLogoImg: { width: '100%', height: '100%', objectFit: 'contain' },
    headerBrand: { fontFamily: BODY, fontSize: 9, fontWeight: 700, color: INK, letterSpacing: 0.5 },
    headerMeta: { fontFamily: BODY, fontSize: 7, color: INK3, letterSpacing: 0.5 },

    // ── Section Heading with Brand Bar ──
    sectionHeading: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    sectionTitle: { fontFamily: HEADING, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: INK },
    brandBar: { width: 50, height: 2.5, backgroundColor: BRAND, marginLeft: 10 },

    // ── Cover Page ──
    coverHero: { width: '100%', height: 500, objectFit: 'cover' },
    coverDarkSection: { backgroundColor: BLACK, paddingTop: 36, paddingBottom: 36, paddingLeft: 40, paddingRight: 40, flex: 1 },
    coverTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    coverLogoBox: { width: 32, height: 32, backgroundColor: WHITE, borderRadius: 3, justifyContent: 'center', alignItems: 'center', marginRight: 10, padding: 2 },
    coverLogoImg: { width: '100%', height: '100%', objectFit: 'contain' },
    coverAgency: { fontFamily: BODY, fontSize: 10, fontWeight: 700, color: WHITE, letterSpacing: 0.5 },
    coverPropTitle: { fontFamily: HEADING, fontSize: 26, fontWeight: 400, color: WHITE, lineHeight: 1.15, marginBottom: 8 },
    coverLocation: { fontFamily: BODY, fontSize: 11, fontWeight: 300, color: MUTED, marginBottom: 20 },
    coverDivider: { width: 40, height: 1.5, backgroundColor: BRAND, marginBottom: 20 },
    coverPrice: { fontFamily: HEADING, fontSize: 26, fontWeight: 400, color: WHITE, marginBottom: 24 },
    coverLabel: { fontFamily: BODY, fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: INK3, marginBottom: 3 },
    coverValue: { fontFamily: BODY, fontSize: 10, fontWeight: 400, color: WHITE },
    coverClientRow: { marginTop: 4 },

    // ── Property Details Page ──
    descText: { fontFamily: BODY, fontSize: 9.5, color: INK2, lineHeight: 1.7, textAlign: 'justify' },
    featureGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
    featureCell: { width: '50%', paddingVertical: 8, paddingRight: 8, borderBottom: `0.5 solid ${BORDER}` },
    featureLabel: { fontFamily: BODY, fontSize: 7.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: INK3, marginBottom: 3 },
    featureValue: { fontFamily: BODY, fontSize: 11, fontWeight: 700, color: INK },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottom: `0.5 solid ${BORDER}` },
    infoLabel: { fontFamily: BODY, fontSize: 8, fontWeight: 400, color: INK3 },
    infoValue: { fontFamily: BODY, fontSize: 9, fontWeight: 600, color: INK },
    servicesWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
    serviceTag: { backgroundColor: SURFACE, borderRadius: 3, paddingTop: 2, paddingBottom: 2, paddingLeft: 6, paddingRight: 6, marginRight: 4, marginBottom: 3 },
    serviceTagText: { fontFamily: BODY, fontSize: 7.5, color: INK2 },

    // ── Financing Page ──
    finCard: { border: `0.5 solid ${BORDER}`, borderRadius: 6, padding: 16, marginBottom: 10 },
    finCardLabel: { fontFamily: BODY, fontSize: 7.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: INK3, marginBottom: 6 },
    finCardValue: { fontFamily: HEADING, fontSize: 16, fontWeight: 400, color: INK },
    finCardValueLarge: { fontFamily: HEADING, fontSize: 20, fontWeight: 400, color: INK },
    finCardSub: { fontFamily: BODY, fontSize: 8, color: INK3, marginTop: 2 },
    finHighlightCard: { borderRadius: 6, padding: 16, marginBottom: 10, backgroundColor: INK },
    finHighlightLabel: { fontFamily: BODY, fontSize: 7.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.6)', marginBottom: 6 },
    finHighlightValue: { fontFamily: HEADING, fontSize: 20, fontWeight: 400, color: WHITE },
    finNotes: { fontFamily: BODY, fontSize: 9, color: INK2, lineHeight: 1.6, marginTop: 8, paddingTop: 8, borderTop: `0.5 solid ${BORDER}` },
    finGrid2: { flexDirection: 'row', gap: 10 },
    finGrid2Col: { flex: 1 },

    // ── Contact Page ──
    contactCtaText: { fontFamily: HEADING, fontSize: 18, fontWeight: 400, color: INK, lineHeight: 1.3, marginBottom: 20 },
    contactLabel: { fontFamily: BODY, fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: INK3, marginBottom: 4 },
    contactValue: { fontFamily: BODY, fontSize: 10, fontWeight: 600, color: INK, marginBottom: 10 },
    contactButton: { backgroundColor: BRAND, borderRadius: 6, paddingTop: 10, paddingBottom: 10, paddingLeft: 24, paddingRight: 24, marginTop: 16, alignSelf: 'flex-start' },
    contactButtonText: { fontFamily: BODY, fontSize: 9, fontWeight: 700, color: WHITE, textTransform: 'uppercase', letterSpacing: 1.5 },
    signatureBlock: { alignItems: 'flex-end', marginTop: 20 },
    signatureImg: { height: 32, objectFit: 'contain', marginBottom: 4 },
    signatureLine: { width: 140, height: 0.5, backgroundColor: INK, marginBottom: 4 },
    signatureName: { fontFamily: BODY, fontSize: 9, fontWeight: 700, color: INK },
    signatureRole: { fontFamily: BODY, fontSize: 7.5, color: INK3 },
    validityBox: { border: `0.5 solid ${BORDER}`, borderRadius: 6, padding: 12, marginTop: 16 },

    // ── Footer ──
    footer: { borderTop: `0.5 solid ${BORDER}`, paddingTop: 10, paddingBottom: 10, paddingLeft: 40, paddingRight: 40, flexDirection: 'row', justifyContent: 'space-between', fontSize: 7, color: INK3, fontFamily: BODY, position: 'absolute', bottom: 12, left: 0, right: 0 },
  });
}

const s = buildStyles();

// ── Shared Components ──
function PageHeader({ branding, quotation }) {
  const hasLogo = !!branding.logoUrl;
  return (
    <View style={s.pageHeader}>
      <View style={s.row}>
        {hasLogo ? (
          <View style={s.headerLogoBox}>
            <Image style={s.headerLogoImg} src={branding.logoUrl} />
          </View>
        ) : null}
        <View>
          <Text style={s.headerBrand}>{branding.name || 'Roggero & Roma'}</Text>
          <Text style={s.headerMeta}>Propuesta N° {quotation.quoteNumber}</Text>
        </View>
      </View>
      <Text style={s.headerMeta}>{todayShort()}</Text>
    </View>
  );
}

function SectionHeading({ title }) {
  return (
    <View style={s.sectionHeading}>
      <Text style={s.sectionTitle}>{title}</Text>
      <View style={s.brandBar} />
    </View>
  );
}

function StatusPill({ status }) {
  const cfg = STATUS_COLORS[status];
  if (!cfg) return null;
  return (
    <View style={{ backgroundColor: cfg.bg, borderRadius: 3, paddingTop: 2, paddingBottom: 2, paddingLeft: 8, paddingRight: 8 }}>
      <Text style={{ fontFamily: BODY, color: cfg.text, fontSize: 7.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {status === 'NUEVA' ? 'Nueva' : status === 'PRECIO MEJORADO' ? 'Precio Mejorado' : status === 'ULTIMA UNIDAD' ? 'Última Unidad' : 'Único en su Tipo'}
      </Text>
    </View>
  );
}

// ── Page 1: Cover ──
function CoverPage({ prop, quotation, branding }) {
  const hasLogo = !!branding.logoUrl;
  const heroUrl = prop?.photos?.[0];

  return (
    <Page size="A4" style={{ padding: 0 }}>
      {/* Full-bleed hero image */}
      {heroUrl ? (
        <Image style={s.coverHero} src={heroUrl} />
      ) : (
        <View style={{ width: '100%', height: 500, backgroundColor: SURFACE_DARK }} />
      )}

      {/* Dark info section */}
      <View style={s.coverDarkSection}>
        {/* Agency branding */}
        <View style={s.coverTopRow}>
          {hasLogo ? (
            <View style={s.coverLogoBox}>
              <Image style={s.coverLogoImg} src={branding.logoUrl} />
            </View>
          ) : null}
          <Text style={s.coverAgency}>{branding.name || 'Roggero & Roma'}</Text>
        </View>

        {/* Property title */}
        <Text style={s.coverPropTitle}>{prop?.title || ''}</Text>
        {prop?.address ? <Text style={s.coverLocation}>{prop.address}</Text> : null}

        {/* Brand accent divider */}
        <View style={s.coverDivider} />

        {/* Price */}
        <Text style={s.coverPrice}>U$D {fmt(prop?.price)}</Text>

        {/* Client & proposal meta */}
        <View style={s.coverClientRow}>
          <Text style={s.coverLabel}>Preparado para</Text>
          <Text style={s.coverValue}>{quotation.client?.name || ''}</Text>
        </View>
        <View style={{ marginTop: 8 }}>
          <Text style={s.coverLabel}>Propuesta</Text>
          <Text style={s.coverValue}>{quotation.quoteNumber} · {todayShort()}</Text>
        </View>
      </View>
    </Page>
  );
}

// ── Page 2: Property Details ──
function DetailsPage({ prop, quotation, branding }) {
  const hasDescription = !!prop?.description;
  const hasAdditionalInfo = prop?.coveredArea != null || prop?.garage != null || (prop?.services && prop?.services.length > 0) || prop?.titlesStatus;

  return (
    <Page size="A4" style={s.page}>
      <PageHeader branding={branding} quotation={quotation} />

      <View style={s.contentWrap}>
        {/* Two-column layout: Description (left) + Specs (right) */}
        <View style={s.row}>
          {/* LEFT: Description */}
          <View style={s.col65}>
            {hasDescription && (
              <>
                <SectionHeading title="Descripción" />
                <Text style={s.descText}>{prop.description}</Text>
              </>
            )}

            {/* If no description, show highlights or note */}
            {!hasDescription && (
              <>
                <SectionHeading title="Propiedad" />
                <Text style={s.descText}>{prop?.title || ''}</Text>
              </>
            )}
          </View>

          {/* RIGHT: Características */}
          <View style={s.col35}>
            <SectionHeading title="Características" />
            <View style={s.featureGrid}>
              <View style={s.featureCell}>
                <Text style={s.featureLabel}>Precio</Text>
                <Text style={s.featureValue}>U$D {fmt(prop?.price)}</Text>
              </View>
              {prop?.surface != null && (
                <View style={s.featureCell}>
                  <Text style={s.featureLabel}>Área Total</Text>
                  <Text style={s.featureValue}>{fmt(prop.surface)} m²</Text>
                </View>
              )}
              {prop?.bedrooms != null && (
                <View style={s.featureCell}>
                  <Text style={s.featureLabel}>Dormitorios</Text>
                  <Text style={s.featureValue}>{prop.bedrooms}</Text>
                </View>
              )}
              {prop?.bathrooms != null && (
                <View style={s.featureCell}>
                  <Text style={s.featureLabel}>Baños</Text>
                  <Text style={s.featureValue}>{prop.bathrooms}</Text>
                </View>
              )}
              {prop?.garage != null && (
                <View style={s.featureCell}>
                  <Text style={s.featureLabel}>Cochera</Text>
                  <Text style={s.featureValue}>{prop.garage} {prop.garage === 1 ? 'lugar' : 'lugares'}</Text>
                </View>
              )}
              <View style={s.featureCell}>
                <Text style={s.featureLabel}>Tipo</Text>
                <Text style={s.featureValue}>{prop?.type || ''}</Text>
              </View>
              <View style={s.featureCell}>
                <Text style={s.featureLabel}>Operación</Text>
                <Text style={s.featureValue}>{opLabel(prop?.operation)}</Text>
              </View>
              {prop?.status && STATUS_COLORS[prop.status] && (
                <View style={s.featureCell}>
                  <Text style={s.featureLabel}>Estado</Text>
                  <StatusPill status={prop.status} />
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Información Adicional (full width, below) */}
        {hasAdditionalInfo && (
          <View style={{ marginTop: 20 }}>
            <SectionHeading title="Información Adicional" />
            {prop?.coveredArea != null && (
              <View style={s.infoRow}>
                <Text style={s.infoLabel}>Sup. Cubierta</Text>
                <Text style={s.infoValue}>{fmt(prop.coveredArea)} m²</Text>
              </View>
            )}
            {prop?.titlesStatus && (
              <View style={s.infoRow}>
                <Text style={s.infoLabel}>Estado de Títulos</Text>
                <Text style={s.infoValue}>{prop.titlesStatus}</Text>
              </View>
            )}
            {prop?.services && prop.services.length > 0 && (
              <View style={{ marginTop: 6 }}>
                <Text style={s.infoLabel}>Servicios</Text>
                <View style={s.servicesWrap}>
                  {prop.services.map((svc, i) => (
                    <View key={i} style={s.serviceTag}>
                      <Text style={s.serviceTagText}>{svc}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={s.footer} fixed>
        <Text>{branding.name || 'Roggero & Roma Inmobiliaria'}</Text>
        <Text>Página 2</Text>
      </View>
    </Page>
  );
}

// ── Page 3: Investment Terms ──
function FinancingPage({ quotation, branding }) {
  const pay = quotation.payment;
  const isFinanced = pay?.type === 'financiado';

  return (
    <Page size="A4" style={s.page}>
      <PageHeader branding={branding} quotation={quotation} />

      <View style={s.contentWrap}>
        <SectionHeading title="Condiciones de Pago" />

        {isFinanced ? (
          <>
            {/* Financiado: 2-col grid for initial + installments */}
            <View style={s.finGrid2}>
              {pay?.downPayment > 0 && (
                <View style={[s.finCard, s.finGrid2Col]}>
                  <Text style={s.finCardLabel}>Seña / Anticipo</Text>
                  <Text style={s.finCardValueLarge}>U$D {fmt(pay.downPayment)}</Text>
                  <Text style={s.finCardSub}>{pay.downPaymentPct}% del valor</Text>
                </View>
              )}
              {pay?.installments > 0 && (
                <View style={[s.finCard, s.finGrid2Col]}>
                  <Text style={s.finCardLabel}>Cuotas</Text>
                  <Text style={s.finCardValueLarge}>{pay.installments}</Text>
                  <Text style={s.finCardSub}>U$D {fmt(pay.installmentAmount)} c/u</Text>
                </View>
              )}
            </View>

            {pay?.interestRate > 0 && (
              <View style={s.finCard}>
                <Text style={s.finCardLabel}>Tasa de Interés</Text>
                <Text style={s.finCardValue}>{pay.interestRate}% anual</Text>
              </View>
            )}

            {pay?.totalInterest > 0 && (
              <View style={s.finCard}>
                <Text style={s.finCardLabel}>Intereses Totales</Text>
                <Text style={s.finCardValue}>U$D {fmt(pay.totalInterest)}</Text>
              </View>
            )}

            {pay?.totalPaid > 0 && (
              <View style={s.finHighlightCard}>
                <Text style={s.finHighlightLabel}>Total Financiado</Text>
                <Text style={s.finHighlightValue}>U$D {fmt(pay.totalPaid)}</Text>
              </View>
            )}

            {!pay?.totalPaid && (
              <View style={s.finHighlightCard}>
                <Text style={s.finHighlightLabel}>Valor Total</Text>
                <Text style={s.finHighlightValue}>U$D {fmt(quotation.totalValue)}</Text>
              </View>
            )}
          </>
        ) : (
          <>
            {/* Contado: single elegant card */}
            <View style={s.finHighlightCard}>
              <Text style={s.finHighlightLabel}>Pago de Contado</Text>
              <Text style={s.finHighlightValue}>U$D {fmt(quotation.totalValue)}</Text>
            </View>
          </>
        )}

        {pay?.notes && (
          <Text style={s.finNotes}>{pay.notes}</Text>
        )}
      </View>

      {/* Footer */}
      <View style={s.footer} fixed>
        <Text>{branding.name || 'Roggero & Roma Inmobiliaria'}</Text>
        <Text>Página 3</Text>
      </View>
    </Page>
  );
}

// ── Page 4: Contact ──
function ContactPage({ quotation, branding }) {
  const hasSignature = !!branding.signatureBase64;

  return (
    <Page size="A4" style={s.page}>
      <PageHeader branding={branding} quotation={quotation} />

      <View style={s.contentWrap}>
        <SectionHeading title="Contacto" />

        <Text style={s.contactCtaText}>¿Preguntas o quieres agendar una visita?</Text>

        <Text style={s.contactLabel}>Asesoría Inmobiliaria</Text>
        <Text style={s.contactValue}>{branding.name || 'Roggero & Roma'}</Text>

        <Text style={s.contactLabel}>WhatsApp</Text>
        <Text style={s.contactValue}>+54 9 3547 563911</Text>

        <Text style={s.contactLabel}>Email</Text>
        <Text style={s.contactValue}>info@roggeroyroma.com.ar</Text>

        {/* CTA Button */}
        <View style={s.contactButton}>
          <Text style={s.contactButtonText}>Contáctanos</Text>
        </View>

        {/* Digital Signature */}
        {hasSignature && (
          <View style={s.signatureBlock}>
            <Image style={s.signatureImg} src={branding.signatureBase64} />
            <View style={s.signatureLine} />
            <Text style={s.signatureName}>{branding.name}</Text>
            <Text style={s.signatureRole}>Agente Inmobiliario</Text>
          </View>
        )}

        {/* Validity */}
        {quotation.customization?.validUntil && (
          <View style={s.validityBox}>
            <Text style={s.contactLabel}>Oferta válida hasta</Text>
            <Text style={s.contactValue}>{fmtDate(quotation.customization.validUntil)}</Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={s.footer} fixed>
        <Text>{branding.name || 'Roggero & Roma Inmobiliaria'}</Text>
        <Text>Página 4</Text>
      </View>
    </Page>
  );
}

// ── Main Export ──
export function ModernTemplate({ quotation, branding = {}, forceHelvetica = false }) {
  const prop = quotation.properties?.[0] || {};

  return (
    <Document title={`Propuesta ${quotation.quoteNumber}`} author={branding.name || 'Roggero & Roma'}>
      <CoverPage prop={prop} quotation={quotation} branding={branding} />
      <DetailsPage prop={prop} quotation={quotation} branding={branding} />
      <FinancingPage quotation={quotation} branding={branding} />
      <ContactPage quotation={quotation} branding={branding} />
    </Document>
  );
}
