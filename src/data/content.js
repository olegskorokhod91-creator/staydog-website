import {
  BadgeCheck,
  Bot,
  CalendarClock,
  ChartNoAxesCombined,
  ClipboardCheck,
  CreditCard,
  Headphones,
  Home,
  LockKeyhole,
  MapPin,
  MessageSquareText,
  MousePointer2,
  ShieldCheck,
  Sparkles,
  Truck,
  WandSparkles,
} from 'lucide-react'

export const bookingUrl = 'https://www.properties.staydogrentals.com/'

export const proofStats = [
  { value: '40+', label: 'Homes managed' },
  { value: '2,200+', label: 'Guest reviews' },
  { value: '4.9', label: 'Average rating' },
  { value: 'Nearly 10', label: 'Years of experience' },
]

export const operations = [
  { icon: Headphones, label: '24/7 guest support' },
  { icon: Bot, label: 'Automation-first operations' },
  { icon: ChartNoAxesCombined, label: 'Dynamic pricing optimization' },
  { icon: ClipboardCheck, label: 'Housekeeping coordination' },
  { icon: Truck, label: 'Maintenance dispatch' },
  { icon: CreditCard, label: 'Owner payouts' },
  { icon: Sparkles, label: 'Supply and purchasing management' },
  { icon: LockKeyhole, label: 'Smart lock systems' },
  { icon: WandSparkles, label: 'Listing optimization' },
]

export const hubPanels = [
  {
    icon: ChartNoAxesCombined,
    title: 'Occupancy intelligence',
    eyebrow: 'Demand signals',
    lines: ['Market pulse', 'Seasonality read', 'Pacing alerts'],
  },
  {
    icon: MousePointer2,
    title: 'Pricing optimization',
    eyebrow: 'Revenue controls',
    lines: ['Rate guardrails', 'Comp set review', 'Minimum stay tuning'],
  },
  {
    icon: MessageSquareText,
    title: 'Messaging dashboard',
    eyebrow: 'Guest care',
    lines: ['Pre-arrival flows', 'Issue escalation', 'Review follow-up'],
  },
  {
    icon: ShieldCheck,
    title: 'Maintenance dispatch',
    eyebrow: 'Property uptime',
    lines: ['Ticket triage', 'Vendor coordination', 'Owner visibility'],
  },
]

export const propertyImages = [
  { src: '/assets/portfolio/property-01.jpg' },
  { src: '/assets/portfolio/property-02.jpg' },
  { src: '/assets/portfolio/property-03.jpg' },
  { src: '/assets/portfolio/property-04.jpg' },
  { src: '/assets/portfolio/property-05.jpg' },
]

export const signatureDestinations = [
  {
    name: 'The Sandbar Lodge at Torch Lake',
    copy: 'A hospitality destination that brings StayDog credibility beyond simple property oversight: guest experience, operations, and place-making under one roof.',
    image: '/assets/ui/signature-sandbar.webp',
    icon: Home,
  },
  {
    name: 'Pleasant Valley Resort',
    copy: 'A companion proof point for resort-level standards, owner trust, and operational range across memorable vacation stays.',
    image: '/assets/ui/signature-resort.webp',
    icon: MapPin,
  },
]

export const platformBadges = ['Airbnb', 'Vrbo', 'Booking.com', 'Direct Booking']

export const funnelQuestions = [
  {
    key: 'propertyLocation',
    label: 'Where is the property located?',
    type: 'text',
    placeholder: 'City, state, or nearest destination',
    icon: MapPin,
  },
  {
    key: 'propertySnapshot',
    label: 'What kind of property should StayDog review?',
    type: 'textarea',
    placeholder: 'Home type, bedrooms/bathrooms, standout amenities, and anything that makes it special.',
    icon: Home,
  },
  {
    key: 'currentlyListed',
    label: 'Is it currently listed?',
    type: 'select',
    options: ['Yes, on Airbnb', 'Yes, on Vrbo', 'Yes, on multiple platforms', 'Not yet', 'Not sure'],
    icon: BadgeCheck,
  },
  {
    key: 'painPoint',
    label: 'What do you most want StayDog to take off your plate?',
    type: 'textarea',
    placeholder: 'Guest messaging, cleaning, pricing, maintenance, reviews, time...',
    icon: MessageSquareText,
  },
  {
    key: 'revenueGoals',
    label: 'What would a strong result look like?',
    type: 'textarea',
    placeholder: 'Share goals, current performance, or what you want to improve. No exact projection needed.',
    icon: ChartNoAxesCombined,
  },
  {
    key: 'involvementLevel',
    label: 'How involved do you want to be?',
    type: 'select',
    options: ['Completely hands-off', 'High-level monthly updates', 'Approve major decisions only', 'Very involved'],
    icon: Sparkles,
  },
  {
    key: 'timeline',
    label: 'What is your timeline?',
    type: 'select',
    options: ['Immediately', 'Within 30 days', '1-3 months', 'Exploring for later'],
    icon: CalendarClock,
  },
  {
    key: 'contactDetails',
    label: 'Who should StayDog contact?',
    type: 'textarea',
    placeholder: 'Name, email, phone, and the best way to reach you.',
    icon: Headphones,
  },
]
