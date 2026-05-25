import type { Metadata } from 'next'
import LandingPage from '@/components/landing/LandingPage'

export const metadata: Metadata = {
  title: 'Oven AI — Create 3D Icons with One Click',
  description:
    'Type a word. Pick a style. Oven bakes a pixel-perfect 3D icon in seconds — ready to drop into your deck, app or landing page. Free during beta, no card required.',
  alternates: { canonical: 'https://www.oveners.com' },
  openGraph: {
    title: 'Oven AI — Create 3D Icons with One Click',
    description:
      'Type a word. Pick a style. Oven bakes pixel-perfect 3D icons in seconds. Free to start.',
    url: 'https://www.oveners.com',
    type: 'website',
  },
}

export default function Home() {
  return <LandingPage />
}
