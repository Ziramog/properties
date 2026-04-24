'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import ScrollReveal from '@/components/shared/ScrollReveal';

const STATS = [
  { value: 500, suffix: '+', label: 'Propiedades' },
  { value: 10, suffix: '+', label: 'Años de experiencia' },
  { value: 4.8, suffix: '', label: 'Calificación', decimals: 1 },
];

const StatItem = ({ stat, delay }) => {
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const duration = 1800;
    const target = stat.value;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      setCount(stat.decimals ? parseFloat(current.toFixed(stat.decimals)) : Math.floor(current));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [active, stat.value, stat.decimals]);

  return (
    <div ref={ref}>
      <ScrollReveal delay={delay}>
        <div className="text-center px-8">
          <p
            className="text-[64px] font-bold text-[var(--color-brand)] leading-none tracking-tight mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {count}{stat.suffix}
          </p>
          <p className="text-[15px] font-normal text-[var(--color-ink-secondary)]">
            {stat.label}
          </p>
        </div>
      </ScrollReveal>
    </div>
  );
};

const StatsBar = () => {
  return (
    <section className="bg-[var(--color-surface-soft)] py-10 md:py-16 px-4 md:px-6 border-t border-b border-[var(--color-border)]">
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-3 divide-x divide-[var(--color-border)]">
          {STATS.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
