import { ImageResponse } from 'next/og';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import mongoose from 'mongoose';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
// Optimize Cloudinary URLs: resize to max width and reduce quality for Satori rendering
function optimizeImageUrl(url, width = 1080) {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/w_${width},q_70,f_jpg/`);
}

async function toDataUrl(url) {
  const optimized = optimizeImageUrl(url);
  const res = await fetch(optimized);
  if (!res.ok) throw new Error(`Failed to fetch image: ${optimized} (${res.status})`);
  const contentType = res.headers.get('content-type') || 'image/png';
  const buffer = await res.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  return `data:${contentType};base64,${base64}`;
}

export async function GET(request, { params }) {
  try {
  await connectDB();
  const { id } = await params;
  const property = await getPropertyByIdOrSlug(id);

  if (!property) {
    return new Response('Not found', { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const template = searchParams.get('template') || '1';

  const size = {
    width: 1080,
    height: 1920,
  };

  // Derive origin from the incoming request
  const origin = new URL(request.url).origin;

  // Pre-fetch ALL images as data URLs so Satori doesn't need HTTP during streaming
  // (streaming errors are uncatchable by try-catch)
  const isoLogoUrl = await toDataUrl(`${origin}/images/ISOTIPO%20R%26R-Photoroom.png`);
  const imageUrl = property.images?.[0]?.url 
    ? await toDataUrl(property.images[0].url) 
    : null;

  const getAreaDisplay = () => {
    if (property.covered_area) return `${property.covered_area.toLocaleString('es-AR')} m² cub`;
    if (property.square_feet) return `${property.square_feet.toLocaleString('es-AR')} m² tot`;
    return null;
  };
  const areaLabel = getAreaDisplay();

  const brandColor = '#A47D4C';
  const darkColor = '#0F172A';

  // TEMPLATE 3: COLLAGE DINÁMICO
  if (template === '3') {
    const imgs = property.images || [];
    const mainImg = imageUrl;
    const thumb1 = imgs[1]?.url ? await toDataUrl(imgs[1].url) : imageUrl;
    const thumb2 = imgs[2]?.url ? await toDataUrl(imgs[2].url) : thumb1;

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
          <div style={{ position: 'absolute', top: '38%', left: '10%', width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#FFFFFF', padding: '60px 40px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            
            <div style={{ position: 'absolute', top: -60, backgroundColor: '#FFFFFF', padding: '15px', borderRadius: '50%', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
              <img src={isoLogoUrl} width={100} height={100} style={{ objectFit: 'contain' }} />
            </div>
            
            <div style={{
              backgroundColor: property.operation === 'alquiler' ? '#3B82F6' : darkColor,
              color: '#FFFFFF',
              fontSize: 22,
              fontWeight: 'bold',
              padding: '8px 25px',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              marginBottom: '20px',
              marginTop: '30px'
            }}>
              {property.operation ? (property.operation === 'venta' ? 'EN VENTA' : property.operation.toUpperCase()) : 'DISPONIBLE'}
            </div>

            <h1 style={{ color: darkColor, fontSize: 55, fontWeight: '900', margin: '0 0 15px 0', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {property.name || property.type || 'Propiedad'}
            </h1>
            
            <p style={{ color: '#64748B', fontSize: 35, margin: '0 0 40px 0', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '2px' }}>
              {property.location?.city || ''}{property.location?.state ? `, ${property.location.state}` : ''}
            </p>

            <h2 style={{ color: brandColor, fontSize: 90, fontWeight: 'bold', margin: '0 0 40px 0' }}>
              {formatPrice(property.price)}
            </h2>

            <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
              {areaLabel && <span style={{ color: darkColor, fontSize: 32, fontWeight: '500' }}>{areaLabel}</span>}
              {areaLabel && <span style={{ color: '#CBD5E1', fontSize: 32 }}>|</span>}
              {property.beds > 0 && <span style={{ color: darkColor, fontSize: 32, fontWeight: '500' }}>{property.beds} Dorms</span>}
              {property.beds > 0 && property.baths > 0 && <span style={{ color: '#CBD5E1', fontSize: 32 }}>|</span>}
              {property.baths > 0 && <span style={{ color: darkColor, fontSize: 32, fontWeight: '500' }}>{property.baths} Baños</span>}
            </div>
          </div>
        </div>
      ),
      { ...size }
    );
  }

  // TEMPLATE 2: EDITORIAL (MAGAZINE) WITH AI FRAME
  if (template === '2') {
    const mainImg = imageUrl;
    const frameUrl = await toDataUrl(`${origin}/images/story-frame.jpg`);
    return new ImageResponse(
      (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', fontFamily: 'sans-serif' }}>
          
          {/* AI Generated Frame Background */}
          <img src={frameUrl} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />

          {/* Content Layer */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', zIndex: 10, padding: '100px 90px' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '60px' }}>
              <img src={isoLogoUrl} width={120} height={120} style={{ objectFit: 'contain' }} />
              <div style={{ borderBottom: `2px solid ${brandColor}`, paddingBottom: '10px' }}>
                <span style={{ fontSize: 32, color: darkColor, letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                  Premium Listing
                </span>
              </div>
            </div>

            {/* Main Image in Editorial Frame */}
            <div style={{ display: 'flex', width: '100%', height: '50%', backgroundColor: '#FFFFFF', padding: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', marginBottom: '60px' }}>
              <img src={mainImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', width: '65%' }}>
                  <h1 style={{ color: darkColor, fontSize: 80, fontWeight: 'normal', margin: '0 0 20px 0', lineHeight: 1.1 }}>
                    {property.name || property.type || 'Propiedad Exclusiva'}
                  </h1>
                  <p style={{ color: '#64748B', fontSize: 35, margin: '0 0 40px 0', fontFamily: 'sans-serif', letterSpacing: '2px', textTransform: 'uppercase' }}>
                    {property.location?.city || ''}
                  </p>

                  <div style={{ display: 'flex', gap: '40px', fontFamily: 'sans-serif' }}>
                    {areaLabel && (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 20, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '5px' }}>Sup.</span>
                        <span style={{ fontSize: 32, color: darkColor, fontWeight: 'bold' }}>{areaLabel}</span>
                      </div>
                    )}
                    {property.beds > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 20, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '5px' }}>Dorm</span>
                        <span style={{ fontSize: 32, color: darkColor, fontWeight: 'bold' }}>{property.beds}</span>
                      </div>
                    )}
                    {property.baths > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 20, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '5px' }}>Baños</span>
                        <span style={{ fontSize: 32, color: darkColor, fontWeight: 'bold' }}>{property.baths}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '35%' }}>
                  <div style={{ 
                    backgroundColor: darkColor, 
                    color: '#FFFFFF', 
                    fontSize: 24, 
                    padding: '12px 25px', 
                    letterSpacing: '3px', 
                    textTransform: 'uppercase',
                    fontFamily: 'sans-serif',
                    marginBottom: '40px',
                    borderRadius: '2px'
                  }}>
                    {property.operation ? (property.operation === 'venta' ? 'EN VENTA' : property.operation.toUpperCase()) : 'DISPONIBLE'}
                  </div>
                  
                  <h2 style={{ color: brandColor, fontSize: 75, fontWeight: 'bold', margin: '0', textAlign: 'right' }}>
                    {formatPrice(property.price)}
                  </h2>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: 'auto' }}>
              <p style={{ fontFamily: 'sans-serif', color: darkColor, fontSize: 28, letterSpacing: '6px', textTransform: 'uppercase', margin: 0, fontWeight: 'bold' }}>
                roggeroyroma.com.ar
              </p>
            </div>
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
          position: 'absolute', top: 0, left: 0, width: '100%', height: '40%',
          backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)',
          display: 'flex'
        }} />

        {/* Bottom Gradient Overlay */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, width: '100%', height: '60%',
          backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 30%, transparent 100%)',
          display: 'flex'
        }} />

        {/* Top Isotipo Center */}
        <div style={{ position: 'absolute', top: 80, left: 0, width: '100%', display: 'flex', justifyContent: 'center', zIndex: 20 }}>
          <img src={isoLogoUrl} width={160} height={160} style={{ objectFit: 'contain', filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.5))' }} />
        </div>

        {/* Content - Bottom Aligned */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            padding: '60px 40px',
            zIndex: 20
          }}
        >
          <div style={{
            backgroundColor: brandColor,
            color: '#FFFFFF',
            fontSize: 26,
            fontWeight: 'bold',
            padding: '12px 30px',
            borderRadius: '30px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '30px',
            boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
          }}>
            {property.operation ? (property.operation === 'venta' ? 'VENTA' : property.operation.toUpperCase()) : 'DISPONIBLE'}
          </div>

          <h2 style={{ color: '#FFFFFF', fontSize: 130, fontWeight: '900', margin: '0 0 15px 0', textShadow: '0 4px 20px rgba(0,0,0,0.6)', textAlign: 'center' }}>
            {formatPrice(property.price)}
          </h2>
          
          <h1 style={{ color: '#E2E8F0', fontSize: 65, fontWeight: 'bold', margin: '0 0 25px 0', lineHeight: 1.2, textAlign: 'center', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            {property.name || property.type || 'Propiedad Exclusiva'}
          </h1>
          
          <p style={{ color: '#CBD5E1', fontSize: 40, margin: '0 0 45px 0', textShadow: '0 2px 10px rgba(0,0,0,0.5)', letterSpacing: '2px', textTransform: 'uppercase' }}>
            {property.location?.city || ''}
          </p>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '50px', justifyContent: 'center' }}>
            {areaLabel && (
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', padding: '15px 30px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.3)' }}>
                <span style={{ color: '#FFFFFF', fontSize: 32, fontWeight: '500' }}>{areaLabel}</span>
              </div>
            )}
            {property.beds > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', padding: '15px 30px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.3)' }}>
                <span style={{ color: '#FFFFFF', fontSize: 32, fontWeight: '500' }}>{property.beds} Dorms</span>
              </div>
            )}
            {property.baths > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', padding: '15px 30px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.3)' }}>
                <span style={{ color: '#FFFFFF', fontSize: 32, fontWeight: '500' }}>{property.baths} Baños</span>
              </div>
            )}
          </div>
          
          <div style={{ width: '80%', height: '1px', backgroundColor: 'rgba(255,255,255,0.3)', marginBottom: '30px' }}></div>
          
          <p style={{ color: brandColor, fontSize: 32, letterSpacing: '4px', textTransform: 'uppercase', margin: 0, textAlign: 'center', fontWeight: 'bold' }}>
            roggeroyroma.com.ar
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
  } catch (error) {
    console.error('Error generating story image:', error);
    return new Response(JSON.stringify({ 
      error: 'Error generating story image', 
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 5).join('\n')
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
