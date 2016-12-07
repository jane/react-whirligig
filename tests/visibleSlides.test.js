import test from 'tape'
import { mount } from 'enzyme'
import Track from '../src/track'

test('visibleSlides prop', (t) => {
  const vs = (vs) => (kids) => {
    let goNext, goPrev
    const next = () => goNext()
    const prev = () => goPrev()

    return {
      wrapped: mount(
        <Track visibleSlides={vs}>{
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

  t.plan(5)

  const vs1 = vs()([0, 1, 2])

  t.equal(
    vs1.wrapped.prop('visibleSlides'),
    1,
    'visibleSlides defaults to 1'
  )

  const vs2 = vs(2)([0, 1, 2, 3])
  vs2.next()
  t.equal(
    vs2.wrapped.state('activeIndex'),
    2,
    'activeIndex increments by the number of visibleSlides when remaining slides are greater than visibleSlides'
  )

  vs2.prev()
  t.equal(
    vs2.wrapped.state('activeIndex'),
    0,
    'activeIndex decrements by the number of visibleSlides when remaining slides are greater than visibleSlides'
  )

  const vs3 = vs(2)([0, 1, 2])
  vs3.next()
  t.equal(
    vs3.wrapped.state('activeIndex'),
    1,
    'activeIndex increments to the number of slides - visibleSlides when visibleSlides > remaining slides'
  )
  vs3.prev()
  t.equal(
    vs3.wrapped.state('activeIndex'),
    0,
    'activeIndex decrements to the 0 when visibleSlides > remaining previous slides'
  )
})
