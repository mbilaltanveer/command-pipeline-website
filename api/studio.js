// Pipeline Studio on the website: visitors queue videos here, the studio on Bilal's Mac renders them.
//
// Visitor actions:  status · upload (Blob client-upload tokens) · create · job
// Worker actions:   claim · update · token · delete   (signed with the Mac's Ed25519 key, see WORKER_PUBLIC_KEY)
//
// Storage: Upstash Redis (queue, jobs, rate limits) and Vercel Blob (uploads and finished files).
// Env: BLOB_READ_WRITE_TOKEN, KV_REST_API_URL + KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL + _TOKEN),
//      optional STUDIO_DAILY_CAP, SLACK_WEBHOOK_URL and STUDIO_WORKER_PUBLIC_KEY (to use a different Mac).
import { createPublicKey, verify } from 'node:crypto'
import { handleUpload, generateClientTokenFromReadWriteToken } from '@vercel/blob/client'
import { del } from '@vercel/blob'

// Public half of the key pair made by Pipeline Studio on Bilal's Mac (core/webworker.py). Not a secret.
const WORKER_PUBLIC_KEY = process.env.STUDIO_WORKER_PUBLIC_KEY || `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAZOkkO6Omn1j6HjPDJzTkA3etdQNpMnD3YPB4I41gF74=
-----END PUBLIC KEY-----`

const PER_EMAIL_PER_DAY = 3
const DAILY_CAP = parseInt(process.env.STUDIO_DAILY_CAP || '30', 10)
const JOB_TTL = 14 * 24 * 3600
const MAX_UPLOAD = 300 * 1024 * 1024
const MODES = { clean: 'Clean edit', motion: 'Brand motion', voiceover: 'Voiceover', popups: 'Talking head + pop-ups' }
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const HEX = /^#[0-9A-Fa-f]{6}$/

// ─── Redis (Upstash REST) ────────────────────────────────────────────────────

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

async function redis(...command) {
  const r = await fetch(REDIS_URL, { method: 'POST', headers: { Authorization: `Bearer ${REDIS_TOKEN}` }, body: JSON.stringify(command) })
  const j = await r.json()
  if (j.error) throw new Error(`redis: ${j.error}`)
  return j.result
}
const getJob = async id => { const v = await redis('GET', `studio:job:${id}`); return v ? JSON.parse(v) : null }
const putJob = job => redis('SET', `studio:job:${job.id}`, JSON.stringify(job), 'EX', JOB_TTL)

// ─── Helpers ─────────────────────────────────────────────────────────────────

const clean = (v, n = 200) => (typeof v === 'string' ? v.replace(/[—–]/g, ', ').trim().slice(0, n) : '')
const today = () => new Date().toISOString().slice(0, 10)
const isOurBlob = (url, folder) => {
  try { const u = new URL(url); return u.protocol === 'https:' && u.hostname.endsWith('.blob.vercel-storage.com') && u.pathname.startsWith(`/studio/${folder}/`) }
  catch { return false }
}
const publicJob = job => { const out = { ...job }; delete out.email; return out }
// A worker request carries {payload: JSON string}, signed as `${time}.${action}.${payload}`. Returns the payload or null.
function workerPayload(req, action) {
  const ts = Number(req.headers['x-studio-time']), sig = req.headers['x-studio-signature'], payload = req.body?.payload
  if (!ts || !sig || typeof payload !== 'string' || Math.abs(Date.now() / 1000 - ts) > 120) return null
  try {
    const ok = verify(null, Buffer.from(`${ts}.${action}.${payload}`), createPublicKey(WORKER_PUBLIC_KEY), Buffer.from(sig, 'base64'))
    return ok ? JSON.parse(payload) : null
  } catch { return null }
}

