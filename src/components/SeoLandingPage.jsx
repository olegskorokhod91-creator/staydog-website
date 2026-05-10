import { ArrowRight, CheckCircle2, Mail, Phone, Sparkles } from 'lucide-react'
import { bookingUrl, proofStats } from '../data/content'
import { seoPages } from '../data/seoPages'
import CtaButton from './CtaButton'

export default function SeoLandingPage({ page, navigate }) {
  return (
    <main className="seo-page">
      <section className="section-dark seo-hero">
        <div className="cinematic-grid" aria-hidden="true" />
        <div className="section-shell seo-hero-shell">
          <div className="seo-copy" data-reveal>
            <span className="section-kicker">
              <Sparkles aria-hidden="true" size={17} />
              {page.eyebrow}
            </span>
            <h1>{page.title}</h1>
            <p>{page.intro}</p>
            <div className="seo-actions">
              <CtaButton type="button" onClick={() => navigate('/partner-with-us')}>
                Partner With StayDog
              </CtaButton>
              <button type="button" className="quiet-link" onClick={() => navigate('/property-potential-score')}>
                Check Property Score
                <ArrowRight aria-hidden="true" size={18} />
              </button>
            </div>
          </div>

          <aside className="seo-proof-panel" aria-label="StayDog trust signals" data-reveal>
            <span>StayDog Rentals</span>
            <h2>{page.market}</h2>
            <div>
              {proofStats.map((stat) => (
                <article key={stat.label}>
                  <strong>{stat.value}</strong>
                  <small>{stat.label}</small>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="section-light seo-content-section">
        <div className="section-shell seo-content-grid">
          <div className="seo-block" data-reveal>
            <span className="section-kicker">What StayDog Handles</span>
            <h2>Owner-friendly operations, guest-first standards.</h2>
            <p>
              StayDog Rentals helps owners simplify the parts of vacation rental management that usually create the most
              friction: guest care, listing quality, pricing review, turnovers, maintenance coordination, and owner
              visibility.
            </p>
          </div>

          <div className="seo-highlight-list" data-reveal>
            {page.highlights.map((highlight) => (
              <div key={highlight}>
                <CheckCircle2 aria-hidden="true" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light seo-services-section">
        <div className="section-shell">
          <div className="seo-section-header" data-reveal>
            <span className="section-kicker">Management Services</span>
            <h2>Built for better stays and calmer ownership.</h2>
          </div>
          <div className="seo-service-grid">
            {page.services.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="seo-service-card" data-reveal>
                <Icon aria-hidden="true" />
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-dark seo-faq-section">
        <div className="section-shell seo-faq-grid">
          <div data-reveal>
            <span className="section-kicker">Owner Questions</span>
            <h2>Clear answers before you hand over the keys.</h2>
            <div className="seo-contact-card">
              <a href="tel:+12483828370">
                <Phone aria-hidden="true" />
                248-382-8370
              </a>
              <a href="mailto:superfaststays@gmail.com">
                <Mail aria-hidden="true" />
                superfaststays@gmail.com
              </a>
            </div>
          </div>

          <div className="seo-faq-list" data-reveal>
            {page.faqs.map(([question, answer]) => (
              <article key={question}>
                <h3>{question}</h3>
                <p>{answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light seo-related-section">
        <div className="section-shell seo-related">
          <div data-reveal>
            <span className="section-kicker">Explore StayDog</span>
            <h2>More ways to review your property.</h2>
          </div>
          <div className="seo-related-links" data-reveal>
            <button type="button" onClick={() => navigate('/property-potential-score')}>Property Potential Score</button>
            <button type="button" onClick={() => navigate('/partner-with-us')}>Partner With Us</button>
            <a href={bookingUrl} target="_blank" rel="noreferrer">Explore Homes</a>
            {seoPages
              .filter((related) => related.path !== page.path)
              .slice(0, 3)
              .map((related) => (
                <button key={related.path} type="button" onClick={() => navigate(related.path)}>
                  {related.eyebrow}
                </button>
              ))}
          </div>
        </div>
      </section>
    </main>
  )
}
