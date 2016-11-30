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
    children: func,
    className: oneOfType([array, string, object]),
    gutter: string,
    infinite: bool,
    preventScroll: bool,
    slideClass: oneOfType([array, string, object]),
    preventSnapping: bool,
    startAt: number,
    visibleSlides: number
  }

  static defaultProps = {
    afterSlide: () => {},
    gutter: '1em',
    infinite: false,
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
    this.infiniteNext = this.infiniteNext.bind(this)
    this.infinitePrev = this.infinitePrev.bind(this)
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
    return this.slideTo(this.state.activeIndex + this.props.visibleSlides)
  }

  infiniteNext () {
    if (this.state.activeIndex >= this.childCount - this.props.visibleSlides) {
      this.reorderLastVisibleSet({ next: true })
      this.track.scrollLeft = 0
      return this.next()
        .then(() => {
          this.reorderLastVisibleSet({ reset: true })
          this.track.scrollLeft = 0
        })
    } else {
      return this.next()
    }
  }

  prev () {
    return this.slideTo(this.state.activeIndex - this.props.visibleSlides)
  }

  infinitePrev () {
    if (this.state.activeIndex < this.props.visibleSlides) {
      this.reorderLastVisibleSet({ prev: true })
      this.track.scrollLeft = this.track.scrollWidth
      return this.prev()
        .then(() => {
          this.reorderLastVisibleSet({ reset: true })
          this.track.scrollLeft = this.track.scrollWidth
        })
    } else {
      return this.prev()
    }
  }

  slideTo (index, { immediate = false } = {}) {
    const { afterSlide } = this.props
    const { children, scrollLeft } = this.track
    const slideIndex = normalizeIndex(index, this.childCount)
    const delta = children[slideIndex].offsetLeft - scrollLeft
    return animate(this.track, { prop: 'scrollLeft', delta, immediate }).then(() => {
      if (this.state.activeIndex !== slideIndex) {
        this.setState({ activeIndex: slideIndex })
        afterSlide(slideIndex)
      }
    })
  };

  getNearestSlideIndex = () => {
    const { children, scrollLeft } = this.track
    const offsets = [].slice.call(children).map(({ offsetLeft }) => Math.abs(offsetLeft - scrollLeft))
    return offsets.indexOf(Math.min(...offsets))
  };

  reorderLastVisibleSet = ({ reset = true, prev = false, next = false }) => {
    const { visibleSlides } = this.props
    const resetOrder = (el) => { el.style.order = 'initial' }
    const orderForPrev = (el) => { el.style.order = 1 }
    const orderForNext = (el) => { el.style.order = -1 }

    [].slice.call(
      this.track.children,
      ...prev ? [0, visibleSlides] : next ? [-visibleSlides] : []
    ).forEach(prev ? orderForPrev : next ? orderForNext : resetOrder)
  };

  setRef = (name) => (ref) => { this[name] = ref }

  render () {
    const {
      children,
      className,
      gutter,
      preventScroll,
      slideClass,
      visibleSlides
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
      >
        {
          // We first pass the slide control functions to the function child.
          // this will return the `children` that will be the content of the individaul slides.
          // Then we wrap the slide content in a slide component to add the fucntionality we need
        }
        {Children.map(children(
          ...this.props.infinite ? [this.infiniteNext, this.infinitePrev] : [this.next, this.prev]
        ), (child, i) => (
          <Slide
            className={slideClass}
            key={`slide-${i}`}
            basis={`calc((100% - (${gutter} * ${visibleSlides - 1})) / ${visibleSlides})`}
            gutter={gutter}
            onClick={child.props.onClick}
          >
            {child}
          </Slide>
        ))}
      </div>
    )
  }
}
