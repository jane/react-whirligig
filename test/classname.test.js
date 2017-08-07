import React from 'react'
import test from 'tape'
import { shallow } from 'enzyme'
import Track from '../src/track'

test('Track classname prop', (t) => {
  const str = () => shallow(<Track className={'string'}>{ () => [] }</Track>)
  const arr = () => shallow(<Track className={['string']}>{ () => [] }</Track>)
  const obj = () => shallow(<Track className={{ 'string': true }}>{ () => [] }</Track>)

  t.equal(typeof str().prop('className'), 'string', 'className accepts a string')
  t.equal(typeof obj().prop('className'), 'object', 'className accepts an object')
  t.ok(Array.isArray(arr().prop('className')), 'className accepts an array')

  t.end()
})
