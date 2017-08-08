# react-whirligig

* [demo](https://jane.github.io/react-whirligig)
* [npm](https://npmjs.com/package/react-whirligig)
* [repo](https://github.com/jane/react-whirligig)

A carousel/slider-like component for sequentially displaying slides or sets of
slides.

----

## Basic Usage

```jsx
const Slider = ({ slideIndex }) => (
  <div>
    <Whirligig visibleSlides={3} gutter="1em" slideTo={slideIndex}>
      <img src="http://www.fillmurray.com/400/300" />
      <img src="http://www.fillmurray.com/300/400" />
      <img src="http://www.fillmurray.com/400/200" />
      <img src="http://www.fillmurray.com/200/400" />
      <img src="http://www.fillmurray.com/500/300" />
    </Whirligig>
  </div>
)
```

`react-whirligig` exposes next and prev functions for moving the track forward and
backward the number of visible slides. These functions can be accessed using the
`ref` prop callback to get a reference to the `Whirligig` instance.

```jsx
import React from 'react'
import Whirligig from 'react-whirligig'

const Slider = () => {
  let track
  const next = () => track.next()
  const prev = () => track.prev()

  return (
    <div>
      <button onClick={prev}>Prev</button>
      <Whirligig
        visibleSlides={3}
        gutter="1em"
        ref={(_trackInstance) => { track = _trackInstance}}
      >
        <img src="http://www.fillmurray.com/400/300" />
        <img src="http://www.fillmurray.com/300/400" />
        <img src="http://www.fillmurray.com/400/200" />
        <img src="http://www.fillmurray.com/200/400" />
        <img src="http://www.fillmurray.com/500/300" />
      </Whirligig>
      <button onClick={next}>Next</button>
    </div>
  )
}
```

See the [demo code](https://github.com/jane/react-whirligig/blob/master/dev.js)
for advanced usage.

## Whirligig

The Whirligig component is a horizontally oriented container of Slides.

## Props

### afterSlide:_func_

_default: noop_

A function to be called after the track transitions to a new "active" slide. The
function is passed the new "active" slide index.

### animationDuration:_func_

_default: 500_

The number of milliseconds the slide animation should take.

### beforeSlide:_func_

_default: noop_

A function to be called before the track transitions to a new "active" slide.
The function is passed what the new "active" slide index will be.

### className:_classnames_

A [`classnames`](https://github.com/JedWatson/classnames) compliant value
(string or array of `string|array|object` that will be applied as the class
attribute.

### easing:_func_

_default: easeOutQuint_

A function which takes a `float` representing the percentage of time that has
passed for a given animation and returns a `float` representing the relative
progress of the element being animated. See
<https://gist.github.com/gre/1650294> for examples.

### infinte:_bool_

_default: false_

A boolean flag that determines whether the track should wrap to the
beginning/end when sliding beyond the slide index bounds.

### gutter:_string_

_default: 1em_

A css [length](https://developer.mozilla.org/en-US/docs/Web/CSS/length) string
that represents the space between each Slide in the Whirligig

### nextKeys:_array_

_default: ["ArrowRight"]_

An array of valid "Key" values from a
[KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values)
indicating what "Key" values, when pressed, should move the track forward.

### prevKeys:_array_

_default: ["ArrowLeft"]_

An array of valid "Key" values from a
[KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values)
indicating what "Key" values, when pressed, should move the track backward

### preventScroll:_bool_

_default: false_

A boolean flag that turns off/on the ability to natively scroll through the
Whirligig

### preventSwipe:_bool_

_default: false_

A boolean flag that turns off/on the ability to swipe through the Whirligig

### slideBy:_number_

_default: visibleSlides or 1_

The number of slides that should advance on a `next`, `prev`, or `swipe` action.
If not specified, will reflect the visibleSlides prop value or `1`.

### slideClass:_classnames_

_default: ''_

A class to apply to the Slide container.

### slideTo:_number_

_default: 0_

The index to which the track should transition if it is not already there. This
is distinct from `startAt` in that `startAt` is only effective when the
component mounts and does not transition, but moves immediately to the given
slide. The `slideTo` prop is meant to be used as a mechanism for the consuming
component to directly control when and where the track transitions to.

### snapToSlide:_bool_

_default: false_

A boolean flag that turns on/off the snap-to-slide feature. If set, the
Whirligig will animate the final bit of scrolling to stop at a slide.

### startAt:_number_

_default: 0_

The Slide index that will be the "active" slide when the Whirligig mounts. The value
will be normalized to be within the range of the length of the Whirligig's children.

### visibleSlides:_number_

_default: 1_

The number of slides that should be visible at a time for the Whirligig

## Instance methods

### next:_func_

Advances the track to the next set of visible slides. If there are not enough
remaining slides to transition the full number of visible slides, it will
transition to the end of the track. If already at the end of the track, calling
`next` will transition the track to index 0

### prev:_func_

Recedes the track to the previous set of visible slides. If there are not enough
remaining slides to transition the full number of visible slides, it will
transition to the beginning of the track. If already at the beginning of the
track, calling `prev` will transition the track to last full set of visible
slides in the track.

## Contributors

* Authored by @uniqname
* Thanks @RachelTheRiveter for the name!
* Maintained by @jane

## License

[MIT](https://github.com/jane/react-whirligig/blob/master/LICENSE)
