import { useSearchParams } from 'react-router-dom'
import Exhibition from '../components/Exhibition.jsx'
import AlbumCard from '../components/AlbumCard.jsx'
import Glass from '../components/Glass.jsx'
import Seo from '../components/Seo.jsx'
import { useLightbox } from '../components/Lightbox.jsx'
import { allCollections } from '../lib/photos.js'

export default function Work() {
  const collections = allCollections()
  const [params, setParams] = useSearchParams()
  const current = params.get('c')
  const shown = collections.filter((c) => !current || c.id === current)
  const openLightbox = useLightbox()

  const select = (id) => {
    setParams(id ? { c: id } : {}, { replace: true, preventScrollReset: true })
  }

  return (
    <>
      <Seo title="Work" description="Galleries by FocusedAntics — game day, night and light, field notes, experiments and in-game photography." />
      <header className="page-head wrap">
        <p className="meta">Work · {collections.reduce((n, c) => n + c.items.length, 0)} photographs</p>
        <h1 className="display display--xl">Work</h1>
        <Glass as="div" className="filters" radius={999} role="group" aria-label="Filter galleries">
          <button type="button" className={`filter ${!current ? 'is-current' : ''}`} aria-pressed={!current} onClick={() => select(null)}>
            All
          </button>
          {collections.map((c) => (
            <button key={c.id} type="button" className={`filter ${current === c.id ? 'is-current' : ''}`} aria-pressed={current === c.id} onClick={() => select(c.id)}>
              {c.title}
            </button>
          ))}
        </Glass>
      </header>

      {shown.map((c, i) => (
        <section key={c.id} id={c.id} className="collection" aria-labelledby={`${c.id}-title`}>
          <div className="collection__head wrap">
            <span className="caption__index">{String(collections.indexOf(c) + 1).padStart(2, '0')}</span>
            <h2 id={`${c.id}-title`} className="display display--l">
              {c.title}
            </h2>
            <p className="meta">
              FocusedAntics · {c.meta} · {c.items.length} {c.items.length === 1 ? 'frame' : 'frames'}
            </p>
          </div>
          <Exhibition photos={c.items} onOpen={(idx, el, sequence) => openLightbox(sequence, idx, el, c.title)} />
          {i < shown.length - 1 && <hr className="rule wrap" />}
        </section>
      ))}

      <AlbumCard />
    </>
  )
}
