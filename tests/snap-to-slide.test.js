import React from 'react'
import test from 'tape'
import { mount } from 'enzyme'
import Track from '../src/track'

test('snapToSlide prop', (t) => {
  const sts = (sts) => mount(<Track snapToSlide={sts}>{ () => [1] }</Track>)

  t.plan(1)

  t.equal(
    sts().prop('snapToSlide'),
    false,
    'preventSnapping defaults to false'
  )

  // TODO: how to test this properly
})
