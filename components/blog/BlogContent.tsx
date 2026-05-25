'use client'

import { useState } from 'react'
import Link from 'next/link'

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.4" />
    <path d="M9 9l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

const POSTS = [
  { title: 'How we trained Oven on 800k 3D renders without losing the soul', excerpt: 'A peek inside the data pipeline, the rendering rig that almost burnt down our office, and how we keep output from drifting into uncanny-valley plastic.', cover: '/assets/diamond.webp', bg: '#E6F0FF', topic: 'Engineering', author: 'Mira Patel', date: 'May 22, 2026', read: '8 min' },
  { title: 'A field guide to writing prompts that bake clean icons', excerpt: 'Subject + style + lighting + format. Why two extra words can save you ten retries, with side-by-side examples for ten common categories.', cover: '/assets/trophy.webp', bg: '#FFF4DC', topic: 'Tutorial', author: 'Jonah Reed', date: 'May 18, 2026', read: '6 min' },
  { title: 'Style memory is here — lock your brand once, forget about it', excerpt: 'Train Oven on a handful of your existing assets and every render that follows matches your system.', cover: '/assets/shake.webp', bg: '#EAE3FF', topic: 'Product', author: 'Amelie Brun', date: 'May 10, 2026', read: '4 min' },
  { title: 'Designers we love: five people changing how 3D feels in product UI', excerpt: "Profiles of five working designers — what they make, how they ship, and the corner of the craft they're quietly moving forward.", cover: '/assets/icecream.webp', bg: '#FFE4EC', topic: 'Community', author: 'Theo Mensah', date: 'May 4, 2026', read: '12 min' },
  { title: 'GLB export, explained: when (and when not) to ship a real 3D asset', excerpt: "Transparent PNG is still the right answer 90% of the time. Here's the 10% where a GLB pulls real weight.", cover: '/assets/cap.webp', bg: '#DCEEFF', topic: 'Tutorial', author: 'Wei Lin', date: 'April 28, 2026', read: '7 min' },
  { title: "Behind the rebrand: why Oven's logo is a circle and nothing else", excerpt: "Eighteen rounds, two dropped concepts, and the surprisingly hot debate about whether you're allowed to put text inside a tiny circle.", cover: '/assets/cart.avif', bg: '#E8F0FF', topic: 'Design', author: 'Sasha K.', date: 'April 19, 2026', read: '9 min' },
  { title: "What we're shipping next quarter — a rough sketch", excerpt: 'API, animated APNG sequences, batch jobs, multi-seat workspaces. The order we\'re tackling them and why.', cover: '/assets/pig.avif', bg: '#FFE6F0', topic: 'Product', author: 'Mira Patel', date: 'April 11, 2026', read: '5 min' },
]

const TOPICS = ['All', 'Product', 'Engineering', 'Tutorial', 'Design', 'Community']

const avatarInitials = (name: string) => name.split(' ').map(s => s[0]).join('')

