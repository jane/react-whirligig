/* eslint-disable react/jsx-no-bind, flowtype/require-return-type */

import React from 'react'
import test from 'tape'
import { shallow } from 'enzyme'
import Track from '../src/whirligig'

test('slideClass prop', (t) => {
  const slideclass = (cn) => shallow(<Track slideClass={cn}>{() => [1]}</Track>)

  t.equal(
    slideclass('slideClassName')
      .find('Slide')
      .prop('className'),
    'slideClassName',
    'Track passes `slideClass` prop value as className prop to Slide'
  )

  t.end()
})
