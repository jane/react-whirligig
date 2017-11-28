/* eslint-disable react/jsx-no-bind, flowtype/require-return-type */

import React from 'react'
import test from 'tape'
import { mount } from 'enzyme'
import Track from '../src/whirligig'

test('startAt prop', (t) => {
  const sa = (sa) => mount(<Track startAt={sa}>{ () => [0, 1] }</Track>)

  t.equal(
    sa().prop('startAt'),
    0,
    'startAt defaults to 0'
  )

  t.equal(
    sa().state('activeIndex'),
    0,
    'activeIndex initializes to default startAt value when'
  )

  t.equal(
    sa(1).state('activeIndex'),
    1,
    'activeIndex initializes to value of startAt'
  )

  t.equal(
    sa(3).state('activeIndex'),
    1,
    'activeIndex is normalized to be within the bounds of the number Silde children'
  )

  t.end()
})
