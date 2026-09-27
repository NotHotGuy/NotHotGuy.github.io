import { Link } from 'react-router-dom'
import BrandMark from './BrandMark.jsx'
import { site } from '../content/site.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <Link to="/" className="footer__brand" aria-label="FocusedAntics — home">
          <BrandMark />
        </Link>
        <nav aria-label="Footer" className="footer__nav">
          <Link to="/work">Work</Link>
          <Link to="/services">Services</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/book">Book</Link>
          <a href={site.instagram.url} target="_blank" rel="noopener noreferrer">
            Instagram <span aria-hidden="true">↗</span>
          </a>
        </nav>
        <p className="meta meta--dim footer__legal">
          © {new Date().getFullYear()} {site.name}. All photographs are the property of {site.name} and may not be reused without permission.
        </p>
      </div>
    </footer>
  )
}
