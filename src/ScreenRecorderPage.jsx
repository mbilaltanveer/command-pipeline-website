import { useEffect, useState } from 'react'
import {
  Download, MonitorPlay, Eye, HardDrive, RotateCcw, Laptop, Lock, ArrowRight, Check, Apple,
} from 'lucide-react'
import { Navbar, Footer } from './App.jsx'
import { RECORDER, detectPlatform } from './recorderRelease.js'

// ─── Data ────────────────────────────────────────────────────────────────────

// Set to the public GitHub repo once it's live to show a "View source" link.
const GITHUB_URL = null

const PLATFORMS = {
  mac: {
    ...RECORDER.mac,
    title: 'Mac',
    steps: [
      'Open the downloaded Recorder file. A window appears: drag Recorder onto Applications.',
      'Open Recorder from Launchpad or your Applications folder. (Opened straight from the download window, it offers to move itself into Applications.)',
      'First time only: if macOS says it can\'t verify Recorder, go to System Settings → Privacy & Security, scroll down and click Open Anyway.',
    ],
  },
  windows: {
    ...RECORDER.windows,
    title: 'Windows',
    steps: [
      'Unzip the downloaded file (right-click → Extract All).',
      'Double-click "Start Recorder (Windows)" inside the folder.',
      'First time only: if Windows shows "Windows protected your PC", click More info → Run anyway.',
    ],
  },
}

const AFTER_STEPS = [
  { title: 'Allow camera, mic and screen', body: 'Click Allow when asked. On a Mac, also turn on your browser in System Settings → Privacy & Security → Screen & System Audio Recording.' },
  { title: 'Hit record', body: 'Pick your screen, a window or a tab. Stop when you are done. The MP4 is saved straight to your computer.' },
]

const FEATURES = [
  { Icon: MonitorPlay, title: 'Screen + camera bubble', body: 'Your face in a round bubble in any corner, like Loom. Or record just the screen, or just the camera.' },
  { Icon: Eye, title: 'Live preview', body: 'See exactly what is being recorded while you record. Pause and resume any time.' },
  { Icon: HardDrive, title: 'Saves MP4s to your computer', body: 'Standard MP4 video in 720p, 1080p or 1440p, saved to a folder you choose or your Downloads.' },
  { Icon: RotateCcw, title: 'Crash-safe', body: 'If the window closes mid-recording, it offers to save what was recorded next time you open it.' },
  { Icon: Laptop, title: 'Mac & Windows', body: 'A Mac app and a Windows download. Recorder runs in its own window using Google Chrome or Microsoft Edge.' },
  { Icon: Lock, title: 'Private and free', body: 'No sign-up, no watermark, no time limit. Your videos never leave your computer.' },
]

const FAQ = [
  { q: 'Is it really free?', a: 'Yes. Free for personal and business use, with no limits. It is open source under the MIT license.' },
  { q: 'What do I need?', a: 'A Mac or Windows computer with Google Chrome or Microsoft Edge. Edge comes with every Windows PC, and the Mac app offers to get Chrome if you have neither.' },
  { q: 'Where do my videos go?', a: 'Into a folder you choose, or your Downloads folder. The recorder also lists them so you can play them back.' },
  { q: 'Why does my computer warn me the first time?', a: 'Because the app isn\'t signed with a paid Apple or Microsoft developer certificate. You approve it once and it won\'t ask again.' },
]

// ─── Pieces ──────────────────────────────────────────────────────────────────

const eyebrow = { fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '12px', color: '#E8A000', letterSpacing: '0.12em', textTransform: 'uppercase' }
const h2 = { fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 'clamp(26px, 3.4vw, 38px)', letterSpacing: '-0.02em', lineHeight: 1.15 }

function WindowsGlyph({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <rect x="3" y="3" width="8.2" height="8.2" rx="1" /><rect x="12.8" y="3" width="8.2" height="8.2" rx="1" />
      <rect x="3" y="12.8" width="8.2" height="8.2" rx="1" /><rect x="12.8" y="12.8" width="8.2" height="8.2" rx="1" />
    </svg>
  )
}

const PlatformIcon = ({ platform, size }) => (platform === 'mac' ? <Apple size={size} /> : <WindowsGlyph size={size} />)

function DownloadButton({ platform, primary, large = false, onStart }) {
  const p = PLATFORMS[platform]
  return (
    <a
      href={p.file}
      download
      onClick={() => onStart(platform)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '10px',
        backgroundColor: primary ? '#FF8559' : '#fff',
        color: primary ? '#fff' : '#1E293B',
        border: primary ? '1px solid #FF8559' : '1px solid #CBD5E1',
        fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '15px',
        padding: large ? '14px 20px' : '12px 20px', borderRadius: '10px', textDecoration: 'none', letterSpacing: '0.01em',
        boxShadow: primary ? '0 10px 28px rgba(255,133,89,0.28)' : 'none',
        whiteSpace: 'nowrap',
      }}
      className="hover:opacity-90 transition-opacity"
    >
      <PlatformIcon platform={platform} size={large ? 20 : 18} />
      Download for {p.title}
      <Download size={16} style={{ opacity: 0.8 }} />
    </a>
  )
}

