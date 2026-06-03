import { useState, useEffect, useRef } from 'react'
import { Antenna, Target, Mail, UserPlus, Bot, TrendingUp, RefreshCw, ShieldCheck, Share2, Award } from 'lucide-react'

const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Results', href: '#results' },
  { label: "Who It's For", href: '#who' },
]

const STEPS = [
  {
    num: '01',
    title: 'Signal Intelligence',
    body: 'We scan for real-time buying signals — funding rounds, leadership hires, tech stack changes, and job postings. Your list is built on intent, not guesswork.',
    color: '#E8A000',
  },
  {
    num: '02',
    title: 'Precision Targeting',
    body: 'RevenueBase + Clay enrichment grades every company and person A/B/C/D. Only top-tier leads enter your pipeline. No spray, no pray.',
    color: '#FBBF24',
  },
  {
    num: '03',
    title: 'Multi-Channel Sequences',
    body: 'Coordinated 3-touch email sequences run in parallel with LinkedIn connection requests and messages — timed, not blasted.',
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
    body: 'Full CRM sync — every email sent, LinkedIn view, and connection request logged on your contact timeline. Direct and influence attribution tracked.',
    color: '#FBBF24',
  },
]

const DIFFERENTIATORS = [
  {
    icon: '⚙️',
    title: 'Operator-Built',
    body: 'Founded by operators who ran outbound at $0–$70M+ ARR. We know the work because we do the work — not consultants guessing at GTM.',
  },
  {
    icon: '🏗️',
    title: 'System-as-Product',
    body: 'Five-layer technical architecture: data → execution → ops → intelligence → automation. The system compounds over time — each campaign makes the next one sharper.',
  },
  {
    icon: '📡',
    title: 'Multi-Channel by Default',
    body: 'Email and LinkedIn run in coordinated sequences, not silos. Cross-channel coordination means no lead gets double-messaged and no signal gets missed.',
  },
  {
    icon: '🤖',
    title: 'AI Where It Matters',
    body: 'AI reply agents, automated categorization, intelligent routing. Human judgment on strategy and QA. Automation on every repetitive touchpoint.',
  },
]

const STATS = [
  { num: 25, prefix: '≥', suffix: '%', label: 'Email Positive Reply Rate', sub: 'industry average: ~5%' },
  { num: 40, prefix: '≥', suffix: '%', label: 'LinkedIn Positive Reply Rate', sub: 'industry average: ~10%' },
  { num: 240, prefix: '', suffix: 'K+', label: 'Active Leads in System', sub: 'across all client campaigns' },
  { num: 12, prefix: '', suffix: '+', label: 'Active Client Campaigns', sub: 'running in parallel' },
]

const FEED_ITEMS = [
  {
    type: 'reply',
    name: 'Sarah Chen',
    role: 'VP Sales · Zendesk',
    msg: '"Interested — can we set up a call this week?"',
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
      '15–100 employees',
      '$500K–$20M ARR',
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
      '15–75 employees',
      '$1M–$20M ARR',
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
      '1 VC = 15–50 portfolio company intros',
      'Relationship-first, not cold volume',
    ],
  },
]

// --- Hooks ---

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

// --- Components ---

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav
      style={{ borderBottom: '1px solid #E2E8F0' }}
      className="fixed top-0 left-0 right-0 z-50 bg-white"
    >
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
  )
}

function HeroDashboard() {
  return (
    <div
      className="hidden lg:block"
      style={{ flexShrink: 0, width: '370px', position: 'relative' }}
    >
      {/* Ambient glow behind card */}
      <div style={{
        position: 'absolute',
        inset: '-80px',
        background: 'radial-gradient(ellipse at center, rgba(232,160,0,0.12) 0%, transparent 68%)',
        pointerEvents: 'none',
      }} />

      <div
        style={{
          background: '#1C1C24',
          borderRadius: '16px',
          border: '1px solid rgba(232,160,0,0.2)',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(232,160,0,0.06)',
          animation: 'floatCard 5s ease-in-out infinite',
        }}
      >
        {/* Top gradient bar */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #E8A000, #FBBF24, rgba(251,191,36,0))' }} />

        {/* Header */}
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
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#4ADE80',
              display: 'inline-block',
              animation: 'pulseDot 2s ease-in-out infinite',
            }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#4ADE80', fontWeight: 600, letterSpacing: '0.08em' }}>
              LIVE
            </span>
          </span>
        </div>

        {/* Feed items */}
        {FEED_ITEMS.map((item, i) => (
          <div
            key={i}
            style={{
              padding: '14px 18px',
              borderBottom: i < FEED_ITEMS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              animation: `feedSlide 0.45s ease ${i * 0.12}s both`,
            }}
          >
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

        {/* Footer mini-stats */}
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
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '15px', color: '#FBBF24' }}>12+</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#64748B', marginLeft: '5px' }}>Campaigns</span>
          </div>
          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ flex: 1, paddingLeft: '14px' }}>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '15px', color: '#FF8559' }}>240K</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#64748B', marginLeft: '5px' }}>Leads</span>
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
          nx: Math.random(),
          ny: Math.random(),
          type,
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
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  )
}

