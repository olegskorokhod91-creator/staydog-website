const DEFAULT_DESCRIPTION =
  'StayDog Rentals is a premium, hospitality-forward vacation rental management company powered by automation-first operations, revenue optimization, and 24/7 guest care.'

function upsertMeta(selector, createMeta, attributes = {}) {
  let tag = document.head.querySelector(selector)
  if (!tag) {
    tag = createMeta()
    document.head.appendChild(tag)
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value === null) {
      tag.removeAttribute(key)
    } else {
      tag.setAttribute(key, value)
    }
  })

  return tag
}

function setMetaName(name, content) {
  upsertMeta(`meta[name="${name}"]`, () => {
    const tag = document.createElement('meta')
    tag.setAttribute('name', name)
    return tag
  }, { content })
}

function setMetaProperty(property, content) {
  upsertMeta(`meta[property="${property}"]`, () => {
    const tag = document.createElement('meta')
    tag.setAttribute('property', property)
    return tag
  }, { content })
}

function setCanonical(url) {
  upsertMeta('link[rel="canonical"]', () => {
    const tag = document.createElement('link')
    tag.setAttribute('rel', 'canonical')
    return tag
  }, { href: url })
}

function setJsonLd(data) {
  let tag = document.head.querySelector('script[data-seo-jsonld="route"]')
  if (!tag) {
    tag = document.createElement('script')
    tag.type = 'application/ld+json'
    tag.dataset.seoJsonld = 'route'
    document.head.appendChild(tag)
  }
  tag.textContent = JSON.stringify(data)
}

export function applyRouteSeo({
  title = 'StayDog Rentals | Sit Back. Let StayDog Handle It.',
  description = DEFAULT_DESCRIPTION,
  path = '/',
  jsonLd,
}) {
  const origin = window.location.origin
  const canonical = `${origin}${path}`

  document.title = title
  setMetaName('description', description)
  setMetaName(
    'keywords',
    'vacation rental management, Airbnb management, Vrbo management, short term rental management, Michigan vacation rental management, Indiana vacation rental management, Illinois vacation rental management',
  )
  setMetaProperty('og:title', title)
  setMetaProperty('og:description', description)
  setMetaProperty('og:url', canonical)
  setMetaProperty('og:type', 'website')
  setMetaProperty('og:site_name', 'StayDog Rentals')
  setMetaName('twitter:card', 'summary_large_image')
  setCanonical(canonical)

  setJsonLd(
    jsonLd || {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'StayDog Rentals',
      url: origin,
      description,
      email: 'superfaststays@gmail.com',
      telephone: '+1-248-382-8370',
      areaServed: ['Michigan', 'Indiana', 'Illinois'],
      sameAs: ['https://www.properties.staydogrentals.com/'],
    },
  )
}
