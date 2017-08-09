import React from 'react'
import test from 'tape'
import { mount } from 'enzyme'
import Track from '../src/whirligig'

test('infinite prop', (t) => {
  const infinite = (infinite) => (kids) => {
    let goNext, goPrev
    const next = () => goNext()
    const prev = () => goPrev()
    return {
      wrapped: mount(
        <Track infinite={infinite}>{
          (_next, _prev) => {
            goNext = _next
            goPrev = _prev
            return kids
          }
        }</Track>),
      next,
      prev
    }
  }

  const infinite1 = infinite()([0, 1, 2])
  t.equal(
    infinite1.wrapped.prop('infinite'),
    undefined,
    'infinite defaults to false'
  )

  const infinite2 = infinite(true)([0, 1, 2])
  infinite2.prev()
  t.equal(
    infinite2.wrapped.state('activeIndex'),
    2,
    'When infinite is true, preving past the begining returns to the end'
  )

  infinite2.next()
  t.equal(
    infinite2.wrapped.state('activeIndex'),
    0,
    'When infinite is true, preving past the end returns to the begining'
  )

  t.end()
})
