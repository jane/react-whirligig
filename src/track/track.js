import React, { Component, Children, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Slide from '../slide'
import {
  animate,
  on,
  onScrollEnd,
  onScrollStart,
  hasOngoingInteraction,
  values
} from '../utils'
const { bool, number, string, func, array, oneOfType, object, node } = PropTypes
const noop = () => {}
const normalizeIndex = (idx, len) => ((idx % len) + len) % len

export default class Track extends Component {
  static propTypes = {
    afterSlide: func,
    children: oneOfType([node, array, string]),
    className: oneOfType([array, string, object]),
    style: object,
    gutter: (props, propName, componentName) => {
      const prop = props[propName]
      if (
        typeof Number.parseInt(prop, 10) === 'number' &&
        !Number.isNaN(Number(prop))
      ) {
        return new Error(`Invalid value (${prop}) of prop '${propName}' supplied to ${componentName}.
The value of ${propName} should be a valid css length unit (https://developer.mozilla.org/en-US/docs/Web/CSS/length).`)
      }
    },
    preventScroll: bool,
    slideClass: oneOfType([array, string, object]),
    onSlideClick: func,
    preventSnapping: bool,
    slideTo: number,
    startAt: number,
    visibleSlides: number
  }

  static defaultProps = {
    afterSlide: () => {},
    gutter: '1em',
    preventScroll: false,
    preventSnapping: false,
    startAt: 0,
    style: {},
    visibleSlides: 1
  }

  constructor (props) {
    super(props)

    this.state = { activeIndex: 0, isAnimating: false }

    // We can't do arrow function properties for these since
    // we are passing them to the consuming component and we
    // require the proper context
    this.next = this.next.bind(this)
    this.prev = this.prev.bind(this)
    this.slideTo = this.slideTo.bind(this)
  }

  componentDidMount () {
    this.DOMNode = findDOMNode(this.track)

    // These are not a part of component state since we don't want
    // incure the overhead of calling setState. They are either cached
    // values or state only the onScrollEnd callback cares about and
    // are not important to the rendering of the component.
    this.childCount = this.track.children.length
    let isScrolling = false
    const isInteracting = hasOngoingInteraction(this.DOMNode)
    const shouldSelfCorrect = () =>
      !this.props.preventSnapping &&
      !this.state.isAnimating &&
      !isScrolling &&
      !isInteracting()

    onScrollStart(() => { isScrolling = true })
    on('touchstart')(() => { isScrolling = true })(this.track)
    onScrollEnd(() => {
      isScrolling = false
      if (shouldSelfCorrect()) {
        this.setState({ isAnimating: true })
        this.slideTo(this.getNearestSlideIndex()).catch(noop)
      }
      this.setState({ isAnimating: false })
    }, { target: this.DOMNode })

    on('touchend')(() => {
      if (shouldSelfCorrect()) {
        this.setState({ isAnimating: true })
        this.slideTo(this.getNearestSlideIndex()).catch(noop)
      }
    })(this.track)

    this.slideTo(this.props.startAt, { immediate: true }).catch(noop)
  }

  componentDidUpdate (prevProps) {
    this.childCount = this.track.children.length

    if (prevProps.slideTo !== this.props.slideTo) {
      this.slideTo(this.props.slideTo).catch(noop)
    }
  }

  handleKeyUp = ((nextKeys, prevKeys) => ({ key }) => {
    const isNext = nextKeys.includes(key)
    const isPrev = prevKeys.includes(key)
    this.setState({ isAnimating: true })
    if (isNext) this.next()
    if (isPrev) this.prev()
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
    const { activeIndex } = state
    const { visibleSlides } = props

    const firstIndex = 0
    const lastIndex = childCount - visibleSlides
    const nextActive = activeIndex + visibleSlides
    return this.slideTo(
      (activeIndex === lastIndex)
      ? firstIndex
      : (nextActive < lastIndex) ? nextActive : lastIndex
    )
  }

  prev () {
    const { activeIndex } = this.state
    const { visibleSlides } = this.props
    const firstIndex = 0
    const nextActive = activeIndex - visibleSlides
    return this.slideTo(
      (activeIndex === firstIndex) || (nextActive > firstIndex)
      ? nextActive
      : firstIndex
    )
  }

  slideTo (index, { immediate = false } = {}) {
    if (this.childCount === 0) return Promise.reject()
    const { afterSlide } = this.props
    const { children, scrollLeft } = this.track
    const slideIndex = normalizeIndex(index, this.childCount)
    const startingIndex = this.state.activeIndex
    if (startingIndex === slideIndex) {
      return Promise.reject()
    } else {
      this.setState({ activeIndex: slideIndex })
    }
    const delta = children[slideIndex].offsetLeft - scrollLeft
    return animate(this.track, { prop: 'scrollLeft', delta, immediate }).then(() => {
      if (startingIndex !== slideIndex) {
        return afterSlide(slideIndex)
      }
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
      children,
      className,
      gutter,
      preventScroll,
      preventSnapping, // eslint-disable-line no-unused-vars
      slideClass,
      onSlideClick,
      visibleSlides,
      slideTo, // eslint-disable-line no-unused-vars
      startAt, // eslint-disable-line no-unused-vars
      afterSlide, // eslint-disable-line no-unused-vars
      style,
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
            basis={`calc((100% - (${gutter} * ${visibleSlides - 1})) / ${visibleSlides})`}
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