function sanitizeBrand(b = {}) {
  const c = b.colors || {}
  const color = (k, d) => (HEX.test(c[k] || '') ? c[k].toUpperCase() : d)
  return {
    name: clean(b.name, 60), tagline: clean(b.tagline, 80), cta: clean(b.cta, 80), website: clean(b.website, 120), tone: clean(b.tone, 400),
    person: { name: clean(b.person?.name, 60), role: clean(b.person?.role, 80) },
    rules: (Array.isArray(b.rules) ? b.rules : []).map(r => clean(r, 160)).filter(Boolean).slice(0, 12),
    keywords: (Array.isArray(b.keywords) ? b.keywords : []).map(k => clean(k, 40)).filter(Boolean).slice(0, 20),
    colors: {
      accent: color('accent', '#E8A000'), accent_light: color('accent_light', '#FBBF24'), accent_2: color('accent_2', '#F78C45'),
      dark: color('dark', '#0D0F14'), panel: color('panel', '#1C1C24'), ink: color('ink', '#1E293B'), light: color('light', '#FFFFFF'),
    },
    voice: { greeting: clean(b.voice?.greeting, 60), signoff: clean(b.voice?.signoff, 60), builtin: clean(b.voice?.builtin, 30) },
    logo_url: isOurBlob(b.logo_url, 'uploads') ? b.logo_url : '',
    mark_url: isOurBlob(b.mark_url, 'uploads') ? b.mark_url : '',
  }
}

function sanitizeOptions(mode, o = {}) {
  const fmt = ['original', '9:16', '1:1', '16:9'].includes(o.format) ? o.format : 'original'
  const bool = (k, d) => (typeof o[k] === 'boolean' ? o[k] : d)
  const out = { format: fmt, captions: bool('captions', true) }
  if (mode === 'clean' || mode === 'popups') {
    Object.assign(out, { trim_start: bool('trim_start', true), tighten: bool('tighten', false), zooms: bool('zooms', mode === 'popups'),
      unmirror: bool('unmirror', false), progress_bar: bool('progress_bar', false), hook: clean(o.hook, 80), topic: clean(o.topic, 200) })
  } else {
    Object.assign(out, { footage: mode === 'voiceover' && !!o.footage, topic: clean(o.topic, 200), points: clean(o.points, 1200),
      script: clean(o.script, 3000), storyboard: clean(o.storyboard, 8000), music: bool('music', true),
      mood: ['confident', 'bright', 'calm'].includes(o.mood) ? o.mood : 'confident', builtin_voice: clean(o.builtin_voice, 30) })
  }
  return out
}

