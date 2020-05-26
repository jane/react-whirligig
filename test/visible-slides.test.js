import * as React from 'react'
import { mount } from 'enzyme'
import Track from '../src/whirligig'

test('visibleSlides prop', () => {
  const vs = (vs) => (kids) => {
    let goNext
    let goPrev
    const next = () => goNext()
    const prev = () => goPrev()

    return {
      wrapped: mount(
        <Track visibleSlides={vs}>
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

  const vs1 = vs()([0, 1, 2])
  expect(vs1.wrapped.prop('visibleSlides')).toBe()
  expect(vs1.wrapped.children().find('Slide').first().props().basis).toBe(
    'auto'
  )

  const vs2 = vs(2)([0, 1, 2])
  expect(
    vs2.wrapped
      .children()
      .find('Slide')
      .first()
      .props()
      .basis.startsWith('calc')
  ).toBeTruthy()
})
