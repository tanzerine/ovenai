'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

/* ── SVG icons ──────────────────────────────────────── */
const ArrowIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
)
const SparkIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><path d="M7 1.5l1.4 3.7L12 6.5l-3.6 1.3L7 11.5 5.6 7.8 2 6.5l3.6-1.3L7 1.5z" fill="currentColor"/></svg>
)
const SearchIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M9 9l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
)
const DownloadIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><path d="M7 2v7m0 0l-3-3m3 3l3-3M2.5 11.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
)
const HeartIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><path d="M7 12s-4.5-2.7-4.5-6A2.5 2.5 0 017 4a2.5 2.5 0 014.5 2c0 3.3-4.5 6-4.5 6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>
)
const CopyIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><rect x="4.5" y="4.5" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.3"/><path d="M9.5 4.5V3a1 1 0 00-1-1H3a1 1 0 00-1 1v5.5a1 1 0 001 1h1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
)
const CheckIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" {...p}><path d="M2.5 6.5L5 9l4.5-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
)
const CloseIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
)
const SortIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><path d="M3 3v8m0 0l-2-2m2 2l2-2M11 11V3m0 0l-2 2m2-2l2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
)
const ChevIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" {...p}><path d="M2.5 3.5L5 6l2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
)
const ZapIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" {...p}><path d="M7 1L2 7h3l-1 4 5-6H6l1-4z" fill="currentColor"/></svg>
)
const RemixIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" {...p}><path d="M7.5 1l2 1.5L7.5 4M9.5 2.5H4.5a2 2 0 000 4H5M3.5 10l-2-1.5L3.5 7M1.5 8.5H6.5a2 2 0 000-4H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
)

/* ── Data ───────────────────────────────────────────── */
const PACKS = [
  { id: 'all',     name: 'All packs',       count: 1876, sample: '/assets/logo.avif',      bg: '#1A1A1F' },
  { id: 'clay',    name: 'Clay',            count: 412,  sample: '/assets/smile.webp',     bg: '#FFE3D5', accent: '#FB923C', isNew: false },
  { id: 'glass',   name: 'Glass',           count: 284,  sample: '/assets/diamond.webp',   bg: '#DCE9FF', accent: '#3B82F6', isNew: false },
  { id: 'chrome',  name: 'Liquid Chrome',   count: 198,  sample: '/assets/shake.webp',     bg: '#E6EBF2', accent: '#525866', isNew: true },
  { id: 'plush',   name: 'Soft Plush',      count: 156,  sample: '/assets/bear.webp',      bg: '#FFE9F0', accent: '#EC4899', isNew: false },
  { id: 'metal',   name: 'Polished Metal',  count: 224,  sample: '/assets/trophy.webp',    bg: '#FFF4DC', accent: '#D97706', isNew: false },
  { id: 'plastic', name: 'Glossy Plastic',  count: 318,  sample: '/assets/cart.avif',      bg: '#FFE2E5', accent: '#EF4444', isNew: false },
  { id: 'paper',   name: 'Paper Craft',     count: 142,  sample: '/assets/icecream.webp',  bg: '#F0E9DC', accent: '#A16207', isNew: true },
  { id: 'pixel',   name: 'Voxel',           count: 142,  sample: '/assets/cap.webp',       bg: '#E0E7FF', accent: '#6366F1', isNew: false },
] as const

type PackId = typeof PACKS[number]['id']

const ASSETS = [
  { src: '/assets/bear.webp',     n: 'Koala' },
  { src: '/assets/cap.webp',      n: 'Keycap' },
  { src: '/assets/cart.avif',     n: 'Shopping Cart' },
  { src: '/assets/diamond.webp',  n: 'Diamond' },
  { src: '/assets/girl.avif',     n: 'Avatar' },
  { src: '/assets/house.avif',    n: 'Museum' },
  { src: '/assets/icecream.webp', n: 'Ice Cream' },
  { src: '/assets/pig.avif',      n: 'Piggy Bank' },
  { src: '/assets/shake.webp',    n: 'Handshake' },
  { src: '/assets/smile.webp',    n: 'Smile' },
  { src: '/assets/trophy.webp',   n: 'Trophy' },
]

const CATEGORIES = ['All','Commerce','Emoji','Characters','Finance','Objects','Food','Awards','Tech','Symbols']

