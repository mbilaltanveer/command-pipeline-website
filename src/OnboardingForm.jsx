import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

// ─── Form schema ─────────────────────────────────────────────────────────────
// Fields mirror what Command Pipeline actually needs to launch a client:
// offer + ICP feed list building, signals feed targeting, access feeds
// infrastructure setup, and suppression feeds DNC coordination.

const STEPS = [
  {
    id: 'company',
    title: 'Company & Contact',
    blurb: 'Who you are and who we coordinate with day to day.',
    fields: [
      { name: 'companyName', label: 'Company name', type: 'text', required: true, placeholder: 'Acme Inc.' },
      { name: 'website', label: 'Website', type: 'url', required: true, placeholder: 'https://acme.com' },
      { name: 'contactName', label: 'Primary contact', type: 'text', required: true, placeholder: 'Jane Smith' },
      { name: 'contactEmail', label: 'Work email', type: 'email', required: true, placeholder: 'jane@acme.com' },
      { name: 'contactRole', label: 'Role / title', type: 'text', required: true, placeholder: 'Head of Growth' },
      { name: 'teamSize', label: 'Company size', type: 'select', required: true, options: ['1-14 employees', '15-50 employees', '51-100 employees', '100+ employees'] },
      { name: 'arr', label: 'Current ARR (approx.)', type: 'select', required: false, options: ['Pre-revenue', 'Under $500K', '$500K - $2M', '$2M - $5M', '$5M - $20M', '$20M+', 'Prefer not to say'] },
    ],
  },
  {
    id: 'offer',
    title: 'Your Offer',
    blurb: 'What we are selling on your behalf, and the proof we can use.',
    fields: [
      { name: 'productDescription', label: 'What do you sell?', type: 'textarea', required: true, rows: 3, placeholder: 'In one or two sentences, describe the product and the problem it solves.' },
      { name: 'valueProp', label: 'Core value proposition', type: 'textarea', required: true, rows: 3, placeholder: 'The single most compelling outcome a customer gets. Numbers help.' },
      { name: 'dealSize', label: 'Average deal size (ACV)', type: 'text', required: true, placeholder: 'e.g. $18,000' },
      { name: 'salesCycle', label: 'Typical sales cycle', type: 'select', required: true, options: ['Under 30 days', '30-60 days', '60-90 days', '90+ days'] },
      { name: 'proofPoints', label: 'Case studies & proof points', type: 'textarea', required: false, rows: 3, placeholder: 'Named logos, metrics, testimonials we can reference in copy. Links welcome.' },
      { name: 'differentiators', label: 'Why do you win?', type: 'textarea', required: false, rows: 2, placeholder: 'What makes you the obvious choice over the alternative?' },
      { name: 'competitors', label: 'Main competitors', type: 'text', required: false, placeholder: 'Comma separated' },
    ],
  },
  {
    id: 'icp',
    title: 'Ideal Customer Profile',
    blurb: 'This drives list building and A/B/C/D grading, so specificity pays off.',
    fields: [
      { name: 'targetIndustries', label: 'Target industries', type: 'textarea', required: true, rows: 2, placeholder: 'e.g. B2B SaaS, PropTech, vertical SaaS for logistics' },
      { name: 'targetTitles', label: 'Target job titles', type: 'textarea', required: true, rows: 2, placeholder: 'e.g. CEO, Founder, VP Sales, Head of Growth' },
      { name: 'targetCompanySize', label: 'Target company size', type: 'text', required: true, placeholder: 'e.g. 15-100 employees' },
      { name: 'targetGeography', label: 'Target geography', type: 'text', required: true, placeholder: 'e.g. United States and Canada' },
      { name: 'targetRevenue', label: 'Target revenue range', type: 'text', required: false, placeholder: 'e.g. $1M - $20M ARR' },
      { name: 'techStack', label: 'Relevant tech stack signals', type: 'text', required: false, placeholder: 'Tools their team uses that indicate a fit' },
      { name: 'notAFit', label: 'Who is NOT a fit?', type: 'textarea', required: true, rows: 2, placeholder: 'Segments, sizes, or industries we should exclude outright.' },
    ],
  },
  {
    id: 'signals',
    title: 'Signals & Targeting',
    blurb: 'Which buying signals should trigger outreach.',
    fields: [
      {
        name: 'signals',
        label: 'Buying signals to prioritise',
        type: 'checkbox',
        required: true,
        options: [
          'Funding rounds',
          'Leadership / exec hires',
          'Job postings (hiring for sales)',
          'Tech stack changes',
          'Conference & event attendance',
          'Competitor customers',
          'Website visitors',
          'Rapid headcount growth',
        ],
      },
      { name: 'signalNotes', label: 'Anything else that indicates timing?', type: 'textarea', required: false, rows: 2, placeholder: 'Seasonality, budget cycles, regulatory triggers, etc.' },
      { name: 'monthlyTarget', label: 'Monthly meeting target', type: 'text', required: true, placeholder: 'e.g. 15 qualified meetings / month' },
    ],
  },
  {
    id: 'access',
    title: 'Access & Infrastructure',
    blurb: 'What we need to stand up sending infrastructure and route replies. Do not put passwords here — we will request access through the proper tool invites.',
    fields: [
      { name: 'primaryDomain', label: 'Primary domain', type: 'text', required: true, placeholder: 'acme.com (we buy and warm lookalike sending domains)' },
      { name: 'crm', label: 'CRM', type: 'select', required: true, options: ['HubSpot', 'Salesforce', 'Pipedrive', 'Close', 'Other', 'None yet'] },
      { name: 'crmOwner', label: 'Who can grant CRM access?', type: 'text', required: false, placeholder: 'Name and email of the admin' },
      { name: 'slackWorkspace', label: 'Slack workspace for reply alerts', type: 'text', required: false, placeholder: 'workspace URL, or note if you prefer email alerts' },
      { name: 'linkedinAccounts', label: 'LinkedIn accounts for outreach', type: 'textarea', required: true, rows: 2, placeholder: 'Whose profiles will send connection requests? Sales Navigator seats?' },
      { name: 'bookingLink', label: 'Booking / calendar link', type: 'url', required: true, placeholder: 'https://calendly.com/...' },
      { name: 'meetingOwner', label: 'Who takes the meetings?', type: 'text', required: true, placeholder: 'Name(s) and email(s)' },
    ],
  },
  {
    id: 'compliance',
    title: 'Suppression & Launch',
    blurb: 'Cross-channel DNC coordination depends on getting this right up front.',
    fields: [
      { name: 'suppressionList', label: 'Who must we NOT contact?', type: 'textarea', required: true, rows: 3, placeholder: 'Existing customers, open opportunities, partners, investors, specific domains.' },
      { name: 'hasSuppressionFile', label: 'Do you have a suppression file to share?', type: 'select', required: true, options: ['Yes, I will send a CSV', 'Yes, it lives in our CRM', 'No, we will build one together'] },
      { name: 'existingOutbound', label: 'Existing or past outbound', type: 'textarea', required: false, rows: 2, placeholder: 'Tools used, what worked, what did not. Share sequences if you have them.' },
      { name: 'brandGuidelines', label: 'Brand / tone guidelines', type: 'textarea', required: false, rows: 2, placeholder: 'Anything we must or must not say. Links to docs welcome.' },
      { name: 'launchTimeline', label: 'Desired launch timeline', type: 'select', required: true, options: ['ASAP', 'Within 2 weeks', 'Within 30 days', 'Next quarter'] },
      { name: 'notes', label: 'Anything else we should know?', type: 'textarea', required: false, rows: 3, placeholder: 'Optional' },
    ],
  },
]

