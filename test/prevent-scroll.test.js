import * as React from 'react'
import { mount } from 'enzyme'
import Track from '../src/whirligig'

test('preventScroll prop', () => {
  const ps = (ps) => mount(<Track preventScroll={ps}>{() => [1, 2]}</Track>)

  expect(ps().prop('preventScroll')).toBe(false)

  // Track is triggering an animation that puts the state of overflowX to true. Need to find a better way to test.
  // t.equal(
  //   ps().find('div').first().prop('style').overflowX,
  //   'auto',
  //   'default value of overflowX style for containing element is `auto`'
  // )

  expect(ps(true).find('div').first().prop('style').overflowX).toBe('hidden')
})
