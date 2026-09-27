import { Link } from 'react-router-dom'
import Glass from '../components/Glass.jsx'
import Seo from '../components/Seo.jsx'
import { site } from '../content/site.js'

export default function Contact() {
  return (
    <>
      <Seo title="Contact" description={`Get in touch with ${site.name}.`} />
      <header className="page-head wrap">
        <p className="meta">Contact</p>
        <h1 className="display display--xl">
          Say <em>hello</em>
        </h1>
      </header>
      <section className="contact wrap">
        <ul className="contact__list">
          <li>
            <span className="meta">Instagram</span>
            <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="contact__value">
              @{site.instagram.handle} <span aria-hidden="true">↗</span>
            </a>
          </li>
          {site.contactEmail && (
            <li>
              <span className="meta">Email</span>
              <a href={`mailto:${site.contactEmail}`} className="contact__value">
                {site.contactEmail}
              </a>
            </li>
          )}
          {site.serviceArea && (
            <li>
              <span className="meta">Based in</span>
              <span className="contact__value">{site.serviceArea}</span>
            </li>
          )}
        </ul>
        <div className="contact__cta">
          <p>For sessions and dates, the booking form is the quickest route.</p>
          <Glass as={Link} to="/book" className="btn btn--glass btn--primary" radius={999}>
            Book a Session
          </Glass>
        </div>
      </section>
    </>
  )
}
