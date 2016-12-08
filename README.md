# react-track
A react carousel/slider like component for sequentially displaying slides or sets of slides.

## Basic Usage

```jsx
const Slider = ({slideIndex}) => (
  <div>
    <h1>Say hello to my little Slider</h1>
    <Track visibleSlides={3} gutter='1em' slideTo={slideIndex}>
      <img src="http://www.fillmurray.com/400/300" />,
      <img src="http://www.fillmurray.com/300/400" />,
      <img src="http://www.fillmurray.com/400/200" />,
      <img src="http://www.fillmurray.com/200/400" />,
      <img src="http://www.fillmurray.com/500/300" />
    }</Track>
  </div>
)
```

## Advanced Usage

react-track exposes next and prev functions for moving the track forward and backward the number of visible slides.
These functions can be accessed using the `ref` prop callback to get a reference to the `Track` instance.

```jsx
const Slider = () => {
  let track
  const next = () => track.next()
  const prev = () => track.prev()

  return (
    <div>
      <button onClick={prev}>Prev</button>
      <Track visibleSlides={3} gutter="1em" ref={(_trackInstance) => { track = _trackInstance}}>
        <img src="http://www.fillmurray.com/400/300" />,
        <img src="http://www.fillmurray.com/300/400" />,
        <img src="http://www.fillmurray.com/400/200" />,
        <img src="http://www.fillmurray.com/200/400" />,
        <img src="http://www.fillmurray.com/500/300" />
      }</Track>
      <button onClick={next}>Next</button>
    </div>
  )
}

```

## Track
The Track component is a horizontally oriented container of Slides.

## Props

### afterSlide:_func_
_default: noop_
A function to be called after the track transitions to a new "active" slide. The function is passed the new "active" slide index.

### className:_classnames_
A `classnames` compliant value (string or array of string|array|object) that will be applied as the class attribute.

### gutter:_string_
_default: 1em_
A css [length](https://developer.mozilla.org/en-US/docs/Web/CSS/length) string that represents the space between each Slide in the Track.

### preventScroll:_bool_
_default: false_
A boolean flag that turns off the ability to natively scroll through the Track.

### slideClass:_classnames_
_default: ''_
A class to apply to the Slide container.

### preventSnapping:_bool_
_default: false_
A boolean flag that turns off the snap-to-slide feature. If set, the Track will not animate scrolling to stop at a slide.

### startAt:_number_
_default: 0_
The Slide index that will be the "active" slide when the Track mounts. The value will be normalized to be within the range of the length of the Track's children.

### visibleSlides:_number_
_default: 1_
The number of slides that should be visible at a time for the Track.
