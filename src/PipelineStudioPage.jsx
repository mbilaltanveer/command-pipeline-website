import { useEffect, useState } from 'react'
import {
  Clapperboard, Captions, Type, Mic, ScanFace, Images, FileText, Palette, ShieldCheck,
  Upload, SlidersHorizontal, Download, ArrowRight, Check, Play,
} from 'lucide-react'
import { Navbar, Footer } from './App.jsx'

// ─── Data ────────────────────────────────────────────────────────────────────

const BOOKING_URL = 'https://calendly.com/bilal-commandpipeline/30min'
const A = '/products/pipeline-studio'

// One sample per option, all made in Pipeline Studio. Files live in public/products/pipeline-studio.
const OPTIONS = [
  {
    key: 'clean', num: '01', Icon: Captions, title: 'Clean edit',
    blurb: 'Upload any video. We tidy it up and make it ready to post.',
    samples: [{
      video: `${A}/clean.mp4`, poster: `${A}/clean-poster.jpg`, portrait: true, thumbs: 3,
      input: 'An 18-second phone video, filmed vertically',
      output: ['Word-by-word captions with key words in the brand colour', 'Trimmed to the first word, pauses tightened', 'Three thumbnail layouts from the best frames', 'Transcript as SRT, VTT and TXT'],
    }],
  },
  {
    key: 'motion', num: '02', Icon: Type, title: 'Brand motion',
    blurb: 'No camera needed. Kinetic typography built from your brand guidelines.',
    samples: [{
      video: `${A}/motion.mp4`, poster: `${A}/motion-poster.jpg`, thumbs: 3,
      input: 'A topic and four bullet points',
      output: ['Animated scenes in the brand colours, logo and fonts', 'Branded transitions and an original music bed', 'A storyboard you can edit line by line', 'A designed thumbnail and the script'],
    }],
  },
  {
    key: 'voiceover', num: '03', Icon: Mic, title: 'Voiceover',
    blurb: 'Brand motion with a voiceover in your own cloned voice. Or a voiceover on your own footage.',
    samples: [
      {
        label: 'Brand motion', video: `${A}/voiceover.mp4`, poster: `${A}/voiceover-poster.jpg`, thumbs: 3,
        input: 'A four-scene storyboard and a 10-second voice sample',
        output: ['Voiceover in the founder\'s cloned voice', 'Every animation lands on the spoken word', 'Music ducks under the voice automatically', 'Voiceover MP3 and a captions file'],
      },
      {
        label: 'Your own footage', video: `${A}/footage.mp4`, poster: `${A}/footage-poster.jpg`, thumbs: 3,
        input: 'A silent screen recording and a three-line script',
        output: ['Voiceover laid over the footage', 'Captions on a dark backing, readable on any screen', 'A designed thumbnail when there is no face on screen', 'Voiceover MP3 and a captions file'],
      },
    ],
  },
  {
    key: 'popups', num: '04', Icon: ScanFace, title: 'Talking head + pop-ups',
    blurb: 'Your talking video with key-point cards that pop up beside you while you speak.',
    samples: [{
      video: `${A}/popups.mp4`, poster: `${A}/popups-poster.jpg`, thumbs: 3, note: '32-second excerpt',
      input: 'A 70-second talking video, filmed on a laptop',
      output: ['A hook line and a name card in the first seconds', 'Key-point cards placed on the side away from the face', 'Captions under the speaker as they talk', 'Thumbnails from the best frames'],
    }],
  },
]

const STEPS = [
  { Icon: Upload, title: 'Upload or describe', body: 'Drop in a phone video or a screen recording. Or skip the camera and write a topic and a few key points.' },
  { Icon: SlidersHorizontal, title: 'Review and edit', body: 'See preview frames first. Change the hook, the pop-up cards, a misheard word, or any line of the storyboard.' },
  { Icon: Download, title: 'Render and download', body: 'The finished video, a phone-size copy, three thumbnails and a transcript, ready to post.' },
]

const BRAND_ITEMS = [
  'Colours, suggested straight from your logo or pasted guidelines',
  'Logos for dark and light backgrounds, your mark and your fonts',
  'Tone of voice, plus rules every video follows',
  'Keywords that get highlighted in the captions',
  'A voice sample, greeting and sign-off for voiceovers',
]

const FEATURES = [
  { Icon: Captions, title: 'Captions that keep up', body: 'Word-by-word captions timed to your voice, with key words in your brand colour. Fix a misheard word by typing over it.' },
  { Icon: ScanFace, title: 'Pop-ups that stay off your face', body: 'Face tracking puts every card and hook on the side of the frame you are not on.' },
  { Icon: Clapperboard, title: 'Motion graphics, no camera', body: 'Eleven scene types, branded transitions and original music, all from a plain-text storyboard.' },
  { Icon: Mic, title: 'Your voice, cloned', body: 'Ten seconds of you talking is enough. Each line is recorded several times and the most natural take is kept.' },
  { Icon: Images, title: 'Thumbnails for every video', body: 'Three layouts from your best frames, or a designed brand card when there is no face on screen.' },
  { Icon: ShieldCheck, title: 'Private by design', body: 'Footage and voice samples are processed on our own machines, not uploaded to a third-party editing tool.' },
]

