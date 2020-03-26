import * as React from 'react'
import { shallow } from 'enzyme'
import Track from '../src/whirligig'

test('slideClass prop', () => {
  const slideclass = (cn) => shallow(<Track slideClass={cn}>{() => [1]}</Track>)

  expect(slideclass('slideClassName').find('Slide').prop('className')).toBe(
    'slideClassName'
  )
})
