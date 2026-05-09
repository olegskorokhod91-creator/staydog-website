const SCORE_ENDPOINT = import.meta.env.VITE_STAYDOG_SCORE_ENDPOINT || '/api/property-potential'
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
  return words.reduce((count, word) => count + (hasPhrase(text, word) ? 1 : 0), 0)
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function hasPhrase(text, phrase) {
  return new RegExp(`(^|[^a-z0-9])${escapeRegExp(phrase)}([^a-z0-9]|$)`, 'i').test(text)
}

function listSignals(text) {
  return [
    ['hot tub', 'hot tub'],
    ['swimming pool', 'pool'],
    ['pool access', 'pool access'],
    ['lakefront', 'lakefront positioning'],
    ['lake access', 'lake access'],
    ['beach', 'beach proximity'],
    ['fire pit', 'fire pit'],
    ['game', 'game room or games'],
    ['deck', 'deck or outdoor gathering space'],
    ['grill', 'grill'],
    ['sauna', 'sauna'],
    ['golf', 'golf destination appeal'],
    ['ski', 'ski-season appeal'],
    ['forest', 'wooded privacy'],
    ['woods', 'wooded privacy'],
    ['walkable', 'walkability'],
    ['pet', 'pet-friendly potential'],
    ['downtown', 'downtown proximity'],
    ['family', 'family-friendly positioning'],
    ['view', 'view-driven appeal'],
  ]
    .filter(([needle]) => text.includes(needle))
    .map(([, label]) => label)
}

