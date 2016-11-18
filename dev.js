import { PropTypes } from 'react'
import { render } from 'react-dom'
import Track from './src/track/index'
import { mySlide, track, slider } from './dev-style.css'

const { array } = PropTypes

const Slider = ({ children }) => {
  let onNext
  let onPrev
  const next = () => onNext()
  const prev = () => onPrev()

  return (
    <div className={slider}>
      <button onClick={prev}>{'<'}</button>
      <Track visibleSlides={3} className={track} startAt={4} infinite>{
        (_next, _prev) => {
          onNext = _next
          onPrev = _prev

          return children
        }
      }</Track>
      <button onClick={next}>{'>'}</button>
    </div>
  )
}

Slider.propTypes = {
  children: array
}

render((
  <Slider>
    <figure className={mySlide}>
      <img alt="Fill Murry" src="http://www.fillmurray.com/400/300" />
      <figcaption>Slide Index 0</figcaption>
    </figure>
    <figure className={mySlide}>
      <img alt="Fill Murry" src="http://www.fillmurray.com/400/400" />
      <figcaption>Slide Index 1</figcaption>
    </figure>
    <div className={mySlide}>
      <figure>
        <img alt="Fill Murry" src="http://www.fillmurray.com/300/200" />
      </figure>
      <figure>
        <img alt="Fill Murry" src="http://www.fillmurray.com/300/200" />
        <figcaption>Slide Index 2</figcaption>
      </figure>
    </div>
    <figure className={mySlide}>
      <img alt="Fill Murry" src="http://www.fillmurray.com/400/200" />
      <figcaption>Slide Index 3</figcaption>
    </figure>
    <figure className={mySlide}>
      <img alt="Fill Murry" src="http://www.fillmurray.com/200/400" />
      <figcaption>Slide Index 4</figcaption>
    </figure>
    <figure className={mySlide}>
      <img alt="Fill Murry" src="http://www.fillmurray.com/400/400" />
      <figcaption>Slide Index 5</figcaption>
    </figure>
  </Slider>
), document.querySelector('main'))
