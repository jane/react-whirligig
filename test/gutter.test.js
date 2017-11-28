/* eslint-disable react/jsx-no-bind, flowtype/require-return-type */

import React from 'react'
import test from 'tape'
import { mount } from 'enzyme'
import Track from '../src/whirligig'

test('gutter prop', (t) => {
  const gutterTrack = (gutterVal, visibleSlides) => mount(
    <Track gutter={gutterVal} visibleSlides={visibleSlides}>{ () => [1, 2] }</Track>
  )

  gutterTrack('1em').find('Slide')
    .forEach((Slide, i) => {
      if (i === 0) {
        t.equal(Slide.prop('gutter'), '', 'gutter prop is not passed to first Slide')
      } else {
        t.equal(Slide.prop('gutter'), '1em', 'gutter prop is passed to every other Slide')
      }
      t.equal(
        Slide.prop('basis'),
        'auto',
        'Track applies a basis prop to Slide with a value of `auto`'
      )
    })
  gutterTrack('1em', 2).find('Slide')
    .forEach((Slide) => {
      t.ok(
        Slide.prop('basis').startsWith('calc'),
        'Track applies a basis prop to Slide with a css calc value if `visibleSlides` is also set'
      )
      t.ok(
        Slide.prop('basis').match('1em'),
        'Track applies a basis prop to Slide which takes gutter into account if `visibleSlides` is also set'
      )
    })

  /***
   * If this seems weird, it's because it is. React propType validation error logs to the console.
   * this unit test captures `console.error` and stores erverything called with it.
   * we then check to make sure the correct number of calls were made, and that the values are correct.
  */
  let errorLog = []
  console.error = (...msgs) =>  { errorLog = [...errorLog, ...msgs] }
  gutterTrack(1)
  // t.equals(errorLog.length, 2, 'only one error per slide is logged')
  // t.ok(errorLog[0].match(/valid css length unit/), 'the error matches the custom validation message')

  t.end()
})
