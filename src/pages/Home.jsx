import { Link } from 'react-router-dom'
import Hero from '../components/Hero.jsx'
import { Row, visualOrder } from '../components/Exhibition.jsx'
import ShaderStage from '../components/ShaderStage.jsx'
import ContactSheet from '../components/ContactSheet.jsx'
import AlbumCard from '../components/AlbumCard.jsx'
import Glass from '../components/Glass.jsx'
import Seo from '../components/Seo.jsx'
import { useLightbox } from '../components/Lightbox.jsx'
import { getPhoto, getPhotos, src } from '../lib/photos.js'
import { home } from '../content/photos.js'
import { services, site } from '../content/site.js'

export default function Home() {
  const openLightbox = useLightbox()
  const rows = home.exhibition.map((row) => ({ ...row, items: getPhotos(row.photos ?? [row.photo]) }))
  const sequence = rows.flatMap((r) => visualOrder(r, r.items))
  const hero = getPhoto(home.hero)

  return (
    <>
      <Seo
        description={`${site.name} — ${site.statement} Photography${site.serviceArea ? ` in ${site.serviceArea}` : ''}: portraits, events and experiments with light.`}
        image={hero && src(hero, hero.widths.find((w) => w >= 1280) ?? hero.widths.at(-1), 'jpg')}
      />
      <Hero />

      <section className="intro wrap" aria-labelledby="selected-title">
        <p className="meta">Selected work</p>
        <h2 id="selected-title" className="display display--l">
          Light, <em>caught in motion</em>
        </h2>
        <Link to="/work" className="link-arrow">
          All galleries <span aria-hidden="true">→</span>
        </Link>
      </section>

      <div className="exhibition">
        {rows.map((row, k) => (
          <Row key={k} row={row} items={row.items} idx={row.items.map((p) => sequence.indexOf(p))} onOpen={(i, el) => openLightbox(sequence, i, el, 'Selected work')} />
        ))}
      </div>

      <ShaderStage preset="ember" className="interlude" aria-labelledby="services-teaser">
        <div className="wrap interlude__inner">
          <p className="meta">Sessions</p>
          <h2 id="services-teaser" className="display display--l">
            Book the light <em>you want to be seen in</em>
          </h2>
          <ul className="interlude__list">
            {services.map((s, i) => (
              <li key={s.id}>
                <Link to={`/services#${s.id}`}>
                  <span className="caption__index">{String(i + 1).padStart(2, '0')}</span>
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="hero__ctas">
            <Glass as={Link} to="/book" className="btn btn--glass btn--primary" radius={999}>
              Book a Session
            </Glass>
            <Link to="/services" className="btn btn--line">
              Services
            </Link>
          </div>
        </div>
      </ShaderStage>

      <ContactSheet />
      <AlbumCard />
    </>
  )
}
