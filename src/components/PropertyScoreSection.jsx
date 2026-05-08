import { BarChart3, Camera, ClipboardList, Link2, Sparkles, WandSparkles } from 'lucide-react'
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
            <span>A fast read on guest appeal, amenities, listing quality, and operational complexity.</span>
          </article>
          <article>
            <Link2 aria-hidden="true" />
            <strong>Full listing analysis</strong>
            <span>Paste Airbnb, VRBO, Booking.com, Zillow, Expedia, or direct-booking details.</span>
          </article>
          <article>
            <Camera aria-hidden="true" />
            <strong>Photo and amenity review</strong>
            <span>See which first-screen moments, amenities, and guest hooks could work harder.</span>
          </article>
          <article>
            <ClipboardList aria-hidden="true" />
            <strong>First suggested steps</strong>
            <span>Get practical next moves before a StayDog strategy call.</span>
          </article>
          <article className="score-teaser-card-feature">
            <WandSparkles aria-hidden="true" />
            <strong>Built for owners deciding what to do next</strong>
            <span>Useful whether your home is already listed or still being prepared for launch.</span>
          </article>
        </div>
      </div>
    </section>
  )
}
