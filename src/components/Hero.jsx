import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Photo from './Photo.jsx'
import Glass from './Glass.jsx'
import BrandMark from './BrandMark.jsx'
import LiquidLogo from './LiquidLogo.jsx'
import { getPhoto, exposureLine } from '../lib/photos.js'
import { prefersReducedMotion, isCoarsePointer } from '../lib/device.js'
import { home } from '../content/photos.js'
import { site } from '../content/site.js'

/**
 * Looking through the camera: one photograph, full frame, with viewfinder
 * marks and an AF point resting on the photo's focal point. Pointer movement
 * shifts the frame by at most ~1% so the composition always holds.
 */
export default function Hero() {
  const photo = getPhoto(home.hero)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || isCoarsePointer()) return
    let raf = 0
    let tx = 0
    let ty = 0
    let x = 0
    let y = 0
    const tick = () => {
      x += (tx - x) * 0.06
      y += (ty - y) * 0.06
      el.style.setProperty('--mx', x.toFixed(4))
      el.style.setProperty('--my', y.toFixed(4))
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.001 ? requestAnimationFrame(tick) : 0
    }
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      tx = ((e.clientX - r.left) / r.width) * 2 - 1
      ty = ((e.clientY - r.top) / r.height) * 2 - 1
      if (!raf) raf = requestAnimationFrame(tick)
    }
    el.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      el.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!photo) return null
  const [fx, fy] = photo.focus.split(' ')
  const exposure = exposureLine(photo)

  return (
    <section ref={ref} className={`hero ${home.heroAlign === 'right' ? 'hero--right' : ''}`} aria-labelledby="hero-title">
      <div className="hero__image">
        <Photo photo={photo} fit="cover" sizes="100vw" priority />
      </div>

      <div className="hero__lens" aria-hidden="true">
        <span className="vf vf--tl" />
        <span className="vf vf--tr" />
        <span className="vf vf--bl" />
        <span className="vf vf--br" />
        <span className="af" style={{ left: fx, top: fy }} />
      </div>

      <div className="hero__content">
        <p className="meta hero__kicker">
          <span>Photography</span>
          {site.serviceArea && <span>{site.serviceArea}</span>}
        </p>
        <h1 id="hero-title" className="hero__title">
          <LiquidLogo>
            <BrandMark />
          </LiquidLogo>
        </h1>
        <p className="hero__statement">{site.statement}</p>
        <div className="hero__ctas">
          <Glass as={Link} to="/work" className="btn btn--glass btn--primary" radius={999}>
            View Galleries
          </Glass>
          <Link to="/book" className="btn btn--line">
            Book a Session
          </Link>
        </div>
      </div>

      {exposure && (
        <p className="hero__exif meta" aria-label={`Hero photograph settings: ${exposure}`}>
          {exposure}
        </p>
      )}
    </section>
  )
}
