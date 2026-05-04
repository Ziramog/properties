const SectionTitle = ({ children }) => (
  <h2
    className="text-3xl md:text-[28px] font-semibold text-[#0F172A] pb-3 mb-6"
    style={{
      fontFamily: 'var(--font-heading)',
      borderBottom: '3px solid #E94560',
    }}
  >
    {children}
  </h2>
);

export default SectionTitle;
