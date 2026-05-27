import type { Metadata } from 'next'
import LandingPage from '@/components/landing/LandingPage'

export const metadata: Metadata = {
  title: 'Free 3D Icon Generator — Oven AI',
  description:
    'Free 3D icon generator. Type a word, pick a style — Oven AI bakes pixel-perfect 3D icons (PNG, SVG, GLB) in 6 seconds. 1,800+ ready-made icons across 9 style packs. No card required.',
  alternates: { canonical: 'https://www.oveners.com' },
  openGraph: {
    title: 'Free 3D Icon Generator — Oven AI',
    description:
      'Type a word. Pick a style. Oven bakes pixel-perfect 3D icons in 6 seconds. Free to start, no card required.',
    url: 'https://www.oveners.com',
    type: 'website',
  },
}

export default function Home() {
  return <LandingPage />
}
