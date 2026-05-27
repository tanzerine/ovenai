import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Generate a 3D Icon — Oven AI',
  description:
    'Type a description, pick a style pack, and bake a pixel-perfect 3D icon in 6 seconds. PNG, SVG and GLB exports. Sign in to start generating — free for 15 icons per month.',
  alternates: { canonical: 'https://www.oveners.com/main' },
  openGraph: {
    title: 'Generate a 3D Icon — Oven AI',
    description:
      'Type a word. Pick a style. Bake a 3D icon in 6 seconds. Free for 15 icons per month.',
    url: 'https://www.oveners.com/main',
    type: 'website',
  },
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return children
}
