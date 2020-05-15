import React from 'react';
import PropTypes from 'prop-types';

const LargeParagraph = ({
  color = 'var(--color-black-90)',
  size = 'var(--fontsize-body-large)',
  style = {},
  children,
}) => (
  <p
    style={{
      fontSize: size,
      color,
      ...style,
    }}
  >
    {children}
  </p>
);

Text.propTypes = {
  color: PropTypes.string,
  size: PropTypes.string,
};

export default LargeParagraph;
