import { ImageResponse } from 'next/og';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import mongoose from 'mongoose';

export const runtime = 'nodejs';

async function getPropertyByIdOrSlug(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const property = await Property.findById(id).lean();
    if (property) return property;
  }
  return null;
}

const formatPrice = (price) => {
  if (!price) return 'Consultar';
  const rawPrice = String(price).replace(/[^0-9]/g, '');
  if (!rawPrice) return 'Consultar';
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(rawPrice);
};

export async function GET(request, { params }) {
  await connectDB();
  const property = await getPropertyByIdOrSlug(params.id);

  if (!property) {
    return new Response('Not found', { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const template = searchParams.get('template') || '1';

  const imageUrl = property.images?.[0]?.url || 'https://via.placeholder.com/1080x1920?text=Roggero+y+Roma';

  const size = {
    width: 1080,
    height: 1920,
  };

  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'https://properties-srs5.vercel.app';
  const logoUrl = `${domain}/images/LOGO%20R&R%202023.png`;

  const getAreaDisplay = () => {
    if (property.covered_area) return `${property.covered_area.toLocaleString('es-AR')} m² cub`;
    if (property.square_feet) return `${property.square_feet.toLocaleString('es-AR')} m² tot`;
    return null;
  };
  const areaLabel = getAreaDisplay();

  const brandColor = '#A47D4C'; // Elegant gold-ish color

  // TEMPLATE 3: COLLAGE DINÁMICO
  if (template === '3') {
    const mainImg = property.images?.[0]?.url || 'https://via.placeholder.com/1080x1000';
    const thumb1 = property.images?.[1]?.url || 'https://via.placeholder.com/540x920';
    const thumb2 = property.images?.[2]?.url || 'https://via.placeholder.com/540x920';

    return new ImageResponse(
      (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF', position: 'relative', fontFamily: 'sans-serif' }}>
          
          {/* Top Half - Main Image */}
          <div style={{ width: '100%', height: '55%', display: 'flex' }}>
            <img src={mainImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Bottom Half - 2 Thumbnails */}
          <div style={{ width: '100%', height: '45%', display: 'flex', flexDirection: 'row' }}>
            <div style={{ width: '50%', height: '100%', display: 'flex', paddingRight: '2px', paddingTop: '4px' }}>
              <img src={thumb1} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ width: '50%', height: '100%', display: 'flex', paddingLeft: '2px', paddingTop: '4px' }}>
              <img src={thumb2} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>

          {/* Center Floating Box */}
          <div style={{ position: 'absolute', top: '42%', left: '10%', width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#FFFFFF', padding: '50px 40px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', border: `2px solid ${brandColor}` }}>
            <img src={logoUrl} width={250} style={{ objectFit: 'contain', marginBottom: '30px' }} />
            
            <div style={{
              backgroundColor: property.operation === 'alquiler' ? '#3B82F6' : '#2DAA68',
              color: '#FFFFFF',
              fontSize: 22,
              fontWeight: 'bold',
              padding: '8px 20px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '20px'
            }}>
              {property.operation ? (property.operation === 'venta' ? 'EN VENTA' : property.operation.toUpperCase()) : 'DISPONIBLE'}
            </div>

            <h1 style={{ color: '#0F172A', fontSize: 50, fontWeight: '900', margin: '0 0 10px 0', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {property.name || property.type || 'Propiedad'}
            </h1>
            
            <p style={{ color: '#64748B', fontSize: 35, margin: '0 0 30px 0', textAlign: 'center' }}>
              {property.location?.city || ''}{property.location?.state ? `, ${property.location.state}` : ''}
            </p>

            <h2 style={{ color: brandColor, fontSize: 80, fontWeight: 'bold', margin: '0 0 40px 0' }}>
              {formatPrice(property.price)}
            </h2>

            <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
              {areaLabel && <span style={{ color: '#0F172A', fontSize: 32, fontWeight: '500' }}>{areaLabel}</span>}
              {areaLabel && <span style={{ color: '#CBD5E1', fontSize: 32 }}>|</span>}
              {property.beds > 0 && <span style={{ color: '#0F172A', fontSize: 32, fontWeight: '500' }}>{property.beds} Dorms</span>}
              {property.beds > 0 && property.baths > 0 && <span style={{ color: '#CBD5E1', fontSize: 32 }}>|</span>}
              {property.baths > 0 && <span style={{ color: '#0F172A', fontSize: 32, fontWeight: '500' }}>{property.baths} Baños</span>}
            </div>
          </div>

        </div>
      ),
      { ...size }
    );
  }

  // TEMPLATE 2: EDITORIAL (MAGAZINE)
  if (template === '2') {
    const mainImg = property.images?.[0]?.url || 'https://via.placeholder.com/1080x1080';

    return new ImageResponse(
      (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#F8F9FA', padding: '60px', fontFamily: 'serif' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '40px' }}>
            <img src={logoUrl} width={280} style={{ objectFit: 'contain' }} />
            <div style={{ borderBottom: `2px solid ${brandColor}`, paddingBottom: '10px' }}>
              <span style={{ fontSize: 28, color: '#334155', letterSpacing: '4px', textTransform: 'uppercase' }}>
                Exclusive Listing
              </span>
            </div>
          </div>

          {/* Main Image Frame */}
          <div style={{ display: 'flex', width: '100%', height: '55%', backgroundColor: '#FFFFFF', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '50px' }}>
            <img src={mainImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Content */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', width: '65%' }}>
                <h1 style={{ color: '#0F172A', fontSize: 75, fontWeight: 'normal', margin: '0 0 20px 0', lineHeight: 1.1 }}>
                  {property.name || property.type || 'Propiedad Exclusiva'}
                </h1>
                <p style={{ color: '#64748B', fontSize: 35, margin: '0 0 40px 0', fontFamily: 'sans-serif', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  {property.location?.street || ''} {property.location?.city ? `— ${property.location.city}` : ''}
                </p>

                {/* Features Divider */}
                <div style={{ width: '80%', height: '1px', backgroundColor: '#E2E8F0', marginBottom: '40px' }}></div>
                
                <div style={{ display: 'flex', gap: '40px', fontFamily: 'sans-serif' }}>
                  {areaLabel && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 20, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '5px' }}>Superficie</span>
                      <span style={{ fontSize: 32, color: '#0F172A', fontWeight: 'bold' }}>{areaLabel}</span>
                    </div>
                  )}
                  {property.beds > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 20, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '5px' }}>Dormitorios</span>
                      <span style={{ fontSize: 32, color: '#0F172A', fontWeight: 'bold' }}>{property.beds}</span>
                    </div>
                  )}
                  {property.baths > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 20, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '5px' }}>Baños</span>
                      <span style={{ fontSize: 32, color: '#0F172A', fontWeight: 'bold' }}>{property.baths}</span>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '35%' }}>
                <div style={{ 
                  backgroundColor: '#0F172A', 
                  color: '#FFFFFF', 
                  fontSize: 22, 
                  padding: '10px 20px', 
                  letterSpacing: '2px', 
                  textTransform: 'uppercase',
                  fontFamily: 'sans-serif',
                  marginBottom: '30px'
                }}>
                  {property.operation ? (property.operation === 'venta' ? 'EN VENTA' : property.operation.toUpperCase()) : 'DISPONIBLE'}
                </div>
                
                <h2 style={{ color: brandColor, fontSize: 65, fontWeight: 'normal', margin: '0', textAlign: 'right' }}>
                  {formatPrice(property.price)}
                </h2>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', width: '100%', justifyContent: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '30px', marginTop: 'auto' }}>
            <p style={{ fontFamily: 'sans-serif', color: '#94A3B8', fontSize: 25, letterSpacing: '4px', textTransform: 'uppercase', margin: 0 }}>
              roggeroyroma.com.ar
            </p>
          </div>
        </div>
      ),
      { ...size }
    );
  }

  // TEMPLATE 1: INMERSIVO (FULL-SCREEN)
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0B0D10',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Full Background Image */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex' }}>
          <img src={imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Top Gradient Overlay */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '30%',
          backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)',
          display: 'flex'
        }} />

        {/* Bottom Gradient Overlay */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, width: '100%', height: '60%',
          backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 40%, transparent 100%)',
          display: 'flex'
        }} />

        {/* Top Logo */}
        <div style={{ position: 'absolute', top: 60, left: 60, zIndex: 20, display: 'flex', alignItems: 'center' }}>
          <img src={logoUrl} width={280} style={{ objectFit: 'contain' }} />
        </div>

        {/* Top Badge */}
        <div style={{ position: 'absolute', top: 60, right: 60, zIndex: 20, display: 'flex' }}>
          <div style={{
            backgroundColor: property.operation === 'alquiler' ? '#3B82F6' : brandColor,
            color: '#FFFFFF',
            fontSize: 26,
            fontWeight: 'bold',
            padding: '12px 30px',
            borderRadius: '30px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            {property.operation ? (property.operation === 'venta' ? 'VENTA' : property.operation.toUpperCase()) : 'DISPONIBLE'}
          </div>
        </div>

        {/* Content - Bottom Aligned */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            padding: '60px',
            zIndex: 20
          }}
        >
          {/* Price */}
          <h2 style={{ color: '#FFFFFF', fontSize: 120, fontWeight: '900', margin: '0 0 10px 0', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            {formatPrice(property.price)}
          </h2>
          
          {/* Title */}
          <h1 style={{ color: '#E2E8F0', fontSize: 60, fontWeight: '600', margin: '0 0 20px 0', lineHeight: 1.2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            {property.name || property.type || 'Propiedad Exclusiva'}
          </h1>
          
          {/* Location */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '15px' }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <p style={{ color: '#CBD5E1', fontSize: 40, margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              {property.location?.city || ''}{property.location?.state ? `, ${property.location.state}` : ''}
            </p>
          </div>

          {/* Features Badges */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '50px' }}>
            {areaLabel && (
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '15px 30px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.3)' }}>
                <span style={{ color: '#FFFFFF', fontSize: 32, fontWeight: '500' }}>{areaLabel}</span>
              </div>
            )}
            {property.beds > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '15px 30px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.3)' }}>
                <span style={{ color: '#FFFFFF', fontSize: 32, fontWeight: '500' }}>{property.beds} Dorms</span>
              </div>
            )}
            {property.baths > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '15px 30px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.3)' }}>
                <span style={{ color: '#FFFFFF', fontSize: 32, fontWeight: '500' }}>{property.baths} Baños</span>
              </div>
            )}
          </div>
          
          <div style={{ width: '100%', height: '2px', backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: '30px' }}></div>
          
          <p style={{ color: '#FFFFFF', fontSize: 30, letterSpacing: '3px', textTransform: 'uppercase', margin: 0, textAlign: 'center', opacity: 0.8 }}>
            roggeroyroma.com.ar
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
