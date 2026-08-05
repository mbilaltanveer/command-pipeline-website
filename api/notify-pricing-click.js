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

  const { name, email } = req.body || {}
  const cleanName = typeof name === 'string' ? name.trim().slice(0, 200) : ''
  const cleanEmail = typeof email === 'string' ? email.trim().slice(0, 200) : ''
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!cleanName || !emailPattern.test(cleanEmail)) {
    res.status(400).json({ error: 'A valid name and email are required' })
    return
  }

  try {
    const referrer = req.headers.referer || 'unknown page'
    const lines = [
      ':moneybag: New pricing breakdown request on commandpipeline.com',
      `Name: ${cleanName}`,
      `Email: ${cleanEmail}`,
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
