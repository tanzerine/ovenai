'use client'

import { useEffect } from 'react'

/**
 * First-party read tracking for the server-rendered article pages.
 *
 * The blog LIST page renders through grove's embed, which tracks reads on its
 * own — but Google sends readers straight to /blog/[slug], which is rendered
 * here and was invisible to grove. Result: Search Console showed 67 clicks in
 * a month while grove counted 6 visits, and grove's strategy loop (which feeds
 * on reads) was optimizing on nothing.
 *
 * Mirrors embed.js's tracker: view on mount, dwell every 15s, scroll depth
 * milestones, exit beacon. grove's /api/track is CORS-open and drops bot UAs
 * server-side; no cookies, no third-party JS.
 */

const TRACK_ENDPOINT = 'https://grove-red.vercel.app/api/track'

export default function GroveTracker({
  postId,
  domainId,
}: {
  postId?: string | null
  domainId?: string | null
}) {
  useEffect(() => {
    if (!postId || !domainId) return

    let sid: string | null = null
    try { sid = sessionStorage.getItem('gv_sid') } catch {}
    if (!sid) {
      sid = Math.random().toString(36).slice(2) + Date.now().toString(36)
      try { sessionStorage.setItem('gv_sid', sid) } catch {}
    }

    const utm: Record<string, string> = {}
    try {
      const q = new URLSearchParams(location.search)
      for (const k of ['source', 'medium', 'campaign']) {
        const v = q.get('utm_' + k)
        if (v) utm['utm_' + k] = v
      }
    } catch {}

    const post = (extra: Record<string, unknown>) => {
      const body = JSON.stringify({
        ...utm,
        post_id: postId,
        domain_id: domainId,
        session_id: sid,
        referrer: document.referrer || undefined,
        ...extra,
      })
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon(TRACK_ENDPOINT, new Blob([body], { type: 'application/json' }))
          return
        }
      } catch {}
      try {
        fetch(TRACK_ENDPOINT, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body,
          keepalive: true,
        }).catch(() => {})
      } catch {}
    }

    post({ type: 'view' })

    const start = Date.now()
    const sentDepths: Record<number, boolean> = {}
    const dwellTimer = setInterval(() => post({ type: 'dwell', dwell_ms: Date.now() - start }), 15000)

    const onScroll = () => {
      const h = document.documentElement
      const max = ((h.scrollTop + h.clientHeight) / (h.scrollHeight || 1)) * 100
      for (const d of [25, 50, 75, 100]) {
        if (max >= d && !sentDepths[d]) {
          sentDepths[d] = true
          post({ type: 'scroll', scroll_depth: d })
        }
      }
    }
    const onExit = () => post({ type: 'exit', dwell_ms: Date.now() - start })

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pagehide', onExit)
    return () => {
      clearInterval(dwellTimer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pagehide', onExit)
    }
  }, [postId, domainId])

  return null
}
