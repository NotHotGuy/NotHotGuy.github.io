import { lazy, Suspense, useEffect, useState } from 'react'
import { useInView } from '../lib/hooks.js'
import { allowAmbientGL } from '../lib/device.js'

const ShaderField = lazy(() => import('./ShaderField.jsx'))

/**
 * A section lit by the ambient shader. The static CSS gradient underneath is
 * the complete design; WebGL is layered on only when the section approaches
 * the viewport and the device can afford it, then paused whenever it leaves.
 */
export default function ShaderStage({ preset = 'ember', className = '', children, as: Tag = 'section', ...rest }) {
  const [ref, near] = useInView({ rootMargin: '300px 0px' })
  const [enabled, setEnabled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => setEnabled(allowAmbientGL()), [])
  useEffect(() => {
    if (enabled && near) setMounted(true)
  }, [enabled, near])
  useEffect(() => {
    if (!mounted) return
    const t = setTimeout(() => setReady(true), 400) // let the first frames settle before fading in
    return () => clearTimeout(t)
  }, [mounted])

  return (
    <Tag ref={ref} className={`stage stage--${preset} ${ready ? 'is-lit' : ''} ${className}`} {...rest}>
      <div className="stage__light" aria-hidden="true">
        {mounted && (
          <Suspense fallback={null}>
            <ShaderField preset={preset} active={near} />
          </Suspense>
        )}
      </div>
      <div className="stage__content">{children}</div>
    </Tag>
  )
}
