'use client';
import { useEffect } from 'react';

export default function ScrollToTop({ searchParams, isFiltered = false }) {
  useEffect(() => {
    if (isFiltered) {
      // Scroll to results section (hiding search bar above, but accessible by scrolling up)
      const el = document.getElementById('resultados');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [isFiltered]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [JSON.stringify(searchParams)]);
  return null;
}
