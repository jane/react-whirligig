import React, { Component, Children, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import cn from 'classnames'
import Slide from '../slide'
import { track, nextButton, prevButton, preventScrolling } from './styles.css'
import { easeInQuint } from '../easing'

const { bool, number, string, func, array, oneOfType, oneOf, object } = PropTypes

const compose = (...fns) => (val) => fns.reduceRight((currVal, fn) => fn(currVal), val)
const min = (...vals) => (val) => Math.min(...vals, val)
const max = (...vals) => (val) => Math.max(...vals, val)
const on = (evt, opts = false) => (cb) => (el) => el.addEventListener(evt, cb, opts)
const onWindowScroll = (cb) => on('scroll', true)(cb)(window)
const onScroll = (cb, { target = window } = {}) =>
  onWindowScroll((e) => (target === window || target === e.target) && cb(e))

const onScrollEnd = (cb, { wait = 200, target = window } = {}) => ((timeoutID) => onScroll((evt) => {
  clearTimeout(timeoutID)
  timeoutID = setTimeout(() => evt.target === target ? cb() : undefined, wait)
}))(0)

const onScrollStart = (cb, { target = window } = {}) => {
  let started = false
  onScrollEnd(() => (started = false), { target })
  onScroll((e) => {
    if (!started) {
      started = true
      cb(e)
    }
  }, { target })
}

const trackTouchesForElement = (el) => {
  let touchIds = []
  on('touchstart')(({ changedTouches }) => {
    const changedIds = [].slice.call(changedTouches).map(({ identifier }) => identifier)
    touchIds = [...touchIds, ...changedIds]
  })(el)

  on('touchend')(({ changedTouches }) => {
    const changedIds = [].slice.call(changedTouches).map(({ identifier }) => identifier)
    touchIds = touchIds.filter((touchId) => !changedIds.includes(touchId))
  })(el)

  return () => touchIds.length
}

export default class Track extends Component {
  static propTypes = {
    afterSlide: func,
    children: func,
    className: oneOfType([array, string, object]),
    gutter: string,
    preventScroll: bool,
    slideClass: oneOfType([array, string, object]),
    preventSnapping: bool,
    startAt: number,
    visibleSlides: number
  }

  static defaultProps = {
    afterSlide: () => {},
    gutter: '1em',
    preventScroll: false,
    startAt: 0,
    visibleSlides: 1
  }

  state = { activeIndex: 0 };

  constructor (props) {
    super(props)

    // We can't do arrow function properties for these since
    // we are passing them to the consuming component and we
    // require the proper context
    this.next = this.next.bind(this)
    this.prev = this.prev.bind(this)
    this.slideTo = this.slideTo.bind(this)
  }

  componentDidMount () {
    this.DOMNode = findDOMNode(this.track)

    // This is not a part of component state since we don't want
    // incure the overhead of calling setState. It is state only
    // the onScrollEnd callback cares about and is not important
    // to the rendering of the component.
    let isAnimating = false
    let isScrolling = false
    const getOngoingTouchCount = trackTouchesForElement(this.DOMNode)
    const shouldSelfCorrect = () =>
      !this.props.preventSnapping && !isAnimating && !isScrolling && !getOngoingTouchCount()
    onScrollStart(() => { isScrolling = true })
    onScrollEnd(() => {
      isScrolling = false
      isAnimating = false
      if (shouldSelfCorrect()) {
        isAnimating = true
        this.slideTo(this.getNearestSlideIndex())
      }
    }, { target: this.DOMNode })

    on('touchend')(() => {
      if (shouldSelfCorrect()) {
        isAnimating = true
        this.slideTo(this.getNearestSlideIndex())
      }
    })(this.track)

    this.slideTo(this.props.startAt)
  }

  handleKeyUp = ((nextKeys, prevKeys) => ({ key }) => {
    const isNext = nextKeys.includes(key)
    const isPrev = prevKeys.includes(key)

    if (isNext) this.next()
    if (isPrev) this.prev()
  })(['ArrowRight'], ['ArrowLeft']);

  // We don't want to update if only state changed.
  // Sate is not important to the rendering of this component
  shouldComponentUpdate (nextProps) {
    const propValues = Object.values(this.props)
    const nextPropValues = Object.values(nextProps)
    return !nextPropValues.every((val, i) => val === propValues[i])
  }

  next () {
    this.slideTo(this.state.activeIndex + this.props.visibleSlides)
  }
  prev () {
    this.slideTo(this.state.activeIndex - this.props.visibleSlides)
  }

  slideTo (index) {
    const { afterSlide } = this.props
    const { children, scrollLeft } = this.track
    const slideIndex = compose(max(0), min(index))(children.length - 1)
    const delta = children[slideIndex].offsetLeft - scrollLeft
    this.animate(this.track, 'scrollLeft', delta).then(() => {
      this.setState({ activeIndex: index })
      afterSlide(index)
    })
  }

  animate = (el, prop, delta, duration = 500, easing = easeInQuint) => new Promise((res, rej) => {
    const initialVal = el[prop]
    const overFlowStyle = el.style.overflow
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progressTime = timestamp - startTime
      const progressRatio = easing(progressTime / duration)
      el[prop] = initialVal + (delta * progressRatio)
      if (progressTime < duration) {
        window.requestAnimationFrame(step)
      } else {
        el[prop] = initialVal + delta // paranoia check. jump to the end when animation time is complete.

        // Give scroll control back to the user once animation is done.
        el.style.overflow = overFlowStyle
        res()
      }
    }
    // We are going to temporarily prevent the user from being able to scroll during the animation.
    // This will prevent a janky fight between user scroll and animation which is just bad user experience.
    el.style.overflow = 'hidden'
    window.requestAnimationFrame(step)
  });

  getNearestSlideIndex = () => {
    const { children, scrollLeft } = this.track
    const offsets = [].slice.call(children).map(({ offsetLeft }) => Math.abs(offsetLeft - scrollLeft))
    return offsets.indexOf(Math.min(...offsets))
  };

  setRef = (name) => (ref) => {
    this[name] = ref
  }

  render () {
    const {
      children,
      className,
      gutter,
      preventScroll,
      slideClass,
      visibleSlides
    } = this.props

    return (
      <div
        className={cn(className, track, { [preventScrolling]: preventScroll })}
        ref={this.setRef('track')}
        tabIndex="0"
        onKeyUp={this.handleKeyUp}
      >
        {
          // We first pass the slide control functions to the function child.
          // this will return the `children` that will be the content of the individaul slides.
          // Then we wrap the slide content in a slide component to add the fucntionality we need
        }
        {Children.map(children(this.next, this.prev), (child, i) => (
          <Slide
            className={slideClass}
            key={`slide-${i}`}
            basis={`calc((100% - (${gutter} * ${visibleSlides - 1})) / ${visibleSlides})`}
            gutter={i === 0 ? '0' : gutter}
          >
            {child}
          </Slide>
        ))}
      </div>
    )
  }
}

export const TrackControl = ({ direction, onClick, className }) => (
  <button
    className={cn(direction === 'next' ? nextButton : prevButton, className)}
    onClick={onClick}
  >
    <Icon type={`chevron-${direction === 'next' ? 'right' : 'left'}`} />
  </button>
)
TrackControl.propTypes = {
  direction: oneOf(['next', 'previous']).isRequired,
  onClick: func,
  className: oneOf([array, string, object])
}
