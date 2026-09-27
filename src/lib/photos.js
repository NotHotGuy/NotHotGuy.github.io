import manifest from '../content/photos.generated.json'
import { photoInfo, collections } from '../content/photos.js'

/** Resolve a slug into everything a component needs to render it. */
export function getPhoto(slug) {
  const m = manifest[slug]
  if (!m) {
    if (import.meta.env.DEV) console.warn(`[photos] "${slug}" is not in photos.generated.json — run npm run optimize-images`)
    return null
  }
  const info = photoInfo[slug] ?? {}
  return {
    ...m,
    alt: info.alt ?? '',
    focus: info.focus ?? '50% 50%',
    tone: info.tone ?? 'mid',
    aspect: m.width / m.height,
    orientation: m.width / m.height > 1.6 ? 'wide' : m.width / m.height > 1.05 ? 'landscape' : m.width / m.height < 0.95 ? 'portrait' : 'square',
  }
}

export const getPhotos = (slugs) => slugs.map(getPhoto).filter(Boolean)

export const src = (photo, w, ext) => `/photos/${photo.slug}/${photo.slug}-${w}.${ext}`
export const srcSet = (photo, ext) => photo.widths.map((w) => `${src(photo, w, ext)} ${w}w`).join(', ')
export const largest = (photo) => photo.widths.at(-1)

/** Pick the smallest derivative that covers `cssWidth` at the device's pixel ratio. */
export function pickWidth(photo, cssWidth) {
  const need = cssWidth * Math.min(window.devicePixelRatio || 1, 2)
  return photo.widths.find((w) => w >= need) ?? largest(photo)
}

export const allCollections = () =>
  collections.map((c) => ({ ...c, items: getPhotos(c.photos) })).filter((c) => c.items.length)

/** Short caption line from camera data, e.g. "50mm · ƒ/1.8 · 1/250 · ISO 320". */
export function exposureLine(photo) {
  const e = photo?.exif
  if (!e) return ''
  return [e.focal, e.aperture, e.shutter, e.iso].filter(Boolean).join(' · ')
}
