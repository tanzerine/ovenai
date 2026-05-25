'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { usePointsStore } from '../store/usePointsStore'
import Image from 'next/image'

/* ── Icons ───────────────────────────────────────────── */
const UploadIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M4 5.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const SparkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1.5l1.4 3.7L12 6.5l-3.6 1.3L7 11.5 5.6 7.8 2 6.5l3.6-1.3L7 1.5z" fill="currentColor" />
  </svg>
)
const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1v8m0 0L4 6m3 3l3-3M2 11.5h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const ScissorsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="3.5" cy="3.5" r="2" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="3.5" cy="10.5" r="2" stroke="currentColor" strokeWidth="1.4" />
    <path d="M5 5l7 5M5 9l7-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)
const RemixIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M11.5 4.5A4.5 4.5 0 003 5.5M2.5 9.5A4.5 4.5 0 0011 8.5M11.5 2v2.5H9M2.5 12V9.5H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)
const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M7 6.5v3.5M7 4.2v0.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

/* ── Field wrapper ───────────────────────────────────── */
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 8, letterSpacing: '-0.005em' }}>{label}</label>
      {children}
      {hint && (
        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--muted-2)', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <span style={{ marginTop: 1, color: 'var(--muted-2)' }}><InfoIcon /></span>
          <span>{hint}</span>
        </div>
      )}
    </div>
  )
}

/* ── Select ──────────────────────────────────────────── */
function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%', padding: '12px 36px 12px 14px', background: 'white', border: '1px solid var(--line)', borderRadius: 12, fontSize: 14, color: 'var(--ink)', appearance: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted)' }}><ChevronIcon /></span>
    </div>
  )
}

/* ── Prompt presets ──────────────────────────────────── */
const PRESETS = [
  { l: 'Human', v: 'a smiling person waving' },
  { l: 'Technology', v: 'a glossy circuit chip' },
  { l: 'Transport', v: 'a tiny clay car' },
  { l: 'Animal', v: 'a koala bear standing up' },
  { l: 'Food', v: 'a strawberry ice cream cone' },
  { l: 'Business', v: 'a leather briefcase' },
]

