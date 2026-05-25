'use client'

import { useState } from 'react'
import Link from 'next/link'

const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M12.5 1.5l-11 5 4.5 1.5m6.5-6.5l-4.5 11-2-4.5m6.5-6.5l-6.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2.5 6.5L5 9l4.5-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

interface FormState {
  name?: string; role?: string; tenure?: string
  love?: string; frustration?: string; wish?: string
  nps?: number; email?: string
  beta?: boolean; interview?: boolean; followup?: boolean
}

function InlineInput({ value, onChange, placeholder, width = 160 }: { value?: string; onChange: (v: string) => void; placeholder: string; width?: number }) {
  return (
    <input
      value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ border: 'none', background: 'transparent', borderBottom: '1.5px solid var(--paper-line, #E8E5DA)', padding: '2px 4px', fontSize: 'inherit', fontFamily: 'inherit', width, color: 'var(--ink)', transition: 'border-color .2s', outline: 'none' }}
      onFocus={e => (e.target.style.borderBottomColor = 'var(--blue)')}
      onBlur={e => (e.target.style.borderBottomColor = 'var(--paper-line, #E8E5DA)')}
    />
  )
}

function Chips({ value, onChange, options }: { value?: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 6, verticalAlign: 'middle' }}>
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)} style={{ padding: '5px 12px', borderRadius: 100, background: value === o ? 'var(--ink)' : 'transparent', color: value === o ? 'white' : 'var(--ink-2)', border: `1px solid ${value === o ? 'var(--ink)' : '#E8E5DA'}`, fontSize: 13, fontWeight: 500, transition: 'all .15s', fontFamily: 'inherit', cursor: 'pointer' }}>{o}</button>
      ))}
    </div>
  )
}

function Section({ label, example, children }: { label: string; example: string; children: React.ReactNode }) {
  return (
    <div style={{ margin: '28px 0' }}>
      <div className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 12, color: 'var(--muted-2)', marginBottom: 4 }}>{example}</div>
      {children}
    </div>
  )
}

