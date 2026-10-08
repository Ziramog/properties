import { ImageResponse } from 'next/og';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { join } from 'path';

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

async function renderImage(jsx, options) {
  const imgResponse = new ImageResponse(jsx, options);
  const buffer = await imgResponse.arrayBuffer();
  return new Response(buffer, {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' },
  });
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
    const index = parseInt(searchParams.get('index') || '0', 10);
    
    // Fallback to first image if index out of bounds
    const imageToUse = property.images?.[index] || property.images?.[0];

    const size = {
      width: 1080,
      height: 1350, // Vertical Instagram Feed format
    };

    const logoBuffer = readFileSync(join(process.cwd(), 'public', 'images', 'ISOTIPO R&R-Photoroom.png'));
    const isoLogoUrl = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    const imageUrl = imageToUse?.url ? await toDataUrl(imageToUse.url) : null;

    const getAreaDisplay = () => {
      if (property.covered_area) return `${property.covered_area.toLocaleString('es-AR')} m² cub`;
      if (property.square_feet) return `${property.square_feet.toLocaleString('es-AR')} m² tot`;
      return null;
    };
    const areaLabel = getAreaDisplay();

    const brandColor = '#A47D4C';

    return await renderImage(
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
          <div style={{ position: 'absolute', top: 60, left: 0, width: '100%', display: 'flex', justifyContent: 'center', zIndex: 20 }}>
            <img src={isoLogoUrl} width={250} height={250} style={{ objectFit: 'contain', filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.5))' }} />
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
              padding: '50px 30px',
              zIndex: 20
            }}
          >
            <div style={{
              backgroundColor: brandColor,
              color: '#FFFFFF',
              fontSize: 22,
              fontWeight: 'bold',
              padding: '10px 24px',
              borderRadius: '24px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '20px',
              boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
            }}>
              {property.operation ? (property.operation === 'venta' ? 'VENTA' : property.operation.toUpperCase()) : 'DISPONIBLE'}
            </div>

            <h2 style={{ color: '#FFFFFF', fontSize: 100, fontWeight: '900', margin: '0 0 10px 0', textShadow: '0 4px 20px rgba(0,0,0,0.6)', textAlign: 'center' }}>
              {formatPrice(property.price)}
            </h2>
            
            <h1 style={{ color: '#E2E8F0', fontSize: 50, fontWeight: 'bold', margin: '0 0 20px 0', lineHeight: 1.2, textAlign: 'center', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              {property.name || property.type || 'Propiedad Exclusiva'}
            </h1>
            
            <p style={{ color: '#CBD5E1', fontSize: 30, margin: '0 0 35px 0', textShadow: '0 2px 10px rgba(0,0,0,0.5)', letterSpacing: '2px', textTransform: 'uppercase' }}>
              {property.location?.city || ''}
            </p>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '40px', justifyContent: 'center' }}>
              {areaLabel && (
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', padding: '12px 24px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.3)' }}>
                  <span style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '500' }}>{areaLabel}</span>
                </div>
              )}
              {property.beds > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', padding: '12px 24px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.3)' }}>
                  <span style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '500' }}>{property.beds} Dorms</span>
                </div>
              )}
              {property.baths > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', padding: '12px 24px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.3)' }}>
                  <span style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '500' }}>{property.baths} Baños</span>
                </div>
              )}
            </div>
            
            <div style={{ width: '80%', height: '1px', backgroundColor: 'rgba(255,255,255,0.3)', marginBottom: '25px' }}></div>
            
            <p style={{ color: brandColor, fontSize: 24, letterSpacing: '3px', textTransform: 'uppercase', margin: 0, textAlign: 'center', fontWeight: 'bold' }}>
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
    console.error('Error generating feed image:', error);
    return new Response(JSON.stringify({ 
      error: 'Error generating feed image', 
      message: error.message,
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
