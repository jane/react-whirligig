import * as React from 'react'
import { mount } from 'enzyme'
import Track from '../src/whirligig'

test('startAt prop', () => {
  const sa = (sa) => mount(<Track startAt={sa}>{() => [0, 1]}</Track>)

  expect(sa().prop('startAt')).toBe(0)
  expect(sa().state('activeIndex')).toBe(0)
  expect(sa(1).state('activeIndex')).toBe(1)
  expect(sa(3).state('activeIndex')).toBe(1)
})
