import { Cpu, MessageCircle, TrendingUp } from 'lucide-react'
import { hubPanels } from '../data/content'

function MiniGraph() {
  return (
    <div className="mini-graph" aria-hidden="true">
      {[42, 64, 52, 76, 68, 86, 72, 91].map((height, index) => (
        <span key={index} style={{ height: `${height}%` }} />
      ))}
    </div>
  )
}

export default function IntelligenceHubSection() {
  return (
    <section className="hub-section section-light">
      <div className="section-shell hub-shell">
        <div className="hub-heading" data-reveal>
          <div className="section-kicker">Intelligence hub</div>
          <h2>Automation does the busywork. Hospitality stays human.</h2>
          <p>
            StayDog Rentals brings demand signals, owner visibility, guest care, and maintenance response into one calm
            operating picture.
          </p>
        </div>

        <div className="hub-layout">
          <div className="dashboard-stage" data-reveal>
            <div className="dashboard-ambient" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="intelligence-composition">
              <div className="intelligence-copy">
                <small>Owner revenue summary</small>
                <strong>Clean, current, actionable</strong>
                <p>StayDog turns pricing, guest care, and property readiness into a readable operating rhythm.</p>
              </div>

              <MiniGraph />

              <div className="signal-lanes" aria-label="StayDog operating signals">
                <span><MessageCircle aria-hidden="true" /> Guest messaging flow</span>
                <span><TrendingUp aria-hidden="true" /> Pricing review queue</span>
                <span><Cpu aria-hidden="true" /> Automation health check</span>
              </div>
            </div>
          </div>

          <div className="hub-panel-grid">
            {hubPanels.map(({ icon: Icon, title, eyebrow, lines }) => (
              <article className="hub-panel" key={title} data-reveal>
                <Icon aria-hidden="true" />
                <small>{eyebrow}</small>
                <h3>{title}</h3>
                <ul>
                  {lines.map((line) => (
                    <li key={line}>
                      <span data-hub-line />
                      {line}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
