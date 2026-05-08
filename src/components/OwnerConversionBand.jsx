import { Mail, Phone, Sparkles } from 'lucide-react'
import CtaButton from './CtaButton'

export default function OwnerConversionBand({ navigate }) {
  return (
    <section className="conversion-band section-dark">
      <div className="section-shell conversion-shell" data-reveal>
        <div>
          <div className="section-kicker">Partner funnel</div>
          <h2>See if your property is a StayDog fit.</h2>
          <p>
            StayDog Rentals keeps the intake focused, then routes qualified owners to human follow-up for a thoughtful
            management conversation.
          </p>
        </div>
        <div className="conversion-actions">
          <CtaButton onClick={() => navigate('/partner-with-us')} icon="calendar">
            Partner With Us
          </CtaButton>
          <a href="mailto:superfaststays@gmail.com">
            <Mail aria-hidden="true" />
            superfaststays@gmail.com
          </a>
          <a href="tel:+12483828370">
            <Phone aria-hidden="true" />
            248-382-8370
          </a>
        </div>
        <Sparkles className="conversion-spark" aria-hidden="true" />
      </div>
    </section>
  )
}
