// Field order + labels for the Slack summary. Kept in sync with
// src/OnboardingForm.jsx so the notification reads in the same order the
// client filled it in.
const SECTIONS = [
  {
    title: 'Company & Contact',
    fields: [
      ['companyName', 'Company'],
      ['website', 'Website'],
      ['contactName', 'Contact'],
      ['contactEmail', 'Email'],
      ['contactRole', 'Role'],
      ['teamSize', 'Company size'],
      ['arr', 'ARR'],
    ],
  },
  {
    title: 'Offer',
    fields: [
      ['productDescription', 'What they sell'],
      ['valueProp', 'Value prop'],
      ['dealSize', 'ACV'],
      ['salesCycle', 'Sales cycle'],
      ['proofPoints', 'Proof points'],
      ['differentiators', 'Differentiators'],
      ['competitors', 'Competitors'],
    ],
  },
  {
    title: 'ICP',
    fields: [
      ['targetIndustries', 'Industries'],
      ['targetTitles', 'Titles'],
      ['targetCompanySize', 'Company size'],
      ['targetGeography', 'Geography'],
      ['targetRevenue', 'Revenue range'],
      ['techStack', 'Tech stack'],
      ['notAFit', 'Not a fit'],
    ],
  },
  {
    title: 'Signals & Targeting',
    fields: [
      ['signals', 'Signals'],
      ['signalNotes', 'Timing notes'],
      ['monthlyTarget', 'Monthly target'],
    ],
  },
  {
    title: 'Access & Infrastructure',
    fields: [
      ['primaryDomain', 'Primary domain'],
      ['crm', 'CRM'],
      ['crmOwner', 'CRM admin'],
      ['slackWorkspace', 'Slack'],
      ['linkedinAccounts', 'LinkedIn accounts'],
      ['bookingLink', 'Booking link'],
      ['meetingOwner', 'Meeting owner'],
    ],
  },
  {
    title: 'Suppression & Launch',
    fields: [
      ['suppressionList', 'Do not contact'],
      ['hasSuppressionFile', 'Suppression file'],
      ['existingOutbound', 'Past outbound'],
      ['brandGuidelines', 'Brand guidelines'],
      ['launchTimeline', 'Launch timeline'],
      ['notes', 'Other notes'],
    ],
  },
]

const REQUIRED = ['companyName', 'website', 'contactName', 'contactEmail']
const MAX_FIELD_LEN = 4000
const SLACK_BLOCK_LIMIT = 2900 // Slack caps section text at 3000

const clean = v => {
  if (Array.isArray(v)) return v.map(x => String(x).trim()).filter(Boolean).join(', ')
  if (v === undefined || v === null) return ''
  const s = String(v).trim()
  // Flag rather than silently drop, so a cut answer is obvious in Slack.
  return s.length > MAX_FIELD_LEN ? s.slice(0, MAX_FIELD_LEN) + ' …[truncated]' : s
}

// Split the body into Slack-safe chunks. Lines longer than the limit are
// wrapped across chunks rather than cut, so nothing is silently dropped.
function chunk(text, limit = SLACK_BLOCK_LIMIT) {
  const out = []
  let buf = ''
  const flush = () => { if (buf) { out.push(buf); buf = '' } }
  const addPiece = piece => {
    if (buf && buf.length + 1 + piece.length > limit) flush()
    buf = buf ? buf + '\n' + piece : piece
  }
  for (const line of text.split('\n')) {
    if (line.length <= limit) {
      addPiece(line)
      continue
    }
    for (let i = 0; i < line.length; i += limit) addPiece(line.slice(i, i + limit))
  }
  flush()
  return out
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const webhookUrl = process.env.SLACK_ONBOARDING_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) {
    res.status(500).json({ error: 'Slack webhook not configured' })
    return
  }

  const answers = (req.body && req.body.answers) || {}
  if (typeof answers !== 'object' || Array.isArray(answers)) {
    res.status(400).json({ error: 'Malformed submission' })
    return
  }

  for (const key of REQUIRED) {
    if (!clean(answers[key])) {
      res.status(400).json({ error: `Missing required field: ${key}` })
      return
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(answers.contactEmail))) {
    res.status(400).json({ error: 'Invalid email address' })
    return
  }

  const company = clean(answers.companyName)

  const body = SECTIONS.map(section => {
    const lines = section.fields
      .map(([key, label]) => {
        const val = clean(answers[key])
        return val ? `• *${label}:* ${val}` : null
      })
      .filter(Boolean)
    return lines.length ? `*${section.title}*\n${lines.join('\n')}` : null
  })
    .filter(Boolean)
    .join('\n\n')

  const header = `:clipboard: *New client onboarding submitted — ${company}*`
  const parts = chunk(body)

  try {
    // First message carries the header; long submissions continue in follow-ups
    // so nothing is silently dropped at Slack's block limit.
    for (let i = 0; i < parts.length; i++) {
      const text = i === 0 ? `${header}\n\n${parts[i]}` : parts[i]
      const resp = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!resp.ok) throw new Error(`Slack responded ${resp.status}`)
    }
    res.status(200).json({ ok: true })
  } catch {
    res.status(502).json({ error: 'Failed to deliver submission' })
  }
}
