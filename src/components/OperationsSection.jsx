import { CheckCircle2 } from 'lucide-react'
import { operations } from '../data/content'

export default function OperationsSection() {
  return (
    <section className="operations-section section-dark" id="owners">
      <div className="section-shell split-shell">
        <div className="sticky-story-panel" data-reveal>
          <div className="section-kicker">Owner operations</div>
          <h2>StayDog Rentals runs the whole operating path before a guest ever arrives.</h2>
          <p>
            StayDog combines superhost-level hospitality standards with automation-first systems, so owners get a
            refined end-to-end operation without becoming the operations team.
          </p>
          <div className="market-note">
            Serving Michigan, Indiana, and Illinois markets today, with selective expansion opportunities where the
            hospitality standard can stay high.
          </div>
        </div>

        <div className="service-grid" aria-label="StayDog management services">
          <div className="service-grid-feature operations-command-panel" data-reveal>
            <div className="ops-path" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="ops-command-copy">
              <small>StayDog operating system</small>
              <strong>Guest care, property care, owner clarity.</strong>
              <p>Every core workflow is choreographed into a calm management layer built for hospitality standards.</p>
            </div>
            <div className="ops-flow">
              {operations.slice(0, 5).map(({ icon: Icon, label }) => (
                <span key={label}>
                  <Icon aria-hidden="true" />
                  {label}
                </span>
              ))}
            </div>
            <div className="ops-orbit" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
          </div>
          {operations.map(({ icon: Icon, label }) => (
            <article className="service-card" key={label} data-service-card>
              <Icon aria-hidden="true" />
              <span>{label}</span>
              <CheckCircle2 aria-hidden="true" className="service-check" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
