const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

const snapshotSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'score',
    'sourceNote',
    'analysisMode',
    'sourceQuality',
    'visibleFacts',
    'managerSummary',
    'conversationMessage',
    'categories',
    'topTakeaways',
    'guestAppealNotes',
    'revenueLevers',
    'operationalWatchouts',
    'missingOpportunities',
    'recommendedImprovements',
    'firstSuggestedSteps',
    'stayDogFit',
    'stayDogActionPlan',
    'disclaimer',
  ],
  properties: {
    score: { type: 'number' },
    sourceNote: { type: 'string' },
    analysisMode: { type: 'string' },
    sourceQuality: { type: 'string' },
    visibleFacts: { type: 'array', items: { type: 'string' } },
    managerSummary: { type: 'string' },
    conversationMessage: { type: 'string' },
    categories: {
      type: 'object',
      additionalProperties: false,
      required: [
        'guestAppeal',
        'amenityStrength',
        'listingQuality',
        'photoQuality',
        'operationalComplexity',
        'revenueUpsideIndicators',
      ],
      properties: {
        guestAppeal: { type: 'number' },
        amenityStrength: { type: 'number' },
        listingQuality: { type: 'number' },
        photoQuality: { type: 'number' },
        operationalComplexity: { type: 'number' },
        revenueUpsideIndicators: { type: 'number' },
      },
    },
    topTakeaways: { type: 'array', items: { type: 'string' } },
    guestAppealNotes: { type: 'array', items: { type: 'string' } },
    revenueLevers: { type: 'array', items: { type: 'string' } },
    operationalWatchouts: { type: 'array', items: { type: 'string' } },
    missingOpportunities: { type: 'array', items: { type: 'string' } },
    recommendedImprovements: { type: 'array', items: { type: 'string' } },
    firstSuggestedSteps: { type: 'array', items: { type: 'string' } },
    stayDogFit: { type: 'string' },
    stayDogActionPlan: { type: 'array', items: { type: 'string' } },
    disclaimer: { type: 'string' },
  },
}

function clamp(value) {
  return Math.max(42, Math.min(94, Math.round(value)))
}

function stripHtml(html = '') {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 12000)
}

function metadataFromHtml(html = '') {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || ''
  const description =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i)?.[1] ||
    html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)/i)?.[1] ||
    ''
  return { title, description }
}

