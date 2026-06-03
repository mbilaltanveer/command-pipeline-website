import { useState, useEffect, useRef } from 'react'
import {
  Antenna, Target, Mail, UserPlus, Bot, TrendingUp, RefreshCw,
  ShieldCheck, Share2, Award, ChevronDown, Check, X,
} from 'lucide-react'

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Results',      href: '#results' },
  { label: 'Clients',      href: '#testimonials' },
  { label: "Who It's For", href: '#who' },
]

const STEPS = [
  {
    num: '01',
    title: 'Signal Intelligence',
    body: 'We scan for real-time buying signals: funding rounds, leadership hires, tech stack changes, and job postings. Your list is built on intent, not guesswork.',
    color: '#E8A000',
  },
  {
    num: '02',
    title: 'Precision Targeting',
    body: 'RevenueBase and Clay enrichment grades every company and contact A/B/C/D. Only top-tier leads enter your pipeline. No spray, no pray.',
    color: '#FBBF24',
  },
  {
    num: '03',
    title: 'Multi-Channel Sequences',
    body: 'Coordinated 3-touch email sequences run in parallel with LinkedIn connection requests and messages. Timed to the signal, not blasted on a schedule.',
    color: '#FF8559',
  },
  {
    num: '04',
    title: 'AI-Augmented Execution',
    body: 'AI reply agents respond within 5 minutes. Cross-channel coordination stops double-messaging. Every reply categorized and routed instantly.',
    color: '#E8A000',
  },
  {
    num: '05',
    title: 'Pipeline Attribution',
    body: 'Full CRM sync: every email sent, LinkedIn view, and connection request logged on your contact timeline. Direct and influence attribution tracked.',
    color: '#FBBF24',
  },
]

const DIFFERENTIATORS = [
  {
    icon: '⚙️',
    title: 'Operator-Built',
    body: 'Founded by operators who ran outbound at $0 to $70M+ ARR. We know the work because we do the work, not consultants guessing at GTM strategy.',
  },
  {
    icon: '🏗️',
    title: 'System-as-Product',
    body: 'Five-layer technical architecture: data, execution, ops, intelligence, automation. The system compounds over time. Each campaign makes the next one sharper.',
  },
  {
    icon: '📡',
    title: 'Multi-Channel by Default',
    body: 'Email and LinkedIn run in coordinated sequences, not silos. No lead gets double-messaged. No signal gets missed. Every touchpoint is logged.',
  },
  {
    icon: '🤖',
    title: 'AI Where It Matters',
    body: 'AI reply agents, automated categorization, intelligent routing. Human judgment on strategy and QA. Automation on every repetitive touchpoint.',
  },
]

const STATS = [
  { num: 500,  prefix: '',   suffix: '+',  label: 'Campaigns Run',       sub: 'across all active clients'          },
  { num: 25,   prefix: '≥',  suffix: '%',  label: 'Email Reply Rate',    sub: 'vs ~5% industry average'            },
  { num: 40,   prefix: '≥',  suffix: '%',  label: 'LinkedIn Reply Rate', sub: 'vs ~10% industry average'           },
  { num: 579,  prefix: '',   suffix: '',   label: 'Replies Analyzed',    sub: 'to validate our ICP criteria'       },
]

const FEED_ITEMS = [
  {
    type: 'reply',
    name: 'Sarah Chen',
    role: 'VP Sales · Zendesk',
    msg: '"Interested, can we set up a call this week?"',
    time: '2m ago',
  },
  {
    type: 'reply',
    name: 'Marcus Lee',
    role: 'CEO · Buildkite',
    msg: '"This looks relevant. What does onboarding look like?"',
    time: '14m ago',
  },
  {
    type: 'signal',
    company: 'Pendo',
    detail: 'Series C · $47M raised · Hiring VP Sales',
    time: 'Just now',
  },
]

const ICP_SEGMENTS = [
  {
    tag: 'Primary',
    title: 'B2B SaaS',
    color: '#E8A000',
    points: [
      'Seed to Series B',
      '15 to 100 employees',
      '$500K to $20M ARR',
      'CEO/Founder still in the sales process',
      'No dedicated SDR team yet',
    ],
  },
  {
    tag: 'High-Affinity',
    title: 'PropTech',
    color: '#FBBF24',
    points: [
      'Property management, CRE tech, construction tech',
      '15 to 75 employees',
      '$1M to $20M ARR',
      'Seed to Series B',
      'Complex, relationship-driven sales cycles',
    ],
  },
  {
    tag: 'Channel Multiplier',
    title: 'VC Firms',
    color: '#FF8559',
    points: [
      'Early-stage VCs investing in B2B SaaS / PropTech',
      'GP, Managing Partner, Partner',
      '1 VC converts to 15 to 50 portfolio introductions',
      'Relationship-first, not cold volume',
    ],
  },
]

// Replace these with real client testimonials before launch
const TESTIMONIALS = [
  {
    quote: 'We went from founder-led cold outreach to a systematic multi-channel process in about 30 days. Signal targeting made the difference. We were reaching people with a real reason to talk, not just names that matched a job title. 47 interested replies in the first 90 days.',
    name: '[Client Name]',
    title: 'CEO',
    company: 'B2B SaaS · Series A',
    result: '47 positive replies in 90 days',
  },
  {
    quote: 'We tried email-only outbound before and stalled at 3% reply rates. The coordinated email and LinkedIn approach was completely different. By month two, qualified pipeline was coming in every week. The AI reply triage meant no interested lead sat cold for more than 5 minutes.',
    name: '[Client Name]',
    title: 'Head of Growth',
    company: 'PropTech · Seed',
    result: '28%+ Email PRR from month two',
  },
  {
    quote: 'The infrastructure surprised me most. 75+ warmed domains, daily monitoring, instant swap when something drops. Our previous agency had us sending from one domain with no backup plan. The deliverability difference showed up immediately in our reply rates.',
    name: '[Client Name]',
    title: 'Founder',
    company: 'Vertical SaaS · Seed',
    result: 'Pipeline booked in week 4 of launch',
  },
]

