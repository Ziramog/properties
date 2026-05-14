/**
 * Display helpers for property data.
 * Fixes the square_feet / covered_area confusion and standardises formatting.
 */

/**
 * Return the most meaningful area string for a property card.
 * Houses/apartments → covered area.  Land/campo → total area (with hectare conversion).
 */
export function getAreaDisplay(property) {
  const isBuilding = ['Casa', 'Departamento', 'Inmueble Comercial'].includes(property.type);

  // Prefer covered_area for buildings
  if (isBuilding && property.covered_area) {
    return `${property.covered_area.toLocaleString()} m²`;
  }

  // Fallback to square_feet (which is really total/lot area)
  if (property.square_feet != null) {
    if (property.square_feet >= 10000) {
      const has = property.square_feet / 10000;
      return has >= 1 ? `${has.toFixed(has % 1 === 0 ? 0 : 1)} has` : `${property.square_feet.toLocaleString()} m²`;
    }
    return `${property.square_feet.toLocaleString()} m²`;
  }

  return null;
}

/**
 * Return a formatted price string.
 */
export function getPriceDisplay(property) {
  if (property.price) {
    // Handle both string ('USD 320,000') and number prices
    let num = typeof property.price === 'number'
      ? property.price
      : parseFloat(property.price.replace(/[^0-9.]/g, ''));
    if (!isNaN(num) && num >= 1000) {
      const k = num / 1000;
      return `U$D ${k % 1 === 0 ? k : k.toFixed(k < 10 ? 2 : 1)}k`;
    }
    if (!isNaN(num)) return `U$D ${num.toLocaleString('es-AR')}`;
  }
  if (property.rates?.monthly) return `$${property.rates.monthly.toLocaleString()}/mes`;
  if (property.rates?.weekly) return `$${property.rates.weekly.toLocaleString()}/sem`;
  if (property.rates?.nightly) return `$${property.rates.nightly.toLocaleString()}/noche`;
  return 'Consultar';
}

/**
 * Check if a property was published within the last N days.
 */
export function isNewListing(property, days = 7) {
  if (!property.createdAt) return false;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return new Date(property.createdAt).getTime() > cutoff;
}

const STATUS_BADGE_MAP = {
  closed:              { label: 'Vendido',      letter: 'V', bg: 'bg-[var(--color-brand)]' },
  pending:             { label: 'Pendiente',    letter: 'P', bg: 'bg-amber-500' },
  active_under_contract: { label: 'Bajo Contrato', letter: 'B', bg: 'bg-blue-500' },
  coming_soon:         { label: 'Próximamente', letter: 'C', bg: 'bg-purple-500' },
};

/**
 * Return a status badge config for a property card, or null if no badge.
 * Priority: closed > pending > coming_soon > active_under_contract > active+new
 */
export function getStatusBadge(property) {
  if (property.status && STATUS_BADGE_MAP[property.status]) {
    return STATUS_BADGE_MAP[property.status];
  }
  if (isNewListing(property)) {
    return { label: 'Nuevo', letter: 'N', bg: 'bg-emerald-500' };
  }
  return null;
}

/**
 * Fallback image when a property has none or uses a placeholder domain.
 */
export const FALLBACK_IMAGE = '/images/property-placeholder.jpg';

export function getPropertyImage(property, index = 0) {
  const src = property.images?.[index];
  if (!src || src.includes('via.placeholder.com')) return FALLBACK_IMAGE;
  return src;
}
