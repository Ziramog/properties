const SectionTitle = ({ children }) => (
  <div className="mb-6">
    <h2
      className="text-[28px] font-semibold text-[#0F172A] leading-tight mb-3"
      style={{ fontFamily: 'var(--font-heading)' }}
    >
      {children}
    </h2>
    <div className="flex items-center gap-3">
      <span className="w-7 h-px bg-[#E94560] flex-shrink-0" />
      <span className="w-2 h-2 bg-[#E94560] rounded-full flex-shrink-0" />
      <span className="w-7 h-px bg-[#E94560] flex-shrink-0" />
    </div>
  </div>
);

export default SectionTitle;
