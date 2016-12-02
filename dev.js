import { PropTypes } from 'react'
import { render } from 'react-dom'
import Track from './src/track/index'

const { array } = PropTypes

const Slider = ({ children }) => {
  let onNext
  let onPrev
  const next = () => onNext()
  const prev = () => onPrev()

  return (
    <div className="slider">
      <button onClick={prev}>{'<'}</button>
      <Track visibleSlides={3} className="track" slideClass="slideClassName" onSlideClick={() => { console.log('You clicked on a slide!') }} >{
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

const slides = [{
  src: 'https://placezombie.com',
  height: 300,
  width: 300
}, {
  src: 'https://placezombie.com',
  height: 300,
  width: 300
}, {
  src: 'https://placezombie.com',
  height: 300,
  width: 300
}, {
  src: 'https://placezombie.com',
  height: 300,
  width: 300
}, {
  src: 'https://placezombie.com',
  height: 300,
  width: 300
}, {
  src: 'https://placezombie.com',
  height: 300,
  width: 300
}, {
  src: 'https://placezombie.com',
  height: 300,
  width: 300
}]

render((
  <Slider>
    {slides.map(({ src, height, width }, i) => (
      <figure className="mySlide" key={`${src}-${i}`}>
        <img alt="Place Zombie" src={`${src}/${width}x${height}?${i}`} />
        <figcaption>Slide Index {i}</figcaption>
      </figure>
    ))}
  </Slider>
), document.querySelector('main'))
