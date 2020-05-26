export const includes = (val, arr) =>
  arr.includes ? arr.includes(val) : !!arr.filter((item) => item === val).length

const wrapAroundValue = (val, max) => ((val % max) + max) % max

const hardBoundedValue = (val, max) => Math.max(0, Math.min(max, val))

export const normalizeIndex = (idx, len, wrap = false) =>
  wrap ? wrapAroundValue(idx, len) : hardBoundedValue(idx, len - 1)

export const values =
  Object.values || ((obj) => Object.keys(obj).map((key) => obj[key]))

export const minMap = (...vals) => (val) => Math.min(...vals, val)

export const maxMap = (...vals) => (val) => Math.max(...vals, val)

export const noop = () => {}

export const easeOutQuint = (t) => {
  let n = t
  return 1 + --n * n ** 4
}

export const on = (evt, opts = false) => (cb) => (el) => {
  if (el && typeof el.addEventListener === 'function') {
    el.addEventListener(evt, cb, opts)
    return () => el.removeEventListener(evt, cb)
  }
}

export const onWindowScroll = (cb) => on('scroll', true)(cb)(window)

export const onScroll = (cb, { target = window } = {}) =>
  onWindowScroll((e) => (target === window || target === e.target) && cb(e))

export const onScrollEnd = (cb, { wait = 100, target = window } = {}) =>
  ((timeoutID) =>
    onScroll((evt) => {
      clearTimeout(timeoutID)
      timeoutID = setTimeout(
        () => (evt.target === target ? cb() : undefined),
        wait
      )
    }))(0)

export const onScrollStart = (cb, { target = window } = {}) => {
  let started = false
  const offScrollEnd = onScrollEnd(
    () => {
      started = false
    },
    { target }
  )
  const offScroll = onScroll(
    (e) => {
      if (!started) {
        started = true
        cb(e)
      }
    },
    { target }
  )

  return () => {
    if (typeof offScroll === 'function') {
      offScroll()
    }
    if (typeof offScrollEnd === 'function') {
      offScrollEnd()
    }
  }
}

export const onSwipe = (cb) => (target) => {
  const offTouchStart = on('touchstart')(({ targetTouches }) => {
    const { pageX: startX, pageY: startY } = targetTouches[0]
    const offTouchEnd = on('touchend')(({ changedTouches }) => {
      const { pageX: endX, pageY: endY } = changedTouches[0]
      const xDiff = endX - startX
      const absXDiff = Math.abs(xDiff)
      const yDiff = endY - startY
      const absYDiff = Math.abs(yDiff)
      if (Math.max(absXDiff, absYDiff) > 20) {
        const dir =
          absXDiff > absYDiff
            ? /* h */ xDiff < 0
              ? 'right'
              : 'left'
            : /* v */ yDiff < 0
            ? 'down'
            : 'up'
        cb(dir)
      }
      if (typeof offTouchEnd === 'function') {
        offTouchEnd()
      }
    })(target)
  })(target)

  return offTouchStart
}

export const trackTouchesForElement = (el) => {
  let touchIds = []
  on('touchend')(({ targetTouches }) => {
    touchIds = targetTouches
  })(el)
  return () => touchIds.length
}

export const trackOngoingMouseInteraction = (el) => {
  let isInteracting = false
  on('mousedown')(() => {
    isInteracting = true
  })(el)
  on('mouseup')(() => {
    isInteracting = false
  })(document.body)
  return () => isInteracting
}

export const hasOngoingInteraction = (el) => {
  const getOngoingTouchCount = trackTouchesForElement(el)
  const getOngoingMouseClick = trackOngoingMouseInteraction(el)
  return () => !!getOngoingTouchCount() || getOngoingMouseClick()
}

const fakeChild = { getBoundingClientRect: () => ({}) }
export const isWhollyInView = (parent) => (child = fakeChild) => {
  const { left: cLeft, right: cRight } = child.getBoundingClientRect()
  const { left: pLeft, right: pRight } = parent.getBoundingClientRect()
  return cLeft >= pLeft && cRight <= pRight
}

const supportsPassive = () => {
  try {
    window.addEventListener('__rw_test__', null, { passive: true })
    window.removeEventListener('__rw_test__', null)
    return true
  } catch {
    return false
  }
}

export const animate = (
  el,
  {
    delta = 0,
    immediate = false,
    duration = 500,
    easing = easeOutQuint,
    prop = 'scrollTop',
  } = {}
) =>
  new Promise((res, rej) => {
    if (!delta) {
      return res()
    }
    const initialVal = el[prop]
    if (immediate) {
      el[prop] = initialVal + delta
      return res()
    }
    let hasBailed = false
    const bail = () => {
      hasBailed = true
      const pos = el[prop]
      el.removeEventListener('touchstart', bail)
      el[prop] = pos
      return rej('Animation interrupted by interaction')
    }
    el.addEventListener(
      'touchstart',
      bail,
      supportsPassive() ? { passive: true } : false
    )
    let startTime = null
    const step = (timestamp) => {
      if (hasBailed) {
        return
      }
      if (!startTime) {
        startTime = timestamp
      }
      const progressTime = timestamp - startTime
      const progressRatio = easing(progressTime / duration)
      el[prop] = initialVal + delta * progressRatio
      if (progressTime < duration) {
        window.requestAnimationFrame(step)
      } else {
        el[prop] = initialVal + delta // jump to end when animation is complete. necessary at least for immediate scroll
        res()
      }
    }
    window.requestAnimationFrame(step)
  })
