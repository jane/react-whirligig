/* eslint-disable no-console */

import * as React from 'react'
import { mount } from 'enzyme'
import Track from '../src/whirligig'

const tap = (msg) => (thing) => {
  console.log(msg, thing)
  return thing
}

test('Track afterSlide prop', () => {
  const wrapped = mount(<Track>{() => []}</Track>)

  expect(typeof wrapped.prop('afterSlide')).toBe('function')

  let next
  let prev
  let called = 0

  const goNext = () => next()
  const goPrev = () => prev()
  const a = () => {
    called++
  }

  mount(
    <Track afterSlide={a}>
      {(_next, _prev) => {
        next = _next
        prev = _prev
        return [1, 2]
      }}
    </Track>
  )

  goNext()
    .then(() => {
      expect(called).toBe(1)
    })
    .then(() => {
      goPrev().then(() => {
        expect(called).toBe(2)
      })
    })
    .catch(tap('error'))
})
