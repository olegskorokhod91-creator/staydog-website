import { Mail, Phone } from 'lucide-react'
import { proofStats } from '../data/content'

export default function Footer({ navigate }) {
  return (
    <footer className="footer" id="contact">
      <div className="section-shell footer-shell">
        <div className="footer-brand" data-reveal>
          <span className="brand-mark">SD</span>
          <div>
            <strong>StayDog Rentals</strong>
            <p>Sit Back. Let StayDog Handle It.</p>
          </div>
        </div>

        <div className="footer-links" data-reveal>
          <button type="button" onClick={() => navigate('/', '#owners')}>For Owners</button>
          <button type="button" onClick={() => navigate('/', '#homes')}>Explore Homes</button>
          <button type="button" onClick={() => navigate('/', '#signature')}>Signature Collection</button>
          <button type="button" onClick={() => navigate('/property-potential-score')}>Property Score</button>
          <button type="button" onClick={() => navigate('/partner-with-us')}>Partner With Us</button>
        </div>

        <div className="footer-contact" data-reveal>
          <span>Contact StayDog</span>
          <a href="mailto:superfaststays@gmail.com">
            <Mail aria-hidden="true" />
            superfaststays@gmail.com
          </a>
          <a href="tel:+12483828370">
            <Phone aria-hidden="true" />
            248-382-8370
          </a>
        </div>

        <div className="footer-proof" data-reveal>
          {proofStats.slice(0, 2).map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
          <p>Premium hospitality operations for owners who want the work handled.</p>
        </div>
      </div>
    </footer>
  )
}
