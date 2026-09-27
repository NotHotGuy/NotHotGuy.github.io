import Photo from './Photo.jsx'
import { getPhoto } from '../lib/photos.js'
import { site } from '../content/site.js'

/**
 * Full-resolution albums live in Adobe Lightroom. These are doorways, not
 * copies: no iframe, no reproduction of the galleries.
 */
export default function Albums() {
  const albums = (site.albums ?? []).filter((a) => a.url)
  if (!albums.length) return null
  return (
    <section id="albums" className="albums wrap" aria-labelledby="albums-title">
      <div className="collection__head albums__head">
        <span className="caption__index">↗</span>
        <h2 id="albums-title" className="display display--l">
          Albums
        </h2>
        <p className="meta">Full resolution · Adobe Lightroom</p>
      </div>
      <p className="albums__lede">These pages are a curated edit. The complete sets, at full resolution, live in Lightroom.</p>
      <ul className="albums__grid">
        {albums.map((a, i) => {
          const photo = a.cover && getPhoto(a.cover)
          return (
            <li key={a.url}>
              <a className="album-tile" href={a.url} target="_blank" rel="noopener noreferrer">
                <span className="album-tile__image">{photo && <Photo photo={photo} fit="cover" sizes="(max-width: 760px) 100vw, 31vw" />}</span>
                <span className="album-tile__body">
                  <span className="caption__index">{String(i + 1).padStart(2, '0')}</span>
                  <span className="album-tile__title display display--m">{a.title}</span>
                  {a.meta && <span className="meta">{a.meta}</span>}
                  <span className="album-tile__cta">
                    View Full Album <span aria-hidden="true">↗</span>
                  </span>
                  <span className="sr-only">(opens Adobe Lightroom in a new tab)</span>
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
