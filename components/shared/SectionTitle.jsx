const SectionTitle = ({ children }) => (
  <h2
    className="text-lg font-semibold text-[#0F172A] flex items-center"
    style={{ fontFamily: 'var(--font-heading)' }}
  >
    {children}
    <span
      aria-hidden="true"
      className="inline-block ml-4"
      style={{
        display: 'inline-block',
        width: '55px',
        height: '3px',
        background: '#E94560',
        alignSelf: 'center',
      }}
    />
  </h2>
);

export default SectionTitle;
