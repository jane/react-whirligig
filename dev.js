/* eslint-disable react/jsx-no-bind, no-console */

import * as React from 'react'
import { render } from 'react-dom'
import { includes, noop } from './src/utils'
import W from './src/whirligig'
import { array, bool, number, string, func } from 'prop-types'
import marked from 'marked'

const isCheckable = (type) => includes(type, ['checkbox', 'radio'])
const coerceTable = {
  number: Number,
  // eslint-disable-next-line no-new-func
  func: (fn) => new Function(fn)(),
  checkbox: Boolean,
  radio: Boolean,
}
const coerceValueToType = ({ type, value }) => {
  const coercer = type in coerceTable ? coerceTable[type] : (ident) => ident
  return coercer(value)
}

class Slider extends React.Component {
  static propTypes = {
    afterSlide: func,
    animationDuration: number,
    beforeSlide: func,
    children: array,
    className: string,
    easing: func,
    gutter: string,
    infinite: bool,
    onSlideClick: func,
    preventScroll: bool,
    slideBy: number,
    slideClass: string,
    slideTo: number,
    snapPositionOffset: number,
    snapToSlide: bool,
    startAt: number,
    visibleSlides: number,
  }

  static defaultProps = {
    afterSlide: (newIndex) => console.log(`slid to index ${newIndex}`),
    animationDuration: 300,
    beforeSlide: (newIndex) =>
      console.log(`about to slide to index ${newIndex}`),
    className: 'whirligig',
    gutter: '1em',
    onSlideClick: () => {
      console.log('You clicked on a slide!')
    },
    easing: (t) => t,
    infinite: false,
    preventScroll: false,
    slideClass: 'slideClassName',
    slideBy: 0,
    slideTo: 0,
    snapPositionOffset: 0,
    snapToSlide: false,
    startAt: 0,
    visibleSlides: 0,
  }

  state = {
    afterSlide: this.props.afterSlide,
    animationDuration: this.props.animationDuration,
    beforeSlide: this.props.beforeSlide,
    className: this.props.className,
    easing: this.props.easing,
    gutter: this.props.gutter,
    infinite: this.props.infinite,
    onSlideClick: this.props.onSlideClick,
    preventScroll: this.props.preventScroll,
    slideBy: this.props.slideBy,
    slideClass: this.props.slideClass,
    slideTo: this.props.slideTo,
    snapPositionOffset: this.props.snapPositionOffset,
    snapToSlide: this.props.snapToSlide,
    startAt: this.props.startAt,
    visibleSlides: this.props.visibleSlides,
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
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
      slideBy: nextProps.slideBy,
      slideClass: nextProps.slideClass,
      slideTo: nextProps.slideTo,
      snapPositionOffset: nextProps.snapPositionOffset,
      snapToSlide: nextProps.snapToSlide,
      startAt: nextProps.startAt,
      visibleSlides: nextProps.visibleSlides,
    })
  }

  componentDidMount() {
    try {
      const persistedState = window.localStorage.getItem('react-whirligig')
      if (persistedState) {
        const state = JSON.parse(persistedState)
        this.setState(state)
      }
    } catch {}
  }

  componentDidUpdate() {
    window.localStorage.setItem('react-whirligig', JSON.stringify(this.state))
  }

  handleAfterSlide = (currentSlide) => {
    this.setState({ currentSlide })
  }

  setRef = (name) => (ref) => {
    this[name] = ref
  }

  setStateFromInput = (propName) => ({ target }) => {
    const { checked, type } = target
    this.setState({
      [propName]: isCheckable(type) ? checked : coerceValueToType(target),
    })
  }

  Control = ({ label, type, name }) => (
    <label htmlFor={name} className="option">
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

  render() {
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
      slideBy,
      slideClass,
      slideTo,
      snapPositionOffset,
      snapToSlide,
      startAt,
      visibleSlides,
    } = this.state
    const next = () => this.whirligig.next().catch(noop)
    const prev = () => this.whirligig.prev().catch(noop)
    const after = (idx) => this.handleAfterSlide(idx)
    return (
      <div>
        <div className="slider">
          <W
            afterSlide={after}
            animationDuration={animationDuration}
            beforeSlide={beforeSlide}
            className={className}
            easing={easing}
            gutter={gutter}
            infinite={infinite}
            onSlideClick={onSlideClick}
            preventScroll={preventScroll}
            ref={this.setRef('whirligig')}
            slideBy={slideBy}
            slideClass={slideClass}
            slideTo={slideTo}
            snapPositionOffset={snapPositionOffset}
            snapToSlide={snapToSlide}
            startAt={startAt}
            visibleSlides={visibleSlides}
          >
            {children}
          </W>
          <div className="controls">
            <button className="prevButton" onClick={prev} />
            <button className="nextButton" onClick={next} />
          </div>
        </div>
        <div className="options">
          <span className="option currentSlide">
            Current slide is {this.state.currentSlide}
          </span>
          <this.Control label="afterSlide" type="func" name="afterSlide" />
          <this.Control
            label="animationDuration"
            type="number"
            name="animationDuration"
          />
          <this.Control label="beforeSlide" type="func" name="beforeSlide" />
          <this.Control label="className" type="text" name="className" />
          <this.Control label="easing" type="func" name="easing" />
          <this.Control label="infinite" type="checkbox" name="infinite" />
          <this.Control label="gutter" type="text" name="gutter" />
          <this.Control label="onSlideClick" type="func" name="onSlideClick" />
          <this.Control
            label="preventScroll"
            type="checkbox"
            name="preventScroll"
          />
          <this.Control
            label="snapToSlide"
            type="checkbox"
            name="snapToSlide"
          />
          <this.Control label="slideBy" type="number" name="slideBy" />
          <this.Control label="slideClass" type="text" name="slideClass" />
          <this.Control label="slideTo" type="number" name="slideTo" />
          <this.Control label="startAt" type="number" name="startAt" />
          <this.Control
            label="snapPositionOffset"
            type="number"
            name="snapPositionOffset"
          />
          <this.Control
            label="visibleSlides"
            type="number"
            name="visibleSlides"
          />
        </div>
      </div>
    )
  }
}

