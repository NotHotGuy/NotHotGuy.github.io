import { useLocation } from 'react-router-dom'
import { site } from '../content/site.js'

/** Per-page head tags (React 19 hoists these into <head>). */
export default function Seo({ title, description, image }) {
  const { pathname } = useLocation()
  const full = title ? `${title} — ${site.name}` : `${site.name} — Photography`
  const url = site.url + pathname
  return (
    <>
      <title>{full}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      <meta property="og:title" content={full} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={site.url + image} />}
    </>
  )
}
