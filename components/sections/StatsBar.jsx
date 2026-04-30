'use client';
import { useState, useEffect, useRef } from 'react';

const STATS = [
  { value: 500, suffix: '+', label: 'Propiedades' },
  { value: 10, suffix: '+', label: 'Años de experiencia' },
  { value: 4.8, suffix: '', label: 'Calificación', decimals: 1 },
  { value: 98, suffix: '%', label: 'Clientes satisfechos' },
];

const StatItem = ({ stat, isLast }) => {
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
    <div
      ref={ref}
      className={`flex-1 px-6 md:px-10 ${!isLast ? 'border-r border-[#e1e1e1]' : ''}`}
    >
      <h3 className="text-[32px] md:text-[50px] leading-none text-[#0F172A]" style={{ fontFamily: 'var(--font-heading)' }}>
        {count}{stat.suffix}
      </h3>
      <p className="text-[14px] md:text-[18px] leading-[24px] text-[#475569] mt-2 md:mt-3" style={{ fontFamily: 'var(--font-body)' }}>
        {stat.label}
      </p>
    </div>
  );
};

const StatsBar = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="flex flex-wrap md:flex-nowrap">
          {STATS.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} isLast={i === STATS.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