/* ── Generate page ───────────────────────────────────── */
export default function GeneratePage() {
  const { isSignedIn, user } = useUser()
  const [prompt, setPrompt] = useState('')
  const [preset, setPreset] = useState<string | null>(null)
  const [size, setSize] = useState('1024')
  const [format, setFormat] = useState('PNG')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRemovingBackground, setIsRemovingBackground] = useState(false)
  const [error, setError] = useState('')
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)
  const [removedBgImageUrl, setRemovedBgImageUrl] = useState<string | null>(null)
  const [showOriginal, setShowOriginal] = useState(true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [genProgress, setGenProgress] = useState(0)
  const [genStep, setGenStep] = useState('')
  const [remixImageUrl, setRemixImageUrl] = useState<string | null>(null)
  const [recentRenders, setRecentRenders] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(sessionStorage.getItem('oven_recent_renders') ?? '[]')
    } catch { return [] }
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { points, updatePoints } = usePointsStore()

  const hasResult = !!originalImageUrl

  /* ── Read remix params on mount ─────────────────────── */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('q')
    const img = params.get('img')
    if (q) setPrompt(decodeURIComponent(q))
    if (img) setRemixImageUrl(decodeURIComponent(img))
  }, [])

  /* ── Recent renders ─────────────────────────────────── */
  const addRecentRender = (url: string) => {
    setRecentRenders(prev => {
      const next = [url, ...prev.filter(u => u !== url)].slice(0, 8)
      try { sessionStorage.setItem('oven_recent_renders', JSON.stringify(next)) } catch {}
      return next
    })
  }

  /* ── Handlers (unchanged logic) ─────────────────────── */
  const handleFile = (f: File | null) => { if (f) setImageFile(f) }

  const generateIcon = async () => {
    if (!isSignedIn) { setError('Please sign in to generate icons'); return }
    if (!user || points === null || points < 50) { setError('Not enough points. Please purchase more points.'); return }
    const userEmail = user.primaryEmailAddress?.emailAddress
    if (!userEmail) { setError('No email address found'); return }
    setIsGenerating(true); setIsLoading(true); setIsImageLoaded(false)
    setGenProgress(0); setGenStep('Starting up…')
    setError(''); setOriginalImageUrl(null); setRemovedBgImageUrl(null); setShowOriginal(true)
    const originalPoints = points
    try {
      await updatePoints(userEmail, originalPoints - 50)
      const formData = new FormData()
      formData.append('prompt', `UNGDUNG ${prompt}`)
      formData.append('size', size)
      if (imageFile) formData.append('image', imageFile)
      else if (remixImageUrl) formData.append('imageUrl', remixImageUrl)
      const response = await fetch('/api/generate', { method: 'POST', body: formData })
      const data = await response.json()
      if (response.ok && data.success && data.predictionId) {
        await streamForResult(data.predictionId)
      } else {
        await updatePoints(userEmail, originalPoints)
        throw new Error(data.error || 'Failed to generate icon')
      }
    } catch (err) {
      setError(`An error occurred: ${err instanceof Error ? err.message : String(err)}`)
      try { await updatePoints(userEmail, originalPoints) } catch {}
    }
  }

  const streamForResult = async (predictionId: string) => {
    try {
      const response = await fetch(`/api/stream-prediction?id=${predictionId}`)
      if (!response.body) throw new Error('No stream body')
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buf = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += decoder.decode(value, { stream: true })
        const parts = buf.split('\n\n')
        buf = parts.pop() ?? ''
        for (const chunk of parts) {
          const line = chunk.split('\n').find(l => l.startsWith('data: '))
          if (!line) continue
          try {
            const ev = JSON.parse(line.slice(6))
            if (ev.status === 'completed' && ev.url) {
              setOriginalImageUrl(ev.url); setIsLoading(false)
              setGenProgress(100); setGenStep('Done!')
              addRecentRender(ev.url)
              return
            } else if (ev.status === 'failed') {
              setError(ev.error || 'Generation failed')
              setIsLoading(false); setIsGenerating(false)
              return
            } else if (ev.status === 'processing') {
              setGenProgress(ev.progress ?? 0)
              setGenStep(ev.step ?? '')
            }
          } catch {}
        }
      }
    } catch (err) {
      setError(`Stream error: ${err instanceof Error ? err.message : String(err)}`)
      setIsLoading(false); setIsGenerating(false)
    }
  }

  const removeBackground = async () => {
    if (!originalImageUrl || !user || points === null || points < 50) return
    const userEmail = user.primaryEmailAddress?.emailAddress
    if (!userEmail) return
    setIsRemovingBackground(true); setError('')
    const originalPoints = points
    try {
      await updatePoints(userEmail, originalPoints - 50)
      const response = await fetch('/api/remove-background', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageUrl: originalImageUrl }) })
      const data = await response.json()
      if (response.ok && data.success) { setRemovedBgImageUrl(data.removed_bg_image_url); setShowOriginal(false) }
      else { await updatePoints(userEmail, originalPoints); throw new Error(data.error || 'Failed') }
    } catch (err) {
      setError(`An error occurred: ${err instanceof Error ? err.message : String(err)}`)
      try { await updatePoints(userEmail, originalPoints) } catch {}
    } finally { setIsRemovingBackground(false) }
  }

  const downloadImage = async () => {
    const imageUrl = showOriginal ? originalImageUrl : removedBgImageUrl
    if (!imageUrl) return
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = showOriginal ? 'icon.png' : 'icon-nobg.png'
      document.body.appendChild(a); a.click(); window.URL.revokeObjectURL(url)
    } catch { setError('Failed to download image') }
  }

  /* ── UI ──────────────────────────────────────────────── */
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Light decorations */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/lightray_right.avif" alt="" style={{ position: 'absolute', top: 0, left: 0, width: 'min(36vw, 460px)', pointerEvents: 'none', zIndex: 0 }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/lightfade_left.avif" alt="" style={{ position: 'absolute', top: 0, right: 0, width: 'min(36vw, 460px)', pointerEvents: 'none', zIndex: 0 }} />

      <main style={{ position: 'relative', zIndex: 2, padding: '56px 24px 64px', maxWidth: 1240, margin: '0 auto' }}>
        {/* Page header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--blue)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>◆ Generate</div>
          <h1 style={{ fontSize: 'clamp(36px, 4.4vw, 52px)', letterSpacing: '-0.03em', fontWeight: 600, lineHeight: 1.0 }}>
            Bake a fresh <span className="serif" style={{ fontWeight: 400 }}>3D icon.</span>
          </h1>
          <p style={{ color: 'var(--muted)', marginTop: 12, fontSize: 15 }}>
            Type a prompt, tweak the settings, hit Run. Most icons finish in about six seconds.
          </p>
        </div>

        {/* Two-column panel */}
        <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 28, padding: 36, boxShadow: '0 24px 60px -30px rgba(20,30,80,0.15), 0 1px 0 rgba(255,255,255,0.6) inset' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: 36 }}>

            {/* ── Input column ─────────────────────────── */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, paddingBottom: 18, borderBottom: '1px solid var(--line)' }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' }}>Input</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>Describe what you want and we&apos;ll bake it.</div>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--blue)', fontWeight: 500, padding: '5px 10px', background: 'var(--blue-soft)', borderRadius: 100 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--blue)', display: 'inline-block' }} />
                  {points !== null ? `${points} pts left` : '…'}
                </div>
              </div>

              {/* Helper banner */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', marginBottom: 22, background: 'var(--blue-soft)', border: '1px solid var(--blue-tint)', borderRadius: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: 'var(--blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><SparkIcon /></div>
                <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>Start every prompt with &ldquo;3d icon of&rdquo;</div>
                  <div style={{ color: 'var(--muted)' }}>It&apos;s how Oven recognizes the format and keeps results consistent.</div>
                </div>
              </div>

              <Field label="Prompt" hint="Shorter prompts often render cleaner. Aim for one subject + one or two style words.">
                <textarea
                  rows={3}
                  placeholder="3d icon of …"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', background: 'white', border: '1px solid var(--line)', borderRadius: 12, fontSize: 13.5, resize: 'vertical', lineHeight: 1.5, fontFamily: 'Geist Mono, monospace', outline: 'none', transition: 'border-color .2s, box-shadow .2s', color: 'var(--ink)' }}
                  onFocus={e => { e.target.style.borderColor = 'var(--blue)'; e.target.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.12)' }}
                  onBlur={e => { e.target.style.borderColor = 'var(--line)'; e.target.style.boxShadow = 'none' }}
                />
              </Field>

              {/* Presets */}
              <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 14, padding: 16, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Quick presets</span>
                  <span style={{ fontSize: 11.5, color: 'var(--muted-2)' }}>(click to use)</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {PRESETS.map((p, i) => {
                    const active = preset === p.l
                    return (
                      <button key={i} onClick={() => { setPreset(p.l); setPrompt(`3d icon of ${p.v}`) }} style={{ padding: '6px 12px', borderRadius: 100, background: active ? 'var(--blue)' : 'white', border: `1px solid ${active ? 'var(--blue)' : 'var(--blue-tint)'}`, color: active ? 'white' : 'var(--blue)', fontSize: 12.5, fontWeight: 500, transition: 'all .15s', cursor: 'pointer', fontFamily: 'inherit' }}>
                        {p.l}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Image guidance */}
              <Field label="Guidance image" hint="Used as img2img input. Leave empty for text-only generation.">
                {remixImageUrl && !imageFile ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--blue-soft)', border: '1px solid var(--blue-tint)', borderRadius: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={remixImageUrl} alt="Remix source" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--blue-tint)' }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>Remix source</div>
                        <div style={{ fontSize: 11.5, color: 'var(--blue)' }}>Used as image guidance</div>
                      </div>
                    </div>
                    <button onClick={() => setRemixImageUrl(null)} style={{ width: 28, height: 28, borderRadius: '50%', background: 'white', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--line)', cursor: 'pointer' }}><CloseIcon /></button>
                  </div>
                ) : !imageFile ? (
                  <div
                    onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={e => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]) }}
                    onClick={() => fileInputRef.current?.click()}
                    style={{ padding: '32px 20px', textAlign: 'center', background: isDragging ? 'var(--blue-soft)' : 'white', border: `1.5px dashed ${isDragging ? 'var(--blue)' : 'var(--line-2)'}`, borderRadius: 14, cursor: 'pointer', transition: 'background .2s, border-color .2s' }}
                  >
                    <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={e => handleFile(e.target.files?.[0] ?? null)} />
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--blue-soft)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><UploadIcon /></div>
                    <div style={{ fontSize: 13.5, color: 'var(--ink-2)', fontWeight: 500 }}>Drag and drop an image, or click to browse</div>
                    <div style={{ fontSize: 11.5, color: 'var(--muted-2)', marginTop: 4 }}>PNG, JPG · up to 10 MB</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'white', border: '1px solid var(--line)', borderRadius: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--blue-soft)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><UploadIcon /></div>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{imageFile.name}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--muted-2)' }}>{(imageFile.size / 1024).toFixed(1)} KB</div>
                      </div>
                    </div>
                    <button onClick={() => setImageFile(null)} style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg)', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}><CloseIcon /></button>
                  </div>
                )}
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Size" hint="256, 512, or 1024 px.">
                  <Select value={size} onChange={setSize} options={['256', '512', '1024']} />
                </Field>
                <Field label="Format" hint="Output format.">
                  <Select value={format} onChange={setFormat} options={['PNG', 'JPG', 'WEBP']} />
                </Field>
              </div>

              {error && <p style={{ color: 'var(--bad)', fontSize: 13, marginBottom: 12 }}>{error}</p>}

              <button
                onClick={generateIcon}
                disabled={isGenerating || !prompt.trim()}
                style={{ marginTop: 8, width: '100%', background: isGenerating || !prompt.trim() ? 'var(--blue-soft)' : 'linear-gradient(180deg, #3B82F6, #2563EB)', color: isGenerating || !prompt.trim() ? 'var(--blue)' : 'white', padding: '14px 18px', borderRadius: 14, fontSize: 14.5, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: isGenerating || !prompt.trim() ? 'none' : '0 6px 16px rgba(37,99,235,0.35), inset 0 1px 0 rgba(255,255,255,0.25)', border: 'none', fontFamily: 'inherit', cursor: isGenerating || !prompt.trim() ? 'not-allowed' : 'pointer', transition: 'all .2s' }}
              >
                <SparkIcon /> {isGenerating ? 'Baking…' : 'Run · 50 credit'}
              </button>
            </div>

            {/* Divider */}
            <div style={{ background: 'var(--line)' }} />

            {/* ── Output column ────────────────────────── */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, paddingBottom: 18, borderBottom: '1px solid var(--line)' }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' }}>Output</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>
                    {isGenerating ? 'Baking your icon…' : hasResult ? 'Ready to download.' : 'Press Run to see the result.'}
                  </div>
                </div>
                {isGenerating && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--blue)', fontWeight: 500 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid var(--blue-tint)', borderTopColor: 'var(--blue)', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                    ~6s remaining
                  </div>
                )}
              </div>

              {/* Preview box */}
              <div style={{ aspectRatio: '1', borderRadius: 16, background: hasResult ? 'white' : '#EFEFEC', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', marginBottom: 16 }}>
                {hasResult && (
                  <button
                    onClick={() => {
                      const p = new URLSearchParams()
                      if (prompt) p.set('q', encodeURIComponent(prompt))
                      if (originalImageUrl) p.set('img', encodeURIComponent(originalImageUrl))
                      window.open(`/main?${p.toString()}`, '_blank')
                    }}
                    style={{ position: 'absolute', top: 12, right: 12, zIndex: 2, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 100, background: 'white', color: 'var(--ink-2)', border: '1px solid var(--line)', fontSize: 12.5, fontWeight: 500, boxShadow: '0 4px 10px rgba(20,30,80,0.08)', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    <RemixIcon /> Remix
                  </button>
                )}
                {isLoading ? (
                  <div style={{ padding: '0 24px', width: '100%' }}>
                    {/* Label + percentage */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>Generating…</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--blue)' }}>{genProgress}%</span>
                    </div>
                    {/* Progress bar */}
                    <div style={{ height: 6, background: 'var(--line)', borderRadius: 100, overflow: 'hidden', marginBottom: 10 }}>
                      <div style={{ height: '100%', width: `${genProgress}%`, background: 'linear-gradient(90deg, #7BB0FF, #3B82F6)', borderRadius: 100, transition: 'width 0.6s ease' }} />
                    </div>
                    {/* Step text */}
                    <div style={{ fontSize: 11.5, color: 'var(--muted-2)', fontFamily: 'var(--font-geist-mono)', minHeight: 16 }}>{genStep}</div>
                  </div>
                ) : ((showOriginal && originalImageUrl) || (!showOriginal && removedBgImageUrl)) ? (
                  <Image
                    src={(showOriginal ? originalImageUrl : removedBgImageUrl)!}
                    alt="Generated icon"
                    fill
                    style={{ objectFit: 'contain' }}
                    className={`transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoadingComplete={() => { setIsImageLoaded(true); setIsLoading(false); setIsGenerating(false) }}
                    onError={() => { setError('Failed to load image.'); setIsLoading(false); setIsGenerating(false) }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--muted-2)' }}>
                    <div style={{ width: 56, height: 56, margin: '0 auto 14px', borderRadius: '50%', background: 'white', border: '1px dashed var(--line-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-2)' }}><SparkIcon /></div>
                    <div style={{ fontSize: 13 }}>Press Run to see results</div>
                  </div>
                )}
              </div>

              {/* Action bar */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Download', icon: <DownloadIcon />, onClick: downloadImage, disabled: !hasResult },
                  { label: 'Make it 3D', icon: <SparkIcon />, onClick: () => {}, disabled: !hasResult },
                  { label: isRemovingBackground ? 'Removing…' : 'Remove BG', icon: <ScissorsIcon />, onClick: removeBackground, disabled: !hasResult || isRemovingBackground },
                ].map((btn, i) => (
                  <button
                    key={i}
                    onClick={btn.onClick}
                    disabled={btn.disabled}
                    style={{ padding: '12px 14px', borderRadius: 12, background: i === 0 && hasResult ? 'var(--ink)' : 'white', color: i === 0 && hasResult ? 'white' : hasResult ? 'var(--ink-2)' : 'var(--muted-2)', border: i === 0 ? 'none' : '1px solid var(--line)', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: btn.disabled ? 'not-allowed' : 'pointer', opacity: btn.disabled ? 0.5 : 1, fontFamily: 'inherit', transition: 'all .2s' }}
                  >
                    {btn.icon} {btn.label}
                  </button>
                ))}
              </div>

              {/* Recent renders */}
              <div style={{ marginTop: 28 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Recent renders</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                  {recentRenders.length > 0
                    ? recentRenders.slice(0, 8).map((src, i) => (
                        <div
                          key={i}
                          onClick={() => { setOriginalImageUrl(src); setRemovedBgImageUrl(null); setShowOriginal(true); setIsImageLoaded(false) }}
                          style={{ aspectRatio: '1', borderRadius: 12, background: 'white', border: `1px solid ${src === originalImageUrl ? 'var(--blue)' : 'var(--line)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform .2s, box-shadow .2s', boxShadow: src === originalImageUrl ? '0 0 0 2px var(--blue-tint)' : 'none' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = src === originalImageUrl ? '0 0 0 2px var(--blue-tint)' : '0 6px 14px rgba(20,30,80,0.08)' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = src === originalImageUrl ? '0 0 0 2px var(--blue-tint)' : '' }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt="" style={{ width: '75%', height: '75%', objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(20,30,80,0.10))' }} />
                        </div>
                      ))
                    : Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} style={{ aspectRatio: '1', borderRadius: 12, background: 'var(--line)', border: '1px solid var(--line-2)' }} />
                      ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: 64, textAlign: 'center', maxWidth: 720, margin: '64px auto 0', fontSize: 12.5, color: 'var(--muted-2)', lineHeight: 1.6 }}>
          The information provided on this website is for general purposes only. Oven does not guarantee the accuracy or reliability of any content. Commercial availability and features may change without notice.
        </div>
      </main>
    </div>
  )
}
