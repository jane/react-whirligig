import { easeInOutQuint } from './easing'

export const values = Object.values || ((obj) => Object.keys(obj).map((key) => obj[key]))

export const compose = (...fns) => (val) => fns.reduceRight((currVal, fn) => fn(currVal), val)

export const minMap = (...vals) => (val) => Math.min(...vals, val)
export const maxMap = (...vals) => (val) => Math.max(...vals, val)

export const on = (evt, opts = false) => (cb) => (el) => el.addEventListener(evt, cb, opts)

export const onWindowScroll = (cb) => on('scroll', true)(cb)(window)

export const onScroll = (cb, { target = window } = {}) =>
  onWindowScroll((e) => (target === window || target === e.target) && cb(e))

export const onScrollEnd = (cb, { wait = 100, target = window } = {}) => ((timeoutID) => onScroll((evt) => {
  clearTimeout(timeoutID)
  timeoutID = setTimeout(() => evt.target === target ? cb() : undefined, wait)
}))(0)

export const onScrollStart = (cb, { target = window } = {}) => {
  let started = false
  onScrollEnd(() => { started = false }, { target })
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
  duration = immediate ? 0 : 800,
  easing = easeInOutQuint,
  prop = 'scrollTop'
} = {}) => new Promise((res, rej) => {
  if (!delta) res()
  const initialVal = el[prop]
  let startTime = null
  const step = (timestamp) => {
    if (!startTime) startTime = timestamp
    const progressTime = timestamp - startTime
    const progressRatio = easing(progressTime / duration)
    el[prop] = initialVal + (delta * progressRatio)
    if (progressTime < duration) {
      window.requestAnimationFrame(step)
    } else {
      // Give scroll control back to the user once animation is done.
      // el.style.overflow = overFlowStyle
      // MS Edge doesn't like the above apparently.
      el.setAttribute('style', el.getAttribute('style').replace(/(overflow:\s?)\w*/, '$1auto'))
      // el[prop] = initialVal + delta // paranoia check. jump to the end when animation time is complete.

      res()
    }
  }
  // We are going to temporarily prevent the user from being able to scroll during the animation.
  // This will prevent a janky fight between user scroll and animation which is just bad user experience.
  el.style.overflow = 'hidden'
  window.requestAnimationFrame(step)
})
