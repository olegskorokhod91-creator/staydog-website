import {
  BadgeCheck,
  BarChart3,
  CalendarCheck,
  ClipboardCheck,
  Home,
  LockKeyhole,
  MapPin,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react'

export const seoPages = [
  {
    path: '/vacation-rental-management',
    eyebrow: 'Vacation Rental Management',
    title: 'Full-service vacation rental management for owners who want the work handled.',
    metaTitle: 'Vacation Rental Management | StayDog Rentals',
    description:
      'StayDog Rentals provides hospitality-forward vacation rental management with guest communication, pricing, cleaning coordination, maintenance, owner visibility, and automation-first operations.',
    market: 'Michigan, Indiana, Illinois, and selective expansion markets',
    intro:
      'StayDog Rentals helps owners turn a home into a professionally operated guest experience. We focus on the everyday details that shape reviews, revenue opportunity, and owner confidence.',
    highlights: [
      'Guest messaging and issue resolution',
      'Dynamic pricing review and listing optimization',
      'Cleaning, supply, and maintenance coordination',
      'Owner communication, payouts, and performance visibility',
    ],
    services: [
      { icon: MessageSquareText, title: 'Guest care', copy: 'Responsive communication before, during, and after each stay.' },
      { icon: BarChart3, title: 'Revenue controls', copy: 'Pricing, pacing, minimum stays, and calendar strategy reviewed with context.' },
      { icon: ClipboardCheck, title: 'Turnover coordination', copy: 'Housekeeping standards, supply checks, and cleaner accountability.' },
      { icon: Truck, title: 'Maintenance support', copy: 'Issue triage, vendor coordination, and owner visibility when action is needed.' },
    ],
    faqs: [
      ['What does StayDog manage?', 'StayDog can manage guest communication, listing performance, dynamic pricing review, housekeeping coordination, maintenance dispatch, smart lock support, owner reporting, and the day-to-day operating rhythm around each stay.'],
      ['Do you guarantee revenue?', 'No. Performance depends on property condition, location, seasonality, pricing, amenities, photography, platform demand, and operating standards. StayDog can review opportunities and recommend next steps.'],
      ['Where does StayDog operate?', 'StayDog highlights Michigan, Indiana, and Illinois markets while selectively reviewing opportunities in other vacation rental destinations.'],
    ],
  },
  {
    path: '/airbnb-management',
    eyebrow: 'Airbnb Management',
    title: 'Airbnb management built around hospitality, reviews, and owner peace of mind.',
    metaTitle: 'Airbnb Management Services | StayDog Rentals',
    description:
      'Airbnb management services from StayDog Rentals, including guest messaging, listing optimization, pricing review, turnovers, maintenance coordination, and hospitality standards.',
    market: 'Airbnb homes in Michigan, Indiana, Illinois, and select destination markets',
    intro:
      'A strong Airbnb listing needs more than attractive photos. StayDog helps align the listing promise with the guest experience, so owners are not stuck managing every message, cleaner, calendar change, and maintenance surprise.',
    highlights: [
      'Listing positioning and guest expectation review',
      'Review-minded guest communication',
      'Calendar, pricing, and minimum-stay strategy',
      'Cleaner and maintenance coordination',
    ],
    services: [
      { icon: Sparkles, title: 'Listing appeal', copy: 'Sharper titles, amenity framing, house rules, and guest-ready positioning.' },
      { icon: BadgeCheck, title: 'Review standards', copy: 'A hospitality rhythm designed to protect the guest experience.' },
      { icon: CalendarCheck, title: 'Calendar strategy', copy: 'Pacing, seasonality, gap nights, and availability reviewed with intent.' },
      { icon: ShieldCheck, title: 'Owner protection', copy: 'Clear escalation paths when a guest issue needs human judgment.' },
    ],
    faqs: [
      ['Can StayDog manage an existing Airbnb?', 'Yes. StayDog can review an existing listing and identify opportunities around photos, copy, amenities, pricing, operations, and guest communication.'],
      ['Can StayDog help if my listing is not live yet?', 'Yes. StayDog can help prepare the property, listing, and operating setup before launch.'],
      ['Will StayDog handle guest messages?', 'Guest communication is a core part of the StayDog management model, with human follow-up when a situation needs judgment.'],
    ],
  },
  {
    path: '/short-term-rental-management',
    eyebrow: 'Short-term Rental Management',
    title: 'Short-term rental management with owner clarity and guest-first operations.',
    metaTitle: 'Short-term Rental Management | StayDog Rentals',
    description:
      'StayDog Rentals manages short-term rentals with hospitality standards, automation-first workflows, dynamic pricing review, guest support, housekeeping, and maintenance coordination.',
    market: 'Vacation homes, cottages, cabins, lake homes, city stays, and group properties',
    intro:
      'Short-term rentals are operational businesses. StayDog brings the systems, hospitality standards, and follow-through that help owners spend less time inside the inbox and more time focused on the bigger picture.',
    highlights: [
      'End-to-end operating coordination',
      'Platform and direct booking readiness',
      'Guest experience and issue management',
      'Owner updates without day-to-day micromanagement',
    ],
    services: [
      { icon: Home, title: 'Property readiness', copy: 'Setup guidance for guest flow, amenities, access, safety, and repeatable turnovers.' },
      { icon: LockKeyhole, title: 'Smart access', copy: 'Smart lock and arrival systems that reduce friction for guests and owners.' },
      { icon: MessageSquareText, title: 'Guest support', copy: 'Pre-arrival, in-stay, and post-stay communication with escalation when needed.' },
      { icon: BarChart3, title: 'Opportunity review', copy: 'Listing, pricing, and operations reviewed for visible improvement opportunities.' },
    ],
    faqs: [
      ['Is StayDog only for large homes?', 'No. StayDog can review a range of vacation rental properties, from smaller stays to larger group homes and hospitality destinations.'],
      ['Can StayDog support direct bookings?', 'Yes. StayDog highlights the direct booking advantage and can help owners think through platform and direct booking positioning.'],
      ['What makes StayDog different?', 'StayDog combines hospitality standards with automation-first operations, so the experience feels personal without becoming chaotic for the owner.'],
    ],
  },
  {
    path: '/vacation-rental-management-michigan',
    eyebrow: 'Michigan Vacation Rental Management',
    title: 'Vacation rental management for Michigan homes, lake stays, cabins, and group getaways.',
    metaTitle: 'Michigan Vacation Rental Management | StayDog Rentals',
    description:
      'StayDog Rentals offers vacation rental management for Michigan owners, including guest care, pricing review, housekeeping coordination, maintenance support, and listing optimization.',
    market: 'Michigan vacation rental markets and nearby destination areas',
    intro:
      'Michigan vacation rentals can be highly seasonal, amenity-driven, and guest-experience sensitive. StayDog helps owners operate with the discipline of a hospitality brand while keeping the process approachable.',
    highlights: [
      'Lake, cabin, cottage, and group-stay positioning',
      'Seasonality-aware pricing and calendar review',
      'Cleaning and maintenance coordination',
      'Guest communication built around reviews and repeatability',
    ],
    services: [
      { icon: MapPin, title: 'Market context', copy: 'Messaging and operations shaped around Michigan travel patterns and destination demand.' },
      { icon: Sparkles, title: 'Amenity strategy', copy: 'Hot tubs, firepits, game spaces, family features, and local experiences framed clearly.' },
      { icon: CalendarCheck, title: 'Seasonal pacing', copy: 'Booking windows, minimum stays, and calendar settings reviewed around seasonality.' },
      { icon: BadgeCheck, title: 'Hospitality proof', copy: 'Review-minded systems that help properties feel cared for and consistent.' },
    ],
    faqs: [
      ['Does StayDog manage Michigan vacation homes?', 'Michigan is one of the markets StayDog highlights for SEO and owner opportunities.'],
      ['Can StayDog help with lake-area properties?', 'Yes. StayDog can review lake, cabin, cottage, and group-stay properties for guest appeal, amenity strength, and operating needs.'],
      ['Do Michigan owners need full-service management?', 'Many owners benefit from support with pricing, guest care, turnovers, maintenance, and owner visibility, especially when seasonality and guest expectations are high.'],
    ],
  },
  {
    path: '/vacation-rental-management-indiana',
    eyebrow: 'Indiana Vacation Rental Management',
    title: 'Vacation rental management for Indiana owners who want smoother operations.',
    metaTitle: 'Indiana Vacation Rental Management | StayDog Rentals',
    description:
      'StayDog Rentals supports Indiana vacation rental owners with guest communication, pricing review, listing optimization, housekeeping coordination, and maintenance dispatch.',
    market: 'Indiana vacation rental and short-term rental markets',
    intro:
      'Indiana vacation rental owners need reliable operations, clean guest communication, and listings that clearly show why a guest should book. StayDog handles the management layer so owners can step back.',
    highlights: [
      'Listing and photo opportunity review',
      'Guest messaging and issue handling',
      'Housekeeping and supplies coordination',
      'Owner reporting and follow-up',
    ],
    services: [
      { icon: Home, title: 'Owner handoff', copy: 'A cleaner management path for owners who do not want to self-manage every stay.' },
      { icon: ClipboardCheck, title: 'Turnover standards', copy: 'Repeatable cleaning and restocking expectations for a stronger guest experience.' },
      { icon: Truck, title: 'Vendor coordination', copy: 'Maintenance issues tracked and communicated with practical next steps.' },
      { icon: BarChart3, title: 'Listing performance', copy: 'StayDog reviews positioning, pricing, and conversion opportunities.' },
    ],
    faqs: [
      ['Does StayDog manage Indiana properties?', 'StayDog mentions Indiana as a key regional market and can review Indiana vacation rental opportunities.'],
      ['Can StayDog help with an underperforming listing?', 'Yes. StayDog can review visible listing quality, guest appeal, amenity presentation, and operational friction points.'],
      ['Can owners stay hands-off?', 'The Partner With Us process helps identify the owner’s desired involvement level, from hands-off to more involved oversight.'],
    ],
  },
  {
    path: '/vacation-rental-management-illinois',
    eyebrow: 'Illinois Vacation Rental Management',
    title: 'Vacation rental management for Illinois short-term rental owners.',
    metaTitle: 'Illinois Vacation Rental Management | StayDog Rentals',
    description:
      'StayDog Rentals reviews Illinois vacation rental management opportunities with guest support, pricing review, listing optimization, cleaning coordination, and owner communication.',
    market: 'Illinois short-term rental and destination-adjacent markets',
    intro:
      'Illinois owners may be managing city stays, destination-adjacent homes, family properties, or weekend getaways. StayDog reviews the property, the guest promise, and the operating complexity before recommending next steps.',
    highlights: [
      'Guest appeal and listing quality review',
      'Operations and cleaning coordination',
      'Pricing and platform-readiness analysis',
      'Hospitality-forward owner support',
    ],
    services: [
      { icon: ShieldCheck, title: 'Operating clarity', copy: 'Clear workflows for guest care, access, issues, and owner communication.' },
      { icon: Sparkles, title: 'Presentation polish', copy: 'Recommendations around photos, amenities, copy, and guest-facing details.' },
      { icon: CalendarCheck, title: 'Demand rhythm', copy: 'Calendar and pricing considerations reviewed around travel patterns and events.' },
      { icon: MessageSquareText, title: 'Guest communication', copy: 'A calmer system for questions, check-in instructions, and in-stay needs.' },
    ],
    faqs: [
      ['Does StayDog serve Illinois?', 'StayDog includes Illinois in its regional service visibility and can review Illinois opportunities selectively.'],
      ['Can StayDog review a property before I commit?', 'Yes. The Property Potential Score gives a starting snapshot, and the Partner With Us funnel helps request a human review.'],
      ['Does StayDog handle all properties?', 'StayDog reviews fit based on location, property condition, guest appeal, owner goals, and operational complexity.'],
    ],
  },
]

export const seoPageMap = Object.fromEntries(seoPages.map((page) => [page.path, page]))
