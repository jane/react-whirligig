/* eslint-disable react/jsx-no-bind, flowtype/require-return-type */

import React from 'react'
import test from 'tape'
import { mount } from 'enzyme'
import Track from '../src/whirligig'

test('snapToSlide prop', (t) => {
  const sts = (sts) => mount(<Track snapToSlide={sts}>{ () => [1] }</Track>)

  t.equal(
    sts().prop('snapToSlide'),
    false,
    'preventSnapping defaults to false'
  )

  // TODO: how to test this properly

  t.end()
})
