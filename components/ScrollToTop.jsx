'use client';
import { useEffect } from 'react';

export default function ScrollToTop({ searchParams }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [JSON.stringify(searchParams)]);
  return null;
}
