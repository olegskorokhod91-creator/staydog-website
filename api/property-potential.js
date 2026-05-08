const NOTIFICATION_EMAIL = 'superfaststays@gmail.com'
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

const snapshotSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'score',
    'sourceNote',
    'analysisMode',
    'sourceQuality',
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
    'disclaimer',
  ],
  properties: {
    score: { type: 'number' },
    sourceNote: { type: 'string' },
    analysisMode: { type: 'string' },
    sourceQuality: { type: 'string' },
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

function includesAny(text, words) {
  return words.reduce((count, word) => count + (text.includes(word) ? 1 : 0), 0)
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

function listSignals(combined) {
  const signals = [
    ['hot tub', 'hot tub'],
    ['pool', 'pool'],
    ['lake', 'lake access or lake positioning'],
    ['beach', 'beach proximity'],
    ['fire pit', 'fire pit'],
    ['game room', 'game room'],
    ['deck', 'deck or outdoor gathering space'],
    ['grill', 'grill'],
    ['sauna', 'sauna'],
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
  const hasPool = combined.includes('pool')
  const hasLakeOrBeach = combined.includes('lake') || combined.includes('beach')
  const hasWalkable = combined.includes('walkable') || combined.includes('downtown')
  const hasPets = combined.includes('pet')
  const hasReviews = combined.includes('review') || combined.includes('rating') || combined.includes('superhost')
  const hasPhotos = combined.includes('photo') || combined.includes('gallery') || combined.includes('tour')
  const hasFamily = combined.includes('family') || combined.includes('sleeps') || combined.includes('bedroom')

  return {
    managerSummary: signals.length
      ? `This looks most promising around ${signals.slice(0, 3).join(', ')}. The opportunity is to turn those features into a sharper guest promise and make sure the operations can consistently support that promise.`
      : 'The URL/details provided only gave limited property signal. A stronger review needs listing copy, amenities, photo notes, and recent performance context.',
    topTakeaways: [
      hasLakeOrBeach
        ? 'Lead with the water or destination lifestyle immediately; that is likely the emotional hook.'
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
  const combined = `${payload.listingUrl || ''} ${payload.details || ''} ${fetched?.metadata?.title || ''} ${fetched?.metadata?.description || ''} ${fetched?.visibleText || ''}`.toLowerCase()
  const amenityHits = includesAny(combined, ['hot tub', 'pool', 'lake', 'beach', 'fire pit', 'game room', 'deck', 'grill', 'sauna', 'walkable'])
  const qualityHits = includesAny(combined, ['renovated', 'luxury', 'updated', 'new', 'view', 'family', 'downtown', 'private'])
  const complexityHits = includesAny(combined, ['pool', 'hot tub', 'large', 'multi', 'shared', 'hoa', 'remote', 'pets'])
  const listingHits = includesAny(combined, ['superhost', 'reviews', 'rating', 'guest favorite', 'booking', 'direct'])
  const photoHits = includesAny(combined, ['photo', 'photos', 'gallery', 'professional', 'tour', 'bright'])
  const signals = listSignals(combined)
  const insights = pickFallbackInsights(combined, signals)

  const categories = {
    guestAppeal: clamp(70 + amenityHits * 3 + qualityHits * 2),
    amenityStrength: clamp(64 + amenityHits * 4),
    listingQuality: clamp(62 + listingHits * 4 + qualityHits * 2),
    photoQuality: clamp(62 + photoHits * 5),
    operationalComplexity: clamp(48 + complexityHits * 5),
    revenueUpsideIndicators: clamp(68 + amenityHits * 2 + qualityHits * 3 + listingHits * 2),
  }

  const score = clamp(
    (categories.guestAppeal +
      categories.amenityStrength +
      categories.listingQuality +
      categories.photoQuality +
      categories.revenueUpsideIndicators -
      categories.operationalComplexity * 0.35) /
      4.65,
  )

  return {
    score,
    sourceNote: fetched
      ? `Quick estimate based on accessible listing text. Detected signals: ${signals.slice(0, 5).join(', ') || 'limited public details'}.`
      : 'Quick estimate based on submitted details.',
    analysisMode: 'Quick estimate',
    sourceQuality: fetched ? 'Public listing text' : 'Manual/submitted details',
    managerSummary: insights.managerSummary,
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
      'StayDog may be a good fit if the owner wants hospitality-first guest care, dynamic pricing review, maintenance coordination, and a more hands-off operating model.',
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
            'You are a seasoned short-term rental owner, revenue-minded property manager, and hospitality operator. Analyze vacation rental listings like a practical expert: specific, warm, direct, and useful. Make every recommendation specific to the submitted property signals. Do not reuse generic advice when the property has different amenities, location, layout, or listing quality. Do not guarantee revenue or provide exact projected earnings. Use language like opportunity, may, could, and next step. Return only JSON matching the schema. Set analysisMode to "AI manager review" and sourceQuality to a short phrase describing what you analyzed.',
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

async function notifyLead(payload, result) {
  const endpoint = process.env.STAYDOG_LEAD_ENDPOINT || process.env.VITE_STAYDOG_LEAD_ENDPOINT
  if (!endpoint) return { stored: false }

  await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      result,
      source: 'StayDog Property Potential Score',
      notify: NOTIFICATION_EMAIL,
      submittedAt: new Date().toISOString(),
    }),
  })

  return { stored: true }
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
      try {
        fetched = await fetchListingText(payload.listingUrl)
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

    const storage = await notifyLead(payload, result)

    res.status(200).json({
      status: storage.stored ? 'submitted' : 'staged',
      message: storage.stored
        ? 'Your StayDog snapshot is ready, and the details were sent for follow-up.'
        : 'Your StayDog snapshot is ready. Add contact automation later to send results to Google Sheets and email.',
      result,
    })
  } catch (error) {
    res.status(500).json({ error: 'Unable to generate property potential snapshot.' })
  }
}
