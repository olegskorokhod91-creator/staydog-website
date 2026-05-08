import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function usePageAnimations(scopeRef, routeKey) {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !scopeRef.current) return undefined

    const context = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 28, filter: 'blur(5px)' },
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.72,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 82%',
            },
          },
        )
      })

      gsap.utils.toArray('[data-parallax]').forEach((element) => {
        const depth = Number(element.dataset.parallax || 0.12)
        gsap.to(element, {
          yPercent: depth * -100,
          ease: 'none',
          scrollTrigger: {
            trigger: element.closest('section') || element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })

      gsap.utils.toArray('[data-service-card]').forEach((element, index) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, x: index % 2 === 0 ? -28 : 28, scale: 0.96 },
          {
            autoAlpha: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.035,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
            },
          },
        )
      })

      gsap.utils.toArray('[data-hub-line]').forEach((element) => {
        gsap.fromTo(
          element,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.15,
            transformOrigin: 'left center',
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 90%',
            },
          },
        )
      })
    }, scopeRef)

    return () => context.revert()
  }, [scopeRef, routeKey])
}
