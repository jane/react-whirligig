import test from 'tape'
import { mount } from 'enzyme'
import Track from '../src/track'

test('preventSnapping prop', (t) => {
  const ps = (ps) => mount(<Track preventSnapping={ps}>{ () => [1] }</Track>)

  t.plan(1)

  t.equal(
    ps().prop('preventSnapping'),
    false,
    'preventSnapping defaults to false'
  )

  // TODO: how to test this properly
})
