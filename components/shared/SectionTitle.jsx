const SectionTitle = ({ children, size = 'normal' }) => {
  const headingStyle = size === 'large'
    ? 'text-[32px] md:text-lg'
    : 'text-[28px] md:text-[22px]';

  return (
    <h2
      className={`${headingStyle} font-semibold text-[#0F172A] flex items-center`}
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
};

export default SectionTitle;
