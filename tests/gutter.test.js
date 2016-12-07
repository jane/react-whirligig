import test from 'tape'
import { mount } from 'enzyme'
import Track from '../src/track'

test('Track passes gutter prop to Slide', (t) => {
  const gutterTrack = (gutterVal) => mount(<Track gutter={gutterVal}>{ () => [1, 2] }</Track>)

  t.plan(8)
  gutterTrack('1em').find('Slide')
    .forEach((Slide) => {
      t.equal(Slide.prop('gutter'), '1em', 'Track passes gutter prop to Slide')
      t.ok(
        Slide.prop('basis').match(/^calc/),
        'Track applies a basis prop to Slide with a css calc value'
      )
      t.ok(
        Slide.prop('basis').match('1em'),
        'Track applies a basis prop to Slide which takes gutter into account'
      )
    })

  /***
   * If this seems weird, it's because it is. React propType validation error logs to the console.
   * this unit test captures `console.error` and stores erverything called with it.
   * we then check to make sure the correct number of calls were made, and that the values are correct.
  */
  let  errorLog = []
  console.error = (...msgs) =>  { errorLog = [...errorLog, ...msgs] }
  gutterTrack(1)
  t.equals(errorLog.length, 2, 'only one error per slide is logged')
  t.ok(errorLog[0].match(/valid css length unit/), 'the error matches the custom validation message')
})
