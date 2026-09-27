/**
 * Capability checks that decide how much of the visual system to switch on.
 * Everything degrades to a complete static site.
 */
const mq = (q) => typeof window !== 'undefined' && window.matchMedia?.(q).matches

export const prefersReducedMotion = () => mq('(prefers-reduced-motion: reduce)')
export const isCoarsePointer = () => mq('(pointer: coarse)')
export const isSmallScreen = () => mq('(max-width: 760px)')

let webgl
export function hasWebGL() {
  if (webgl !== undefined) return webgl
  try {
    const c = document.createElement('canvas')
    webgl = !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    webgl = false
  }
  return webgl
}

/** Heuristic for devices where continuous WebGL would cost more than it adds. */
export function isLowPower() {
  const nav = typeof navigator !== 'undefined' ? navigator : {}
  if (nav.connection?.saveData) return true
  if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2) return true
  if (nav.deviceMemory && nav.deviceMemory <= 2) return true
  return false
}

/** Whether ambient WebGL (shader gradient, liquid logo) should run at all. */
export const allowAmbientGL = () => hasWebGL() && !prefersReducedMotion() && !(isLowPower() && isCoarsePointer())

/** Chromium is currently the only engine that applies SVG filters to backdrop-filter. */
export function supportsBackdropSvg() {
  if (typeof navigator === 'undefined') return false
  const brands = navigator.userAgentData?.brands
  if (brands) return brands.some((b) => /Chromium|Google Chrome|Microsoft Edge/.test(b.brand))
  return /Chrome\//.test(navigator.userAgent) && !/Edg\/|OPR\//.test(navigator.userAgent) && !/Mobile/.test(navigator.userAgent)
}
