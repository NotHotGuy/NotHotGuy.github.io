import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'

export default function NotFound() {
  return (
    <>
      <Seo title="Out of focus" />
      <header className="page-head page-head--center wrap">
        <p className="meta">404</p>
        <h1 className="display display--xl notfound">
          Out of <em>focus</em>
        </h1>
        <p>This frame doesn’t exist.</p>
        <Link to="/" className="link-arrow">
          Back to the start <span aria-hidden="true">→</span>
        </Link>
      </header>
    </>
  )
}
