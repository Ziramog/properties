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
    
    // Load icons
    const bedIconBuffer = readFileSync(join(process.cwd(), 'public', 'senada', 'images', 'icons', 'ico_bed.svg'));
    const bathIconBuffer = readFileSync(join(process.cwd(), 'public', 'senada', 'images', 'icons', 'ico_bath.svg'));
    const sqftIconBuffer = readFileSync(join(process.cwd(), 'public', 'senada', 'images', 'icons', 'ico_sqfoot.svg'));
    
    const bedIconUrl = `data:image/svg+xml;base64,${bedIconBuffer.toString('base64')}`;
    const bathIconUrl = `data:image/svg+xml;base64,${bathIconBuffer.toString('base64')}`;
    const sqftIconUrl = `data:image/svg+xml;base64,${sqftIconBuffer.toString('base64')}`;

    const imageUrl = imageToUse?.url ? await toDataUrl(imageToUse.url) : null;

    const getAreaDisplay = () => {
      if (property.covered_area) return `${property.covered_area.toLocaleString('es-AR')} m²`;
      if (property.square_feet) return `${property.square_feet.toLocaleString('es-AR')} m²`;
      return null;
    };
    const areaLabel = getAreaDisplay();

    const brandColor = '#A47D4C';

    const locationLine1 = property.location?.street || property.name || 'Propiedad Exclusiva';
    const locationLine2 = [property.location?.city, property.location?.state].filter(Boolean).join(', ');

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

          {/* Top Gradient Overlay - Always present so the logo is visible */}
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '30%',
            backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
            display: 'flex'
          }} />

          {/* Bottom Gradient Overlay - Only on first photo */}
          {index === 0 && (
            <div style={{
              position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%',
              backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)',
              display: 'flex'
            }} />
          )}

          {/* Top Isotipo Center - 5px padding from top */}
          <div style={{ position: 'absolute', top: 5, left: 0, width: '100%', display: 'flex', justifyContent: 'center', zIndex: 20 }}>
            <img src={isoLogoUrl} width={250} height={250} style={{ objectFit: 'contain', filter: 'drop-shadow(0px 5px 10px rgba(0,0,0,0.5))' }} />
          </div>

          {/* Content - Bottom Aligned - ONLY ON FIRST PHOTO */}
          {index === 0 && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                padding: '60px 50px',
                zIndex: 20
              }}
            >
              {/* Row 1: Direccion | Precio */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px', width: '100%' }}>
                
                {/* Direccion (Left) */}
                <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '55%' }}>
                  <span style={{ color: brandColor, fontSize: 30, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>
                    {property.operation ? (property.operation === 'venta' ? 'VENTA' : property.operation.toUpperCase()) : 'DISPONIBLE'}
                  </span>
                  <span style={{ color: '#FFFFFF', fontSize: 55, fontWeight: 'bold', lineHeight: 1.1, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                    {locationLine1}
                  </span>
                  <span style={{ color: '#CBD5E1', fontSize: 35, marginTop: '10px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                    {locationLine2}
                  </span>
                </div>

                {/* Precio (Right) */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', maxWidth: '40%' }}>
                  <span style={{ color: '#FFFFFF', fontSize: 75, fontWeight: '900', textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
                    {formatPrice(property.price)}
                  </span>
                </div>
              </div>

              <div style={{ width: '100%', height: '2px', backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: '35px' }}></div>

              {/* Row 2: Iconos */}
              <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                {property.beds > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src={bedIconUrl} width={45} height={45} />
                    <span style={{ color: '#FFFFFF', fontSize: 38, fontWeight: '500' }}>{property.beds}</span>
                  </div>
                )}
                {property.baths > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src={bathIconUrl} width={45} height={45} />
                    <span style={{ color: '#FFFFFF', fontSize: 38, fontWeight: '500' }}>{property.baths}</span>
                  </div>
                )}
                {areaLabel && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src={sqftIconUrl} width={45} height={45} />
                    <span style={{ color: '#FFFFFF', fontSize: 38, fontWeight: '500' }}>{areaLabel}</span>
                  </div>
                )}
              </div>
            </div>
          )}
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
