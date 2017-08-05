import React, { Component } from 'react'
import { render } from 'react-dom'
import { includes } from './src/utils'
import Track from './src/track'
import { array, bool, number, string, func, any } from 'prop-types'
import marked from 'marked'

const isCheckable = (type) => includes(type, ['checkbox', 'radio'])
const coerceTable = {
  number: Number,
  func: (fn) => Function(fn)(), // eslint-disable-line
  checkbox: Boolean,
  radio: Boolean
}
const coerceValueToType = ({ type, value }) => {
  const coercer = type in coerceTable ? coerceTable[type] : (ident) => ident
  return coercer(value)
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
    afterSlide: func,
    animationDuration: number,
    beforeSlide: func,
    children: array,
    className: string,
    easing: func,
    gutter: string,
    infinite: bool,
    mount: bool,
    onSlideClick: func,
    preventScroll: bool,
    slideBy: number,
    slideClass: string,
    slideTo: number,
    snapToSlide: bool,
    startAt: number,
    visibleSlides: number
  }

  static defaultProps = {
    afterSlide: (newIndex) => console.log(`slid to index ${newIndex}`),
    animationDuration: 300,
    beforeSlide: (newIndex) => console.log(`about to slide to index ${newIndex}`),
    className: 'track',
    gutter: '1em',
    onSlideClick: () => { console.log('You clicked on a slide!') },
    easing: (t) => t,
    infinite: false,
    preventScroll: false,
    slideClass: 'slideClassName',
    slideBy: 0,
    slideTo: 0,
    snapToSlide: false,
    startAt: 0,
    visibleSlides: 0
  }
  constructor (props) {
    super(props)
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

  componentWillReceiveProps (nextProps) {
    this.setState({
      afterSlide: nextProps.afterSlide,
      animationDuration: nextProps.animationDuration,
      beforeSlide: nextProps.beforeSlide,
      className: nextProps.className,
      easing: nextProps.easing,
      infinite: nextProps.infinite,
      gutter: nextProps.gutter,
      onSlideClick: nextProps.onSlideClick,
      preventScroll: nextProps.preventScroll,
      snapToSlide: nextProps.snapToSlide,
      slideBy: nextProps.slideBy,
      slideClass: nextProps.slideClass,
      slideTo: nextProps.slideTo,
      startAt: nextProps.startAt,
      visibleSlides: nextProps.visibleSlides,
      mount: nextProps.mount
    })
  }

  componentDidMount () {
    const persistedState = window.localStorage.getItem('react-track')

    if (persistedState) {
      try {
        const state = JSON.parse(persistedState)
        this.setState(state)
      } catch (e) {}
    }
  }

  componentDidUpdate () {
    window.localStorage.setItem('react-track', JSON.stringify(this.state))
  }

  handleAfterSlide = (currentSlide) => { this.setState({ currentSlide }) }

  setRef = (name) => (ref) => { this[name] = ref }

  setStateFromInput = (propName) => ({ target }) => {
    const { checked, type } = target
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
    const after = (idx) => this.handleAfterSlide(idx)
    return (
      <div>
        <h3 className="currentSlide">Current Slide is {this.state.currentSlide}</h3>
        {mount &&
          <div className="slider">
            <Track
              afterSlide={after}
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
              slideToCenter
              startAt={startAt}
              visibleSlides={visibleSlides}
            >
              {children}
            </Track>
            <div className="controls">
              <button className="prevButton" onClick={prev}>Let me see that beard again!</button>
              <button className="nextButton" onClick={next}>I wanna see more beards!</button>
            </div>
          </div>
        }
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
        </div>
      </div>
    )
  }
}

const slides = [
  ...Array(7).fill().map(() => ({
    src: 'https://placebeard.it',
    height: 300,
    width: 300,
    joiner: 'x'
  })),
  {
    text: <h3>
      <span className="line align-right">It</span>
      <span className="line align-right">need</span>
      <span className="line align-right">not</span>
      <span className="line align-right">only</span>
      <span className="line align-right">be</span>
      <span className="line align-right">beards!</span>
    </h3>
  }, {
    src: 'http://fillmurray.com',
    height: 300,
    width: 300,
    joiner: '/'
  }, {
    text: <h3>
      <span className="line align-left">It</span>
      <span className="line align-left">can</span>
      <span className="line align-left">be</span>
      <span className="line align-left">anything</span>
      <span className="line align-left">you</span>
      <span className="line align-left">want!</span>
    </h3>
  },
  { text: <h3>Featuring:</h3> },
  { text: <p>A native scrolling "track"</p> },
  { text: <p>snap-to-slide option</p> },
  { text: <p>set the number of slide visible at a time</p> },
  { text: <p>start at any slide you want</p> },
  { text: <p>slide indecies are normalized to stay within the slide count range</p> }
]

class Demo extends Component {
  state = { docs: '' }

  componentDidMount () {
    window.fetch('https://raw.githubusercontent.com/jane/react-track/master/README.md')
      .then((a) => a.text())
      .then((t) => {
        this.setState({ docs: marked(t) })
      })
      .catch(console.error)
  }

  render () {
    return (
      <div className="wrapper">
        <header><h1>React Track</h1></header>
        <div dangerouslySetInnerHTML={{ __html: this.state.docs }} className="md" />
        <Slider>
          {slides.map(({ src, height, width, joiner, text }, i) => (
            <figure className="mySlide" key={`${src}-${i}`}>
              <figcaption className="caption">Slide index {i}</figcaption>
              {src && <img alt="Place Zombie" src={`${src}/${width}${joiner}${height}?${i}`} />}
              {text && <div className="text">{text}</div>}
            </figure>
          ))}
        </Slider>
      </div>
    )
  }
}

render(<Demo />, document.querySelector('main'))
