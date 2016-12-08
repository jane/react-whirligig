import { PropTypes, Component } from 'react'
import { render } from 'react-dom'
import Track from './src/track/index'

const { array, func } = PropTypes

class Slider  extends Component {

  state = { slideIndex: 0, autoSlideIntervalID: 0 }

  autoSlide = () => {
    const id = setInterval(() => {
      console.log('sliding to index: ', this.state.slideIndex + 1)
      this.setState({ slideIndex: this.state.slideIndex + 1 })
    }, 2000)
    this.setState({ autoSlideIntervalID: id })
  }

  endAutoSlide = () => {
    clearInterval(this.state.autoSlideIntervalID)
    this.setState({ autoSlideIntervalID: 0 })
  }

  handelAutoSlideToggle = ({ target }) => {
    target.checked ? this.autoSlide() : this.endAutoSlide()
  }

  makeRef = (name) => (ref) => { this[name] = ref }

  render () {
    const { children } = this.props

    const next = () => this.track.next()
    const prev = () => this.track.prev()

    return (
      <div className="slider">
        <label className="autoslideToggler">
          <input type="checkbox" onChange={this.handelAutoSlideToggle} />
          <span>Autoslide</span>
        </label>
        <Track
          ref={this.makeRef('track')}
          visibleSlides={3}
          className="track"
          slideClass="slideClassName"
          slideTo={this.state.slideIndex}
          onSlideClick={() => { console.log('You clicked on a slide!') }}
          >{ children }</Track>
        <button className="prevButton" onClick={prev}>Let me see that beard again!</button>
        <button className="nextButton" onClick={next}>Let's see more beards!</button>
      </div>
    )
  }
}

Slider.propTypes = {
  children: array
}

const Slider2 = ({ children }) => {
  let track
  const setTrackRef = (ref) => { track = ref }
  const next = () => track.next()
  const prev = () => track.prev()

  return (
    <div className="slider">
      <Track
        ref={setTrackRef}
        visibleSlides={3}
        className="track"
        slideClass="slideClassName"
        onSlideClick={() => { console.log('You clicked on a slide!') }}
        >{ children }</Track>
      <button className="prevButton" onClick={prev}>Let me see that beard again!</button>
      <button className="nextButton" onClick={next}>Let's see more beards!</button>
    </div>
  )
}

Slider2.propTypes = {
  children: array
}

const slides = [{
  src: 'https://placebeard.it',
  height: 300,
  width: 300,
  joiner: 'x'
}, {
  src: 'https://placebeard.it',
  height: 300,
  width: 300,
  joiner: 'x'
}, {
  src: 'https://placebeard.it',
  height: 300,
  width: 300,
  joiner: 'x'
}, {
  src: 'https://placebeard.it',
  height: 300,
  width: 300,
  joiner: 'x'
}, {
  src: 'https://placebeard.it',
  height: 300,
  width: 300,
  joiner: 'x'
}, {
  src: 'https://placebeard.it',
  height: 300,
  width: 300,
  joiner: 'x'
}, {
  src: 'https://placebeard.it',
  height: 300,
  width: 300,
  joiner: 'x'
}, {
  text: <h1>
    <span className="line align-right">It</span>
    <span className="line align-right">need</span>
    <span className="line align-right">not</span>
    <span className="line align-right">only</span>
    <span className="line align-right">be</span>
    <span className="line align-right">beards!</span>
  </h1>
}, {
  src: 'http://fillmurray.com',
  height: 300,
  width: 300,
  joiner: '/'
}, {
  text: <h1>
    <span className="line align-left">It</span>
    <span className="line align-left">can</span>
    <span className="line align-left">be</span>
    <span className="line align-left">anything</span>
    <span className="line align-left">you</span>
    <span className="line align-left">want!</span>
  </h1>
}, {
  text: <h2>Featuring:</h2>
}, {
  text: <p>A native scrolling "track"</p>
}, {
  text: <p>snap-to-slide option</p>
}, {
  text: <p>set the number of slide visible at a time</p>
}, {
  text: <p>start at any slide you want</p>
}, {
  text: <p>slide indecies are normalized to stay within the slide count range</p>
}]

render((
  <div>
    <header className="header">
      <h1>react-track</h1>
      <p>A carousel-like component for react</p>
    </header>
    <Slider2>
      {slides.map(({ src, height, width, joiner, text }, i) => (
        <figure className="mySlide" key={`${src}-${i}`}>
          {src && <img alt="Place Zombie" src={`${src}/${width}${joiner}${height}?${i}`} />}
          {src && <figcaption>Slide Index {i}</figcaption>}
          {text && <div className="text">{text}</div>}
        </figure>
      ))}
    </Slider2>
  </div>
), document.querySelector('main'))
