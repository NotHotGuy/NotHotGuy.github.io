import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react'
import { isSmallScreen, isLowPower } from '../lib/device.js'

/**
 * Environmental light, not wallpaper. A single ShaderGradient (React Three
 * Fiber + three.js underneath) tuned dark, low-saturation and slow, coloured
 * from the photographs' palette: tungsten amber, stadium maroon, night blue.
 *
 * This module is only ever loaded through React.lazy, so three.js is not part
 * of the initial bundle, and the render loop stops whenever it is off-screen.
 */

/** Stops R3F's render loop while the section is off-screen or the tab is hidden. */
function FrameGate({ active }) {
  const setFrameloop = useThree((s) => s.setFrameloop)
  useEffect(() => {
    const apply = () => setFrameloop(active && !document.hidden ? 'always' : 'never')
    apply()
    document.addEventListener('visibilitychange', apply)
    return () => document.removeEventListener('visibilitychange', apply)
  }, [active, setFrameloop])
  return null
}

export const presets = {
  // Behind the services / statement band: tungsten amber into stadium maroon.
  ember: { color1: '#8a5428', color2: '#2a1414', color3: '#141018', brightness: 1.1, uStrength: 2.2, uDensity: 1.2, uFrequency: 4.5, rotationZ: 50, positionX: -1.4, cPolarAngle: 90, cDistance: 3.6 },
  // Around booking: the hero's night blue with a warm edge.
  night: { color1: '#1c2a44', color2: '#0c0e14', color3: '#34220f', brightness: 0.9, uStrength: 2, uDensity: 1.1, uFrequency: 4, rotationZ: 50, positionX: -1.4, cPolarAngle: 90, cDistance: 3.6 },
}

export default function ShaderField({ preset = 'ember', active = true }) {
  const p = presets[preset] ?? presets.ember
  const small = isSmallScreen()
  return (
    <ShaderGradientCanvas
      style={{ position: 'absolute', inset: 0 }}
      pixelDensity={small || isLowPower() ? 0.6 : 1}
      fov={45}
      lazyLoad={false}
      pointerEvents="none"
      powerPreference="low-power"
    >
      <FrameGate active={active} />
      <ShaderGradient
        control="props"
        type="plane"
        animate="on"
        uSpeed={0.08}
        uAmplitude={0}
        cAzimuthAngle={180}
        positionY={0}
        positionZ={0}
        rotationX={0}
        rotationY={10}
        lightType="3d"
        grain="off"
        reflection={0.1}
        {...p}
      />
    </ShaderGradientCanvas>
  )
}
