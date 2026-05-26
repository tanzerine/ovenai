'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, SignInButton, UserButton } from '@clerk/nextjs'
import { usePointsStore } from '@/app/store/usePointsStore'
import { useRouter } from 'next/navigation'

const NAV_LINKS = [
  { label: 'Generate', href: '/main' },
  { label: 'Library', href: '/library' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'Feedback', href: '/feedback' },
]

export default function BaseNavbar() {
  const pathname = usePathname()
  const { isSignedIn, user } = useUser()
  const router = useRouter()
  const { points, fetchPoints } = usePointsStore()

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchPoints(user.primaryEmailAddress.emailAddress).catch(() => {})
    }
  }, [user, fetchPoints])

  return (
    <div
      style={{
        position: 'sticky',
        top: 16,
        zIndex: 50,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 16px',
      }}
    >
      <nav
        style={{
          width: '100%',
          maxWidth: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#1A1A1F',
          color: 'white',
          borderRadius: 100,
          padding: '10px 14px 10px 22px',
          boxShadow:
            '0 10px 30px -8px rgba(11,11,14,0.25), 0 2px 6px rgba(11,11,14,0.10)',
        }}
      >
        {/* Left: logo + links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link
            href="/"
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logo.avif"
              alt="Oven AI"
              style={{ width: 32, height: 32, borderRadius: 10, objectFit: 'cover' }}
            />
            <span
              style={{
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: '-0.01em',
                color: 'white',
              }}
            >
              Oven
            </span>
          </Link>

          <div
            style={{
              display: 'flex',
              gap: 24,
              fontSize: 14,
              color: 'rgba(255,255,255,0.7)',
            }}
            className="hidden md:flex"
          >
            {NAV_LINKS.map(({ label, href }) => {
              const active = pathname === href || (href === '/main' && pathname?.startsWith('/main')) || (href === '/library' && pathname?.startsWith('/library'))
              return (
                <Link
                  key={label}
                  href={href}
                  style={{
                    color: active ? 'white' : 'rgba(255,255,255,0.7)',
                    transition: 'color .2s',
                    fontWeight: active ? 500 : 400,
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = 'white')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = active
                      ? 'white'
                      : 'rgba(255,255,255,0.7)')
                  }
                >
                  {label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Right: auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isSignedIn ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 100,
                padding: '6px 12px',
              }}
            >
              <button
                onClick={() => router.push('/pricing')}
                style={{
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: 'none',
                  fontFamily: 'inherit',
                }}
              >
                {points !== null ? `${points} pts` : '…'}
              </button>
              <div
                style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.2)' }}
              />
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-7 h-7',
                  },
                }}
              />
            </div>
          ) : (
            <SignInButton mode="modal">
              <button
                style={{
                  background: 'linear-gradient(180deg, #3B82F6, #2563EB)',
                  color: 'white',
                  padding: '10px 18px',
                  borderRadius: 100,
                  fontSize: 13.5,
                  fontWeight: 500,
                  boxShadow:
                    '0 4px 12px rgba(37,99,235,0.4), inset 0 1px 0 rgba(255,255,255,0.25)',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: 'none',
                  fontFamily: 'inherit',
                }}
              >
                Get Started
              </button>
            </SignInButton>
          )}
        </div>
      </nav>
    </div>
  )
}
