import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { fontsLoaded } from '../fonts';

const BODY_DEFAULT = fontsLoaded ? 'Lato' : 'Helvetica';
const HEADING_DEFAULT = fontsLoaded ? 'PT Serif' : 'Helvetica';

const BRAND = '#F26B2E';
const INK = '#1A1A18';
const INK2 = '#4B4B48';
const INK3 = '#8C8C88';
const BORDER = '#E8E6E0';
const SURFACE = '#F7F6F2';
const WHITE = '#FFFFFF';
const BLACK = '#000000';
const MUTED = '#b8b8b8';
const GALLERY_H = 240;
const FULL_H = 220;

const STATUS_STYLES = {
  'NUEVA': { bg: '#22C55E', label: 'Nueva' },
  'PRECIO MEJORADO': { bg: '#F59E0B', label: 'Precio Mejorado' },
  'ULTIMA UNIDAD': { bg: '#EF4444', label: 'Última Unidad' },
  'UNICO EN SU TIPO': { bg: '#8B5CF6', label: 'Único en su Tipo' },
};

function buildStyles(BODY, HEADING) {
  return StyleSheet.create({
    page: { fontFamily: BODY, backgroundColor: WHITE, padding: 0, fontSize: 9, color: INK2, lineHeight: 1.5 },

    /* Gallery: hero + side-by-side mosaic */
    galleryRow: { flexDirection: 'row', height: GALLERY_H },
    galleryHero: { width: '40%', height: GALLERY_H, paddingRight: 1 },
    galleryGrid: { width: '60%', height: GALLERY_H },
    galleryThumbRow: { flexDirection: 'row', height: '50%' },
    galleryThumbCell: { width: '33.33%', height: '100%', paddingRight: 1, paddingBottom: 1 },
    galleryThumbImg: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 },
    galleryEmptyCell: { width: '33.33%', height: '100%', backgroundColor: '#111', paddingRight: 1, paddingBottom: 1, borderRadius: 4 },
    galleryImg: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 },

    /* Single-hero fallback */
    heroFull: { width: '100%', height: FULL_H, objectFit: 'cover', borderRadius: 4 },

    /* Dark info bar */
    darkBar: { backgroundColor: BLACK, paddingTop: 20, paddingBottom: 20, paddingLeft: 32, paddingRight: 32 },
    darkRow: { flexDirection: 'row', justifyContent: 'space-between' },
    leftCol: { flex: 1, paddingRight: 20 },
    rightCol: { alignItems: 'flex-end', flexShrink: 0, maxWidth: 240 },

    /* Top logo area */
    topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    logoContainer: { width: 36, height: 36, backgroundColor: WHITE, borderRadius: 3, justifyContent: 'center', alignItems: 'center', marginRight: 10, padding: 3 },
    logoImg: { width: '100%', height: '100%', objectFit: 'contain' },
    logoText: { fontFamily: HEADING, color: BRAND, fontSize: 18, fontWeight: 700 },
    agencyName: { fontFamily: BODY, color: WHITE, fontSize: 11, fontWeight: 700, letterSpacing: 0.3 },
    quoteNumber: { fontFamily: BODY, color: INK3, fontSize: 7, marginTop: 1, letterSpacing: 0.5 },

    /* Property name */
    propName: { fontFamily: HEADING, color: WHITE, fontSize: 24, fontWeight: 400, marginBottom: 4, lineHeight: 1.15 },
    address: { fontFamily: BODY, color: MUTED, fontSize: 9, marginBottom: 8, fontWeight: 300 },

    /* Features */
    featuresRow: { flexDirection: 'row', marginTop: 4 },
    featureItem: { flexDirection: 'row', alignItems: 'center', marginRight: 14 },
    featureText: { fontFamily: BODY, color: WHITE, fontSize: 12, fontWeight: 700 },

    /* Badge for payment type */
    badgeRow: { flexDirection: 'row', marginBottom: 8, justifyContent: 'flex-end' },
    badge: { borderRadius: 3, paddingTop: 3, paddingBottom: 3, paddingLeft: 8, paddingRight: 8 },
    badgeText: { fontFamily: BODY, color: WHITE, fontSize: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 },

    /* Status pill */
    statusPill: { borderRadius: 3, paddingTop: 2, paddingBottom: 2, paddingLeft: 8, paddingRight: 8 },
    statusPillText: { fontFamily: BODY, color: WHITE, fontSize: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 },

    /* Operation / Status */
    statusBlock: { marginBottom: 10 },
    statusLine: { flexDirection: 'row', marginBottom: 2 },
    statusLabel: { fontFamily: BODY, color: MUTED, fontSize: 9, marginRight: 6, fontWeight: 300 },
    statusValue: { fontFamily: BODY, color: WHITE, fontSize: 9, fontWeight: 700 },

    /* Price */
    priceBlock: { alignItems: 'flex-end', marginBottom: 10 },
    priceUSD: { fontFamily: HEADING, color: BRAND, fontSize: 28, fontWeight: 700, lineHeight: 1.1 },
    priceARS: { fontFamily: BODY, color: 'rgba(255,255,255,0.4)', fontSize: 9, marginTop: 2, fontWeight: 300 },

    /* CTA */
    cta: { backgroundColor: BRAND, borderRadius: 4, paddingTop: 8, paddingBottom: 8, paddingLeft: 24, paddingRight: 24 },
    ctaText: { fontFamily: BODY, color: WHITE, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center' },

    /* Body sections */
    body: { paddingTop: 28, paddingBottom: 28, paddingLeft: 32, paddingRight: 32, backgroundColor: SURFACE },
    sectionCard: { backgroundColor: WHITE, borderRadius: 10, padding: 18, marginBottom: 14 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingBottom: 8, borderBottom: `1 solid ${BORDER}` },
    sectionAccent: { width: 3, height: 16, backgroundColor: BRAND, borderRadius: 2, marginRight: 10 },
    sectionTitleText: { fontFamily: HEADING, color: INK, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5 },

    /* Client */
    clientName: { fontFamily: BODY, color: INK, fontSize: 11, fontWeight: 700, marginBottom: 2 },
    clientDetail: { fontFamily: BODY, color: INK2, fontSize: 9, marginBottom: 1, fontWeight: 400 },

    /* Payment */
    paymentRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottom: `1 solid ${BORDER}` },
    paymentLabel: { fontFamily: BODY, color: INK3, fontSize: 9, fontWeight: 400 },
    paymentValue: { fontFamily: BODY, color: INK, fontSize: 9, fontWeight: 700 },
    contadoBox: { borderRadius: 6, paddingTop: 10, paddingBottom: 10, paddingLeft: 14, paddingRight: 14, marginTop: 4, marginBottom: 8, border: `1 solid ${BORDER}`, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    contadoLabel: { fontFamily: BODY, color: INK3, fontSize: 9, textTransform: 'uppercase', letterSpacing: 1 },
    contadoValue: { fontFamily: HEADING, color: INK, fontSize: 14, fontWeight: 700 },
    totalBox: { backgroundColor: INK, borderRadius: 6, paddingTop: 10, paddingBottom: 10, paddingLeft: 14, paddingRight: 14, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    totalLabel: { fontFamily: BODY, color: 'rgba(255,255,255,0.7)', fontSize: 9, textTransform: 'uppercase', letterSpacing: 1 },
    totalValue: { fontFamily: HEADING, color: WHITE, fontSize: 14, fontWeight: 700 },
    interestRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottom: 'none' },
    interestLabel: { fontFamily: BODY, color: INK3, fontSize: 9, fontWeight: 400 },
    interestValue: { fontFamily: BODY, color: BRAND, fontSize: 9, fontWeight: 700 },

    /* Description */
    descText: { fontFamily: BODY, color: INK2, fontSize: 9, lineHeight: 1.7, fontWeight: 400 },

    /* Additional info */
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottom: `1 solid ${BORDER}` },
    infoLabel: { fontFamily: BODY, color: INK3, fontSize: 9, fontWeight: 400 },
    infoValue: { fontFamily: BODY, color: INK, fontSize: 9, fontWeight: 600 },
    servicesBlock: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
    serviceTag: { backgroundColor: SURFACE, borderRadius: 3, paddingTop: 2, paddingBottom: 2, paddingLeft: 6, paddingRight: 6, marginRight: 4, marginBottom: 3 },
    serviceTagText: { fontFamily: BODY, color: INK2, fontSize: 7 },

    /* Notes */
    notesText: { fontFamily: BODY, color: INK2, fontSize: 9, lineHeight: 1.6, fontWeight: 400 },
    aiBox: { backgroundColor: SURFACE, borderRadius: 6, paddingTop: 10, paddingBottom: 10, paddingLeft: 14, paddingRight: 14 },
    aiText: { fontFamily: BODY, color: INK2, fontSize: 9, lineHeight: 1.6, fontStyle: 'italic', fontWeight: 400 },

    /* Valid until */
    validBox: { border: `1 solid ${BORDER}`, borderRadius: 6, paddingTop: 10, paddingBottom: 10, paddingLeft: 12, paddingRight: 12 },
    validLabel: { fontFamily: BODY, color: INK3, fontSize: 8, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 400 },
    validDate: { fontFamily: HEADING, color: INK, fontSize: 11, fontWeight: 700, marginTop: 2 },

    /* Signature */
    signatureContainer: { alignItems: 'flex-end', marginTop: 24 },
    signatureImg: { height: 36, objectFit: 'contain', marginBottom: 4 },
    signatureLine: { width: 180, borderTop: `1 solid ${INK}`, marginBottom: 4 },
    signatureLabel: { fontFamily: BODY, color: INK3, fontSize: 8, textAlign: 'center', fontWeight: 400 },

    /* Footer */
    footer: { borderTop: `1 solid ${BORDER}`, paddingTop: 10, paddingBottom: 10, paddingLeft: 32, paddingRight: 32, flexDirection: 'row', justifyContent: 'space-between', fontSize: 7, color: INK3, fontFamily: BODY, position: 'absolute', bottom: 16, left: 0, right: 0 },
  });
}

