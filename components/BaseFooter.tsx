import React from 'react'
import Link from 'next/link'

const FOOTER_LINKS = ['Privacy', 'Terms', 'Status', 'Twitter', 'Discord']

export default function BaseFooter() {
  return (
    <footer style={{ padding: '40px 24px 32px', borderTop: '1px solid var(--line)' }}>
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20,
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Oven AI"
            style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover' }}
          />
          <span style={{ fontWeight: 600, fontSize: 14 }}>Oven</span>
          <span
            style={{ fontSize: 12.5, color: 'var(--muted-2)', marginLeft: 8 }}
          >
            The future of generative design © 2026
          </span>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: 24, fontSize: 13, color: 'var(--muted)' }}>
          {FOOTER_LINKS.map((l) => (
            <Link
              key={l}
              href="#"
              style={{ color: 'var(--muted)', transition: 'color .2s' }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = 'var(--ink)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = 'var(--muted)')
              }
            >
              {l}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
