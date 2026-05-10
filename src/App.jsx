import { useEffect, useRef, useState } from 'react'
import Footer from './components/Footer'
import HeroSection from './components/HeroSection'
import HomesProofSection from './components/HomesProofSection'
import IntelligenceHubSection from './components/IntelligenceHubSection'
import Navigation from './components/Navigation'
import OperationsSection from './components/OperationsSection'
import OwnerConversionBand from './components/OwnerConversionBand'
import PartnerFunnel from './components/PartnerFunnel'
import PropertyScorePage from './components/PropertyScorePage'
import PropertyScoreSection from './components/PropertyScoreSection'
import SeoLandingPage from './components/SeoLandingPage'
import SignatureHospitalitySection from './components/SignatureHospitalitySection'
import { seoPageMap } from './data/seoPages'
import { usePageAnimations } from './hooks/usePageAnimations'
import { applyRouteSeo } from './utils/seo'

function useRoute() {
  const [route, setRoute] = useState(() => ({
    path: window.location.pathname,
    hash: window.location.hash,
  }))

  useEffect(() => {
    const onPop = () => setRoute({ path: window.location.pathname, hash: window.location.hash })
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = (path = '/', hash = '') => {
    const nextPath = `${path}${hash}`
    window.history.pushState({}, '', nextPath)
    setRoute({ path, hash })
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return { route, navigate }
}

function HomePage({ navigate }) {
  return (
    <>
      <HeroSection navigate={navigate} />
      <OperationsSection />
      <IntelligenceHubSection />
      <HomesProofSection />
      <PropertyScoreSection navigate={navigate} />
      <SignatureHospitalitySection />
      <OwnerConversionBand navigate={navigate} />
    </>
  )
}

export default function App() {
  const { route, navigate } = useRoute()
  const scopeRef = useRef(null)
  const isPartnerPage = route.path === '/partner-with-us'
  const isScorePage = route.path === '/property-potential-score'
  const seoPage = seoPageMap[route.path]
  const routeKey = `${route.path}${route.hash}`

  usePageAnimations(scopeRef, routeKey)

  useEffect(() => {
    if (seoPage) {
      applyRouteSeo({
        title: seoPage.metaTitle,
        description: seoPage.description,
        path: seoPage.path,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: seoPage.eyebrow,
          provider: {
            '@type': 'LocalBusiness',
            name: 'StayDog Rentals',
            email: 'superfaststays@gmail.com',
            telephone: '+1-248-382-8370',
          },
          areaServed: seoPage.market,
          description: seoPage.description,
          url: `${window.location.origin}${seoPage.path}`,
        },
      })
      return
    }

    if (isPartnerPage) {
      applyRouteSeo({
        title: 'Partner With StayDog | StayDog Rentals',
        description:
          'Tell StayDog Rentals about your vacation rental and request a human review for full-service vacation rental management.',
        path: '/partner-with-us',
      })
      return
    }

    if (isScorePage) {
      applyRouteSeo({
        title: 'Property Potential Score | StayDog Rentals',
        description:
          'Paste a vacation rental listing URL and get an AI-assisted StayDog Property Potential Score with guest appeal, amenity, listing quality, and improvement notes.',
        path: '/property-potential-score',
      })
      return
    }

    applyRouteSeo({
      title: 'StayDog Rentals | Sit Back. Let StayDog Handle It.',
      description:
        'StayDog Rentals provides premium vacation rental management powered by hospitality expertise, automation-first operations, revenue optimization, and 24/7 guest care.',
      path: '/',
    })
  }, [isPartnerPage, isScorePage, seoPage])

  useEffect(() => {
    if (route.hash && !isPartnerPage && !isScorePage && !seoPage) {
      requestAnimationFrame(() => {
        document.querySelector(route.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [route.hash, route.path, isPartnerPage, isScorePage, seoPage])

  return (
    <div ref={scopeRef} className="app-frame">
      <Navigation navigate={navigate} />
      {isPartnerPage ? (
        <PartnerFunnel navigate={navigate} />
      ) : isScorePage ? (
        <PropertyScorePage navigate={navigate} />
      ) : seoPage ? (
        <SeoLandingPage page={seoPage} navigate={navigate} />
      ) : (
        <HomePage navigate={navigate} />
      )}
      <Footer navigate={navigate} />
    </div>
  )
}