function StatItem({ stat, active, isLast }) {
  const count = useCounter(stat.num, active)
  return (
    <div
      style={{
        flex: '1 1 180px',
        padding: '24px 32px',
        borderRight: isLast ? 'none' : '1px solid #E2E8F0',
      }}
    >
      <div style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 700,
        fontSize: '32px',
        color: '#E8A000',
        lineHeight: 1,
        marginBottom: '6px',
      }}>
        {stat.prefix}{count}{stat.suffix}
      </div>
      <div style={{
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 600,
        fontSize: '13px',
        color: '#1E293B',
        marginBottom: '3px',
      }}>
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
    <section
      style={{ paddingTop: '7rem', paddingBottom: '5rem', background: '#fff', overflow: 'hidden', position: 'relative' }}
    >
      {/* Top amber accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#E8A000' }} />

      {/* Dot grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(232,160,0,0.13) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        pointerEvents: 'none',
        maskImage: 'radial-gradient(ellipse 90% 90% at 50% 0%, black 30%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 0%, black 30%, transparent 100%)',
      }} />

      {/* Mouse-parallax particle field */}
      <ParticleBackground />

      <div className="max-w-6xl mx-auto px-6" style={{ position: 'relative', zIndex: 1 }}>
        {/* Two-column layout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '52px' }}>

          {/* Left: copy */}
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
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E8A000', display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 500, color: '#E8A000', letterSpacing: '0.02em' }}>
                Command your pipeline. Command your revenue.
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
              Outbound That Converts.
              <br />
              <span style={{ color: '#E8A000' }}>Built on Signal.</span>
              <br />
              Not Volume.
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
              Command Pipeline is an operator-built B2B demand generation agency. We run
              coordinated email + LinkedIn campaigns that turn real-time market signals
              into predictable pipeline — at a fraction of the cost of an in-house SDR team.
            </p>

            <div
              className="flex flex-wrap gap-4 items-center observe-fade"
              style={{ '--delay': '0.3s' }}
            >
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
                Book a Strategy Session
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

          {/* Right: live dashboard widget */}
          <HeroDashboard />
        </div>

        {/* Animated stats bar */}
        <div
          ref={statsRef}
          style={{
            marginTop: '56px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0',
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

function Problem() {
  const problems = [
    {
      icon: '📢',
      title: 'No signal intelligence',
      body: 'Most teams spray the same message to everyone. No buying intent. No timing. No reason to reply.',
    },
    {
      icon: '📧',
      title: 'Single-channel thinking',
      body: 'Email-only or LinkedIn-only misses the coordination effect. Prospects see you once and move on.',
    },
    {
      icon: '🎓',
      title: 'Built by marketers, not operators',
      body: 'Agencies that have never carried a quota are designing your outbound motion. The output shows.',
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
            Most outbound fails for 3 reasons
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#475569', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
            The same three mistakes repeat across every company that tries to build outbound in-house.
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

const CAROUSEL_ITEMS = [
  { Icon: Antenna, label: 'Signal Intelligence' },
  { Icon: Target, label: 'ICP Grading' },
  { Icon: Mail, label: 'Email Sequences' },
  { Icon: UserPlus, label: 'LinkedIn Outreach' },
  { Icon: Bot, label: 'AI Reply Agents' },
  { Icon: TrendingUp, label: 'Pipeline Attribution' },
  { Icon: RefreshCw, label: 'CRM Sync' },
  { Icon: ShieldCheck, label: 'DNC Compliance' },
  { Icon: Share2, label: 'Multi-Channel' },
  { Icon: Award, label: 'Lead Grading' },
]

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
          {/* Sticky left panel */}
          <div className="hidden md:block" style={{ flex: '0 0 260px', position: 'sticky', top: '120px' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#475569', lineHeight: 1.7, marginBottom: '32px' }}>
              Each stage feeds the next — signal in, pipeline out.
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

          {/* Scrolling cards */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {STEPS.map((step, i) => <StepCard key={i} step={step} index={i} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

function WhyUs() {
  return (
    <section id="why-us" style={{ padding: '96px 0', background: '#1C1C24', position: 'relative', overflow: 'hidden' }}>
      {/* Large central spotlight orb */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '1000px', height: '700px',
        background: 'radial-gradient(ellipse 55% 55% at center, rgba(232,160,0,0.16) 0%, rgba(232,160,0,0.06) 35%, transparent 68%)',
        pointerEvents: 'none',
      }} />
      {/* Edge accent glows */}
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-5%',
        width: '500px', height: '500px',
        background: 'radial-gradient(ellipse at center, rgba(251,191,36,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '-10%', left: '-5%',
        width: '400px', height: '400px',
        background: 'radial-gradient(ellipse at center, rgba(255,133,89,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="max-w-6xl mx-auto px-6" style={{ position: 'relative' }}>
        <div className="text-center mb-16 observe-fade">
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '12px', color: '#E8A000', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Why Command Pipeline
          </p>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 'clamp(26px, 3.5vw, 36px)', color: '#fff', marginBottom: '16px', letterSpacing: '-0.01em' }}>
            Not an agency. An outbound system.
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#94A3B8', maxWidth: '540px', margin: '0 auto', lineHeight: 1.6 }}>
            While other agencies sell campaigns and platforms sell features, we build
            complete outbound systems that learn, adapt, and compound over time.
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

        <div style={{ marginTop: '56px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', alignItems: 'center' }}>
          {[
            'Operator-built, not vendor-sold',
            '5-layer technical architecture',
            'AI reply agents on every account',
            'CRM sync on every outreach event',
            'Multi-channel by default',
            'Weekly performance reporting',
          ].map((label, i) => (
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
            These are our minimum standards, not marketing claims. We measure Positive Reply Rate — interested replies divided by total replies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div
            className="card-hover observe-fade"
            style={{ background: '#F1F5F9', borderRadius: '16px', padding: '40px 36px', borderTop: '4px solid #E8A000' }}
          >
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '12px', color: '#E8A000', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Email Channel
            </p>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '64px', color: '#E8A000', lineHeight: 1, marginBottom: '8px' }}>
              ≥25%
            </div>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '16px', color: '#1E293B', marginBottom: '6px' }}>
              Positive Reply Rate
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#94A3B8' }}>
              ≤5% bounce rate · ≤1,000 emails per positive reply
            </p>
          </div>

          <div
            className="card-hover observe-fade"
            style={{ background: '#F1F5F9', borderRadius: '16px', padding: '40px 36px', borderTop: '4px solid #FBBF24', '--delay': '0.1s' }}
          >
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '12px', color: '#FBBF24', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
              LinkedIn Channel
            </p>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '64px', color: '#FBBF24', lineHeight: 1, marginBottom: '8px' }}>
              ≥40%
            </div>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '16px', color: '#1E293B', marginBottom: '6px' }}>
              Positive Reply Rate
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#94A3B8' }}>
              &gt;25% connection acceptance · &lt;12 messages per positive reply
            </p>
          </div>
        </div>

        <div
          className="observe-fade"
          style={{
            background: '#1C1C24',
            borderRadius: '12px',
            padding: '28px 32px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '16px', color: '#fff', maxWidth: '400px', lineHeight: 1.5 }}>
            Replaces 2–3 SDRs at a fraction of the fully-loaded cost
            <span style={{ color: '#94A3B8', fontWeight: 400, display: 'block', fontSize: '14px', marginTop: '4px' }}>
              $180–240K SDRs + $120K manager + $30–50K tools vs. a flat monthly fee
            </span>
          </p>
          <a
            href="#cta"
            style={{
              backgroundColor: '#FF8559',
              color: '#fff',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              padding: '12px 24px',
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
            Validated against 579 interested replies across 20+ campaigns. We know exactly who we help.
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

        <div
          className="observe-fade"
          style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px 32px' }}
        >
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
          {/* Gradient top bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #E8A000, #FBBF24)' }} />

          {/* Central ambient glow */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '700px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,160,0,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Corner accent glows */}
          <div style={{
            position: 'absolute', top: '-60px', right: '-60px',
            width: '220px', height: '220px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(251,191,36,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '-60px', left: '-60px',
            width: '220px', height: '220px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,160,0,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '12px', color: '#E8A000', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '20px', position: 'relative' }}>
            Get Started
          </p>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', color: '#fff', marginBottom: '16px', letterSpacing: '-0.02em', lineHeight: 1.15, position: 'relative' }}>
            Ready to Command
            <br />
            Your Pipeline?
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '17px', color: '#94A3B8', maxWidth: '480px', margin: '0 auto 36px', lineHeight: 1.6, position: 'relative' }}>
            Book an outbound strategy session. We'll audit your current motion,
            identify the gaps, and show you what a signal-first pipeline looks like for your ICP.
          </p>
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
              position: 'relative',
            }}
            className="hover:opacity-90 transition-opacity"
          >
            Book an Outbound Strategy Session
          </a>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#475569', marginTop: '16px' }}>
            No commitment. 30-minute call. We'll tell you honestly if we're a fit.
          </p>
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
      <main style={{ paddingTop: '64px' }}>
        <Hero />
        <Problem />
        <TypewriterSection />
        <PipelineCarousel />
        <HowItWorks />
        <WhyUs />
        <Results />
        <WhoItsFor />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
