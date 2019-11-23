/* eslint-disable no-console */

import * as React from 'react'
import { mount } from 'enzyme'
import Track from '../src/whirligig'

test('gutter prop', () => {
  const gutterTrack = (gutterVal, visibleSlides) =>
    mount(
      <Track gutter={gutterVal} visibleSlides={visibleSlides}>
        {() => [1, 2]}
      </Track>
    )

  gutterTrack('1em')
    .find('Slide')
    .forEach((Slide, i) => {
      if (i === 0) {
        expect(Slide.prop('gutter')).toBe('')
      } else {
        expect(Slide.prop('gutter')).toBe('1em')
      }
      expect(Slide.prop('basis')).toBe('auto')
    })

  gutterTrack('1em', 2)
    .find('Slide')
    .forEach((Slide) => {
      expect(Slide.prop('basis').startsWith('calc')).toBeTruthy()
      expect(Slide.prop('basis').match('1em')).toBeTruthy()
    })

  /***
   * If this seems weird, it's because it is. React propType validation error logs to the console.
   * this unit test captures `console.error` and stores erverything called with it.
   * we then check to make sure the correct number of calls were made, and that the values are correct.
   */
  let errorLog = []
  console.error = (...msgs) => {
    errorLog = [...errorLog, ...msgs]
  }
  gutterTrack(1)
  // t.equals(errorLog.length, 2, 'only one error per slide is logged')
  // t.ok(errorLog[0].match(/valid css length unit/), 'the error matches the custom validation message')
})
