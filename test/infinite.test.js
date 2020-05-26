import * as React from 'react'
import { mount } from 'enzyme'
import Track from '../src/whirligig'

test('infinite prop', () => {
  const infinite = (infinite) => (kids) => {
    let goNext
    let goPrev
    const next = () => goNext()
    const prev = () => goPrev()

    return {
      wrapped: mount(
        <Track infinite={infinite}>
          {(_next, _prev) => {
            goNext = _next
            goPrev = _prev
            return kids
          }}
        </Track>
      ),
      next,
      prev,
    }
  }

  const infinite1 = infinite()([0, 1, 2])
  expect(infinite1.wrapped.prop('infinite')).toBe()

  const infinite2 = infinite(true)([0, 1, 2])
  infinite2.prev()
  expect(infinite2.wrapped.state('activeIndex')).toBe(2)
  infinite2.next()
  expect(infinite2.wrapped.state('activeIndex')).toBe(0)
})
