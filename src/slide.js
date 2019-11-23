/* eslint-disable react/prop-types */

import * as React from 'react'

const Slide = ({
  basis = '100%',
  gutter = '1em',
  className = '',
  children,
  ...props
}) => (
  <div
    className={className}
    style={{
      flex: '0 0 auto',
      width: basis,
      marginLeft: gutter,
    }}
    {...props}
  >
    {children}
  </div>
)

export default Slide
