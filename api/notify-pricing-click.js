export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) {
    res.status(500).json({ error: 'Slack webhook not configured' })
    return
  }

  const { name, email, currentOutbound, expectedVolume, expectedBudget } = req.body || {}
  const clean = v => (typeof v === 'string' ? v.trim().slice(0, 200) : '')
  const cleanName = clean(name)
  const cleanEmail = clean(email)
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!cleanName || !emailPattern.test(cleanEmail)) {
    res.status(400).json({ error: 'A valid name and email are required' })
    return
  }

  try {
    const referrer = req.headers.referer || 'unknown page'
    // Domain is the useful bit — it's what gets enriched before replying.
    const domain = cleanEmail.split('@')[1] || ''
    const lines = [
      ':moneybag: New pricing breakdown request on commandpipeline.com',
      `Name: ${cleanName}`,
      `Email: ${cleanEmail}`,
      ...(domain ? [`Domain: ${domain}`] : []),
      ...(clean(currentOutbound) ? [`Current outbound: ${clean(currentOutbound)}`] : []),
      ...(clean(expectedVolume) ? [`Expected volume: ${clean(expectedVolume)}`] : []),
      ...(clean(expectedBudget) ? [`Expected budget: ${clean(expectedBudget)}`] : []),
      `Page: ${referrer}`,
    ]
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: lines.join('\n') }),
    })
    res.status(200).json({ ok: true })
  } catch {
    res.status(500).json({ error: 'Failed to notify Slack' })
  }
}
