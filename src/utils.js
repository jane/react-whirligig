import { easeInQuint } from './easing'

export const compose = (...fns) => (val) => fns.reduceRight((currVal, fn) => fn(currVal), val)

export const minMap = (...vals) => (val) => Math.min(...vals, val)
export const maxMap = (...vals) => (val) => Math.max(...vals, val)

export const on = (evt, opts = false) => (cb) => (el) => el.addEventListener(evt, cb, opts)

export const onWindowScroll = (cb) => on('scroll', true)(cb)(window)

export const onScroll = (cb, { target = window } = {}) =>
  onWindowScroll((e) => (target === window || target === e.target) && cb(e))

export const onScrollEnd = (cb, { wait = 200, target = window } = {}) => ((timeoutID) => onScroll((evt) => {
  clearTimeout(timeoutID)
  timeoutID = setTimeout(() => evt.target === target ? cb() : undefined, wait)
}))(0)

export const onScrollStart = (cb, { target = window } = {}) => {
  let started = false
  onScrollEnd(() => (started = false), { target })
  onScroll((e) => {
    if (!started) {
      started = true
      cb(e)
    }
  }, { target })
}

export const trackTouchesForElement = (el) => {
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

export const animate = (el, {
  delta = 0,
  immediate = false,
  duration = immediate ? 0 : 500,
  easing = easeInQuint,
  prop = 'scrollTop'
} = {}) => new Promise((res, rej) => {
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
})
