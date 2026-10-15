import { useEffect } from 'react'
import {
  Download, MonitorPlay, Eye, HardDrive, RotateCcw, Laptop, Lock, ArrowRight, Check,
} from 'lucide-react'
import { Navbar, Footer } from './App.jsx'

// ─── Data ────────────────────────────────────────────────────────────────────

const RELEASE = {
  version: '1.0.0',
  file: '/downloads/Recorder-1.0.0.zip',
  size: '0.6 MB',
}

// Set to the public GitHub repo once it's live to show a "View source" link.
const GITHUB_URL = null

const STEPS = [
  {
    title: 'Download the ZIP',
    body: 'One small file with everything inside. No installer, no account.',
  },
  {
    title: 'Unzip and open it',
    body: 'Mac: double-click "Start Recorder (Mac)". Windows: double-click "Start Recorder (Windows)".',
    note: 'First time only: on a Mac, right-click → Open (or System Settings → Privacy & Security → Open Anyway). On Windows, click More info → Run anyway.',
  },
  {
    title: 'Allow camera, mic and screen',
    body: 'Click Allow when asked. On a Mac, also turn on your browser in System Settings → Privacy & Security → Screen & System Audio Recording.',
  },
  {
    title: 'Hit record',
    body: 'Pick your screen, a window or a tab. Stop when you are done. The MP4 is saved straight to your computer.',
  },
]

const FEATURES = [
  { Icon: MonitorPlay, title: 'Screen + camera bubble', body: 'Your face in a round bubble in any corner, like Loom. Or record just the screen, or just the camera.' },
  { Icon: Eye, title: 'Live preview', body: 'See exactly what is being recorded while you record. Pause and resume any time.' },
  { Icon: HardDrive, title: 'Saves MP4s to your computer', body: 'Standard MP4 video in 720p, 1080p or 1440p, saved to a folder you choose or your Downloads.' },
  { Icon: RotateCcw, title: 'Crash-safe', body: 'If the window closes mid-recording, it offers to save what was recorded next time you open it.' },
  { Icon: Laptop, title: 'Mac & Windows', body: 'Runs in Google Chrome or Microsoft Edge. Edge comes with every Windows PC.' },
  { Icon: Lock, title: 'Private and free', body: 'No sign-up, no watermark, no time limit. Your videos never leave your computer.' },
]

const FAQ = [
  { q: 'Is it really free?', a: 'Yes. Free for personal and business use, with no limits. It is open source under the MIT license.' },
  { q: 'Do I need to install anything?', a: 'No. You only need Google Chrome or Microsoft Edge, which most computers already have.' },
  { q: 'Where do my videos go?', a: 'Into a folder you choose, or your Downloads folder. The recorder also lists them so you can play them back.' },
  { q: 'Is anything uploaded?', a: 'No. Recording and saving happen entirely on your computer. There is no server and no account.' },
]

// ─── Pieces ──────────────────────────────────────────────────────────────────

const eyebrow = { fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '12px', color: '#E8A000', letterSpacing: '0.12em', textTransform: 'uppercase' }
const h2 = { fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 'clamp(26px, 3.4vw, 38px)', letterSpacing: '-0.02em', lineHeight: 1.15 }

function DownloadButton({ large = false }) {
  return (
    <a
      href={RELEASE.file}
      download
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '10px',
        backgroundColor: '#FF8559', color: '#fff',
        fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: large ? '17px' : '15px',
        padding: large ? '17px 32px' : '13px 24px', borderRadius: '10px', textDecoration: 'none', letterSpacing: '0.01em',
        boxShadow: '0 10px 28px rgba(255,133,89,0.28)',
      }}
      className="hover:opacity-90 transition-opacity"
    >
      <Download size={large ? 20 : 18} />
      Download for Mac &amp; Windows
    </a>
  )
}

function Hero() {
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
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <DownloadButton large />
            {GITHUB_URL && (
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '15px', color: '#1E293B', textDecoration: 'none' }}
                className="hover:text-amber-gold transition-colors">
                View the source on GitHub →
              </a>
            )}
          </div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#64748B' }}>
            Version {RELEASE.version} · ZIP · {RELEASE.size} · Works in Google Chrome or Microsoft Edge
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '8px 20px', marginTop: '24px' }}>
            {['Free forever', 'Mac & Windows', 'Nothing uploaded'].map(t => (
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

function HowToStart() {
  return (
    <section style={{ padding: 'clamp(56px, 7vw, 88px) 0', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
      <div className="max-w-6xl mx-auto px-6">
        <p style={{ ...eyebrow, marginBottom: '12px' }}>Get started</p>
        <h2 style={{ ...h2, color: '#1E293B', marginBottom: '36px' }}>Recording in two minutes</h2>
        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5" style={{ listStyle: 'none' }}>
          {STEPS.map((s, i) => (
            <li key={s.title} style={{ minWidth: 0, background: '#fff', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: i === STEPS.length - 1 ? '#FF8559' : 'linear-gradient(90deg, #E8A000, #FBBF24)' }} />
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '14px', color: '#B87A00' }}>0{i + 1}</span>
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '17px', color: '#1E293B', margin: '10px 0 8px' }}>{s.title}</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>{s.body}</p>
              {s.note && (
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12.5px', color: '#64748B', lineHeight: 1.55, marginTop: '12px', padding: '10px 12px', background: '#F1F5F9', borderRadius: '8px' }}>
                  {s.note}
                </p>
              )}
            </li>
          ))}
        </ol>
        <div style={{ marginTop: '32px' }}>
          <DownloadButton />
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
  useEffect(() => {
    document.title = 'Free Screen Recorder for Mac & Windows — Command Pipeline'
  }, [])

  return (
    <>
      <Navbar base="/" />
      {/* 40px announcement bar + 64px nav = 104px total fixed header */}
      <main style={{ paddingTop: '104px' }}>
        <Hero />
        <HowToStart />
        <Features />
        <Questions />
        <BuiltBy />
      </main>
      <Footer base="/" />
    </>
  )
}
