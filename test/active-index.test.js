import * as React from 'react'
import { mount } from 'enzyme'
import Track from '../src/whirligig'

test('activeIndex state', () => {
  const ai = ({ startAt, visibleSlides, infinite } = {}) => {
    let goNext
    let goPrev
    const next = () => goNext()
    const prev = () => goPrev()

    return {
      next,
      prev,
      component: mount(
        <Track
          startAt={startAt}
          visibleSlides={visibleSlides}
          infinite={infinite}
        >
          {(_next, _prev) => {
            goNext = _next
            goPrev = _prev
            return [0, 1, 2, 3, 4, 5, 6, 7]
          }}
        </Track>
      ),
    }
  }

  expect(ai().component.state('activeIndex')).toBe(0)
  expect(ai({ startAt: 3 }).component.state('activeIndex')).toBe(3)

  const nexted = ai({ visibleSlides: 3 })
  nexted.next()
  expect(nexted.component.state('activeIndex')).toBe(3)
  nexted.next()
  expect(nexted.component.state('activeIndex')).toBe(5)

  const preved = ai({ visibleSlides: 3, startAt: 5 })
  preved.prev()
  expect(preved.component.state('activeIndex')).toBe(2)
  preved.prev()
  expect(preved.component.state('activeIndex')).toBe(0)
})