function ThankYou({ name, reset }: { name?: string; reset: () => void }) {
  return (
    <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 24, padding: '64px 48px', textAlign: 'center', boxShadow: '0 24px 60px -24px rgba(20,30,80,0.12)' }}>
      <div style={{ width: 72, height: 72, margin: '0 auto 24px', borderRadius: '50%', background: 'linear-gradient(180deg, #3B82F6, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 24px rgba(37,99,235,0.35)' }}>
        <SendIcon />
      </div>
      <h2 className="serif" style={{ fontSize: 'clamp(28px, 3.4vw, 38px)', letterSpacing: '-0.02em', fontWeight: 400, marginBottom: 12 }}>
        Letter posted{name ? `, ${name}` : ''}.
      </h2>
      <p style={{ color: 'var(--muted)', fontSize: 15, maxWidth: 440, margin: '0 auto 28px', lineHeight: 1.55 }}>
        Thanks — one of us will read it this week and write back if you asked us to.
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <Link href="/main" style={{ background: 'var(--ink)', color: 'white', padding: '12px 20px', borderRadius: 100, fontSize: 14, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          Back to baking <ArrowIcon />
        </Link>
        <button onClick={reset} style={{ background: 'white', color: 'var(--ink-2)', border: '1px solid var(--line)', padding: '12px 20px', borderRadius: 100, fontSize: 14, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' }}>
          Write another
        </button>
      </div>
    </div>
  )
}

export default function FeedbackContent() {
  const [form, setForm] = useState<FormState>({})
  const [sent, setSent] = useState(false)
  const set = (patch: Partial<FormState>) => setForm(f => ({ ...f, ...patch }))

  const npsEmojis = ['😶', '😐', '🙂', '😊', '🤩']
  const npsLabel = form.nps == null ? 'pick a number' : form.nps <= 3 ? "— I'd steer them away." : form.nps <= 6 ? '— maybe, if it fits.' : form.nps <= 8 ? '— happily.' : '— I already do, often.'

  const taStyle: React.CSSProperties = { width: '100%', border: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: 16.5, color: 'var(--ink-2)', resize: 'vertical', lineHeight: 1.65, padding: '12px 0', minHeight: 80, borderBottom: '1px dashed #E8E5DA', outline: 'none' }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/lightray_right.avif" alt="" style={{ position: 'absolute', top: 0, left: 0, width: 'min(36vw, 460px)', pointerEvents: 'none', zIndex: 0 }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/lightfade_left.avif" alt="" style={{ position: 'absolute', top: 0, right: 0, width: 'min(36vw, 460px)', pointerEvents: 'none', zIndex: 0 }} />

      <main style={{ position: 'relative', zIndex: 2, padding: '56px 24px 80px', maxWidth: 820, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--blue)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>◆ Feedback</div>
          <h1 style={{ fontSize: 'clamp(40px, 5.2vw, 60px)', letterSpacing: '-0.035em', fontWeight: 600, lineHeight: 0.98, marginBottom: 18 }}>
            Write the team a <span className="serif" style={{ fontWeight: 400 }}>letter.</span>
          </h1>
          <p style={{ fontSize: 16.5, color: 'var(--muted)', maxWidth: 540, margin: '0 auto', lineHeight: 1.55 }}>
            We read every one. The product gets better because people like you tell us where it hurts and what to build next.
          </p>
        </div>

        {!sent ? (
          <>
            {/* Letter card */}
            <div style={{ position: 'relative', background: '#FCFBF7', border: '1px solid #E8E5DA', borderRadius: 22, padding: '52px 56px 48px', boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 24px 60px -24px rgba(20,30,80,0.12)', overflow: 'hidden' }}>
              {/* Ruled lines */}
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(transparent 31px, rgba(232,229,218,0.3) 32px)', backgroundSize: '100% 32px', backgroundPosition: '0 80px', opacity: 0.5 }} />
              {/* Postmark stamp */}
              <div style={{ position: 'absolute', top: 28, right: 28, width: 84, height: 84, borderRadius: '50%', border: '1.5px dashed #E8E5DA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', transform: 'rotate(8deg)', color: 'var(--muted-2)', textAlign: 'center' }}>
                <div className="mono" style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Air mail</div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: 'var(--ink-2)', lineHeight: 1 }}>Oven</div>
                <div className="mono" style={{ fontSize: 8.5, letterSpacing: '0.1em', textTransform: 'uppercase' }}>HQ · 2026</div>
              </div>

              <div style={{ position: 'relative', fontSize: 16.5, color: 'var(--ink-2)', lineHeight: 1.85 }}>
                <div className="serif" style={{ fontSize: 28, marginBottom: 28, color: 'var(--ink)' }}>Dear Oven team,</div>

                <p style={{ marginBottom: 24 }}>
                  My name is{' '}<InlineInput value={form.name} onChange={v => set({ name: v })} placeholder="your name" width={150} />,
                  {' '}and I usually make{' '}<InlineInput value={form.role} onChange={v => set({ role: v })} placeholder="what you build" width={180} />{' '}for a living.
                </p>

                <div style={{ marginBottom: 24 }}>
                  I&apos;ve been baking with you for{' '}
                  <Chips value={form.tenure} onChange={v => set({ tenure: v })} options={['less than a month', '1–6 months', '6–12 months', 'over a year']} />.
                </div>

                <Section label="The thing I love most about Oven is…" example="e.g. the speed, the consistency, the export formats">
                  <textarea style={taStyle} value={form.love || ''} onChange={e => set({ love: e.target.value })} />
                </Section>
                <Section label="But what really bugs me is…" example="be honest — we read every word">
                  <textarea style={taStyle} value={form.frustration || ''} onChange={e => set({ frustration: e.target.value })} />
                </Section>
                <Section label="If you could build me one thing next, it'd be…" example="dream it out loud">
                  <textarea style={taStyle} value={form.wish || ''} onChange={e => set({ wish: e.target.value })} />
                </Section>

                {/* NPS */}
                <div style={{ margin: '34px 0 28px' }}>
                  <div className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>How likely am I to tell a friend?</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    {Array.from({ length: 11 }, (_, i) => i).map(n => (
                      <button key={n} onClick={() => set({ nps: n })} style={{ width: 38, height: 38, borderRadius: 10, background: form.nps === n ? 'var(--blue)' : 'white', color: form.nps === n ? 'white' : 'var(--ink-2)', border: `1px solid ${form.nps === n ? 'var(--blue)' : '#E8E5DA'}`, fontSize: 13.5, fontWeight: 500, transition: 'all .15s', boxShadow: form.nps === n ? '0 4px 12px rgba(59,130,246,0.35)' : 'none', cursor: 'pointer', fontFamily: 'inherit' }}>{n}</button>
                    ))}
                    <span style={{ marginLeft: 12, color: 'var(--muted)', fontSize: 14 }}>
                      {form.nps != null && <span style={{ fontSize: 18, marginRight: 6 }}>{npsEmojis[Math.floor((form.nps / 10) * (npsEmojis.length - 1))]}</span>}
                      {npsLabel}
                    </span>
                  </div>
                </div>

                {/* Opt-ins */}
                <div style={{ margin: '34px 0 32px' }}>
                  <div className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>P.S. — also count me in for</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { k: 'beta' as const, l: 'Early access to unreleased features (style packs, batch jobs, API)' },
                      { k: 'interview' as const, l: 'A 30-minute call with the team to walk you through my workflow' },
                      { k: 'followup' as const, l: 'A reply when you ship something inspired by this letter' },
                    ].map(o => (
                      <label key={o.k} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5 }}>
                        <span onClick={() => set({ [o.k]: !form[o.k] })} style={{ flexShrink: 0, width: 20, height: 20, borderRadius: 6, marginTop: 1, background: form[o.k] ? 'var(--blue)' : 'white', border: `1.5px solid ${form[o.k] ? 'var(--blue)' : '#E8E5DA'}`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s', cursor: 'pointer' }}>
                          {form[o.k] && <CheckIcon />}
                        </span>
                        {o.l}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Signature */}
                <div style={{ marginTop: 40, paddingTop: 28, borderTop: '1px dashed #E8E5DA' }}>
                  <div className="serif" style={{ fontSize: 22, marginBottom: 14, color: 'var(--ink)' }}>Yours,</div>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 38, color: 'var(--blue)', lineHeight: 1, marginBottom: 18, minHeight: 44 }}>{form.name || '—'}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', fontSize: 13.5, color: 'var(--muted)' }}>
                    <span>Reply-to:</span>
                    <InlineInput value={form.email} onChange={v => set({ email: v })} placeholder="you@studio.com" width={220} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                Average reply time: <span style={{ color: 'var(--ink-2)', fontWeight: 500 }}>under 48 hours</span>.
              </div>
              <button onClick={() => setSent(true)} style={{ background: 'var(--ink)', color: 'white', padding: '14px 24px', borderRadius: 100, fontSize: 14.5, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 6px 18px rgba(11,11,14,0.25)', border: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>
                <SendIcon /> Send letter
              </button>
            </div>
          </>
        ) : (
          <ThankYou name={form.name} reset={() => { setForm({}); setSent(false) }} />
        )}
      </main>
    </div>
  )
}
