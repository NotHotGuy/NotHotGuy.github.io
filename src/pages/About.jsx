import { Link } from 'react-router-dom'
import Photo from '../components/Photo.jsx'
import Glass from '../components/Glass.jsx'
import Seo from '../components/Seo.jsx'
import { useLightbox } from '../components/Lightbox.jsx'
import { allCollections, getPhotos } from '../lib/photos.js'
import manifest from '../content/photos.generated.json'
import { about, site } from '../content/site.js'

/** Everything factual on this page is read from the photographs themselves. */
function facts() {
  const cameras = new Map()
  const lenses = new Map()
  const years = []
  for (const m of Object.values(manifest)) {
    const e = m.exif
    if (e?.camera) cameras.set(e.camera, (cameras.get(e.camera) ?? 0) + 1)
    if (e?.lens && e.camera && !/iPhone/.test(e.camera)) lenses.set(e.lens, (lenses.get(e.lens) ?? 0) + 1)
    if (e?.year) years.push(e.year)
  }
  const sort = (m) => [...m.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => k)
  return { cameras: sort(cameras), lenses: sort(lenses), since: years.length ? Math.min(...years) : null }
}

export default function About() {
  const collections = allCollections()
  const frames = collections.reduce((n, c) => n + c.items.length, 0)
  const { cameras, lenses, since } = facts()
  const collage = getPhotos(about.collage ?? [])
  const openLightbox = useLightbox()
  const subjects = (about.subjects ?? [])
    .map((s) => ({ ...s, c: collections.find((c) => c.id === s.collection) }))
    .filter((s) => s.c)

  return (
    <>
      <Seo title="About" description={about.intro} />
      <header className="page-head wrap about-head">
        <p className="meta">About{about.name ? ` · ${about.name}` : ''}</p>
        <h1 className="display display--xl">
          {about.headline?.[0]}
          {about.headline?.[1] && (
            <>
              <br />
              <em>{about.headline[1]}</em>
            </>
          )}
        </h1>
      </header>

      {collage.length > 0 && (
        <section className="about-collage wrap" aria-label="A few frames">
          {collage.map((p, i) => (
            <figure key={p.slug} className={`about-collage__frame about-collage__frame--${i}`} data-reveal>
              <Photo photo={p} sizes="(max-width: 760px) 90vw, 40vw" onOpen={(ph, el) => openLightbox(collage, i, el, 'About')} />
            </figure>
          ))}
        </section>
      )}

      <section className="about wrap">
        <div className="about__text">
          <p className="about__intro">
            {about.name && <>I’m {about.name}. </>}
            {about.intro}
          </p>
          {about.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <dl className="about__stats">
          <div>
            <dt className="meta">Frames here</dt>
            <dd>{frames}</dd>
          </div>
          <div>
            <dt className="meta">Collections</dt>
            <dd>{collections.length}</dd>
          </div>
          {since && (
            <div>
              <dt className="meta">Shooting since</dt>
              <dd>{since}</dd>
            </div>
          )}
        </dl>
      </section>

      {subjects.length > 0 && (
        <section className="subjects wrap" aria-labelledby="subjects-title">
          <p className="meta" id="subjects-title">
            What I shoot
          </p>
          <ul className="subjects__list">
            {subjects.map((s, i) => (
              <li key={s.collection}>
                <Link to={`/work?c=${s.collection}`} className="subject" viewTransition>
                  <span className="caption__index">{String(i + 1).padStart(2, '0')}</span>
                  <span className="subject__title display display--m">{s.c.title}</span>
                  <span className="subject__line">{s.line}</span>
                  <span className="subject__count meta">
                    {s.c.items.length} frames <span aria-hidden="true">→</span>
                  </span>
                  <span className="subject__peek" aria-hidden="true">
                    <Photo photo={s.c.items[0]} fit="cover" sizes="220px" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(cameras.length > 0 || lenses.length > 0) && (
        <section className="kit-band wrap" aria-labelledby="kit-title">
          <p className="meta" id="kit-title">
            In the bag
          </p>
          <dl className="kit">
            {cameras.length > 0 && (
              <div>
                <dt className="meta meta--dim">Cameras</dt>
                {cameras.map((c) => (
                  <dd key={c}>{c}</dd>
                ))}
              </div>
            )}
            {lenses.length > 0 && (
              <div>
                <dt className="meta meta--dim">Lenses</dt>
                {lenses.map((l) => (
                  <dd key={l}>{l}</dd>
                ))}
              </div>
            )}
          </dl>
        </section>
      )}

      <section className="about-cta wrap">
        <h2 className="display display--l">
          Let’s make <em>something loud.</em>
        </h2>
        <div className="hero__ctas">
          <Glass as={Link} to="/book" className="btn btn--glass btn--primary" radius={999}>
            Book a Session
          </Glass>
          <a className="btn btn--line" href={site.instagram.url} target="_blank" rel="noopener noreferrer">
            @{site.instagram.handle} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </>
  )
}
