import * as u from '../src/utils'

test('utils.includes', () => {
  expect(u.includes(1, [1, 2, 3])).toBe(true)
  expect(u.includes(1, [0, 2, 3])).toBe(false)
})

test('utils.values', () => {
  const o = { a: 1, b: 2, c: 3, d: 4 }
  const e = [1, 2, 3, 4]
  expect(u.values(o)).toEqual(e)
})

test('utils.minMap', () => {
  expect(u.minMap(1, 2, 3, 4)(5)).toBe(1)
})

test('utils.maxMap', () => {
  expect(u.maxMap(1, 2, 3, 4)(5)).toBe(5)
})
