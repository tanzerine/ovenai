import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '3D Icon Library — 1,800+ Baked & Ready',
  description:
    'Browse 1,800+ pre-baked 3D icons across 9 style packs (Clay, Glass, Liquid Chrome, Soft Plush, Polished Metal, Glossy Plastic, Paper Craft, Voxel). Free for personal use, commercial license on paid plans. PNG, SVG, GLB.',
  alternates: { canonical: 'https://www.oveners.com/library' },
  openGraph: {
    title: 'Oven AI 3D Icon Library — 1,800+ Icons Ready to Ship',
    description:
      'Curated 3D icons in 9 cohesive style packs. Drag straight into Figma, or remix into your own pack. PNG, SVG and GLB downloads.',
    url: 'https://www.oveners.com/library',
    type: 'website',
  },
}

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return children
}