interface CatalogueItem {
  id: number
  name: string
  src: string
  pack: string
  tag: 'Free' | 'Pro'
  cat: string
  dl: number
  trending: boolean
}

function buildCatalogue(): CatalogueItem[] {
  const variants: { tag: 'Free' | 'Pro'; pack: string }[] = [
    { tag: 'Free', pack: 'clay' },
    { tag: 'Pro',  pack: 'glass' },
    { tag: 'Free', pack: 'plastic' },
    { tag: 'Free', pack: 'metal' },
    { tag: 'Pro',  pack: 'chrome' },
    { tag: 'Free', pack: 'plush' },
    { tag: 'Pro',  pack: 'paper' },
    { tag: 'Free', pack: 'pixel' },
  ]
  const cats = ['Commerce','Emoji','Characters','Finance','Objects','Food','Awards','Tech','Symbols']
  return Array.from({ length: 32 }, (_, i) => {
    const a = ASSETS[i % ASSETS.length]
    const v = variants[i % variants.length]
    return {
      id: i,
      name: a.n,
      src: a.src,
      pack: v.pack,
      tag: v.tag,
      cat: cats[i % cats.length],
      dl: 200 + ((i * 137) % 9800),
      trending: i % 11 === 0,
    }
  })
}

const CATALOGUE = buildCatalogue()
const PACK_META = Object.fromEntries(PACKS.map(p => [p.id, p]))

/* ── Remix helper ───────────────────────────────────── */
function openRemix(src: string, name: string) {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const absoluteSrc = src.startsWith('http') ? src : `${origin}${src}`
  const params = new URLSearchParams()
  params.set('img', absoluteSrc)
  params.set('q', name)
  window.open(`/main?${params.toString()}`, '_blank')
}

