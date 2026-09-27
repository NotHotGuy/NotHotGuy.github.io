/**
 * Site-wide copy and links. Edit freely — no component logic lives here.
 *
 * Anything marked OWNER is a value only the owner can confirm. Empty strings
 * hide the thing that depends on them instead of showing placeholder text.
 */
export const site = {
  name: 'FocusedAntics',
  url: 'https://nothotguy.github.io',

  // Hero positioning statement — keep it to one short line.
  statement: 'Photographs made at the edge of the light.',

  // OWNER: the area you take bookings in, e.g. "Blacksburg, VA & the New River Valley".
  // Leave empty to hide it.
  serviceArea: 'Virginia',

  instagram: {
    handle: 'focusedantics',
    url: 'https://www.instagram.com/focusedantics/',
    dm: 'https://ig.me/m/focusedantics',
  },

  // OWNER: paste the public Adobe Lightroom album link here. The album card
  // stays hidden until this is filled in.
  lightroomAlbumUrl: '',

  // OWNER: a public booking/contact email. When empty, the booking form
  // hands the finished inquiry over to Instagram DMs instead.
  contactEmail: '',
}

/**
 * Session types shown on Services and offered in the booking form.
 * OWNER: rename, remove or add sessions; `price` is optional ('' hides it);
 * `photo` is a slug from content/photos.js.
 */
export const services = [
  {
    id: 'portrait',
    name: 'Portrait sessions',
    summary: 'Individual portraits built around available light and a location that suits you.',
    includes: [], // OWNER: e.g. ['Edited gallery', '…']
    price: '',
    photo: 'dsc00314',
  },
  {
    id: 'events',
    name: 'Events & performance',
    summary: 'Game days, performances and gatherings, photographed from inside the moment.',
    includes: [], // OWNER: e.g. ['Edited gallery', '…']
    price: '',
    photo: 'dsc04324',
  },
  {
    id: 'creative',
    name: 'Creative & editorial',
    summary: 'Concept-led work for artists, groups and projects that need a distinct image.',
    includes: [], // OWNER: e.g. ['Edited gallery', '…']
    price: '',
    photo: 'dsc03793',
  },
]

/** About page. OWNER: replace with your own words. */
export const about = {
  intro:
    'FocusedAntics is a photography practice that treats every frame as an experiment with light — night skies, game-day brass, quiet portraits and the occasional impossible world.',
  body: [
    'The work moves between a full-frame camera and a phone in a pocket, between stadium noise and still rooms. What connects it is attention: waiting for the moment the light and the subject agree.',
  ],
}
