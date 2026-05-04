const SectionTitle = ({ children }) => (
  <h2
    className="text-[28px] font-semibold text-[#0F172A] flex items-center"
    style={{ fontFamily: 'var(--font-heading)' }}
  >
    {children}
    <span
      aria-hidden="true"
      className="inline-block ml-5"
      style={{
        display: 'inline-block',
        width: '70px',
        height: '3px',
        background: '#E94560',
        alignSelf: 'center',
      }}
    />
  </h2>
);

export default SectionTitle;
