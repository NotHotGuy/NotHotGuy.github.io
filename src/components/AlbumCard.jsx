import Photo from './Photo.jsx'
import Glass from './Glass.jsx'
import { getPhoto } from '../lib/photos.js'
import { home } from '../content/photos.js'
import { site } from '../content/site.js'

/**
 * The full-resolution album lives in Adobe Lightroom. This card is a doorway,
 * not a copy: no iframe, no reproduction of the gallery.
 * Hidden until site.lightroomAlbumUrl is set.
 */
export default function AlbumCard() {
  if (!site.lightroomAlbumUrl) return null
  const photo = getPhoto(home.album)
  return (
    <section className="album wrap" aria-labelledby="album-title">
      <a className="album__card" href={site.lightroomAlbumUrl} target="_blank" rel="noopener noreferrer">
        <div className="album__image">
          <Photo photo={photo} fit="cover" sizes="(max-width: 760px) 100vw, 60vw" />
        </div>
        <div className="album__body">
          <p className="meta">Adobe Lightroom · Full resolution</p>
          <h2 id="album-title" className="display display--m">
            The complete album
          </h2>
          <p className="album__text">These pages are a curated edit. Every frame, at full resolution, is in the Lightroom album.</p>
          <Glass as="span" className="btn btn--glass btn--primary" radius={999}>
            View Full Album <span aria-hidden="true">↗</span>
          </Glass>
          <span className="sr-only">(opens Adobe Lightroom in a new tab)</span>
        </div>
      </a>
    </section>
  )
}
