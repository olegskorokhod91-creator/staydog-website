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
import SignatureHospitalitySection from './components/SignatureHospitalitySection'
import { usePageAnimations } from './hooks/usePageAnimations'

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
  const routeKey = `${route.path}${route.hash}`

  usePageAnimations(scopeRef, routeKey)

  useEffect(() => {
    document.title = isPartnerPage
      ? 'Partner With StayDog | StayDog Rentals'
      : isScorePage
        ? 'Property Potential Score | StayDog Rentals'
        : 'StayDog Rentals | Sit Back. StayDog Handles It.'
  }, [isPartnerPage, isScorePage])

  useEffect(() => {
    if (route.hash && !isPartnerPage && !isScorePage) {
      requestAnimationFrame(() => {
        document.querySelector(route.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [route.hash, route.path, isPartnerPage, isScorePage])

  return (
    <div ref={scopeRef} className="app-frame">
      <Navigation navigate={navigate} />
      {isPartnerPage ? (
        <PartnerFunnel navigate={navigate} />
      ) : isScorePage ? (
        <PropertyScorePage navigate={navigate} />
      ) : (
        <HomePage navigate={navigate} />
      )}
      <Footer navigate={navigate} />
    </div>
  )
}
