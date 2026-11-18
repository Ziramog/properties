export function parsePrice(priceStr) {
  if (!priceStr) return { currency: 'USD', symbol: 'U$D', numericPrice: null };

  const rawString = String(priceStr).toUpperCase().trim();
  if (rawString.includes('CONSULTAR')) {
    return { currency: 'USD', symbol: 'U$D', numericPrice: null };
  }

  // Extract digits (supporting Argentine thousands dots/commas without breaking 450.000 -> 450)
  const numericString = rawString.replace(/[.,]00$/, '').replace(/[^0-9]/g, '');
  const numericPrice = numericString ? parseFloat(numericString) : null;

  // Determine currency
  let currency = 'USD';
  let symbol = 'U$D';

  if (rawString.startsWith('ARS') || rawString.startsWith('$')) {
    currency = 'ARS';
    symbol = '$';
  } else if (rawString.startsWith('USD') || rawString.startsWith('U$D')) {
    currency = 'USD';
    symbol = 'U$D';
  }

  return { currency, symbol, numericPrice };
}

export function formatPriceDisplay(priceStr, operation = null) {
  const { symbol, numericPrice } = parsePrice(priceStr);
  if (!numericPrice) return 'Consultar';
  const suffix = operation && String(operation).toLowerCase() === 'alquiler' ? '/mes' : '';
  return `${symbol} ${numericPrice.toLocaleString('es-AR')}${suffix}`;
}
