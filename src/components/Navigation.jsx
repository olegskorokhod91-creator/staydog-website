import { BarChart3, CalendarCheck, Home, Mail, Menu, Sparkles, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useAssetStatus } from '../hooks/useAssetStatus'

const logoCandidates = [
  '/assets/logo/staydog-logo.svg',
  '/assets/logo/staydog-logo.png',
  '/assets/logo/staydog-logo.jpg',
  '/assets/logo/staydog-logo.jpeg',
]

function useFirstAvailableAsset(urls) {
  const svg = useAssetStatus(urls[0])
  const png = useAssetStatus(urls[1])
  const jpg = useAssetStatus(urls[2])
  const jpeg = useAssetStatus(urls[3])

  return useMemo(() => {
    const statuses = [svg, png, jpg, jpeg]
    const index = statuses.findIndex(({ available }) => available)
    return index >= 0 ? urls[index] : null
  }, [jpeg, jpg, png, svg, urls])
}

export default function Navigation({ navigate }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const logoUrl = useFirstAvailableAsset(logoCandidates)

  useEffect(() => {
    document.body.classList.toggle('nav-open', open)
    return () => document.body.classList.remove('nav-open')
  }, [open])

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 90)
    updateScrolled()
    window.addEventListener('scroll', updateScrolled, { passive: true })
    return () => window.removeEventListener('scroll', updateScrolled)
  }, [])

  const localNav = (path, hash) => {
    setOpen(false)
    navigate(path, hash)
  }

  return (
    <header className={`site-nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`} aria-label="Primary navigation">
      <a className="brand-lockup" href="/" onClick={(event) => {
        event.preventDefault()
        localNav('/')
      }}>
        {logoUrl ? (
          <img src={logoUrl} alt="StayDog Rentals" />
        ) : (
          <span className="brand-mark" aria-hidden="true">SD</span>
        )}
        <span>
          <strong>StayDog</strong>
          <small>Rentals</small>
        </span>
      </a>

      <nav className={`nav-links ${open ? 'is-open' : ''}`}>
        <button type="button" onClick={() => localNav('/')}>
          <Home aria-hidden="true" size={16} />
          Home
        </button>
        <button type="button" onClick={() => localNav('/', '#owners')}>
          <Sparkles aria-hidden="true" size={16} />
          For Owners
        </button>
        <button type="button" onClick={() => localNav('/property-potential-score')}>
          <BarChart3 aria-hidden="true" size={16} />
          Property Score
        </button>
        <button type="button" onClick={() => localNav('/', '#homes')}>
          <CalendarCheck aria-hidden="true" size={16} />
          Explore Homes
        </button>
        <button type="button" onClick={() => localNav('/', '#signature')}>
          Signature Collection
        </button>
        <button type="button" onClick={() => localNav('/partner-with-us')}>
          Partner With Us
        </button>
        <button type="button" onClick={() => localNav('/', '#contact')}>
          <Mail aria-hidden="true" size={16} />
          Contact
        </button>
      </nav>

      <button
        type="button"
        className="nav-menu-button"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
    </header>
  )
}