function fallbackInsights(text, signals) {
  const hasHotTub = text.includes('hot tub')
  const hasPool = hasPhrase(text, 'swimming pool') || hasPhrase(text, 'pool access')
  const hasLakeOrBeach = hasPhrase(text, 'lakefront') || hasPhrase(text, 'lake access') || hasPhrase(text, 'beach')
  const hasGolf = hasPhrase(text, 'golf')
  const hasSki = hasPhrase(text, 'ski')
  const hasWooded = hasPhrase(text, 'forest') || hasPhrase(text, 'woods') || hasPhrase(text, 'wooded')
  const hasWalkable = hasPhrase(text, 'walkable') || hasPhrase(text, 'downtown')
  const hasPets = hasPhrase(text, 'pet')
  const hasReviews = hasPhrase(text, 'review') || hasPhrase(text, 'rating') || hasPhrase(text, 'guest favourite') || hasPhrase(text, 'guest favorite') || hasPhrase(text, 'superhost')
  const hasPhotos = hasPhrase(text, 'photo') || hasPhrase(text, 'gallery') || hasPhrase(text, 'tour')

  return {
    managerSummary: signals.length
      ? `This looks most promising around ${signals.slice(0, 3).join(', ')}. The opportunity is to turn those features into a sharper guest promise and make sure the operations can consistently support that promise.`
      : 'The details provided only gave limited property signal. A stronger review needs listing copy, amenities, photo notes, and recent performance context.',
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
      hasWalkable
        ? 'If the property is walkable or close to downtown, quantify that advantage with nearby attractions and time-to-destination details.'
        : hasGolf || hasSki
          ? 'Build the opening copy around practical trip planning: distance to golf, ski access, parking, gear storage, and apres-stay gathering space.'
          : 'Clarify exactly who this stay is perfect for and make that guest type feel seen in the first few lines.',
      hasLakeOrBeach
        ? 'Use destination language and outdoor lifestyle photos early so guests understand the vacation feeling quickly.'
        : 'Make the first five photos feel like a complete reason to book, not just a tour of rooms.',
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

function visibleFactsFromText(text) {
  const facts = []
  const guestMatch = text.match(/(\d+\+?\s*guests?)/i)
  const bedroomMatch = text.match(/(\d+\s*bedrooms?)/i)
  const bedMatch = text.match(/(\d+\s*beds?)/i)
  const bathMatch = text.match(/(\d+(?:\.\d+)?\s*baths?)/i)

  if (guestMatch?.[1]) facts.push(`Capacity signal: ${guestMatch[1]}`)
  if (bedroomMatch?.[1]) facts.push(`Bedroom signal: ${bedroomMatch[1]}`)
  if (bedMatch?.[1]) facts.push(`Bed signal: ${bedMatch[1]}`)
  if (bathMatch?.[1]) facts.push(`Bath signal: ${bathMatch[1]}`)
  if (hasPhrase(text, 'golf')) facts.push('Destination signal: golf')
  if (hasPhrase(text, 'ski')) facts.push('Destination signal: ski')
  if (hasPhrase(text, 'forest') || hasPhrase(text, 'woods') || hasPhrase(text, 'wooded')) facts.push('Setting signal: wooded/private outdoor setting')

  return [...new Set(facts)].slice(0, 7)
}

export function createLocalSnapshot(payload, sourceNote = 'Generated from the details provided.') {
  const body = `${payload.listingUrl || ''} ${payload.details || ''}`.toLowerCase()
  const amenityHits = countMatches(body, ['hot tub', 'swimming pool', 'pool access', 'lakefront', 'lake access', 'beach', 'fire pit', 'game', 'deck', 'grill', 'sauna'])
  const qualityHits = countMatches(body, ['renovated', 'luxury', 'new', 'updated', 'walkable', 'family', 'view', 'downtown', 'golf', 'ski', 'forest', 'woods'])
  const complexityHits = countMatches(body, ['swimming pool', 'pool access', 'hot tub', 'multi', 'large', 'remote', 'shared', 'hoa', 'older'])
  const photoHints = countMatches(body, ['photo', 'professional', 'bright', 'view', 'tour'])
  const signals = listSignals(body)
  const insights = fallbackInsights(body, signals)

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
    analysisMode: 'Quick estimate',
    sourceQuality: 'Browser fallback',
    visibleFacts: visibleFactsFromText(body),
    managerSummary: insights.managerSummary,
    conversationMessage:
      signals.length
        ? `If I were reviewing this as an operator, I would pressure-test whether ${signals[0]} is clearly visible in the first photos, title, opening copy, and guest instructions.`
        : 'If I were reviewing this as an operator, I would ask for the listing copy, first ten photos, amenity list, and current operating pain points before giving deeper advice.',
    disclaimer: 'Informational snapshot only. Revenue outcomes vary and require StayDog review.',
    categories: {
      guestAppeal,
      amenityStrength,
      listingQuality,
      photoQuality,
      operationalComplexity,
      revenueUpsideIndicators,
    },
    topTakeaways: insights.topTakeaways,
    guestAppealNotes: insights.guestAppealNotes,
    revenueLevers: insights.revenueLevers,
    operationalWatchouts: insights.operationalWatchouts,
    missingOpportunities: insights.missingOpportunities,
    recommendedImprovements: insights.recommendedImprovements,
    firstSuggestedSteps: insights.firstSuggestedSteps,
    stayDogFit: 'StayDog may be a good fit if you want hospitality-first guest care, cleaner owner visibility, dynamic pricing review, and a more hands-off operating model.',
    stayDogActionPlan: [
      'Tighten the first-screen guest promise so the listing immediately explains who the stay is for and why it should be chosen over nearby alternatives.',
      'Review the first five photos, title, and opening copy together so the strongest trip use case is obvious before guests scroll.',
      'Pressure-test pricing, minimum stays, guest messaging, cleaning standards, supply cadence, and maintenance response before making bigger revenue recommendations.',
      'Use a strategy call to discuss deeper ideas such as seasonal packaging, direct-booking positioning, owner reporting, vendor coverage, and upgrade priorities.',
    ],
  }
}

export async function submitPropertyScore(payload) {
  const normalizedPayload = {
    ...payload,
    source: 'StayDog Property Potential Score',
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
        message: 'That listing could not be accessed automatically. Continue to Partner With Us and StayDog can review it directly.',
      }
    }

    const result = createLocalSnapshot(normalizedPayload, 'Generated locally from the details provided. Connect the score endpoint for live URL fetching.')
    const staged = { ...normalizedPayload, result }
    localStorage.setItem('staydog:last-property-score', JSON.stringify(staged))

    return {
      status: 'staged',
      message: 'Your StayDog snapshot is ready. To speak with StayDog, continue to Partner With Us.',
      result,
    }
  }
}