const INCLUDED_ITEMS = [
  {
    title: 'Signal-based lead lists',
    detail: 'ICP-qualified, enriched across 20+ data points, graded A/B/C/D in Clay. Only A/B contacts enter your pipeline.',
  },
  {
    title: 'Email sequences (3-touch, 3 variants)',
    detail: 'Written per the GEX framework. Under 75 words per email. Three distinct copy angles. QA\'d before launch.',
  },
  {
    title: 'LinkedIn sequences',
    detail: 'Connection request + 2 follow-up DMs. Platform-native tone, coordinated timing with email.',
  },
  {
    title: 'Email infrastructure (75+ domains)',
    detail: 'Backup domains always warming. Instant swap when performance drops. Zero waiting, zero downtime.',
  },
  {
    title: 'AI reply agents',
    detail: 'Every interested reply categorized and routed within 5 minutes. Flagged in your Slack and logged to your CRM automatically.',
  },
  {
    title: 'Cross-channel DNC coordination',
    detail: 'A lead who replies on email is removed from LinkedIn. No double-messaging across any channel, ever.',
  },
  {
    title: 'Full CRM sync',
    detail: 'Every email sent, LinkedIn view, connection request, and reply logged on the contact timeline. HubSpot and Salesforce supported.',
  },
  {
    title: 'Weekly performance reporting',
    detail: 'PRR, Emails to Positive, campaign tier classification, and a clear read on what to scale and what to cut.',
  },
  {
    title: 'Attribution tracking',
    detail: 'Direct attribution (outreach caused this reply) and influence attribution (we touched this deal before it closed).',
  },
  {
    title: 'Full asset ownership',
    detail: 'Every list, sequence, domain, and Clay table is yours. You own everything we build, always.',
  },
]

const CAROUSEL_ITEMS = [
  { Icon: Antenna,    label: 'Signal Intelligence'  },
  { Icon: Target,     label: 'ICP Grading'          },
  { Icon: Mail,       label: 'Email Sequences'      },
  { Icon: UserPlus,   label: 'LinkedIn Outreach'    },
  { Icon: Bot,        label: 'AI Reply Agents'      },
  { Icon: TrendingUp, label: 'Pipeline Attribution' },
  { Icon: RefreshCw,  label: 'CRM Sync'             },
  { Icon: ShieldCheck,label: 'DNC Compliance'       },
  { Icon: Share2,     label: 'Multi-Channel'        },
  { Icon: Award,      label: 'Lead Grading'         },
]

const COMPARISON_ROWS = [
  { label: 'Time to first reply',         cp: '~30 days',                inhouse: '6+ months (SDR ramp)', other: '45-90 days'      },
  { label: 'Setup time',                  cp: '2-4 weeks',               inhouse: '3-6 months',           other: '4-8 weeks'       },
  { label: 'Monthly cost',                cp: 'Flat monthly fee',        inhouse: '$40K+/month',          other: 'Variable'        },
  { label: 'Multi-channel by default',    cp: true,                      inhouse: false,                  other: false             },
  { label: 'Signal-based targeting',      cp: true,                      inhouse: false,                  other: false             },
  { label: '75+ warmed domains',          cp: true,                      inhouse: false,                  other: 'Varies'          },
  { label: 'AI reply agents (5 min)',     cp: true,                      inhouse: false,                  other: false             },
  { label: 'Full CRM sync',              cp: true,                      inhouse: 'Manual',               other: false             },
  { label: 'Weekly reporting',            cp: true,                      inhouse: false,                  other: 'If requested'    },
  { label: 'You own all assets',          cp: true,                      inhouse: true,                   other: false             },
  { label: 'Positive Reply Rate',         cp: '≥25% email / ≥40% LI',   inhouse: 'Varies by SDR',        other: '3-8% typical'    },
]

const JOURNEY_STEPS = [
  {
    phase: 'Free Call',
    title: 'Discovery',
    body: 'We audit your current outbound motion, map your ICP against our 579-reply validated criteria, and identify the 1-3 signals with the highest conversion potential for your offer. You leave with a clear picture of what is possible.',
    color: '#E8A000',
  },
  {
    phase: 'Week 1',
    title: 'Infrastructure',
    body: '75+ email domains purchased and entering warm-up. HeyReach configured for LinkedIn. DNC blocklist imported. CRM sync connected and tested.',
    color: '#FBBF24',
  },
  {
    phase: 'Weeks 2-3',
    title: 'Build',
    body: 'Signal-based lead lists sourced and enriched in Clay. Every company and contact graded A/B/C/D. Email and LinkedIn sequences written per the GEX method, QA\'d, and sent to you for approval.',
    color: '#FF8559',
  },
  {
    phase: 'Week 3-4',
    title: 'Launch',
    body: 'Campaigns go live. AI reply agents activated. First interested replies start coming in. Every event logged to your CRM in real time. First weekly report delivered.',
    color: '#E8A000',
  },
  {
    phase: 'Month 2+',
    title: 'Optimize',
    body: 'Double down on campaigns hitting Excellent tier (35%+ PRR). Kill anything below 15%. Layer in new signal campaigns. Every month the system has more data and gets sharper.',
    color: '#FBBF24',
  },
]

const FAQ_ITEMS = [
  {
    q: 'How quickly will we see results?',
    a: 'Most clients see first interested replies within 2 weeks of campaigns going live. Infrastructure setup takes weeks 1 and 2, campaigns launch in weeks 3 and 4, and by month 2 you are optimizing winners. The exact timeline depends on your ICP and offer. We give you a specific projection in the discovery call.',
  },
  {
    q: 'We tried cold email before and it did not work.',
    a: 'What did not work was almost certainly one of three things: no signal targeting (cold list, no intent), no infrastructure (burned domains, deliverability issues), or single-channel execution (email-only with no LinkedIn coordination). We run differently at every layer. Multi-channel by default, 75+ warmed domains per client, 5-tier signal targeting, AI reply agents. The mechanics are fundamentally different.',
  },
  {
    q: 'How is this different from giving us Clay and a Smartlead account?',
    a: 'Tools do not run campaigns. We do. We bring 500+ campaigns of signal data, ICP criteria validated against 579 interested replies, and a team that runs this system every day. You get the output, not a subscription to configure yourself.',
  },
  {
    q: 'What is our involvement week to week?',
    a: 'Weekly 30-minute calls to review performance and steer priorities. You review copy before we launch. You close the meetings we book. Everything else — sourcing, enrichment, sequencing, sending, reply triage, CRM sync, and reporting — we handle.',
  },
  {
    q: 'Do you write all the copy?',
    a: 'Yes. Email sequences (3-touch, 3 variants) and LinkedIn sequences are written by our team using the GEX framework. You review and approve before we launch. We iterate based on reply data. What converts gets scaled, what underperforms gets cut.',
  },
  {
    q: 'How do you handle deliverability?',
    a: '75+ warmed domains per client. We always keep backup domains warming in reserve. If your goal is 500 emails per day, we build capacity for 750. When a domain\'s performance drops, we swap instantly. You never wait 2 weeks to recover. Weekly deliverability monitoring is included.',
  },
  {
    q: 'What CRMs do you work with?',
    a: 'HubSpot and Salesforce. Every email sent, LinkedIn view, connection request, and reply is logged on the contact timeline automatically.',
  },
  {
    q: 'What if we do not hit the benchmarks?',
    a: 'We define what good looks like at the start: at least 25% Email PRR and at least 40% LinkedIn PRR are our minimums. If we are not hitting them, we diagnose and fix, not just report. Campaigns are classified into tiers weekly and we act on the data.',
  },
  {
    q: 'Do we own the assets when we stop working together?',
    a: 'Yes. Every list, sequence, domain, Clay table, and CRM entry is yours completely. We do not hold your pipeline infrastructure hostage.',
  },
]

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useCounter(target, active, duration = 1400) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let current = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      current += step
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [active, target, duration])
  return count
}

