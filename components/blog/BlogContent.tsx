'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { GrovePost } from '@/lib/grove'

const PER_PAGE = 9

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

const formatDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''

const avatarInitials = (name: string) =>
  name.split(' ').filter(Boolean).slice(0, 2).map(s => s[0]?.toUpperCase()).join('')

// Deterministic soft cover for posts without an image, so cards never look bare.
const COVER_BGS = ['#E6F0FF', '#EAE3FF', '#FFE4EC', '#FFF4DC', '#DCEEFF', '#E8F0FF']
const bgFor = (s: string) => {
  let h = 0
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return COVER_BGS[h % COVER_BGS.length]
}

function Cover({ post, height }: { post: GrovePost; height: number }) {
  if (post.cover_image_url) {
    return (
      <div style={{ height, background: `url(${post.cover_image_url}) center / cover no-repeat` }} />
    )
  }
  return (
    <div style={{ height, background: bgFor(post.slug), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 600, color: 'rgba(28,28,34,0.32)' }}>
      {(post.title?.[0] ?? '◆').toUpperCase()}
    </div>
  )
}

function GenreBadge({ genre }: { genre: string | null }) {
  return (
    <span style={{ color: 'var(--blue)', fontWeight: 600, background: 'var(--blue-soft)', padding: '2px 8px', borderRadius: 100, fontSize: 10.5 }}>
      {genre || 'Article'}
    </span>
  )
}

