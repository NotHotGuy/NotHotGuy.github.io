import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { supportsBackdropSvg, isSmallScreen } from '../lib/device.js'

/**
 * Optical glass for interface controls.
 *
 * The refraction model is ported from liquid-glass-js (dashersw): a signed
 * distance field of the rounded shape gives each pixel a surface normal and an
 * edge-weighted intensity, so the backdrop bends most strongly at the rim.
 * Instead of sampling an html2canvas snapshot (static, expensive), the field is
 * baked once into a displacement map and applied to the *live* backdrop via an
 * SVG filter — photographs, video and WebGL behind the glass all refract.
 *
 * Browsers without SVG backdrop filters get a plain CSS frosted fallback.
 */

const mapCache = new Map()

function sdfRoundedRect(px, py, w, h, r) {
  const qx = Math.abs(px - w / 2) - (w / 2 - r)
  const qy = Math.abs(py - h / 2) - (h / 2 - r)
  const ox = Math.max(qx, 0)
  const oy = Math.max(qy, 0)
  return { d: Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - r, qx, qy }
}

/** Bake the refraction field for one size into a PNG data URL (R = x shift, G = y shift). */
function buildDisplacementMap(w, h, r, bevel) {
  const key = `${w}x${h}r${r}b${bevel}`
  if (mapCache.has(key)) return mapCache.get(key)
  // Half resolution is plenty: the field is smooth and feImage scales it up.
  const s = 0.5
  const cw = Math.max(2, Math.round(w * s))
  const ch = Math.max(2, Math.round(h * s))
  const canvas = document.createElement('canvas')
  canvas.width = cw
  canvas.height = ch
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(cw, ch)
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const px = (x + 0.5) / s
      const py = (y + 0.5) / s
      const { d, qx, qy } = sdfRoundedRect(px, py, w, h, r)
      const inside = Math.max(-d, 0)
      // Surface normal of the rounded rect, pointing outward.
      let nx
      let ny
      if (qx > 0 && qy > 0) {
        const l = Math.hypot(qx, qy) || 1
        nx = qx / l
        ny = qy / l
      } else if (qx > qy) {
        nx = 1
        ny = 0
      } else {
        nx = 0
        ny = 1
      }
      nx *= Math.sign(px - w / 2) || 1
      ny *= Math.sign(py - h / 2) || 1
      // liquid-glass-js: edge term exp(-d·k) + a softer rim term.
      const edge = Math.exp(-inside / bevel)
      const rim = Math.exp(-inside / (bevel * 3)) * 0.25
      const k = Math.min(edge + rim, 1)
      const i = (y * cw + x) * 4
      img.data[i] = 128 - nx * k * 127
      img.data[i + 1] = 128 - ny * k * 127
      img.data[i + 2] = 128
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  const url = canvas.toDataURL('image/png')
  mapCache.set(key, url)
  return url
}

let refractSupport
const canRefract = () => (refractSupport ??= supportsBackdropSvg()) && !isSmallScreen()

export default function Glass({ ref: forwardedRef, as: Tag = 'div', radius = 999, bevel = 14, strength = 34, tint = 'dark', className = '', style, children, ...rest }) {
  const ref = useRef(null)
  const rawId = useId()
  const id = `glass${rawId.replace(/[^a-zA-Z0-9]/g, '')}`
  const [size, setSize] = useState(null)
  const [refract, setRefract] = useState(false)

  useLayoutEffect(() => setRefract(canRefract()), [])

  useEffect(() => {
    if (!refract || !ref.current) return
    const el = ref.current
    let raf
    const ro = new ResizeObserver(([entry]) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const box = entry.borderBoxSize?.[0]
        const w = Math.round(box ? box.inlineSize : el.offsetWidth)
        const h = Math.round(box ? box.blockSize : el.offsetHeight)
        if (w && h) setSize((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }))
      })
    })
    ro.observe(el)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [refract])

  const r = size ? Math.min(radius, size.h / 2, size.w / 2) : radius
  const map = refract && size ? buildDisplacementMap(size.w, size.h, Math.round(r), bevel) : null

  return (
    <Tag
      ref={(node) => {
        ref.current = node
        if (typeof forwardedRef === 'function') forwardedRef(node)
        else if (forwardedRef) forwardedRef.current = node
      }}
      className={`glass glass--${tint} ${map ? 'glass--refract' : ''} ${className}`}
      style={{ '--glass-r': `${r}px`, ...(map ? { '--glass-filter': `url(#${id})` } : null), ...style }}
      {...rest}
    >
      {map && (
        <svg className="glass__defs" width="0" height="0" aria-hidden="true" focusable="false">
          <filter id={id} x="0" y="0" width={size.w} height={size.h} filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feImage href={map} x="0" y="0" width={size.w} height={size.h} preserveAspectRatio="none" result="map" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="soft" />
            <feDisplacementMap in="soft" in2="map" scale={strength} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
      )}
      {children}
    </Tag>
  )
}
