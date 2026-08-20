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

  const Logo = () => (
    <div style={{ position: 'absolute', top: 60, left: 60, zIndex: 20, display: 'flex', alignItems: 'center' }}>
      <img src={logoUrl} width={250} style={{ objectFit: 'contain' }} />
    </div>
  );

  const getAreaDisplay = () => {
    if (property.covered_area) return `${property.covered_area.toLocaleString('es-AR')} m² cub`;
    if (property.square_feet) return `${property.square_feet.toLocaleString('es-AR')} m² tot`;
    return null;
  };
  const areaLabel = getAreaDisplay();

  if (template === '2') {
    const mainImage = property.images?.[0]?.url || 'https://via.placeholder.com/1080x1080';
    const thumbnails = property.images?.slice(1, 4) || [];
    
    // Fill with placeholders if less than 3 thumbnails
    while (thumbnails.length < 3) {
      thumbnails.push({ url: 'https://via.placeholder.com/350x250?text=Propiedad' });
    }

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
          <Logo />

          {/* Main Background Image - Top 50% */}
          <div style={{ display: 'flex', width: '100%', height: '52%', position: 'relative' }}>
            <img
              src={mainImage}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Thumbnails - 13% height */}
          <div style={{ display: 'flex', width: '100%', height: '13%', padding: '10px', gap: '10px' }}>
            {thumbnails.map((thumb, index) => (
              <div key={index} style={{ display: 'flex', flex: 1, height: '100%' }}>
                <img
                  src={thumb.url}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Technical Details - Bottom 35% */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '35%',
              padding: '40px',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', width: '70%' }}>
                {/* Property Name */}
                <h1 style={{ color: '#FFFFFF', fontSize: 60, fontWeight: '900', margin: '0 0 10px 0', lineHeight: 1.1, wordWrap: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {property.name || property.type || 'Propiedad'}
                </h1>
                
                {/* Location */}
                <p style={{ color: '#A6ADB8', fontSize: 40, margin: '0 0 25px 0' }}>
                  {property.location?.city || ''}{property.location?.state ? `, ${property.location.state}` : ''}
                </p>

                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  {areaLabel && <span style={{ color: '#FFFFFF', backgroundColor: '#1F2937', padding: '12px 24px', borderRadius: '12px', fontSize: 32 }}>{areaLabel}</span>}
                  {property.beds > 0 && <span style={{ color: '#FFFFFF', backgroundColor: '#1F2937', padding: '12px 24px', borderRadius: '12px', fontSize: 32 }}>{property.beds} Dorms</span>}
                  {property.baths > 0 && <span style={{ color: '#FFFFFF', backgroundColor: '#1F2937', padding: '12px 24px', borderRadius: '12px', fontSize: 32 }}>{property.baths} Baños</span>}
                </div>
              </div>

              {/* Status Badge */}
              <div
                style={{
                  backgroundColor: property.operation === 'alquiler' ? '#3B82F6' : '#2DAA68',
                  color: '#FFFFFF',
                  fontSize: 28,
                  fontWeight: 'bold',
                  padding: '12px 25px',
                  borderRadius: '15px',
                  textTransform: 'uppercase',
                }}
              >
                {property.operation ? (property.operation === 'venta' ? 'VENTA' : property.operation.toUpperCase()) : 'DISPONIBLE'}
              </div>
            </div>

            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '2px solid #1F2937', paddingTop: '30px' }}>
              <h2 style={{ color: '#FFFFFF', fontSize: 90, fontWeight: 'bold', margin: '0' }}>
                {formatPrice(property.price)}
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <p style={{ color: '#FFFFFF', fontSize: 35, fontWeight: '600', margin: '0 0 10px 0' }}>
                  Más fotos y detalles en:
                </p>
                <p style={{ color: '#9CA3AF', fontSize: 30, margin: 0 }}>
                  roggeroyroma.com.ar
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      { ...size }
    );
  }

  // Template 1 (Classic Split)
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
        {/* Main Background Image - Top Half */}
        <div style={{ display: 'flex', width: '100%', height: '55%', position: 'relative' }}>
          <img
            src={imageUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {/* Gradient to blend into bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '50%',
              backgroundImage: 'linear-gradient(to top, #0B0D10 0%, transparent 100%)',
            }}
          />
        </div>

        <Logo />

        {/* Text Content - Bottom Half */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            height: '45%',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          {/* Title */}
          <h1 style={{ color: '#FFFFFF', fontSize: 70, fontWeight: '900', margin: '0 0 20px 0', lineHeight: 1.1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {property.name || property.type || 'Propiedad Exclusiva'}
          </h1>
          
          {/* Location & Area */}
          <p style={{ color: '#A6ADB8', fontSize: 45, margin: '0 0 40px 0' }}>
            {property.location?.city || ''} {areaLabel ? `• ${areaLabel}` : ''}
          </p>
          
          {/* Price */}
          <h2 style={{ color: '#FFFFFF', fontSize: 100, fontWeight: 'bold', margin: '0 0 50px 0' }}>
            {formatPrice(property.price)}
          </h2>
          
          {/* Status Badge */}
          <div
            style={{
              backgroundColor: property.operation === 'alquiler' ? '#3B82F6' : '#2DAA68',
              color: '#FFFFFF',
              fontSize: 35,
              fontWeight: 'bold',
              padding: '15px 40px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              marginBottom: '60px',
            }}
          >
            {property.operation ? (property.operation === 'venta' ? 'VENTA' : property.operation.toUpperCase()) : 'DISPONIBLE'}
          </div>

          <p style={{ color: '#FFFFFF', fontSize: 50, fontWeight: '500', margin: '0 0 20px 0' }}>
            Conocé esta propiedad
          </p>
          
          <p style={{ color: '#A6ADB8', fontSize: 35, margin: 0 }}>
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
