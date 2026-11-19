'use client';
import StoryShareButton from './StoryShareButton';
import FeedShareButton from './FeedShareButton';

/**
 * Panel reutilizable con botones de exportación a Instagram/Facebook (Historia 9:16 y Carrusel Feed 4:5).
 * Compartido entre la ficha privada de la propiedad (/properties/[id]) y el modal del panel Admin.
 */
export default function SocialSharePanel({ property, variant = 'light', className = '' }) {
  if (!property) return null;

  return (
    <div className={className}>
      <StoryShareButton property={property} variant={variant} />
      <FeedShareButton property={property} variant={variant} />
    </div>
  );
}
