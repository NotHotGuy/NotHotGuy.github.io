import Photo from '../components/Photo.jsx'
import Seo from '../components/Seo.jsx'
import { getPhoto } from '../lib/photos.js'
import manifest from '../content/photos.generated.json'
import { about, site } from '../content/site.js'

/** Kit list read from the photographs' own EXIF — nothing typed by hand. */
function kit() {
  const cameras = new Map()
  const lenses = new Map()
  for (const m of Object.values(manifest)) {
    const e = m.exif
    if (e?.camera) cameras.set(e.camera, (cameras.get(e.camera) ?? 0) + 1)
    if (e?.lens && e.camera && !/iPhone/.test(e.camera)) lenses.set(e.lens, (lenses.get(e.lens) ?? 0) + 1)
  }
  const sort = (m) => [...m.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => k)
  return { cameras: sort(cameras), lenses: sort(lenses) }
}

export default function About() {
  const photo = getPhoto('img-1370')
  const { cameras, lenses } = kit()
  return (
    <>
      <Seo title="About" description={about.intro} />
      <header className="page-head wrap">
        <p className="meta">About</p>
        <h1 className="display display--xl">
          Attention, <em>mostly</em>
        </h1>
      </header>
      <section className="about wrap">
        <div className="about__text">
          <p className="about__intro">{about.intro}</p>
          {about.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {(cameras.length > 0 || lenses.length > 0) && (
            <dl className="kit">
              {cameras.length > 0 && (
                <div>
                  <dt className="meta">Cameras</dt>
                  {cameras.map((c) => (
                    <dd key={c}>{c}</dd>
                  ))}
                </div>
              )}
              {lenses.length > 0 && (
                <div>
                  <dt className="meta">Lenses</dt>
                  {lenses.map((l) => (
                    <dd key={l}>{l}</dd>
                  ))}
                </div>
              )}
            </dl>
          )}
          <p>
            <a className="link-arrow" href={site.instagram.url} target="_blank" rel="noopener noreferrer">
              @{site.instagram.handle} on Instagram <span aria-hidden="true">↗</span>
            </a>
          </p>
        </div>
        {photo && (
          <figure className="about__photo" data-reveal>
            <Photo photo={photo} sizes="(max-width: 760px) 80vw, 30vw" />
          </figure>
        )}
      </section>
    </>
  )
}
