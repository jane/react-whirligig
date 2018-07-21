// @flow

// there are a few fixmes in here. see https://github.com/facebook/flow/issues/3146

export const includes = (val: any, arr: any[]): boolean =>
  arr.includes ? arr.includes(val) : !!arr.filter((item) => item === val).length

const wrapAroundValue = (val: number, max: number): number =>
  ((val % max) + max) % max

const hardBoundedValue = (val: number, max: number): number =>
  Math.max(0, Math.min(max, val))

export const normalizeIndex = (
  idx: number,
  len: number,
  wrap: boolean = false
) => (wrap ? wrapAroundValue(idx, len) : hardBoundedValue(idx, len - 1))

export const values =
  Object.values || ((obj) => Object.keys(obj).map((key) => obj[key]))

export const minMap = (...vals: number[]) => (val: number): number =>
  Math.min(...vals, val)

export const maxMap = (...vals: number[]) => (val: number): number =>
  Math.max(...vals, val)

export const noop = () => undefined

export const easeOutQuint = (t: number): number => {
  let n: number = t
  return 1 + --n * n ** 4
}

export const on = (evt: string, opts: boolean = false) => (
  cb: (SyntheticTouchEvent<*>) => any
) => (el: any): any => {
  if (el && typeof el.addEventListener === 'function') {
    el.addEventListener(evt, cb, opts)
    return () => el.removeEventListener(evt, cb)
  }
}

export const onWindowScroll = (cb: (SyntheticEvent<*>) => any): void =>
  on('scroll', true)(cb)(window)

export const onScroll = (
  cb: (SyntheticEvent<*>) => void,
  { target = window }: { target: Object } = {}
): any =>
  onWindowScroll(
    (e: SyntheticEvent<*>) =>
      (target === window || target === e.target) && cb(e)
  )

export const onScrollEnd = (
  cb: () => void,
  { wait = 100, target = window }: { wait?: number, target: Object } = {}
): void =>
  ((timeoutID: TimeoutID) =>
    onScroll((evt: SyntheticEvent<*>) => {
      clearTimeout(timeoutID)
      // $FlowFixMe
      timeoutID = setTimeout(
        () => (evt.target === target ? cb() : undefined),
        wait
      )
      // $FlowFixMe
    }))(0)

export const onScrollStart = (
  cb: (SyntheticEvent<*>) => any,
  { target = window }: { target: Object } = {}
): (() => void) => {
  let started: boolean = false
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
    if (typeof offScroll === 'function') offScroll()
    if (typeof offScrollEnd === 'function') offScrollEnd()
  }
}

export const onSwipe = (cb: (string) => void) => (
  target: SyntheticTouchEvent<*>
): void => {
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
      if (typeof offTouchEnd === 'function') offTouchEnd()
    })(target)
  })(target)

  return offTouchStart
}

export const trackTouchesForElement = (el: Element): (() => number) => {
  let touchIds: Array<*> = []
  on('touchend')(({ targetTouches }) => {
    touchIds = targetTouches
  })(el)
  return () => touchIds.length
}

export const trackOngoingMouseInteraction = (el: Element): (() => boolean) => {
  let isInteracting: boolean = false
  on('mousedown')(() => {
    isInteracting = true
  })(el)
  on('mouseup')(() => {
    isInteracting = false
  })(document.body)
  return () => isInteracting
}

export const hasOngoingInteraction = (el: Element): (() => boolean) => {
  const getOngoingTouchCount = trackTouchesForElement(el)
  const getOngoingMouseClick = trackOngoingMouseInteraction(el)
  return () => !!getOngoingTouchCount() || getOngoingMouseClick()
}

const fakeChild = { getBoundingClientRect: () => ({}) }
export const isWhollyInView = (parent: Element) => (
  child: Element | typeof fakeChild = fakeChild
): boolean => {
  const { left: cLeft, right: cRight } = child.getBoundingClientRect()
  const { left: pLeft, right: pRight } = parent.getBoundingClientRect()
  return cLeft >= pLeft && cRight <= pRight
}

const supportsPassive = (): boolean => {
  try {
    window.addEventListener('__rw_test__', null, { passive: true })
    window.removeEventListener('__rw_test__', null)
    return true
  } catch (_) {
    return false
  }
}

export const animate = (
  el: Element,
  {
    delta = 0,
    immediate = false,
    duration = 500,
    easing = easeOutQuint,
    prop = 'scrollTop',
  }: {
    delta: number,
    immediate?: boolean,
    duration: number,
    easing: (number) => number,
    prop: string,
  } = {}
): Promise<*> =>
  new Promise(
    (res, rej): void => {
      if (!delta) return res()
      // $FlowFixMe
      const initialVal = el[prop]
      if (immediate) {
        // $FlowFixMe
        el[prop] = initialVal + delta
        return res()
      }
      let hasBailed: boolean = false
      const bail = (): void => {
        hasBailed = true
        // $FlowFixMe
        const pos = el[prop]
        el.removeEventListener('touchstart', bail)
        // $FlowFixMe
        el[prop] = pos
        return rej('Animation interrupted by interaction')
      }
      el.addEventListener(
        'touchstart',
        bail,
        supportsPassive() ? { passive: true } : false
      )
      let startTime: number | null = null
      const step = (timestamp: number) => {
        if (hasBailed) return
        if (!startTime) startTime = timestamp
        const progressTime = timestamp - startTime
        const progressRatio = easing(progressTime / duration)
        // $FlowFixMe
        el[prop] = initialVal + delta * progressRatio
        if (progressTime < duration) {
          window.requestAnimationFrame(step)
        } else {
          // $FlowFixMe
          el[prop] = initialVal + delta // jump to end when animation is complete. necessary at least for immediate scroll
          res()
        }
      }
      window.requestAnimationFrame(step)
    }
  )
