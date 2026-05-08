import { bookingUrl, proofStats, propertyImages } from '../data/content'
import CtaButton from './CtaButton'

export default function HomesProofSection() {
  return (
    <section className="homes-section section-light" id="homes">
      <div className="portal-band" aria-hidden="true" />
      <div className="section-shell">
        <div className="homes-header" data-reveal>
          <div>
            <div className="section-kicker">Real homes. Real proof.</div>
            <h2>Our properties</h2>
          </div>
          <p>
            A gallery of StayDog Rentals homes, outdoor spaces, and guest-ready amenities. Book direct and save on
            third-party fees, or partner with StayDog to bring full-service management to your own vacation home.
          </p>
        </div>

        <div className="proof-ledger" data-reveal>
          {proofStats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="property-showcase" aria-label="StayDog property photography">
          {propertyImages.map((property, index) => (
            <article className={`property-card property-card-${index + 1}`} key={property.src} data-reveal>
              <img
                src={property.src}
                alt="StayDog Rentals managed vacation home"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.hidden = true
                }}
              />
            </article>
          ))}
        </div>

        <div className="homes-actions" data-reveal>
          <CtaButton href={bookingUrl} icon="external">
            Explore Homes
          </CtaButton>
        </div>
      </div>
    </section>
  )
}
