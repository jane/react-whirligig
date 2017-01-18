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

  t.plan(3)

  const vs1 = vs()([0, 1, 2])

  t.equal(
    vs1.wrapped.prop('visibleSlides'),
    undefined,
    'visibleSlides has no default'
  )

  t.equal(
    vs1.wrapped.children('Slide').first().props().basis,
    'auto',
    'Track children (Slide) have a default basis of `auto` when no `visibleSlides` is set'
  )

  const vs2 = vs(2)([0, 1, 2])
  t.ok(
    vs2.wrapped.children('Slide').first().props().basis.match(/^calc/),
    'Track children (Slide) have a calculated basis'
  )
})
