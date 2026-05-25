import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/landing',
  '/pricing',
  '/blog',
  '/blog/(.*)',
  '/feedback',
  '/api/stripe-webhook',
  '/sign-in(.*)',
  '/sign-up(.*)',
])

function handleRedirects(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = new URL(request.url)

  if (request.nextUrl.pathname.startsWith('/api')) return null

  // Redirect bare domain to www
  if (hostname === 'oveners.com') {
    url.protocol = 'https'
    url.host = 'www.oveners.com'
    return NextResponse.redirect(url, 301)
  }

  // /landing → / (301 permanent)
  if (request.nextUrl.pathname === '/landing') {
    return NextResponse.redirect(new URL('/', request.url), 301)
  }

  return null
}

export default clerkMiddleware(async (auth, request) => {
  const redirect = handleRedirects(request)
  if (redirect) return redirect

  // After Clerk sign-in, redirect to /main
  if (request.nextUrl.searchParams.has('__clerk_status')) {
    return NextResponse.redirect(new URL('https://www.oveners.com/main', request.url), 301)
  }

  if (!isPublicRoute(request)) {
    const { userId } = await auth()
    if (!userId) {
      const signInUrl = new URL(
        process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? 'https://accounts.clerk.dev/sign-in',
        request.url
      )
      signInUrl.searchParams.set('redirect_url', request.url)
      return NextResponse.redirect(signInUrl)
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|api/stripe-webhook|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|avif|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)/((?!stripe-webhook).)*$',
  ],
}
