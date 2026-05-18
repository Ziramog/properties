import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiJ-Ek-_EeA.woff', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiJ-Ek-_EeA.woff', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: { fontFamily: 'Inter', backgroundColor: '#ffffff', padding: 0, fontSize: 10, color: '#333' },
  header: { backgroundColor: '#1a1a2e', padding: '24 32', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 700 },
  headerSub: { color: 'rgba(255,255,255,0.6)', fontSize: 8, marginTop: 2 },
  body: { padding: '24 32' },
  sectionTitle: { fontSize: 11, fontWeight: 700, color: '#111', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1 solid #eee', paddingBottom: 4 },
  propertyCard: { border: '1 solid #e8e8e8', borderRadius: 6, marginBottom: 12, overflow: 'hidden' },
  propertyImage: { width: '100%', height: 160, objectFit: 'cover' },
  propertyInfo: { padding: '10 14' },
  propertyName: { fontSize: 13, fontWeight: 700, color: '#111' },
  propertyAddress: { fontSize: 9, color: '#666', marginTop: 2 },
  propertyPrice: { fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginTop: 6 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 6 },
  stat: { fontSize: 9, color: '#555' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottom: '1 solid #f5f5f5' },
  label: { fontSize: 9, color: '#666' },
  value: { fontSize: 9, fontWeight: 600, color: '#111' },
  highlight: { backgroundColor: '#1a1a2e', borderRadius: 4, padding: '6 10', marginTop: 6 },
  highlightText: { fontSize: 10, fontWeight: 700, color: '#fff', textAlign: 'center' },
  footer: { borderTop: '1 solid #eee', padding: '10 32', flexDirection: 'row', justifyContent: 'space-between', fontSize: 7, color: '#aaa', position: 'absolute', bottom: 16, left: 0, right: 0 },
  signatureBox: { flexDirection: 'row', gap: 40, marginTop: 20 },
  sigCol: { flex: 1, alignItems: 'center' },
  sigLine: { width: '100%', borderTop: '1 solid #333', marginBottom: 4 },
  sigLabel: { fontSize: 8, color: '#666' },
});

export function ModernTemplate({ quotation, branding = {} }) {
  const prop = quotation.properties[0];
  const fmt = (n) => n?.toLocaleString('es-AR') || '0';

  return (
    <Document title={`Propuesta ${quotation.quoteNumber}`} author={branding.name || 'Roggero & Roma'}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>{branding.name || 'Roggero & Roma'}</Text>
            <Text style={styles.headerSub}>Propuesta Comercial N° {quotation.quoteNumber}</Text>
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
            {prop.photos?.[0] && <Image style={styles.propertyImage} src={prop.photos[0]} />}
            <View style={styles.propertyInfo}>
              <Text style={styles.propertyName}>{prop.title}</Text>
              <Text style={styles.propertyAddress}>{prop.address}</Text>
              <Text style={styles.propertyPrice}>U$D {fmt(prop.price)}</Text>
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

          {/* Vencimiento */}
          {quotation.customization.validUntil && (
            <View style={{ marginTop: 12, padding: '8 12', border: '1 solid #e8e8e8', borderRadius: 6 }}>
              <Text style={{ fontSize: 8, color: '#999', textTransform: 'uppercase', letterSpacing: 1 }}>Oferta válida hasta</Text>
              <Text style={{ fontSize: 11, fontWeight: 700, marginTop: 2 }}>
                {new Date(quotation.customization.validUntil).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </Text>
            </View>
          )}

          {/* Firmas */}
          <View style={styles.signatureBox}>
            <View style={styles.sigCol}>
              <View style={styles.sigLine} />
              <Text style={styles.sigLabel}>{branding.name || 'Roggero & Roma'}</Text>
              <Text style={{ ...styles.sigLabel, marginTop: 1 }}>Agente</Text>
            </View>
            <View style={styles.sigCol}>
              <View style={styles.sigLine} />
              <Text style={styles.sigLabel}>{quotation.client.name}</Text>
              <Text style={{ ...styles.sigLabel, marginTop: 1 }}>Cliente</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>{branding.name || 'Roggero & Roma Inmobiliaria'}</Text>
          <Text>Generado el {new Date().toLocaleDateString('es-AR')}</Text>
        </View>
      </Page>
    </Document>
  );
}