async function notifySlack(job) {
  const url = process.env.SLACK_WEBHOOK_URL
  if (!url) return
  try {
    await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: `:clapper: New Pipeline Studio video on commandpipeline.com\nEmail: ${job.email}\nOption: ${job.mode_name}\nBrand: ${job.brand.name}` }) })
  } catch { /* Slack is a nice-to-have */ }
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  const action = req.query.action
  if (!REDIS_URL || !REDIS_TOKEN || !process.env.BLOB_READ_WRITE_TOKEN) {
    if (action === 'status') return res.status(200).json({ online: false, configured: false, queue: 0 })
    return res.status(503).json({ error: 'The studio is not switched on yet. Please try again later.' })
  }
  try {
    // ---------------------------------------------------------------- visitors
    if (action === 'status' && req.method === 'GET') {
      const [seen, queue] = await Promise.all([redis('GET', 'studio:worker'), redis('LLEN', 'studio:queue')])
      return res.status(200).json({ online: !!seen, configured: true, queue: queue || 0 })
    }

    if (action === 'upload' && req.method === 'POST') {
      const result = await handleUpload({
        request: req,
        body: req.body,
        onBeforeGenerateToken: async (pathname, clientPayload) => {
          const { email } = JSON.parse(clientPayload || '{}')
          if (!EMAIL.test(clean(email))) throw new Error('Enter a valid email first')
          if (!pathname.startsWith('studio/uploads/')) throw new Error('Bad upload path')
          const used = parseInt((await redis('GET', `studio:rate:${clean(email).toLowerCase()}:${today()}`)) || '0', 10)
          if (used >= PER_EMAIL_PER_DAY) throw new Error(`You have made ${PER_EMAIL_PER_DAY} videos today. Come back tomorrow.`)
          return { allowedContentTypes: ['video/*', 'image/*'], maximumSizeInBytes: MAX_UPLOAD, addRandomSuffix: true, validUntil: Date.now() + 30 * 60 * 1000 }
        },
      })
      return res.status(200).json(result)
    }

    if (action === 'create' && req.method === 'POST') {
      const b = req.body || {}
      const email = clean(b.email).toLowerCase()
      const mode = MODES[b.mode] ? b.mode : null
      if (!EMAIL.test(email)) return res.status(400).json({ error: 'Enter a valid email so we can link the video to you' })
      if (!mode) return res.status(400).json({ error: 'Pick one of the four options' })
      const brand = sanitizeBrand(b.brand)
      if (!brand.name) return res.status(400).json({ error: 'Add your brand name in your brand kit' })
      const options = sanitizeOptions(mode, b.options)
      const needsVideo = mode === 'clean' || mode === 'popups' || options.footage
      const source = needsVideo ? b.source || {} : null
      if (needsVideo && !isOurBlob(source.url, 'uploads')) return res.status(400).json({ error: 'Upload your video first' })
      if (!needsVideo && !options.topic && !options.points && !options.storyboard && !options.script) return res.status(400).json({ error: 'Add a topic and a few key points' })
      if (options.footage && !options.script) return res.status(400).json({ error: 'Write the script for the voiceover' })

      const rateKey = `studio:rate:${email}:${today()}`
      const used = await redis('INCR', rateKey)
      if (used === 1) await redis('EXPIRE', rateKey, 2 * 24 * 3600)
      if (used > PER_EMAIL_PER_DAY) return res.status(429).json({ error: `You have made ${PER_EMAIL_PER_DAY} videos today. Come back tomorrow.` })
      const capKey = `studio:rate:all:${today()}`
      const all = await redis('INCR', capKey)
      if (all === 1) await redis('EXPIRE', capKey, 2 * 24 * 3600)
      if (all > DAILY_CAP) return res.status(429).json({ error: 'The studio is at capacity for today. Please try again tomorrow.' })

      const id = Array.from(crypto.getRandomValues(new Uint8Array(8)), x => x.toString(16).padStart(2, '0')).join('')
      const job = {
        id, email, mode, mode_name: MODES[mode], title: clean(b.title, 80) || `${MODES[mode]} for ${brand.name}`,
        brand, options, source: source ? { url: source.url, name: clean(source.name, 120), size: Number(source.size) || 0 } : null,
        created: new Date().toISOString(), stage: 'queued', step: 'Waiting for the studio', progress: 0, log: [], outputs: null, error: null,
      }
      await putJob(job)
      await redis('LPUSH', 'studio:queue', id)
      await notifySlack(job)
      return res.status(200).json({ id })
    }

    if (action === 'job' && req.method === 'GET') {
      const job = await getJob(String(req.query.id || '').replace(/[^a-f0-9]/g, ''))
      if (!job) return res.status(404).json({ error: 'Video not found (links last 14 days)' })
      const pos = job.stage === 'queued' ? await redis('LPOS', 'studio:queue', job.id) : null
      return res.status(200).json({ ...publicJob(job), queue_position: pos == null ? null : (await redis('LLEN', 'studio:queue')) - pos })
    }

    // ---------------------------------------------------------------- worker (Bilal's Mac)
    if (['claim', 'update', 'token', 'delete'].includes(action)) {
      const b = workerPayload(req, action)
      if (!b) return res.status(401).json({ error: 'Not authorized' })
      if (b.beat) await redis('SET', 'studio:worker', String(Date.now()), 'EX', 150)

      if (action === 'claim') {
        const id = await redis('RPOP', 'studio:queue')
        return res.status(200).json({ job: id ? await getJob(id) : null })
      }
      const job = await getJob(String(b.id || '').replace(/[^a-f0-9]/g, ''))
      if (!job) return res.status(404).json({ error: 'No such job' })

      if (action === 'update') {
        for (const k of ['stage', 'step', 'progress', 'error', 'log', 'outputs', 'output_sizes', 'plan', 'render_seconds']) if (k in b) job[k] = b[k]
        await putJob(job)
        return res.status(200).json({ ok: true })
      }
      if (action === 'token') {
        const name = String(b.name || '').replace(/[^\w.-]/g, '')
        const pathname = `studio/results/${job.id}/${name}`
        const token = await generateClientTokenFromReadWriteToken({
          token: process.env.BLOB_READ_WRITE_TOKEN, pathname, allowOverwrite: true, addRandomSuffix: false,
          maximumSizeInBytes: 80 * 1024 * 1024, validUntil: Date.now() + 60 * 60 * 1000,
        })
        return res.status(200).json({ token, pathname })
      }
      if (action === 'delete') {
        if (isOurBlob(b.url, 'uploads')) await del(b.url)
        return res.status(200).json({ ok: true })
      }
    }
    return res.status(404).json({ error: 'Unknown action' })
  } catch (e) {
    return res.status(400).json({ error: e.message || 'Something went wrong' })
  }
}
