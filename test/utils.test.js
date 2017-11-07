import * as u from '../src/utils'
import test from 'tape'

test('utils.includes', (t) => {
  t.true(u.includes(1, [ 1, 2, 3 ]), 'arr includes el')
  t.false(u.includes(1, [ 0, 2, 3 ]), 'arr does not include el')
  t.end()
})

test('utils.values', (t) => {
  const o = { a: 1, b: 2, c: 3, d: 4 }
  const e = [ 1, 2, 3, 4 ]
  t.deepEqual(u.values(o), e, 'is Object.values')
  t.end()
})

test('utils.minMap', (t) => {
  t.equal(u.minMap(1, 2, 3, 4)(5), 1, 'works')
  t.end()
})

test('utils.maxMap', (t) => {
  t.equal(u.maxMap(1, 2, 3, 4)(5), 5, 'works')
  t.end()
})
