'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { useUser, SignInButton } from '@clerk/nextjs'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

/* ── Icons ───────────────────────────────────────────── */
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
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

/* ── Stripe purchase flow (keep existing) ─────────────── */
function BuyButton({ points, price, label, dark, outline }: { points: number; price: number; label: string; dark?: boolean; outline?: boolean }) {
  const { isSignedIn } = useUser()
  const [loading, setLoading] = useState(false)

  const handlePurchase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points, amount: price }),
      })
      const { sessionId } = await response.json()
      const stripe = await stripePromise
      await stripe?.redirectToCheckout({ sessionId })
    } finally {
      setLoading(false)
    }
  }

  const btnStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: 100,
    fontSize: 14, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    marginBottom: 24, transition: 'all .2s',
    ...(dark ? { background: 'var(--ink)', color: 'white', border: 'none' } :
       outline ? { background: 'white', color: 'var(--ink)', border: '1px solid var(--line-2)' } :
       { background: 'white', color: 'var(--ink)', border: 'none' }),
  }

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button style={btnStyle}>{label} <ArrowIcon /></button>
      </SignInButton>
    )
  }

  return (
    <button onClick={handlePurchase} disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.7 : 1 }}>
      {loading ? 'Redirecting…' : <>{label} <ArrowIcon /></>}
    </button>
  )
}

/* ── Tier cards ───────────────────────────────────────── */
const TIERS = [
  {
    name: 'Free', blurb: 'Kick the tires. Render a few icons every week.',
    price: '$0', period: '/forever', credits: '15 icons / month',
    cta: 'Start free', dark: false, outline: true, popular: false,
    points: 0, stripePrice: 0,
    features: ['15 icons / month', 'Standard styles', 'PNG export', 'Personal use only', 'Community support'],
  },
  {
    name: 'Starter', blurb: 'Just enough to play. Great for solo work and one-offs.',
    price: '$5', period: '/pack', credits: '1,000 credits',
    cta: 'Buy Starter pack', dark: false, outline: true, popular: false,
    points: 1000, stripePrice: 5,
    features: ['20+ icon generations', '20+ background removals', 'PNG export', 'Commercial license', 'Email support'],
  },
  {
    name: 'Studio', blurb: 'For working designers who ship every week.',
    price: '$12', period: '/pack', credits: '2,600 credits',
    cta: 'Buy Studio pack', dark: true, outline: false, popular: true,
    points: 2600, stripePrice: 12,
    features: ['50+ icon generations', '50+ background removals', 'PNG · WEBP export', 'Brand style memory', 'Priority queue', 'Commercial license'],
  },
  {
    name: 'Pro', blurb: 'For studios and teams with high-volume needs.',
    price: '$50', period: '/pack', credits: '12,000 credits',
    cta: 'Buy Pro pack', dark: false, outline: false, popular: false,
    points: 12000, stripePrice: 50,
    features: ['240+ icon generations', '240+ background removals', 'All export formats', 'API access', 'Dedicated support', 'Custom style training'],
  },
]

/* ── Feature matrix ───────────────────────────────────── */
const MATRIX = [
  {
    title: 'Generation',
    rows: [
      ['Credits included', '15/mo', '1,000', '2,600', '12,000'],
      ['Resolution up to', '1024px', '1024px', '1024px', '2048px'],
      ['Render queue speed', 'Standard', 'Standard', 'Priority', 'Dedicated'],
    ],
  },
  {
    title: 'Export & workspace',
    rows: [
      ['Export formats', 'PNG', 'PNG', 'PNG · WEBP', 'All formats'],
      ['Background removal', false, true, true, true],
      ['Brand style memory', false, false, true, true],
    ],
  },
  {
    title: 'Licensing & support',
    rows: [
      ['Commercial license', false, true, true, true],
      ['API access', false, false, false, true],
      ['Support', 'Community', 'Email', 'Priority', 'Dedicated'],
    ],
  },
]

function CellVal({ v }: { v: string | boolean }) {
  if (v === true) return <span style={{ color: 'var(--blue)' }}><CheckIcon /></span>
  if (v === false) return <span style={{ color: 'var(--muted-2)', opacity: 0.5 }}><CrossIcon /></span>
  return <span>{v}</span>
}

/* ── FAQ ──────────────────────────────────────────────── */
const FAQ_ITEMS = [
  { q: 'What counts as one credit?', a: 'One credit = one finished render. Failed renders are always free.' },
  { q: 'Do unused credits roll over?', a: 'Credits in your account never expire. They persist until you use them.' },
  { q: 'Can I buy more credits later?', a: 'Yes — just purchase another pack from the pricing page any time.' },
  { q: 'What happens when I run out of credits?', a: 'You can top up at any time by purchasing another pack. We never auto-charge.' },
  { q: 'Is the commercial license transferable?', a: 'Yes. The license travels with the asset — clients and end users can use it freely.' },
  { q: 'Do you offer educational discounts?', a: 'Students and faculty get 50% off. Email us with your .edu address to claim it.' },
]

