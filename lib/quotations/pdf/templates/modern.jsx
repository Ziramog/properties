import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

const BRAND = '#F26B2E';
const MUTED = '#b8b8b8';

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', backgroundColor: '#ffffff', padding: 0, fontSize: 10, color: '#333' },
  /* Hero */
  heroImage: { width: '100%', height: 180, objectFit: 'cover' },
  /* Thumbnail grid */
  thumbRow: { flexDirection: 'row' },
  thumbCell: { width: '16.666%', height: 55 },
  thumbImg: { width: '100%', height: '100%', objectFit: 'cover' },
  /* Dark info bar */
  darkBar: { backgroundColor: '#000000', padding: '20 32', minHeight: 180 },
  darkRow: { flexDirection: 'row', justifyContent: 'space-between' },
  leftCol: { flex: 1, paddingRight: 20 },
  rightCol: { alignItems: 'flex-end', flexShrink: 0, maxWidth: 260 },
  /* Top logo area */
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  logoContainer: { width: 36, height: 36, backgroundColor: '#fff', borderRadius: 3, justifyContent: 'center', alignItems: 'center', marginRight: 8, padding: 3 },
  logoImg: { width: '100%', height: '100%', objectFit: 'contain' },
  logoText: { color: BRAND, fontSize: 18, fontWeight: 700 },
  agencyBlock: {},
  agencyName: { color: '#fff', fontSize: 12, fontWeight: 700 },
  quoteNumber: { color: MUTED, fontSize: 7, marginTop: 1, letterSpacing: 0.5 },
  /* Property name */
  propName: { color: '#fff', fontSize: 22, fontWeight: 300, marginBottom: 4, lineHeight: 1.2 },
  /* Address */
  address: { color: MUTED, fontSize: 9, marginBottom: 8 },
  /* Features */
  featuresRow: { flexDirection: 'row', gap: 10, marginTop: 2 },
  feature: { color: '#fff', fontSize: 13, fontWeight: 700 },
  featureSep: { color: MUTED, fontSize: 13, fontWeight: 300 },
  /* Right column: status/operation */
  statusBlock: { marginBottom: 8 },
  statusLine: { flexDirection: 'row', marginBottom: 2 },
  statusLabel: { color: MUTED, fontSize: 9, marginRight: 4 },
  statusValue: { color: '#fff', fontSize: 9, fontWeight: 700 },
  /* Price */
  priceBlock: { alignItems: 'flex-end', marginBottom: 8 },
  priceUSD: { color: BRAND, fontSize: 28, fontWeight: 700, lineHeight: 1.1 },
  priceARS: { color: 'rgba(255,255,255,0.4)', fontSize: 9, marginTop: 2 },
  /* CTA */
  cta: { backgroundColor: BRAND, borderRadius: 4, padding: '8 20', marginTop: 4 },
  ctaText: { color: '#fff', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, textAlign: 'center' },
  /* Body (unchanged) */
  body: { padding: '24 32' },
  sectionTitle: { fontSize: 11, fontWeight: 700, color: '#111', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1 solid #eee', paddingBottom: 4 },
  propertyCard: { border: '1 solid #e8e8e8', borderRadius: 6, marginBottom: 12, overflow: 'hidden' },
  propertyInfo: { padding: '10 14' },
  propertyName: { fontSize: 13, fontWeight: 700, color: '#111' },
  propertyAddress: { fontSize: 9, color: '#666', marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 6 },
  stat: { fontSize: 9, color: '#555' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottom: '1 solid #f5f5f5' },
  label: { fontSize: 9, color: '#666' },
  value: { fontSize: 9, fontWeight: 600, color: '#111' },
  highlight: { backgroundColor: '#1a1a2e', borderRadius: 4, padding: '6 10', marginTop: 6 },
  highlightText: { fontSize: 10, fontWeight: 700, color: '#fff', textAlign: 'center' },
  signatureContainer: { alignItems: 'flex-end', marginTop: 20 },
  signatureLine: { width: 180, borderTop: '1 solid #333', marginBottom: 4 },
  signatureLabel: { fontSize: 8, color: '#666', textAlign: 'center' },
  signatureImg: { height: 40, objectFit: 'contain', marginBottom: 4 },
  footer: { borderTop: '1 solid #eee', padding: '10 32', flexDirection: 'row', justifyContent: 'space-between', fontSize: 7, color: '#aaa', position: 'absolute', bottom: 16, left: 0, right: 0 },
});

