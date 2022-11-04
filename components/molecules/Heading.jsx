function Heading({ as, children, className = '' }) {
  const Component = as;
  return (
    <Component className={`${className} heading heading-${as}`}>
      {children}{' '}
    </Component>
  );
}

Heading.defaultProps = {
  as: 'h1',
};

export default Heading;
