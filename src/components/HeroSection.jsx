import { ArrowDown, BarChart3, BadgeCheck, ShieldCheck, Sparkles } from 'lucide-react'
import { bookingUrl, platformBadges, proofStats, propertyImages } from '../data/content'
import CtaButton from './CtaButton'

export default function HeroSection({ navigate }) {
  return (
    <section className="hero-section section-dark" id="home">
      <div className="cinematic-grid" aria-hidden="true" />
      <div className="section-shell hero-shell">
        <div className="hero-copy">
          <div className="eyebrow" data-reveal>
            <ShieldCheck aria-hidden="true" size={17} />
            Hospitality-forward vacation rental management
          </div>
          <div className="hero-title-lockup" data-reveal>
            <div className="hero-logo-showcase" aria-label="StayDog Rentals logo">
              <img src="/assets/logo/staydog-logo.jpg" alt="StayDog Rentals" />
            </div>
            <h1>Sit Back. StayDog Handles It.</h1>
          </div>
          <p className="hero-subcopy" data-reveal>
            We manage your vacation rental like a luxury hospitality brand - guest communication, dynamic pricing,
            cleaning, maintenance, automation, and revenue optimization - all handled.
          </p>
          <div className="hero-actions" data-reveal>
            <CtaButton onClick={() => navigate('/partner-with-us')}>Partner With StayDog</CtaButton>
            <CtaButton href={bookingUrl} variant="secondary" icon="external" className="book-direct-hero">
              Book Direct and Save!!
            </CtaButton>
          </div>
          <button type="button" className="hero-score-banner" onClick={() => navigate('/property-potential-score')} data-reveal>
            <span>
              <BarChart3 aria-hidden="true" />
              New owner tool
            </span>
            <strong>Check your property&apos;s full earning potential</strong>
            <small>Get an AI-assisted StayDog snapshot with opportunity notes and recommended next steps.</small>
          </button>
          <div className="platform-row" aria-label="Featured booking platforms" data-reveal>
            <strong>
              <BadgeCheck aria-hidden="true" size={15} />
              Featured on
            </strong>
            {platformBadges.map((badge) => (
              <span key={badge}>{badge}</span>
            ))}
          </div>
        </div>

        <div className="hero-visual" data-parallax="0.08">
          <a className="hero-visual-label" href={bookingUrl} target="_blank" rel="noreferrer">
            <Sparkles aria-hidden="true" size={16} />
            Our properties
          </a>
          <div className="hero-property-gallery" aria-label="StayDog Rentals property photography">
            {propertyImages.map((property, index) => (
              <figure className={`hero-gallery-card hero-gallery-card-${index + 1}`} key={property.src}>
                <img src={property.src} alt="StayDog Rentals managed vacation home" loading={index === 0 ? 'eager' : 'lazy'} />
              </figure>
            ))}
          </div>
          <div className="hero-proof-strip" data-reveal>
            {proofStats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <a className="scroll-cue" href="#owners" aria-label="Scroll to owner operations">
        <ArrowDown aria-hidden="true" />
      </a>
    </section>
  )
}