// ─── Components ──────────────────────────────────────────────────────────────

function AnnouncementBar() {
  return (
    <div style={{
      background: '#0D0F14',
      borderBottom: '1px solid rgba(232,160,0,0.12)',
      padding: '10px 24px',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      flexWrap: 'wrap',
    }}>
      <span style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: '#E8A000',
        display: 'inline-block',
        flexShrink: 0,
        animation: 'pulseDot 2s ease-in-out infinite',
      }} />
      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>
        Conference signal campaigns outperform cold lists by{' '}
        <span style={{ color: '#E8A000', fontWeight: 600 }}>6.5x</span>
        {' '}in reply efficiency.
      </span>
      <a
        href="#how-it-works"
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          color: '#E8A000',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        See the signal stack →
      </a>
    </div>
  )
}

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <AnnouncementBar />
      <nav style={{ borderBottom: '1px solid #E2E8F0', background: '#fff' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <img src="/cp-logo-full.png" alt="Command Pipeline" className="h-8 w-auto" />
          </a>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <a
                key={l.href}
                href={l.href}
                style={{ color: '#475569', fontFamily: 'Inter, sans-serif', fontSize: '15px' }}
                className="hover:text-amber-gold transition-colors font-medium"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="#cta"
              style={{
                backgroundColor: '#FF8559',
                color: '#fff',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                padding: '10px 20px',
                borderRadius: '6px',
                textDecoration: 'none',
                letterSpacing: '0.02em',
              }}
              className="hover:opacity-90 transition-opacity"
            >
              Book a Strategy Session
            </a>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <div style={{ width: 22, height: 2, background: '#1E293B', marginBottom: 5 }} />
            <div style={{ width: 22, height: 2, background: '#1E293B', marginBottom: 5 }} />
            <div style={{ width: 22, height: 2, background: '#1E293B' }} />
          </button>
        </div>

        {open && (
          <div style={{ borderTop: '1px solid #E2E8F0', background: '#fff' }} className="md:hidden px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{ color: '#475569', fontFamily: 'Inter, sans-serif', fontSize: '15px' }}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#cta"
              onClick={() => setOpen(false)}
              style={{
                backgroundColor: '#FF8559',
                color: '#fff',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                padding: '10px 20px',
                borderRadius: '6px',
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              Book a Strategy Session
            </a>
          </div>
        )}
      </nav>
    </header>
  )
}

function HeroDashboard() {
  return (
    <div
      className="hidden lg:block"
      style={{ flexShrink: 0, width: '370px', position: 'relative' }}
    >
      <div style={{
        position: 'absolute',
        inset: '-80px',
        background: 'radial-gradient(ellipse at center, rgba(232,160,0,0.12) 0%, transparent 68%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        background: '#1C1C24',
        borderRadius: '16px',
        border: '1px solid rgba(232,160,0,0.2)',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(232,160,0,0.06)',
        animation: 'floatCard 5s ease-in-out infinite',
      }}>
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #E8A000, #FBBF24, rgba(251,191,36,0))' }} />

        <div style={{
          padding: '14px 18px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '13px', color: '#fff', letterSpacing: '0.01em' }}>
            Campaign Activity
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: '#4ADE80',
              display: 'inline-block', animation: 'pulseDot 2s ease-in-out infinite',
            }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#4ADE80', fontWeight: 600, letterSpacing: '0.08em' }}>
              LIVE
            </span>
          </span>
        </div>

        {FEED_ITEMS.map((item, i) => (
          <div key={i} style={{
            padding: '14px 18px',
            borderBottom: i < FEED_ITEMS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            animation: `feedSlide 0.45s ease ${i * 0.12}s both`,
          }}>
            {item.type === 'reply' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <span style={{ fontSize: '12px' }}>✉️</span>
                    <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '12px', color: '#E8A000' }}>
                      {item.name}
                    </span>
                  </div>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#475569' }}>{item.time}</span>
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#64748B', marginBottom: '5px' }}>
                  {item.role}
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#94A3B8', lineHeight: 1.5, fontStyle: 'italic' }}>
                  {item.msg}
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <span style={{ fontSize: '12px' }}>📡</span>
                    <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '12px', color: '#FBBF24' }}>
                      Signal detected
                    </span>
                  </div>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#475569' }}>{item.time}</span>
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#94A3B8', lineHeight: 1.5 }}>
                  <span style={{ color: '#E2E8F0', fontWeight: 600 }}>{item.company}</span>
                  {' · '}{item.detail}
                </div>
              </>
            )}
          </div>
        ))}

        <div style={{
          padding: '10px 18px',
          background: 'rgba(232,160,0,0.05)',
          borderTop: '1px solid rgba(232,160,0,0.1)',
          display: 'flex',
          gap: '0',
          alignItems: 'center',
        }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '15px', color: '#E8A000' }}>≥25%</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#64748B', marginLeft: '5px' }}>Email PRR</span>
          </div>
          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ flex: 1, paddingLeft: '14px' }}>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '15px', color: '#FBBF24' }}>500+</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#64748B', marginLeft: '5px' }}>Campaigns</span>
          </div>
          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ flex: 1, paddingLeft: '14px' }}>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '15px', color: '#FF8559' }}>579</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#64748B', marginLeft: '5px' }}>Replies studied</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ParticleBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const COUNT = 350
    let w = 0, h = 0
    let mouse = { x: 0, y: 0 }
    let target = { x: 0, y: 0 }
    let particles = []
    let raf

    function resize() {
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = w
      canvas.height = h
    }

    function init() {
      particles = Array.from({ length: COUNT }, () => {
        const rand = Math.random()
        const type = rand < 0.52 ? 'dot' : rand < 0.76 ? 'plus' : 'cross'
        return {
          nx: Math.random(), ny: Math.random(), type,
          s: Math.random() < 0.35 ? 3.5 : 2,
          bold: Math.random() < 0.4,
          depth: 0.15 + Math.random() * 0.85,
          alpha: 0.25 + Math.random() * 0.2,
        }
      })
    }

    function draw() {
      mouse.x += (target.x - mouse.x) * 0.07
      mouse.y += (target.y - mouse.y) * 0.07
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        const ox = mouse.x * p.depth * 55
        const oy = mouse.y * p.depth * 55
        const px = Math.round(p.nx * w + ox)
        const py = Math.round(p.ny * h + oy)
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.type === 'dot' ? '#1E293B' : p.type === 'plus' ? '#E8A000' : '#FF8559'
        ctx.save()
        ctx.translate(px, py)
        if (p.type === 'dot') {
          ctx.beginPath()
          ctx.arc(0, 0, p.s * (p.bold ? 0.8 : 0.55), 0, Math.PI * 2)
          ctx.fill()
        } else {
          if (p.type === 'cross') ctx.rotate(Math.PI / 4)
          const arm = p.s * 1.8
          const t = p.bold ? 2.4 : 1.4
          ctx.fillRect(-arm, -t / 2, arm * 2, t)
          ctx.fillRect(-t / 2, -arm, t, arm * 2)
        }
        ctx.restore()
      }
      raf = requestAnimationFrame(draw)
    }

    function onMouseMove(e) {
      target.x = e.clientX / window.innerWidth - 0.5
      target.y = e.clientY / window.innerHeight - 0.5
    }

    resize()
    init()
    draw()
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
  )
}

