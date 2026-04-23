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
  if (property.price) return property.price;
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

/**
 * Fallback image when a property has none or uses a placeholder domain.
 */
export const FALLBACK_IMAGE = '/images/property-placeholder.jpg';

export function getPropertyImage(property, index = 0) {
  const src = property.images?.[index];
  if (!src || src.includes('via.placeholder.com')) return FALLBACK_IMAGE;
  return src;
}
