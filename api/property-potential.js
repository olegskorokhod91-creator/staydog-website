const NOTIFICATION_EMAIL = 'superfaststays@gmail.com'

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
    disclaimer: 'This AI-assisted snapshot is for informational purposes only and is not a revenue guarantee.',
    categories,
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
    stayDogFit:
      'StayDog may be a good fit if the owner wants hospitality-first guest care, dynamic pricing review, maintenance coordination, and a more hands-off operating model.',
  }
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

    const result = analyze(payload, fetched)
    const storage = await notifyLead(payload, result)

    res.status(200).json({
      status: storage.stored ? 'submitted' : 'staged',
      message: storage.stored
        ? 'Snapshot generated and sent for Google Sheets/email notification.'
        : 'Snapshot generated. Connect STAYDOG_LEAD_ENDPOINT to send this to Google Sheets and email.',
      result,
    })
  } catch (error) {
    res.status(500).json({ error: 'Unable to generate property potential snapshot.' })
  }
}
