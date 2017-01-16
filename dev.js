import { PropTypes, Component } from 'react'
import { render } from 'react-dom'
import Track from './src/track/index'

const { array, bool, number, string, func, any } = PropTypes

const isCheckable = (type) => ['checkbox', 'radio'].includes(type)
const coerceTable = {
  number: Number,
  func: (fn) => Function(fn)(), // eslint-disable-line
  checkbox: Boolean,
  radio: Boolean
}

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
    afterSlide: func,
    animationDuration: number,
    beforeSlide: func,
    className: string,
    easing: func,
    infinite: bool,
    gutter: string,
    onSlideClick: func,
    preventScroll: bool,
    snapToSlide: bool,
    slideBy: number,
    slideClass: string,
    slideTo: number,
    startAt: number,
    visibleSlides: number
  }

  static defaultProps = {
    afterSlide: (newIndex) => console.log(`slid to index ${newIndex}`),
    animationDuration: 300,
    beforeSlide: (newIndex) => console.log(`about to slide to index ${newIndex}`),
    className: 'track',
    onSlideClick: () => { console.log('You clicked on a slide!') },
    easing: (t) => t,
    slideClass: 'slideClassName'
  }
  constructor (props) {
    super(props)
    console.log(props)
    this.state = {
      afterSlide: props.afterSlide,
      animationDuration: props.animationDuration,
      beforeSlide: props.beforeSlide,
      className: props.className,
      easing: props.easing,
      infinite: props.infinite,
      gutter: props.gutter,
      onSlideClick: props.onSlideClick,
      preventScroll: props.preventScroll,
      snapToSlide: props.snapToSlide,
      slideBy: props.slideBy,
      slideClass: props.slideClass,
      slideTo: props.slideTo,
      startAt: props.startAt,
      visibleSlides: props.visibleSlides,
      mount: true
    }
  }

  setRef = (name) => (ref) => { this[name] = ref }
  setStateFromInput = (propName) => ({ target }) => {
    const { checked, value, type } = target
    const coerceValueToType = ({ type, vlaue }) => {
      const coercer = type in coerceTable ? coerceTable[type] : (ident) => ident
      coercer(value)
    }
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
        checked={isCheckable(type) && this.state[name]}
        value={isCheckable(type) ? name : this.state[name]}
        onChange={this.setStateFromInput(name)}
      />
    </label>
  )

  render () {
    const { children } = this.props
    const {
      afterSlide,
      animationDuration,
      beforeSlide,
      className,
      easing,
      infinite,
      gutter,
      onSlideClick,
      preventScroll,
      snapToSlide,
      slideBy,
      slideClass,
      slideTo,
      startAt,
      visibleSlides,
      mount
    } = this.state
    const next = () => this.track.next().catch(() => {})
    const prev = () => this.track.prev().catch(() => {})
    return (
      <div>
        <div className="options">
          <this.Control label="un/mount Track" type="checkbox" name="mount" />
          <this.Control label="afterSlide" type="func" name="afterSlide" />
          <this.Control label="animationDuration" type="number" name="animationDuration" />
          <this.Control label="beforeSlide" type="func" name="beforeSlide" />
          <this.Control label="className" type="text" name="className" />
          <this.Control label="easing" type="func" name="easing" />
          <this.Control label="infinite" type="checkbox" name="infinite" />
          <this.Control label="gutter" type="text" name="gutter" />
          <this.Control label="onSlideClick" type="func" name="onSlideClick" />
          <this.Control label="preventScroll" type="checkbox" name="preventScroll" />
          <this.Control label="snapToSlide" type="checkbox" name="snapToSlide" />
          <this.Control label="slideBy" type="number" name="slideBy" />
          <this.Control label="slideClass" type="text" name="slideClass" />
          <this.Control label="slideTo" type="number" name="slideTo" />
          <this.Control label="startAt" type="number" name="startAt" />
          <this.Control label="visibleSlides" type="number" name="visibleSlides" />
          <this.Control label="gutter" type="text" name="gutter" />
          <this.Control label="infinte" type="checkbox" name="infinte" />
          <this.Control label="preventScroll" type="checkbox" name="preventScroll" />
          <this.Control label="snapToSlide" type="checkbox" name="snapToSlide" />
          <this.Control label="slideBy" type="number" name="slideBy" />
          <this.Control label="slideTo" type="number" name="slideTo" />
          <this.Control label="startAt" type="number" name="startAt" />
          <this.Control label="visibleSlides" type="number" name="visibleSlides" />
        </div>
        { mount
        ? <div className="slider">
          <Track
            afterSlide={afterSlide}
            animationDuration={animationDuration}
            beforeSlide={beforeSlide}
            className={className}
            easing={easing}
            infinite={infinite}
            gutter={gutter}
            onSlideClick={onSlideClick}
            preventScroll={preventScroll}
            snapToSlide={snapToSlide}
            ref={this.setRef('track')}
            slideBy={slideBy}
            slideClass={slideClass}
            slideTo={slideTo}
            startAt={startAt}
            visibleSlides={visibleSlides}
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
