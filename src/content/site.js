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

/**
 * About page. Written in the first person so it reads as you.
 * OWNER: make it yours — every line here is editable, and `name` (empty by
 * default) adds "I'm <name>" to the intro when filled in.
 */
export const about = {
  name: '',
  headline: ['Focused on people.', 'Antics welcome.'],
  intro:
    'I photograph the moments people forget to pose for — game-day brass mid-note, a campus snowball fight, a friend caught in the light before they notice the camera.',
  body: [
    'Most of what I shoot starts with a feeling rather than a plan: the energy of a crowd, a colour that won’t leave me alone, a face that deserves more than a phone snap. I carry a full-frame camera when I can and a phone when I can’t, and I edit on the move.',
    'The antics are half the point. I’d rather be in the middle of the noise than behind a rope — close enough that the photograph feels like you were there.',
  ],
  // Three frames for the collage at the top of the page (slugs from content/photos.js).
  collage: ['dsc03793', '79a1143', 'snow-day-cover'],
  // "What I shoot" — each links to a collection on the Work page.
  subjects: [
    { collection: 'game-day', line: 'Stadiums, sidelines and the band that never stops.' },
    { collection: 'portraits', line: 'People, with light that suits them.' },
    { collection: 'nature', line: 'Storms, coastlines and good dogs.' },
    { collection: 'built-worlds', line: 'Virtual photography inside worlds made of blocks.' },
  ],
}
