# react-track
A react carousel/slider like component for sequentially displaying slides or sets of slides

## Usage
```

const Slider = (props) => {

  let onNext, onPrev
  const next = () => onNext()
  const prev = () => onPrev()

  return (
    <div>
      <button onClick={prev}>Prev</button>
      
      // Track accepts on child which is a function.
      // This function will be passed a `next` function
      // and a `previous` function for controlling the track.
      // the function should return the items that will be
      // the content of each slide respectively.
      <Track visibleSlides={3} gutter="1em">{
       (_next, _previous) => {
        onNext = _next
        onPrev = _previous

        return [
          <img src="http://www.fillmurray.com/400/300" />,
          <img src="http://www.fillmurray.com/300/400" />,
          <img src="http://www.fillmurray.com/400/200" />,
          <img src="http://www.fillmurray.com/200/400" />,
          <img src="http://www.fillmurray.com/500/300" />
        ]
       }
      }</Track>
      <button onClick={next}>Next</button>
    </div>
  )
}
```

##Track
The Track component is a horizontally oriented container of Slides.

##Props

### afterSlide:_func_
_deafult: noop_
A function to be called after the track transitions to a new "active" slide. The function is passed the new "active" slide index.

### children:_func_
_deafult: none_
A function expected to return the React elements that will be the content of the Track component (Each "child" will be wrapped in a Slide component). The `children` function is passed two arguments; a `next` function and a `previous` function. These functions will respectively advance and recede the Track. These functions typically will be used as `onClick` values on buttons that control the Track.

### className:_classnames_
A `classnames` compliant value the will be applied as the class attribute

### gutter:_string_
_deafult: 1em_
A css [length](https://developer.mozilla.org/en-US/docs/Web/CSS/length) string that represents the space between each Slide in the Track.

### preventScroll:_bool_
_deafult: false_
A boolean flag that turns off the ability to natively scroll through the Track

### slideClass:_classnames_
_deafult: ''_
A class to apply to the Slide container

### preventSnapping:_bool_
_deafult: false_
A boolean flag that turns off the snap-to-slide feature. If set, the Track will not animate scrolling to stop at a slide

### startAt:_number_
_deafult: 0_
The Slide index that will be the "active" slide when the Track mounts. The value will be normalized to be within the range of the length of the Track's children

### visibleSlides:_number_
_deafult: 1_
The number of slides that should be visible at a time for the Track.
