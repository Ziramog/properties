const SectionBox = ({ children, className = '' }) => (
  <div className={`bg-white rounded-3xl overflow-hidden ${className}`}>
    {children}
  </div>
);

export default SectionBox;
