import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import Glass from './Glass.jsx'
import BrandMark from './BrandMark.jsx'

const LINKS = [
  { to: '/work', label: 'Work' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const toggleRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => setOpen(false), [location.pathname])

  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector('a')?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const cls = ({ isActive }) => `nav__link ${isActive ? 'is-current' : ''}`

  return (
    <header className="nav">
      <Glass as="nav" className="nav__bar" aria-label="Primary" radius={999}>
        <Link to="/" viewTransition className="nav__brand" aria-label="FocusedAntics — home">
          <BrandMark />
        </Link>
        <ul className="nav__links">
          {LINKS.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} className={cls} viewTransition>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <NavLink to="/book" viewTransition className={({ isActive }) => `nav__book ${isActive ? 'is-current' : ''}`}>
          Book
        </NavLink>
        <button
          ref={toggleRef}
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="nav-panel"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="nav__toggle-icon" aria-hidden="true" />
          <span className="nav__toggle-label">{open ? 'Close' : 'Menu'}</span>
        </button>
      </Glass>

      <Glass as="div" id="nav-panel" ref={panelRef} className={`nav__panel ${open ? 'is-open' : ''}`} radius={28} hidden={!open}>
        <ul>
          {[...LINKS, { to: '/book', label: 'Book a session' }].map((l, i) => (
            <li key={l.to} style={{ '--i': i }}>
              <NavLink to={l.to} className={cls} viewTransition>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </Glass>
    </header>
  )
}
