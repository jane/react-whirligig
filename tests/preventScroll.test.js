import test from 'tape'
import { mount } from 'enzyme'
import Track from '../src/track'

test('preventScroll prop', (t) => {
  const ps = (ps) => mount(<Track preventScroll={ps}>{ () => [1, 2] }</Track>)

  t.plan(3)
  t.equal(ps().prop('preventScroll'), false, 'preventScroll defaults to false')
  t.equal(
    ps().find('div').first().prop('style').overflowX,
    'auto',
    'default value of overflowX style for containing element is `auto`'
  )
  t.equal(
    ps(true).find('div').first().prop('style').overflowX,
    'hidden',
    'value of overflowX style for containing element when preventScroll is true is `hidden`'
  )
})