async function fetchListingText(url) {
  const parsed = new URL(url)
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Unsupported URL protocol.')

  const response = await fetch(parsed.toString(), {
    headers: {
      'User-Agent': 'Mozilla/5.0 StayDogPropertyPotentialBot/1.0 (+https://staydogrentals.com)',
      Accept: 'text/html,application/xhtml+xml',
    },
  })

  if (!response.ok) throw new Error('Listing page could not be accessed.')
  const html = await response.text()
  const metadata = metadataFromHtml(html)
  return {
    metadata,
    visibleText: stripHtml(html),
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function hasPhrase(text, phrase) {
  return new RegExp(`(^|[^a-z0-9])${escapeRegExp(phrase)}([^a-z0-9]|$)`, 'i').test(text)
}

function includesAny(text, words) {
  return words.reduce((count, word) => count + (hasPhrase(text, word) ? 1 : 0), 0)
}

function getUrlParts(url = '') {
  try {
    const parsed = new URL(url)
    return {
      host: parsed.hostname.replace(/^www\./, '').toLowerCase(),
      path: parsed.pathname.toLowerCase(),
    }
  } catch {
    return { host: '', path: '' }
  }
}

function isKnownPropertyHost(host = '') {
  return [
    'airbnb.',
    'vrbo.',
    'booking.',
    'expedia.',
    'zillow.',
    'realtor.',
    'redfin.',
    'properties.staydogrentals.com',
    'ownerrez.',
    'lodgify.',
    'hostaway.',
    'guesty.',
    'direct-book.',
  ].some((needle) => host.includes(needle))
}

function isKnownNonPropertyHost(host = '') {
  return [
    'facebook.com',
    'instagram.com',
    'tiktok.com',
    'linkedin.com',
    'youtube.com',
    'x.com',
    'twitter.com',
    'amazon.',
    'ebay.',
    'etsy.',
    'walmart.',
    'target.',
    'bestbuy.',
    'nike.',
    'adidas.',
    'zappos.',
    'wayfair.',
  ].some((needle) => host.includes(needle))
}

function assessPropertyUrl(payload, fetched = null) {
  const { host, path } = getUrlParts(payload.listingUrl)
  const context = `${host} ${path} ${fetched?.metadata?.title || ''} ${fetched?.metadata?.description || ''} ${fetched?.visibleText || ''}`.toLowerCase()
  const knownPropertyHost = isKnownPropertyHost(host)

  if (knownPropertyHost) {
    return { ok: true, reason: 'recognized property/listing platform' }
  }

  const propertySignals = [
    'bedroom',
    'bath',
    'guest',
    'sleeps',
    'entire home',
    'entire house',
    'vacation rental',
    'short term rental',
    'short-term rental',
    'airbnb',
    'vrbo',
    'booking.com',
    'listing',
    'amenity',
    'check-in',
    'checkout',
    'night',
    'hosted by',
    'host',
    'property',
    'rental',
    'cabin',
    'condo',
    'cottage',
    'lodge',
    'villa',
  ]
  const nonPropertySignals = [
    'add to cart',
    'buy now',
    'shoe',
    'sneaker',
    'shirt',
    'pants',
    'product details',
    'shipping',
    'returns',
    'followers',
    'profile',
    'timeline',
    'posts',
    'reels',
    'watch video',
    'subscribe',
  ]
  const propertyScore = includesAny(context, propertySignals)
  const nonPropertyScore = includesAny(context, nonPropertySignals)
  const likelySocialOrStore = isKnownNonPropertyHost(host)

  if (likelySocialOrStore && propertyScore < 2) {
    return {
      ok: false,
      reason: 'known non-property website',
      message:
        'That link looks like it belongs to a social profile, store, product page, or other non-property page. Please paste a public vacation rental listing URL from Airbnb, Vrbo, Booking.com, Expedia, Zillow, or a direct booking page.',
    }
  }

  if (fetched && nonPropertyScore >= 2 && propertyScore < 2) {
    return {
      ok: false,
      reason: 'content does not look like a lodging listing',
      message:
        'That page does not look like a vacation rental listing. Please paste a public property/listing URL so StayDog can review the right kind of page.',
    }
  }

  return { ok: true, reason: 'not enough evidence to reject' }
}

function hasUsableListingText(fetched) {
  const text = `${fetched?.metadata?.title || ''} ${fetched?.metadata?.description || ''} ${fetched?.visibleText || ''}`.toLowerCase()
  const blockedSignals = ['enable javascript', 'access denied', 'captcha', 'robot', 'blocked', 'verify you are human']
  const propertySignals = [
    'bedroom',
    'bath',
    'guest',
    'sleeps',
    'amenity',
    'kitchen',
    'parking',
    'hot tub',
    'pool',
    'review',
    'rating',
    'stay',
  ]

  return text.length > 700 && includesAny(text, blockedSignals) === 0 && includesAny(text, propertySignals) >= 2
}

function getAnalysisSource(payload, fetched = null) {
  const title = fetched?.metadata?.title || ''
  const description = fetched?.metadata?.description || ''
  const visibleText = fetched?.visibleText || ''
  const sourceHost = (() => {
    try {
      return payload.listingUrl ? new URL(payload.listingUrl).hostname : ''
    } catch {
      return ''
    }
  })()

  const isMarketplace = /airbnb|vrbo|booking|expedia/i.test(sourceHost)
  const marketplaceText = [title, description].filter(Boolean).join(' ')

  // Marketplace pages often expose noisy app-shell text. Use metadata first so
  // fallback reports do not invent amenities from unrelated platform markup.
  if (isMarketplace && marketplaceText.length > 24) {
    return {
      text: marketplaceText.toLowerCase(),
      limited: true,
      quality: 'Public marketplace metadata only',
    }
  }

  return {
    text: `${payload.listingUrl || ''} ${payload.details || ''} ${title} ${description} ${visibleText}`.toLowerCase(),
    limited: false,
    quality: fetched ? 'Accessible public listing text' : 'Submitted URL/details',
  }
}

function visibleFactsFromText(text, limited = false) {
  const facts = []
  const titleMatch = text.match(/([^|]{8,90})\s*\|\s*([^|]{3,70})/)
  const guestMatch = text.match(/(\d+\+?\s*guests?)/i)
  const bedroomMatch = text.match(/(\d+\s*bedrooms?)/i)
  const bedMatch = text.match(/(\d+\s*beds?)/i)
  const bathMatch = text.match(/(\d+(?:\.\d+)?\s*baths?)/i)
  const reviewMatch = text.match(/(\d+(?:\.\d+)?\s*(?:stars?|rating)|\d+\s*reviews?)/i)

  if (titleMatch?.[1]) facts.push(`Listing title signal: ${titleMatch[1].trim()}`)
  if (guestMatch?.[1]) facts.push(`Capacity signal: ${guestMatch[1]}`)
  if (bedroomMatch?.[1]) facts.push(`Bedroom signal: ${bedroomMatch[1]}`)
  if (bedMatch?.[1]) facts.push(`Bed signal: ${bedMatch[1]}`)
  if (bathMatch?.[1]) facts.push(`Bath signal: ${bathMatch[1]}`)
  if (reviewMatch?.[1]) facts.push(`Trust signal: ${reviewMatch[1]}`)
  if (hasPhrase(text, 'golf')) facts.push('Destination signal: golf')
  if (hasPhrase(text, 'ski')) facts.push('Destination signal: ski')
  if (hasPhrase(text, 'schuss village')) facts.push('Location signal: Schuss Village')
  if (hasPhrase(text, 'shanty creek')) facts.push('Location signal: Shanty Creek')
  if (hasPhrase(text, 'forest') || hasPhrase(text, 'woods') || hasPhrase(text, 'wooded')) facts.push('Setting signal: wooded/private outdoor setting')
  if (limited) facts.push('Limited access note: marketplace pages may hide full amenities and photo details from automated review')

  return [...new Set(facts)].slice(0, 8)
}

function listSignals(combined) {
  const signals = [
    ['hot tub', 'hot tub'],
    ['swimming pool', 'pool'],
    ['pool access', 'pool access'],
    ['lakefront', 'lakefront positioning'],
    ['lake access', 'lake access'],
    ['beach', 'beach proximity'],
    ['fire pit', 'fire pit'],
    ['game room', 'game room'],
    ['deck', 'deck or outdoor gathering space'],
    ['grill', 'grill'],
    ['sauna', 'sauna'],
    ['golf', 'golf destination appeal'],
    ['ski', 'ski-season appeal'],
    ['forest', 'wooded privacy'],
    ['woods', 'wooded privacy'],
    ['16+ guests', 'large-group capacity'],
    ['5 bedrooms', 'large sleeping capacity'],
    ['walkable', 'walkability'],
    ['pet', 'pet-friendly potential'],
    ['downtown', 'downtown proximity'],
    ['family', 'family-friendly positioning'],
    ['view', 'view-driven appeal'],
  ]

  return signals.filter(([needle]) => combined.includes(needle)).map(([, label]) => label)
}

function pickFallbackInsights(combined, signals) {
  const hasHotTub = combined.includes('hot tub')
  const hasPool = hasPhrase(combined, 'swimming pool') || hasPhrase(combined, 'pool access')
  const hasLakeOrBeach = hasPhrase(combined, 'lakefront') || hasPhrase(combined, 'lake access') || hasPhrase(combined, 'beach')
  const hasGolf = hasPhrase(combined, 'golf')
  const hasSki = hasPhrase(combined, 'ski')
  const hasWooded = hasPhrase(combined, 'forest') || hasPhrase(combined, 'woods') || hasPhrase(combined, 'wooded')
  const hasLargeGroup = hasPhrase(combined, '16+ guests') || hasPhrase(combined, '5 bedrooms') || hasPhrase(combined, 'group')
  const hasWalkable = hasPhrase(combined, 'walkable') || hasPhrase(combined, 'downtown')
  const hasPets = hasPhrase(combined, 'pet')
  const hasReviews = hasPhrase(combined, 'review') || hasPhrase(combined, 'rating') || hasPhrase(combined, 'guest favourite') || hasPhrase(combined, 'guest favorite') || hasPhrase(combined, 'superhost')
  const hasPhotos = hasPhrase(combined, 'photo') || hasPhrase(combined, 'gallery') || hasPhrase(combined, 'tour')
  const hasFamily = hasPhrase(combined, 'family') || hasPhrase(combined, 'sleeps') || hasPhrase(combined, 'bedroom') || hasLargeGroup

  return {
    managerSummary: signals.length
      ? `This looks most promising around ${signals.slice(0, 3).join(', ')}. The opportunity is to turn those features into a sharper guest promise and make sure the operations can consistently support that promise.`
      : 'The URL/details provided only gave limited property signal. A stronger review needs listing copy, amenities, photo notes, and recent performance context.',
    topTakeaways: [
      hasLakeOrBeach
        ? 'Lead with the water or destination lifestyle immediately; that is likely the emotional hook.'
        : hasGolf || hasSki
          ? 'Lead with the golf/ski trip use case immediately; guests should understand the seasonal reason to book before they scan amenities.'
          : hasWooded
            ? 'Lead with the private wooded getaway feeling and make the outdoor gathering setup easy to understand.'
        : 'Lead with the strongest guest use case in the first screen: family trip, weekend escape, group stay, or work-friendly retreat.',
      hasReviews
        ? 'Existing review/rating signals should be used as trust proof, but the listing still needs a clear reason to choose it.'
        : 'If review proof is limited, the photos, amenities, and description need to carry more trust-building weight.',
      hasHotTub || hasPool
        ? 'Premium amenities can improve appeal, but they also raise cleaning, inspection, and maintenance expectations.'
        : 'The next upside may come from better merchandising, stronger amenities, or clearer local experience positioning.',
    ],
    guestAppealNotes: [
      hasFamily
        ? 'Make sleeping layout, gathering spaces, parking, and kid/family convenience obvious before guests have to hunt for details.'
        : 'Clarify exactly who this stay is perfect for and make that guest type feel seen in the first few lines.',
      hasGolf || hasSki
        ? 'Build the opening copy around practical trip planning: distance to golf, ski access, parking, gear storage, and apres-stay gathering space.'
        : hasWooded
          ? 'Use the wooded setting as a privacy and escape angle, then support it with clear outdoor photos and arrival details.'
          : 'Make the first five photos feel like a complete reason to book, not just a tour of rooms.',
      hasWalkable
        ? 'If the property is walkable or close to downtown, quantify that advantage with nearby attractions and time-to-destination details.'
        : 'If location is not the main hook, lean harder into comfort, amenities, privacy, and easy arrival.',
    ],
    revenueLevers: [
      hasHotTub || hasPool
        ? 'Review premium amenity pricing by season and weekend demand, especially around peak stay patterns.'
        : 'Review minimum stays, weekend premiums, shoulder-season offers, and gap-night strategy.',
      hasLakeOrBeach
        ? 'Build pricing around seasonal demand windows and weather-dependent booking behavior.'
        : hasGolf || hasSki
          ? 'Build pricing around golf weekends, ski periods, holiday breaks, and shoulder-season event demand.'
        : 'Use listing quality and amenity positioning to support rate confidence before chasing occupancy.',
    ],
    operationalWatchouts: [
      hasHotTub || hasPool
        ? 'Create a reset checklist for water amenities, guest instructions, photos after service, and issue escalation.'
        : 'Document cleaning standards, supply cadence, access instructions, and maintenance response expectations.',
      hasPets
        ? 'Pet-friendly positioning needs clear rules, cleaning expectations, damage process, and guest messaging.'
        : 'Clarify house rules and arrival flow so guest questions do not become recurring manual work.',
    ],
    missingOpportunities: [
      hasPhotos
        ? 'Photo order may still need a stronger first-five sequence focused on booking emotion, not room-by-room documentation.'
        : 'Photo quality and photo order need review; the listing should show the reason to book before details.',
      hasLakeOrBeach
        ? 'Water/destination positioning should be repeated in title, intro copy, photo order, and amenity descriptions.'
        : hasGolf || hasSki
          ? 'Golf and ski positioning should be repeated in the title, first paragraph, first photos, and nearby-attraction details.'
          : hasWooded
            ? 'The outdoor/wooded setting can be merchandised more clearly with stronger first-photo sequencing and simple amenity storytelling.'
        : 'The listing may need a more memorable hook that separates it from comparable homes nearby.',
      'Direct-booking and professional management value can be clearer without sounding corporate.',
    ],
    recommendedImprovements: [
      hasHotTub || hasPool
        ? 'Add or improve amenity instructions, safety notes, service cadence, and reset standards before scaling bookings.'
        : 'Review the amenity package and identify one or two upgrades that would photograph well and improve guest decision-making.',
      hasReviews
        ? 'Pull the strongest review themes into the opening copy and image captions where platforms allow.'
        : 'Build more trust signals into the listing: clarity, policies, arrival confidence, and professional guest care.',
      'Compare the first screen against five nearby competitors and make the strongest StayDog-managed advantage obvious.',
    ],
    firstSuggestedSteps: [
      'Paste the listing description, amenity list, bedroom/bath count, and current pain points for a deeper review.',
      hasPhotos
        ? 'Audit whether the first five photos sell the stay or merely document the property.'
        : 'Gather the current first ten photos or screenshots so StayDog can review visual merchandising.',
      'Review operations before pricing: cleaning, access, maintenance, guest messaging, supplies, and vendor coverage.',
    ],
  }
}

function cleanScore(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)))
}

