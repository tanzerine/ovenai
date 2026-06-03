'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type GrovePost = {
  slug: string
  title: string
  excerpt: string
  url: string
  date: string | null
  cover_image_url: string | null
  cover_image_credit: { name: string; profile_url: string } | null
  read_minutes: number
}

type Feed = {
  domain: string
  posts: GrovePost[]
}

const GROVE_BASE = 'https://grove-red.vercel.app'
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

/**
 * Live grove feed widget.
 *
 * Matches ovenai's existing post-grid styling exactly: white card, var(--line)
 * border, 20px radius, hover lift, topic pill in var(--blue-soft), bottom
 * footer with date + read time. Cover image area uses the post's Unsplash
 * cover, with a fallback gradient if the image isn't ready yet.
 *
 * Renders nothing if no grove blog exists for this domain or the fetch fails,
 * so the rest of the page is unaffected.
 */
export default function GroveSection() {
  const [feed, setFeed] = useState<Feed | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const host = window.location.hostname
    if (!host || host === 'localhost') return
    fetch(`${GROVE_BASE}/api/embed/host/${encodeURIComponent(host)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setFeed)
      .catch(() => {})
  }, [])

  if (!feed || feed.posts.length === 0) return null

  return (
    <section style={{ padding: '24px 24px 56px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* widget header */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 24, gap: 16, flexWrap: 'wrap',
        }}>
          <div>
            <div className="mono" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11, color: 'var(--blue)', letterSpacing: '0.14em',
              textTransform: 'uppercase', marginBottom: 8,
            }}>
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--blue)' }} />
              Fresh from the feed
            </div>
            <h2 style={{
              fontSize: 'clamp(22px, 2.6vw, 30px)', fontWeight: 600, margin: 0,
              letterSpacing: '-0.02em', lineHeight: 1.1,
            }}>
              Latest articles
            </h2>
          </div>
          <Link
            href="/blog"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 100,
              background: 'white', border: '1px solid var(--line)',
              fontSize: 13, fontWeight: 500, color: 'var(--ink-2)',
              textDecoration: 'none', transition: 'all .15s',
            }}
          >
            View all <ArrowIcon />
          </Link>
        </div>

        {/* card grid — mirrors existing BlogContent post grid */}
        <div
          className="grove-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}
        >
          {feed.posts.slice(0, 6).map((p) => (
            <Link
              key={p.slug ?? p.url}
              href={p.slug ? `/blog/${p.slug}` : p.url}
              style={{
                background: 'white', border: '1px solid var(--line)',
                borderRadius: 20, overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
                transition: 'transform .25s, box-shadow .25s',
                textDecoration: 'none', color: 'inherit',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 16px 32px rgba(20,30,80,0.08)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.transform = ''
                ;(e.currentTarget as HTMLElement).style.boxShadow = ''
              }}
            >
              {/* cover area */}
              <div style={{
                height: 180, position: 'relative',
                background: p.cover_image_url
                  ? `url(${p.cover_image_url}) center / cover no-repeat`
                  : 'linear-gradient(135deg, #E6F0FF, #DCEEFF)',
              }}>
                {!p.cover_image_url && (
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 36, opacity: 0.5,
                  }}>
                    ◆
                  </div>
                )}
              </div>

              <div style={{
                padding: 24, display: 'flex', flexDirection: 'column', flex: 1,
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: 11.5, color: 'var(--muted)', marginBottom: 12,
                }}>
                  <span style={{
                    color: 'var(--blue)', fontWeight: 600,
                    background: 'var(--blue-soft)', padding: '2px 8px',
                    borderRadius: 100, fontSize: 10.5,
                  }}>
                    Auto
                  </span>
                  {p.date && <span>{formatDate(p.date)}</span>}
                </div>
                <h3 style={{
                  fontSize: 17, letterSpacing: '-0.01em', fontWeight: 600,
                  lineHeight: 1.25, marginBottom: 10,
                }}>
                  {p.title}
                </h3>
                <p style={{
                  fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.55,
                  marginBottom: 18, flex: 1,
                  display: '-webkit-box', WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {p.excerpt}
                </p>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingTop: 14, borderTop: '1px solid var(--line)',
                }}>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                    {p.read_minutes ?? 5} min read
                  </span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    fontSize: 12, color: 'var(--blue)', fontWeight: 500,
                  }}>
                    Read <ArrowIcon />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) { .grove-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 580px) { .grove-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
