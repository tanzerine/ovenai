'use client'

import { useEffect, useState } from 'react'

type GrovePost = {
  slug: string
  title: string
  excerpt: string
  url: string          // fallback to grove's URL if /blog/[slug] route not wired
  date: string | null
}

type Feed = {
  domain: string
  posts: GrovePost[]
}

const GROVE_BASE = 'https://grove-red.vercel.app'

/**
 * Live feed of articles published via grove (the autopilot blog engine).
 *
 * Zero config — grove looks up your blog by the current window.location.hostname.
 * Renders nothing if there's no blog for this domain or the fetch fails, so the
 * rest of the page is unaffected.
 */
export default function GroveSection() {
  const [feed, setFeed] = useState<Feed | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const host = window.location.hostname
    if (!host || host === 'localhost') return

    fetch(`${GROVE_BASE}/api/embed/host/${encodeURIComponent(host)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(`HTTP ${r.status}`)))
      .then(setFeed)
      .catch(() => { /* silent — section just doesn't render */ })
  }, [])

  if (!feed || feed.posts.length === 0) return null

  return (
    <section style={{ padding: '24px 24px 56px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--blue)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>
              🌱 Fresh from the feed
            </div>
            <h2 style={{ fontSize: 'clamp(22px, 2.4vw, 30px)', fontWeight: 600, margin: 0, letterSpacing: '-0.02em' }}>
              Latest articles
            </h2>
          </div>
          <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
            {feed.posts.length} new
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {feed.posts.map((p) => (
            <a
              key={p.slug ?? p.url}
              // local URL keeps users on oveners.com, gives us SEO credit
              href={p.slug ? `/blog/${p.slug}` : p.url}
              rel="noreferrer"
              style={{
                display: 'flex', flexDirection: 'column',
                padding: 22, borderRadius: 14,
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(0,0,0,0.06)',
                textDecoration: 'none', color: 'inherit',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 24px -12px rgba(0,0,0,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div className="mono" style={{ fontSize: 11, color: 'var(--blue)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                {p.date ? new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.3, margin: '0 0 8px', letterSpacing: '-0.015em' }}>
                {p.title}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.5, margin: 0, flex: 1 }}>
                {p.excerpt}
              </p>
              <span className="mono" style={{ fontSize: 11, color: 'var(--blue)', marginTop: 14 }}>
                Read →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