function normalizeSnapshot(result, fallback) {
  const categories = {
    ...fallback.categories,
    ...(result.categories || {}),
  }

  return {
    ...fallback,
    ...result,
    score: cleanScore(result.score || fallback.score),
    categories: Object.fromEntries(Object.entries(categories).map(([key, value]) => [key, cleanScore(value)])),
    analysisMode: result.analysisMode || 'AI manager review',
    sourceQuality: result.sourceQuality || fallback.sourceQuality,
    disclaimer: result.disclaimer || fallback.disclaimer,
  }
}

function analyze(payload, fetched = null) {
  const source = getAnalysisSource(payload, fetched)
  const combined = source.text
  const amenityHits = includesAny(combined, ['hot tub', 'swimming pool', 'pool access', 'lakefront', 'lake access', 'beach', 'fire pit', 'game room', 'deck', 'grill', 'sauna', 'walkable'])
  const qualityHits = includesAny(combined, ['renovated', 'luxury', 'updated', 'new', 'view', 'family', 'downtown', 'private'])
  const destinationHits = includesAny(combined, ['golf', 'ski', 'forest', 'woods', 'wooded', 'schuss village', 'shanty creek'])
  const complexityHits = includesAny(combined, ['swimming pool', 'pool access', 'hot tub', 'large', '16+ guests', 'multi', 'shared', 'hoa', 'remote', 'pets'])
  const listingHits = includesAny(combined, ['superhost', 'reviews', 'rating', 'guest favorite', 'guest favourite', 'booking', 'direct'])
  const photoHits = includesAny(combined, ['photo', 'photos', 'gallery', 'professional', 'tour', 'bright'])
  const signals = listSignals(combined)
  const insights = pickFallbackInsights(combined, signals)

  const categories = {
    guestAppeal: clamp(70 + amenityHits * 3 + qualityHits * 2 + destinationHits * 2),
    amenityStrength: clamp(64 + amenityHits * 4),
    listingQuality: clamp(62 + listingHits * 4 + qualityHits * 2 + destinationHits * 2),
    photoQuality: clamp(62 + photoHits * 5),
    operationalComplexity: clamp(48 + complexityHits * 5),
    revenueUpsideIndicators: clamp(68 + amenityHits * 2 + qualityHits * 3 + listingHits * 2 + destinationHits * 3),
  }

  const rawScore = clamp(
    (categories.guestAppeal +
      categories.amenityStrength +
      categories.listingQuality +
      categories.photoQuality +
      categories.revenueUpsideIndicators -
      categories.operationalComplexity * 0.35) /
      4.65,
  )
  const score = source.limited ? Math.min(rawScore, 82) : rawScore

  return {
    score,
    sourceNote: fetched
      ? `Quick estimate based on public listing metadata. Detected signals: ${signals.slice(0, 5).join(', ') || 'limited public details'}.`
      : 'Quick estimate based on submitted details.',
    analysisMode: 'Quick estimate',
    sourceQuality: source.quality,
    visibleFacts: visibleFactsFromText(combined, source.limited),
    managerSummary: source.limited
      ? `${insights.managerSummary} This is a limited read because the marketplace page did not expose full listing copy, amenities, and photo context to the automated review.`
      : insights.managerSummary,
    conversationMessage:
      signals.length
        ? `If I were reviewing this as an operator, I would pressure-test whether ${signals[0]} is clearly visible in the first photos, title, opening copy, and guest instructions.`
        : 'If I were reviewing this as an operator, I would ask for the listing copy, first ten photos, amenity list, and current operating pain points before giving deeper advice.',
    disclaimer: 'Informational snapshot only. Revenue outcomes vary and require StayDog review.',
    categories,
    topTakeaways: insights.topTakeaways,
    guestAppealNotes: insights.guestAppealNotes,
    revenueLevers: insights.revenueLevers,
    operationalWatchouts: insights.operationalWatchouts,
    missingOpportunities: insights.missingOpportunities,
    recommendedImprovements: insights.recommendedImprovements,
    firstSuggestedSteps: insights.firstSuggestedSteps,
    stayDogFit:
      'StayDog may be a good fit if the owner wants practical listing improvements, hospitality-first guest care, dynamic pricing review, vendor coordination, and a more hands-off operating model.',
    stayDogActionPlan: [
      'Tighten the first-screen guest promise so the listing immediately explains who the stay is for and why it should be chosen over nearby alternatives.',
      'Review the first five photos, title, and opening copy together so the strongest trip use case is obvious before guests scroll.',
      'Pressure-test pricing, minimum stays, guest messaging, cleaning standards, supply cadence, and maintenance response before making bigger revenue recommendations.',
      'Use a strategy call to discuss deeper ideas such as seasonal packaging, direct-booking positioning, owner reporting, vendor coverage, and upgrade priorities.',
    ],
  }
}

