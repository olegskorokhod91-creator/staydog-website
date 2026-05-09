const LEAD_ENDPOINT = import.meta.env.VITE_STAYDOG_LEAD_ENDPOINT || '/api/partner-lead'
const NOTIFICATION_EMAIL = 'superfaststays@gmail.com'

export async function submitPartnerLead(payload) {
  const normalizedPayload = {
    ...payload,
    source: 'StayDog Rentals partner funnel',
    notify: NOTIFICATION_EMAIL,
    submittedAt: new Date().toISOString(),
  }

  if (!LEAD_ENDPOINT) {
    localStorage.setItem('staydog:last-partner-lead', JSON.stringify(normalizedPayload))
    return {
      status: 'staged',
      message: 'Submission staged locally. Connect STAYDOG_LEAD_ENDPOINT in Vercel to send this to Google Sheets and email.',
    }
  }

  const response = await fetch(LEAD_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(normalizedPayload),
  })

  if (!response.ok) {
    throw new Error('Lead endpoint did not accept the submission.')
  }

  return {
    status: 'submitted',
    message: 'Thanks. Your inquiry was sent to StayDog Rentals.',
  }
}
