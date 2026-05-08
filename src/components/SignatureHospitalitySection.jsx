import { ArrowRight, BadgeCheck } from 'lucide-react'
import { signatureDestinations } from '../data/content'

export default function SignatureHospitalitySection() {
  return (
    <section className="signature-section section-light" id="signature">
      <div className="section-shell signature-shell">
        <div className="signature-copy" data-reveal>
          <div className="section-kicker">Signature hospitality</div>
          <h2>Not just listing management. A real hospitality operating culture.</h2>
          <p>
            StayDog also operates memorable hospitality destinations, bringing owners the kind of real-world guest
            experience discipline that software alone cannot provide.
          </p>
          <div className="signature-badge">
            <BadgeCheck aria-hidden="true" />
            Superhost-level standards, premium guest care, owner-first visibility.
          </div>
        </div>

        <div className="signature-destinations">
          {signatureDestinations.map(({ name, copy, image, url, linkLabel, icon: Icon }) => (
            <article className="signature-feature" key={name} data-reveal>
              <img
                src={image}
                alt={`${name} hospitality destination`}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.hidden = true
                }}
              />
              <div>
                <Icon aria-hidden="true" />
                <h3>{name}</h3>
                <p>{copy}</p>
                <a href={url} target="_blank" rel="noreferrer">
                  {linkLabel} <ArrowRight aria-hidden="true" size={15} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
