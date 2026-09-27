import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import { LightboxProvider } from './components/Lightbox.jsx'
import Home from './pages/Home.jsx'
import { prefersReducedMotion } from './lib/device.js'

// Secondary pages are split out of the first-load bundle.
const Work = lazy(() => import('./pages/Work.jsx'))
const Services = lazy(() => import('./pages/Services.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const Book = lazy(() => import('./pages/Book.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

/** New page → top of the page (or the #hash target), and move focus for screen readers. */
function RouteEffects() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' }))
      return
    }
    window.scrollTo(0, 0)
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [pathname, hash])
  return null
}

/** One pointer position for every glass surface's moving highlight. */
function useEnvironmentLight() {
  useEffect(() => {
    if (prefersReducedMotion()) return
    let raf = 0
    const onMove = (e) => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const r = document.documentElement.style
        r.setProperty('--px', (e.clientX / window.innerWidth).toFixed(3))
        r.setProperty('--py', (e.clientY / window.innerHeight).toFixed(3))
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
}

export default function App() {
  useEnvironmentLight()
  return (
    <BrowserRouter>
      <LightboxProvider>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Nav />
        <RouteEffects />
        <main id="main" tabIndex={-1}>
          <Suspense fallback={<div className="page-loading" aria-hidden="true" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/work" element={<Work />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/book" element={<Book />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </LightboxProvider>
    </BrowserRouter>
  )
}