const BRAND = '#E8A000'
const CORAL = '#FF8559'
const INK = '#1E293B'

const inputBase = {
  width: '100%',
  background: '#fff',
  border: '1px solid #CBD5E1',
  borderRadius: '8px',
  padding: '11px 14px',
  fontFamily: 'Inter, sans-serif',
  fontSize: '15px',
  color: INK,
  outline: 'none',
  boxSizing: 'border-box',
}

function Field({ field, value, error, onChange }) {
  const id = `f-${field.name}`
  const describedBy = error ? `${id}-err` : undefined
  const borderColor = error ? '#DC2626' : '#CBD5E1'

  return (
    <div style={{ marginBottom: '22px' }}>
      <label
        htmlFor={field.type === 'checkbox' ? undefined : id}
        style={{
          display: 'block',
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 600,
          fontSize: '14px',
          color: INK,
          marginBottom: '7px',
        }}
      >
        {field.label}
        {field.required && <span style={{ color: CORAL, marginLeft: '4px' }}>*</span>}
      </label>

      {field.type === 'textarea' && (
        <textarea
          id={id}
          rows={field.rows || 3}
          value={value || ''}
          placeholder={field.placeholder}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          onChange={e => onChange(field.name, e.target.value)}
          style={{ ...inputBase, borderColor, resize: 'vertical', lineHeight: 1.6 }}
        />
      )}

      {field.type === 'select' && (
        <div style={{ position: 'relative' }}>
          <select
            id={id}
            value={value || ''}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            onChange={e => onChange(field.name, e.target.value)}
            style={{ ...inputBase, borderColor, appearance: 'none', paddingRight: '38px', cursor: 'pointer' }}
          >
            <option value="">Select…</option>
            {field.options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <ChevronDown
            size={17}
            color="#64748B"
            style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          />
        </div>
      )}

      {field.type === 'checkbox' && (
        <div
          role="group"
          aria-describedby={describedBy}
          className="grid sm:grid-cols-2"
          style={{ gap: '9px' }}
        >
          {field.options.map(o => {
            const list = Array.isArray(value) ? value : []
            const checked = list.includes(o)
            return (
              <label
                key={o}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: checked ? 'rgba(232,160,0,0.09)' : '#fff',
                  border: `1px solid ${checked ? BRAND : '#CBD5E1'}`,
                  borderRadius: '8px',
                  padding: '10px 13px',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease, border-color 0.15s ease',
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    const next = checked ? list.filter(x => x !== o) : [...list, o]
                    onChange(field.name, next)
                  }}
                  style={{ width: 15, height: 15, accentColor: BRAND, flexShrink: 0, cursor: 'pointer' }}
                />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#334155' }}>{o}</span>
              </label>
            )
          })}
        </div>
      )}

      {!['textarea', 'select', 'checkbox'].includes(field.type) && (
        <input
          id={id}
          type={field.type}
          value={value || ''}
          placeholder={field.placeholder}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          onChange={e => onChange(field.name, e.target.value)}
          style={{ ...inputBase, borderColor }}
        />
      )}

      {error && (
        <p id={`${id}-err`} style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#DC2626', marginTop: '6px' }}>
          {error}
        </p>
      )}
    </div>
  )
}