export default function BlogContent({ grovePosts = [] }: { grovePosts?: GrovePost[] }) {
  const [genre, setGenre] = useState('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const genres = useMemo(() => {
    const set: string[] = []
    for (const p of grovePosts) {
      const g = p.genre || 'Article'
      if (!set.includes(g)) set.push(g)
    }
    return ['All', ...set]
  }, [grovePosts])

  // newest first from the API; pin the most recent as featured on the default view
  const featured = grovePosts[0] ?? null
  const isDefaultView = genre === 'All' && !search.trim()

  const filtered = useMemo(() => {
    const pool = isDefaultView ? grovePosts.slice(1) : grovePosts
    const q = search.trim().toLowerCase()
    return pool.filter(p => {
      const matchesGenre = genre === 'All' || (p.genre || 'Article') === genre
      const matchesSearch = !q || p.title.toLowerCase().includes(q) || (p.excerpt ?? '').toLowerCase().includes(q)
      return matchesGenre && matchesSearch
    })
  }, [grovePosts, genre, search, isDefaultView])

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, pages)
  const pageItems = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)

  const reset = (fn: () => void) => { fn(); setPage(1) }

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

        {grovePosts.length === 0 ? (
          <section style={{ padding: '0 24px 100px' }}>
            <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', color: 'var(--muted)', fontSize: 15, padding: '64px 0' }}>
              New articles are on the way — check back soon.
            </div>
          </section>
        ) : (
          <>
            {/* Featured — most recent, wide card */}
            {featured && isDefaultView && current === 1 && (
              <section style={{ padding: '0 24px 48px' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                  <Link href={`/blog/${featured.slug}`} className="m-blog-featured" style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', background: 'white', border: '1px solid var(--line)', borderRadius: 28, overflow: 'hidden', boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 24px rgba(20,30,80,0.04)', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ position: 'relative', minHeight: 420, background: featured.cover_image_url ? `url(${featured.cover_image_url}) center / cover no-repeat` : bgFor(featured.slug), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {!featured.cover_image_url && (
                        <span style={{ fontSize: 96, fontWeight: 600, color: 'rgba(28,28,34,0.28)' }}>{(featured.title?.[0] ?? '◆').toUpperCase()}</span>
                      )}
                      <div style={{ position: 'absolute', top: 24, left: 24, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 100, background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(10px)', fontSize: 11, fontWeight: 600, color: 'var(--ink-2)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>★ Featured</div>
                    </div>
                    <div style={{ padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--muted)', marginBottom: 18 }}>
                        <GenreBadge genre={featured.genre} />
                        <span>{formatDate(featured.date)}</span>
                        <span style={{ color: 'var(--muted-2)' }}>·</span>
                        <span>{featured.read_minutes ?? 5} min read</span>
                      </div>
                      <h2 style={{ fontSize: 'clamp(24px, 2.6vw, 34px)', letterSpacing: '-0.02em', fontWeight: 600, lineHeight: 1.15, marginBottom: 18 }}>{featured.title}</h2>
                      <p style={{ fontSize: 15.5, color: 'var(--muted)', lineHeight: 1.55, marginBottom: 26 }}>{featured.excerpt}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {featured.author && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, hsl(200, 70%, 70%), hsl(240, 70%, 60%))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 600 }}>{avatarInitials(featured.author)}</div>
                            <span style={{ fontSize: 13, fontWeight: 500 }}>{featured.author}</span>
                          </div>
                        )}
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--blue)', fontSize: 14, fontWeight: 500 }}>Read article <ArrowIcon /></span>
                      </div>
                    </div>
                  </Link>
                </div>
              </section>
            )}

            {/* Filter + search + grid */}
            <section style={{ padding: '0 24px 80px' }}>
              <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {genres.map(t => (
                      <button key={t} onClick={() => reset(() => setGenre(t))} style={{ padding: '8px 14px', borderRadius: 100, background: genre === t ? 'var(--ink)' : 'white', color: genre === t ? 'white' : 'var(--ink-2)', border: `1px solid ${genre === t ? 'var(--ink)' : 'var(--line)'}`, fontSize: 13, fontWeight: 500, transition: 'all .15s', cursor: 'pointer', fontFamily: 'inherit' }}>{t}</button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'white', border: '1px solid var(--line)', borderRadius: 100, color: 'var(--muted)', fontSize: 13 }}>
                    <SearchIcon />
                    <input
                      placeholder="Search articles…"
                      value={search}
                      onChange={e => reset(() => setSearch(e.target.value))}
                      style={{ border: 'none', background: 'transparent', fontSize: 13, width: 160, color: 'var(--ink)', outline: 'none', fontFamily: 'inherit' }}
                    />
                  </div>
                </div>

                {pageItems.length > 0 ? (
                  <div className="m-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                    {pageItems.map(p => (
                      <Link key={p.slug} href={`/blog/${p.slug}`} style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform .25s, box-shadow .25s', textDecoration: 'none', color: 'inherit' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 32px rgba(20,30,80,0.08)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '' }}
                      >
                        <Cover post={p} height={180} />
                        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: 'var(--muted)', marginBottom: 12 }}>
                            <GenreBadge genre={p.genre} />
                            {p.date && <span>{formatDate(p.date)}</span>}
                          </div>
                          <h3 style={{ fontSize: 17, letterSpacing: '-0.01em', fontWeight: 600, lineHeight: 1.25, marginBottom: 10 }}>{p.title}</h3>
                          <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.55, marginBottom: 18, flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.excerpt}</p>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid var(--line)' }}>
                            <span style={{ fontSize: 12, color: 'var(--muted)' }}>{p.author || `${p.read_minutes ?? 5} min read`}</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--blue)', fontWeight: 500 }}>Read <ArrowIcon /></span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '64px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
                    No articles match{search.trim() ? ` “${search.trim()}”` : ''}.{' '}
                    <button onClick={() => reset(() => { setGenre('All'); setSearch('') })} style={{ background: 'none', border: 'none', color: 'var(--blue)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>Clear filters</button>
                  </div>
                )}

                {pages > 1 && (
                  <nav aria-label="Pages" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, marginTop: 44 }}>
                    <button onClick={() => setPage(current - 1)} disabled={current <= 1} style={pageBtn(current <= 1)}>← Newer</button>
                    <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>Page {current} / {pages}</span>
                    <button onClick={() => setPage(current + 1)} disabled={current >= pages} style={pageBtn(current >= pages)}>Older →</button>
                  </nav>
                )}
              </div>
            </section>
          </>
        )}

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

      <style>{`
        @media (max-width: 880px) { .m-3col { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 760px) { .m-blog-featured { grid-template-columns: 1fr !important; } }
        @media (max-width: 580px) { .m-3col { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}

function pageBtn(disabled: boolean): React.CSSProperties {
  return {
    fontFamily: 'inherit', fontSize: 13, color: disabled ? 'var(--muted-2)' : 'var(--blue)',
    background: 'white', border: '1px solid var(--line)', borderRadius: 100,
    padding: '8px 16px', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.6 : 1,
  }
}