const slides = [
  ...new Array(7).fill().map(() => ({
    src: 'https://placebeard.it',
    height: 300,
    width: 300,
    joiner: 'x',
  })),
  {
    text: (
      <h3>
        {['it', 'need', 'not', 'only', 'be', 'beards!'].map((t) => (
          <span key={t} className="line align-right">
            {t}
          </span>
        ))}
      </h3>
    ),
  },
  {
    src: 'https://fillmurray.com',
    height: 300,
    width: 300,
    joiner: '/',
  },
  {
    text: (
      <h3>
        {['it', 'can', 'be', 'anything', 'you', 'want!'].map((t) => (
          <span key={t} className="line align-left">
            {t}
          </span>
        ))}
      </h3>
    ),
  },
  { text: <h3>Featuring:</h3> },
  { text: <p>A native scrolling "whirligig"</p> },
  { text: <p>snap-to-slide option</p> },
  { text: <p>set the number of slide visible at a time</p> },
  { text: <p>start at any slide you want</p> },
  {
    text: (
      <p>slide indecies are normalized to stay within the slide count range</p>
    ),
  },
]

class Demo extends React.Component {
  state = { docs: '' }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    window
      .fetch(
        'https://raw.githubusercontent.com/jane/react-whirligig/master/README.md'
      )
      .then((a) => a.text())
      .then((t) => {
        this.setState({ docs: marked(t) })
      })
      .catch(console.error)
  }

  render() {
    return (
      <div className="wrapper">
        <div
          dangerouslySetInnerHTML={{ __html: this.state.docs }}
          className="md"
        />
        <Slider>
          {slides.map(({ src, height, width, joiner, text }, i) => (
            <figure className="mySlide" key={`${src}-${i}`}>
              <figcaption className="caption">Slide index {i}</figcaption>
              {src && (
                <img
                  alt="Place Zombie"
                  src={`${src}/${width}${joiner}${height}?${i}`}
                />
              )}
              {text && <div className="text">{text}</div>}
            </figure>
          ))}
        </Slider>
      </div>
    )
  }
}

render(<Demo />, document.getElementById('root'))
