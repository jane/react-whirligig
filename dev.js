import { PropTypes, Component } from 'react'
import { render } from 'react-dom'
import Track from './src/track/index'

const { array, number, string, func, any } = PropTypes

const Control = ({ label, type, name, onChange, value }) => (
  <label className="option">
    <span className="label">{label}</span>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
    />
  </label>
)
Control.propTypes = {
  label: string,
  type: string,
  name: string,
  onChange: func,
  value: any
}

class Slider extends Component {
  static propTypes = {
    children: array,
    visibleSlides: number,
    slideBy: number
  }
  constructor (props) {
    super(props)
    this.state = {
      mount: true,
      visibleSlides: this.props.visibleSlides || 3,
      slideBy: this.props.slideBy
    }
  }

  setRef = (name) => (ref) => { this[name] = ref }
  setStateFromInput = (propName) => ({ target }) => {
    const { checked, value, type } = target
    const isCheckable = (type) => ['checkbox', 'radio'].includes(type)
    const coerceValueToType = ({ type, vlaue }) => type === 'number' ? Number(value) : value
    this.setState({
      [propName]: isCheckable(type) ? checked : coerceValueToType(target)
    })
  }

  Control = ({ label, type, name }) => (
    <label className="option">
      <span className="label">{label}</span>
      <input
        type={type}
        name={name}
        id={name}
        value={this.state[name]}
        onChange={this.setStateFromInput(name)}
      />
    </label>
  )

  render () {
    const { children } = this.props
    const {
      animationDuration = 300, infinte, gutter = '1em', preventScroll,
      preventSnapping, slideBy, startAt = 4, slideTo, mount } = this.state
    const next = () => this.track.next().catch(() => {})
    const prev = () => this.track.prev().catch(() => {})

    return (
      <div>
        <div className="options">
          <this.Control label="un/mount Track" type="checkbox" name="mount" />
          <this.Control label="animationDuration" type="number" name="animationDuration" />
          <this.Control label="gutter" type="text" name="gutter" />
          <this.Control label="infinte" type="checkbox" name="infinte" />
          <this.Control label="preventScroll" type="checkbox" name="preventScroll" />
          <this.Control label="preventSnapping" type="checkbox" name="preventSnapping" />
          <this.Control label="slideBy" type="number" name="slideBy" />
          <this.Control label="slideTo" type="number" name="slideTo" />
          <this.Control label="visibleSlides" type="number" name="visibleSlides" />
        </div>
        { mount
        ? <div className="slider">
          <Track
            animationDuration={animationDuration}
            className="track"
            easing={(t) => t}
            infinite={infinte}
            gutter={gutter}
            onSlideClick={() => { console.log('You clicked on a slide!') }}
            preventScroll={preventScroll}
            preventSnapping={preventSnapping}
            ref={this.setRef('track')}
            slideBy={slideBy}
            slideClass="slideClassName"
            slideTo={slideTo}
            startAt={startAt}
            visibleSlides={this.state.visibleSlides}
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
