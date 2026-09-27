import Photo from './Photo.jsx'
import { exposureLine } from '../lib/photos.js'

/**
 * Exhibition rows. Every layout keeps each photograph at its own aspect
 * ratio: pairs and triptychs share a height by giving each frame a flex
 * weight equal to its aspect ratio, so nothing is cropped to fit a grid.
 */

function Caption({ photo, index, label }) {
  const line = exposureLine(photo)
  return (
    <figcaption className="caption">
      <span className="caption__index">{String(index + 1).padStart(2, '0')}</span>
      {label && <span className="meta">{label}</span>}
      {line && <span className="meta meta--dim">{line}</span>}
    </figcaption>
  )
}

function Frame({ photo, index, sizes, onOpen, label, caption = true, className = '', style }) {
  return (
    <figure className={`frame ${className}`} style={style} data-reveal>
      <Photo photo={photo} sizes={sizes} onOpen={onOpen ? (p, el) => onOpen(index, el) : undefined} />
      {caption && <Caption photo={photo} index={index} label={label} />}
    </figure>
  )
}

/** Large frame + smaller frame, offset vertically. */
function Pair({ items, idx, flip, onOpen, label }) {
  const [a, b] = items
  return (
    <div className={`row row--pair ${flip ? 'is-flipped' : ''}`}>
      <Frame photo={a} index={idx[0]} sizes="(max-width: 760px) 100vw, 58vw" onOpen={onOpen} label={label} className="frame--major" />
      {b && <Frame photo={b} index={idx[1]} sizes="(max-width: 760px) 78vw, 30vw" onOpen={onOpen} label={label} className={`frame--minor frame--${b.orientation}`} />}
    </div>
  )
}

/** One photograph, narrow and off-centre, with an optional editorial line. */
function Single({ item, index, side = 'left', note, onOpen, label }) {
  return (
    <div className={`row row--single is-${side} row--${item.orientation}`}>
      <Frame photo={item} index={index} sizes={item.orientation === 'portrait' ? '(max-width: 760px) 88vw, 36vw' : '(max-width: 760px) 100vw, 62vw'} onOpen={onOpen} label={label} />
      {note && (
        <p className="row__note" data-reveal>
          {note}
        </p>
      )}
    </div>
  )
}

/** Edge to edge. Only for masters wide and large enough to hold the width. */
function Bleed({ item, index, onOpen, label }) {
  return (
    <div className="row row--bleed">
      <Frame photo={item} index={index} sizes="100vw" onOpen={onOpen} label={label} className="frame--bleed" />
    </div>
  )
}

/** Two or three frames sharing one height. */
function Strip({ items, idx, onOpen, label }) {
  const total = items.reduce((s, p) => s + p.aspect, 0)
  return (
    <div className={`row row--strip row--strip-${items.length}`} style={{ '--sum': total }}>
      {items.map((p, i) => (
        <Frame
          key={p.slug}
          photo={p}
          index={idx[i]}
          sizes={`(max-width: 760px) 100vw, ${Math.round((p.aspect / total) * 92)}vw`}
          onOpen={onOpen}
          label={label}
          style={{ flexGrow: p.aspect, flexBasis: 0 }}
        />
      ))}
    </div>
  )
}

/** `idx` holds each item's position in the page's lightbox sequence. */
export function Row({ row, items, idx, onOpen, label }) {
  switch (row.layout) {
    case 'pair':
      return <Pair items={items} idx={idx} flip={row.flip} onOpen={onOpen} label={label} />
    case 'bleed':
      return <Bleed item={items[0]} index={idx[0]} onOpen={onOpen} label={label} />
    case 'triptych':
    case 'diptych':
      return <Strip items={items} idx={idx} onOpen={onOpen} label={label} />
    default:
      return <Single item={items[0]} index={idx[0]} side={row.side} note={row.note} onOpen={onOpen} label={label} />
  }
}

/**
 * Order in which a row's items read on screen (left → right). Flipped pairs
 * put the smaller frame first, so numbering and the lightbox follow the eye.
 */
export const visualOrder = (row, items) => (row.layout === 'pair' && row.flip && items.length === 2 ? [items[1], items[0]] : items)

/**
 * Turn an ordered list of photos into a paced sequence of rows by reading
 * their shapes — used for collections, so the owner only chooses the order.
 */
export function composeRows(photos) {
  const rows = []
  let side = 'left'
  let i = 0
  const alt = () => (side = side === 'left' ? 'right' : 'left')
  while (i < photos.length) {
    const [p, q, r] = [photos[i], photos[i + 1], photos[i + 2]]
    const tall = (x) => x && (x.orientation === 'portrait' || x.orientation === 'square')
    if (p.orientation === 'wide' && p.width >= 2560) {
      rows.push({ layout: 'bleed', count: 1 })
      i += 1
    } else if (tall(p) && tall(q) && tall(r)) {
      rows.push({ layout: 'triptych', count: 3 })
      i += 3
    } else if (tall(p) && tall(q)) {
      rows.push({ layout: 'diptych', count: 2 })
      i += 2
    } else if (!tall(p) && tall(q)) {
      rows.push({ layout: 'pair', count: 2, flip: side === 'right' })
      alt()
      i += 2
    } else if (tall(p) && q && !tall(q)) {
      rows.push({ layout: 'pair', count: 2, flip: side === 'left', swap: true })
      alt()
      i += 2
    } else if (q && !tall(q) && rows.at(-1)?.layout !== 'pair') {
      // two landscapes: large + smaller offset, alternating with singles
      rows.push({ layout: 'pair', count: 2, flip: side === 'right' })
      alt()
      i += 2
    } else {
      rows.push({ layout: 'single', count: 1, side })
      alt()
      i += 1
    }
  }
  return rows
}

/** Render a list of photos as composed rows. */
export default function Exhibition({ photos, rows = composeRows(photos), onOpen, label }) {
  // Lay rows out first, then number every frame in reading order; the
  // lightbox steps through that same sequence.
  let cursor = 0
  const laid = rows.map((row) => {
    let items = photos.slice(cursor, cursor + row.count)
    cursor += row.count
    if (row.swap) items = [items[1], items[0]]
    return { row, items }
  })
  const sequence = laid.flatMap(({ row, items }) => visualOrder(row, items))
  const open = onOpen && ((i, el) => onOpen(i, el, sequence))
  return (
    <div className="exhibition">
      {laid.map(({ row, items }, k) => (
        <Row key={k} row={row} items={items} idx={items.map((p) => sequence.indexOf(p))} onOpen={open} label={label} />
      ))}
    </div>
  )
}