const defaultStyles = buildStyles(BODY_DEFAULT, HEADING_DEFAULT);

function fmt(n) { return n?.toLocaleString('es-AR') || '0'; }

const STATUS_MAP = {
  'PRECIO MEJORADO': 'Precio Mejorado',
  'ULTIMA UNIDAD': 'Última Unidad',
  'UNICO EN SU TIPO': 'Único en su Tipo',
  'NUEVA': 'Nueva',
};

function opLabel(op) {
  if (op === 'venta') return 'Venta';
  if (op === 'alquiler') return 'Alquiler';
  return op || '';
}

function SectionTitle({ text, styles }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionAccent} />
      <Text style={styles.sectionTitleText}>{text}</Text>
    </View>
  );
}

function GalleryCell({ url, empty, styles }) {
  if (empty) return <View style={styles.galleryEmptyCell} />;
  return (
    <View style={styles.galleryThumbCell}>
      <Image style={styles.galleryThumbImg} src={url} />
    </View>
  );
}

function GalleryRow({ images, styles }) {
  const cells = [];
  for (let i = 0; i < 3; i++) {
    if (i < images.length) {
      cells.push(<GalleryCell key={i} url={images[i]} styles={styles} />);
    } else {
      cells.push(<GalleryCell key={`e${i}`} empty styles={styles} />);
    }
  }
  return <View style={styles.galleryThumbRow}>{cells}</View>;
}

