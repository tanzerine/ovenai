// [middleware.ts]
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

// Combine with Clerk's auth middleware
export default authMiddleware({
  beforeAuth: (req) => {
    return handleRedirects(req)
  },
  // Public routes that don't require authentication
  publicRoutes: [
    '/',
    '/landing',
    '/api/webhook',
    '/api/stripe-webhook',
    '/framer-landing.html',
    // Add any other public routes here
  ],
});

// Update config to include all necessary patterns
export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
