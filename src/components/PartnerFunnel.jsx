import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { funnelQuestions, proofStats } from '../data/content'
import { submitPartnerLead } from '../services/leadService'
import CtaButton from './CtaButton'

function QuestionField({ question, value, onChange }) {
  if (question.type === 'select') {
    return (
      <div className="choice-grid">
        {question.options.map((option) => (
          <button
            type="button"
            className={value === option ? 'is-selected' : ''}
            key={option}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    )
  }

  if (question.type === 'textarea') {
    return (
      <textarea
        value={value || ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={question.placeholder}
        rows={5}
        autoFocus
      />
    )
  }

  return (
    <input
      type={question.type}
      min={question.min}
      step={question.step}
      value={value || ''}
      onChange={(event) => onChange(event.target.value)}
      placeholder={question.placeholder}
      autoFocus
    />
  )
}

export default function PartnerFunnel({ navigate }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({})
  const [status, setStatus] = useState('idle')
  const [submissionMessage, setSubmissionMessage] = useState('')
  const question = funnelQuestions[step]
  const progress = Math.round(((step + 1) / funnelQuestions.length) * 100)
  const value = form[question?.key]

  const complete = status === 'submitted' || status === 'staged'
  const canAdvance = question?.optional || String(value || '').trim().length > 0

  const answersPreview = useMemo(
    () =>
      funnelQuestions
        .slice(0, step)
        .filter(({ key }) => form[key])
        .slice(-4),
    [form, step],
  )

  const updateValue = (nextValue) => {
    setForm((current) => ({ ...current, [question.key]: nextValue }))
  }

  const goNext = async () => {
    if (!question) return
    if (step < funnelQuestions.length - 1) {
      setStep((current) => current + 1)
      return
    }

    setStatus('submitting')
    try {
      const result = await submitPartnerLead(form)
      setStatus(result.status)
      setSubmissionMessage(result.message)
    } catch (error) {
      setStatus('error')
      setSubmissionMessage(error.message || 'Something went wrong. Please email StayDog directly.')
    }
  }

  return (
    <main className="partner-page">
      <div className="cinematic-grid" aria-hidden="true" />
      <div className="section-shell partner-shell">
        <section className="partner-intro" data-reveal>
          <button type="button" className="back-link" onClick={() => navigate('/')}>
            <ArrowLeft aria-hidden="true" />
            Back home
          </button>
          <div className="eyebrow">
            <ShieldCheck aria-hidden="true" size={17} />
            Owner fit assessment
          </div>
          <h1>Partner with StayDog Rentals.</h1>
          <p>
            A shorter, calmer intake for owners who want premium vacation rental management without becoming the
            operations team.
          </p>
        </section>

        <div className="partner-question-stage" data-reveal>
          <aside className="funnel-brand-panel" aria-label="StayDog Rentals management proof">
            <img src="/assets/logo/staydog-logo.jpg" alt="StayDog Rentals" />
            <div>
              <small>StayDog Rentals</small>
              <strong>Owner intake, simplified.</strong>
              <p>Tell us the essentials. StayDog follows up with a human review before terms or projections are discussed.</p>
            </div>
            <div className="funnel-proof-grid">
              {proofStats.map((stat) => (
                <span key={stat.label}>
                  <strong>{stat.value}</strong>
                  {stat.label}
                </span>
              ))}
            </div>
          </aside>

          <section className="funnel-panel" aria-live="polite">
            {!complete ? (
              <>
                <div className="funnel-progress">
                  <span>{progress}%</span>
                  <div>
                    <i style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <div className="question-header">
                  <question.icon aria-hidden="true" />
                  <span>Question {step + 1} of {funnelQuestions.length}</span>
                </div>
                <h2>{question.label}</h2>
                <QuestionField question={question} value={value} onChange={updateValue} />

                {answersPreview.length > 0 && (
                  <div className="answer-preview" aria-label="Recent answers">
                    {answersPreview.map(({ key, label }) => (
                      <span key={key}>
                        <strong>{label}</strong>
                        {form[key]}
                      </span>
                    ))}
                  </div>
                )}

                <div className="funnel-controls">
                  <button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}>
                    <ArrowLeft aria-hidden="true" />
                    Back
                  </button>
                  <button type="button" onClick={goNext} disabled={!canAdvance || status === 'submitting'}>
                    {status === 'submitting' ? <Loader2 aria-hidden="true" className="spin" /> : <ArrowRight aria-hidden="true" />}
                    {step === funnelQuestions.length - 1 ? 'Submit' : 'Next'}
                  </button>
                </div>
              </>
            ) : (
              <div className="funnel-complete">
                <CheckCircle2 aria-hidden="true" />
                <h2>StayDog Rentals has the details.</h2>
                <p>{submissionMessage}</p>
                <p>
                  A human follow-up is needed before management terms, market projections, or onboarding recommendations
                  are confirmed.
                </p>
                <div className="hero-actions">
                  <CtaButton onClick={() => navigate('/')}>Return Home</CtaButton>
                  <CtaButton href="mailto:superfaststays@gmail.com" variant="secondary">
                    Email StayDog
                  </CtaButton>
                </div>
              </div>
            )}

            {status === 'error' && (
              <p className="funnel-error">
                {submissionMessage} You can also email superfaststays@gmail.com or call 248-382-8370.
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
