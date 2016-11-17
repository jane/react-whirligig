import React, { PropTypes } from 'react'
import cn from 'classnames'

const { string, node, array, oneOf, object } = PropTypes

const Slide = ({ basis = '100%', gutter = '1em', className = '', children }) => (
  <div
    className={cn(className)}
    style={{
      flex: '0 0 auto',
      width: basis,
      marginLeft: gutter
    }}
  >
    {children}
  </div>
)

Slide.propTypes = {
  basis: string,
  gutter: string,
  children: node,
  className: oneOf([string, array, object])
}

export default Slide
