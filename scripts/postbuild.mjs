/**
 * After `vite build`: make the SPA work as a static GitHub Pages site.
 *  - every route gets its own index.html (deep links load with HTTP 200)
 *  - 404.html renders the app's own "Out of focus" page
 *  - the hero photograph is preloaded on the homepage
 *  - sitemap.xml + .nojekyll
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { home } from '../src/content/photos.js'
import { site } from '../src/content/site.js'

const ROOT = path.resolve(import.meta.dirname, '..')
const DIST = path.join(ROOT, 'dist')
const ROUTES = ['work', 'services', 'about', 'contact', 'book']

const manifest = JSON.parse(await fs.readFile(path.join(ROOT, 'src/content/photos.generated.json'), 'utf8'))
let html = await fs.readFile(path.join(DIST, 'index.html'), 'utf8')

const hero = manifest[home.hero]
const heroPreload = hero
  ? `<link rel="preload" as="image" type="image/avif" fetchpriority="high" imagesizes="100vw" imagesrcset="${hero.widths
      .map((w) => `/photos/${hero.slug}/${hero.slug}-${w}.avif ${w}w`)
      .join(', ')}" />`
  : ''
const ogImage = hero ? `<meta property="og:image" content="${site.url}/photos/${hero.slug}/${hero.slug}-${hero.widths.find((w) => w >= 1280) ?? hero.widths.at(-1)}.jpg" />` : ''

await fs.writeFile(path.join(DIST, 'index.html'), html.replace('<!--hero-preload-->', `${heroPreload}\n    ${ogImage}`))
html = html.replace('<!--hero-preload-->', ogImage)
for (const r of ROUTES) {
  await fs.mkdir(path.join(DIST, r), { recursive: true })
  await fs.writeFile(path.join(DIST, r, 'index.html'), html)
}
await fs.writeFile(path.join(DIST, '404.html'), html)
await fs.writeFile(path.join(DIST, '.nojekyll'), '')

const urls = ['', ...ROUTES].map((r) => `  <url><loc>${site.url}/${r ? r + '/' : ''}</loc></url>`).join('\n')
await fs.writeFile(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
console.log(`postbuild: ${ROUTES.length} route pages, 404.html, sitemap.xml${heroPreload ? ', hero preload' : ''}`)
