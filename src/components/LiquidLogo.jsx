import { useEffect, useRef, useState } from 'react'
import { allowAmbientGL } from '../lib/device.js'

/**
 * Liquid-metal treatment for the FocusedAntics wordmark.
 *
 * Adapted from liquid-logo (collidingScopes): the wordmark is rasterised into
 * a texture, its edges are detected in the fragment shader, and an iterated
 * cosine vector field + simplex noise flows inside the letterforms, bending
 * around the edges. The original colour stage is replaced with a restrained
 * steel ramp and a trace of the brand accent.
 *
 * The real text stays in the DOM (readable, selectable, indexed) and is only
 * made transparent while the canvas is live. No WebGL / reduced motion /
 * constrained device → the static wordmark is shown unchanged.
 */

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform sampler2D u_logo;
uniform vec2 u_pointer;
uniform vec3 u_accent;

vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

float edgeAt(vec2 uv){
  vec2 px=1.6/u_res;
  float c=texture2D(u_logo,uv).a;
  float d=abs(c-texture2D(u_logo,uv-vec2(px.x,0.)).a)+abs(c-texture2D(u_logo,uv+vec2(px.x,0.)).a)
         +abs(c-texture2D(u_logo,uv-vec2(0.,px.y)).a)+abs(c-texture2D(u_logo,uv+vec2(0.,px.y)).a);
  return smoothstep(0.,.9,d);
}