function fmt(n) { return n?.toLocaleString('es-AR') || '0'; }

function fmtARS(n) { return n?.toLocaleString('es-AR') || '0'; }

function operationLabel(op) {
  if (op === 'venta') return 'Venta';
  if (op === 'alquiler') return 'Alquiler';
  return op || '';
}

const STATUS_MAP = {
  'PRECIO MEJORADO': 'Precio Mejorado',
  'ULTIMA UNIDAD': 'Última Unidad',
  'UNICO EN SU TIPO': 'Único en su Tipo',
  'NUEVA': 'Nueva',
};

export function ModernTemplate({ quotation, branding = {} }) {
  const prop = quotation.properties[0];
  const hasLogo = !!branding.logoUrl;
  const hasSignature = !!branding.signatureBase64;
  const hasARS = prop?.priceARS > 0;
  const thumbs = (prop?.photos || []).slice(1, 7);
  const opLabel = operationLabel(prop?.operation);
  const stLabel = STATUS_MAP[prop?.status];

  return (
    <Document title={`Propuesta ${quotation.quoteNumber}`} author={branding.name || 'Roggero & Roma'}>
      <Page size="A4" style={styles.page}>
        {/* Hero image */}
        {prop.photos?.[0] && (
          <Image style={styles.heroImage} src={prop.photos[0]} />
        )}

        {/* Thumbnail mosaic: 6 photos in 2 rows × 3 cols */}
        {thumbs.length > 0 && (
          <View>
            <View style={styles.thumbRow}>
              {thumbs.slice(0, 3).map((url, i) => (
                <View key={i} style={styles.thumbCell}>
                  <Image style={styles.thumbImg} src={url} />
                </View>
              ))}
            </View>
            {thumbs.length > 3 && (
              <View style={styles.thumbRow}>
                {thumbs.slice(3, 6).map((url, i) => (
                  <View key={i} style={styles.thumbCell}>
                    <Image style={styles.thumbImg} src={url} />
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Dark info bar */}
        <View style={styles.darkBar}>
          <View style={styles.darkRow}>
            {/* Left column */}
            <View style={styles.leftCol}>
              {/* Logo + Agency */}
              <View style={styles.topRow}>
                {hasLogo ? (
                  <View style={styles.logoContainer}>
                    <Image style={styles.logoImg} src={branding.logoUrl} />
                  </View>
                ) : (
                  <Text style={styles.logoText}>R&amp;R</Text>
                )}
                <View style={styles.agencyBlock}>
                  <Text style={styles.agencyName}>{branding.name || 'Roggero & Roma'}</Text>
                  <Text style={styles.quoteNumber}>Propuesta N° {quotation.quoteNumber}</Text>
                </View>
              </View>

              {/* Property name */}
              {prop?.title && (
                <Text style={styles.propName}>{prop.title}</Text>
              )}

              {/* Address */}
              {prop?.address && (
                <Text style={styles.address}>{prop.address}</Text>
              )}

              {/* Features */}
              <View style={styles.featuresRow}>
                {prop?.bedrooms != null && (
                  <>
                    <Text style={styles.feature}>{prop.bedrooms} dorm.</Text>
                    <Text style={styles.featureSep}>|</Text>
                  </>
                )}
                {prop?.bathrooms != null && (
                  <>
                    <Text style={styles.feature}>{prop.bathrooms} baños</Text>
                    <Text style={styles.featureSep}>|</Text>
                  </>
                )}
                {prop?.surface != null && (
                  <Text style={styles.feature}>{fmt(prop.surface)} m²</Text>
                )}
              </View>
            </View>

            {/* Right column */}
            <View style={styles.rightCol}>
              {/* Operation + Status */}
              <View style={styles.statusBlock}>
                {opLabel && (
                  <View style={styles.statusLine}>
                    <Text style={styles.statusLabel}>OPERACIÓN</Text>
                    <Text style={styles.statusValue}>{opLabel}</Text>
                  </View>
                )}
                {stLabel && (
                  <View style={styles.statusLine}>
                    <Text style={styles.statusLabel}>ESTADO</Text>
                    <Text style={styles.statusValue}>{stLabel}</Text>
                  </View>
                )}
              </View>

              {/* Price */}
              <View style={styles.priceBlock}>
                <Text style={styles.priceUSD}>U$D {fmt(prop?.price)}</Text>
                {hasARS && (
                  <Text style={styles.priceARS}>ARS $ {fmtARS(prop?.priceARS)}</Text>
                )}
              </View>

              {/* CTA */}
              <View style={styles.cta}>
                <Text style={styles.ctaText}>Propuesta Comercial</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Body (unchanged) */}
        <View style={styles.body}>
          <Text style={styles.sectionTitle}>Cliente</Text>
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 12, fontWeight: 600 }}>{quotation.client.name}</Text>
            {quotation.client.email && <Text style={{ fontSize: 9, color: '#666' }}>{quotation.client.email}</Text>}
            {quotation.client.phone && <Text style={{ fontSize: 9, color: '#666' }}>{quotation.client.phone}</Text>}
          </View>

          <Text style={styles.sectionTitle}>Condiciones de pago</Text>
          {quotation.payment.downPayment > 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>Seña / anticipo</Text>
              <Text style={styles.value}>U$D {fmt(quotation.payment.downPayment)} ({quotation.payment.downPaymentPct}%)</Text>
            </View>
          )}
          {quotation.payment.installments > 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>Cuotas</Text>
              <Text style={styles.value}>{quotation.payment.installments} cuotas de U$D {fmt(quotation.payment.installmentAmount)}</Text>
            </View>
          )}
          {quotation.payment.interestRate > 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>Tasa de interés</Text>
              <Text style={styles.value}>{quotation.payment.interestRate}% anual</Text>
            </View>
          )}
          {quotation.payment.notes && (
            <View style={styles.row}>
              <Text style={styles.label}>Notas</Text>
              <Text style={styles.value}>{quotation.payment.notes}</Text>
            </View>
          )}
          <View style={styles.highlight}>
            <Text style={styles.highlightText}>Valor total: U$D {fmt(quotation.totalValue)}</Text>
          </View>

          {quotation.customization.agentNotes && (
            <>
              <Text style={{ ...styles.sectionTitle, marginTop: 12 }}>Observaciones</Text>
              <Text style={{ fontSize: 9, color: '#555', lineHeight: 1.5, marginBottom: 8 }}>{quotation.customization.agentNotes}</Text>
            </>
          )}

          {quotation.customization.showAIDescription && quotation.customization.aiDescription && (
            <>
              <Text style={{ ...styles.sectionTitle, marginTop: 12 }}>Nuestra Recomendacion</Text>
              <View style={{ backgroundColor: '#f8f4f0', borderRadius: 6, padding: '10 14', marginBottom: 8 }}>
                <Text style={{ fontSize: 9, color: '#555', lineHeight: 1.6, fontStyle: 'italic' }}>{quotation.customization.aiDescription}</Text>
              </View>
            </>
          )}

          {quotation.customization.validUntil && (
            <View style={{ marginTop: 12, padding: '8 12', border: '1 solid #e8e8e8', borderRadius: 6 }}>
              <Text style={{ fontSize: 8, color: '#999', textTransform: 'uppercase', letterSpacing: 1 }}>Oferta válida hasta</Text>
              <Text style={{ fontSize: 11, fontWeight: 700, marginTop: 2 }}>
                {new Date(quotation.customization.validUntil).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </Text>
            </View>
          )}

          {hasSignature && (
            <View style={styles.signatureContainer}>
              <Image style={styles.signatureImg} src={branding.signatureBase64} />
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>{branding.name}</Text>
              <Text style={{ ...styles.signatureLabel, marginTop: 1 }}>Agente Inmobiliario</Text>
            </View>
          )}
        </View>

        <View style={styles.footer} fixed>
          <Text>{branding.name || 'Roggero & Roma Inmobiliaria'}</Text>
          <Text>Generado el {new Date().toLocaleDateString('es-AR')}</Text>
        </View>
      </Page>
    </Document>
  );
}
