export const isBrowser = () => typeof window !== 'undefined';

export function shouldTrackPath(pathname = '') {
  if (!pathname) return true;
  return !(
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api')
  );
}

export function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) =>
      value !== undefined && value !== null && value !== ''
    )
  );
}

export function trackEvent(eventName, params = {}) {
  if (!isBrowser()) return;
  if (!window.gtag) return;

  const pathname = window.location?.pathname || '';
  if (!shouldTrackPath(pathname)) return;

  window.gtag('event', eventName, cleanParams({
    page_path: pathname,
    page_location: window.location?.href,
    ...params,
  }));
}

export function trackWhatsappClick(params = {}) {
  trackEvent('click_whatsapp', {
    cta_location: params.cta_location,
    context: params.context || 'general',
    property_id: params.property_id,
    property_type: params.property_type,
    operation: params.operation,
    location: params.location,
    number: params.number,
  });
}

export function trackPhoneClick(params = {}) {
  trackEvent('click_phone', {
    cta_location: params.cta_location,
    context: params.context || 'general',
    number: params.number,
  });
}

export function trackEmailClick(params = {}) {
  trackEvent('click_email', {
    cta_location: params.cta_location,
    context: params.context || 'general',
  });
}

export function trackMapClick(params = {}) {
  trackEvent('click_map', {
    cta_location: params.cta_location,
    context: params.context || 'general',
    property_id: params.property_id,
    property_type: params.property_type,
    operation: params.operation,
    location: params.location,
  });
}

export function trackPropertyViewed(property = {}) {
  trackEvent('property_viewed', {
    property_id: property._id || property.id,
    property_type: property.type,
    operation: property.operation,
    location: property.location?.city || property.location?.neighborhood || property.location?.state,
    price_currency: property.currency,
  });
}

export function trackContactFormSubmitted(params = {}) {
  trackEvent('contact_form_submitted', {
    form_name: params.form_name || 'contact',
    form_location: params.form_location,
  });
}

export function trackSearchUsed(params = {}) {
  trackEvent('search_used', {
    search_type: params.search_type || 'property_filter',
    property_type: params.property_type,
    operation: params.operation,
    location: params.location,
    has_query: Boolean(params.query),
    query_length: params.query ? String(params.query).length : 0,
  });
}
