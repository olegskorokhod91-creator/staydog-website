const SCORE_ENDPOINT = import.meta.env.VITE_STAYDOG_SCORE_ENDPOINT || '/api/property-potential'
const NOTIFICATION_EMAIL = 'superfaststays@gmail.com'

const defaultAreas = {
  guestAppeal: 72,
  amenityStrength: 68,
  listingQuality: 64,
  photoQuality: 66,
  operationalComplexity: 52,
  revenueUpsideIndicators: 70,
}

function clamp(value) {
  return Math.max(42, Math.min(92, Math.round(value)))
}

function countMatches(text, words) {
  return words.reduce((count, word) => count + (text.includes(word) ? 1 : 0), 0)
}

export function createLocalSnapshot(payload, sourceNote = 'Generated from the details provided.') {
  const body = `${payload.listingUrl || ''} ${payload.details || ''}`.toLowerCase()
  const amenityHits = countMatches(body, ['hot tub', 'pool', 'lake', 'beach', 'fire pit', 'game', 'deck', 'grill', 'sauna'])
  const qualityHits = countMatches(body, ['renovated', 'luxury', 'new', 'updated', 'walkable', 'family', 'view', 'downtown'])
  const complexityHits = countMatches(body, ['pool', 'hot tub', 'multi', 'large', 'remote', 'shared', 'hoa', 'older'])
  const photoHints = countMatches(body, ['photo', 'professional', 'bright', 'view', 'tour'])

  const guestAppeal = clamp(defaultAreas.guestAppeal + amenityHits * 3 + qualityHits * 2)
  const amenityStrength = clamp(defaultAreas.amenityStrength + amenityHits * 4)
  const listingQuality = clamp(defaultAreas.listingQuality + qualityHits * 3)
  const photoQuality = clamp(defaultAreas.photoQuality + photoHints * 4)
  const operationalComplexity = clamp(defaultAreas.operationalComplexity + complexityHits * 4)
  const revenueUpsideIndicators = clamp(defaultAreas.revenueUpsideIndicators + amenityHits * 2 + qualityHits * 2)
  const score = clamp((guestAppeal + amenityStrength + listingQuality + photoQuality + revenueUpsideIndicators - operationalComplexity * 0.35) / 4.65)

  return {
    score,
    sourceNote,
    disclaimer: 'Informational snapshot only. Revenue outcomes vary and require StayDog review.',
    categories: {
      guestAppeal,
      amenityStrength,
      listingQuality,
      photoQuality,
      operationalComplexity,
      revenueUpsideIndicators,
    },
    missingOpportunities: [
      'Sharper direct-booking positioning could improve perceived value.',
      'A clearer amenity story may help guests understand why the property is worth choosing.',
      'Operational handoffs should be reviewed before promising a premium guest experience.',
    ],
    recommendedImprovements: [
      'Lead with the strongest lifestyle moments in the first five photos.',
      'Clarify sleeping layout, parking, pet rules, and premium amenities in the listing copy.',
      'Review pricing, minimum stays, cleaning cadence, supplies, and smart-lock flow before launch.',
    ],
    stayDogFit: 'StayDog may be a good fit if you want hospitality-first guest care, cleaner owner visibility, dynamic pricing review, and a more hands-off operating model.',
  }
}

export async function submitPropertyScore(payload) {
  const normalizedPayload = {
    ...payload,
    source: 'StayDog Property Potential Score',
    notify: NOTIFICATION_EMAIL,
    submittedAt: new Date().toISOString(),
  }

  try {
    const response = await fetch(SCORE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizedPayload),
    })

    if (!response.ok) throw new Error('Score endpoint unavailable.')
    return await response.json()
  } catch (error) {
    if (payload.mode === 'url' && !payload.details) {
      return {
        status: 'fallback-required',
        message: 'That listing could not be accessed automatically. Paste the key listing details manually and StayDog can still create a careful snapshot.',
      }
    }

    const result = createLocalSnapshot(normalizedPayload, 'Generated locally from the details provided. Connect the score endpoint for live URL fetching and Google Sheets/email delivery.')
    const staged = { ...normalizedPayload, result }
    localStorage.setItem('staydog:last-property-score', JSON.stringify(staged))

    return {
      status: 'staged',
      message: 'Snapshot staged locally. Connect VITE_STAYDOG_SCORE_ENDPOINT or the /api/property-potential route to send this to Google Sheets and email.',
      result,
    }
  }
}
