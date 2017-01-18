import React, { Component, Children, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Slide from '../slide'
import {
  animate,
  noop,
  on,
  onSwipe,
  onScrollEnd,
  onScrollStart,
  hasOngoingInteraction,
  values
} from '../utils'
// const tap = (msg) => (thing) => { console.log(msg, thing); return thing }
const { bool, number, string, func, array, oneOfType, object, node } = PropTypes
const wrapAroundValue = (val, max) => ((val % max) + max) % max
const hardBoundedValue = (val, max) => Math.max(0, Math.min(max, val))
const normalizeIndex = (idx, len, wrap = false) => wrap ? wrapAroundValue(idx, len) : hardBoundedValue(idx, len - 1)
export default class Track extends Component {
  static propTypes = {
    afterSlide: func,
    animationDuration: number,
    beforeSlide: func,
    children: oneOfType([node, array, string]),
    className: oneOfType([array, string, object]),
    easing: func,
    infinite: bool,
    preventScroll: bool,
    onSlideClick: func,
    snapToSlide: bool,
    slideTo: number,
    slideBy: number,
    slideClass: oneOfType([array, string, object]),
    startAt: number,
    style: object,
    gutter: (props, propName, componentName) => {
      const prop = props[propName]
      if (
        typeof Number.parseInt(prop, 10) === 'number' &&
        !Number.isNaN(Number(prop))
      ) {
        return new Error(`Invalid value (${prop}) of prop '${propName}' supplied to ${componentName}.
        The value of ${propName} should be a valid css length unit
        (https://developer.mozilla.org/en-US/docs/Web/CSS/length).`)
      }
    },
    visibleSlides: number
  }

  static defaultProps = {
    afterSlide: () => {},
    animationDuration: 500,
    beforeSlide: () => {},
    gutter: '1em',
    preventScroll: false,
    snapToSlide: false,
    startAt: 0,
    style: {}
  }

  constructor (props) {
    super(props)

    this.state = {
      activeIndex: 0,
      isAnimating: false,
      visibleSlides: this.props.visibleSlides || 0,
      slideBy: this.props.slideBy || this.props.visibleSlides || 1 }

    // We can't do arrow function properties for these since
    // we are passing them to the consuming component and we
    // require the proper context
    this.next = this.next.bind(this)
    this.prev = this.prev.bind(this)
    this.slideTo = this.slideTo.bind(this)
  }

  eventListeners = []
  isScrolling = false
  canSelfCorrect = () =>
    !this.state.isAnimating &&
    !this.isScrolling &&
    !this.isInteracting()

  shouldSelfCorrect = () => this.props.snapToSlide && this.canSelfCorrect()

  componentDidMount () {
    this.DOMNode = findDOMNode(this.track)
    this.isInteracting = hasOngoingInteraction(this.DOMNode)

    // These are not a part of component state since we don't want
    // incure the overhead of calling setState. They are either cached
    // values or state only the onScrollEnd callback cares about and
    // are not important to the rendering of the component.
    this.childCount = this.track.children.length

    const slideBy = {
      left: () => -this.state.slideBy,
      right: () => this.state.slideBy,
      up: () => 0,
      down: () => 0
    }

    this.eventListeners = [
      ...this.eventListeners,

      onScrollStart(() => { this.isScrolling = true }),

      on('touchstart')(() => { this.isScrolling = true })(this.track),

      onScrollEnd(() => {
        this.isScrolling = false
        if (this.canSelfCorrect()) {
          if (this.props.snapToSlide) {
            this.slideTo(this.getNearestSlideIndex()).catch(noop)
          } else {
            this.props.afterSlide(this.getNearestSlideIndex())
          }
        }
      }, { target: this.DOMNode }),

      on('touchend')(() => {
        if (this.canSelfCorrect()) {
          this.props.snapToSlide
          ? this.slideTo(this.getNearestSlideIndex()).catch(noop)
          : this.props.afterSlide(this.getNearestSlideIndex())
        }
      })(this.track),

      onSwipe((direction) => {
        if (this.props.snapToSlide) {
          this.slideTo(this.state.activeIndex + (slideBy[direction]())).catch(noop)
        }
      })(this.track)

    ]

    this.slideTo(this.props.startAt, { immediate: true }).catch(noop)
  }

  componentWillUnmount () { this.eventListeners.forEach((fn) => fn()) }

  componentWillReceiveProps ({ slideBy, visibleSlides }) {
    if (slideBy !== this.props.slideBy || visibleSlides !== this.props.visibleSlides) {
      this.setState({ slideBy: slideBy || visibleSlides || 1 })
    }
  }

  componentDidUpdate (prevProps) {
    this.childCount = this.track.children.length
    this.shouldSelfCorrect() && this.slideTo(this.getNearestSlideIndex()).catch(noop)
    if (prevProps.slideTo !== this.props.slideTo) {
      this.slideTo(this.props.slideTo).catch(noop)
    }
  }

  handleKeyUp = ((nextKeys, prevKeys) => ({ key }) => {
    const isNext = nextKeys.includes(key)
    const isPrev = prevKeys.includes(key)
    this.setState({ isAnimating: true })
    if (isNext) this.next().catch(noop)
    if (isPrev) this.prev().catch(noop)
    return false
  })(['ArrowRight'], ['ArrowLeft']);

  // We don't want to update if only state changed.
  // Sate is not important to the rendering of this component
  shouldComponentUpdate (nextProps) {
    const propValues = values(this.props)
    const nextPropValues = values(nextProps)
    return !nextPropValues.every((val, i) => val === propValues[i])
  }

  next () {
    const { childCount, props, state } = this
    const { activeIndex, slideBy } = state
    const { infinite } = props

    const firstIndex = 0
    const lastIndex = childCount - slideBy
    const nextActiveCandidate = activeIndex + slideBy
    const nextActive = Math.min(nextActiveCandidate, lastIndex)
    const nextActiveInfinite = (activeIndex === lastIndex) ? firstIndex : nextActive
    return this.slideTo(infinite ? nextActiveInfinite : nextActive)
  }

  prev () {
    const { activeIndex, slideBy } = this.state
    const { infinite } = this.props
    const firstIndex = 0
    const lastIndex = this.childCount - slideBy
    const nextActive = Math.max(activeIndex - slideBy, firstIndex)
    const nextActiveInfinite = (nextActive === firstIndex) ? lastIndex : nextActive
    return this.slideTo(infinite ? nextActiveInfinite : nextActive)
  }

  slideTo (index, { immediate = false } = {}) {
    if (this.childCount === 0) return Promise.reject()
    const { afterSlide, beforeSlide, easing, animationDuration: duration, infinite } = this.props
    const { children, scrollLeft } = this.track
    const slideIndex = normalizeIndex(index, this.childCount, infinite)
    const startingIndex = this.state.activeIndex
    if (startingIndex === slideIndex) {
      return Promise.reject()
    }
    const delta = children[slideIndex].offsetLeft - scrollLeft
    beforeSlide(index)
    this.setState({ isAnimating: true, activeIndex: slideIndex })
    return (new Promise((res, rej) => {
      if (immediate) {
        this.track.scrollLeft = children[slideIndex].offsetLeft
        return res()
      } else {
        return res(animate(this.track, { prop: 'scrollLeft', delta, easing, duration }))
      }
    }))
    .then(() => {
      this.setState({ isAnimating: false })
      if (startingIndex !== slideIndex) {
        return afterSlide(slideIndex)
      }
    })
    .catch((err) => {
      this.setState({ isAnimating: false })
    })
  };

  getNearestSlideIndex = () => {
    const { children, scrollLeft } = this.track
    const offsets = [].slice.call(children).map(({ offsetLeft }) => Math.abs(offsetLeft - scrollLeft))
    return offsets.indexOf(Math.min(...offsets))
  };

  setRef = (name) => (ref) => { this[name] = ref }

  render () {
    const {
      afterSlide, // eslint-disable-line no-unused-vars
      animationDuration, // eslint-disable-line no-unused-vars
      beforeSlide, // eslint-disable-line no-unused-vars
      children,
      className,
      easing, // eslint-disable-line no-unused-vars
      infinite, // eslint-disable-line no-unused-vars
      gutter,
      preventScroll,
      snapToSlide, // eslint-disable-line no-unused-vars
      onSlideClick,
      slideClass,
      slideTo, // eslint-disable-line no-unused-vars
      slideBy, // eslint-disable-line no-unused-vars
      startAt, // eslint-disable-line no-unused-vars
      style,
      visibleSlides,
      ...props
    } = this.props

    const preventScrolling = preventScroll ? 'hidden' : 'auto'

    const styles = {
      display: 'flex',
      flexFlow: 'row nowrap',
      justifyContent: 'space-between',
      overflowX: preventScrolling,
      msOverflowStyle: '-ms-autohiding-scrollbar', /* chrome like scrollbar experience for IE/Edge */
      position: 'relative', /* makes .track an offset parent */
      transition: 'all .25s ease-in-quint',
      outline: 'none',
      WebkitOverflowScrolling: 'touch'
    }

    return (
      <div
        className={className}
        style={{ ...style, ...styles }}
        ref={this.setRef('track')}
        tabIndex="0"
        onKeyUp={this.handleKeyUp}
        {...props}
      >
        {
          // We first pass the slide control functions to the function child.
          // this will return the `children` that will be the content of the individaul slides.
          // Then we wrap the slide content in a slide component to add the fucntionality we need
        }
        {Children.map(typeof children === 'function' ? children(this.next, this.prev) : children, (child, i) => (
          <Slide
            className={slideClass}
            key={`slide-${i}`}
            basis={visibleSlides ? `calc((100% - (${gutter} * ${visibleSlides - 1})) / ${visibleSlides})` : 'auto'}
            gutter={i > 0 ? gutter : ''}
            onClick={onSlideClick}
          >
            {child}
          </Slide>
        ))}
      </div>
    )
  }
}
