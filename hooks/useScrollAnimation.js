'use client';

/**
 * useScrollAnimation
 * Attaches IntersectionObserver to .js-animate elements
 * When they enter viewport, adds .active class (senada style)
 * Run once on mount, no cleanup needed (mutationObserver watches for new elements)
 */
import { useEffect } from 'react';

export function useScrollAnimation() {
  useEffect(() => {
    // Avoid running during SSR
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const options = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    const observeElements = () => {
      document.querySelectorAll('.js-animate:not(.observed)').forEach((el) => {
        el.classList.add('observed');
        observer.observe(el);
      });
    };

    // Initial observe
    observeElements();

    // Watch for dynamically added elements
    const mutationObserver = new MutationObserver((mutations) => {
      if (mutations.some((m) => m.addedNodes.length > 0)) {
        observeElements();
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}

export default useScrollAnimation;