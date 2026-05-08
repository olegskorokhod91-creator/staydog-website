import { BarChart3, Link2, Sparkles } from 'lucide-react'
import CtaButton from './CtaButton'

export default function PropertyScoreSection({ navigate }) {
  return (
    <section className="score-teaser section-light" id="property-score">
      <div className="section-shell score-teaser-shell">
        <div className="score-teaser-copy" data-reveal>
          <div className="section-kicker">
            <Sparkles aria-hidden="true" size={17} />
            StayDog Property Potential Score
          </div>
          <h2>Get a careful snapshot of your vacation rental opportunity.</h2>
          <p>
            Paste a listing URL or add property details manually. StayDog will return a potential score, opportunity
            notes, and recommended next steps before a human strategy review.
          </p>
          <CtaButton onClick={() => navigate('/property-potential-score')} icon="arrow">
            Get Property Score
          </CtaButton>
        </div>

        <div className="score-teaser-card" data-reveal>
          <div className="score-radar" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <article>
            <BarChart3 aria-hidden="true" />
            <strong>Potential Score</strong>
            <span>Out of 100</span>
          </article>
          <article>
            <Link2 aria-hidden="true" />
            <strong>URL or manual details</strong>
            <span>Airbnb, Vrbo, Booking.com, Zillow, or direct booking</span>
          </article>
        </div>
      </div>
    </section>
  )
}
