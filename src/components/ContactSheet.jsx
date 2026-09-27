import Photo from './Photo.jsx'
import Glass from './Glass.jsx'
import { getPhotos } from '../lib/photos.js'
import { home } from '../content/photos.js'
import { site } from '../content/site.js'

/**
 * Instagram as a continuation of the portfolio: a strip of frames laid out
 * like a contact sheet. Each frame "develops" from negative to positive as it
 * scrolls into view (CSS scroll-driven animation; static where unsupported).
 * No embed, widget or API — just local photographs and an outbound link.
 */
export default function ContactSheet() {
  const photos = getPhotos(home.social)
  return (
    <section className="sheet" aria-labelledby="sheet-title">
      <div className="sheet__head wrap">
        <p className="meta">Contact sheet</p>
        <h2 id="sheet-title" className="display display--m">
          Between frames, <em>on Instagram</em>
        </h2>
      </div>
      <a className="sheet__strip" href={site.instagram.url} target="_blank" rel="noopener noreferrer" aria-label={`@${site.instagram.handle} on Instagram (opens in a new tab)`}>
        <ol className="sheet__frames">
          {photos.map((p, i) => (
            <li key={p.slug} className="sheet__frame">
              <Photo photo={p} fit="cover" sizes="(max-width: 760px) 44vw, 16vw" className="develop" />
              <span className="sheet__mark" aria-hidden="true">
                FA {String(i + 1).padStart(2, '0')}
                <span>▸</span>
                {String(i + 1).padStart(2, '0')}A
              </span>
            </li>
          ))}
        </ol>
      </a>
      <div className="wrap sheet__foot">
        <Glass as="a" href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn--glass" radius={999}>
          @{site.instagram.handle} <span aria-hidden="true">↗</span>
          <span className="sr-only">(opens Instagram in a new tab)</span>
        </Glass>
      </div>
    </section>
  )
}
