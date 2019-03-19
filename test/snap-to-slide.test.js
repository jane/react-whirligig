import * as React from 'react'
import { mount } from 'enzyme'
import Track from '../src/whirligig'

test('snapToSlide prop', () => {
  const sts = (sts) => mount(<Track snapToSlide={sts}>{() => [1]}</Track>)

  expect(sts().prop('snapToSlide')).toBe(false)
})