void main(){
  vec2 uv=gl_FragCoord.xy/u_res; uv.y=1.-uv.y;
  float a=texture2D(u_logo,uv).a;
  if(a<.01) discard;
  float e=edgeAt(uv);
  vec2 p=(gl_FragCoord.xy*2.-u_res)/u_res.y;
  float t=u_time;

  // Vector field (liquid-logo), deflected by the letter edges and the pointer.
  vec2 v=p*.55+u_pointer*.4;
  v+=vec2(sin(e*10.),cos(e*8.))*e*.5;
  v+=snoise(vec3(p*1.4,t*.1))*.32;
  float acc=0.;
  for(float i=1.;i<8.;i++){
    v+=cos(v.yx*i+vec2(0.,i)+t)/i*.5;
    acc+=(sin(v.x+v.y)+1.)*.5/i;
  }
  float m=acc/2.6;

  // Reflection bands sliding across a curved metal surface.
  float band=sin(m*8.+p.x*.9-t*.35)*.5+.5;
  float lum=mix(.16,1.,pow(band,1.5));
  vec3 col=mix(vec3(.06,.06,.07),vec3(.66,.67,.70),lum);
  col=mix(col,vec3(1.,.975,.94),smoothstep(.8,1.,lum));
  col=mix(col,u_accent,smoothstep(.45,.7,band)*(1.-smoothstep(.7,.95,band))*.28);
  col+=e*vec3(.55,.56,.6)*.55;

  float g=fract(sin(dot(gl_FragCoord.xy+fract(t),vec2(12.9898,78.233)))*43758.5453)*.05-.025;
  col+=g;
  gl_FragColor=vec4(clamp(col,0.,1.)*a,a);
}`

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

/** Rasterise the live DOM text (same fonts, same positions) into a canvas. */
function rasteriseText(container, dpr) {
  const box = container.getBoundingClientRect()
  const c = document.createElement('canvas')
  c.width = Math.round(box.width * dpr)
  c.height = Math.round(box.height * dpr)
  const ctx = c.getContext('2d')
  ctx.scale(dpr, dpr)
  ctx.fillStyle = '#fff'
  ctx.textBaseline = 'alphabetic'
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent
    if (!text.trim()) continue
    const cs = getComputedStyle(node.parentElement)
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
    if ('letterSpacing' in ctx) ctx.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing
    // Draw glyph by glyph at the browser's own layout positions.
    for (let i = 0; i < text.length; i++) {
      if (text[i] === ' ') continue
      range.setStart(node, i)
      range.setEnd(node, i + 1)
      const r = range.getBoundingClientRect()
      const metrics = ctx.measureText(text[i])
      const baseline = r.top - box.top + (r.height + metrics.fontBoundingBoxAscent - metrics.fontBoundingBoxDescent) / 2
      ctx.fillText(text[i], r.left - box.left, baseline)
    }
  }
  return c
}

export default function LiquidLogo({ children, className = '', accent = '#E3A857' }) {
  const wrap = useRef(null)
  const canvasRef = useRef(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    if (!allowAmbientGL()) return
    const el = wrap.current
    const canvas = canvasRef.current
    const textEl = el.querySelector('[data-liquid-text]')
    let disposed = false
    let raf = 0
    let visible = false
    let gl
    let cleanup = () => {}

    const start = async () => {
      await document.fonts.ready
      if (disposed) return
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      gl = canvas.getContext('webgl', { premultipliedAlpha: true, antialias: false, alpha: true })
      if (!gl) return

      const compile = (type, src) => {
        const s = gl.createShader(type)
        gl.shaderSource(s, src)
        gl.compileShader(s)
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s))
        return s
      }
      const prog = gl.createProgram()
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
      gl.linkProgram(prog)
      gl.useProgram(prog)
      const buf = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
      const loc = gl.getAttribLocation(prog, 'a')
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
      const U = (n) => gl.getUniformLocation(prog, n)
      const uRes = U('u_res')
      const uTime = U('u_time')
      const uPointer = U('u_pointer')
      gl.uniform3fv(U('u_accent'), hexToRgb(accent))
      gl.uniform1i(U('u_logo'), 0)

      const tex = gl.createTexture()
      const upload = () => {
        const src = rasteriseText(textEl, dpr)
        canvas.width = src.width
        canvas.height = src.height
        gl.viewport(0, 0, src.width, src.height)
        gl.uniform2f(uRes, src.width, src.height)
        gl.bindTexture(gl.TEXTURE_2D, tex)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src)
      }
      upload()

      // Pointer response: eased toward the cursor, relative to the wordmark.
      const target = [0, 0]
      const pointer = [0, 0]
      const onMove = (e) => {
        const r = el.getBoundingClientRect()
        target[0] = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1))
        target[1] = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1))
      }
      window.addEventListener('pointermove', onMove, { passive: true })

      let last = performance.now()
      let t = 0
      const frame = (now) => {
        raf = 0
        if (!visible || document.hidden) return
        t += Math.min(now - last, 50) * 0.00022 // slow, continuous
        last = now
        pointer[0] += (target[0] - pointer[0]) * 0.04
        pointer[1] += (target[1] - pointer[1]) * 0.04
        gl.uniform1f(uTime, t)
        gl.uniform2f(uPointer, pointer[0], -pointer[1])
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        raf = requestAnimationFrame(frame)
      }
      const resume = () => {
        if (!raf && visible && !document.hidden) {
          last = performance.now()
          raf = requestAnimationFrame(frame)
        }
      }

      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        resume()
      })
      io.observe(el)
      document.addEventListener('visibilitychange', resume)
      let resizeTimer
      const ro = new ResizeObserver(() => {
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(() => !disposed && upload(), 120)
      })
      ro.observe(textEl)

      visible = true
      resume()
      setLive(true)

      cleanup = () => {
        cancelAnimationFrame(raf)
        io.disconnect()
        ro.disconnect()
        clearTimeout(resizeTimer)
        window.removeEventListener('pointermove', onMove)
        document.removeEventListener('visibilitychange', resume)
        gl.getExtension('WEBGL_lose_context')?.loseContext()
      }
    }

    start().catch((err) => {
      if (import.meta.env.DEV) console.warn('[LiquidLogo] falling back to static wordmark:', err)
      setLive(false)
    })
    return () => {
      disposed = true
      cleanup()
    }
  }, [accent])

  return (
    <span ref={wrap} className={`liquid-logo ${live ? 'is-live' : ''} ${className}`}>
      <canvas ref={canvasRef} className="liquid-logo__canvas" aria-hidden="true" />
      <span data-liquid-text className="liquid-logo__text">
        {children}
      </span>
    </span>
  )
}