export default function OnboardingForm() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState({})
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const isLast = step === STEPS.length - 1
  const current = STEPS[step]

  const setField = (name, value) => {
    setData(d => ({ ...d, [name]: value }))
    setErrors(e => (e[name] ? { ...e, [name]: undefined } : e))
  }

  const validateStep = () => {
    const next = {}
    current.fields.forEach(f => {
      if (!f.required) return
      const v = data[f.name]
      const empty = f.type === 'checkbox'
        ? !Array.isArray(v) || v.length === 0
        : !v || !String(v).trim()
      if (empty) {
        next[f.name] = 'This field is required.'
        return
      }
      if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim())) {
        next[f.name] = 'Enter a valid email address.'
      }
      if (f.type === 'url' && !/^https?:\/\/.+\..+/.test(String(v).trim())) {
        next[f.name] = 'Enter a full URL starting with https://'
      }
    })
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const goNext = () => {
    if (!validateStep()) return
    setStep(s => Math.min(s + 1, STEPS.length - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goBack = () => {
    setStep(s => Math.max(s - 1, 0))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validateStep()) return
    setStatus('submitting')
    try {
      const res = await fetch('/api/submit-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: data }),
      })
      if (!res.ok) throw new Error('failed')
      setStatus('done')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setStatus('error')
    }
  }

  // ── Success ────────────────────────────────────────────────────────────────
  if (status === 'done') {
    return (
      <main style={{ minHeight: '100vh', background: '#F8FAFC', padding: '80px 24px' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
          <img src="/cp-logo-full.png" alt="Command Pipeline" style={{ height: '40px', width: 'auto', margin: '0 auto 40px' }} />
          <div style={{
            width: 60, height: 60, borderRadius: '50%', background: 'rgba(74,222,128,0.14)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
          }}>
            <Check size={28} color="#16A34A" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '28px', color: INK, marginBottom: '14px', letterSpacing: '-0.01em' }}>
            You're all set.
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#475569', lineHeight: 1.65 }}>
            Thanks — we have everything we need to start. Your kickoff owner will reach out within one
            business day to confirm access and lock the launch date. Infrastructure warm-up begins
            as soon as domains are approved.
          </p>
          <a
            href="/"
            style={{
              display: 'inline-block', marginTop: '32px', color: '#B87A00',
              fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '15px', textDecoration: 'none',
            }}
          >
            ← Back to commandpipeline.com
          </a>
        </div>
      </main>
    )
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <main style={{ minHeight: '100vh', background: '#F8FAFC', padding: '48px 24px 80px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '34px' }}>
          <a href="/">
            <img src="/cp-logo-full.png" alt="Command Pipeline" style={{ height: '38px', width: 'auto', margin: '0 auto 26px' }} />
          </a>
          <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 'clamp(26px, 4vw, 34px)', color: INK, marginBottom: '12px', letterSpacing: '-0.02em' }}>
            Client Onboarding
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#475569', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
            About 10 minutes. This is everything we need to build your lists, write your sequences,
            and get infrastructure warming.
          </p>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '100px',
                  background: i <= step ? BRAND : '#E2E8F0',
                  transition: 'background 0.3s ease',
                }}
              />
            ))}
          </div>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '12px', color: '#B87A00', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Step {step + 1} of {STEPS.length} · {current.title}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{
            background: '#fff',
            border: '1px solid #E2E8F0',
            borderTop: `3px solid ${BRAND}`,
            borderRadius: '16px',
            padding: 'clamp(24px, 4vw, 38px)',
          }}>
            <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '21px', color: INK, marginBottom: '8px' }}>
              {current.title}
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14.5px', color: '#64748B', marginBottom: '30px', lineHeight: 1.6 }}>
              {current.blurb}
            </p>

            {current.fields.map(f => (
              <Field key={f.name} field={f} value={data[f.name]} error={errors[f.name]} onChange={setField} />
            ))}

            {status === 'error' && (
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#DC2626', marginBottom: '16px' }}>
                Something went wrong submitting the form. Please try again, or email us directly.
              </p>
            )}

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '30px', flexWrap: 'wrap' }}>
              {step > 0 && (
                <button
                  type="button"
                  onClick={goBack}
                  style={{
                    background: '#fff', color: INK, border: '1px solid #CBD5E1',
                    fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '15px',
                    padding: '13px 26px', borderRadius: '8px', cursor: 'pointer',
                  }}
                >
                  Back
                </button>
              )}

              {isLast ? (
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  style={{
                    background: CORAL, color: '#fff', border: 'none',
                    fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '15px',
                    padding: '14px 32px', borderRadius: '8px',
                    cursor: status === 'submitting' ? 'default' : 'pointer',
                    opacity: status === 'submitting' ? 0.7 : 1,
                    letterSpacing: '0.02em',
                  }}
                  className="hover:opacity-90 transition-opacity"
                >
                  {status === 'submitting' ? 'Submitting…' : 'Submit onboarding'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={goNext}
                  style={{
                    background: CORAL, color: '#fff', border: 'none',
                    fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '15px',
                    padding: '14px 32px', borderRadius: '8px', cursor: 'pointer',
                    letterSpacing: '0.02em',
                  }}
                  className="hover:opacity-90 transition-opacity"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </form>

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#94A3B8', textAlign: 'center', marginTop: '22px', lineHeight: 1.6 }}>
          Never share passwords or API keys in this form. We request access through each tool's own
          invite flow.
        </p>
      </div>
    </main>
  )
}
