import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/landing',
  '/framer-landing.html',
  '/api/stripe-webhook',
  '/sign-in(.*)',
  '/sign-up(.*)',
])

function handleRedirects(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = new URL(request.url)

  if (request.nextUrl.pathname.startsWith('/api')) {
    return null
  }

  if (hostname === 'oveners.com') {
    url.protocol = 'https'
    url.host = 'www.oveners.com'
    return NextResponse.redirect(url, 301)
  }

  if (hostname === 'www.oveners.com' && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/landing', request.url), 301)
  }

  return null
}

export default clerkMiddleware(async (auth, request) => {
  const redirect = handleRedirects(request)
  if (redirect) return redirect

  if (request.nextUrl.searchParams.has('__clerk_status')) {
    return NextResponse.redirect(new URL('https://www.oveners.com/main'), 301)
  }

  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|api/stripe-webhook|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    "/(api|trpc)/((?!stripe-webhook).)*$",
  ],
}
