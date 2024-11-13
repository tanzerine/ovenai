// middleware.ts
import { NextResponse } from 'next/server'
import { authMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from 'next/server'

// Handle redirects before auth
function handleRedirects(request: NextRequest) {
  // Don't redirect API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Handle redirects for other routes
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/landing', request.url))
  }

  return NextResponse.next()
}

// Handle redirects after successful authentication
function handleAuthRedirects(auth: any, req: NextRequest) {
  // If the user just signed in/up (check for auth callback in URL)
  if (req.nextUrl.searchParams.has('__clerk_status')) {
    return NextResponse.redirect(new URL('https://oveners.com/main'))
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
    '/api/stripe-webhook',  // Keep in public routes
    '/sign-in',
    '/sign-up',
  ],
  ignoredRoutes: [
    '/api/stripe-webhook', // Completely bypass Clerk for webhook
  ]
});

// Update config to include all necessary patterns
export const config = {
  matcher: [
    // Skip Next.js internals, static files, and the stripe webhook
    '/((?!_next|api/stripe-webhook|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Run for API routes except stripe webhook
    "/(api|trpc)/((?!stripe-webhook).)*$",
  ],
};

/yeah ~~ !!!/