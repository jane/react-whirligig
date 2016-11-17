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
