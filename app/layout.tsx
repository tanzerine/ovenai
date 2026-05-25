import type { Metadata } from 'next'
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import MainLayout from '@/components/MainLayout'
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' })
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

const BASE_URL = 'https://www.oveners.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Oven AI — 3D Icon Generator',
    template: '%s | Oven AI',
  },
  description:
    'Create stunning 3D icons in seconds. Type a description, pick a style — Oven AI bakes pixel-perfect 3D icons ready for your app, deck, or landing page. Free to start.',
  keywords: [
    '3D icon generator',
    'AI icon maker',
    'clay icon',
    'glass icon',
    'generate 3D icons',
    'icon design tool',
    'AI design',
    'background removal',
    'Oven AI',
    'free icon generator',
  ],
  authors: [{ name: 'Oven AI', url: BASE_URL }],
  creator: 'Oven AI',
  publisher: 'Oven AI',
  openGraph: {
    title: 'Oven AI — Create Stunning 3D Icons in Seconds',
    description:
      'Type a word. Pick a style. Oven bakes a pixel-perfect 3D icon in seconds — ready to drop into your deck, app or landing page.',
    url: BASE_URL,
    siteName: 'Oven AI',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Oven AI 3D Icon Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oven AI — 3D Icon Generator',
    description:
      'Create professional 3D icons for your projects in seconds. Free to start, no card required.',
    images: ['/og-image.png'],
    creator: '@oveners',
  },
  alternates: { canonical: BASE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'Oven AI',
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
      sameAs: ['https://twitter.com/oveners'],
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'Oven AI',
      publisher: { '@id': `${BASE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_URL}/generate?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Oven AI',
      operatingSystem: 'Web',
      applicationCategory: 'DesignApplication',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free tier available — 3 icons per day',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '12540',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}>
        <head>
          {/* Google Analytics */}
          <Script
            strategy="afterInteractive"
            src="https://www.googletagmanager.com/gtag/js?id=G-145NLXMVCJ"
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-145NLXMVCJ');
              `,
            }}
          />

          {/* JSON-LD structured data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </head>
        <body className="antialiased">
          <MainLayout>
            <Analytics />
            {children}
          </MainLayout>
        </body>
      </html>
    </ClerkProvider>
  )
}