function StatusPill({ status, styles }) {
  const cfg = STATUS_STYLES[status];
  if (!cfg) return null;
  return (
    <View style={[styles.statusPill, { backgroundColor: cfg.bg }]}>
      <Text style={styles.statusPillText}>{cfg.label}</Text>
    </View>
  );
}

export function ModernTemplate({ quotation, branding = {}, forceHelvetica = false }) {
  const BODY = forceHelvetica ? 'Helvetica' : BODY_DEFAULT;
  const HEADING = forceHelvetica ? 'Helvetica' : HEADING_DEFAULT;
  const styles = forceHelvetica ? buildStyles(BODY, HEADING) : defaultStyles;

  const prop = quotation.properties[0];
  const pay = quotation.payment;
  const hasLogo = !!branding.logoUrl;
  const hasSignature = !!branding.signatureBase64;
  const hasARS = prop?.priceARS > 0;
  const isFinanced = pay?.type === 'financiado';
  const photos = prop?.photos || [];
  const photoCount = photos.length;
  const heroUrl = photos[0];
  const thumbs = photos.slice(1, 7);
  const row1 = thumbs.length > 0 ? thumbs.slice(0, 3) : [];
  const row2 = thumbs.length > 3 ? thumbs.slice(3, 6) : [];
  const statusCfg = STATUS_STYLES[prop?.status];

  return (
    <Document title={`Propuesta ${quotation.quoteNumber}`} author={branding.name || 'Roggero & Roma'}>
      <Page size="A4" style={styles.page}>
        {/* Gallery: hero + side-by-side mosaic */}
        {photoCount === 1 && heroUrl && (
          <Image style={styles.heroFull} src={heroUrl} />
        )}
        {photoCount >= 2 && heroUrl && (
          <View style={styles.galleryRow}>
            <View style={styles.galleryHero}>
              <Image style={styles.galleryImg} src={heroUrl} />
            </View>
            <View style={styles.galleryGrid}>
              <GalleryRow images={row1} styles={styles} />
              {thumbs.length > 3 && <GalleryRow images={row2} styles={styles} />}
            </View>
          </View>
        )}

        {/* Dark info bar */}
        <View style={styles.darkBar}>
          <View style={styles.darkRow}>
            <View style={styles.leftCol}>
              <View style={styles.topRow}>
                {hasLogo ? (
                  <View style={styles.logoContainer}>
                    <Image style={styles.logoImg} src={branding.logoUrl} />
                  </View>
                ) : (
                  <Text style={styles.logoText}>R&amp;R</Text>
                )}
                <View>
                  <Text style={styles.agencyName}>{branding.name || 'Roggero & Roma'}</Text>
                  <Text style={styles.quoteNumber}>Propuesta N° {quotation.quoteNumber}</Text>
                </View>
              </View>
              {prop?.title && (
                <Text style={styles.propName}>{prop.title}</Text>
              )}
              {prop?.address && (
                <Text style={styles.address}>{prop.address}</Text>
              )}
              <View style={styles.featuresRow}>
                {prop?.bedrooms != null && (
                  <View style={styles.featureItem}>
                    <Text style={styles.featureText}>{prop.bedrooms} dorm.</Text>
                  </View>
                )}
                {prop?.bathrooms != null && (
                  <View style={styles.featureItem}>
                    <Text style={styles.featureText}>{prop.bathrooms} baños</Text>
                  </View>
                )}
                {prop?.surface != null && (
                  <View style={styles.featureItem}>
                    <Text style={styles.featureText}>{fmt(prop.surface)} m²</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.rightCol}>
              <View style={styles.badgeRow}>
                <View style={[styles.badge, { backgroundColor: isFinanced ? '#6366F1' : '#22C55E' }]}>
                  <Text style={styles.badgeText}>{isFinanced ? 'Financiado' : 'Contado'}</Text>
                </View>
              </View>
              <View style={styles.statusBlock}>
                {opLabel(prop?.operation) && (
                  <View style={styles.statusLine}>
                    <Text style={styles.statusLabel}>OPERACIÓN</Text>
                    <Text style={styles.statusValue}>{opLabel(prop?.operation)}</Text>
                  </View>
                )}
                {statusCfg && (
                  <View style={styles.statusLine}>
                    <Text style={styles.statusLabel}>ESTADO</Text>
                    <StatusPill status={prop.status} styles={styles} />
                  </View>
                )}
              </View>
              <View style={styles.priceBlock}>
                <Text style={styles.priceUSD}>U$D {fmt(prop?.price)}</Text>
                {hasARS && (
                  <Text style={styles.priceARS}>ARS $ {fmt(prop?.priceARS)}</Text>
                )}
              </View>
              <View style={styles.cta}>
                <Text style={styles.ctaText}>Propuesta Comercial</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Body sections */}
        <View style={styles.body}>
          {/* Cliente */}
          <View style={styles.sectionCard}>
            <SectionTitle text="Cliente" styles={styles} />
            <Text style={styles.clientName}>{quotation.client.name}</Text>
            {quotation.client.email && <Text style={styles.clientDetail}>{quotation.client.email}</Text>}
            {quotation.client.phone && <Text style={styles.clientDetail}>{quotation.client.phone}</Text>}
            {quotation.client.dni && <Text style={styles.clientDetail}>DNI: {quotation.client.dni}</Text>}
          </View>

          {/* Descripción */}
          {prop?.description && (
            <View style={styles.sectionCard}>
              <SectionTitle text="Descripción" styles={styles} />
              <Text style={styles.descText}>{prop.description}</Text>
            </View>
          )}

          {/* Condiciones de pago */}
          <View style={styles.sectionCard}>
            <SectionTitle text="Condiciones de pago" styles={styles} />
            {isFinanced ? (
              <>
                {pay?.downPayment > 0 && (
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Seña / anticipo</Text>
                    <Text style={styles.paymentValue}>U$D {fmt(pay.downPayment)} ({pay.downPaymentPct}%)</Text>
                  </View>
                )}
                {pay?.installments > 0 && (
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Cuotas</Text>
                    <Text style={styles.paymentValue}>{pay.installments} cuotas de U$D {fmt(pay.installmentAmount)}</Text>
                  </View>
                )}
                {pay?.interestRate > 0 && (
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Tasa de interés</Text>
                    <Text style={styles.paymentValue}>{pay.interestRate}% anual</Text>
                  </View>
                )}
                {pay?.totalInterest > 0 && (
                  <View style={[styles.interestRow, { marginTop: 2 }]}>
                    <Text style={styles.interestLabel}>Intereses totales</Text>
                    <Text style={styles.interestValue}>U$D {fmt(pay.totalInterest)}</Text>
                  </View>
                )}
                {pay?.totalPaid > 0 && (
                  <View style={styles.totalBox}>
                    <Text style={styles.totalLabel}>Total financiado</Text>
                    <Text style={styles.totalValue}>U$D {fmt(pay.totalPaid)}</Text>
                  </View>
                )}
                {pay?.notes && (
                  <View style={[styles.paymentRow, { marginTop: 6 }]}>
                    <Text style={styles.paymentLabel}>Notas</Text>
                    <Text style={styles.paymentValue}>{pay.notes}</Text>
                  </View>
                )}
                {!pay?.totalPaid && (
                  <View style={styles.totalBox}>
                    <Text style={styles.totalLabel}>Valor total</Text>
                    <Text style={styles.totalValue}>U$D {fmt(quotation.totalValue)}</Text>
                  </View>
                )}
              </>
            ) : (
              <>
                <View style={styles.contadoBox}>
                  <Text style={styles.contadoLabel}>Pago de contado</Text>
                  <Text style={styles.contadoValue}>U$D {fmt(quotation.totalValue)}</Text>
                </View>
                {pay?.notes && (
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Notas</Text>
                    <Text style={styles.paymentValue}>{pay.notes}</Text>
                  </View>
                )}
              </>
            )}
          </View>

          {/* Información Adicional */}
          {(prop?.coveredArea != null || prop?.garage != null || (prop?.services && prop?.services.length > 0) || prop?.titlesStatus) && (
            <View style={styles.sectionCard}>
              <SectionTitle text="Información Adicional" styles={styles} />
              {prop?.coveredArea != null && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Sup. Total</Text>
                  <Text style={styles.infoValue}>{fmt(prop.coveredArea)} m²</Text>
                </View>
              )}
              {prop?.garage != null && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Cochera</Text>
                  <Text style={styles.infoValue}>{prop.garage} {prop.garage === 1 ? 'lugar' : 'lugares'}</Text>
                </View>
              )}
              {prop?.titlesStatus && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Estado de Títulos</Text>
                  <Text style={styles.infoValue}>{prop.titlesStatus}</Text>
                </View>
              )}
              {prop?.services && prop?.services.length > 0 && (
                <View style={{ marginTop: 6 }}>
                  <Text style={styles.infoLabel}>Servicios</Text>
                  <View style={styles.servicesBlock}>
                    {prop.services.map((s, i) => (
                      <View key={i} style={styles.serviceTag}>
                        <Text style={styles.serviceTagText}>{s}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Observaciones */}
          {quotation.customization.agentNotes && (
            <View style={styles.sectionCard}>
              <SectionTitle text="Observaciones" styles={styles} />
              <Text style={styles.notesText}>{quotation.customization.agentNotes}</Text>
            </View>
          )}

          {/* AI Description */}
          {quotation.customization.showAIDescription && quotation.customization.aiDescription && (
            <View style={styles.sectionCard}>
              <SectionTitle text="Nuestra Recomendación" styles={styles} />
              <View style={styles.aiBox}>
                <Text style={styles.aiText}>{quotation.customization.aiDescription}</Text>
              </View>
            </View>
          )}

          {/* Vencimiento */}
          {quotation.customization.validUntil && (
            <View style={styles.sectionCard}>
              <View style={styles.validBox}>
                <Text style={styles.validLabel}>Oferta válida hasta</Text>
                <Text style={styles.validDate}>
                  {new Date(quotation.customization.validUntil).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </Text>
              </View>
            </View>
          )}

          {/* Firma digital */}
          {hasSignature && (
            <View style={styles.signatureContainer}>
              <Image style={styles.signatureImg} src={branding.signatureBase64} />
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>{branding.name}</Text>
              <Text style={{ ...styles.signatureLabel, marginTop: 1 }}>Agente Inmobiliario</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>{branding.name || 'Roggero & Roma Inmobiliaria'}</Text>
          <Text>Generado el {new Date().toLocaleDateString('es-AR')}</Text>
        </View>
      </Page>
    </Document>
  );
}
