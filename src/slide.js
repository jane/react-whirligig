// @flow

import * as React from 'react'

export type SlideProps = {
  basis: string,
  children: React.Node,
  className: string,
  gutter: string,
}

const Slide = ({
  basis = '100%',
  gutter = '1em',
  className = '',
  children,
  ...props
}: SlideProps) => (
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
