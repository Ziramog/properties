import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', backgroundColor: '#ffffff', padding: 0, fontSize: 10, color: '#333' },
  headerImage: { width: '100%', height: 180, objectFit: 'cover' },
  headerOverlay: { backgroundColor: '#1a1a2e', padding: '16 32', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerLogoImg: { width: 130, height: 48, objectFit: 'contain' },
  headerLogoText: { color: '#F26B2E', fontSize: 22, fontWeight: 700 },
  headerTitle: { color: '#fff', fontSize: 14, fontWeight: 700 },
  headerSub: { color: 'rgba(255,255,255,0.6)', fontSize: 8, marginTop: 2 },
  headerRight: { alignItems: 'flex-end' },
  headerPropName: { color: '#fff', fontSize: 12, fontWeight: 600 },
  headerPrice: { color: '#F26B2E', fontSize: 14, fontWeight: 700, marginTop: 2 },
  headerPriceARS: { color: 'rgba(255,255,255,0.5)', fontSize: 9, marginTop: 1 },
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

export function ModernTemplate({ quotation, branding = {} }) {
  const prop = quotation.properties[0];
  const fmt = (n) => n?.toLocaleString('es-AR') || '0';
  const fmtARS = (n) => n?.toLocaleString('es-AR') || '0';
  const hasLogo = !!branding.logoUrl;
  const hasSignature = !!branding.signatureBase64;
  const hasARS = prop?.priceARS > 0;

  return (
    <Document title={`Propuesta ${quotation.quoteNumber}`} author={branding.name || 'Roggero & Roma'}>
      <Page size="A4" style={styles.page}>
        {/* Header with property photo + dark bar */}
        {prop.photos?.[0] && (
          <Image style={styles.headerImage} src={prop.photos[0]} />
        )}
        <View style={styles.headerOverlay}>
          <View style={styles.headerLeft}>
            {hasLogo ? (
              <View style={{ width: 130, height: 48, backgroundColor: '#fff', borderRadius: 4, justifyContent: 'center', alignItems: 'center', padding: 4 }}>
                <Image style={styles.headerLogoImg} src={branding.logoUrl} />
              </View>
            ) : (
              <Text style={styles.headerLogoText}>R&amp;R</Text>
            )}
            <View>
              <Text style={styles.headerTitle}>{branding.name || 'Roggero & Roma'}</Text>
              <Text style={styles.headerSub}>Propuesta Comercial N° {quotation.quoteNumber}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerPropName}>{prop.title}</Text>
            <Text style={styles.headerPrice}>U$D {fmt(prop.price)}</Text>
            {hasARS && (
              <Text style={styles.headerPriceARS}>ARS $ {fmtARS(prop.priceARS)}</Text>
            )}
          </View>
        </View>

        <View style={styles.body}>
          {/* Cliente */}
          <Text style={styles.sectionTitle}>Cliente</Text>
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 12, fontWeight: 600 }}>{quotation.client.name}</Text>
            {quotation.client.email && <Text style={{ fontSize: 9, color: '#666' }}>{quotation.client.email}</Text>}
            {quotation.client.phone && <Text style={{ fontSize: 9, color: '#666' }}>{quotation.client.phone}</Text>}
          </View>

          {/* Propiedad */}
          <Text style={styles.sectionTitle}>Propiedad</Text>
          <View style={styles.propertyCard}>
            <View style={styles.propertyInfo}>
              <Text style={styles.propertyName}>{prop.title}</Text>
              <Text style={styles.propertyAddress}>{prop.address}</Text>
              <View style={styles.statsRow}>
                {prop.surface && <Text style={styles.stat}>{prop.surface} m²</Text>}
                {prop.bedrooms && <Text style={styles.stat}>{prop.bedrooms} dorm.</Text>}
                {prop.bathrooms && <Text style={styles.stat}>{prop.bathrooms} baños</Text>}
              </View>
            </View>
          </View>

          {/* Condiciones de pago */}
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

          {/* Notas del agente */}
          {quotation.customization.agentNotes && (
            <>
              <Text style={{ ...styles.sectionTitle, marginTop: 12 }}>Observaciones</Text>
              <Text style={{ fontSize: 9, color: '#555', lineHeight: 1.5, marginBottom: 8 }}>{quotation.customization.agentNotes}</Text>
            </>
          )}

          {/* AI Description */}
          {quotation.customization.showAIDescription && quotation.customization.aiDescription && (
            <>
              <Text style={{ ...styles.sectionTitle, marginTop: 12 }}>Nuestra Recomendacion</Text>
              <View style={{ backgroundColor: '#f8f4f0', borderRadius: 6, padding: '10 14', marginBottom: 8 }}>
                <Text style={{ fontSize: 9, color: '#555', lineHeight: 1.6, fontStyle: 'italic' }}>{quotation.customization.aiDescription}</Text>
              </View>
            </>
          )}

          {/* Vencimiento */}
          {quotation.customization.validUntil && (
            <View style={{ marginTop: 12, padding: '8 12', border: '1 solid #e8e8e8', borderRadius: 6 }}>
              <Text style={{ fontSize: 8, color: '#999', textTransform: 'uppercase', letterSpacing: 1 }}>Oferta válida hasta</Text>
              <Text style={{ fontSize: 11, fontWeight: 700, marginTop: 2 }}>
                {new Date(quotation.customization.validUntil).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </Text>
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

        <View style={styles.footer} fixed>
          <Text>{branding.name || 'Roggero & Roma Inmobiliaria'}</Text>
          <Text>Generado el {new Date().toLocaleDateString('es-AR')}</Text>
        </View>
      </Page>
    </Document>
  );
}