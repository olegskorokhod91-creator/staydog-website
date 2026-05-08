import {
  ArrowLeft,
  BarChart3,
  Camera,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  Home,
  Link2,
  Loader2,
  ShieldCheck,
  TrendingUp,
  Wrench,
} from 'lucide-react'
import { useState } from 'react'
import { submitPropertyScore } from '../services/propertyScoreService'
import CtaButton from './CtaButton'

const initialForm = {
  mode: 'url',
  listingUrl: '',
  details: '',
}

const labels = {
  guestAppeal: 'Guest Appeal',
  amenityStrength: 'Amenity Strength',
  listingQuality: 'Listing Quality',
  photoQuality: 'Photo Quality',
  operationalComplexity: 'Operational Complexity',
  revenueUpsideIndicators: 'Revenue Upside Indicators',
}

function ScoreMeter({ label, value }) {
  return (
    <div className="score-meter">
      <div>
        <span>{label}</span>
        <strong>{value}/100</strong>
      </div>
      <i style={{ width: `${value}%` }} />
    </div>
  )
}

function InsightCard({ icon: Icon, title, items }) {
  return (
    <article className="score-insight-card">
      <Icon aria-hidden="true" />
      <h3>{title}</h3>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </article>
  )
}

export default function PropertyScorePage({ navigate }) {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const canSubmit = form.listingUrl.trim()

  const submit = async (event) => {
    event.preventDefault()
    if (!canSubmit) return

    setStatus('submitting')
    setMessage('')
    setResult(null)

    const response = await submitPropertyScore(form)
    setStatus(response.status)
    setMessage(response.message || '')

    if (response.status === 'fallback-required') {
      return
    }

    setResult(response.result)
  }

  return (
    <main className="score-page">
      <div className="cinematic-grid" aria-hidden="true" />
      <div className="section-shell score-page-shell">
        <section className="score-page-intro" data-reveal>
          <button type="button" className="back-link" onClick={() => navigate('/')}>
            <ArrowLeft aria-hidden="true" />
            Back home
          </button>
          <div className="eyebrow">
            <ShieldCheck aria-hidden="true" size={17} />
            AI-assisted owner tool
          </div>
          <h1>StayDog Property Potential Score.</h1>
          <p>
            A careful snapshot of guest appeal, amenities, listing quality, operational complexity, and possible upside
            indicators.
          </p>
        </section>

        <div className="score-workspace">
          <form className="score-form-panel" onSubmit={submit} data-reveal>
            <div className="score-url-intro">
              <Link2 aria-hidden="true" />
              <div>
                <span>Paste a public listing URL</span>
                <p>Airbnb, VRBO, Booking.com, Expedia, Zillow, or your direct booking page.</p>
              </div>
            </div>

            <label>
              Listing URL
              <input
                value={form.listingUrl}
                onChange={(event) => update('listingUrl', event.target.value)}
                placeholder="https://www.airbnb.com/rooms/..."
                type="url"
              />
            </label>

            <p className="score-disclaimer">
              * AI-assisted snapshots are informational only. Revenue outcomes vary and require StayDog review.
            </p>

            <button type="submit" disabled={!canSubmit || status === 'submitting'} className="score-submit">
              {status === 'submitting' ? <Loader2 aria-hidden="true" className="spin" /> : <BarChart3 aria-hidden="true" />}
              Generate Snapshot
            </button>

            {message && <p className="score-message">{message}</p>}
          </form>

          <section className="score-result-panel" aria-live="polite" data-reveal>
            {!result ? (
              <div className="score-empty-state">
                <div className="score-radar" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <h2>Property Potential Snapshot</h2>
                <p>
                  Paste a public listing URL. If the page blocks access, StayDog can still review the property after you
                  continue to Partner With Us.
                </p>
              </div>
            ) : (
              <div className="score-result">
                <div className="score-total">
                  <span>{result.analysisMode || 'StayDog Potential Score'}</span>
                  <strong>{result.score}</strong>
                  <small>out of 100</small>
                </div>

                <div className="score-manager-note">
                  <span>Operator read</span>
                  <p>{result.managerSummary}</p>
                  {(result.sourceNote || result.sourceQuality) && (
                    <small>
                      {result.sourceQuality || 'Analysis source'}: {result.sourceNote}
                    </small>
                  )}
                </div>

                <div className="score-meter-grid">
                  {Object.entries(result.categories).map(([key, value]) => (
                    <ScoreMeter key={key} label={labels[key]} value={value} />
                  ))}
                </div>

                <div className="score-takeaways">
                  <h3>What I would look at first</h3>
                  <ul>{(result.topTakeaways || []).map((item) => <li key={item}>{item}</li>)}</ul>
                </div>

                <div className="score-insight-grid">
                  <InsightCard icon={Home} title="Guest Appeal" items={result.guestAppealNotes || []} />
                  <InsightCard icon={TrendingUp} title="Revenue Levers" items={result.revenueLevers || []} />
                  <InsightCard icon={Wrench} title="Operational Watchouts" items={result.operationalWatchouts || []} />
                  <InsightCard icon={Camera} title="Missing Opportunities" items={result.missingOpportunities || []} />
                </div>

                <div className="score-steps">
                  <ClipboardList aria-hidden="true" />
                  <div>
                    <h3>First suggested steps</h3>
                    <ol>{(result.firstSuggestedSteps || []).map((item) => <li key={item}>{item}</li>)}</ol>
                  </div>
                </div>

                <div className="score-notes">
                  <article>
                    <h3>Recommended Improvements</h3>
                    <ul>{result.recommendedImprovements.map((item) => <li key={item}>{item}</li>)}</ul>
                  </article>
                  <article>
                    <h3>Why StayDog may be a good fit</h3>
                    <p>{result.stayDogFit}</p>
                  </article>
                  <article>
                    <h3>Manager note</h3>
                    <p>{result.conversationMessage}</p>
                  </article>
                </div>

                <p className="score-disclaimer">{result.disclaimer}</p>
                <div className="hero-actions">
                  <CtaButton onClick={() => navigate('/partner-with-us')}>Schedule Strategy Call</CtaButton>
                  <CtaButton href="mailto:superfaststays@gmail.com?subject=StayDog Property Potential Score" variant="secondary">
                    Email StayDog
                  </CtaButton>
                  <a className="direct-booking-note" href="https://www.properties.staydogrentals.com/" target="_blank" rel="noreferrer">
                    Explore managed homes <ExternalLink aria-hidden="true" size={15} />
                  </a>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
