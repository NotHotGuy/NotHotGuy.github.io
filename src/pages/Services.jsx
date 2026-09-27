import { Link } from 'react-router-dom'
import Photo from '../components/Photo.jsx'
import Glass from '../components/Glass.jsx'
import Seo from '../components/Seo.jsx'
import ShaderStage from '../components/ShaderStage.jsx'
import { getPhoto } from '../lib/photos.js'
import { services, site } from '../content/site.js'

export default function Services() {
  return (
    <>
      <Seo title="Services" description={`Portrait, event and creative photography sessions with ${site.name}${site.serviceArea ? ` in ${site.serviceArea}` : ''}.`} />
      <header className="page-head wrap">
        <p className="meta">Services{site.serviceArea ? ` · ${site.serviceArea}` : ''}</p>
        <h1 className="display display--xl">
          Sessions, <em>made to measure</em>
        </h1>
      </header>

      <div className="services">
        {services.map((s, i) => {
          const photo = s.photo && getPhoto(s.photo)
          return (
            <article key={s.id} id={s.id} className={`service ${i % 2 ? 'is-flipped' : ''} ${photo ? `service--${photo.orientation}` : ''}`} aria-labelledby={`${s.id}-name`}>
              {photo && (
                <div className="service__photo" data-reveal>
                  <Photo photo={photo} sizes={photo.orientation === 'portrait' ? '(max-width: 760px) 90vw, 30vw' : '(max-width: 760px) 100vw, 44vw'} />
                </div>
              )}
              <div className="service__body">
                <span className="caption__index">{String(i + 1).padStart(2, '0')}</span>
                <h2 id={`${s.id}-name`} className="display display--m">
                  {s.name}
                </h2>
                <p className="service__summary">{s.summary}</p>
                {s.includes?.length > 0 && (
                  <ul className="service__includes">
                    {s.includes.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                )}
                <p className="service__price meta">{s.price || 'Pricing on request'}</p>
                <Link to={`/book?session=${s.id}`} className="link-arrow">
                  Enquire about {s.name.toLowerCase()} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          )
        })}
      </div>

      <ShaderStage preset="night" className="interlude interlude--short">
        <div className="wrap interlude__inner">
          <h2 className="display display--l">
            Have something <em>in mind?</em>
          </h2>
          <Glass as={Link} to="/book" className="btn btn--glass btn--primary" radius={999}>
            Book a Session
          </Glass>
        </div>
      </ShaderStage>
    </>
  )
}
