import { ArrowLeft, BarChart3, CheckCircle2, ExternalLink, Link2, Loader2, PencilLine, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { submitPropertyScore } from '../services/propertyScoreService'
import CtaButton from './CtaButton'

const initialForm = {
  mode: 'url',
  listingUrl: '',
  details: '',
  name: '',
  email: '',
  phone: '',
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

export default function PropertyScorePage({ navigate }) {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const needsDetails = form.mode === 'manual'
  const canSubmit = form.name.trim() && form.email.trim() && (form.mode === 'url' ? form.listingUrl.trim() : form.details.trim())

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
      setForm((current) => ({
        ...current,
        mode: 'manual',
        details: current.details || `Listing URL: ${current.listingUrl}\n\nPaste listing highlights, amenities, photo notes, reviews, pricing context, or screenshots later.`,
      }))
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
            A careful, non-guaranteed snapshot of guest appeal, amenities, listing quality, operational complexity, and
            possible upside indicators.
          </p>
        </section>

        <div className="score-workspace">
          <form className="score-form-panel" onSubmit={submit} data-reveal>
            <div className="mode-toggle" aria-label="Choose score input method">
              <button type="button" className={form.mode === 'url' ? 'is-selected' : ''} onClick={() => update('mode', 'url')}>
                <Link2 aria-hidden="true" />
                Paste URL
              </button>
              <button type="button" className={form.mode === 'manual' ? 'is-selected' : ''} onClick={() => update('mode', 'manual')}>
                <PencilLine aria-hidden="true" />
                Manual details
              </button>
            </div>

            {form.mode === 'url' && (
              <label>
                Listing URL
                <input
                  value={form.listingUrl}
                  onChange={(event) => update('listingUrl', event.target.value)}
                  placeholder="https://www.airbnb.com/rooms/..."
                  type="url"
                />
              </label>
            )}

            {needsDetails && (
              <label>
                Property details
                <textarea
                  value={form.details}
                  onChange={(event) => update('details', event.target.value)}
                  placeholder="Bedrooms, bathrooms, amenities, location, listing copy, photo notes, reviews, pain points..."
                  rows={8}
                />
              </label>
            )}

            <div className="score-contact-grid">
              <label>
                Name
                <input value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Full name" />
              </label>
              <label>
                Email
                <input value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="you@example.com" inputMode="email" />
              </label>
              <label>
                Phone
                <input value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder="(248) 382-8370" type="tel" />
              </label>
            </div>

            <p className="score-disclaimer">
              This AI-assisted snapshot is for informational purposes only and is not a revenue guarantee.
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
                  Paste a public listing URL or enter details manually. If the page blocks access, the tool will ask for
                  manual listing details instead.
                </p>
              </div>
            ) : (
              <div className="score-result">
                <div className="score-total">
                  <span>StayDog Potential Score</span>
                  <strong>{result.score}</strong>
                  <small>out of 100</small>
                </div>

                <div className="score-meter-grid">
                  {Object.entries(result.categories).map(([key, value]) => (
                    <ScoreMeter key={key} label={labels[key]} value={value} />
                  ))}
                </div>

                <div className="score-notes">
                  <article>
                    <h3>Missing Opportunities</h3>
                    <ul>{result.missingOpportunities.map((item) => <li key={item}>{item}</li>)}</ul>
                  </article>
                  <article>
                    <h3>Recommended Improvements</h3>
                    <ul>{result.recommendedImprovements.map((item) => <li key={item}>{item}</li>)}</ul>
                  </article>
                  <article>
                    <h3>Why StayDog may be a good fit</h3>
                    <p>{result.stayDogFit}</p>
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