function extractResponseText(response) {
  if (response.output_text) return response.output_text
  const output = response.output || []
  for (const item of output) {
    for (const content of item.content || []) {
      if (content.text) return content.text
    }
  }
  return ''
}

async function createOpenAISnapshot(payload, fetched, fallback) {
  if (!process.env.OPENAI_API_KEY) return fallback

  const listingContext = [
    payload.listingUrl ? `Listing URL: ${payload.listingUrl}` : '',
    payload.details ? `Owner details: ${payload.details}` : '',
    fetched?.metadata?.title ? `Page title: ${fetched.metadata.title}` : '',
    fetched?.metadata?.description ? `Page description: ${fetched.metadata.description}` : '',
    fallback.visibleFacts?.length ? `Visible facts extracted by system: ${fallback.visibleFacts.join('; ')}` : '',
    fallback.sourceQuality ? `Source quality: ${fallback.sourceQuality}` : '',
    fetched?.visibleText ? `Visible listing text: ${fetched.visibleText.slice(0, 9000)}` : '',
  ]
    .filter(Boolean)
    .join('\n\n')

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.55,
      input: [
        {
          role: 'system',
          content:
            'You are a seasoned short-term rental owner, revenue-minded property manager, and hospitality operator. Analyze vacation rental listings like a practical expert: specific, warm, direct, and useful. Make every recommendation specific to the submitted property signals. Do not reuse generic advice when the property has different amenities, location, layout, or listing quality. Critical grounding rule: only mention amenities, location hooks, water access, hot tubs, pools, saunas, views, or photo quality when the provided context clearly supports them. If the context is limited marketplace metadata, say the review is limited and focus only on visible facts such as title, location, capacity, reviews, and stated trip use cases. Never invent amenities. Do not guarantee revenue or provide exact projected earnings. Use language like opportunity, may, could, and next step. Return only JSON matching the schema. Set analysisMode to "AI manager review" and sourceQuality to a short phrase describing what you analyzed. visibleFacts must list only facts directly visible in the provided context. recommendedImprovements must include 3-5 concrete, owner-friendly suggestions. stayDogFit must be 2-4 sentences explaining how StayDog can help operationally, not a generic one-liner. stayDogActionPlan must include 4 specific bullets: listing/positioning, pricing/revenue management, operations/guest care, and a final strategy-call item for more complex ideas.',
        },
        {
          role: 'user',
          content: `Create a StayDog Property Potential Snapshot for this owner submission. Make it feel like an experienced STR operator is talking to the owner, not a generic report. Keep bullets concise and actionable.\n\n${listingContext || 'No listing context provided.'}`,
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'staydog_property_potential_snapshot',
          strict: true,
          schema: snapshotSchema,
        },
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI snapshot failed with status ${response.status}`)
  }

  const body = await response.json()
  const text = extractResponseText(body)
  return normalizeSnapshot(JSON.parse(text), fallback)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const payload = req.body || {}
    let fetched = null

    if (payload.mode === 'url' && payload.listingUrl) {
      const preflight = assessPropertyUrl(payload)
      if (!preflight.ok) {
        res.status(200).json({
          status: 'unsupported-url',
          message: preflight.message,
        })
        return
      }

      try {
        fetched = await fetchListingText(payload.listingUrl)
        const contentCheck = assessPropertyUrl(payload, fetched)
        if (!contentCheck.ok) {
          res.status(200).json({
            status: 'unsupported-url',
            message: contentCheck.message,
          })
          return
        }

        if (!hasUsableListingText(fetched) && !payload.details) {
          res.status(200).json({
            status: 'fallback-required',
            message:
              'That listing did not expose enough usable property detail. Continue to Partner With Us and StayDog can review it directly.',
          })
          return
        }
      } catch (error) {
        res.status(200).json({
          status: 'fallback-required',
          message:
            'That listing could not be accessed automatically. Continue to Partner With Us and StayDog can review it directly.',
        })
        return
      }
    }

    const fallback = analyze(payload, fetched)
    let result = fallback

    try {
      result = await createOpenAISnapshot(payload, fetched, fallback)
    } catch (error) {
      console.error('OpenAI property snapshot failed:', error)
      result = fallback
    }

    res.status(200).json({
      status: 'ready',
      message: 'Your StayDog snapshot is ready. To speak with StayDog, continue to Partner With Us.',
      result,
    })
  } catch (error) {
    res.status(500).json({ error: 'Unable to generate property potential snapshot.' })
  }
}
