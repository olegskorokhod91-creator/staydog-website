import { Bot, CalendarCheck, Home, MessageCircle, Send, Sparkles, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { bookingUrl } from '../data/content'

const starterMessages = [
  {
    role: 'agent',
    text: 'Hi, I am the StayDog AI agent. I can explain StayDog services, guide homeowners, route guests to direct booking, and flag when a human should follow up.',
  },
]

function answerFor(input, navigate) {
  const text = input.toLowerCase()

  if (text.includes('book') || text.includes('stay') || text.includes('guest')) {
    return {
      text: 'For guest stays, the best path is the direct booking site so you can avoid some third-party fees where available. I can open it for you.',
      action: {
        label: 'Open Direct Booking',
        href: bookingUrl,
        icon: CalendarCheck,
      },
    }
  }

  if (text.includes('price') || text.includes('revenue') || text.includes('income') || text.includes('dynamic')) {
    return {
      text: 'StayDog uses dynamic pricing review, listing optimization, and hospitality operations to support revenue. I cannot promise a specific number without property details and human market review.',
      action: {
        label: 'Start Owner Funnel',
        onClick: () => navigate('/partner-with-us'),
        icon: Sparkles,
      },
    }
  }

  if (text.includes('owner') || text.includes('manage') || text.includes('property') || text.includes('airbnb')) {
    return {
      text: 'StayDog handles guest communication, cleaning coordination, maintenance dispatch, smart lock workflows, owner payouts, supplies, platform listing work, and 24/7 guest care.',
      action: {
        label: 'Partner With StayDog',
        onClick: () => navigate('/partner-with-us'),
        icon: Home,
      },
    }
  }

  if (text.includes('market') || text.includes('michigan') || text.includes('indiana')) {
    return {
      text: 'StayDog currently highlights Michigan and Indiana markets, while selectively considering expansion where service quality can remain high.',
    }
  }

  if (text.includes('contact') || text.includes('phone') || text.includes('email')) {
    return {
      text: 'You can reach StayDog at superfaststays@gmail.com or 248-382-8370. For property-specific terms, a human follow-up is the right next step.',
    }
  }

  return {
    text: 'I can help with StayDog services, owner onboarding, guest booking, direct-booking routing, and management questions. If a topic needs property-specific advice, I will recommend human follow-up instead of guessing.',
  }
}

export default function AskStayDogAI({ navigate, page = 'default' }) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(starterMessages)
  const unread = useMemo(() => (!open ? 1 : 0), [open])

  const submit = (event) => {
    event.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return

    const response = answerFor(trimmed, navigate)
    setMessages((current) => [
      ...current,
      { role: 'user', text: trimmed },
      { role: 'agent', text: response.text, action: response.action },
    ])
    setInput('')
  }

  return (
    <div className={`ask-staydog-ai ${open ? 'is-open' : ''} ${page === 'partner' ? 'is-partner' : ''}`}>
      {open && (
        <section className="chat-panel" aria-label="Ask StayDog AI chat">
          <header>
            <div>
              <span className="chat-avatar">
                <Bot aria-hidden="true" />
              </span>
              <div>
                <strong>Ask StayDog AI</strong>
                <small>AI management guide</small>
              </div>
            </div>
            <button type="button" aria-label="Close Ask StayDog AI" onClick={() => setOpen(false)}>
              <X aria-hidden="true" />
            </button>
          </header>

          <div className="chat-messages">
            {messages.map((message, index) => (
              <article className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
                <p>{message.text}</p>
                {message.action && (
                  message.action.href ? (
                    <a href={message.action.href} target="_blank" rel="noreferrer">
                      <message.action.icon aria-hidden="true" size={15} />
                      {message.action.label}
                    </a>
                  ) : (
                    <button type="button" onClick={message.action.onClick}>
                      <message.action.icon aria-hidden="true" size={15} />
                      {message.action.label}
                    </button>
                  )
                )}
              </article>
            ))}
          </div>

          <form onSubmit={submit} className="chat-form">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about management, booking, revenue..."
              aria-label="Ask StayDog AI a question"
            />
            <button type="submit" aria-label="Send message">
              <Send aria-hidden="true" />
            </button>
          </form>
        </section>
      )}

      <button type="button" className="chat-launcher" onClick={() => setOpen((current) => !current)} aria-label="Open Ask StayDog AI">
        <MessageCircle aria-hidden="true" />
        <span>Ask AI</span>
        {unread > 0 && <i aria-label="New message">{unread}</i>}
      </button>
    </div>
  )
}
