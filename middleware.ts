import { NextResponse } from 'next/server'
import { authMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from 'next/server'

// Handle redirects before auth
function handleRedirects(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = new URL(request.url)

  // Don't redirect API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // non-www to www redirect
  if (hostname === 'oveners.com') {
    url.protocol = 'https'
    url.host = 'www.oveners.com'
    return NextResponse.redirect(url, 301) // 301 영구 리다이렉트
  }

  // Root path to landing page redirect
  if (hostname === 'www.oveners.com' && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/landing', request.url), 301) // 301 영구 리다이렉트
  }

  return NextResponse.next()
}

// Handle redirects after successful authentication
function handleAuthRedirects(auth: any, req: NextRequest) {
  // If the user just signed in/up (check for auth callback in URL)
  if (req.nextUrl.searchParams.has('__clerk_status')) {
    return NextResponse.redirect(new URL('https://www.oveners.com/main'), 301) // www 도메인 사용
  }

  return NextResponse.next()
}

// Combine with Clerk's auth middleware
export default authMiddleware({
  beforeAuth: (req) => {
    return handleRedirects(req)
  },
  afterAuth: (auth, req) => {
    // Handle post-authentication redirects
    return handleAuthRedirects(auth, req)
  },
  // Public routes that don't require authentication
  publicRoutes: [
    '/',
    '/landing',
    '/framer-landing.html',
    '/api/stripe-webhook',
    '/sign-in',
    '/sign-up',
  ],
  ignoredRoutes: [
    '/api/stripe-webhook',
  ]
});

// Update config to include all necessary patterns
export const config = {
  matcher: [
    '/((?!_next|api/stripe-webhook|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    "/(api|trpc)/((?!stripe-webhook).)*$",
  ],
};