import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'

/** True while the element is within (or near) the viewport. */
export function useInView({ rootMargin = '0px', once = false, threshold = 0 } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return setInView(true)
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting && once) io.disconnect()
      },
      { rootMargin, threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin, once, threshold])
  return [ref, inView]
}

function subscribeMedia(query) {
  return (cb) => {
    const m = window.matchMedia(query)
    m.addEventListener('change', cb)
    return () => m.removeEventListener('change', cb)
  }
}
export function useMedia(query) {
  const subscribe = useMemo(() => subscribeMedia(query), [query])
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false)
}
export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)')
