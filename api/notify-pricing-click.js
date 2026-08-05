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

  try {
    const referrer = req.headers.referer || 'unknown page'
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `:moneybag: Someone clicked "Get a Pricing Breakdown" on commandpipeline.com\nPage: ${referrer}`,
      }),
    })
    res.status(200).json({ ok: true })
  } catch {
    res.status(500).json({ error: 'Failed to notify Slack' })
  }
}
