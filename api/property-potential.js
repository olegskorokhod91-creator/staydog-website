const NOTIFICATION_EMAIL = 'superfaststays@gmail.com'
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

const snapshotSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'score',
    'sourceNote',
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
    sourceNote: fetched ? 'Generated from publicly accessible page text and submitted details.' : 'Generated from submitted details.',
    managerSummary:
      'This property has enough signal for a useful first-pass review. The strongest next move is to clarify the guest story, tighten the listing presentation, and review the operating plan before scaling bookings.',
    conversationMessage:
      'If I were reviewing this as a short-term rental operator, I would start by asking: what is the one reason a guest should choose this home over the next five listings nearby? The answer should show up in the first photos, the title, the amenities, and the pricing strategy.',
    disclaimer: 'Informational snapshot only. Revenue outcomes vary and require StayDog review.',
    categories,
    topTakeaways: [
      'The property appears to have enough guest-facing appeal to justify a deeper StayDog review.',
      'The listing story should make the strongest amenity and location advantages obvious in the first screen.',
      'Operations need to be easy to repeat: access, cleaning, supplies, maintenance, and guest messaging all matter.',
    ],
    guestAppealNotes: [
      'Lead with the most emotional guest moments: gathering spaces, outdoor amenities, views, walkability, or family convenience.',
      'Make the first five photos feel like a complete reason to book, not just a tour of rooms.',
    ],
    revenueLevers: [
      'Review minimum stays, weekend premiums, seasonal demand windows, and gap-night strategy.',
      'Improve direct-booking positioning and platform copy so guests understand value quickly.',
    ],
    operationalWatchouts: [
      'Confirm turnover complexity, supply cadence, smart lock reliability, and maintenance response expectations.',
      'If premium amenities are offered, document inspection and reset standards clearly.',
    ],
    missingOpportunities: [
      'Direct-booking savings and owner-grade management may need clearer positioning.',
      'The listing may benefit from a sharper first-screen amenity story.',
      'Guest-facing operations should be reviewed before promising premium service standards.',
    ],
    recommendedImprovements: [
      'Use the strongest exterior, gathering-space, and amenity photos at the front of the listing.',
      'Clarify guest flow: parking, access, sleeping layout, pets, quiet hours, and nearby attractions.',
      'Review pricing strategy, minimum stays, turnover cadence, supplies, smart locks, and vendor coverage.',
    ],
    firstSuggestedSteps: [
      'Send StayDog the listing, current pain points, and any recent performance context.',
      'Audit the first five photos and rewrite the opening copy around the strongest guest promise.',
      'Review operations before pricing: cleaning, access, maintenance, guest messaging, and supplies.',
    ],
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
            'You are a seasoned short-term rental owner, revenue-minded property manager, and hospitality operator. Analyze vacation rental listings like a practical expert: specific, warm, direct, and useful. Do not guarantee revenue or provide exact projected earnings. Use language like opportunity, may, could, and next step. Return only JSON matching the schema.',
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
      } catch (error) {
        res.status(200).json({
          status: 'fallback-required',
          message:
            'That listing could not be accessed automatically. Please paste listing details manually or prepare screenshots for StayDog review.',
        })
        return
      }
    }

    const fallback = analyze(payload, fetched)
    let result = fallback

    try {
      result = await createOpenAISnapshot(payload, fetched, fallback)
    } catch (error) {
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
