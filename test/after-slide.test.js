import React from 'react'
import test from 'tape'
import { mount } from 'enzyme'
import Track from '../src/whirligig'

const tap = (msg) => (thing) => { console.log(msg, thing); return thing }

test('Track afterSlide prop', (t) => {
  const wrapped = mount(<Track>{() => []}</Track>)

  t.equals(typeof wrapped.prop('afterSlide'), 'function', 'value of afterSlide prop should default to a noop function')

  let next, prev, called = 0
  const goNext = () => next()
  const goPrev = () => prev()
  const a = () => { called++ }
  mount(
    <Track afterSlide={a}>{
      (_next, _prev) => {
        next = _next
        prev = _prev
        return [1, 2]
      }
    }</Track>
  )

  goNext()
    .then(() => t.equals(called, 1, 'afterSlide function should be called after sliding to next'))
    .then(() => goPrev()
      .then(() => t.equals(called, 2, 'afterSlide function should be called after sliding to prev'))
    ).catch(tap('error'))

  t.end()
})
