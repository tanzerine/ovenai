'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

/* ── Tiny icon components ─────────────────────────────── */
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const SparkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1.5l1.4 3.7L12 6.5l-3.6 1.3L7 11.5 5.6 7.8 2 6.5l3.6-1.3L7 1.5z" fill="currentColor" />
  </svg>
)
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2.5 6.5L5 9l4.5-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const CrossIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)
const MinusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)
const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M6 1l1.55 3.14L11 4.64 8.5 7.08l.59 3.42L6 8.88 2.91 10.5 3.5 7.08 1 4.64l3.45-.5L6 1z" fill="currentColor" />
  </svg>
)
const CubeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1.5l5 2.7v5.6L7 12.5l-5-2.7V4.2l5-2.7zM2 4.2l5 2.8 5-2.8M7 7v5.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
)

/* ── FloatingIcon ─────────────────────────────────────── */
function FloatingIcon({
  src, size = 72, rotate = 0, style = {}, delay = 0, fade = false,
}: {
  src: string; size?: number; rotate?: number; style?: React.CSSProperties; delay?: number; fade?: boolean
}) {
  const fadeMask = fade
    ? { WebkitMaskImage: 'linear-gradient(to bottom, black 35%, transparent 95%)', maskImage: 'linear-gradient(to bottom, black 35%, transparent 95%)' }
    : {}
  return (
    <div
      style={{
        width: size, height: size, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        filter: fade ? 'none' : 'drop-shadow(0 12px 24px rgba(20,30,80,0.18)) drop-shadow(0 4px 8px rgba(20,30,80,0.10))',
        animation: `float ${4 + (delay % 3)}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        ['--r' as string]: `${rotate}deg`,
        ...fadeMask, ...style,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </div>
  )
}

/* ── Hero ─────────────────────────────────────────────── */
function Hero() {
  const [prompt, setPrompt] = useState('')
  return (
    <section style={{ position: 'relative', padding: '120px 24px 80px', overflow: 'hidden' }}>
      {/* Background decorations */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/grid_bg.svg" alt="" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 'auto', opacity: 0.5, pointerEvents: 'none', zIndex: 0 }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/lightray_right.avif" alt="" style={{ position: 'absolute', top: 0, left: 0, width: 'min(36vw, 460px)', pointerEvents: 'none', zIndex: 0 }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/lightfade_left.avif" alt="" style={{ position: 'absolute', top: 0, right: 0, width: 'min(36vw, 460px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Floating icons */}
      <FloatingIcon src="/assets/house.avif" size={170} rotate={-8} delay={0} style={{ position: 'absolute', top: 100, left: '-2%', zIndex: 1 }} />
      <FloatingIcon src="/assets/girl.avif" size={180} rotate={6} delay={1.2} fade style={{ position: 'absolute', top: 280, left: '-4%', zIndex: 1 }} />
      <FloatingIcon src="/assets/smile.webp" size={150} rotate={8} delay={0.6} style={{ position: 'absolute', top: 100, right: '-2%', zIndex: 1 }} />
      <FloatingIcon src="/assets/cap.webp" size={130} rotate={-12} delay={1.8} fade style={{ position: 'absolute', top: 280, right: '0%', zIndex: 1 }} />

      <div style={{ position: 'relative', maxWidth: 880, margin: '0 auto', textAlign: 'center', zIndex: 2 }}>
        {/* Eyebrow */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px 5px 6px', borderRadius: 100, background: 'white', border: '1px solid var(--line)', boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 2px 8px rgba(20,30,80,0.04)', fontSize: 12.5, color: 'var(--ink-2)', marginBottom: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/icons/tip.svg" alt="" style={{ width: 18, height: 18 }} />
          v2.4 · Clay, Glass &amp; Liquid Chrome packs are live
          <ArrowIcon />
        </div>

        <h1 style={{ fontSize: 'clamp(40px, 6.4vw, 84px)', lineHeight: 0.98, letterSpacing: '-0.04em', fontWeight: 700, marginBottom: 24 }}>
          Create 3D icons<br />
          <span className="serif" style={{ fontWeight: 400, letterSpacing: '-0.02em' }}>with one </span>
          <span style={{ background: 'linear-gradient(135deg, #3B82F6, #7BB0FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>click.</span>
        </h1>

        <p style={{ fontSize: 18, color: 'var(--muted)', maxWidth: 540, margin: '0 auto 36px', lineHeight: 1.5 }}>
          Type a word. Pick a style. Oven bakes a pixel-perfect 3D icon in seconds —
          ready to drop into your deck, app or landing page.
        </p>

        {/* CTA cluster */}
        <div style={{ display: 'inline-flex', gap: 8, padding: 6, background: 'white', border: '1px solid var(--line)', borderRadius: 100, alignItems: 'center', boxShadow: '0 4px 16px rgba(20,30,80,0.06), 0 0 0 4px rgba(123,176,255,0.08)' }}>
          <input
            placeholder="a smiling avocado, glossy clay…"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', padding: '0 14px', fontSize: 14.5, color: 'var(--ink)', width: 280, fontFamily: 'inherit' }}
          />
          <Link href={`/main${prompt ? `?q=${encodeURIComponent(prompt)}` : ''}`}>
            <button style={{ background: 'var(--ink)', color: 'white', padding: '11px 18px', borderRadius: 100, fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, border: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>
              <SparkIcon /> Bake icon
            </button>
          </Link>
        </div>
        <div style={{ marginTop: 14, fontSize: 12.5, color: 'var(--muted-2)' }}>
          Free during beta · No card required · 3 icons / day
        </div>
      </div>
    </section>
  )
}

/* ── Icon Grid ────────────────────────────────────────── */
const GRID_ICONS = [
  { src: '/assets/cart.avif', n: 'cart' },
  { src: '/assets/pig.avif', n: 'piggy' },
  { src: '/assets/shake.webp', n: 'handshake' },
  { src: '/assets/trophy.webp', n: 'trophy' },
  { src: '/assets/diamond.webp', n: 'diamond' },
  { src: '/assets/smile.webp', n: 'smile' },
  { src: '/assets/icecream.webp', n: 'icecream' },
  { src: '/assets/house.avif', n: 'museum' },
  { src: '/assets/bear.webp', n: 'koala' },
  { src: '/assets/cap.webp', n: 'keycap' },
]

const RemixIconSvg = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M7.5 1l2 1.5L7.5 4M9.5 2.5H4.5a2 2 0 000 4H5M3.5 10l-2-1.5L3.5 7M1.5 8.5H6.5a2 2 0 000-4H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function openRemix(src: string, name: string) {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const absoluteSrc = src.startsWith('http') ? src : `${origin}${src}`
  const params = new URLSearchParams()
  params.set('img', absoluteSrc)
  params.set('q', name)
  window.open(`/main?${params.toString()}`, '_blank')
}

function IconGrid() {
  const [hover, setHover] = useState<number | null>(null)
  const router = useRouter()
  return (
    <section style={{ padding: '0 24px 80px', position: 'relative' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
          {GRID_ICONS.map((it, i) => (
            <div
              key={i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onClick={() => router.push(`/library?open=${encodeURIComponent(it.src)}`)}
              style={{ aspectRatio: '1', background: 'white', border: '1px solid var(--line)', borderRadius: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: 14, position: 'relative', overflow: 'hidden', transition: 'transform .25s cubic-bezier(.2,.8,.2,1), box-shadow .25s, border-color .25s', transform: hover === i ? 'translateY(-6px)' : 'translateY(0)', boxShadow: hover === i ? '0 16px 32px rgba(20,30,80,0.12), 0 2px 6px rgba(20,30,80,0.05)' : '0 1px 2px rgba(20,30,80,0.03)', cursor: 'pointer' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.src} alt={it.n} style={{ width: '72%', height: '72%', objectFit: 'contain', marginTop: 6, filter: 'drop-shadow(0 8px 12px rgba(20,30,80,0.12))', transition: 'transform .3s', transform: hover === i ? 'scale(1.08) rotate(-3deg)' : 'scale(1)' }} />
              <div className="mono" style={{ fontSize: 10, color: 'var(--muted-2)', textTransform: 'lowercase', letterSpacing: '0.06em' }}>{it.n}</div>
              {/* Remix button — appears on hover */}
              <button
                onClick={e => { e.stopPropagation(); openRemix(it.src, it.n) }}
                style={{ position: 'absolute', bottom: 10, left: '50%', transform: `translateX(-50%) translateY(${hover === i ? 0 : 8}px)`, opacity: hover === i ? 1 : 0, transition: 'opacity .2s, transform .2s', display: 'flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 100, background: 'rgba(11,11,14,0.88)', color: 'white', fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer', backdropFilter: 'blur(8px)', whiteSpace: 'nowrap', pointerEvents: hover === i ? 'auto' : 'none' }}
              >
                <RemixIconSvg /> Remix
              </button>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 28, textAlign: 'center', fontSize: 13, color: 'var(--muted)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 24, height: 1, background: 'var(--line-2)' }} />
          A handful of what users baked this week
          <span style={{ width: 24, height: 1, background: 'var(--line-2)' }} />
        </div>
      </div>
    </section>
  )
}

/* ── Stats ────────────────────────────────────────────── */
function Stats() {
  return (
    <section style={{ padding: '0 24px 100px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', borderRadius: 28, background: 'var(--blue)', padding: '56px 48px', position: 'relative', overflow: 'hidden', boxShadow: '0 24px 60px -20px rgba(59,130,246,0.45), inset 0 1px 0 rgba(255,255,255,0.25)' }}>
        <div style={{ position: 'absolute', top: -120, left: -80, width: 360, height: 360, background: 'radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -120, right: -80, width: 360, height: 360, background: 'radial-gradient(circle, rgba(123,176,255,0.4), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', textAlign: 'center', marginBottom: 44 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderRadius: 100, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)', marginBottom: 18 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'white', boxShadow: '0 0 0 3px rgba(255,255,255,0.3)', animation: 'statPulse 1.8s ease-in-out infinite', display: 'inline-block' }} />
            <span style={{ fontSize: 11.5, color: 'white', fontWeight: 500, letterSpacing: '0.02em' }}>Live · updated every minute</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3.6vw, 44px)', lineHeight: 1.05, letterSpacing: '-0.03em', fontWeight: 600, color: 'white' }}>
            What our users have <span className="serif" style={{ fontWeight: 400 }}>baked so far.</span>
          </h2>
        </div>

        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
          {[
            { n: '898K+', l: 'icons baked' },
            { n: '12,540', l: 'happy users' },
            { n: '1,876+', l: 'styles & presets' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '24px 8px', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.2)' : 'none' }}>
              <div style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 700, color: 'white', letterSpacing: '-0.04em', lineHeight: 1 }}>{s.n}</div>
              <div className="mono" style={{ marginTop: 14, color: 'rgba(255,255,255,0.75)', fontSize: 11.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Use Cases ────────────────────────────────────────── */
function UseCases() {
  const cases = [
    { imgs: [{ src: '/assets/trophy.webp', size: 96, rot: -8 }, { src: '/assets/diamond.webp', size: 86, rot: 10 }], title: 'High-fidelity art for marketing', desc: 'Trophies, gems, packaging shots — render product hero icons in any style without a 3D artist.', tag: 'Designers' },
    { imgs: [{ src: '/assets/girl.avif', size: 116, rot: -4 }], title: 'Friendly characters & avatars', desc: 'Spin up consistent mascot families. Same lighting, same vibe, infinite poses.', tag: 'Founders' },
    { imgs: [{ src: '/assets/icecream.webp', size: 92, rot: 0 }, { src: '/assets/bear.webp', size: 92, rot: 8 }], title: 'Storyboards & decks', desc: 'Drop in scene-ready props so your pitch never looks like a stock-photo wasteland again.', tag: 'PMs' },
    { imgs: [{ src: '/assets/house.avif', size: 100, rot: -6 }, { src: '/assets/shake.webp', size: 96, rot: 6 }], title: 'Brand-true app icons', desc: 'Lock a palette, train on your style — every export matches your design system.', tag: 'Teams' },
  ]
  return (
    <section style={{ padding: '0 24px 100px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', borderRadius: 28, background: 'linear-gradient(180deg, #0A1430 0%, #131F45 100%)', padding: '64px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(50% 50% at 50% 0%, rgba(123,176,255,0.18), transparent 70%)' }} />
        <div style={{ position: 'absolute', top: -36, left: '50%', transform: 'translateX(-50%)', width: 72, height: 72, borderRadius: '50%', background: '#0A1430', border: '2px solid rgba(123,176,255,0.3)', boxShadow: '0 0 40px rgba(123,176,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.avif" alt="Oven AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div style={{ position: 'relative', textAlign: 'center', marginBottom: 56, marginTop: 36 }}>
          <div className="mono" style={{ display: 'inline-block', fontSize: 11, color: 'var(--blue-2)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>◆ Use cases</div>
          <h2 style={{ fontSize: 'clamp(28px, 3.4vw, 40px)', color: 'white', letterSpacing: '-0.03em', lineHeight: 1.1, fontWeight: 600 }}>
            Built by makers,<br />
            <span className="serif" style={{ fontWeight: 400, color: 'var(--blue-2)' }}>used everywhere.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14.5, marginTop: 14 }}>From solo designers to ten-person product teams — here&apos;s how Oven shows up at work.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {cases.map((c, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 28, backdropFilter: 'blur(8px)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {c.imgs.map((im, k) => (
                    <FloatingIcon key={k} src={im.src} size={im.size} rotate={im.rot} delay={i * 0.4 + k * 0.5} />
                  ))}
                </div>
                <span style={{ fontSize: 11, color: 'var(--blue-2)', padding: '4px 10px', borderRadius: 100, background: 'rgba(123,176,255,0.12)', border: '1px solid rgba(123,176,255,0.2)', letterSpacing: '0.04em' }}>{c.tag}</span>
              </div>
              <h3 style={{ color: 'white', fontSize: 18, fontWeight: 600, marginBottom: 8, letterSpacing: '-0.01em' }}>{c.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.55 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Perfect For ──────────────────────────────────────── */
function PerfectFor() {
  const chips = [
    { i: 'cart', l: 'Ecommerce' }, { i: 'design', l: 'UI/UX design' }, { i: 'programming', l: 'Web development' },
    { i: 'mobile', l: 'Mobile apps' }, { i: 'ai', l: 'AI tools' }, { i: 'saas', l: 'SaaS products' },
    { i: 'sns', l: 'Social media' }, { i: 'graph', l: 'Marketing & data' }, { i: 'database', l: 'Backend systems' },
    { i: 'price', l: 'Pricing pages' }, { i: 'reward', l: 'Loyalty rewards' }, { i: 'fire', l: 'Trending decks' },
  ]
  return (
    <section style={{ padding: '0 24px 100px' }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div className="mono" style={{ fontSize: 11, color: 'var(--blue)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>◆ Any team</div>
          <h2 style={{ fontSize: 'clamp(28px, 3.4vw, 42px)', letterSpacing: '-0.03em', fontWeight: 600, lineHeight: 1.05 }}>
            Perfect for <span className="serif" style={{ fontWeight: 400 }}>your job.</span>
          </h2>
        </div>
        <div style={{ padding: '32px 28px', background: 'linear-gradient(180deg, #FFFFFF 0%, #F4F8FF 100%)', borderRadius: 24, border: '1px solid var(--line)', boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 4px 20px rgba(20,30,80,0.04)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {chips.map((c, i) => (
              <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 16px 9px 12px', borderRadius: 100, background: 'white', border: '1px solid var(--line)', fontSize: 13.5, color: 'var(--ink-2)', fontWeight: 500, boxShadow: '0 1px 2px rgba(20,30,80,0.04)', cursor: 'default' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/assets/icons/${c.i}.svg`} alt="" style={{ width: 20, height: 20 }} />
                {c.l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Features ─────────────────────────────────────────── */
function Features() {
  const items = [
    { icon: 'quality', title: 'Quality Design', desc: 'Icon generation models trained on a curated library of studio-grade 3D renders.' },
    { icon: 'fast', title: 'Background Removal', desc: 'Transparent PNG assets with no background — drop into any deck or app right away.' },
    { icon: 'people', title: 'Pay as much as you want', desc: 'Pay only for the icons you actually keep. No subscriptions, no overcharging, no waste.' },
  ]
  return (
    <section style={{ padding: '0 24px 100px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--blue)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/icons/feature.svg" alt="" style={{ width: 14, height: 14 }} /> Features
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3.4vw, 42px)', letterSpacing: '-0.03em', fontWeight: 600, lineHeight: 1.05 }}>
            Explore our core <span className="serif" style={{ fontWeight: 400 }}>features.</span>
          </h2>
          <p style={{ color: 'var(--muted)', marginTop: 14, fontSize: 15, maxWidth: 520, margin: '14px auto 0' }}>
            Every render is finished, brand-ready, and exportable to wherever your team works.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {items.map((it, i) => (
            <div key={i} style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 24, padding: '40px 32px 36px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(180deg, #3B82F6, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/assets/icons/${it.icon}.svg`} alt="" style={{ width: 44, height: 44 }} />
                </div>
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 10 }}>{it.title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14.5, lineHeight: 1.55, maxWidth: 280, margin: '0 auto' }}>{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Pricing Preview ──────────────────────────────────── */
function PricingPreview() {
  const tiers = [
    { name: 'Starter', credits: '100 points', price: '$9', period: '/month', blurb: 'Just enough to play. Great for solo work and one-offs.', features: ['100 icons / month', 'Standard styles only', 'PNG export', 'Personal license', 'Email support'], cta: 'Get started', highlight: false },
    { name: 'Studio', credits: '2,000 points', price: '$42', period: '/month', blurb: 'For working designers who ship every week.', features: ['2,000 icons / month', 'All styles & packs', 'PNG · SVG · GLB', 'Brand style memory', 'Commercial license', 'Priority queue'], cta: 'Start free trial', highlight: true },
    { name: 'Team', credits: '12,000 points', price: '$149', period: '/month', blurb: 'For studios and product teams with shared libraries.', features: ['12,000 icons / month', 'Shared workspace', 'API access', 'SSO + audit log', 'Dedicated support', 'Custom style training'], cta: 'Talk to sales', highlight: false },
  ]
  return (
    <section style={{ padding: '0 24px 100px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--blue)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/icons/price.svg" alt="" style={{ width: 14, height: 14 }} /> Pricing
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3.4vw, 42px)', letterSpacing: '-0.03em', fontWeight: 600, lineHeight: 1.05 }}>
            Our pricing <span className="serif" style={{ fontWeight: 400 }}>plans.</span>
          </h2>
          <p style={{ color: 'var(--muted)', marginTop: 14, fontSize: 15 }}>Pay as you bake. Cancel any time.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {tiers.map((t, i) => (
            <div key={i} style={{ background: t.highlight ? 'var(--ink)' : 'white', color: t.highlight ? 'white' : 'var(--ink)', border: t.highlight ? 'none' : '1px solid var(--line)', borderRadius: 24, padding: 32, position: 'relative', boxShadow: t.highlight ? '0 24px 60px -20px rgba(11,11,14,0.5)' : '0 1px 2px rgba(20,30,80,0.03)' }}>
              {t.highlight && (
                <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', padding: '4px 12px', background: 'linear-gradient(135deg, #3B82F6, #7BB0FF)', color: 'white', fontSize: 11, fontWeight: 600, borderRadius: 100, letterSpacing: '0.04em', boxShadow: '0 4px 12px rgba(59,130,246,0.4)' }}>MOST POPULAR</div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14.5, fontWeight: 600 }}>{t.name}</span>
                <span className="mono" style={{ fontSize: 11, opacity: 0.6, padding: '3px 10px', border: `1px solid ${t.highlight ? 'rgba(255,255,255,0.18)' : 'var(--line)'}`, borderRadius: 100 }}>{t.credits}</span>
              </div>
              <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 20, lineHeight: 1.5 }}>{t.blurb}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.04em' }}>{t.price}</span>
                <span style={{ fontSize: 14, opacity: 0.6 }}>{t.period}</span>
              </div>
              <Link href="/pricing">
                <button style={{ width: '100%', padding: '12px 16px', background: t.highlight ? 'white' : 'var(--ink)', color: t.highlight ? 'var(--ink)' : 'white', borderRadius: 100, fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 24, border: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>
                  {t.cta} <ArrowIcon />
                </button>
              </Link>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, marginBottom: 12 }}>What&apos;s included</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {t.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                    <span style={{ width: 18, height: 18, borderRadius: 100, background: t.highlight ? 'rgba(123,176,255,0.2)' : '#E6F0FF', color: t.highlight ? '#7BB0FF' : 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CheckIcon /></span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Compare ──────────────────────────────────────────── */
function Compare() {
  const others = ['Looks like a toy', 'Subscription bloat', 'Renders take 1+ min', 'No SVG / GLB exports', 'Limited free trial', 'Generic results', 'No team workspace']
  const oven = ['Studio-grade lighting', 'Pay-as-you-bake', 'Renders in ~6 seconds', 'PNG · SVG · GLB · APNG', 'Free forever tier', 'Style memory per brand', 'Shared team library']
  return (
    <section style={{ padding: '0 24px 100px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="mono" style={{ fontSize: 11, color: 'var(--blue)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>◆ Comparison</div>
          <h2 style={{ fontSize: 'clamp(28px, 3.4vw, 42px)', letterSpacing: '-0.03em', fontWeight: 600, lineHeight: 1.05 }}>
            Why teams pick <span className="serif" style={{ fontWeight: 400 }}>Oven.</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 22, padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--line)' }}>
              <div style={{ width: 24, height: 24, borderRadius: 8, background: '#F4F4EE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}><CrossIcon /></div>
              <span style={{ fontWeight: 600, fontSize: 15 }}>Other platforms</span>
            </div>
            {others.map((o, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', fontSize: 14, color: 'var(--muted)' }}>
                <span style={{ width: 18, height: 18, borderRadius: 100, background: '#FCE9EA', color: 'var(--bad)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CrossIcon /></span>
                {o}
              </div>
            ))}
          </div>
          <div style={{ background: 'linear-gradient(180deg, #F4F8FF 0%, #FFFFFF 100%)', border: '1px solid var(--blue-tint)', borderRadius: 22, padding: 28, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'radial-gradient(circle, rgba(123,176,255,0.25), transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--blue-tint)', position: 'relative' }}>
              <div style={{ width: 24, height: 24, borderRadius: 8, background: 'linear-gradient(135deg, #3B82F6, #7BB0FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><CubeIcon /></div>
              <span style={{ fontWeight: 600, fontSize: 15 }}>Oven AI</span>
            </div>
            {oven.map((o, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', fontSize: 14, color: 'var(--ink)', fontWeight: 500, position: 'relative' }}>
                <span style={{ width: 18, height: 18, borderRadius: 100, background: 'var(--blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CheckIcon /></span>
                {o}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── FAQ ──────────────────────────────────────────────── */
function FAQ() {
  const [open, setOpen] = useState(0)
  const items = [
    { q: 'How does Oven work?', a: 'You type a description, pick a style preset, and we run it through our diffusion + 3D render pipeline. Most icons finish in 6–10 seconds.' },
    { q: 'Can I use Oven icons commercially?', a: 'Yes — every paid plan includes a full commercial license. Free-tier icons are limited to personal and editorial use.' },
    { q: 'Do you have an API?', a: 'The Team plan ships with a REST API and webhooks. You can also drop icons straight into Figma with our official plugin.' },
    { q: 'Do unused credits roll over?', a: 'Up to 1 month, on Studio and Team plans. Free plan credits reset every Monday.' },
    { q: 'Where is my data stored?', a: 'On EU and US S3 regions. We never train shared models on private renders, and you can delete everything from the dashboard.' },
  ]
  return (
    <section style={{ padding: '0 24px 100px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--blue)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/icons/qna.svg" alt="" style={{ width: 14, height: 14 }} /> FAQ
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3.4vw, 42px)', letterSpacing: '-0.03em', fontWeight: 600, lineHeight: 1.05 }}>
            Frequently asked <span className="serif" style={{ fontWeight: 400 }}>questions.</span>
          </h2>
        </div>
        <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 22, overflow: 'hidden' }}>
          {items.map((it, i) => (
            <div key={i} style={{ borderBottom: i < items.length - 1 ? '1px solid var(--line)' : 'none' }}>
              <button onClick={() => setOpen(open === i ? -1 : i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', textAlign: 'left', fontSize: 15, fontWeight: 500, color: 'var(--ink)', background: 'none', border: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>
                {it.q}
                <span style={{ width: 28, height: 28, borderRadius: 100, background: open === i ? 'var(--ink)' : 'var(--bg)', color: open === i ? 'white' : 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s', flexShrink: 0 }}>
                  {open === i ? <MinusIcon /> : <PlusIcon />}
                </span>
              </button>
              <div style={{ maxHeight: open === i ? 200 : 0, overflow: 'hidden', transition: 'max-height .3s ease' }}>
                <div style={{ padding: '0 24px 22px', fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.6, maxWidth: 600 }}>{it.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Testimonials ─────────────────────────────────────── */
function Testimonials() {
  const quotes = [
    { n: 'Mira Patel', r: 'Brand Lead, Lume', q: 'I burned half a Friday making icons in Blender. Now it takes ten minutes and they actually match our palette.', stars: 5 },
    { n: 'Jonah Reed', r: 'Founder, Forkpath', q: 'The style memory feature is the killer. Our whole product suite finally looks like one product.', stars: 5 },
    { n: 'Amelie Brun', r: 'Designer, Studio Quart', q: "I keep showing clients renders thinking they'll spot the AI tell. Nobody has yet.", stars: 5 },
    { n: 'Wei Lin', r: 'PM, Outpost', q: 'My pitch decks went from stock-photo soup to looking like a real product overnight.', stars: 5 },
    { n: 'Sasha K.', r: 'Indie maker', q: 'I pay for like nine tools. This is the one I keep telling people about.', stars: 5 },
    { n: 'Theo Mensah', r: 'Creative Director', q: 'We replaced two contracted illustrators for routine work. Saved us roughly $4k a month.', stars: 5 },
  ]
  return (
    <section style={{ padding: '0 24px 100px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--blue)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/icons/review.svg" alt="" style={{ width: 14, height: 14 }} /> Testimonials
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3.4vw, 42px)', letterSpacing: '-0.03em', fontWeight: 600, lineHeight: 1.05 }}>
            Hear from <span className="serif" style={{ fontWeight: 400 }}>our users.</span>
          </h2>
          <p style={{ color: 'var(--muted)', marginTop: 14, fontSize: 15 }}>12,540 makers and counting. Here&apos;s what a few of them are saying.</p>
        </div>
        <div style={{ columnCount: 3, columnGap: 16 }}>
          {quotes.map((q, i) => (
            <div key={i} style={{ breakInside: 'avoid', marginBottom: 16, background: 'white', border: '1px solid var(--line)', borderRadius: 18, padding: 22 }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 12, color: '#F5B400' }}>
                {Array.from({ length: q.stars }).map((_, j) => <StarIcon key={j} />)}
              </div>
              <p style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink-2)', marginBottom: 18 }}>&ldquo;{q.q}&rdquo;</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 100, background: `linear-gradient(135deg, hsl(${i * 60}, 70%, 70%), hsl(${i * 60 + 40}, 70%, 60%))`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 600 }}>{q.n.split(' ').map(s => s[0]).join('')}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{q.n}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted-2)' }}>{q.r}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Blog preview ─────────────────────────────────────── */
function BlogPreview() {
  const posts = [
    { title: 'How we trained Oven on 800k 3D renders without losing the soul', excerpt: 'A peek inside the data pipeline and how we keep output from drifting into uncanny-valley plastic.', cover: '/assets/diamond.webp', bg: '#E6F0FF', topic: 'Engineering', date: 'May 22', read: '8 min' },
    { title: 'A field guide to writing prompts that bake clean icons', excerpt: 'Subject + style + lighting + format. Why two extra words can save you ten retries.', cover: '/assets/trophy.webp', bg: '#FFF4DC', topic: 'Tutorial', date: 'May 18', read: '6 min' },
    { title: 'Style memory is here — lock your brand once, forget about it', excerpt: 'Train Oven on a handful of your existing assets and every render that follows matches your system.', cover: '/assets/shake.webp', bg: '#EAE3FF', topic: 'Product', date: 'May 10', read: '4 min' },
  ]
  return (
    <section style={{ padding: '0 24px 100px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36, gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--blue)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>◆ Blog</div>
            <h2 style={{ fontSize: 'clamp(28px, 3.4vw, 42px)', letterSpacing: '-0.03em', fontWeight: 600, lineHeight: 1.05 }}>
              Latest from the <span className="serif" style={{ fontWeight: 400 }}>oven.</span>
            </h2>
          </div>
          <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 100, background: 'white', border: '1px solid var(--line)', fontSize: 13, fontWeight: 500, color: 'var(--ink-2)' }}>
            View all articles <ArrowIcon />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {posts.map((p, i) => (
            <Link key={i} href="/blog" style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform .25s, box-shadow .25s', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: p.bg, padding: 28, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.cover} alt="" style={{ width: '46%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 12px 20px rgba(20,30,80,0.18))' }} />
              </div>
              <div style={{ padding: 22, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: 'var(--muted)', marginBottom: 10 }}>
                  <span style={{ color: 'var(--blue)', fontWeight: 600, background: 'var(--blue-soft)', padding: '2px 8px', borderRadius: 100, fontSize: 10.5 }}>{p.topic}</span>
                  <span>{p.date}</span>
                  <span style={{ color: 'var(--muted-2)' }}>·</span>
                  <span>{p.read}</span>
                </div>
                <h3 style={{ fontSize: 16, letterSpacing: '-0.01em', fontWeight: 600, lineHeight: 1.3, marginBottom: 8 }}>{p.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.55 }}>{p.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Final CTA ────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section style={{ padding: '0 24px 100px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', borderRadius: 28, background: 'linear-gradient(180deg, #0A1430 0%, #1B2A55 100%)', padding: '72px 40px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <FloatingIcon src="/assets/diamond.webp" size={84} rotate={-15} delay={0} style={{ position: 'absolute', top: 40, left: '10%' }} />
        <FloatingIcon src="/assets/trophy.webp" size={78} rotate={20} delay={1} style={{ position: 'absolute', top: 50, right: '10%' }} />
        <FloatingIcon src="/assets/cart.avif" size={70} rotate={-8} delay={2} style={{ position: 'absolute', bottom: 30, left: '8%' }} />
        <FloatingIcon src="/assets/shake.webp" size={72} rotate={10} delay={1.4} style={{ position: 'absolute', bottom: 40, right: '8%' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(60% 50% at 50% 50%, rgba(123,176,255,0.2), transparent 70%)' }} />
        <h2 className="serif" style={{ position: 'relative', fontSize: 'clamp(36px, 5vw, 64px)', color: 'white', letterSpacing: '-0.02em', lineHeight: 1.05, fontWeight: 400, marginBottom: 18 }}>
          Ready to bake your first icon?
        </h2>
        <p style={{ position: 'relative', color: 'rgba(255,255,255,0.6)', fontSize: 16, maxWidth: 460, margin: '0 auto 32px', lineHeight: 1.5 }}>
          Three free icons every day, forever. No credit card. Upgrade only when you&apos;re hooked.
        </p>
        <div style={{ position: 'relative', display: 'inline-flex', gap: 10 }}>
          <Link href="/main">
            <button style={{ background: 'white', color: 'var(--ink)', padding: '14px 22px', borderRadius: 100, fontSize: 14.5, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8, border: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>
              <SparkIcon /> Bake your first icon
            </button>
          </Link>
          <Link href="/blog">
            <button style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', padding: '14px 22px', borderRadius: 100, fontSize: 14.5, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' }}>
              View gallery
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── Page assembly ────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div style={{ background: 'var(--bg)' }}>
      <Hero />
      <IconGrid />
      <Stats />
      <UseCases />
      <PerfectFor />
      <Features />
      <PricingPreview />
      <Compare />
      <FAQ />
      <Testimonials />
      <BlogPreview />
      <FinalCTA />
    </div>
  )
}