export default function BlogContent() {
  const [topic, setTopic] = useState('All')
  const [search, setSearch] = useState('')
  const featured = POSTS[0]
  const rest = POSTS.slice(1).filter(p => {
    const matchesTopic = topic === 'All' || p.topic === topic
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase())
    return matchesTopic && matchesSearch
  })

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/lightray_right.avif" alt="" style={{ position: 'absolute', top: 0, left: 0, width: 'min(36vw, 460px)', pointerEvents: 'none', zIndex: 0 }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/lightfade_left.avif" alt="" style={{ position: 'absolute', top: 0, right: 0, width: 'min(36vw, 460px)', pointerEvents: 'none', zIndex: 0 }} />

      <main style={{ position: 'relative', zIndex: 2 }}>
        {/* Hero */}
        <section style={{ padding: '64px 24px 40px', textAlign: 'center' }}>
          <div className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--blue)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>◆ Blog</div>
          <h1 style={{ fontSize: 'clamp(40px, 5.2vw, 64px)', letterSpacing: '-0.035em', fontWeight: 600, lineHeight: 0.98, marginBottom: 18 }}>
            Notes from the <span className="serif" style={{ fontWeight: 400 }}>oven.</span>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--muted)', maxWidth: 560, margin: '0 auto', lineHeight: 1.5 }}>
            Field reports, build logs, prompt cheatsheets, and the occasional opinion about how the future of design tooling should feel.
          </p>
        </section>

        {/* Featured post */}
        <section style={{ padding: '0 24px 56px' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <Link href="#" style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', background: 'white', border: '1px solid var(--line)', borderRadius: 28, overflow: 'hidden', boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 24px rgba(20,30,80,0.04)', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: featured.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, minHeight: 420, position: 'relative' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featured.cover} alt="" style={{ width: '60%', maxWidth: 280, objectFit: 'contain', filter: 'drop-shadow(0 16px 32px rgba(20,30,80,0.18))' }} />
                <div style={{ position: 'absolute', top: 24, left: 24, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 100, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', fontSize: 11, fontWeight: 600, color: 'var(--ink-2)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>★ Featured</div>
              </div>
              <div style={{ padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--muted)', marginBottom: 18 }}>
                  <span style={{ color: 'var(--blue)', fontWeight: 600, background: 'var(--blue-soft)', padding: '3px 9px', borderRadius: 100, fontSize: 11 }}>{featured.topic}</span>
                  <span>{featured.date}</span>
                  <span style={{ color: 'var(--muted-2)' }}>·</span>
                  <span>{featured.read} read</span>
                </div>
                <h2 style={{ fontSize: 'clamp(24px, 2.6vw, 34px)', letterSpacing: '-0.02em', fontWeight: 600, lineHeight: 1.15, marginBottom: 18 }}>{featured.title}</h2>
                <p style={{ fontSize: 15.5, color: 'var(--muted)', lineHeight: 1.55, marginBottom: 26 }}>{featured.excerpt}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, hsl(200, 70%, 70%), hsl(240, 70%, 60%))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 600 }}>{avatarInitials(featured.author)}</div>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{featured.author}</span>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--blue)', fontSize: 14, fontWeight: 500 }}>Read article <ArrowIcon /></span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Post grid */}
        <section style={{ padding: '0 24px 80px' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            {/* Topics + search */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, gap: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {TOPICS.map(t => (
                  <button key={t} onClick={() => setTopic(t)} style={{ padding: '8px 14px', borderRadius: 100, background: topic === t ? 'var(--ink)' : 'white', color: topic === t ? 'white' : 'var(--ink-2)', border: `1px solid ${topic === t ? 'var(--ink)' : 'var(--line)'}`, fontSize: 13, fontWeight: 500, transition: 'all .15s', cursor: 'pointer', fontFamily: 'inherit' }}>{t}</button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'white', border: '1px solid var(--line)', borderRadius: 100, color: 'var(--muted)', fontSize: 13 }}>
                <SearchIcon />
                <input
                  placeholder="Search articles…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ border: 'none', background: 'transparent', fontSize: 13, width: 160, color: 'var(--ink)', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            {/* Grid */}
            {rest.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                {rest.map((p, i) => (
                  <Link key={i} href="#" style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform .25s, box-shadow .25s', textDecoration: 'none', color: 'inherit' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 32px rgba(20,30,80,0.08)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '' }}
                  >
                    <div style={{ background: p.bg, padding: 32, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.cover} alt="" style={{ width: '50%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 12px 20px rgba(20,30,80,0.18))' }} />
                    </div>
                    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: 'var(--muted)', marginBottom: 12 }}>
                        <span style={{ color: 'var(--blue)', fontWeight: 600, background: 'var(--blue-soft)', padding: '2px 8px', borderRadius: 100, fontSize: 10.5 }}>{p.topic}</span>
                        <span>{p.date}</span>
                      </div>
                      <h3 style={{ fontSize: 17, letterSpacing: '-0.01em', fontWeight: 600, lineHeight: 1.25, marginBottom: 10 }}>{p.title}</h3>
                      <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.55, marginBottom: 18, flex: 1 }}>{p.excerpt}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid var(--line)' }}>
                        <span style={{ fontSize: 12, color: 'var(--muted)' }}>{p.author}</span>
                        <span style={{ fontSize: 12, color: 'var(--muted-2)' }}>{p.read} read</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{ padding: '64px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
                No articles in this topic yet — check back soon.
              </div>
            )}
          </div>
        </section>

        {/* Newsletter */}
        <section style={{ padding: '0 24px 100px' }}>
          <div style={{ maxWidth: 760, margin: '0 auto', background: 'white', border: '1px solid var(--line)', borderRadius: 24, padding: '48px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(60% 80% at 50% 0%, rgba(123,176,255,0.18), transparent 70%)' }} />
            <div style={{ position: 'relative' }}>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 32px)', letterSpacing: '-0.02em', fontWeight: 600, lineHeight: 1.1, marginBottom: 10 }}>
                New posts in your inbox <span className="serif" style={{ fontWeight: 400 }}>monthly.</span>
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: 14.5, marginBottom: 24 }}>No noise. One letter every four weeks. Unsubscribe with a single click.</p>
              <form onSubmit={e => e.preventDefault()} style={{ display: 'inline-flex', gap: 6, padding: 5, background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 100, alignItems: 'center' }}>
                <input type="email" placeholder="you@studio.com" style={{ border: 'none', background: 'transparent', padding: '8px 14px', fontSize: 13.5, width: 240, outline: 'none', fontFamily: 'inherit', color: 'var(--ink)' }} />
                <button type="submit" style={{ background: 'var(--ink)', color: 'white', padding: '9px 18px', borderRadius: 100, fontSize: 13.5, fontWeight: 500, border: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>Subscribe</button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