function Hero({ order, onStart }) {
  return (
    <section style={{
      padding: 'clamp(48px, 7vw, 88px) 0',
      background: '#fff',
      backgroundImage: 'radial-gradient(circle, rgba(30,41,59,0.07) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    }}>
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <img src="/products/screen-recorder/icon.png" alt="" width="48" height="48" style={{ borderRadius: '12px' }} />
            <span style={eyebrow}>Free tool · Open source</span>
          </div>
          <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 'clamp(36px, 5vw, 56px)', color: '#1E293B', letterSpacing: '-0.025em', lineHeight: 1.05, marginBottom: '18px' }}>
            Screen Recorder
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', color: '#475569', lineHeight: 1.6, maxWidth: '520px', marginBottom: '28px' }}>
            Record your screen with your face in a bubble, see exactly what you are recording, and get an MP4 on your own computer.
            No account, no watermark, no time limit.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            {order.map((platform, i) => (
              <DownloadButton key={platform} platform={platform} primary={i === 0} large onStart={onStart} />
            ))}
          </div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#64748B', lineHeight: 1.6 }}>
            Version {RECORDER.version} · Mac app ({RECORDER.mac.kind}, {RECORDER.mac.size}) · Windows ({RECORDER.windows.kind}, {RECORDER.windows.size}) · Runs with Google Chrome or Microsoft Edge
          </p>
          {GITHUB_URL && (
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', marginTop: '10px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', color: '#1E293B', textDecoration: 'none' }}
              className="hover:text-amber-gold transition-colors">
              View the source on GitHub →
            </a>
          )}
          <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '8px 20px', marginTop: '24px' }}>
            {['Free forever', 'Mac app & Windows', 'Nothing uploaded'].map(t => (
              <li key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 500, color: '#1E293B' }}>
                <Check size={16} color="#16A34A" strokeWidth={2.5} /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#121214', boxShadow: '0 30px 70px rgba(15,23,42,0.22)', border: '1px solid rgba(15,23,42,0.08)' }}>
            <img
              src="/products/screen-recorder/recording.png"
              alt="Screen Recorder recording a slide, with a round camera bubble in the corner and a live preview"
              style={{ display: 'block', width: '100%', height: 'auto' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function PlatformCard({ platform, primary, started, onStart }) {
  const p = PLATFORMS[platform]
  return (
    <div
      id={platform}
      style={{
        minWidth: 0, scrollMarginTop: '128px',
        background: '#fff', borderRadius: '16px', padding: 'clamp(22px, 3vw, 30px)', position: 'relative', overflow: 'hidden',
        border: started ? '2px solid #4ADE80' : '1px solid #E2E8F0',
        boxShadow: started ? '0 12px 32px rgba(74,222,128,0.18)' : 'none',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #E8A000, #FBBF24)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
        <span style={{ width: 42, height: 42, borderRadius: '11px', background: '#1C1C24', color: '#fff', display: 'grid', placeItems: 'center' }}>
          <PlatformIcon platform={platform} size={21} />
        </span>
        <div>
          <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '20px', color: '#1E293B' }}>{p.title}</h3>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#64748B' }}>
            {platform === 'mac' ? 'Mac app with installer' : 'ZIP for Windows 10 & 11'} · {p.kind} · {p.size}
          </p>
        </div>
      </div>

      {started && (
        <p role="status" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 600, color: '#15803D', background: 'rgba(74,222,128,0.14)', borderRadius: '8px', padding: '10px 12px', marginBottom: '16px' }}>
          <Check size={16} strokeWidth={2.5} /> Your download has started. Here's what to do next:
        </p>
      )}

      <ol style={{ listStyle: 'none', display: 'grid', gap: '14px', marginBottom: '22px' }}>
        {p.steps.map((s, i) => (
          <li key={i} style={{ display: 'flex', gap: '12px', fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>
            <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: '50%', background: 'rgba(232,160,0,0.14)', color: '#B87A00', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '12px', display: 'grid', placeItems: 'center', marginTop: '1px' }}>{i + 1}</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>

      <DownloadButton platform={platform} primary={primary} onStart={onStart} />
      {started && (
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#64748B', marginTop: '10px' }}>
          Didn't start? <a href={p.file} download style={{ color: '#B87A00', fontWeight: 600 }}>Click here to download</a>.
        </p>
      )}
    </div>
  )
}

function GetStarted({ order, started, onStart }) {
  return (
    <section id="download" style={{ padding: 'clamp(56px, 7vw, 88px) 0', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', scrollMarginTop: '104px' }}>
      <div className="max-w-6xl mx-auto px-6">
        <p style={{ ...eyebrow, marginBottom: '12px' }}>Get started</p>
        <h2 style={{ ...h2, color: '#1E293B', marginBottom: '36px' }}>Recording in two minutes</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {order.map((platform, i) => (
            <PlatformCard key={platform} platform={platform} primary={i === 0} started={started === platform} onStart={onStart} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginTop: '24px' }}>
          {AFTER_STEPS.map((s, i) => (
            <div key={s.title} style={{ minWidth: 0, display: 'flex', gap: '14px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '20px 22px' }}>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '14px', color: i === AFTER_STEPS.length - 1 ? '#FF8559' : '#B87A00' }}>Then</span>
              <div>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '16px', color: '#1E293B', marginBottom: '6px' }}>{s.title}</h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section style={{ padding: 'clamp(56px, 7vw, 88px) 0', background: '#1C1C24' }}>
      <div className="max-w-6xl mx-auto px-6">
        <p style={{ ...eyebrow, marginBottom: '12px' }}>What you get</p>
        <h2 style={{ ...h2, color: '#fff', marginBottom: '36px' }}>Everything you need for a great walkthrough video</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ Icon, title, body }) => (
            <div key={title} style={{ minWidth: 0, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderTop: '2px solid rgba(232,160,0,0.35)', borderRadius: '14px', padding: '24px' }} className="card-hover-dark">
              <span style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(232,160,0,0.14)', color: '#E8A000', display: 'grid', placeItems: 'center', marginBottom: '16px' }}>
                <Icon size={20} />
              </span>
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '16px', color: '#fff', marginBottom: '8px' }}>{title}</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Questions() {
  return (
    <section style={{ padding: 'clamp(56px, 7vw, 88px) 0', background: '#fff' }}>
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div style={{ minWidth: 0 }}>
          <p style={{ ...eyebrow, marginBottom: '12px' }}>Questions</p>
          <h2 style={{ ...h2, color: '#1E293B' }}>Good to know</h2>
        </div>
        <dl className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8" style={{ minWidth: 0 }}>
          {FAQ.map(({ q, a }) => (
            <div key={q}>
              <dt style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '16px', color: '#1E293B', marginBottom: '8px' }}>{q}</dt>
              <dd style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>{a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function BuiltBy() {
  return (
    <section style={{ padding: '0 0 clamp(56px, 7vw, 88px)', background: '#fff' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: 'clamp(24px, 4vw, 36px)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div style={{ minWidth: 0, maxWidth: '620px' }}>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '18px', color: '#1E293B', marginBottom: '6px' }}>Built by Command Pipeline</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>
              We run multi-channel outbound for B2B companies. If you want a pipeline as well as great videos, let's talk.
            </p>
          </div>
          <a
            href="https://calendly.com/bilal-commandpipeline/30min"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: '14px', color: '#1E293B', border: '1px solid #CBD5E1', background: '#fff', padding: '11px 18px', borderRadius: '8px', textDecoration: 'none', whiteSpace: 'nowrap' }}
            className="hover:opacity-80 transition-opacity"
          >
            Get a Free Outbound Audit <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ScreenRecorderPage() {
  // The visitor's own computer goes first.
  const [order] = useState(() => (detectPlatform() === 'windows' ? ['windows', 'mac'] : ['mac', 'windows']))
  // Arriving from a "Mac" / "Windows" menu link means that download has already started.
  const [started, setStarted] = useState(() => {
    const p = new URLSearchParams(window.location.search).get('download')
    return p === 'mac' || p === 'windows' ? p : null
  })

  useEffect(() => {
    document.title = 'Free Screen Recorder for Mac & Windows — Command Pipeline'
    // Tidy the address so a shared or reloaded link doesn't claim a download started.
    if (window.location.search) window.history.replaceState(null, '', window.location.pathname + window.location.hash)
  }, [])

  // Bring the matching instructions into view whenever a download starts.
  useEffect(() => {
    if (!started) return
    const t = setTimeout(() => document.getElementById(started)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
    return () => clearTimeout(t)
  }, [started])

  return (
    <>
      <Navbar base="/" />
      {/* 40px announcement bar + 64px nav = 104px total fixed header */}
      <main style={{ paddingTop: '104px' }}>
        <Hero order={order} onStart={setStarted} />
        <GetStarted order={order} started={started} onStart={setStarted} />
        <Features />
        <Questions />
        <BuiltBy />
      </main>
      <Footer base="/" />
    </>
  )
}