/* ── Hero ───────────────────────────────────────────── */
function Hero({ search, setSearch }: { search: string; setSearch: (s: string) => void }) {
  return (
    <section style={{ padding: '64px 24px 40px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 100, background: 'white', border: '1px solid var(--line)', boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 2px 8px rgba(20,30,80,0.04)', fontSize: 12.5, color: 'var(--ink-2)', marginBottom: 28 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--blue)', boxShadow: '0 0 0 3px rgba(59,130,246,0.18)' }} />
          <span className="mono" style={{ fontSize: 11, letterSpacing: '0.08em' }}>1,876 ICONS</span>
          <span style={{ color: 'var(--muted-2)' }}>·</span>
          Free for personal use, MIT for paid
        </div>

        <h1 style={{ fontSize: 'clamp(40px, 6vw, 76px)', lineHeight: 0.98, letterSpacing: '-0.04em', fontWeight: 700, marginBottom: 22 }}>
          The 3D icon <span className="serif" style={{ fontWeight: 400 }}>library</span><br />
          <span style={{ background: 'linear-gradient(135deg, #3B82F6, #7BB0FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>baked &amp; ready</span> to ship.
        </h1>
        <p style={{ fontSize: 17, color: 'var(--muted)', maxWidth: 520, margin: '0 auto 32px', lineHeight: 1.5 }}>
          Curated by our design team. PNG, SVG and GLB. Browse, hover, drag straight into Figma — or grab the whole pack.
        </p>

        <div style={{ display: 'flex', gap: 8, padding: 6, background: 'white', border: '1px solid var(--line)', borderRadius: 100, alignItems: 'center', boxShadow: '0 4px 16px rgba(20,30,80,0.06), 0 0 0 4px rgba(123,176,255,0.08)', maxWidth: 520, margin: '0 auto' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, color: 'var(--muted-2)' }}>
            <SearchIcon width={16} height={16} />
          </span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder='Search 1,876 icons — try "trophy", "coin", "avocado"…'
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14.5, color: 'var(--ink)', fontFamily: 'inherit' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ width: 28, height: 28, borderRadius: 100, background: 'var(--bg)', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
              <CloseIcon width={11} height={11} />
            </button>
          )}
          <button style={{ background: 'var(--ink)', color: 'white', padding: '9px 16px', borderRadius: 100, fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer' }}>
            <kbd className="mono" style={{ fontSize: 10, padding: '1px 5px', borderRadius: 4, background: 'rgba(255,255,255,0.15)', letterSpacing: '0.06em' }}>⌘K</kbd>
          </button>
        </div>
      </div>
    </section>
  )
}

/* ── Pack bar ───────────────────────────────────────── */
function PackBar({ pack, setPack }: { pack: string; setPack: (p: PackId) => void }) {
  return (
    <section style={{ padding: '0 24px 28px' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>◆ Style packs</div>
          <a href="#" style={{ fontSize: 12.5, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            Browse all packs <ArrowIcon />
          </a>
        </div>
        <div className="scroll-hide" style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '4px 0 8px' }}>
          {PACKS.map(p => {
            const active = pack === p.id
            return (
              <button key={p.id} onClick={() => setPack(p.id as PackId)} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12, padding: '8px 18px 8px 8px', borderRadius: 100, background: active ? 'var(--ink)' : 'white', color: active ? 'white' : 'var(--ink-2)', border: active ? '1px solid var(--ink)' : '1px solid var(--line)', transition: 'all .2s', boxShadow: active ? '0 4px 12px rgba(11,11,14,0.18)' : '0 1px 2px rgba(20,30,80,0.04)', cursor: 'pointer' }}>
                <span style={{ width: 36, height: 36, borderRadius: '50%', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.sample} alt="" style={{ width: '80%', height: '80%', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(20,30,80,0.18))' }} />
                </span>
                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {p.name}
                    {'isNew' in p && p.isNew && (
                      <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 100, background: active ? 'rgba(123,176,255,0.25)' : 'var(--blue-soft)', color: active ? '#7BB0FF' : 'var(--blue)', letterSpacing: '0.06em', fontWeight: 600 }}>NEW</span>
                    )}
                  </span>
                  <span className="mono" style={{ fontSize: 10.5, opacity: 0.55, letterSpacing: '0.06em' }}>{p.count.toLocaleString()} icons</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ── Icon card ──────────────────────────────────────── */
function IconCard({ item, onOpen }: { item: CatalogueItem; onOpen: (item: CatalogueItem) => void }) {
  const [hover, setHover] = useState(false)
  const meta = PACK_META[item.pack] || {}
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onOpen(item)}
      style={{ position: 'relative', background: 'white', border: '1px solid var(--line)', borderRadius: 20, padding: 14, cursor: 'pointer', transition: 'transform .25s cubic-bezier(.2,.8,.2,1), box-shadow .25s, border-color .25s', transform: hover ? 'translateY(-4px)' : 'translateY(0)', boxShadow: hover ? '0 18px 36px rgba(20,30,80,0.10), 0 2px 6px rgba(20,30,80,0.05)' : '0 1px 2px rgba(20,30,80,0.03)' }}
    >
      {/* Free/Pro tag */}
      <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2, padding: '3px 9px', borderRadius: 100, fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', background: item.tag === 'Pro' ? 'var(--ink)' : 'var(--blue-soft)', color: item.tag === 'Pro' ? 'white' : 'var(--blue)', textTransform: 'uppercase' }}>{item.tag}</div>

      {/* Trending badge */}
      {item.trending && (
        <div title="Trending this week" style={{ position: 'absolute', top: 12, right: 12, zIndex: 2, width: 22, height: 22, borderRadius: 100, background: 'linear-gradient(135deg, #F59E0B, #F5B400)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(245,180,0,0.4)' }}>
          <ZapIcon />
        </div>
      )}

      {/* Icon plate */}
      <div style={{ aspectRatio: '1', background: ('bg' in meta ? meta.bg : undefined) || '#F4F4EE', borderRadius: 14, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(50% 40% at 35% 25%, rgba(255,255,255,0.55), transparent 70%)', pointerEvents: 'none' }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.src} alt={item.name} style={{ width: '70%', height: '70%', objectFit: 'contain', filter: 'drop-shadow(0 10px 18px rgba(20,30,80,0.20))', transition: 'transform .3s cubic-bezier(.2,.8,.2,1)', transform: hover ? 'scale(1.08) rotate(-4deg)' : 'scale(1)' }} />

        {/* Hover overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(11,11,14,0.55) 100%)', opacity: hover ? 1 : 0, transition: 'opacity .2s', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: 10, pointerEvents: hover ? 'auto' : 'none' }}>
          <button
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', borderRadius: 100, background: 'rgba(255,255,255,0.95)', color: 'var(--ink)', fontSize: 11, fontWeight: 600, backdropFilter: 'blur(8px)', border: 'none', cursor: 'pointer' }}
            onClick={e => { e.stopPropagation(); openRemix(item.src, item.name) }}
          >
            <RemixIcon /> Remix
          </button>
          <button
            style={{ width: 26, height: 26, borderRadius: 100, background: 'rgba(255,255,255,0.95)', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
            onClick={e => { e.stopPropagation() }}
          >
            <HeartIcon width={12} height={12} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em' }}>{item.name}</div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--muted-2)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }}>{'name' in meta ? meta.name : item.pack} · {item.cat}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--muted)' }}>
          <DownloadIcon width={10} height={10} /> {item.dl >= 1000 ? `${(item.dl / 1000).toFixed(1)}k` : item.dl}
        </div>
      </div>
    </div>
  )
}

/* ── Grid ───────────────────────────────────────────── */
function Grid({ search, pack, category, setCategory, onOpen }: {
  search: string; pack: string; category: string;
  setCategory: (c: string) => void; onOpen: (item: CatalogueItem) => void
}) {
  const [sort, setSort] = useState('popular')

  const filtered = useMemo(() => {
    let list = CATALOGUE
    if (pack !== 'all') list = list.filter(i => i.pack === pack)
    if (category !== 'All') list = list.filter(i => i.cat === category)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(i => i.name.toLowerCase().includes(q) || i.cat.toLowerCase().includes(q))
    }
    if (sort === 'popular') list = [...list].sort((a, b) => b.dl - a.dl)
    if (sort === 'new')     list = [...list].sort((a, b) => b.id - a.id)
    if (sort === 'az')      list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    return list
  }, [search, pack, category, sort])

  return (
    <section style={{ padding: '0 24px 80px' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          <div className="scroll-hide" style={{ display: 'flex', gap: 6, overflowX: 'auto', flex: 1, minWidth: 0 }}>
            {CATEGORIES.map(c => {
              const active = c === category
              return (
                <button key={c} onClick={() => setCategory(c)} style={{ flexShrink: 0, padding: '8px 14px', borderRadius: 100, background: active ? 'var(--ink)' : 'white', color: active ? 'white' : 'var(--ink-2)', border: active ? '1px solid var(--ink)' : '1px solid var(--line)', fontSize: 13, fontWeight: 500, transition: 'all .15s', cursor: 'pointer' }}>
                  {c}
                </button>
              )
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em' }}>{filtered.length} RESULTS</span>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 100, background: 'white', border: '1px solid var(--line)', fontSize: 13, color: 'var(--ink-2)' }}>
              <SortIcon />
              <select value={sort} onChange={e => setSort(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', fontFamily: 'inherit', fontSize: 13, color: 'inherit', cursor: 'pointer' }}>
                <option value="popular">Most popular</option>
                <option value="new">Newest</option>
                <option value="az">A → Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cards */}
        {filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 14 }}>
            {filtered.map(it => <IconCard key={it.id} item={it} onOpen={onOpen} />)}
          </div>
        ) : (
          <div style={{ background: 'white', border: '1px dashed var(--line-2)', borderRadius: 22, padding: '60px 28px', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--blue-soft)', margin: '0 auto 18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SearchIcon width={22} height={22} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No icons match &ldquo;{search}&rdquo;</div>
            <p style={{ color: 'var(--muted)', fontSize: 14, maxWidth: 360, margin: '0 auto 20px' }}>
              Can&apos;t find it in the library? Bake a custom render in seconds.
            </p>
            <Link href="/main" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 100, background: 'var(--ink)', color: 'white', fontSize: 13.5, fontWeight: 500 }}>
              <SparkIcon /> Bake it instead
            </Link>
          </div>
        )}

        {filtered.length >= 12 && (
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button style={{ padding: '12px 22px', borderRadius: 100, background: 'white', border: '1px solid var(--line)', fontSize: 13.5, fontWeight: 500, color: 'var(--ink-2)', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 1px 2px rgba(20,30,80,0.04)', cursor: 'pointer' }}>
              Load more icons <ChevIcon />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

/* ── Featured pack ──────────────────────────────────── */
function FeaturedPack() {
  const icons = [
    { src: '/assets/shake.webp',   size: 130, t: 20,  l: '8%',  r: -10, d: 0   },
    { src: '/assets/trophy.webp',  size: 110, t: 130, l: '35%', r: 12,  d: 0.6 },
    { src: '/assets/diamond.webp', size: 140, t: 30,  l: '55%', r: -6,  d: 1.2 },
    { src: '/assets/cap.webp',     size: 96,  t: 180, l: '12%', r: -16, d: 1.8 },
    { src: '/assets/pig.avif',     size: 118, t: 170, l: '62%', r: 14,  d: 0.3 },
  ]
  return (
    <section style={{ padding: '0 24px 80px' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', borderRadius: 28, background: 'linear-gradient(135deg, #0A1430 0%, #1B2A55 100%)', padding: '56px 48px', position: 'relative', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 40, alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(60% 50% at 20% 50%, rgba(123,176,255,0.22), transparent 70%)' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--blue-2)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16, padding: '5px 12px', borderRadius: 100, background: 'rgba(123,176,255,0.12)', border: '1px solid rgba(123,176,255,0.2)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--blue-2)' }} />
            Featured pack · May 2026
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', color: 'white', letterSpacing: '-0.03em', lineHeight: 1.05, fontWeight: 600, marginBottom: 16 }}>
            Liquid Chrome <span className="serif" style={{ fontWeight: 400, color: 'var(--blue-2)' }}>vol. 1</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, lineHeight: 1.55, marginBottom: 28, maxWidth: 440 }}>
            198 brand-new mercury-finish renders. Mirror reflections, soft caustic shadows, studio-grade HDRIs. Designed for hero sections and product splashes.
          </p>
          <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
            <button style={{ background: 'white', color: 'var(--ink)', padding: '12px 20px', borderRadius: 100, fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8, border: 'none', cursor: 'pointer' }}>
              <DownloadIcon /> Download full pack <span className="mono" style={{ fontSize: 11, opacity: 0.55 }}>· 184 MB</span>
            </button>
            <button style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', padding: '12px 20px', borderRadius: 100, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
              Preview all 198
            </button>
          </div>
          <div style={{ display: 'flex', gap: 24, fontSize: 12.5, color: 'rgba(255,255,255,0.55)' }}>
            {[{ l: 'FORMATS', v: 'PNG · SVG · GLB · APNG' }, { l: 'LICENSE', v: 'Commercial OK' }, { l: 'SIZES', v: '512 · 1024 · 2048 px' }].map(s => (
              <div key={s.l}>
                <div className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', marginBottom: 4 }}>{s.l}</div>
                <div style={{ color: 'white' }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative', height: 320, zIndex: 2 }}>
          {icons.map((p, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={p.src} alt="" style={{ position: 'absolute', top: p.t, left: p.l, width: p.size, transform: `rotate(${p.r}deg)`, filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.4))', animation: `float ${4.5 + i * 0.4}s ease-in-out infinite`, animationDelay: `${p.d}s` }} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Formats strip ──────────────────────────────────── */
function Formats() {
  const items = [
    { name: 'PNG',  sub: 'Transparent · up to 2048 px',  i: '🖼' },
    { name: 'SVG',  sub: 'Stylised 2D fallback',          i: '◆' },
    { name: 'GLB',  sub: 'Full 3D mesh for r3f / Three',  i: '◇' },
    { name: 'APNG', sub: 'Looping 360° turntable',        i: '↻' },
  ]
  return (
    <section style={{ padding: '0 24px 80px' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {items.map((it, i) => (
          <div key={i} style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 18, padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--blue-soft)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 600 }}>{it.i}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>{it.name}</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>{it.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── Bake CTA ───────────────────────────────────────── */
function BakeCTA() {
  return (
    <section style={{ padding: '0 24px 80px' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', borderRadius: 28, background: 'linear-gradient(180deg, #FFFFFF 0%, #F4F8FF 100%)', border: '1px solid var(--line)', padding: '56px 48px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/girl.avif" alt="" style={{ position: 'absolute', bottom: -20, left: 40, width: 180, opacity: 0.92, transform: 'rotate(-6deg)', filter: 'drop-shadow(0 16px 30px rgba(20,30,80,0.20))' }} />
        <div style={{ paddingLeft: 220 }}>
          <h2 style={{ fontSize: 'clamp(26px, 3vw, 38px)', letterSpacing: '-0.03em', fontWeight: 600, lineHeight: 1.1, marginBottom: 10 }}>
            Can&apos;t find what you need? <span className="serif" style={{ fontWeight: 400 }}>Bake it.</span>
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 15, maxWidth: 480, lineHeight: 1.5 }}>
            Six seconds per icon. Match any pack&apos;s style automatically. Adds straight to the library.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
          <Link href="/main" style={{ background: 'var(--ink)', color: 'white', padding: '14px 24px', borderRadius: 100, fontSize: 14.5, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
            <SparkIcon /> Bake a custom icon
          </Link>
          <Link href="/pricing" style={{ padding: '12px 24px', borderRadius: 100, fontSize: 13.5, color: 'var(--muted)', textAlign: 'center' }}>
            See pricing →
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── Icon detail drawer ─────────────────────────────── */
function Drawer({ item, onClose }: { item: CatalogueItem | null; onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!item) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [item, onClose])

  if (!item) return null

  const meta = PACK_META[item.pack] || {}
  const slug = item.name.toLowerCase().replace(/\s+/g, '-')
  const embedSrc = `https://cdn.ovenai.com/${slug}@2x.png`

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(11,11,14,0.55)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'flex-end', animation: 'fadeIn .2s ease' }}
      onClick={onClose}
    >
      <div onClick={e => e.stopPropagation()} style={{ width: 'min(520px, 100%)', height: '100%', background: 'var(--bg)', overflowY: 'auto', boxShadow: '-24px 0 60px rgba(11,11,14,0.25)', animation: 'slideIn .25s cubic-bezier(.2,.8,.2,1)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 28px', borderBottom: '1px solid var(--line)', position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 2 }}>
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Icon preview</div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 100, background: 'white', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <CloseIcon />
          </button>
        </div>

        <div style={{ padding: 28 }}>
          {/* Hero plate */}
          <div style={{ aspectRatio: '1.2', borderRadius: 22, background: ('bg' in meta ? meta.bg : undefined) || '#F4F4EE', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(50% 40% at 35% 25%, rgba(255,255,255,0.55), transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: 12, left: 12, padding: '4px 10px', borderRadius: 100, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)', fontSize: 10.5, color: 'var(--ink-2)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, backgroundImage: 'linear-gradient(45deg, #CFCFCC 25%, transparent 25%, transparent 75%, #CFCFCC 75%), linear-gradient(45deg, #CFCFCC 25%, transparent 25%, transparent 75%, #CFCFCC 75%)', backgroundSize: '4px 4px', backgroundPosition: '0 0, 2px 2px' }} />
              Transparent
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.src} alt={item.name} style={{ width: '64%', height: '64%', objectFit: 'contain', filter: 'drop-shadow(0 16px 28px rgba(20,30,80,0.25))', animation: 'float 6s ease-in-out infinite' }} />
          </div>

          {/* Title + remix */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div>
              <h2 style={{ fontSize: 24, letterSpacing: '-0.02em', fontWeight: 600 }}>{item.name}</h2>
              <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em', marginTop: 4, textTransform: 'uppercase' }}>
                {'name' in meta ? meta.name : item.pack} pack · {item.cat} · #{slug}
              </div>
            </div>
            <div style={{ padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', background: item.tag === 'Pro' ? 'var(--ink)' : 'var(--blue-soft)', color: item.tag === 'Pro' ? 'white' : 'var(--blue)', textTransform: 'uppercase' }}>{item.tag}</div>
          </div>

          {/* Remix button */}
          <button
            onClick={() => openRemix(item.src, item.name)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '11px 0', borderRadius: 100, background: 'var(--ink)', color: 'white', fontSize: 13.5, fontWeight: 600, border: 'none', cursor: 'pointer', marginBottom: 20 }}
          >
            <RemixIcon width={13} height={13} /> Remix this icon
          </button>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', background: 'white', border: '1px solid var(--line)', borderRadius: 16, padding: '16px 0', marginBottom: 20 }}>
            {[{ l: 'Downloads', v: item.dl.toLocaleString() }, { l: 'Mesh size', v: '184 KB' }, { l: 'Triangles', v: '12.4k' }].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '0 8px', borderLeft: i > 0 ? '1px solid var(--line)' : 'none' }}>
                <div className="mono" style={{ fontSize: 10, color: 'var(--muted-2)', letterSpacing: '0.08em' }}>{s.l.toUpperCase()}</div>
                <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 4 }}>{s.v}</div>
              </div>
            ))}
          </div>

          {/* Download buttons */}
          <div style={{ marginBottom: 20 }}>
            <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Download</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {[{ f: 'PNG', s: '2048 px · 1.2 MB', primary: true }, { f: 'SVG', s: 'flattened · 14 KB' }, { f: 'GLB', s: '3D mesh · 184 KB' }, { f: 'APNG', s: '360° loop · 1.8 MB' }].map((f, i) => (
                <button key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 14, background: f.primary ? 'var(--ink)' : 'white', color: f.primary ? 'white' : 'var(--ink)', border: f.primary ? 'none' : '1px solid var(--line)', textAlign: 'left', cursor: 'pointer' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em' }}>{f.f}</div>
                    <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>{f.s}</div>
                  </div>
                  <DownloadIcon />
                </button>
              ))}
            </div>
          </div>

          {/* Embed */}
          <div style={{ marginBottom: 20 }}>
            <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Embed</div>
            <div style={{ background: '#0E1320', borderRadius: 14, padding: '14px 16px', fontFamily: 'var(--font-geist-mono), monospace', fontSize: 12, color: '#E2E2DA', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
              <code style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                <span style={{ color: '#7BB0FF' }}>&lt;img</span> <span style={{ color: '#A5D8FF' }}>src</span>=<span style={{ color: '#FFC6A8' }}>&quot;{embedSrc}&quot;</span><span style={{ color: '#7BB0FF' }}> /&gt;</span>
              </code>
              <button
                onClick={() => { navigator.clipboard.writeText(`<img src="${embedSrc}" />`); setCopied(true); setTimeout(() => setCopied(false), 1400) }}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', borderRadius: 100, background: copied ? 'rgba(123,176,255,0.2)' : 'rgba(255,255,255,0.1)', color: copied ? '#7BB0FF' : 'white', fontSize: 11, fontWeight: 500, flexShrink: 0, border: 'none', cursor: 'pointer' }}
              >
                {copied ? <><CheckIcon /> Copied</> : <><CopyIcon /> Copy</>}
              </button>
            </div>
          </div>

          {/* License */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14, background: 'var(--blue-soft)', border: '1px solid var(--blue-tint)' }}>
            <div style={{ width: 32, height: 32, borderRadius: 100, background: 'var(--blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CheckIcon />
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>
              <strong>Commercial license included.</strong>{' '}
              Use in client work, products and decks. No attribution required.
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </div>
  )
}

/* ── Footer ─────────────────────────────────────────── */
function LibraryFooter() {
  return (
    <footer style={{ padding: '40px 24px 32px', borderTop: '1px solid var(--line)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.avif" alt="Oven" style={{ width: 26, height: 26, borderRadius: '50%' }} />
          <span style={{ fontWeight: 600, fontSize: 14 }}>Oven</span>
          <span style={{ fontSize: 12.5, color: 'var(--muted-2)', marginLeft: 8 }}>The future of generative design © 2026</span>
        </div>
        <div style={{ display: 'flex', gap: 24, fontSize: 13, color: 'var(--muted)' }}>
          {['Privacy', 'Terms', 'Status', 'Twitter', 'Discord'].map(l => (
            <a key={l} href="#">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}

/* ── Page ───────────────────────────────────────────── */
function LibraryInner() {
  const [search, setSearch] = useState('')
  const [pack, setPack] = useState<PackId>('all')
  const [category, setCategory] = useState('All')
  const [opened, setOpened] = useState<CatalogueItem | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const src = searchParams.get('open')
    if (!src) return
    const match = CATALOGUE.find(it => it.src === src)
    if (match) setOpened(match)
  }, [searchParams])

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); }
          50%       { transform: translateY(-10px) rotate(var(--r, 0deg)); }
        }
        .scroll-hide::-webkit-scrollbar { display: none; }
        .scroll-hide { scrollbar-width: none; }
      `}</style>
      <div>
        <Hero search={search} setSearch={setSearch} />
        <PackBar pack={pack} setPack={setPack} />
        <Grid search={search} pack={pack} category={category} setCategory={setCategory} onOpen={setOpened} />
        <FeaturedPack />
        <Formats />
        <BakeCTA />
        <LibraryFooter />
        <Drawer item={opened} onClose={() => setOpened(null)} />
      </div>
    </>
  )
}

export default function LibraryPage() {
  return (
    <Suspense>
      <LibraryInner />
    </Suspense>
  )
}
