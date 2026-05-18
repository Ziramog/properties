'use client';
import { useEffect } from 'react';

export default function ScrollToTop({ searchParams }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [JSON.stringify(searchParams)]);
  return null;
}
