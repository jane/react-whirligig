import test from 'tape'
import { mount, shallow } from 'enzyme'
import Track from '../src/track'

test('child as function ', (t) => {
  t.test('child must be a function', (t) => {
    t.plan(2)
    t.throws(() => shallow(<Track />), null, 'throws when no child is provided')
    t.throws(() => shallow(<Track><p>Not a fn</p></Track>), null, 'throws when child is not a function')
  })

  t.test('child function is passed next and previous functions', (t) => {
    let next, prev

    const goNext = () => next()
    const goPrev = () => prev()
    mount(
      <Track>{
        (_next, _prev) => {
          next = _next
          prev = _prev
        }
      }</Track>
    )
    t.plan(4)
    t.equals(typeof next, 'function', 'next function is passed as first argument to child function')
    t.equals(typeof prev, 'function', 'prev function is passed as second argument to child function')
    t.equals(typeof goNext().then, 'function', 'next function returns a promise')
    t.equals(typeof goPrev().then, 'function', 'prev function returns a promise')
  })

  t.test('child function uses return value for slide items', (t) => {
    const wrapped = shallow(
      <Track>{
        () => [1, 2, 3, 4]
      }</Track>
    )
    t.plan(1)
    t.equals(wrapped.find('Slide').length, 4, 'has the correct number of Slide children')
  })
})
