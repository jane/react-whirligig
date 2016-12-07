import React, { Component, Children, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Slide from '../slide'
import {
  animate,
  on,
  onScrollEnd,
  onScrollStart,
  trackTouchesForElement,
  values
} from '../utils'
const { bool, number, string, func, array, oneOfType, object } = PropTypes

const normalizeIndex = (idx, len) => ((idx % len) + len) % len

export default class Track extends Component {
  static propTypes = {
    afterSlide: func,
    children: func.isRequired,
    className: oneOfType([array, string, object]),
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
    startAt: number,
    visibleSlides: number
  }

  static defaultProps = {
    afterSlide: () => {},
    gutter: '1em',
    preventScroll: false,
    preventSnapping: false,
    startAt: 0,
    visibleSlides: 1
  }

  constructor (props) {
    super(props)

    this.state = { activeIndex: 0 }

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
    let isAnimating = false
    let isScrolling = false
    const getOngoingTouchCount = trackTouchesForElement(this.DOMNode)
    const shouldSelfCorrect = () =>
      !this.props.preventSnapping && !isAnimating && !isScrolling && !getOngoingTouchCount()

    onScrollStart(() => {
      isScrolling = true
    })
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

    this.slideTo(this.props.startAt, { immediate: true })
  }

  componentDidUpdate () {
    this.childCount = this.track.children.length
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
    const delta = children[slideIndex].offsetLeft - scrollLeft
    startingIndex !== slideIndex && this.setState({ activeIndex: slideIndex })
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
      startAt, // eslint-disable-line no-unused-vars
      afterSlide, // eslint-disable-line no-unused-vars
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
      outline: 'none'
    }

    return (
      <div
        className={className}
        style={styles}
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
        {Children.map(children(this.next, this.prev), (child, i) => (
          <Slide
            className={slideClass}
            key={`slide-${i}`}
            basis={`calc((100% - (${gutter} * ${visibleSlides - 1})) / ${visibleSlides})`}
            gutter={gutter}
            onClick={onSlideClick}
          >
            {child}
          </Slide>
        ))}
      </div>
    )
  }
}
