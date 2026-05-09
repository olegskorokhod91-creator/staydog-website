export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const endpoint = process.env.STAYDOG_LEAD_ENDPOINT

  if (!endpoint) {
    res.status(500).json({ error: 'Lead endpoint is not configured.' })
    return
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(req.body || {}),
    })

    if (!response.ok) {
      res.status(502).json({ error: 'Google lead endpoint rejected the submission.' })
      return
    }

    res.status(200).json({ ok: true })
  } catch (error) {
    res.status(502).json({ error: 'Unable to send lead to Google endpoint.' })
  }
}
