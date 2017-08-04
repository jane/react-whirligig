import React from 'react'
import test from 'tape'
import { shallow } from 'enzyme'
import Track from '../src/track'

test('slideClass prop', (t) => {
  const slideclass = (cn) => shallow(<Track slideClass={cn}>{ () => [1] }</Track>)

  t.plan(1)
  t.equal(
    slideclass('slideClassName').find('Slide').prop('className'),
    'slideClassName',
    'Track passes `slideClass` prop value as className prop to Slide')
})
