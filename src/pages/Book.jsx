import { useId, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Glass from '../components/Glass.jsx'
import Seo from '../components/Seo.jsx'
import ShaderStage from '../components/ShaderStage.jsx'
import { services, site } from '../content/site.js'

/**
 * Booking enquiry. There is no server: the enquiry is composed here and sent
 * through the owner's own channel — an email draft when site.contactEmail is
 * set, otherwise copied and handed to an Instagram DM. Nothing is stored or
 * sent to a third party by this page.
 */
export default function Book() {
  const [params] = useSearchParams()
  const initial = services.some((s) => s.id === params.get('session')) ? params.get('session') : services[0]?.id
  const [values, setValues] = useState({ name: '', email: '', session: initial ?? '', date: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')
  const id = useId()

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!values.name.trim()) e.name = 'Please add your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = 'Please add an email address so a reply can reach you.'
    if (!values.message.trim()) e.message = 'A sentence or two about what you have in mind helps.'
    setErrors(e)
    return e
  }

  const compose = () => {
    const session = services.find((s) => s.id === values.session)?.name ?? values.session
    return [
      `Booking enquiry — ${session}`,
      '',
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      values.date && `Preferred date: ${values.date}`,
      '',
      values.message,
    ]
      .filter((l) => l !== false && l !== undefined)
      .join('\n')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      document.getElementById(`${id}-${Object.keys(errs)[0]}`)?.focus()
      setStatus('')
      return
    }
    const body = compose()
    if (site.contactEmail) {
      const subject = body.split('\n')[0]
      window.location.href = `mailto:${site.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      setStatus('Your email app should open with the enquiry ready to send.')
      return
    }
    let copied = false
    try {
      await navigator.clipboard.writeText(body)
      copied = true
    } catch {}
    window.open(site.instagram.dm, '_blank', 'noopener,noreferrer')
    setStatus(
      copied
        ? `Your enquiry is copied. Paste it into the Instagram message to @${site.instagram.handle} that just opened.`
        : `Instagram should have opened in a new tab. Copy your enquiry below into a message to @${site.instagram.handle}.`,
    )
  }

  const field = (k) => ({
    id: `${id}-${k}`,
    name: k,
    value: values[k],
    onChange: set(k),
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? `${id}-${k}-err` : undefined,
  })
  const err = (k) =>
    errors[k] && (
      <p id={`${id}-${k}-err`} className="field__error">
        {errors[k]}
      </p>
    )

  return (
    <>
      <Seo title="Book a session" description={`Enquire about a photography session with ${site.name}.`} />
      <ShaderStage preset="night" className="book" as="div">
        <div className="wrap book__inner">
          <header className="book__head">
            <p className="meta">Book{site.serviceArea ? ` · ${site.serviceArea}` : ''}</p>
            <h1 className="display display--xl">
              Book <em>a session</em>
            </h1>
            <p className="book__lede">Tell me what you’re imagining — a few lines is plenty.</p>
          </header>

          <form className="form" onSubmit={onSubmit} noValidate>
            <div className="field">
              <label htmlFor={`${id}-name`}>Name</label>
              <input type="text" autoComplete="name" required {...field('name')} />
              {err('name')}
            </div>
            <div className="field">
              <label htmlFor={`${id}-email`}>Email</label>
              <input type="email" autoComplete="email" inputMode="email" required {...field('email')} />
              {err('email')}
            </div>
            <fieldset className="field field--choices">
              <legend>Session</legend>
              <div className="choices">
                {services.map((s) => (
                  <label key={s.id} className={`choice ${values.session === s.id ? 'is-checked' : ''}`}>
                    <input type="radio" name="session" value={s.id} checked={values.session === s.id} onChange={set('session')} />
                    {s.name}
                  </label>
                ))}
                <label className={`choice ${values.session === 'other' ? 'is-checked' : ''}`}>
                  <input type="radio" name="session" value="other" checked={values.session === 'other'} onChange={set('session')} />
                  Something else
                </label>
              </div>
            </fieldset>
            <div className="field">
              <label htmlFor={`${id}-date`}>
                Preferred date <span className="field__hint">(optional)</span>
              </label>
              <input type="date" {...field('date')} />
            </div>
            <div className="field field--wide">
              <label htmlFor={`${id}-message`}>What do you have in mind?</label>
              <textarea rows={5} required {...field('message')} />
              {err('message')}
            </div>
            <div className="form__actions">
              <Glass as="button" type="submit" className="btn btn--glass btn--primary" radius={999}>
                {site.contactEmail ? 'Send enquiry' : 'Send via Instagram'}
              </Glass>
              {!site.contactEmail && <p className="field__hint">Opens a message to @{site.instagram.handle} with your enquiry copied, ready to paste.</p>}
            </div>
            <p className="form__status" role="status" aria-live="polite">
              {status}
            </p>
            {status && !site.contactEmail && <textarea className="form__copy" readOnly value={compose()} aria-label="Your enquiry" rows={6} />}
          </form>
        </div>
      </ShaderStage>
    </>
  )
}