const FAQ = [
  { q: 'Do I need to film anything?', a: 'No. Brand motion turns a topic and a few key points into a finished video. If you do film, a phone or laptop camera is enough.' },
  { q: 'How does the voice clone work?', a: 'From a clear 10 to 20 second recording of you talking. Every line is checked word by word against the script and against your real voice before it is used.' },
  { q: 'Can I change things before it is final?', a: 'Yes. Every video stops at a review step with preview frames. You approve the hook, the cards, the captions and the storyboard before the final render.' },
  { q: 'Which formats can I get?', a: 'Filmed videos keep their original framing, or get reframed to 9:16, 1:1 or 16:9 around your face. Brand motion videos are 16:9.' },
]

// ─── Pieces ──────────────────────────────────────────────────────────────────

const eyebrow = { fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '12px', color: '#E8A000', letterSpacing: '0.12em', textTransform: 'uppercase' }
const h2 = { fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 'clamp(26px, 3.4vw, 38px)', letterSpacing: '-0.02em', lineHeight: 1.15 }

function BookButton({ children = 'Book a demo', dark = false }) {
  return (
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: '#FF8559', color: '#fff', border: '1px solid #FF8559',
        fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '15px', padding: '14px 22px', borderRadius: '10px', textDecoration: 'none',
        letterSpacing: '0.01em', boxShadow: dark ? '0 10px 28px rgba(255,133,89,0.22)' : '0 10px 28px rgba(255,133,89,0.28)', whiteSpace: 'nowrap',
      }}
      className="hover:opacity-90 transition-opacity"
    >
      {children} <ArrowRight size={16} />
    </a>
  )
}

// A screenshot of the studio inside a simple dark browser frame.
function AppFrame({ src, alt }) {
  return (
    <div style={{ borderRadius: '14px', overflow: 'hidden', background: '#0B0D12', boxShadow: '0 30px 70px rgba(15,23,42,0.22)', border: '1px solid rgba(15,23,42,0.12)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {['#3A3F4B', '#3A3F4B', '#3A3F4B'].map((c, i) => <span key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />)}
        <span style={{ marginLeft: '10px', fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#5E6677' }}>Pipeline Studio</span>
      </div>
      <img src={src} alt={alt} loading="lazy" style={{ display: 'block', width: '100%', height: 'auto' }} />
    </div>
  )
}

function Hero() {
  return (
    <section style={{
      padding: 'clamp(48px, 7vw, 88px) 0', background: '#fff',
      backgroundImage: 'radial-gradient(circle, rgba(30,41,59,0.07) 1px, transparent 1px)', backgroundSize: '20px 20px',
    }}>
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span style={{ width: 48, height: 48, borderRadius: '12px', background: '#1C1C24', color: '#FBBF24', display: 'grid', placeItems: 'center' }}>
              <Clapperboard size={24} />
            </span>
            <span style={eyebrow}>New · AI video studio</span>
          </div>
          <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 'clamp(36px, 5vw, 56px)', color: '#1E293B', letterSpacing: '-0.025em', lineHeight: 1.05, marginBottom: '18px' }}>
            Pipeline Studio
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', color: '#475569', lineHeight: 1.6, maxWidth: '540px', marginBottom: '28px' }}>
            Turn a phone video, a screen recording, or just a topic into a branded video. Captions, pop-up cards, motion graphics
            and a voiceover in your own voice, with thumbnails and a transcript every time.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <BookButton />
            <a
              href="#showcase"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '15px', color: '#1E293B', border: '1px solid #CBD5E1', background: '#fff', padding: '14px 20px', borderRadius: '10px', textDecoration: 'none', whiteSpace: 'nowrap' }}
              className="hover:opacity-80 transition-opacity"
            >
              <Play size={16} /> See what it makes
            </a>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '8px 20px', marginTop: '24px' }}>
            {['Your brand on every frame', 'Your own voice', 'Review before it renders'].map(t => (
              <li key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 500, color: '#1E293B' }}>
                <Check size={16} color="#16A34A" strokeWidth={2.5} /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ minWidth: 0 }}>
          <AppFrame src={`${A}/studio-home.jpg`} alt="Pipeline Studio home screen with four ways to make a video: clean edit, brand motion, voiceover, and talking head with pop-ups" />
        </div>
      </div>
    </section>
  )
}

