import React, { Component, Children, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import cn from 'classnames'
import Slide from '../slide'
import { track, preventScrolling } from './styles.css'
import {
  animate,
  compose,
  maxMap as max,
  minMap as min,
  on,
  onScrollEnd,
  onScrollStart,
  trackTouchesForElement
} from '../utils'
const { bool, number, string, func, array, oneOfType, object } = PropTypes

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

    this.slideTo(this.props.startAt, { immediate: true })
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

  slideTo (index, { immediate = false } = {}) {
    const { afterSlide } = this.props
    const { children, scrollLeft } = this.track
    const slideIndex = compose(max(0), min(index))(children.length - 1)
    const delta = children[slideIndex].offsetLeft - scrollLeft
    animate(this.track, { prop: 'scrollLeft', delta, immediate }).then(() => {
      this.setState({ activeIndex: slideIndex })
      afterSlide(slideIndex)
    })
  }

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
