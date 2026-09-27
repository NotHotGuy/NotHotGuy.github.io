import { useEffect, useRef, useState } from 'react'
import { src, srcSet } from '../lib/photos.js'

/**
 * A photograph, delivered AVIF → WebP → JPEG with responsive widths.
 *
 * fit="natural"  keeps the photo's own aspect ratio (default — never crops)
 * fit="cover"    fills its container, cropping around `photo.focus`
 *
 * The image "pulls focus" from its blurred placeholder once decoded.
 */
export default function Photo({ photo, sizes = '100vw', fit = 'natural', priority = false, className = '', onOpen, imgRef, style }) {
  const localRef = useRef(null)
  const ref = imgRef ?? localRef
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth) setLoaded(true)
  }, [ref])

  if (!photo) return null
  const fallbackW = photo.widths.find((w) => w >= 1280) ?? photo.widths.at(-1)

  const img = (
    <picture>
      <source type="image/avif" srcSet={srcSet(photo, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(photo, 'webp')} sizes={sizes} />
      <img
        ref={ref}
        src={src(photo, fallbackW, 'jpg')}
        srcSet={srcSet(photo, 'jpg')}
        sizes={sizes}
        width={photo.width}
        height={photo.height}
        alt={onOpen ? '' : photo.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : undefined}
        style={{ objectPosition: photo.focus }}
        onLoad={() => setLoaded(true)}
        draggable={false}
      />
    </picture>
  )

  const cls = `photo photo--${fit} ${loaded ? 'is-sharp' : ''} ${className}`
  const frameStyle = {
    '--ar': `${photo.width} / ${photo.height}`,
    backgroundColor: photo.color,
    backgroundImage: loaded ? undefined : `url(${photo.placeholder})`,
    ...style,
  }

  if (onOpen) {
    return (
      <button type="button" className={`${cls} photo--button`} style={frameStyle} onClick={(e) => onOpen(photo, e.currentTarget)} aria-label={`View larger: ${photo.alt}`}>
        {img}
      </button>
    )
  }
  return (
    <div className={cls} style={frameStyle}>
      {img}
    </div>
  )
}