function OptionCard({ option, active, onSelect }) {
  const { num, Icon, title, blurb } = option
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      style={{
        minWidth: 0, textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px',
        borderRadius: '14px', background: active ? 'rgba(232,160,0,0.08)' : 'rgba(255,255,255,0.03)',
        border: active ? '1px solid rgba(232,160,0,0.7)' : '1px solid rgba(255,255,255,0.08)',
        boxShadow: active ? '0 14px 40px rgba(232,160,0,0.14)' : 'none', transition: 'all 0.2s ease',
      }}
      className={active ? '' : 'card-hover-dark'}
    >
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ width: 40, height: 40, borderRadius: '10px', background: active ? 'rgba(232,160,0,0.18)' : 'rgba(255,255,255,0.06)', color: active ? '#FBBF24' : '#CBD5E1', display: 'grid', placeItems: 'center' }}>
          <Icon size={20} />
        </span>
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '12px', color: active ? '#FBBF24' : '#64748B', letterSpacing: '0.1em' }}>{num}</span>
      </span>
      <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '16px', color: '#fff' }}>{title}</span>
      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13.5px', color: '#94A3B8', lineHeight: 1.55 }}>{blurb}</span>
    </button>
  )
}

function Showcase() {
  const [key, setKey] = useState('voiceover')
  const [sampleIdx, setSampleIdx] = useState(0)
  const option = OPTIONS.find(o => o.key === key)
  const sample = option.samples[Math.min(sampleIdx, option.samples.length - 1)]
  const base = sample.video.replace('.mp4', '')

  return (
    <section id="showcase" className="scroll-mt-[168px] sm:scroll-mt-[136px] md:scroll-mt-[106px]" style={{ padding: 'clamp(56px, 7vw, 88px) 0', background: '#1C1C24' }}>
      <div className="max-w-6xl mx-auto px-6">
        <p style={{ ...eyebrow, marginBottom: '12px' }}>Four ways to make a video</p>
        <h2 style={{ ...h2, color: '#fff', marginBottom: '12px' }}>Pick an option. Get a finished video.</h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#94A3B8', lineHeight: 1.6, maxWidth: '640px', marginBottom: '32px' }}>
          Every sample below was made in Pipeline Studio for Command Pipeline. Pick one to watch it.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="group" aria-label="Video options">
          {OPTIONS.map(o => (
            <OptionCard key={o.key} option={o} active={o.key === key} onSelect={() => { setKey(o.key); setSampleIdx(0) }} />
          ))}
        </div>

        <div style={{ marginTop: '24px', background: '#13141A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: 'clamp(16px, 3vw, 28px)' }}>
          {option.samples.length > 1 && (
            <div style={{ display: 'inline-flex', gap: '4px', padding: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
              {option.samples.map((s, i) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setSampleIdx(i)}
                  aria-pressed={i === sampleIdx}
                  style={{ border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, padding: '7px 14px', borderRadius: '7px',
                    background: i === sampleIdx ? '#2A2C36' : 'transparent', color: i === sampleIdx ? '#fff' : '#94A3B8' }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3" style={{ minWidth: 0, display: 'flex', justifyContent: 'center' }}>
              <video
                key={sample.video}
                src={sample.video}
                poster={sample.poster}
                controls
                playsInline
                preload="metadata"
                style={{ width: '100%', maxWidth: sample.portrait ? '340px' : '100%', borderRadius: '12px', background: '#000', display: 'block', border: '1px solid rgba(255,255,255,0.08)' }}
              />
            </div>
            <div className="lg:col-span-2" style={{ minWidth: 0 }}>
              <p style={{ ...eyebrow, color: '#64748B', marginBottom: '8px' }}>What went in</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#fff', lineHeight: 1.55, marginBottom: '22px' }}>
                {sample.input}{sample.note ? <span style={{ color: '#64748B' }}> · {sample.note}</span> : null}
              </p>
              <p style={{ ...eyebrow, color: '#64748B', marginBottom: '10px' }}>What came out</p>
              <ul style={{ listStyle: 'none', display: 'grid', gap: '10px', marginBottom: '22px' }}>
                {sample.output.map(t => (
                  <li key={t} style={{ display: 'flex', gap: '10px', fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#CBD5E1', lineHeight: 1.5 }}>
                    <Check size={16} color="#FBBF24" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: '2px' }} /> {t}
                  </li>
                ))}
              </ul>
              <p style={{ ...eyebrow, color: '#64748B', marginBottom: '10px' }}>Thumbnails</p>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(3, minmax(0, ${sample.portrait ? '86px' : '1fr'}))`, gap: '8px' }}>
                {Array.from({ length: sample.thumbs }, (_, i) => (
                  <img key={i} src={`${base}-thumb-${i + 1}.jpg`} alt={`${option.title} thumbnail ${i + 1}`} loading="lazy"
                    style={{ width: '100%', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', display: 'block' }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 22px', marginTop: '22px' }}>
          {['Full-quality video', 'Phone-size copy', 'Three thumbnails', 'Transcript (SRT, VTT, TXT)', 'Voiceover file'].map(t => (
            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontFamily: 'Inter, sans-serif', fontSize: '13.5px', color: '#94A3B8' }}>
              <FileText size={15} color="#E8A000" /> {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section style={{ padding: 'clamp(56px, 7vw, 88px) 0', background: '#fff' }}>
      <div className="max-w-6xl mx-auto px-6">
        <p style={{ ...eyebrow, marginBottom: '12px' }}>How it works</p>
        <h2 style={{ ...h2, color: '#1E293B', marginBottom: '36px' }}>You stay in control of every frame</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STEPS.map(({ Icon, title, body }, i) => (
            <div key={title} style={{ minWidth: 0, position: 'relative', overflow: 'hidden', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '24px' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #E8A000, #FBBF24)' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(232,160,0,0.12)', color: '#B87A00', display: 'grid', placeItems: 'center' }}><Icon size={20} /></span>
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '13px', color: '#B87A00' }}>0{i + 1}</span>
              </div>
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '17px', color: '#1E293B', marginBottom: '8px' }}>{title}</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>{body}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ marginTop: '36px' }}>
          <figure style={{ minWidth: 0 }}>
            <AppFrame src={`${A}/studio-review-popups.jpg`} alt="Review screen for a talking-head video: preview frames, editable pop-up cards with start and end times, the hook and the transcript" />
            <figcaption style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#64748B', marginTop: '10px' }}>Talking head: edit the hook, the cards and their timing. Click a transcript line to add a card there.</figcaption>
          </figure>
          <figure style={{ minWidth: 0 }}>
            <AppFrame src={`${A}/studio-review-storyboard.jpg`} alt="Review screen for a brand motion video: one preview frame per scene and the editable storyboard" />
            <figcaption style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#64748B', marginTop: '10px' }}>Brand motion: one preview frame per scene, and a storyboard you edit like a doc.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

function BrandMemory() {
  return (
    <section style={{ padding: 'clamp(56px, 7vw, 88px) 0', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div style={{ minWidth: 0 }}>
          <p style={{ ...eyebrow, marginBottom: '12px' }}>Brand memory</p>
          <h2 style={{ ...h2, color: '#1E293B', marginBottom: '16px' }}>Share your brand guidelines once</h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#475569', lineHeight: 1.6, marginBottom: '24px' }}>
            Your brand kit is saved and reused on every video, thumbnail and voiceover, so nothing goes out off-brand.
          </p>
          <ul style={{ listStyle: 'none', display: 'grid', gap: '12px' }}>
            {BRAND_ITEMS.map(t => (
              <li key={t} style={{ display: 'flex', gap: '10px', fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#1E293B', lineHeight: 1.5 }}>
                <Palette size={18} color="#B87A00" style={{ flexShrink: 0, marginTop: '2px' }} /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ minWidth: 0 }}>
          <AppFrame src={`${A}/studio-brand-kit.jpg`} alt="Brand kit screen with brand name, colours, logos, fonts and a live preview" />
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
        <h2 style={{ ...h2, color: '#fff', marginBottom: '36px' }}>Everything a founder-led video needs</h2>
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

function GetIt() {
  return (
    <section style={{ padding: '0 0 clamp(56px, 7vw, 88px)', background: '#fff' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div style={{ background: '#1C1C24', borderRadius: '18px', padding: 'clamp(28px, 5vw, 48px)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #E8A000, #FBBF24, #F78C45)' }} />
          <div style={{ minWidth: 0, maxWidth: '620px' }}>
            <h2 style={{ ...h2, color: '#fff', marginBottom: '10px' }}>Want videos like these for your brand?</h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#94A3B8', lineHeight: 1.6 }}>
              Book a 30-minute call. We will show you the studio and set up your brand kit.
            </p>
          </div>
          <BookButton dark />
        </div>
      </div>
    </section>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PipelineStudioPage() {
  useEffect(() => {
    document.title = 'Pipeline Studio: branded videos with captions, pop-ups and your own voice | Command Pipeline'
  }, [])

  return (
    <>
      <Navbar base="/" />
      {/* The fixed header is 104px on desktop; the announcement bar wraps to two or three lines on phones. */}
      <main className="pt-[168px] sm:pt-[136px] md:pt-[106px]">
        <Hero />
        <Showcase />
        <HowItWorks />
        <BrandMemory />
        <Features />
        <Questions />
        <GetIt />
      </main>
      <Footer base="/" />
    </>
  )
}
