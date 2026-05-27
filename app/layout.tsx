import type { Metadata } from 'next'
import { Instrument_Serif } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import MainLayout from '@/components/MainLayout'
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'

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
    default: 'Oven AI — Free 3D Icon Generator',
    template: '%s | Oven AI',
  },
  description:
    'Free 3D icon generator. Type a description, pick a style — Oven AI bakes pixel-perfect 3D icons (PNG, SVG, GLB) in about 6 seconds. 1,800+ ready-made icons in nine style packs. Start free, no card required.',
  keywords: [
    '3D icon generator',
    'AI 3D icon generator',
    'free 3D icon generator',
    'AI icon maker',
    '3D icon maker',
    'clay icon generator',
    'glass icon generator',
    'liquid chrome icon',
    '3D icon library',
    'icon design tool',
    'background removal',
    'Oven AI',
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
      alternateName: ['Oven', 'Oveners'],
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
      description:
        'Oven AI is a web-based 3D icon generator for designers and developers. Not a kitchen appliance.',
      sameAs: ['https://twitter.com/oveners'],
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'Oven AI',
      description: 'Free 3D icon generator — type a word, get a pixel-perfect 3D icon in seconds.',
      publisher: { '@id': `${BASE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${BASE_URL}/library?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${BASE_URL}/#software`,
      name: 'Oven AI',
      url: BASE_URL,
      operatingSystem: 'Web Browser',
      applicationCategory: 'DesignApplication',
      applicationSubCategory: '3D Icon Generator',
      description:
        'Free 3D icon generator. Generate cohesive 3D icons in PNG, SVG and GLB from a text prompt. Nine style packs (Clay, Glass, Liquid Chrome, Soft Plush, Polished Metal, Glossy Plastic, Paper Craft, Voxel).',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free tier — 15 icons per month. Paid plans from Starter to Enterprise.',
      },
      featureList: [
        'Text-to-3D-icon generation',
        'Nine consistent style packs',
        'PNG / SVG / GLB / APNG export',
        'Background removal',
        'Commercial license on paid plans',
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${BASE_URL}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Oven AI?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Oven AI is a free 3D icon generator. You type a description, pick a style pack, and it produces a pixel-perfect 3D icon in about six seconds. It is a web app — not a kitchen appliance.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I generate a 3D icon with Oven AI?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Open the Oven AI app, type a description (for example "shopping cart" or "trophy"), pick a style pack such as Clay or Glass, and click Bake. Your icon is ready in about six seconds and can be downloaded as PNG, SVG, GLB, or APNG.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is Oven AI free?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. The free plan includes 15 icons per month for personal use. Paid plans (Starter, Studio, Enterprise) add more renders, background removal, style memory, and a commercial license.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I use Oven AI icons commercially?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, on paid plans. Paid plans include a commercial license — use the icons in client work, products, and decks with no attribution required.',
          },
        },
        {
          '@type': 'Question',
          name: 'What file formats does Oven AI export?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'PNG up to 2048px with transparent background, SVG flat fallback, GLB 3D mesh for three.js / react-three-fiber / Blender, and APNG 360° turntable loops.',
          },
        },
      ],
    },
    {
      '@type': 'HowTo',
      '@id': `${BASE_URL}/#howto`,
      name: 'How to generate a 3D icon with Oven AI',
      description: 'Generate a cohesive 3D icon from a text prompt in under a minute.',
      totalTime: 'PT1M',
      tool: { '@type': 'HowToTool', name: 'Oven AI web app' },
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Open Oven AI',
          text: 'Open https://www.oveners.com and click Bake an icon.',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Describe the icon',
          text: 'Type a short description such as "shopping cart" or "piggy bank".',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Pick a style pack',
          text: 'Choose from Clay, Glass, Liquid Chrome, Soft Plush, Polished Metal, Glossy Plastic, Paper Craft, or Voxel.',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Bake',
          text: 'Click Bake. The icon renders in about six seconds.',
        },
        {
          '@type': 'HowToStep',
          position: 5,
          name: 'Download',
          text: 'Download in PNG, SVG, GLB, or APNG. Use commercially on a paid plan.',
        },
      ],
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable}`}>
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
