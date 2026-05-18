'use client';
import { useEffect } from 'react';

export default function ScrollToTop({ searchParams }) {
  useEffect(() => {
    const el = document.getElementById('resultados');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  }, [JSON.stringify(searchParams)]);
  return null;
}
