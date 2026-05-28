'use client';
import { useEffect } from 'react';

export default function ScrollToTop({ searchParams }) {
  useEffect(() => {
    // Force scroll to top on mount (fixes scroll from homepage nav)
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [JSON.stringify(searchParams)]);
  return null;
}
