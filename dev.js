import { PropTypes, Component } from 'react'
import { render } from 'react-dom'
import Track from './src/track/index'

const { array, number } = PropTypes

class Slider extends Component {
  static propTypes = {
    children: array,
    visibleSlides: number,
    slideBy: number
  }
  constructor (props) {
    super(props)
    this.state = {
      toggle: true,
      visibleSlides: this.props.visibleSlides || 3,
      slideBy: this.props.slideBy
    }
  }

  render () {
    const { children } = this.props
    const { toggle } = this.state
    const setTrackRef = (name) => (ref) => { this[name] = ref }
    const next = () => this.track.next()
    const prev = () => this.track.prev()

    return (
      <div>
        <div className="options">
          <label className="option">
            <span className="label">un/mount Tack</span>
            <input
              type="checkbox"
              defaultChecked
              onClick={({ target: t }) => { this.setState({ toggle: t.checked }) }}
            />
          </label>

          <label className="option">
            <span className="label">visible slides</span>
            <input
              type="number"
              name="visibleSlides"
              value={this.state.visibleSlides}
              onChange={({ target: t }) => { this.setState({ visibleSlides: Number(t.value) }) }}
            />
          </label>

          <label className="option">
            <span className="label">slide by</span>
            <input
              type="number"
              name="slideBy"
              id="slideBy"
              value={this.state.slideBy}
              onChange={({ target: t }) => { this.setState({ slideBy: Number(t.value) }) }}
            />
          </label>
        </div>
        { toggle
        ? <div className="slider">
          <Track
            ref={setTrackRef}
            visibleSlides={this.state.visibleSlides}
            className="track"
            slideClass="slideClassName"
            startAt={4}
            onSlideClick={() => { console.log('You clicked on a slide!') }}
            slideBy={this.state.slideBy}
            animationDuration={1000}
            easing={(t) => t}
            >{ children }</Track>
          <div className="controls">
            <button className="prevButton" onClick={prev}>Let me see that beard again!</button>
            <button className="nextButton" onClick={next}>I wanna see more beards!</button>
          </div>
        </div>
        : null }
      </div>
    )
  }
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
    <Slider>
      {slides.map(({ src, height, width, joiner, text }, i) => (
        <figure className="mySlide" key={`${src}-${i}`}>
          {src && <img alt="Place Zombie" src={`${src}/${width}${joiner}${height}?${i}`} />}
          {src && <figcaption>Slide Index {i}</figcaption>}
          {text && <div className="text">{text}</div>}
        </figure>
      ))}
    </Slider>
  </div>
), document.querySelector('main'))