/* ── Page ─────────────────────────────────────────────── */
export default function PricingContent() {
  const [faqOpen, setFaqOpen] = useState(0)

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/lightray_right.avif" alt="" style={{ position: 'absolute', top: 0, left: 0, width: 'min(36vw, 460px)', pointerEvents: 'none', zIndex: 0 }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/lightfade_left.avif" alt="" style={{ position: 'absolute', top: 0, right: 0, width: 'min(36vw, 460px)', pointerEvents: 'none', zIndex: 0 }} />

      <main style={{ position: 'relative', zIndex: 2 }}>
        {/* Hero */}
        <section style={{ position: 'relative', padding: '64px 24px 56px', textAlign: 'center' }}>
          <div className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--blue)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/icons/price.svg" alt="" style={{ width: 14, height: 14 }} /> Pricing
          </div>
          <h1 style={{ fontSize: 'clamp(40px, 5.2vw, 64px)', letterSpacing: '-0.035em', fontWeight: 600, lineHeight: 0.98, marginBottom: 18 }}>
            Pay as you <span className="serif" style={{ fontWeight: 400 }}>bake.</span>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--muted)', maxWidth: 540, margin: '0 auto 28px', lineHeight: 1.5 }}>
            Start free. Buy a pack when you need more. Credits never expire — no subscriptions, no contracts.
          </p>
        </section>

        {/* Tier cards */}
        <section style={{ padding: '0 24px 80px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {TIERS.map((t, i) => (
              <div key={i} style={{ background: t.dark ? 'var(--ink)' : 'white', color: t.dark ? 'white' : 'var(--ink)', border: t.dark ? 'none' : '1px solid var(--line)', borderRadius: 24, padding: '32px 28px 28px', position: 'relative', boxShadow: t.dark ? '0 24px 60px -20px rgba(11,11,14,0.5)' : '0 1px 2px rgba(20,30,80,0.03)', display: 'flex', flexDirection: 'column' }}>
                {t.popular && (
                  <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', padding: '4px 12px', background: 'linear-gradient(135deg, #3B82F6, #7BB0FF)', color: 'white', fontSize: 11, fontWeight: 600, borderRadius: 100, letterSpacing: '0.04em', boxShadow: '0 6px 14px rgba(59,130,246,0.4)', whiteSpace: 'nowrap' }}>MOST POPULAR</div>
                )}
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{t.name}</div>
                <div style={{ fontSize: 13, opacity: t.dark ? 0.6 : 1, color: t.dark ? undefined : 'var(--muted)', marginBottom: 22, lineHeight: 1.5, minHeight: 38 }}>{t.blurb}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-0.04em' }}>{t.price}</span>
                  <span style={{ fontSize: 14, opacity: 0.6 }}>{t.period}</span>
                </div>
                <div style={{ marginTop: 14, marginBottom: 22, padding: '8px 12px', borderRadius: 100, background: t.dark ? 'rgba(255,255,255,0.08)' : 'var(--blue-soft)', color: t.dark ? 'rgba(255,255,255,0.85)' : 'var(--blue)', fontSize: 12.5, fontWeight: 500, textAlign: 'center' }}>{t.credits}</div>
                {t.stripePrice > 0 ? (
                  <BuyButton points={t.points} price={t.stripePrice} label={t.cta} dark={t.dark} outline={t.outline} />
                ) : (
                  <button style={{ width: '100%', padding: '12px 16px', borderRadius: 100, fontSize: 14, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 24, background: 'white', color: 'var(--ink)', border: '1px solid var(--line-2)' }}>
                    {t.cta} <ArrowIcon />
                  </button>
                )}
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, marginBottom: 12 }}>What&apos;s included</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {t.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5 }}>
                      <span style={{ width: 18, height: 18, borderRadius: 100, flexShrink: 0, marginTop: 1, background: t.dark ? 'rgba(123,176,255,0.2)' : 'var(--blue-soft)', color: t.dark ? 'var(--blue-2)' : 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckIcon /></span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Feature matrix */}
        <section style={{ padding: '0 24px 100px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <h2 style={{ fontSize: 'clamp(28px, 3.4vw, 40px)', letterSpacing: '-0.03em', fontWeight: 600, lineHeight: 1.05 }}>
                Compare <span className="serif" style={{ fontWeight: 400 }}>every feature.</span>
              </h2>
            </div>
            <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 22, overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.6fr repeat(4, 1fr)', background: '#FAFAF8', borderBottom: '1px solid var(--line)', padding: '18px 22px', alignItems: 'center', fontSize: 13, fontWeight: 600 }}>
                <div style={{ color: 'var(--muted)' }}>Feature</div>
                {['Free', 'Starter', 'Studio', 'Pro'].map((t, i) => (
                  <div key={t} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <span>{t}</span>
                    {i === 2 && <span style={{ fontSize: 9.5, color: 'var(--blue)', background: 'var(--blue-soft)', padding: '2px 6px', borderRadius: 100, fontWeight: 600 }}>POPULAR</span>}
                  </div>
                ))}
              </div>
              {MATRIX.map((s, si) => (
                <div key={si}>
                  <div style={{ padding: '14px 22px', background: '#FCFCFA', borderTop: si > 0 ? '1px solid var(--line)' : 'none', borderBottom: '1px solid var(--line)', fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.title}</div>
                  {s.rows.map((r, ri) => (
                    <div key={ri} style={{ display: 'grid', gridTemplateColumns: '1.6fr repeat(4, 1fr)', padding: '14px 22px', alignItems: 'center', fontSize: 13.5, borderBottom: ri < s.rows.length - 1 ? '1px solid var(--line)' : 'none' }}>
                      <div style={{ color: 'var(--ink-2)' }}>{r[0]}</div>
                      {r.slice(1).map((v, vi) => (
                        <div key={vi} style={{ textAlign: 'center', color: 'var(--ink-2)', display: 'flex', justifyContent: 'center' }}>
                          <CellVal v={v as string | boolean} />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enterprise CTA */}
        <section style={{ padding: '0 24px 100px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', borderRadius: 28, background: 'linear-gradient(180deg, #0A1430 0%, #1B2A55 100%)', padding: '56px 48px', position: 'relative', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 40, alignItems: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(60% 80% at 100% 50%, rgba(123,176,255,0.22), transparent 70%)' }} />
            <div style={{ position: 'relative' }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--blue-2)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>◆ Enterprise</div>
              <h2 className="serif" style={{ fontSize: 'clamp(32px, 4vw, 48px)', color: 'white', letterSpacing: '-0.02em', lineHeight: 1.05, fontWeight: 400, marginBottom: 14 }}>
                Need a plan built around your team?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, maxWidth: 480, lineHeight: 1.55, marginBottom: 26 }}>
                Custom volume, dedicated infra, custom style training, SSO, audit logs, and a CSM on speed dial.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button style={{ background: 'white', color: 'var(--ink)', padding: '13px 22px', borderRadius: 100, fontSize: 14, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 8, border: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>
                  Contact sales <ArrowIcon />
                </button>
                <button style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', padding: '13px 22px', borderRadius: 100, fontSize: 14, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' }}>
                  Book a demo
                </button>
              </div>
            </div>
            <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[{ n: '99.9%', l: 'Uptime SLA' }, { n: '<6s', l: 'Avg render' }, { n: '24/7', l: 'Dedicated CSM' }, { n: 'SOC 2', l: 'Type II' }].map((s, i) => (
                <div key={i} style={{ padding: '18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: 'white', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.n}</div>
                  <div style={{ marginTop: 8, color: 'rgba(255,255,255,0.55)', fontSize: 12.5 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: '0 24px 100px' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <div className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--blue)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/icons/qna.svg" alt="" style={{ width: 14, height: 14 }} /> FAQ
              </div>
              <h2 style={{ fontSize: 'clamp(28px, 3.4vw, 40px)', letterSpacing: '-0.03em', fontWeight: 600, lineHeight: 1.05 }}>
                Pricing <span className="serif" style={{ fontWeight: 400 }}>questions.</span>
              </h2>
            </div>
            <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 22, overflow: 'hidden' }}>
              {FAQ_ITEMS.map((it, i) => (
                <div key={i} style={{ borderBottom: i < FAQ_ITEMS.length - 1 ? '1px solid var(--line)' : 'none' }}>
                  <button onClick={() => setFaqOpen(faqOpen === i ? -1 : i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', textAlign: 'left', fontSize: 15, fontWeight: 500, color: 'var(--ink)', background: 'none', border: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>
                    {it.q}
                    <span style={{ width: 28, height: 28, borderRadius: 100, background: faqOpen === i ? 'var(--ink)' : 'var(--bg)', color: faqOpen === i ? 'white' : 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s', flexShrink: 0 }}>
                      {faqOpen === i ? <MinusIcon /> : <PlusIcon />}
                    </span>
                  </button>
                  <div style={{ maxHeight: faqOpen === i ? 200 : 0, overflow: 'hidden', transition: 'max-height .3s ease' }}>
                    <div style={{ padding: '0 24px 22px', fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.6 }}>{it.a}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