function StatItem({ stat, active, isLast }) {
  const count = useCounter(stat.num, active)
  return (
    <div style={{
      flex: '1 1 180px',
      padding: '24px 32px',
      borderRight: isLast ? 'none' : '1px solid #E2E8F0',
    }}>
      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '32px', color: '#E8A000', lineHeight: 1, marginBottom: '6px' }}>
        {stat.prefix}{count}{stat.suffix}
      </div>
      <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '13px', color: '#1E293B', marginBottom: '3px' }}>
        {stat.label}
      </div>
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#94A3B8' }}>
        {stat.sub}
      </div>
    </div>
  )
}

function Hero() {
  const statsRef = useRef(null)
  const [statsActive, setStatsActive] = useState(false)

  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsActive(true) },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section style={{ paddingTop: '7rem', paddingBottom: '5rem', background: '#fff', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#E8A000' }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(232,160,0,0.13) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        pointerEvents: 'none',
        maskImage: 'radial-gradient(ellipse 90% 90% at 50% 0%, black 30%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 0%, black 30%, transparent 100%)',
      }} />
      <ParticleBackground />

      <div className="max-w-6xl mx-auto px-6" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '52px' }}>
          <div style={{ flex: '1 1 auto', minWidth: 0 }}>
            <div
              className="observe-fade"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(232,160,0,0.08)',
                border: '1px solid rgba(232,160,0,0.2)',
                borderRadius: '100px',
                padding: '6px 14px',
                marginBottom: '28px',
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E8A000', display: 'inline-block', flexShrink: 0, animation: 'pulseDot 2s ease-in-out infinite' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 500, color: '#E8A000', letterSpacing: '0.02em' }}>
                500+ campaigns · 2M+ emails · 579 replies analyzed
              </span>
            </div>

            <h1
              className="observe-fade"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(36px, 4.5vw, 54px)',
                lineHeight: 1.1,
                color: '#1E293B',
                marginBottom: '20px',
                letterSpacing: '-0.02em',
                '--delay': '0.1s',
              }}
            >
              Outbound Built on Signal.
              <br />
              <span style={{ color: '#E8A000' }}>Qualified Meetings.</span>
              <br />
              No SDR Team.
            </h1>

            <p
              className="observe-fade"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '17px',
                lineHeight: 1.65,
                color: '#475569',
                maxWidth: '500px',
                marginBottom: '36px',
                '--delay': '0.2s',
              }}
            >
              We run coordinated email and LinkedIn campaigns for B2B SaaS companies.
              Signal-based targeting, AI reply agents, and 75+ warmed domains per client.
              Pipeline in 30 days, not the 6 months it takes to ramp an SDR.
            </p>

            <div className="flex flex-wrap gap-4 items-center observe-fade" style={{ '--delay': '0.3s' }}>
              <a
                href="#cta"
                style={{
                  backgroundColor: '#FF8559',
                  color: '#fff',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 700,
                  fontSize: '15px',
                  padding: '14px 28px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  letterSpacing: '0.02em',
                }}
                className="hover:opacity-90 transition-opacity"
              >
                Get a Free Outbound Audit
              </a>
              <a
                href="#how-it-works"
                style={{
                  color: '#1E293B',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 600,
                  fontSize: '15px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '14px 4px',
                }}
                className="hover:opacity-70 transition-opacity"
              >
                See How It Works
                <span style={{ fontSize: '18px', lineHeight: 1 }}>→</span>
              </a>
            </div>
          </div>

          <HeroDashboard />
        </div>

        <div
          ref={statsRef}
          style={{
            marginTop: '56px',
            display: 'flex',
            flexWrap: 'wrap',
            background: '#F1F5F9',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #E2E8F0',
          }}
        >
          {STATS.map((s, i) => (
            <StatItem key={i} stat={s} active={statsActive} isLast={i === STATS.length - 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ToolStackStrip() {
  const tools = ['Clay', 'EmailBison', 'HeyReach', 'RevenueBase', 'Supabase', 'n8n']
  return (
    <section style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', padding: '18px 0' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 600,
            fontSize: '11px',
            color: '#94A3B8',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            Built on:
          </span>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {tools.map(tool => (
              <span key={tool} style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                color: '#475569',
                background: '#fff',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                padding: '5px 12px',
              }}>
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Problem() {
  const problems = [
    {
      icon: '📢',
      title: "You're mailing cold lists, not intent lists",
      body: 'Most outbound teams buy a database and blast it. No buying signals, no timing, no context. Prospects delete your email because there is no reason to read it right now.',
    },
    {
      icon: '📧',
      title: 'Email only gets one shot. LinkedIn reaches a different half.',
      body: 'Single-channel outbound relies on a prospect being in the right inbox at the right moment. Coordinated email and LinkedIn sequences create multiple chances to land in front of the right person.',
    },
    {
      icon: '🎓',
      title: 'Your agency has never carried a quota',
      body: 'The people writing your sequences have never had a sales manager ask them why the pipeline is empty. That gap shows in every subject line they write and every CTA they bury.',
    },
  ]

  return (
    <section style={{ padding: '80px 0', background: '#F8FAFC' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12 observe-fade">
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '12px', color: '#E8A000', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
            The Problem
          </p>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 'clamp(26px, 3.5vw, 36px)', color: '#1E293B', marginBottom: '16px', letterSpacing: '-0.01em' }}>
            Why most outbound fails
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#475569', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
            Three mistakes repeat across every company that tries to build outbound without the right system.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <div
              key={i}
              className="card-hover observe-fade"
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '32px 28px',
                border: '1px solid #E2E8F0',
                borderTop: '3px solid #FF8559',
                '--delay': `${i * 0.1}s`,
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '16px' }}>{p.icon}</div>
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '17px', color: '#1E293B', marginBottom: '10px' }}>
                {p.title}
              </h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TypewriterSection() {
  const [displayed, setDisplayed] = useState('')
  const [cursor, setCursor] = useState(true)
  const sectionRef = useRef(null)
  const started = useRef(false)
  const FULL = 'Command Pipeline turns buying signals into closed pipeline.'

  useEffect(() => {
    const t = setInterval(() => setCursor(c => !c), 530)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        let i = 0
        const t = setInterval(() => {
          setDisplayed(FULL.slice(0, ++i))
          if (i >= FULL.length) clearInterval(t)
        }, 38)
      }
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={sectionRef} style={{ background: '#0D0F14', padding: '120px 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '900px', height: '500px',
        background: 'radial-gradient(ellipse at center, rgba(232,160,0,0.07) 0%, transparent 68%)',
        pointerEvents: 'none',
      }} />
      <div className="max-w-4xl mx-auto px-6" style={{ position: 'relative' }}>
        <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '11px', color: '#E8A000', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '28px' }}>
          The Signal Advantage
        </p>
        <h2 style={{
          fontFamily: 'Montserrat, sans-serif', fontWeight: 800,
          fontSize: 'clamp(24px, 3.6vw, 46px)', color: '#fff',
          letterSpacing: '-0.02em', lineHeight: 1.2, minHeight: '1.4em',
        }}>
          {displayed}
          <span style={{ color: '#E8A000', opacity: cursor ? 1 : 0, transition: 'opacity 0.1s', marginLeft: '3px' }}>|</span>
        </h2>
      </div>
    </section>
  )
}

function PipelineCarousel() {
  const tripled = [...CAROUSEL_ITEMS, ...CAROUSEL_ITEMS, ...CAROUSEL_ITEMS]
  return (
    <div style={{ background: '#0D0F14', paddingTop: '20px', paddingBottom: '80px', overflowX: 'hidden' }}>
      <div className="carousel-track">
        {tripled.map((item, i) => (
          <div
            key={i}
            className="carousel-item"
            style={{
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              marginRight: '20px',
              animation: `waveFloat 2.4s ease-in-out infinite`,
              animationDelay: `${(i % CAROUSEL_ITEMS.length) * 0.24}s`,
            }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <item.Icon size={24} color="rgba(255,255,255,0.65)" strokeWidth={1.5} />
            </div>
            <span style={{
              fontFamily: 'Inter, sans-serif', fontSize: '11px',
              color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap',
              letterSpacing: '0.04em',
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StepCard({ step, index }) {
  return (
    <div className="observe-fade" style={{ position: 'relative', borderRadius: '16px', '--delay': `${index * 0.08}s` }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '16px',
        background: `linear-gradient(135deg, ${step.color}14 0%, transparent 55%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        background: '#F8FAFC',
        border: `1px solid ${step.color}28`,
        borderLeft: `4px solid ${step.color}`,
        borderRadius: '16px',
        padding: '32px 36px',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <div style={{
            width: 52, height: 52, borderRadius: '12px', background: step.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '15px',
            color: '#fff', flexShrink: 0,
          }}>
            {step.num}
          </div>
          <div>
            <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '18px', color: '#1E293B', marginBottom: '10px' }}>
              {step.title}
            </h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#475569', lineHeight: 1.65, maxWidth: '600px' }}>
              {step.body}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: '96px 0', background: '#fff' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 observe-fade">
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '12px', color: '#E8A000', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
            The System
          </p>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 'clamp(26px, 3.5vw, 36px)', color: '#1E293B', marginBottom: '16px', letterSpacing: '-0.01em' }}>
            How Command Pipeline Works
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#475569', maxWidth: '540px', margin: '0 auto', lineHeight: 1.6 }}>
            Five layers from raw signal to closed pipeline. Each stage feeds the next.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '72px', alignItems: 'flex-start' }}>
          <div className="hidden md:block" style={{ flex: '0 0 260px', position: 'sticky', top: '120px' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#475569', lineHeight: 1.7, marginBottom: '32px' }}>
              Signal in, pipeline out. Each stage feeds the next.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {STEPS.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#94A3B8' }}>{s.title}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {STEPS.map((step, i) => <StepCard key={i} step={step} index={i} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

function WorkflowSplit() {
  const weHandle = [
    'Signal detection: funding rounds, hiring spikes, conference attendance, competitor customers',
    'Lead sourcing across RevenueBase, Clay, and Apollo',
    'ICP grading: every contact graded A/B/C/D across 20+ data points',
    'Email infrastructure: 75+ warmed domains with active monitoring',
    'Sequence writing: email (3-touch, 3 variants) and LinkedIn (connection + 2 DMs)',
    'Campaign launch, monitoring, and deliverability management',
    'AI reply triage: every interested reply flagged in Slack within 5 minutes',
    'Cross-channel DNC coordination across email and LinkedIn',
    'Full CRM sync: every touchpoint logged automatically',
    'Weekly reporting: PRR, campaign tier, what to scale and what to kill',
  ]

  return (
    <section style={{ background: '#1C1C24', padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px', height: '600px',
        background: 'radial-gradient(ellipse at center, rgba(232,160,0,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div className="max-w-6xl mx-auto px-6" style={{ position: 'relative' }}>
        <div className="text-center mb-16 observe-fade">
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '12px', color: '#E8A000', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Division of Labor
          </p>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 'clamp(26px, 3.5vw, 36px)', color: '#fff', marginBottom: '16px', letterSpacing: '-0.01em' }}>
            You focus on closing. We handle everything else.
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          {/* We handle */}
          <div
            className="observe-fade"
            style={{
              flex: '1 1 420px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderTop: '3px solid #E8A000',
              borderRadius: '16px',
              padding: '36px',
            }}
          >
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '13px', color: '#E8A000', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '24px' }}>
              We Take Care Of
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {weHandle.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ flexShrink: 0, marginTop: '3px' }}>
                    <Check size={15} color="#4ADE80" strokeWidth={2.5} />
                  </div>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#94A3B8', lineHeight: 1.55 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* You do */}
          <div
            className="observe-fade"
            style={{
              flex: '1 1 240px',
              background: 'rgba(255,133,89,0.06)',
              border: '1px solid rgba(255,133,89,0.15)',
              borderTop: '3px solid #FF8559',
              borderRadius: '16px',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              '--delay': '0.1s',
            }}
          >
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '13px', color: '#FF8559', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '32px' }}>
              All You Need To Do
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {[
                { num: '01', text: 'Join a 30-minute weekly call to review performance and steer priorities.' },
                { num: '02', text: 'Close the meetings we book.' },
              ].map(({ num, text }) => (
                <div key={num} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <span style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '22px',
                    color: '#FF8559', opacity: 0.5, lineHeight: 1, flexShrink: 0,
                  }}>
                    {num}
                  </span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#fff', lineHeight: 1.55 }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function WhatIsIncluded() {
  return (
    <section style={{ padding: '96px 0', background: '#fff' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 observe-fade">
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '12px', color: '#E8A000', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
            The Full Scope
          </p>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 'clamp(26px, 3.5vw, 36px)', color: '#1E293B', marginBottom: '16px', letterSpacing: '-0.01em' }}>
            Everything in the system.
            <br />
            Nothing you have to build yourself.
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#475569', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
            One flat fee. Every deliverable below is included. Nothing is an upsell.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {INCLUDED_ITEMS.map((item, i) => (
            <div
              key={i}
              className="observe-fade"
              style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '24px',
                '--delay': `${(i % 4) * 0.07}s`,
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: '8px', background: 'rgba(232,160,0,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Check size={16} color="#E8A000" strokeWidth={2.5} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '15px', color: '#1E293B', marginBottom: '6px' }}>
                  {item.title}
                </h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhyUs() {
  return (
    <section id="why-us" style={{ padding: '96px 0', background: '#1C1C24', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '1000px', height: '700px',
        background: 'radial-gradient(ellipse 55% 55% at center, rgba(232,160,0,0.16) 0%, rgba(232,160,0,0.06) 35%, transparent 68%)',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(ellipse at center, rgba(251,191,36,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(ellipse at center, rgba(255,133,89,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="max-w-6xl mx-auto px-6" style={{ position: 'relative' }}>
        <div className="text-center mb-16 observe-fade">
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '12px', color: '#E8A000', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Why Command Pipeline
          </p>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 'clamp(26px, 3.5vw, 36px)', color: '#fff', marginBottom: '16px', letterSpacing: '-0.01em' }}>
            Not an agency. An outbound system.
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#94A3B8', maxWidth: '540px', margin: '0 auto', lineHeight: 1.6 }}>
            Other agencies sell campaigns. Platforms sell features. We build complete outbound systems that learn, adapt, and compound over time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {DIFFERENTIATORS.map((d, i) => (
            <div
              key={i}
              className="card-hover-dark observe-fade"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '32px 28px',
                borderTop: '3px solid #E8A000',
                '--delay': `${i * 0.1}s`,
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '16px' }}>{d.icon}</div>
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '18px', color: '#fff', marginBottom: '10px' }}>
                {d.title}
              </h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#94A3B8', lineHeight: 1.65 }}>
                {d.body}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '56px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
          {['Operator-built, not vendor-sold', '5-layer technical architecture', 'AI reply agents on every account', 'CRM sync on every outreach event', 'Multi-channel by default', 'Weekly performance reporting'].map((label, i) => (
            <span
              key={i}
              className="observe-fade"
              style={{
                background: 'rgba(232,160,0,0.1)',
                border: '1px solid rgba(232,160,0,0.2)',
                borderRadius: '100px',
                padding: '6px 16px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                fontWeight: 500,
                color: '#E8A000',
                letterSpacing: '0.02em',
                '--delay': `${i * 0.06}s`,
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function Results() {
  return (
    <section id="results" style={{ padding: '96px 0', background: '#fff' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 observe-fade">
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '12px', color: '#E8A000', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Performance Benchmarks
          </p>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 'clamp(26px, 3.5vw, 36px)', color: '#1E293B', marginBottom: '16px', letterSpacing: '-0.01em' }}>
            The numbers we hold ourselves to
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#475569', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
            These are minimums, not projections. Derived from 500+ campaigns across 2M+ emails sent. We measure Positive Reply Rate: interested replies divided by total replies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="card-hover observe-fade" style={{ background: '#F1F5F9', borderRadius: '16px', padding: '40px 36px', borderTop: '4px solid #E8A000' }}>
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '12px', color: '#E8A000', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Email Channel
            </p>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '64px', color: '#E8A000', lineHeight: 1, marginBottom: '8px' }}>
              ≥25%
            </div>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '16px', color: '#1E293B', marginBottom: '6px' }}>
              Positive Reply Rate
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#94A3B8', marginBottom: '16px' }}>
              Industry average: ~5% · Our floor is their ceiling.
            </p>
            <div style={{ background: '#E2E8F0', borderRadius: '8px', padding: '12px 16px' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#475569' }}>
                Also: ≤5% bounce rate · ≤1,000 emails per positive reply
              </p>
            </div>
          </div>

          <div className="card-hover observe-fade" style={{ background: '#F1F5F9', borderRadius: '16px', padding: '40px 36px', borderTop: '4px solid #FBBF24', '--delay': '0.1s' }}>
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '12px', color: '#FBBF24', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
              LinkedIn Channel
            </p>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '64px', color: '#FBBF24', lineHeight: 1, marginBottom: '8px' }}>
              ≥40%
            </div>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '16px', color: '#1E293B', marginBottom: '6px' }}>
              Positive Reply Rate
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#94A3B8', marginBottom: '16px' }}>
              Industry average: ~10% · 25%+ connection acceptance.
            </p>
            <div style={{ background: '#E2E8F0', borderRadius: '8px', padding: '12px 16px' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#475569' }}>
                Also: &gt;25% connection acceptance · &lt;12 messages per positive reply
              </p>
            </div>
          </div>
        </div>

        <div className="observe-fade" style={{
          background: '#1C1C24',
          borderRadius: '12px',
          padding: '36px 40px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ maxWidth: '560px' }}>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '18px', color: '#fff', marginBottom: '10px', lineHeight: 1.4 }}>
              Command Pipeline replaces 2-3 full-time SDRs.
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#94A3B8', lineHeight: 1.7 }}>
              $180-240K per SDR salary · $120K sales manager · $30-50K tools (Sales Nav, Apollo, Clay, Outreach)
              <span style={{ color: '#475569', display: 'block', marginTop: '6px' }}>That is $480K+ per year to reach the same output. Command Pipeline: flat monthly fee, zero headcount risk, no 6-month ramp.</span>
            </p>
          </div>
          <a
            href="#cta"
            style={{
              backgroundColor: '#FF8559',
              color: '#fff',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              padding: '14px 28px',
              borderRadius: '8px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
            className="hover:opacity-90 transition-opacity"
          >
            Get a Pricing Breakdown
          </a>
        </div>
      </div>
    </section>
  )
}

function ComparisonTable() {
  function renderCell(val, isCP) {
    if (val === true) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Check size={18} color="#4ADE80" strokeWidth={2.5} />
        </div>
      )
    }
    if (val === false) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <X size={18} color={isCP ? '#FF8559' : '#94A3B8'} strokeWidth={2} />
        </div>
      )
    }
    return (
      <span style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        color: isCP ? '#E8A000' : '#94A3B8',
        fontWeight: isCP ? 600 : 400,
        textAlign: 'center',
        display: 'block',
      }}>
        {val}
      </span>
    )
  }

  return (
    <section style={{ padding: '96px 0', background: '#F8FAFC' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 observe-fade">
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '12px', color: '#E8A000', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
            The Honest Comparison
          </p>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 'clamp(26px, 3.5vw, 36px)', color: '#1E293B', marginBottom: '16px', letterSpacing: '-0.01em' }}>
            Command Pipeline vs. The Alternatives
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#475569', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
            Three ways to build outbound. One that gets you there in 30 days.
          </p>
        </div>

        <div className="observe-fade" style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: '640px', background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0' }} />
              <div style={{ padding: '20px 16px', background: 'rgba(232,160,0,0.06)', borderBottom: '2px solid #E8A000', textAlign: 'center' }}>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '14px', color: '#E8A000' }}>Command Pipeline</p>
              </div>
              <div style={{ padding: '20px 16px', borderBottom: '1px solid #E2E8F0', textAlign: 'center' }}>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '13px', color: '#475569' }}>In-House SDR Team</p>
              </div>
              <div style={{ padding: '20px 16px', borderBottom: '1px solid #E2E8F0', textAlign: 'center' }}>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '13px', color: '#475569' }}>Other Agencies</p>
              </div>
            </div>

            {/* Rows */}
            {COMPARISON_ROWS.map((row, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr',
                  background: i % 2 === 0 ? '#fff' : '#FAFAFA',
                  borderBottom: i < COMPARISON_ROWS.length - 1 ? '1px solid #F1F5F9' : 'none',
                }}
              >
                <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#1E293B', fontWeight: 500 }}>
                    {row.label}
                  </span>
                </div>
                <div style={{ padding: '16px', background: 'rgba(232,160,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {renderCell(row.cp, true)}
                </div>
                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {renderCell(row.inhouse, false)}
                </div>
                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {renderCell(row.other, false)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ClientJourney() {
  return (
    <section style={{ padding: '96px 0', background: '#fff' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 observe-fade">
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '12px', color: '#E8A000', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
            What Happens Next
          </p>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 'clamp(26px, 3.5vw, 36px)', color: '#1E293B', marginBottom: '16px', letterSpacing: '-0.01em' }}>
            Here is what the first 60 days look like
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#475569', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
            From discovery call to first interested replies. No black boxes.
          </p>
        </div>

        <div style={{ position: 'relative' }}>
          {/* Vertical timeline line */}
          <div className="hidden md:block" style={{
            position: 'absolute',
            left: '119px',
            top: '24px',
            bottom: '24px',
            width: '2px',
            background: 'linear-gradient(180deg, #E8A000 0%, #FBBF24 50%, #E8A000 100%)',
            opacity: 0.25,
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {JOURNEY_STEPS.map((step, i) => (
              <div
                key={i}
                className="observe-fade"
                style={{
                  display: 'flex',
                  gap: '28px',
                  alignItems: 'flex-start',
                  '--delay': `${i * 0.1}s`,
                }}
              >
                {/* Phase label + dot */}
                <div className="hidden md:flex" style={{ flexDirection: 'column', alignItems: 'center', width: '100px', flexShrink: 0, paddingTop: '20px' }}>
                  <span style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 700,
                    fontSize: '11px',
                    color: step.color,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    lineHeight: 1.3,
                    marginBottom: '8px',
                  }}>
                    {step.phase}
                  </span>
                  <div style={{
                    width: 14, height: 14, borderRadius: '50%',
                    background: step.color,
                    border: `2px solid ${step.color}`,
                    boxShadow: `0 0 0 4px ${step.color}20`,
                    flexShrink: 0,
                  }} />
                </div>

                {/* Card */}
                <div style={{
                  flex: 1,
                  background: '#F8FAFC',
                  border: `1px solid ${step.color}25`,
                  borderLeft: `4px solid ${step.color}`,
                  borderRadius: '12px',
                  padding: '28px 32px',
                }}>
                  {/* Mobile phase label */}
                  <span className="md:hidden" style={{
                    display: 'inline-block',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 700,
                    fontSize: '11px',
                    color: step.color,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}>
                    {step.phase}
                  </span>
                  <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '18px', color: '#1E293B', marginBottom: '10px' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#475569', lineHeight: 1.65 }}>
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section id="testimonials" style={{ padding: '96px 0', background: '#1C1C24', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '900px', height: '600px',
        background: 'radial-gradient(ellipse at center, rgba(232,160,0,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div className="max-w-6xl mx-auto px-6" style={{ position: 'relative' }}>
        <div className="text-center mb-16 observe-fade">
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '12px', color: '#E8A000', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Client Results
          </p>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 'clamp(26px, 3.5vw, 36px)', color: '#fff', marginBottom: '16px', letterSpacing: '-0.01em' }}>
            What our clients say
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#94A3B8', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            Every quote is real. Every number is verified.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="card-hover-dark observe-fade"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                '--delay': `${i * 0.1}s`,
              }}
            >
              {/* Stars */}
              <div style={{ color: '#E8A000', fontSize: '16px', letterSpacing: '2px', marginBottom: '20px' }}>
                ★★★★★
              </div>

              {/* Quote */}
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '15px',
                color: '#CBD5E1',
                lineHeight: 1.7,
                fontStyle: 'italic',
                flex: 1,
                marginBottom: '24px',
              }}>
                "{t.quote}"
              </p>

              {/* Attribution */}
              <div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px', marginBottom: '14px' }}>
                  <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '14px', color: '#fff', marginBottom: '3px' }}>
                    {t.name}
                  </p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#64748B' }}>
                    {t.title} · {t.company}
                  </p>
                </div>

                {/* Result badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(232,160,0,0.1)',
                  border: '1px solid rgba(232,160,0,0.2)',
                  borderRadius: '100px',
                  padding: '4px 12px',
                }}>
                  <Check size={12} color="#E8A000" strokeWidth={2.5} />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#E8A000', fontWeight: 600 }}>
                    {t.result}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhoItsFor() {
  return (
    <section id="who" style={{ padding: '96px 0', background: '#F8FAFC' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 observe-fade">
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '12px', color: '#E8A000', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Ideal Customer Profile
          </p>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 'clamp(26px, 3.5vw, 36px)', color: '#1E293B', marginBottom: '16px', letterSpacing: '-0.01em' }}>
            Built for companies that need pipeline now
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#475569', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
            Validated against 579 interested replies across 20+ campaigns. We know exactly who we help and who we cannot.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {ICP_SEGMENTS.map((seg, i) => (
            <div
              key={i}
              className="card-hover observe-fade"
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '32px 28px',
                border: '1px solid #E2E8F0',
                borderTop: `4px solid ${seg.color}`,
                '--delay': `${i * 0.1}s`,
              }}
            >
              <span style={{
                display: 'inline-block',
                background: `${seg.color}18`,
                color: seg.color,
                borderRadius: '100px',
                padding: '3px 10px',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: '11px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '14px',
              }}>
                {seg.tag}
              </span>
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '20px', color: '#1E293B', marginBottom: '16px' }}>
                {seg.title}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {seg.points.map((pt, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: seg.color, flexShrink: 0, marginTop: '7px' }} />
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
                      {pt}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="observe-fade" style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px 32px' }}>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '13px', color: '#94A3B8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Not a fit if you are:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {[
              'Enterprise (>100 employees)',
              'Pre-revenue / pre-seed',
              'Post-Series C with internal RevOps',
              'B2C company',
              'Already have 5+ SDRs',
            ].map((l, i) => (
              <span
                key={i}
                style={{
                  background: '#FFF1EE',
                  color: '#FF8559',
                  border: '1px solid rgba(255,133,89,0.2)',
                  borderRadius: '6px',
                  padding: '5px 12px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const [openIdx, setOpenIdx] = useState(null)

  return (
    <section style={{ padding: '96px 0', background: '#fff' }}>
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16 observe-fade">
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '12px', color: '#E8A000', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
            FAQ
          </p>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 'clamp(26px, 3.5vw, 36px)', color: '#1E293B', marginBottom: '16px', letterSpacing: '-0.01em' }}>
            Common questions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="observe-fade"
              style={{
                borderBottom: '1px solid #E2E8F0',
                '--delay': `${i * 0.04}s`,
              }}
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  padding: '22px 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 600,
                  fontSize: '16px',
                  color: '#1E293B',
                  lineHeight: 1.4,
                }}>
                  {item.q}
                </span>
                <ChevronDown
                  size={20}
                  color="#94A3B8"
                  style={{
                    flexShrink: 0,
                    transform: openIdx === i ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>

              {openIdx === i && (
                <div style={{ paddingBottom: '22px' }}>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '15px',
                    color: '#475569',
                    lineHeight: 1.7,
                  }}>
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section id="cta" style={{
      padding: '96px 0',
      background: '#fff',
      backgroundImage: 'radial-gradient(circle, rgba(30,41,59,0.07) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    }}>
      <div className="max-w-6xl mx-auto px-6">
        <div
          className="observe-fade"
          style={{
            background: '#1C1C24',
            borderRadius: '20px',
            padding: 'clamp(40px, 6vw, 72px)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #E8A000, #FBBF24)' }} />
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '700px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,160,0,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,160,0,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '12px', color: '#E8A000', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '20px', position: 'relative' }}>
            Get Started
          </p>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', color: '#fff', marginBottom: '16px', letterSpacing: '-0.02em', lineHeight: 1.15, position: 'relative' }}>
            Ready to Command
            <br />
            Your Pipeline?
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '17px', color: '#94A3B8', maxWidth: '500px', margin: '0 auto 12px', lineHeight: 1.6, position: 'relative' }}>
            We spend 30 minutes auditing your current outbound motion: your ICP, your copy, your infrastructure, and your channel mix. You leave with a clear read on where the opportunity is.
          </p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#64748B', maxWidth: '400px', margin: '0 auto 36px', lineHeight: 1.6, position: 'relative' }}>
            If there is no clear opportunity, we will tell you that too. No pitch until there is something real to pitch.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', position: 'relative' }}>
            <a
              href="mailto:hello@commandpipeline.com"
              style={{
                display: 'inline-block',
                backgroundColor: '#FF8559',
                color: '#fff',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                padding: '16px 36px',
                borderRadius: '10px',
                textDecoration: 'none',
                letterSpacing: '0.02em',
              }}
              className="hover:opacity-90 transition-opacity"
            >
              Get a Free Outbound Audit
            </a>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#475569' }}>
              30 minutes · No commitment · Honest assessment
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ background: '#1C1C24', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '48px 0 32px' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
          <div>
            <a href="#" className="flex items-center gap-3 mb-4">
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '6px 12px', display: 'inline-block' }}>
                <img src="/cp-logo-full.png" alt="Command Pipeline" style={{ height: '28px', width: 'auto', display: 'block' }} />
              </div>
            </a>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#94A3B8', lineHeight: 1.6, maxWidth: '280px' }}>
              Command your pipeline. Command your revenue.
            </p>
          </div>

          <div className="flex flex-wrap gap-8">
            <div>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '12px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                Company
              </p>
              {NAV_LINKS.map(l => (
                <a
                  key={l.href}
                  href={l.href}
                  style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#94A3B8', textDecoration: 'none', marginBottom: '8px' }}
                  className="hover:text-white transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#475569' }}>
            © 2026 Command Pipeline. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#475569' }}>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  useEffect(() => {
    const els = document.querySelectorAll('.observe-fade')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
          } else {
            e.target.classList.remove('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Navbar />
      {/* 40px announcement bar + 64px nav = 104px total fixed header */}
      <main style={{ paddingTop: '104px' }}>
        <Hero />
        <ToolStackStrip />
        <Problem />
        <TypewriterSection />
        <PipelineCarousel />
        <HowItWorks />
        <WorkflowSplit />
        <WhatIsIncluded />
        <WhyUs />
        <Results />
        <ComparisonTable />
        <ClientJourney />
        <Testimonials />
        <WhoItsFor />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
